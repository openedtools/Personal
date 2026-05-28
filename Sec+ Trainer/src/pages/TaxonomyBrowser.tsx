import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  BookOpen, 
  Hash, 
  Tag
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { db } from '../db/localDb';

export const TaxonomyBrowser: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const [expandedDomain, setExpandedDomain] = useState<string | null>('D1');
  const [expandedObjective, setExpandedObjective] = useState<string | null>(null);

  // Load static and reactive data
  const activeUserId = user?.id || null;
  const domains = useLiveQuery(() => db.domains.toArray()) || [];
  const objectives = useLiveQuery(() => db.objectives.toArray()) || [];
  const topics = useLiveQuery(() => db.topics.toArray()) || [];
  
  const masterySnapshots = useLiveQuery(
    () => activeUserId
      ? db.masterySnapshots.where('user_id').equals(activeUserId).toArray()
      : db.masterySnapshots.filter(s => s.user_id === null).toArray(),
    [activeUserId]
  ) || [];

  const handleStartQuiz = (objectiveId: string) => {
    navigate('/quiz', { state: { mode: 'objective', targetId: objectiveId } });
  };

  const handleStartDomainQuiz = (domainId: string) => {
    navigate('/quiz', { state: { mode: 'domain', targetId: domainId } });
  };

  // Helper to color code mastery labels
  const getMasteryColor = (score: number) => {
    if (score === 0) return 'text-slate-400 border-slate-700 bg-slate-800/20';
    if (score < 35) return 'text-red-400 border-red-900/40 bg-red-950/20';
    if (score < 55) return 'text-orange-400 border-orange-900/40 bg-orange-950/20';
    if (score < 70) return 'text-amber-400 border-amber-900/40 bg-amber-950/20';
    if (score < 85) return 'text-yellow-400 border-yellow-900/40 bg-yellow-950/20';
    if (score < 95) return 'text-blue-400 border-blue-900/40 bg-blue-950/20';
    return 'text-emerald-400 border-emerald-900/40 bg-emerald-950/20';
  };

  return (
    <div className="space-y-6 pb-24 md:pb-6">
      <header className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-200 md:text-3xl">
          SY0-701 Exam Taxonomy
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore the official domains, objectives, and leaf topics. Check your current mastery and practice specific sections.
        </p>
      </header>

      {/* Accordion List of Domains */}
      <div className="space-y-4">
        {domains.map((dom) => {
          const isDomExpanded = expandedDomain === dom.id;
          const domObjectives = objectives.filter(o => o.domain_id === dom.id);

          return (
            <div 
              key={dom.id}
              className="bg-slate-950 rounded-2xl border border-slate-800/80 shadow-md overflow-hidden transition-all duration-300"
            >
              {/* Domain Header row */}
              <div 
                onClick={() => setExpandedDomain(isDomExpanded ? null : dom.id)}
                className={`flex items-center justify-between p-5 cursor-pointer hover:bg-slate-900/50 transition-colors select-none ${
                  isDomExpanded ? 'bg-slate-900/30' : ''
                }`}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      Domain {dom.id.replace('D', '')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-semibold">
                      Weight: {(dom.weight * 100).toFixed(0)}%
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-slate-200 mt-1.5 truncate">
                    {dom.name}
                  </h2>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartDomainQuiz(dom.id);
                    }}
                    className="flex items-center gap-1.5 bg-indigo-600/15 hover:bg-indigo-600/35 border border-indigo-500/20 text-indigo-300 text-xs px-3 py-1.5 rounded-xl font-bold transition-all active:scale-95"
                    title={`Practice Domain ${dom.id}`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>Practice Domain</span>
                  </button>
                  {isDomExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </div>
              </div>

              {/* Objectives List */}
              {isDomExpanded && (
                <div className="border-t border-slate-800/50 divide-y divide-slate-800/40 bg-slate-950">
                  {domObjectives.map((obj) => {
                    const isObjExpanded = expandedObjective === obj.objective_id;
                    const objTopics = topics.filter(t => t.objective_id === obj.objective_id);
                    const snap = masterySnapshots.find(s => s.objective_id === obj.objective_id);
                    
                    const score = snap ? snap.score : 0;
                    const label = snap ? snap.label : 'Not Started';

                    return (
                      <div key={obj.objective_id} className="p-5 space-y-3 transition-colors hover:bg-slate-900/10">
                        <div 
                          onClick={() => setExpandedObjective(isObjExpanded ? null : obj.objective_id)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                        >
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold text-slate-500">{obj.objective_id}</span>
                            <h3 className="text-sm font-bold text-slate-200 mt-0.5">
                              {obj.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-4 flex-shrink-0 self-end sm:self-auto">
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getMasteryColor(score)}`}>
                              {score > 0 ? `${score}% (${label})` : 'Not Started'}
                            </span>
                            {isObjExpanded ? (
                              <ChevronUp className="w-4 h-4 text-slate-600" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                        </div>

                        {/* Expanded details (topics, actions) */}
                        {isObjExpanded && (
                          <div className="pt-3 space-y-4 animate-fadeIn">
                            {/* Actions block */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleStartQuiz(obj.objective_id)}
                                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-slate-950 text-xs px-4 py-2 rounded-xl font-bold shadow-md shadow-indigo-600/10 transition-all active:scale-95"
                              >
                                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                                <span>Practice Objective</span>
                              </button>
                            </div>

                            {/* Subtopics List */}
                            {objTopics.length > 0 ? (
                              <div className="bg-slate-900/30 border border-slate-900/60 p-4 rounded-xl space-y-2">
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                  <BookOpen className="w-3 h-3" />
                                  <span>Covered Concepts / Topics</span>
                                </span>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                                  {objTopics.map((topic) => (
                                    <div 
                                      key={topic.topic_id} 
                                      className="flex items-start gap-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/40 text-xs text-slate-300"
                                    >
                                      <Hash className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-slate-200 leading-tight">{topic.title}</p>
                                        <p className="text-[10px] text-slate-500">{topic.official_path}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-slate-500 text-xs italic pl-2">
                                Detail topics seed pending. Overall objective is active.
                              </div>
                            )}

                            {/* Tag badge metadata */}
                            {obj.tags.length > 0 && (
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <Tag className="w-3.5 h-3.5 text-slate-600" />
                                {obj.tags.map(tag => (
                                  <span key={tag} className="text-[9px] text-slate-500 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-850">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default TaxonomyBrowser;
