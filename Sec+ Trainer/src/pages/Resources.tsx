import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { 
  ExternalLink, 
  Plus, 
  Video, 
  FileText, 
  Link as LinkIcon, 
  Filter,
  Check
} from 'lucide-react';
import { db } from '../db/localDb';
import { useApp } from '../context/AppContext';
import { queueLocalChange } from '../db/syncManager';
import type { Resource } from '../types/schemas';

export const Resources: React.FC = () => {
  const { user } = useApp();
  const activeUserId = user?.id || null;

  // 1. Load resources and objectives from database
  const resources = useLiveQuery(() => db.resources.toArray()) || [];
  const objectives = useLiveQuery(() => db.objectives.toArray()) || [];
  const domains = useLiveQuery(() => db.domains.toArray()) || [];

  // Form states for new custom resources
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newUrl, setNewUrl] = useState<string>('');
  const [newType, setNewType] = useState<'video' | 'article' | 'doc' | 'practice' | 'other'>('article');
  const [newObjective, setNewObjective] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Filters state
  const [filterDomain, setFilterDomain] = useState<string>('');
  const [filterObjective, setFilterObjective] = useState<string>('');

  // 2. Add resource handler
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTitle.trim() || !newUrl.trim() || !newObjective) {
      setFormError('Please fill in all required fields.');
      return;
    }

    try {
      new URL(newUrl); // simple format check
    } catch {
      setFormError('Please enter a valid HTTP/HTTPS URL.');
      return;
    }

    try {
      const resourceId = `R-custom-${crypto.randomUUID()}`;
      const newResource: Resource = {
        resource_id: resourceId,
        objective_id: newObjective,
        type: newType,
        title: newTitle.trim(),
        url: newUrl.trim(),
        license_note: 'User-created custom link',
        user_id: activeUserId,
        updated_at: new Date().toISOString(),
      };

      await db.resources.add(newResource);
      
      // If signed in, queue for sync
      if (activeUserId) {
        await queueLocalChange('resources', resourceId, 'insert', newResource);
      }

      // Reset form
      setNewTitle('');
      setNewUrl('');
      setNewType('article');
      setNewObjective('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding resource:', err);
      setFormError('Failed to add resource. Try again.');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'doc': return FileText;
      default: return LinkIcon;
    }
  };

  // 3. Filtered objectives and resources
  const filteredObjectives = objectives.filter(obj => {
    const matchesDomain = filterDomain === '' || obj.domain_id === filterDomain;
    const matchesObjective = filterObjective === '' || obj.objective_id === filterObjective;
    return matchesDomain && matchesObjective;
  });

  return (
    <div className="space-y-6 pb-24 md:pb-6 select-none">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl">
            Remediation Links
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Access NIST glossary standards, vendor guides, videos, and your own custom study links.
          </p>
        </div>

        <button
          onClick={() => {
            setFormError(null);
            setNewObjective(objectives[0]?.objective_id || '');
            setShowAddForm(!showAddForm);
          }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-xs self-end sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Link</span>
        </button>
      </header>

      {/* Add Custom Resource Modal/Collapse */}
      {showAddForm && (
        <form 
          onSubmit={handleAddResource}
          className="bg-slate-950 p-6 rounded-3xl border border-indigo-500/30 shadow-lg space-y-4 animate-fadeIn max-w-xl mx-auto"
        >
          <h3 className="font-display font-extrabold text-sm text-indigo-400 uppercase tracking-wider">
            New Custom Link
          </h3>

          {formError && <p className="text-xs text-red-400 font-bold">{formError}</p>}

          <div className="space-y-3">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase">Title</label>
              <input
                type="text"
                placeholder="e.g. Messers SAML vs OIDC summary notes"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            {/* URL */}
            <div className="space-y-1">
              <label className="text-[10px] font-extrabold text-slate-500 uppercase">URL (HTTPS)</label>
              <input
                type="url"
                placeholder="https://example.com/notes"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase">Link Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-355 focus:outline-none"
                >
                  <option value="article">Article/Blog</option>
                  <option value="video">Video Lecture</option>
                  <option value="doc">Official Documentation</option>
                  <option value="practice">Practice Drill</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Mapped Objective */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase">Objective</label>
                <select
                  value={newObjective}
                  onChange={(e) => setNewObjective(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-355 focus:outline-none"
                  required
                >
                  {objectives.map(o => (
                    <option key={o.objective_id} value={o.objective_id}>{o.objective_id}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-850 bg-slate-900 rounded-xl text-xs font-bold text-slate-450 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/10"
            >
              <Check className="w-4 h-4" />
              <span>Save Link</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter Toolbar */}
      <section className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 shadow-md flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mr-2">
          <Filter className="w-4 h-4 text-indigo-400" />
          <span>Filters:</span>
        </div>

        <div className="flex-1 min-w-[150px]">
          <select
            value={filterDomain}
            onChange={(e) => {
              setFilterDomain(e.target.value);
              setFilterObjective('');
            }}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-350 focus:outline-none"
          >
            <option value="">All Domains</option>
            {domains.map(dom => (
              <option key={dom.id} value={dom.id}>{dom.id}: {dom.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[180px]">
          <select
            value={filterObjective}
            onChange={(e) => setFilterObjective(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-355 focus:outline-none"
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
      </section>

      {/* Main List */}
      <div className="space-y-4">
        {filteredObjectives.map(obj => {
          const objResources = resources.filter(r => r.objective_id === obj.objective_id);

          return (
            <div 
              key={obj.objective_id}
              className="bg-slate-950 p-5 rounded-2xl border border-slate-800/85 shadow-sm space-y-3"
            >
              <div>
                <span className="text-[10px] text-slate-500 font-extrabold uppercase">{obj.objective_id}</span>
                <h3 className="text-sm font-bold text-slate-200 mt-0.5 leading-snug">{obj.title}</h3>
              </div>

              {objResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {objResources.map(res => {
                    const Icon = getIcon(res.type);
                    return (
                      <a
                        key={res.resource_id}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900/40 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 p-3.5 rounded-xl transition-all flex items-start gap-3 group"
                      >
                        <Icon className="w-5 h-5 text-indigo-400 group-hover:scale-105 transition-transform mt-0.5 flex-shrink-0" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors block truncate">
                            {res.title}
                          </span>
                          <span className="text-[9px] text-slate-500 capitalize block mt-0.5 font-semibold">
                            Type: {res.type} {res.license_note ? `• ${res.license_note}` : ''}
                          </span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-600 ml-auto flex-shrink-0 mt-1" />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <div className="text-slate-600 text-xs italic pl-1.5 py-1">
                  No resources mapped. Add your custom links using the button above.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Resources;
