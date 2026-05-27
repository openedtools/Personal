import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2, 
  Cloud, 
  Lock,
  UserCheck
} from 'lucide-react';
import { supabase } from '../db/supabaseClient';
import { db } from '../db/localDb';
import { useApp } from '../context/AppContext';
import { AppExportSchema } from '../types/schemas';
import { queueLocalChange } from '../db/syncManager';

export const Settings: React.FC = () => {
  const { 
    user, 
    triggerSync, 
    signOutUser,
    reloadMetrics
  } = useApp();

  // Load sync logs from database
  const syncLogs = useLiveQuery(
    () => db.syncEvents.orderBy('timestamp').reverse().limit(5).toArray()
  ) || [];

  // Auth form states
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Backup states
  const [backupMessage, setBackupMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // 1. Authentication Handlers
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    if (!supabase) {
      setAuthError('Supabase is not configured. Real-time sync is unavailable.');
      setAuthLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign Up
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password,
          options: {
            data: { username: username.trim() }
          }
        });
        if (error) throw error;
        alert('Registration successful! Please check your email inbox for a verification link if required, or simply sign in.');
        setIsSignUp(false);
      } else {
        // Sign In
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      console.error('Authentication error:', err);
      setAuthError(err.message || 'Authentication failed. Check credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setAuthError('Supabase is not configured. Real-time sync is unavailable.');
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Google Sign-In Error:', err);
      setAuthError(err.message || 'Google Sign-In failed.');
      setAuthLoading(false);
    }
  };

  // 2. Manual Sync Trigger
  const handleManualSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await triggerSync();
    setIsSyncing(false);
  };

  // 3. Reset Database Handler
  const handleResetDatabase = async () => {
    const confirmed = window.confirm(
      'WARNING: This will permanently delete all your quiz attempts, study history, mistake journal entries, and custom links.\n\nAre you absolutely sure you want to reset your local database?'
    );
    if (!confirmed) return;

    try {
      await db.resetUserProgress();
      await reloadMetrics();
      alert('Local database wiped successfully. All objectives reset to "Not Started".');
    } catch (err) {
      console.error('Error resetting database:', err);
      alert('Failed to reset database.');
    }
  };

  // 4. JSON Export Utility
  const handleExportJSON = async () => {
    setBackupMessage(null);
    try {
      const activeUserId = user?.id || null;

      // Extract tables
      const attempts = await (activeUserId 
        ? db.attempts.where('user_id').equals(activeUserId).toArray() 
        : db.attempts.filter(a => a.user_id === null).toArray());
      const sessions = await (activeUserId 
        ? db.sessions.where('user_id').equals(activeUserId).toArray() 
        : db.sessions.filter(s => s.user_id === null).toArray());
      const mistake_journal = await (activeUserId 
        ? db.mistakeJournal.where('user_id').equals(activeUserId).toArray() 
        : db.mistakeJournal.filter(m => m.user_id === null).toArray());
      const resources = await (activeUserId 
        ? db.resources.where('user_id').equals(activeUserId).toArray() 
        : db.resources.filter(r => r.user_id === null).toArray());
      const mastery_snapshots = await (activeUserId 
        ? db.masterySnapshots.where('user_id').equals(activeUserId).toArray() 
        : db.masterySnapshots.filter(s => s.user_id === null).toArray());

      const exportPayload = {
        version: 1,
        exported_at: new Date().toISOString(),
        attempts,
        sessions,
        mastery_snapshots,
        mistake_journal,
        resources,
      };

      // Generate downloadable blob file
      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sec-plus-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setBackupMessage({ text: 'Backup JSON generated and downloaded successfully.', isError: false });
    } catch (err) {
      console.error('Error exporting backup file:', err);
      setBackupMessage({ text: 'Failed to generate backup JSON.', isError: true });
    }
  };

  // 5. JSON Import Utility (Untrusted validation via Zod)
  const handleImportJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setBackupMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const jsonStr = evt.target?.result as string;
        const parsed = JSON.parse(jsonStr);

        // Zod validation (Strict layout type check)
        const validated = AppExportSchema.safeParse(parsed);
        if (!validated.success) {
          console.warn('Import schema validation failed:', validated.error);
          setBackupMessage({ 
            text: 'Import cancelled: Invalid backup file format. Content failed Zod type integrity checks.', 
            isError: true 
          });
          return;
        }

        const data = validated.data;
        const activeUserId = user?.id || null;

        // Perform merge write inside a transaction
        await db.transaction('rw', [db.attempts, db.sessions, db.masterySnapshots, db.resources, db.mistakeJournal, db.syncQueue], async () => {
          // Sync imported items to current user's profile
          for (const item of data.attempts) {
            const syncedItem = { ...item, user_id: activeUserId };
            await db.attempts.put(syncedItem);
            if (activeUserId) {
              await queueLocalChange('attempts', item.attempt_id, 'insert', syncedItem);
            }
          }
          
          for (const item of data.sessions) {
            const syncedItem = { ...item, user_id: activeUserId };
            await db.sessions.put(syncedItem);
            if (activeUserId) {
              await queueLocalChange('sessions', item.session_id, 'insert', syncedItem);
            }
          }

          for (const item of data.mistake_journal) {
            const syncedItem = { ...item, user_id: activeUserId };
            await db.mistakeJournal.put(syncedItem);
            if (activeUserId) {
              await queueLocalChange('mistakeJournal', item.journal_id, 'insert', syncedItem);
            }
          }

          for (const item of data.resources) {
            const syncedItem = { ...item, user_id: activeUserId };
            await db.resources.put(syncedItem);
            if (activeUserId) {
              await queueLocalChange('resources', item.resource_id, 'insert', syncedItem);
            }
          }

          for (const item of data.mastery_snapshots) {
            const syncedItem = { ...item, user_id: activeUserId };
            await db.masterySnapshots.put(syncedItem);
            if (activeUserId) {
              await queueLocalChange('masterySnapshots', item.objective_id, 'update', syncedItem);
            }
          }
        });

        // Trigger updates in layout
        await reloadMetrics();
        setBackupMessage({ text: 'Data imported and merged successfully!', isError: false });
        // Empty file input
        e.target.value = '';
      } catch (err) {
        console.error('Import processing error:', err);
        setBackupMessage({ text: 'Error reading JSON backup file structure.', isError: true });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6 max-w-3xl mx-auto select-none">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Account & Settings
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage cloud synchronization, profile authentication, and backup your practice progress.
        </p>
      </header>

      {/* 1. Supabase Authentication Panel */}
      <section className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-md">
        {user ? (
          // Signed-in Dashboard
          <div className="space-y-4">
            <div className="flex items-center gap-4 border-b border-slate-900 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-650 flex items-center justify-center text-white">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Active User Account</h3>
                <p className="text-xs text-slate-450 mt-0.5">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleManualSync}
                disabled={isSyncing}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>Sync Now</span>
              </button>

              <button
                onClick={signOutUser}
                className="border border-slate-800 bg-slate-900 hover:bg-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl text-slate-300"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          // Authentication form (Login / Register Toggle)
          <form onSubmit={handleAuth} className="space-y-4 max-w-md">
            <h3 className="font-display font-extrabold text-base text-white">
              {isSignUp ? 'Create Cloud Account' : 'Sign In to Cloud'}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Registering enables real-time progress syncing across your phone and laptop using Supabase.
            </p>

            {authError && (
              <div className="bg-rose-950/40 border border-rose-900/60 p-3 rounded-xl text-xs text-rose-400 font-medium">
                {authError}
              </div>
            )}

            <div className="space-y-3">
              {isSignUp && (
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-500 uppercase">Username</label>
                  <input
                    type="text"
                    placeholder="student1"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase">Email Address</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setAuthError(null);
                  setIsSignUp(!isSignUp);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
              </button>

              <button
                type="submit"
                disabled={authLoading}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2.5 px-5 rounded-xl text-xs shadow-md transition-all disabled:opacity-40"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{authLoading ? 'Connecting...' : isSignUp ? 'Register Account' : 'Sign In'}</span>
              </button>
            </div>

            <div className="relative my-4 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-900"></div>
              </div>
              <span className="relative bg-slate-950 px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-2 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-white text-slate-350 font-bold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-[0.99] disabled:opacity-40"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>Sign in with Google</span>
            </button>
          </form>
        )}
      </section>

      {/* 2. Sync Activity Log Widget */}
      {user && (
        <section className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">Sync Log History</h3>
          </div>

          {syncLogs.length > 0 ? (
            <div className="divide-y divide-slate-900 border-t border-slate-900">
              {syncLogs.map((log) => (
                <div key={log.event_id} className="flex justify-between items-center py-3 text-xs">
                  <div>
                    <span className={`font-bold capitalize ${log.status === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {log.direction} {log.status}
                    </span>
                    {log.error_message && (
                      <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-sm">{log.error_message}</p>
                    )}
                  </div>
                  <span className="text-slate-500 text-[10px] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-600 text-xs italic">No sync logs recorded yet.</p>
          )}
        </section>
      )}

      {/* 3. Export / Import Data Management */}
      <section className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4">
        <h3 className="font-display font-bold text-sm text-slate-200 uppercase tracking-wider">Local Backup (JSON)</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Create complete snapshots of your practice sessions, mistakes logs, and custom references. This guarantees no vendor lock-in and acts as a localized offline backup path.
        </p>

        {backupMessage && (
          <div className={`p-3 rounded-xl border text-xs font-semibold ${
            backupMessage.isError 
              ? 'bg-rose-950/40 border-rose-900/60 text-rose-400' 
              : 'bg-emerald-950/40 border-emerald-900/60 text-emerald-400'
          }`}>
            {backupMessage.text}
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-center pt-2">
          {/* Export button */}
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 hover:text-white text-xs font-bold py-3 px-5 rounded-2xl transition-all"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Export Backup File</span>
          </button>

          {/* Import file input label */}
          <label className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-350 hover:text-white text-xs font-bold py-3 px-5 rounded-2xl cursor-pointer transition-all">
            <Upload className="w-4 h-4 text-indigo-400" />
            <span>Import Backup File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </section>

      {/* 4. Danger Zone */}
      <section className="bg-slate-950 p-6 rounded-3xl border border-red-500/10 shadow-md space-y-4">
        <h3 className="font-display font-bold text-sm text-red-400 uppercase tracking-wider">Danger Zone</h3>
        <p className="text-slate-400 text-xs leading-relaxed">
          Resetting database clears your progress, resets all objective mastery records to zero, and wipes the mistake journal cache. This cannot be undone.
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetDatabase}
            className="flex items-center gap-1.5 bg-red-950/30 hover:bg-red-950/60 border border-red-900/30 hover:border-red-900/60 text-red-400 text-xs font-bold py-3 px-5 rounded-2xl transition-all active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Local Progress</span>
          </button>
        </div>
      </section>
    </div>
  );
};
export default Settings;
