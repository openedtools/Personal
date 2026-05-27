import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Save, 
  BookOpen, 
  ExternalLink,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { db } from '../db/localDb';
import { useApp } from '../context/AppContext';
import { queueLocalChange } from '../db/syncManager';
import type { Question, Attempt, MistakeJournalEntry, Resource } from '../types/schemas';
import { mapAccuracyToQuality, calculateSM2 } from '../utils/masteryMath';

export const ReviewReport: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useApp();
  const activeUserId = user?.id || null;

  // 1. Fetch Session & Attempts from database
  const session = useLiveQuery(() => db.sessions.get(sessionId || ''));
  const attempts = useLiveQuery(
    () => db.attempts.where('session_id').equals(sessionId || '').toArray(),
    [sessionId]
  ) || [];

  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});
  const [resourcesMap, setResourcesMap] = useState<Record<string, Resource[]>>({});
  
  // Mistake journal input states
  const [mistakeTypes, setMistakeTypes] = useState<Record<string, string>>({});
  const [userNotes, setUserNotes] = useState<Record<string, string>>({});
  const [savedJournalIds, setSavedJournalIds] = useState<Record<string, boolean>>({});

  // 2. Fetch corresponding questions and resources when attempts load
  useEffect(() => {
    const fetchMetadata = async () => {
      if (attempts.length === 0) return;
      
      const qIds = attempts.map(a => a.question_id);
      const objIds = Array.from(new Set(attempts.map(a => a.objective_id)));

      // Fetch questions
      const fetchedQuestions = await db.questions
        .filter(q => qIds.includes(q.question_id))
        .toArray();
      
      const qMap: Record<string, Question> = {};
      fetchedQuestions.forEach(q => {
        qMap[q.question_id] = q;
      });
      setQuestionsMap(qMap);

      // Fetch resources linked to these objectives
      const rMap: Record<string, Resource[]> = {};
      for (const objId of objIds) {
        const res = await db.resources.where('objective_id').equals(objId).toArray();
        rMap[objId] = res;
      }
      setResourcesMap(rMap);

      // Fetch existing mistake journal entries for this session
      const existingEntries = await (activeUserId
        ? db.mistakeJournal.where('user_id').equals(activeUserId).toArray()
        : db.mistakeJournal.filter(e => e.user_id === null).toArray());
      
      const savedMap: Record<string, boolean> = {};
      const noteMap: Record<string, string> = {};
      const typeMap: Record<string, string> = {};

      existingEntries.forEach(entry => {
        const attempt = attempts.find(a => a.attempt_id === entry.attempt_id);
        if (attempt) {
          savedMap[attempt.attempt_id] = true;
          noteMap[attempt.attempt_id] = entry.user_note;
          typeMap[attempt.attempt_id] = entry.mistake_type;
        }
      });

      setSavedJournalIds(savedMap);
      setUserNotes(noteMap);
      setMistakeTypes(typeMap);
    };

    fetchMetadata();
  }, [attempts, activeUserId]);

  // 3. Spaced Repetition Scheduling Calculations
  useEffect(() => {
    // When quiz completes, update objectives next_review_at date using SM-2
    const updateObjectiveSchedules = async () => {
      if (!session || attempts.length === 0) return;
      
      // Prevent running multiple times
      const lastScheduledKey = `last_scheduled_session_${sessionId}`;
      if (session.ended_at && !localStorage.getItem(lastScheduledKey)) {
        localStorage.setItem(lastScheduledKey, 'true');
        console.log('Calculating spaced repetition for session:', sessionId);

        // Group attempts by objective
        const objAttempts: Record<string, { correctCount: number; totalCount: number }> = {};
        attempts.forEach(att => {
          if (!objAttempts[att.objective_id]) {
            objAttempts[att.objective_id] = { correctCount: 0, totalCount: 0 };
          }
          objAttempts[att.objective_id].totalCount++;
          if (att.correct) {
            objAttempts[att.objective_id].correctCount++;
          }
        });

        // Run SM-2 update for each objective
        for (const [objId, stats] of Object.entries(objAttempts)) {
          const accuracy = stats.correctCount / stats.totalCount;
          // Calculate quality
          const q = mapAccuracyToQuality(accuracy, 'medium');

          // Get existing mastery snapshot to retrieve SM-2 state
          let snap = await db.masterySnapshots.get(objId);
          if (snap && snap.user_id !== activeUserId) {
            snap = undefined;
          }

          // Initialize SM-2 parameters
          let repetitions = 0;
          let interval = 1;
          let easeFactor = 2.5;

          if (snap) {
            // Find in local syncQueue if there is a pending SM-2 state, or estimate
            // We'll use the snapshot's existing calculations or mock them based on current label
            if (snap.consistency > 0) {
              repetitions = Math.round(snap.consistency * 3);
            }
          }

          // Compute new state
          const sm2 = calculateSM2(q, { repetitions, interval, easeFactor });

          // Calculate next review timestamp
          const nextReviewDate = new Date();
          nextReviewDate.setDate(nextReviewDate.getDate() + sm2.interval);

          // Update/Upsert local mastery snapshots
          // Note: Full recalculation will happen inside reloadMetrics, but we stamp the next review date here
          if (snap) {
            snap.next_review_at = nextReviewDate.toISOString();
            snap.updated_at = new Date().toISOString();
            await db.masterySnapshots.put(snap);
            await queueLocalChange('masterySnapshots', snap.objective_id, 'update', snap);
          }
        }
      }
    };

    updateObjectiveSchedules();
  }, [session, attempts, activeUserId]);

  const handleSaveJournal = async (attempt: Attempt) => {
    const type = mistakeTypes[attempt.attempt_id];
    const note = userNotes[attempt.attempt_id] || '';

    if (!type) {
      alert('Please select a mistake classification type first.');
      return;
    }

    const q = questionsMap[attempt.question_id];
    if (!q) return;

    try {
      const journalId = crypto.randomUUID();
      const newEntry: MistakeJournalEntry = {
        journal_id: journalId,
        attempt_id: attempt.attempt_id,
        question_id: attempt.question_id,
        domain_id: q.domain_id,
        objective_id: attempt.objective_id,
        mistake_type: type as any,
        user_note: note,
        followup_task: null,
        created_at: new Date().toISOString(),
        user_id: activeUserId,
      };

      await db.mistakeJournal.add(newEntry);
      await queueLocalChange('mistakeJournal', journalId, 'insert', newEntry);

      setSavedJournalIds(prev => ({ ...prev, [attempt.attempt_id]: true }));
    } catch (err) {
      console.error('Error saving journal entry:', err);
    }
  };

  if (!session) {
    return (
      <div className="text-center py-12">
        <h2 className="text-white text-xl font-bold">Session not found</h2>
        <Link to="/" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">Return to Dashboard</Link>
      </div>
    );
  }

  // Calculate statistics
  const totalQuestions = attempts.length;
  const correctAnswers = attempts.filter(a => a.correct).length;
  const scorePercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const elapsedMsSum = attempts.reduce((sum, a) => sum + a.elapsed_ms, 0);
  const totalMins = Math.floor(elapsedMsSum / 60000);
  const totalSecs = Math.floor((elapsedMsSum % 60000) / 1000);

  return (
    <div className="space-y-6 pb-24 md:pb-6 max-w-4xl mx-auto">
      {/* Top Banner Score Dashboard */}
      <header className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-premium flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">
            Practice Result
          </span>
          <h1 className="text-2xl font-extrabold text-white tracking-tight mt-1">
            Session Review
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Taken on {new Date(session.started_at).toLocaleDateString()} at{' '}
            {new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Score metrics */}
        <div className="flex gap-6 items-center">
          <div className="text-center">
            <span className="text-3xl font-black text-indigo-400">{scorePercent}%</span>
            <p className="text-[10px] text-slate-500 uppercase font-extrabold mt-1">Score</p>
          </div>

          <div className="w-px h-10 bg-slate-800" />

          <div className="text-center">
            <span className="text-2xl font-bold text-slate-200">
              {correctAnswers}/{totalQuestions}
            </span>
            <p className="text-[10px] text-slate-500 uppercase font-extrabold mt-1">Correct</p>
          </div>

          <div className="w-px h-10 bg-slate-800" />

          <div className="text-center font-mono">
            <span className="text-2xl font-bold text-slate-200">
              {totalMins}:{totalSecs.toString().padStart(2, '0')}
            </span>
            <p className="text-[10px] text-slate-500 uppercase font-extrabold mt-1">Time</p>
          </div>
        </div>
      </header>

      {/* Spaced Review Recommendation Alerts */}
      <section className="bg-slate-950/30 p-5 rounded-2xl border border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wide">
              {scorePercent >= 80 ? 'Proficiency Unlocked' : 'Remediation Required'}
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              {scorePercent >= 80 
                ? 'Excellent score! The spaced review algorithm has pushed these objectives further into the future.'
                : 'Work on your weak areas. Log your mistakes below to add them to your Mistake Journal and review linked materials.'
              }
            </p>
          </div>
        </div>
        <Link
          to="/"
          className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-xs font-extrabold py-2 px-4 rounded-xl text-slate-300 flex items-center justify-center gap-1.5 self-end md:self-auto"
        >
          <span>Return Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </section>

      {/* Mapped Objective Resources Panel */}
      <section className="bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-3">
        <h3 className="font-display font-bold text-sm text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Remediation Resources Mapped</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(resourcesMap).map(([objId, list]) => (
            <div key={objId} className="bg-slate-900/30 p-3 rounded-xl border border-slate-900 space-y-1.5">
              <span className="text-[10px] font-bold text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                Objective {objId} Reference
              </span>
              {list.length > 0 ? (
                <div className="space-y-1 mt-1">
                  {list.map(res => (
                    <a
                      key={res.resource_id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 leading-normal"
                    >
                      <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate">{res.title}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] text-slate-600 italic">No external links configured. Use Messer SY0-701 references.</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Attempts Review Cards */}
      <section className="space-y-6">
        <h3 className="font-display font-bold text-lg text-white">Question Breakdown</h3>

        {attempts.map((att, idx) => {
          const q = questionsMap[att.question_id];
          if (!q) return null;

          const isSaved = savedJournalIds[att.attempt_id] || false;

          return (
            <div 
              key={att.attempt_id}
              className={`p-6 rounded-3xl border shadow-md space-y-4 bg-slate-950 ${
                att.correct ? 'border-emerald-500/20' : 'border-red-500/20'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">
                    Question {idx + 1} • {q.objective_id}
                  </span>
                  <h4 className="text-sm md:text-base font-bold text-slate-100 leading-relaxed">
                    {q.prompt}
                  </h4>
                </div>

                {att.correct ? (
                  <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-xl font-bold flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Correct</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-xl font-bold flex-shrink-0">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Incorrect</span>
                  </span>
                )}
              </div>

              {/* Choices list */}
              <div className="space-y-2 pt-2">
                {q.choices.map(choice => {
                  const isUserSelection = att.selected_answers.includes(choice.id);
                  const isCorrectAnswer = q.correct_answers.includes(choice.id);

                  let choiceStyle = 'bg-slate-900/40 border-slate-900/60 text-slate-400';
                  if (isCorrectAnswer) {
                    choiceStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 font-medium';
                  } else if (isUserSelection && !isCorrectAnswer) {
                    choiceStyle = 'bg-red-500/10 border-red-500/40 text-red-400 font-medium';
                  }

                  return (
                    <div 
                      key={choice.id}
                      className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${choiceStyle}`}
                    >
                      <span className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[10px] border flex-shrink-0 mt-0.5 ${
                        isCorrectAnswer 
                          ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' 
                          : isUserSelection 
                            ? 'bg-red-500/20 border-red-500/40 text-red-400' 
                            : 'bg-slate-950 border-slate-800 text-slate-600'
                      }`}>
                        {choice.id}
                      </span>
                      <span>{choice.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanations Accordion */}
              <div className="bg-slate-900/40 border border-slate-900/80 p-4 rounded-2xl space-y-3 text-xs leading-relaxed text-slate-350">
                <div>
                  <span className="font-extrabold text-slate-400 block mb-1">Correct Answer Rationale:</span>
                  <p>{q.explanation.why_correct}</p>
                </div>
                
                {Object.keys(q.explanation.why_not_others).length > 0 && (
                  <div className="pt-2 border-t border-slate-850/60">
                    <span className="font-extrabold text-slate-400 block mb-1">Distractor Analysis:</span>
                    <div className="space-y-2 mt-1.5">
                      {Object.entries(q.explanation.why_not_others).map(([choiceId, txt]) => (
                        <div key={choiceId} className="flex gap-2">
                          <span className="font-bold text-slate-500 uppercase">{choiceId}:</span>
                          <p>{txt}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mistake Journal Logger (Render on incorrect attempts) */}
              {!att.correct && (
                <div className="border-t border-slate-850 pt-4 mt-2 space-y-3">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Deconstruct this error</span>
                  </span>

                  {isSaved ? (
                    <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded uppercase">
                          Type: {mistakeTypes[att.attempt_id]}
                        </span>
                        <span className="text-[10px] text-emerald-500 font-bold">Logged to Journal</span>
                      </div>
                      {userNotes[att.attempt_id] && (
                        <p className="text-slate-300 italic">" {userNotes[att.attempt_id]} "</p>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-2xl space-y-3">
                      {/* Mistake Category selection */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase text-slate-500">
                          Why did you miss this?
                        </label>
                        <select
                          value={mistakeTypes[att.attempt_id] || ''}
                          onChange={(e) => setMistakeTypes(prev => ({ ...prev, [att.attempt_id]: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="">-- Select Mistake Reason --</option>
                          <option value="vocabulary gap">Vocabulary Gap (Term unfamiliar)</option>
                          <option value="confused similar concepts">Confused Similar Concepts</option>
                          <option value="missed scenario keyword">Missed Scenario Keyword</option>
                          <option value="chose technically true but not best answer">Chose Technically True but not Best Answer</option>
                          <option value="process/order issue">Process/Order Flow Issue</option>
                          <option value="weak tool/control selection">Weak Tool/Control Selection</option>
                          <option value="guessed">Guessed (Pure guess)</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      {/* Personal Study notes */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-extrabold uppercase text-slate-500">
                          Write a personal recall cue / note
                        </label>
                        <textarea
                          placeholder="Write down what to remember (e.g. 'SAML uses XML, OIDC uses JSON/JWT tokens. Keep them apart.')"
                          rows={2}
                          value={userNotes[att.attempt_id] || ''}
                          onChange={(e) => setUserNotes(prev => ({ ...prev, [att.attempt_id]: e.target.value }))}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      {/* Save trigger */}
                      <button
                        onClick={() => handleSaveJournal(att)}
                        disabled={!mistakeTypes[att.attempt_id]}
                        className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 text-[10px] font-extrabold px-3 py-2 rounded-xl text-slate-300 ml-auto transition-all"
                      >
                        <Save className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Log to Mistake Journal</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
};
export default ReviewReport;
