import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  ArrowRight,
  TrendingDown,
  BookOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { db } from '../db/localDb';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    syncState, 
    syncError, 
    triggerSync, 
    overallReadiness, 
    domainReadiness,
    dueReviewsCount 
  } = useApp();

  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  // 1. Fetch data reactively from Dexie
  const activeUserId = user?.id || null;

  const domains = useLiveQuery(() => db.domains.toArray()) || [];
  const objectives = useLiveQuery(() => db.objectives.toArray()) || [];
  
  const masterySnapshots = useLiveQuery(
    () => activeUserId
      ? db.masterySnapshots.where('user_id').equals(activeUserId).toArray()
      : db.masterySnapshots.filter(s => s.user_id === null).toArray(),
    [activeUserId]
  ) || [];

  const recentSessions = useLiveQuery(
    () => activeUserId
      ? db.sessions.where('user_id').equals(activeUserId).toArray()
      : db.sessions.filter(s => s.user_id === null).toArray(),
    [activeUserId]
  ) || [];

  const totalAttemptsCount = useLiveQuery(
    () => activeUserId
      ? db.attempts.where('user_id').equals(activeUserId).count()
      : db.attempts.filter(a => a.user_id === null).count(),
    [activeUserId]
  ) || 0;

  // Sorted recent sessions (limit 5)
  const sortedSessions = [...recentSessions]
    .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    .slice(0, 5);

  // Identify weak areas (Proficiency < 70%, score > 0)
  const weakObjectives = masterySnapshots
    .filter(m => m.score < 70 && m.score > 0)
    .sort((a, b) => a.score - b.score)
    .slice(0, 4);

  // Objectives due for review
  const nowStr = new Date().toISOString();
  const dueSnapshots = masterySnapshots
    .filter(m => m.next_review_at !== null && m.next_review_at <= nowStr)
    .slice(0, 4);

  const handleSyncClick = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    await triggerSync();
    setIsSyncing(false);
  };

  // Helper to color code mastery scores
  const getMasteryColorClass = (score: number) => {
    if (score === 0) return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    if (score < 35) return 'text-red-400 bg-red-500/10 border-red-500/20';
    if (score < 55) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    if (score < 70) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    if (score < 85) return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
    if (score < 95) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
  };

  const getMasteryProgressColor = (score: number) => {
    if (score < 35) return 'bg-red-500';
    if (score < 55) return 'bg-orange-500';
    if (score < 70) return 'bg-amber-500';
    if (score < 85) return 'bg-yellow-500';
    if (score < 95) return 'bg-blue-500';
    return 'bg-emerald-500';
  };

  // Calculate overall progress ring metrics
  const strokeRadius = 70;
  const strokeCircumference = 2 * Math.PI * strokeRadius;
  const strokeOffset = strokeCircumference - (overallReadiness / 100) * strokeCircumference;

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      {/* Header Banner */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl text-white">
            Welcome, {user ? user.email.split('@')[0] : 'Study Guest'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your objective-level mastery for the CompTIA Security+ SY0-701 exam.
          </p>
        </div>

        {/* Sync Controls Widget */}
        <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col text-right">
            <span className="text-xs font-semibold text-slate-300">
              {syncState === 'synced' ? 'Progress Synced' : syncState === 'syncing' ? 'Syncing...' : 'Local Only'}
            </span>
            <span className="text-[10px] text-slate-500">
              {user ? 'Cloud integration' : 'Login to save backup'}
            </span>
          </div>

          <button
            onClick={handleSyncClick}
            disabled={!user || isSyncing}
            className={`p-2 rounded-xl border border-slate-800 bg-slate-900 transition-all ${
              !user ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-800 active:scale-95'
            }`}
          >
            <RefreshCw className={`w-4 h-4 text-indigo-400 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
          </button>
        </div>
      </header>

      {/* Sync Error Alert */}
      {syncState === 'error' && syncError && (
        <div className="bg-red-950/40 border border-red-900/60 p-4 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-bold text-red-400">Sync Problem Detected</h4>
            <p className="text-xs text-red-500 mt-1">{syncError}</p>
          </div>
        </div>
      )}

      {/* Hero Readiness Panel */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/40 p-6 rounded-3xl border border-slate-800/80 shadow-premium">
        {/* Readiness Dial */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-800 pb-6 lg:pb-0 lg:pr-6">
          <div className="relative w-40 h-40">
            {/* Background circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r={strokeRadius}
                className="stroke-slate-800 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="80"
                cy="80"
                r={strokeRadius}
                className="stroke-indigo-600 fill-none progress-ring-circle"
                strokeWidth="10"
                strokeDasharray={strokeCircumference}
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display font-extrabold text-4xl text-slate-200 tracking-tight">
                {overallReadiness}%
              </span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">
                Readiness
              </span>
            </div>
          </div>
          <span className="mt-4 text-xs font-semibold text-slate-400 text-center px-4">
            Domain weight-adjusted score. Target 85%+ for exam readiness.
          </span>
        </div>

        {/* Global Progress Indicators */}
        <div className="lg:col-span-8 flex flex-col justify-center gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
              <span className="text-slate-500 text-xs font-semibold">Total Practice Questions</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-200">{totalAttemptsCount}</span>
                <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">attempts</span>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/50">
              <span className="text-slate-500 text-xs font-semibold">Scheduled Due Reviews</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-amber-500">{dueReviewsCount}</span>
                <span className="text-[10px] text-amber-500/20 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">objectives</span>
              </div>
            </div>
          </div>

          {/* Quickstart Action buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/quiz"
              className="flex-1 min-w-[200px] flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Start Quick Practice</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            {dueReviewsCount > 0 && (
              <Link
                to="/quiz"
                state={{ mode: 'due_reviews' }}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-2 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-amber-400 font-semibold py-3 px-5 rounded-2xl transition-all"
              >
                <Clock className="w-4 h-4" />
                <span>Review Due Areas ({dueReviewsCount})</span>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Main Grid: Domains & Weak/Due details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Domains Mastery Accordion */}
        <section className="lg:col-span-7 space-y-4">
          <h3 className="font-display font-bold text-lg text-white">Domain Readiness</h3>

          <div className="space-y-3">
            {domains.map((dom) => {
              const score = domainReadiness[dom.id] || 0;
              const isExpanded = expandedDomain === dom.id;
              const domObjectives = objectives.filter(o => o.domain_id === dom.id);

              return (
                <div 
                  key={dom.id}
                  className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-sm transition-all duration-300"
                >
                  <div 
                    onClick={() => setExpandedDomain(isExpanded ? null : dom.id)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-slate-800 text-slate-400 font-bold px-2 py-0.5 rounded-full">
                          {dom.id} - {(dom.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1 truncate">{dom.name}</h4>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-lg font-bold text-white">{score}%</span>
                        <div className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">mastery</div>
                      </div>
                      <span className="text-slate-600 text-lg">{isExpanded ? '−' : '+'}</span>
                    </div>
                  </div>

                  {/* Horizontal progress bar */}
                  <div className="w-full bg-slate-900 rounded-full h-1.5 mt-3 overflow-hidden">
                    <div 
                      className={`h-full ${getMasteryProgressColor(score)} transition-all duration-500`}
                      style={{ width: `${score}%` }}
                    />
                  </div>

                  {/* Expanded objectives list */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/50 space-y-3 animate-fadeIn">
                      {domObjectives.map(obj => {
                        const snap = masterySnapshots.find(s => s.objective_id === obj.objective_id);
                        const objScore = snap ? snap.score : 0;
                        const objLabel = snap ? snap.label : 'Not Started';

                        return (
                          <div key={obj.objective_id} className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-xl border border-slate-900/60">
                            <div className="flex-1 min-w-0 pr-4">
                              <span className="text-[10px] text-slate-500 font-bold">{obj.objective_id}</span>
                              <p className="text-xs font-semibold text-slate-300 truncate">{obj.title}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getMasteryColorClass(objScore)}`}>
                                {objScore > 0 ? `${objScore}% (${objLabel})` : 'Not Started'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Side: Weakest Areas & Due Reviews */}
        <section className="lg:col-span-5 space-y-6">
          {/* Weak Areas Panel */}
          {weakObjectives.length > 0 && (
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                <h3 className="font-display font-bold text-sm uppercase text-slate-400 tracking-wider">Weakest Objectives</h3>
              </div>

              <div className="space-y-3">
                {weakObjectives.map(weak => {
                  const obj = objectives.find(o => o.objective_id === weak.objective_id);
                  return (
                    <div key={weak.objective_id} className="flex items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-500 font-bold">{weak.objective_id}</span>
                        <h4 className="text-xs font-bold text-slate-300 truncate">{obj?.title}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2.5 py-0.5 rounded-full border border-red-500/20">
                          {weak.score}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Due Reviews Panel */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <h3 className="font-display font-bold text-sm uppercase text-slate-400 tracking-wider">Upcoming Reviews</h3>
            </div>

            {dueSnapshots.length > 0 ? (
              <div className="space-y-3">
                {dueSnapshots.map(due => {
                  const obj = objectives.find(o => o.objective_id === due.objective_id);
                  return (
                    <div key={due.objective_id} className="flex items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-500 font-bold">{due.objective_id}</span>
                        <h4 className="text-xs font-bold text-slate-300 truncate">{obj?.title}</h4>
                      </div>
                      <div>
                        <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">
                          DUE NOW
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                <CheckCircle className="w-8 h-8 text-emerald-500/80 mx-auto" />
                <p className="text-slate-400 text-xs font-medium mt-2">All reviews are up to date! Perfect.</p>
              </div>
            )}
          </div>

          {/* Recent Quiz History */}
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="font-display font-bold text-sm uppercase text-slate-400 tracking-wider">Recent Quizzes</h3>
            </div>

            {sortedSessions.length > 0 ? (
              <div className="space-y-3">
                {sortedSessions.map(session => (
                  <div key={session.session_id} className="flex items-center justify-between bg-slate-900/50 p-3 rounded-xl border border-slate-800/40">
                    <div>
                      <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full capitalize font-semibold">
                        {session.mode}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(session.started_at).toLocaleDateString()} at{' '}
                        {new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {session.ended_at ? (
                      <span className="text-[10px] text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-[10px] text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-full font-bold animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                <p className="text-slate-500 text-xs font-medium">No quiz attempts recorded yet.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
export default Dashboard;
