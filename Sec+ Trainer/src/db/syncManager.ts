import { supabase } from './supabaseClient';
import { db } from './localDb';

export type SyncState = 'local-only' | 'syncing' | 'synced' | 'error';

const TABLE_MAP: Record<string, { remote: string; pk: string }> = {
  sessions: { remote: 'sessions', pk: 'session_id' },
  attempts: { remote: 'attempts', pk: 'attempt_id' },
  masterySnapshots: { remote: 'mastery_snapshots', pk: 'objective_id' },
  resources: { remote: 'resources', pk: 'resource_id' },
  mistakeJournal: { remote: 'mistake_journal', pk: 'journal_id' },
};

// Queue helper to track local changes
export async function queueLocalChange(
  tableName: string,
  recordId: string,
  action: 'insert' | 'update' | 'delete',
  payload: any
) {
  try {
    const timestamp = new Date().toISOString();
    // Add to local Dexie sync queue
    await db.syncQueue.add({
      table_name: tableName,
      record_id: recordId,
      action,
      payload,
      timestamp,
    });
    
    // Attempt background sync immediately (non-blocking)
    triggerSyncBackground();
  } catch (error) {
    console.error('Error queuing local change:', error);
  }
}

// Simple non-blocking background sync trigger
let isSyncingInBackground = false;
function triggerSyncBackground() {
  if (isSyncingInBackground) return;
  isSyncingInBackground = true;
  
  syncNow()
    .catch(err => console.log('Background sync skipped:', err.message))
    .finally(() => {
      isSyncingInBackground = false;
    });
}

// Master Sync Function
export async function syncNow(): Promise<{ success: boolean; count: number; error?: string }> {
  if (!supabase) {
    return { success: false, count: 0, error: 'Supabase client not initialized' };
  }

  // Get authenticated user
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, count: 0, error: 'User not signed in' };
  }

  try {
    console.log('Initiating database sync for user:', userId);
    
    // 1. Process local mutations (Push)
    const queueItems = await db.syncQueue.toArray();
    let pushCount = 0;

    for (const item of queueItems) {
      const mapping = TABLE_MAP[item.table_name];
      if (!mapping) {
        console.warn(`Unknown sync table: ${item.table_name}`);
        continue;
      }

      // Ensure user_id matches authenticated user on push payloads
      const payload = { ...item.payload, user_id: userId, updated_at: new Date().toISOString() };

      if (item.action === 'insert' || item.action === 'update') {
        const { error: pushError } = await supabase
          .from(mapping.remote)
          .upsert(payload);

        if (pushError) {
          throw new Error(`Push failed for ${item.table_name}: ${pushError.message}`);
        }
      } else if (item.action === 'delete') {
        const { error: deleteError } = await supabase
          .from(mapping.remote)
          .delete()
          .eq(mapping.pk, item.record_id)
          .eq('user_id', userId);

        if (deleteError) {
          throw new Error(`Delete failed for ${item.table_name}: ${deleteError.message}`);
        }
      }

      // Clear synced item from queue
      await db.syncQueue.delete(item.id!);
      pushCount++;
    }

    // 2. Fetch remote modifications (Pull)
    const lastSyncedKey = `last_synced_at_${userId}`;
    const lastSyncedAt = localStorage.getItem(lastSyncedKey) || '1970-01-01T00:00:00.000Z';
    const newSyncStart = new Date().toISOString();
    let pullCount = 0;

    for (const [localTable, mapping] of Object.entries(TABLE_MAP)) {
      const { data: remoteRecords, error: pullError } = await supabase
        .from(mapping.remote)
        .select('*')
        .eq('user_id', userId)
        .gt('updated_at', lastSyncedAt);

      if (pullError) {
        throw new Error(`Pull failed for ${mapping.remote}: ${pullError.message}`);
      }

      if (!remoteRecords || remoteRecords.length === 0) continue;

      const localTableRef = (db as any)[localTable];
      if (!localTableRef) continue;

      for (const remoteRec of remoteRecords) {
        // Map underscore field keys back to camelCase for local DB if necessary
        const localRec = { ...remoteRec };
        
        // Retrieve local record if exists to resolve conflict
        const pkValue = remoteRec[mapping.pk];
        const existingLocal = await localTableRef.get(pkValue);

        if (existingLocal) {
          // Conflict Resolution: Latest updated_at wins
          const remoteTime = new Date(remoteRec.updated_at).getTime();
          const localTime = new Date(existingLocal.updated_at || 0).getTime();
          
          if (remoteTime >= localTime) {
            await localTableRef.put(localRec);
            pullCount++;
          }
        } else {
          // No conflict, just insert locally
          await localTableRef.put(localRec);
          pullCount++;
        }
      }
    }

    // Update last synced timestamp
    localStorage.setItem(lastSyncedKey, newSyncStart);

    // 3. Log Sync Event
    const syncEvent = {
      event_id: crypto.randomUUID(),
      user_id: userId,
      direction: 'sync' as const,
      status: 'success' as const,
      records_synced: pushCount + pullCount,
      timestamp: newSyncStart,
      error_message: null,
    };
    await db.syncEvents.add(syncEvent);
    await supabase.from('sync_events').insert(syncEvent);

    console.log(`Sync completed: pushed ${pushCount}, pulled ${pullCount}`);
    return { success: true, count: pushCount + pullCount };

  } catch (error: any) {
    console.error('Database sync error:', error);
    
    // Log Sync Failure Event locally
    try {
      await db.syncEvents.add({
        event_id: crypto.randomUUID(),
        user_id: userId,
        direction: 'sync',
        status: 'error',
        records_synced: 0,
        timestamp: new Date().toISOString(),
        error_message: error.message,
      });
    } catch (dbErr) {
      console.error('Failed to log sync error in local DB:', dbErr);
    }
    
    return { success: false, count: 0, error: error.message };
  }
}

