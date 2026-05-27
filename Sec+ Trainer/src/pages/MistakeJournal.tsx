import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  FileEdit, 
  Trash2, 
  Filter, 
  Zap,
  AlertTriangle,
  Save,
  CheckCircle
} from 'lucide-react';
import { db } from '../db/localDb';
import { useApp } from '../context/AppContext';
import { queueLocalChange } from '../db/syncManager';
import type { MistakeJournalEntry, Question } from '../types/schemas';

export const MistakeJournal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const activeUserId = user?.id || null;

  // 1. Fetch Mistake Journal and metadata
  const journalEntries = useLiveQuery(
    () => activeUserId
      ? db.mistakeJournal.where('user_id').equals(activeUserId).toArray()
      : db.mistakeJournal.filter(e => e.user_id === null).toArray(),
    [activeUserId]
  ) || [];

  const domains = useLiveQuery(() => db.domains.toArray()) || [];
  const objectives = useLiveQuery(() => db.objectives.toArray()) || [];

  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});
  
  // Note inline-editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState<string>('');

  // Filters state
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [filterObjective, setFilterObjective] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('');

  // 2. Fetch associated questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (journalEntries.length === 0) return;
      const qIds = journalEntries.map(e => e.question_id);
      const fetched = await db.questions.filter(q => qIds.includes(q.question_id)).toArray();
      const qMap: Record<string, Question> = {};
      fetched.forEach(q => {
        qMap[q.question_id] = q;
      });
      setQuestionsMap(qMap);
    };

    fetchQuestions();
  }, [journalEntries]);

  const handleDeleteEntry = async (entryId: string) => {
    if (!window.confirm('Are you sure you want to remove this entry from your journal?')) return;
    
    try {
      await db.mistakeJournal.delete(entryId);
      await queueLocalChange('mistakeJournal', entryId, 'delete', null);
    } catch (err) {
      console.error('Error deleting journal entry:', err);
    }
  };

  const handleEditStart = (entry: MistakeJournalEntry) => {
    setEditingId(entry.journal_id);
    setEditNote(entry.user_note);
  };

  const handleEditSave = async (entry: MistakeJournalEntry) => {
    try {
      const updated = { ...entry, user_note: editNote, updated_at: new Date().toISOString() };
      await db.mistakeJournal.put(updated);
      await queueLocalChange('mistakeJournal', entry.journal_id, 'update', updated);
      setEditingId(null);
    } catch (err) {
      console.error('Error saving updated journal note:', err);
    }
  };

  const handlePracticeMistakes = () => {
    // Collect specific questions present in mistake journal
    const qIds = filteredEntries.map(e => e.question_id);
    if (qIds.length === 0) return;

    navigate('/quiz-runner', {
      state: {
        mode: 'weak_areas', // informs runner to use weak area logic
        questionCount: Math.min(10, qIds.length),
        isTimed: false,
      }
    });
  };

  // 3. Filtered entries logic
  const filteredEntries = journalEntries.filter(entry => {
    const matchesDomain = filterDomain === '' || entry.domain_id === filterDomain;
    const matchesObjective = filterObjective === '' || entry.objective_id === filterObjective;
    const matchesType = filterType === '' || entry.mistake_type === filterType;

    return matchesDomain && matchesObjective && matchesType;
  });

  const getMistakeTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'vocabulary gap': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'confused similar concepts': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      'missed scenario keyword': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      'chose technically true but not best answer': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      'process/order issue': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'weak tool/control selection': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'guessed': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
      'other': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return colors[type] || 'bg-slate-500/10 text-slate-450 border-slate-500/20';
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6 select-none">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Mistake Journal
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Analyze why you missed questions, review rationales, and test yourself on these areas.
          </p>
        </div>

        {filteredEntries.length > 0 && (
          <button
            onClick={handlePracticeMistakes}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-xs self-end sm:self-auto"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Practice Journal Mistakes ({filteredEntries.length})</span>
          </button>
        )}
      </header>

      {/* Filters Toolbar */}
      <section className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-md flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mr-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters:</span>
        </div>

        {/* Domain Filter */}
        <div className="flex-1 min-w-[120px]">
          <select
            value={filterDomain}
            onChange={(e) => {
              setFilterDomain(e.target.value);
              setFilterObjective(''); // reset objective
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Domains</option>
            {domains.map(dom => (
              <option key={dom.id} value={dom.id}>{dom.id}: {dom.name}</option>
            ))}
          </select>
        </div>

        {/* Objective Filter */}
        <div className="flex-1 min-w-[150px]">
          <select
            value={filterObjective}
            onChange={(e) => setFilterObjective(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Objectives</option>
            {objectives
              .filter(o => filterDomain === '' || o.domain_id === filterDomain)
              .map(obj => (
                <option key={obj.objective_id} value={obj.objective_id}>
                  {obj.objective_id}: {obj.title}
                </option>
              ))
            }
          </select>
        </div>

        {/* Mistake Type Filter */}
        <div className="flex-1 min-w-[150px]">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Mistake Types</option>
            <option value="vocabulary gap">Vocabulary Gap</option>
            <option value="confused similar concepts">Confused Similar Concepts</option>
            <option value="missed scenario keyword">Missed Scenario Keyword</option>
            <option value="chose technically true but not best answer">Chose Technically True but not Best Answer</option>
            <option value="process/order issue">Process/Order Flow Issue</option>
            <option value="weak tool/control selection">Weak Tool/Control Selection</option>
            <option value="guessed">Guessed</option>
            <option value="other">Other</option>
          </select>
        </div>
      </section>

      {/* Journal Cards Stack */}
      {filteredEntries.length > 0 ? (
        <div className="space-y-4">
          {filteredEntries.map((entry) => {
            const q = questionsMap[entry.question_id];
            if (!q) return null;

            const isEditing = editingId === entry.journal_id;

            return (
              <div 
                key={entry.journal_id}
                className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 shadow-md space-y-4"
              >
                {/* Header row */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/15">
                        {entry.objective_id}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getMistakeTypeColor(entry.mistake_type)}`}>
                        {entry.mistake_type}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold block pt-1">
                      Logged {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteEntry(entry.journal_id)}
                    className="p-2 border border-slate-850 bg-slate-900 rounded-xl hover:bg-slate-800 hover:text-rose-400 transition-colors text-slate-500"
                    title="Remove from journal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Prompt block */}
                <div className="space-y-2">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Question Prompt</span>
                  <p className="text-xs font-semibold text-slate-200 leading-relaxed bg-slate-900/30 p-3 rounded-xl border border-slate-900/60">
                    {q.prompt}
                  </p>
                </div>

                {/* Correct Answer Explanation excerpt */}
                <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-900 space-y-1.5 text-xs text-slate-350">
                  <span className="font-extrabold text-slate-450 block flex items-center gap-1.5 text-[10px] uppercase">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Correct Answer Key Details</span>
                  </span>
                  <p className="leading-relaxed">{q.explanation.why_correct}</p>
                </div>

                {/* User study notes */}
                <div className="border-t border-slate-900 pt-4 space-y-2">
                  <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-wider block">Your Recall Cue / Notes</span>
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                        rows={2}
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 border border-slate-850 hover:bg-slate-900 rounded-lg text-xs font-bold text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSave(entry)}
                          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-indigo-600/10"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save Note</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4 bg-indigo-500/5 border border-indigo-500/10 p-3.5 rounded-xl">
                      <p className="text-xs text-indigo-200 italic leading-relaxed">
                        {entry.user_note ? `"${entry.user_note}"` : 'No study cue added. Click edit to add a memory aid.'}
                      </p>
                      <button
                        onClick={() => handleEditStart(entry)}
                        className="text-xs text-slate-450 hover:text-indigo-400 transition-colors p-1"
                        title="Edit Study Note"
                      >
                        <FileEdit className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-3xl bg-slate-950/20 max-w-xl mx-auto">
          <AlertTriangle className="w-10 h-10 text-slate-500/80 mx-auto" />
          <h3 className="text-white font-bold mt-3 text-sm">Your Mistake Journal is Empty</h3>
          <p className="text-slate-500 text-xs mt-1.5 px-6 leading-relaxed">
            Great job! Mistake journal logs are created when you miss questions in a practice session and deconstruct the error on the review report.
          </p>
        </div>
      )}
    </div>
  );
};
export default MistakeJournal;
