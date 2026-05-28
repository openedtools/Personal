import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Clock, 
  ChevronRight,
  AlertTriangle,
  Smile,
  Frown,
  Meh,
  CheckCircle,
  ExternalLink,
  Save
} from 'lucide-react';
import { db } from '../db/localDb';
import { useApp } from '../context/AppContext';
import { queueLocalChange } from '../db/syncManager';
import type { Question, Attempt, Session, MistakeJournalEntry, Resource } from '../types/schemas';

export const QuizRunner: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, reloadMetrics } = useApp();
  const activeUserId = user?.id || null;

  // 1. Session Setup Parameters
  const runParams = location.state as {
    mode: 'domain' | 'objective' | 'weak_areas' | 'due_reviews' | 'mixed';
    targetId: string;
    questionCount: number;
    isTimed: boolean;
    isStudyMode?: boolean;
  };

  const isStudyMode = runParams?.isStudyMode || false;

  // 2. States
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sessionId, setSessionId] = useState<string>('');
  
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>([]);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('medium');

  // Study Mode state helpers
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [latestAttempt, setLatestAttempt] = useState<Attempt | null>(null);
  const [studyResources, setStudyResources] = useState<Resource[]>([]);
  const [mistakeType, setMistakeType] = useState<string>('');
  const [userNote, setUserNote] = useState<string>('');
  const [isJournalSaved, setIsJournalSaved] = useState<boolean>(false);

  // Timers
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);

  const questionTimerRef = useRef<number | null>(null);
  const globalTimerRef = useRef<number | null>(null);
  
  // Track start time of the current question
  const questionStartTimeRef = useRef<number>(Date.now());

  // 3. Load Questions & Create Session in DB
  useEffect(() => {
    if (!runParams) {
      navigate('/quiz');
      return;
    }

    const initQuiz = async () => {
      try {
        setLoading(true);
        let qCollection;

        // Fetch matching questions
        if (runParams.mode === 'domain' && runParams.targetId) {
          qCollection = db.questions.where('domain_id').equals(runParams.targetId);
        } else if (runParams.mode === 'objective' && runParams.targetId) {
          qCollection = db.questions.where('objective_id').equals(runParams.targetId);
        } else if (runParams.mode === 'weak_areas') {
          const weakObjIds = (await db.masterySnapshots
            .filter(s => s.user_id === activeUserId && s.score < 70 && s.score > 0)
            .toArray())
            .map(s => s.objective_id);

          if (weakObjIds.length > 0) {
            qCollection = db.questions.filter(q => weakObjIds.includes(q.objective_id));
          } else {
            qCollection = db.questions;
          }
        } else if (runParams.mode === 'due_reviews') {
          const nowStr = new Date().toISOString();
          const dueObjIds = (await db.masterySnapshots
            .filter(s => s.user_id === activeUserId && s.next_review_at !== null && s.next_review_at <= nowStr)
            .toArray())
            .map(s => s.objective_id);

          if (dueObjIds.length > 0) {
            qCollection = db.questions.filter(q => dueObjIds.includes(q.objective_id));
          } else {
            qCollection = db.questions;
          }
        } else {
          qCollection = db.questions;
        }

        let matched = await qCollection.toArray();
        if (matched.length === 0) {
          throw new Error('No matching questions found in DB');
        }

        // Fisher-Yates Shuffle
        for (let i = matched.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [matched[i], matched[j]] = [matched[j], matched[i]];
        }

        // Slice to requested count
        const selected = matched.slice(0, runParams.questionCount);
        setQuestions(selected);

        // Create DB Session
        const sId = crypto.randomUUID();
        setSessionId(sId);

        const newSession: Session = {
          session_id: sId,
          mode: runParams.mode,
          target_id: runParams.targetId || null,
          started_at: new Date().toISOString(),
          ended_at: null,
          timed: runParams.isTimed,
          time_limit_seconds: runParams.isTimed ? runParams.questionCount * 75 : null,
          user_id: activeUserId,
        };

        await db.sessions.add(newSession);
        await queueLocalChange('sessions', sId, 'insert', newSession);

        if (runParams.isTimed) {
          setRemainingSeconds(runParams.questionCount * 75);
        }

        setLoading(false);
        questionStartTimeRef.current = Date.now();
      } catch (err) {
        console.error('Error starting quiz:', err);
        navigate('/quiz');
      }
    };

    initQuiz();
  }, [runParams, activeUserId]);

  // 4. Timer effect
  useEffect(() => {
    if (loading || questions.length === 0) return;

    // Reset question elapsed timer
    setElapsedSeconds(0);
    questionStartTimeRef.current = Date.now();

    // Start question timer
    questionTimerRef.current = window.setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);

    // Start global timer if timed mode
    if (runParams.isTimed && !globalTimerRef.current) {
      globalTimerRef.current = window.setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            clearInterval(globalTimerRef.current!);
            handleAutomaticSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    };
  }, [currentIndex, loading, questions]);

  // Cleanup global timer on unmount
  useEffect(() => {
    return () => {
      if (globalTimerRef.current) clearInterval(globalTimerRef.current);
    };
  }, []);

  const handleChoiceSelect = (choiceId: string, isMsq: boolean) => {
    if (isMsq) {
      // MSQ toggle
      setSelectedAnswers(prev => 
        prev.includes(choiceId) 
          ? prev.filter(id => id !== choiceId)
          : [...prev, choiceId]
      );
    } else {
      // MCQ single-select
      setSelectedAnswers([choiceId]);
    }
  };

  // 5. Save attempt and transition
  const saveCurrentAttempt = async (): Promise<Attempt> => {
    const currentQuestion = questions[currentIndex];
    const elapsedMs = Date.now() - questionStartTimeRef.current;
    
    // Evaluate correctness
    const isCorrect = 
      selectedAnswers.length === currentQuestion.correct_answers.length &&
      selectedAnswers.every(ans => currentQuestion.correct_answers.includes(ans));

    const attemptId = crypto.randomUUID();
    const newAttempt: Attempt = {
      attempt_id: attemptId,
      session_id: sessionId,
      question_id: currentQuestion.question_id,
      objective_id: currentQuestion.objective_id,
      timestamp: new Date().toISOString(),
      correct: isCorrect,
      selected_answers: selectedAnswers,
      confidence,
      elapsed_ms: elapsedMs,
      user_id: activeUserId,
    };

    // Save locally
    await db.attempts.add(newAttempt);
    // Queue for sync
    await queueLocalChange('attempts', attemptId, 'insert', newAttempt);
    return newAttempt;
  };

  const handleNext = async () => {
    if (selectedAnswers.length === 0) return;

    if (isStudyMode && !isAnswerChecked) {
      // Phase 1: Save attempt and calculate immediate feedback
      const att = await saveCurrentAttempt();
      setLatestAttempt(att);
      setIsAnswerChecked(true);

      // Fetch study references for this specific question's objective
      const currentQuestion = questions[currentIndex];
      const res = await db.resources.where('objective_id').equals(currentQuestion.objective_id).toArray();
      setStudyResources(res);
      return;
    }

    // Phase 2: Clear states and advance to next question
    setSelectedAnswers([]);
    setConfidence('medium');
    setIsAnswerChecked(false);
    setLatestAttempt(null);
    setStudyResources([]);
    setMistakeType('');
    setUserNote('');
    setIsJournalSaved(false);

    // If it was standard practice mode, save attempt on advance
    if (!isStudyMode) {
      await saveCurrentAttempt();
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Finish Quiz
      await finalizeSession();
    }
  };

  const handleSaveJournalInline = async () => {
    if (!latestAttempt || !mistakeType) return;
    const currentQuestion = questions[currentIndex];
    
    const journalId = crypto.randomUUID();
    const entry: MistakeJournalEntry = {
      journal_id: journalId,
      attempt_id: latestAttempt.attempt_id,
      question_id: currentQuestion.question_id,
      domain_id: currentQuestion.domain_id,
      objective_id: currentQuestion.objective_id,
      mistake_type: mistakeType as any,
      user_note: userNote.trim(),
      followup_task: null,
      created_at: new Date().toISOString(),
      user_id: activeUserId,
    };

    await db.mistakeJournal.add(entry);
    await queueLocalChange('mistakeJournal', journalId, 'insert', entry);
    setIsJournalSaved(true);
  };

  const finalizeSession = async () => {
    // Clear timers
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    if (globalTimerRef.current) clearInterval(globalTimerRef.current);

    // Update Session end time in local DB
    const session = await db.sessions.get(sessionId);
    if (session) {
      session.ended_at = new Date().toISOString();
      session.updated_at = new Date().toISOString();
      await db.sessions.put(session);
      await queueLocalChange('sessions', sessionId, 'update', session);
    }

    // Refresh mastery snapshots and readiness scores
    await reloadMetrics();

    // Navigate to Review page
    navigate(`/review/${sessionId}`);
  };

  const handleAutomaticSubmit = async () => {
    console.log('Quiz timer expired! Automatically submitting...');
    // If user has selections on screen, save them first
    if (selectedAnswers.length > 0) {
      await saveCurrentAttempt();
    }
    await finalizeSession();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50svh] space-y-4">
        <Zap className="w-12 h-12 text-indigo-500 animate-bounce" />
        <p className="text-slate-400 font-semibold text-sm">Building session, randomizing questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isMsq = currentQuestion.type === 'msq';

  // Format timer displays
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6 max-w-3xl mx-auto select-none">
      {/* Top Session Progress Header */}
      <header className="flex items-center justify-between bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-md">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider">
            Syllabus Unit: {currentQuestion.objective_id}
          </span>
          <span className="text-sm font-bold text-slate-200 mt-0.5">
            Question {currentIndex + 1} of {questions.length}
          </span>
        </div>

        {/* Timers */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-mono">{formatTime(elapsedSeconds)}</span>
          </div>

          {runParams.isTimed && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span className="font-mono">{formatTime(remainingSeconds)}</span>
            </div>
          )}
        </div>
      </header>

      {/* Progress Bar indicator */}
      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800/60 p-0.5">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <section className="bg-slate-950 p-6 rounded-3xl border border-slate-800/85 shadow-premium space-y-6">
        <div className="space-y-3">
          {isMsq && (
            <div className="bg-amber-500/10 text-amber-400 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-lg border border-amber-500/20 inline-flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Multiple Select (Choose all correct)</span>
            </div>
          )}
          
          <h2 className="text-sm font-semibold md:text-base text-slate-100 leading-relaxed">
            {currentQuestion.prompt}
          </h2>
        </div>

        {/* Choices Option Group */}
        <div className="space-y-3">
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedAnswers.includes(choice.id);
            const isCorrect = currentQuestion.correct_answers.includes(choice.id);
            
            let choiceStyle = 'bg-slate-900/60 border-slate-850 hover:bg-slate-900 text-slate-350';
            if (isAnswerChecked) {
              if (isCorrect) {
                choiceStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-650 font-bold';
              } else if (isSelected) {
                choiceStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-600 font-bold';
              } else {
                choiceStyle = 'bg-slate-900/20 border-slate-850 text-slate-500 opacity-60';
              }
            } else if (isSelected) {
              choiceStyle = 'bg-indigo-600/15 border-indigo-500/70 text-slate-200 shadow-md shadow-indigo-600/10';
            }

            return (
              <button
                key={choice.id}
                disabled={isAnswerChecked}
                onClick={() => handleChoiceSelect(choice.id, isMsq)}
                className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start gap-4 ${choiceStyle}`}
              >
                {/* Visual Check/Radio Marker */}
                <div className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black border flex-shrink-0 mt-0.5 ${
                  isAnswerChecked
                    ? (isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-650'
                      : isSelected
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-600'
                        : 'bg-slate-950 border-slate-800 text-slate-600')
                    : (isSelected 
                      ? 'bg-indigo-500 border-indigo-400 text-slate-950' 
                      : 'bg-slate-950 border-slate-800 text-slate-600')
                }`}>
                  {choice.id}
                </div>
                <span className="text-xs md:text-sm font-medium leading-normal">{choice.text}</span>
              </button>
            );
          })}
        </div>

        {/* Immediate Feedback (Study Mode) */}
        {isStudyMode && isAnswerChecked && latestAttempt && (
          <div className="space-y-4 pt-4 border-t border-slate-800/60 animate-fadeIn">
            {/* Correct/Incorrect Alert */}
            {latestAttempt.correct ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3 text-emerald-600 font-bold">
                <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <div>
                  <span className="text-sm font-bold block">Correct Answer!</span>
                  <span className="text-[10px] text-slate-500">You've mastered this concept. Good job!</span>
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-center gap-3 text-rose-600 font-bold">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                <div>
                  <span className="text-sm font-bold block">Incorrect Answer</span>
                  <span className="text-[10px] text-slate-500">Read the explanation below to bridge the gap.</span>
                </div>
              </div>
            )}

            {/* Explanation box */}
            <div className="bg-slate-900/30 border border-slate-800/80 p-4 rounded-2xl space-y-3 text-xs text-slate-400">
              <div>
                <span className="font-extrabold text-slate-200 block mb-1">Correct Answer Rationale:</span>
                <p className="leading-relaxed">{currentQuestion.explanation.why_correct}</p>
              </div>

              {Object.keys(currentQuestion.explanation.why_not_others).length > 0 && (
                <div className="pt-2.5 border-t border-slate-800/50">
                  <span className="font-extrabold text-slate-200 block mb-1">Distractor Analysis:</span>
                  <div className="space-y-2 mt-1.5 leading-relaxed">
                    {Object.entries(currentQuestion.explanation.why_not_others).map(([choiceId, txt]) => (
                      <div key={choiceId} className="flex gap-2">
                        <span className="font-bold text-slate-350 uppercase">{choiceId}:</span>
                        <p>{txt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Linked Study References for this question */}
            {studyResources.length > 0 && (
              <div className="bg-slate-900/30 border border-slate-800/50 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] font-extrabold text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Study References for {currentQuestion.objective_id}</span>
                </span>
                <div className="space-y-1.5 pt-1">
                  {studyResources.map(res => (
                    <a
                      key={res.resource_id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-xs text-indigo-600 hover:text-indigo-700 bg-slate-950/80 hover:bg-slate-950 p-2.5 rounded-xl border border-slate-800/40 transition-colors"
                    >
                      <span className="font-semibold text-slate-350">{res.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono capitalize">{res.type} ↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Mistake Journal Logger (only on incorrect answers) */}
            {!latestAttempt.correct && (
              <div className="bg-slate-900/40 border border-slate-800/80 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Deconstruct this error in-place</span>
                </div>

                {isJournalSaved ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-600 font-semibold flex justify-between items-center">
                    <span>Logged to Mistake Journal!</span>
                    <CheckCircle className="w-4 h-4 text-emerald-650" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-slate-500 block">Why did you miss this?</label>
                      <select
                        value={mistakeType}
                        onChange={(e) => setMistakeType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
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

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-slate-500 block">Write a personal recall cue / note</label>
                      <textarea
                        placeholder="Write down what to remember..."
                        rows={2}
                        value={userNote}
                        onChange={(e) => setUserNote(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <button
                      onClick={handleSaveJournalInline}
                      disabled={!mistakeType}
                      className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-850 disabled:opacity-40 text-[10px] font-extrabold px-3 py-2 rounded-xl text-slate-300 ml-auto transition-all"
                    >
                      <Save className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Log to Mistake Journal</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      {/* Confidence Level & Actions footer */}
      <footer className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Metacognitive Calibration Indicator */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col justify-center gap-2 flex-1 max-w-sm">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            Answer Confidence
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'low', label: 'Low', icon: Frown, color: 'text-red-400 border-red-500/10' },
              { id: 'medium', label: 'Medium', icon: Meh, color: 'text-amber-400 border-amber-500/10' },
              { id: 'high', label: 'High', icon: Smile, color: 'text-emerald-400 border-emerald-500/10' }
            ].map(lvl => {
              const Icon = lvl.icon;
              const isChosen = confidence === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setConfidence(lvl.id as any)}
                  className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                    isChosen
                      ? 'bg-slate-900 border-slate-700 text-slate-200 shadow-inner shadow-slate-950/50'
                      : 'bg-slate-950 border-slate-850 text-slate-500 hover:text-slate-450'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isChosen ? lvl.color : ''}`} />
                  <span>{lvl.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Action triggers */}
        <button
          onClick={handleNext}
          disabled={selectedAnswers.length === 0}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-slate-950 font-bold py-4 px-8 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-[0.99] h-fit self-end text-sm"
        >
          <span>
            {isStudyMode 
              ? (!isAnswerChecked 
                ? 'Check Answer' 
                : (currentIndex + 1 === questions.length ? 'Finish Quiz' : 'Next Question'))
              : (currentIndex + 1 === questions.length ? 'Submit Quiz' : 'Next Question')
            }
          </span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );
};
export default QuizRunner;