// Guest data migration upon login/signup
export async function migrateGuestData(userId: string) {
  console.log('Migrating guest/offline session data to user account:', userId);
  
  try {
    await db.transaction('rw', [db.sessions, db.attempts, db.masterySnapshots, db.resources, db.mistakeJournal, db.syncQueue], async () => {
      // 1. Sessions
      const guestSessions = await db.sessions.filter(s => s.user_id === '' || s.user_id === null).toArray();
      for (const session of guestSessions) {
        session.user_id = userId;
        session.updated_at = new Date().toISOString();
        await db.sessions.put(session);
        await db.syncQueue.add({
          table_name: 'sessions',
          record_id: session.session_id,
          action: 'insert',
          payload: session,
          timestamp: new Date().toISOString(),
        });
      }

      // 2. Attempts
      const guestAttempts = await db.attempts.filter(a => a.user_id === '' || a.user_id === null).toArray();
      for (const attempt of guestAttempts) {
        attempt.user_id = userId;
        attempt.updated_at = new Date().toISOString();
        await db.attempts.put(attempt);
        await db.syncQueue.add({
          table_name: 'attempts',
          record_id: attempt.attempt_id,
          action: 'insert',
          payload: attempt,
          timestamp: new Date().toISOString(),
        });
      }

      // 3. Mistake Journal
      const guestJournal = await db.mistakeJournal.filter(j => j.user_id === '' || j.user_id === null).toArray();
      for (const journal of guestJournal) {
        journal.user_id = userId;
        journal.updated_at = new Date().toISOString();
        await db.mistakeJournal.put(journal);
        await db.syncQueue.add({
          table_name: 'mistakeJournal',
          record_id: journal.journal_id,
          action: 'insert',
          payload: journal,
          timestamp: new Date().toISOString(),
        });
      }

      // 4. Mastery Snapshots (Sync state of local mastery variables)
      const guestMastery = await db.masterySnapshots.toArray();
      for (const mastery of guestMastery) {
        mastery.user_id = userId;
        mastery.updated_at = new Date().toISOString();
        await db.masterySnapshots.put(mastery);
        await db.syncQueue.add({
          table_name: 'masterySnapshots',
          record_id: mastery.objective_id,
          action: 'update',
          payload: mastery,
          timestamp: new Date().toISOString(),
        });
      }
    });

    console.log('Guest data migration succeeded. Triggering sync...');
    // Run full sync to push the newly queued items to the cloud
    await syncNow();

  } catch (error) {
    console.error('Error during guest data migration:', error);
  }
}
