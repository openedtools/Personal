import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../db/supabaseClient';
import { db } from '../db/localDb';
import { syncNow, migrateGuestData } from '../db/syncManager';
import type { SyncState } from '../db/syncManager';
import { calculateReadiness } from '../utils/masteryMath';

interface AppContextType {
  user: any | null;
  loading: boolean;
  syncState: SyncState;
  syncError: string | null;
  overallReadiness: number;
  domainReadiness: Record<string, number>;
  dueReviewsCount: number;
  triggerSync: () => Promise<void>;
  reloadMetrics: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('local-only');
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const [overallReadiness, setOverallReadiness] = useState(0);
  const [domainReadiness, setDomainReadiness] = useState<Record<string, number>>({});
  const [dueReviewsCount, setDueReviewsCount] = useState(0);

  // 1. Listen for Supabase Auth changes
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setSyncState('synced');
        // Run initial sync
        performSync();
      } else {
        setUser(null);
        setSyncState('local-only');
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event);
      if (session?.user) {
        setUser(session.user);
        setSyncState('synced');
        
        // If they just logged in or registered, migrate any guest data
        if (event === 'SIGNED_IN') {
          await migrateGuestData(session.user.id);
        } else {
          await performSync();
        }
      } else {
        setUser(null);
        setSyncState('local-only');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Perform database sync
  const performSync = async () => {
    if (!supabase || !user) return;
    setSyncState('syncing');
    setSyncError(null);
    const result = await syncNow();
    if (result.success) {
      setSyncState('synced');
      await reloadMetrics();
    } else {
      setSyncState('error');
      setSyncError(result.error || 'Unknown sync error');
    }
  };

  // 3. Recalculate Mastery metrics and Due reviews
  const reloadMetrics = async () => {
    try {
      const activeUserId = user?.id || null;
      
      // Load current user's mastery snapshots
      // In local DB, guest has user_id = null. Signed in user has user_id = user.id.
      const snapshots = await db.masterySnapshots
        .filter(s => s.user_id === activeUserId)
        .toArray();
      
      const domains = await db.domains.toArray();
      const objectives = await db.objectives.toArray();

      if (snapshots.length > 0 && domains.length > 0 && objectives.length > 0) {
        const { domainScores, overallReadiness: oReadiness } = calculateReadiness(
          snapshots,
          domains,
          objectives
        );
        setDomainReadiness(domainScores);
        setOverallReadiness(oReadiness);
      } else {
        // If user logged in has no snapshots yet, copy defaults with their user ID
        if (activeUserId && snapshots.length === 0 && objectives.length > 0) {
          const newSnaps = objectives.map(obj => ({
            objective_id: obj.objective_id,
            accuracy: 0,
            consistency: 0,
            confidence: 0,
            recency: 0,
            variety: 0,
            speed: 0,
            score: 0,
            label: 'Not Started' as const,
            next_review_at: null,
            updated_at: new Date().toISOString(),
            user_id: activeUserId,
          }));
          await db.masterySnapshots.bulkAdd(newSnaps);
          // Reload
          const snaps = await db.masterySnapshots.filter(s => s.user_id === activeUserId).toArray();
          const { domainScores, overallReadiness: oReadiness } = calculateReadiness(
            snaps,
            domains,
            objectives
          );
          setDomainReadiness(domainScores);
          setOverallReadiness(oReadiness);
        }
      }

      // Calculate Spaced Review Due Count
      const nowStr = new Date().toISOString();
      const dueCount = await db.masterySnapshots
        .filter(s => s.user_id === activeUserId && s.next_review_at !== null && s.next_review_at <= nowStr)
        .count();
      setDueReviewsCount(dueCount);

    } catch (err) {
      console.error('Error reloading metrics:', err);
    }
  };

  // Reload metrics whenever user logins/changes
  useEffect(() => {
    reloadMetrics();
  }, [user]);

  // Trigger sync manually
  const triggerSync = async () => {
    await performSync();
  };

  // Sign out helper
  const signOutUser = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSyncState('local-only');
    await reloadMetrics();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        loading,
        syncState,
        syncError,
        overallReadiness,
        domainReadiness,
        dueReviewsCount,
        triggerSync,
        reloadMetrics,
        signOutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
