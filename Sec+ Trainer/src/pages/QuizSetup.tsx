import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  Zap, 
  Clock, 
  ListFilter, 
  AlertCircle
} from 'lucide-react';
import { db } from '../db/localDb';
import { useApp } from '../context/AppContext';

export const QuizSetup: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();
  const activeUserId = user?.id || null;

  // 1. Load targets from local DB
  const domains = useLiveQuery(() => db.domains.toArray()) || [];
  const objectives = useLiveQuery(() => db.objectives.toArray()) || [];
  
  // 2. Local State pre-filled from Router Navigation state if present
  const navState = location.state as { mode?: 'domain' | 'objective' | 'weak_areas' | 'due_reviews' | 'mixed'; targetId?: string } | null;

  const [mode, setMode] = useState<'domain' | 'objective' | 'weak_areas' | 'due_reviews' | 'mixed'>(
    navState?.mode || 'mixed'
  );
  const [targetId, setTargetId] = useState<string>(
    navState?.targetId || ''
  );
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [isTimed, setIsTimed] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [matchingQuestionsCount, setMatchingQuestionsCount] = useState<number>(0);

  // Derived selected target ID (handles defaults cleanly without useEffect renders)
  const selectedTargetId = targetId || (
    mode === 'domain' 
      ? (domains[0]?.id || '') 
      : mode === 'objective' 
      ? (objectives[0]?.objective_id || '') 
      : ''
  );

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
    setTargetId('');
  };

  // 3. Calculate matching questions count dynamically
  useEffect(() => {
    const calculateCounts = async () => {
      try {
        let qCollection;

        if (mode === 'domain' && selectedTargetId) {
          qCollection = db.questions.where('domain_id').equals(selectedTargetId);
        } else if (mode === 'objective' && selectedTargetId) {
          qCollection = db.questions.where('objective_id').equals(selectedTargetId);
        } else if (mode === 'weak_areas') {
          // Find objectives with score < 70
          const weakObjIds = (await db.masterySnapshots
            .filter(s => s.user_id === activeUserId && s.score < 70 && s.score > 0)
            .toArray())
            .map(s => s.objective_id);

          if (weakObjIds.length > 0) {
            qCollection = db.questions.filter(q => weakObjIds.includes(q.objective_id));
          } else {
            // Fallback to all if no weak areas recorded yet
            qCollection = db.questions;
          }
        } else if (mode === 'due_reviews') {
          // Find due objectives
          const nowStr = new Date().toISOString();
          const dueObjIds = (await db.masterySnapshots
            .filter(s => s.user_id === activeUserId && s.next_review_at !== null && s.next_review_at <= nowStr)
            .toArray())
            .map(s => s.objective_id);

          if (dueObjIds.length > 0) {
            qCollection = db.questions.filter(q => dueObjIds.includes(q.objective_id));
          } else {
            // Fallback to all if no reviews scheduled
            qCollection = db.questions;
          }
        } else {
          // Mixed block
          qCollection = db.questions;
        }

        const count = qCollection ? await qCollection.count() : 0;
        setMatchingQuestionsCount(count);
        setValidationError(null);
      } catch (err) {
        console.error('Error counting matching questions:', err);
      }
    };

    calculateCounts();
  }, [mode, selectedTargetId, activeUserId]);

  const handleStart = () => {
    if (matchingQuestionsCount === 0) {
      setValidationError('No questions match your selection criteria. Please seed more questions or select another area.');
      return;
    }
    
    // Clear router history state
    navigate('/quiz-runner', {
      state: {
        mode,
        targetId,
        questionCount: Math.min(questionCount, matchingQuestionsCount),
        isTimed,
      }
    });
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6 max-w-2xl mx-auto">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
          Setup Practice Quiz
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Configure your review session parameters. Offline support is enabled automatically.
        </p>
      </header>

      {validationError && (
        <div className="bg-rose-950/40 border border-rose-900/60 p-4 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <span className="text-xs text-rose-300 font-medium">{validationError}</span>
        </div>
      )}

      <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/85 shadow-premium space-y-6">
        {/* 1. Quiz Mode Selection */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-450 block">
            Practice Method
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { id: 'mixed', label: 'Mixed Block' },
              { id: 'domain', label: 'By Domain' },
              { id: 'objective', label: 'Objective' },
              { id: 'weak_areas', label: 'Weak Areas' },
              { id: 'due_reviews', label: 'Reviews' }
            ].map(m => (
              <button
                key={m.id}
                onClick={() => handleModeChange(m.id as any)}
                className={`py-3 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                  mode === m.id
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Target Selector (Domain/Objective specific) */}
        {mode === 'domain' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-450 block">
              Select Exam Domain
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {domains.map(dom => (
                <option key={dom.id} value={dom.id}>
                  {dom.id}: {dom.name} ({(dom.weight * 100).toFixed(0)}% Weight)
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === 'objective' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-450 block">
              Select Exam Objective
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => setTargetId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              {objectives.map(obj => (
                <option key={obj.objective_id} value={obj.objective_id}>
                  {obj.objective_id}: {obj.title}
                </option>
              ))}
            </select>
          </div>
        )}

        {mode === 'weak_areas' && (
          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900 flex gap-3 text-xs text-slate-400">
            <ListFilter className="w-5 h-5 text-indigo-400 flex-shrink-0" />
            <p>
              This mode pools questions associated with objectives where your current mastery score is below 70% (Proficient).
            </p>
          </div>
        )}

        {mode === 'due_reviews' && (
          <div className="bg-slate-900/40 p-4 rounded-2xl border border-slate-900 flex gap-3 text-xs text-slate-400">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <p>
              This mode targets concepts scheduled for review today according to the spaced repetition algorithm (SM-2 Quality &lt; 4).
            </p>
          </div>
        )}

        {/* 3. Question Count Selection */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold uppercase tracking-wider text-slate-450 block">
            Number of Questions
          </label>
          <div className="flex gap-3">
            {[5, 10, 20, 50].map(count => (
              <button
                key={count}
                onClick={() => setQuestionCount(count)}
                className={`flex-1 py-3.5 rounded-2xl text-xs font-extrabold border transition-all ${
                  questionCount === count
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                {count} Qs
              </button>
            ))}
          </div>
          <p className="text-[10px] text-slate-500 font-semibold mt-1">
            Matching questions available in local cache: <span className="text-slate-350">{matchingQuestionsCount}</span>
          </p>
        </div>

        {/* 4. Timed/Untimed Toggle */}
        <div className="flex items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-slate-500" />
            <div>
              <span className="text-sm font-bold text-slate-200 block">Timed Practice Mode</span>
              <span className="text-[10px] text-slate-500 font-semibold">Allows 75 seconds average per question.</span>
            </div>
          </div>

          <button
            onClick={() => setIsTimed(!isTimed)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
              isTimed ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
            }`}
          >
            <span className="w-4 h-4 bg-white rounded-full shadow-md" />
          </button>
        </div>

        {/* 5. Trigger Action */}
        <button
          onClick={handleStart}
          disabled={matchingQuestionsCount === 0}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99] select-none text-sm"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>Launch Practice Session</span>
        </button>
      </div>
    </div>
  );
};
export default QuizSetup;
