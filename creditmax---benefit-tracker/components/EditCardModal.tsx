
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Calendar, Plus, Link as IconLink, Coins, Check, Edit2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { CreditCard, Benefit, Frequency } from '../types';
import { CardVisual } from './CardVisual';

interface Props {
  isOpen: boolean;
  card: CreditCard | null;
  onClose: () => void;
  onSave: (updatedCard: CreditCard) => void;
  onDelete: (cardId: string) => void;
}

const COLOR_THEMES = [
    { from: 'from-slate-400', to: 'to-slate-600', label: 'Platinum' },
    { from: 'from-blue-800', to: 'to-indigo-900', label: 'Sapphire' },
    { from: 'from-amber-200', to: 'to-yellow-500', label: 'Gold' },
    { from: 'from-emerald-700', to: 'to-teal-900', label: 'Green' },
    { from: 'from-red-700', to: 'to-rose-900', label: 'Red' },
    { from: 'from-slate-800', to: 'to-black', label: 'Black' },
    { from: 'from-violet-600', to: 'to-fuchsia-800', label: 'Purple' },
];

export const EditCardModal: React.FC<Props> = ({ isOpen, card, onClose, onSave, onDelete }) => {
  const [editedCard, setEditedCard] = useState<CreditCard | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'benefits'>('details');
  
  // Benefit Form State
  const [isAddingBenefit, setIsAddingBenefit] = useState(false);
  const [editingBenefitId, setEditingBenefitId] = useState<string | null>(null);
  const [newBenefit, setNewBenefit] = useState<Partial<Benefit>>({
    title: '',
    description: '',
    value: 0,
    frequency: Frequency.MONTHLY,
    category: 'Other',
    isCredit: true,
    isHidden: false
  });

  // Drag and Drop Refs
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    if (card) {
        setEditedCard({ ...card, autoPay: card.autoPay !== undefined ? card.autoPay : false });
        setActiveTab('details');
        setIsAddingBenefit(false);
        setEditingBenefitId(null);
    }
  }, [card]);

  if (!isOpen || !editedCard) return null;

  const handleSave = () => {
    onSave(editedCard);
    onClose();
  };

  const handleDelete = () => {
      if (confirm("Are you sure you want to remove this card?")) {
          onDelete(editedCard.id);
          onClose();
      }
  };

  const handleRemoveBenefit = (benefitId: string) => {
    setEditedCard({
        ...editedCard,
        benefits: editedCard.benefits.filter(b => b.id !== benefitId)
    });
  };

  const handleEditBenefit = (benefit: Benefit) => {
      setNewBenefit({
          title: benefit.title,
          description: benefit.description,
          value: benefit.value,
          frequency: benefit.frequency,
          category: benefit.category || 'Other',
          isCredit: benefit.isCredit,
          isHidden: benefit.isHidden || false
      });
      setEditingBenefitId(benefit.id);
      setIsAddingBenefit(true);
  };

  const handleToggleHidden = (benefitId: string) => {
      setEditedCard({
          ...editedCard,
          benefits: editedCard.benefits.map(b => 
              b.id === benefitId ? { ...b, isHidden: !b.isHidden } : b
          )
      });
  };

  // Drag and Drop Handlers
  const handleSort = () => {
      if (dragItem.current === null || dragOverItem.current === null) return;
      
      // Duplicate items
      const _benefits = [...editedCard.benefits];
      
      // Remove and save the dragged item content
      const draggedItemContent = _benefits.splice(dragItem.current, 1)[0];
      
      // Switch the position
      _benefits.splice(dragOverItem.current, 0, draggedItemContent);
      
      // Update state
      setEditedCard({ ...editedCard, benefits: _benefits });
      
      // Reset refs
      dragItem.current = null;
      dragOverItem.current = null;
  };

  const handleSaveBenefit = () => {
      if (!newBenefit.title) return;

      if (editingBenefitId) {
          // Update existing
          setEditedCard({
              ...editedCard,
              benefits: editedCard.benefits.map(b => {
                  if (b.id === editingBenefitId) {
                      return {
                          ...b,
                          title: newBenefit.title!,
                          description: newBenefit.description || '',
                          value: Number(newBenefit.value) || 0,
                          frequency: newBenefit.frequency || Frequency.ONE_TIME,
                          isCredit: newBenefit.isCredit || false,
                          category: newBenefit.category || 'Other',
                          isHidden: newBenefit.isHidden || false
                      };
                  }
                  return b;
              })
          });
      } else {
          // Add New
          const benefitToAdd: Benefit = {
              id: `custom-${Date.now()}`,
              title: newBenefit.title!,
              description: newBenefit.description || '',
              value: Number(newBenefit.value) || 0,
              frequency: newBenefit.frequency || Frequency.ONE_TIME,
              usedAmount: 0,
              isCredit: newBenefit.isCredit || false,
              category: newBenefit.category || 'Other',
              isHidden: newBenefit.isHidden || false
          };
          setEditedCard({
              ...editedCard,
              benefits: [...editedCard.benefits, benefitToAdd]
          });
      }

      // Reset form
      setNewBenefit({
        title: '',
        description: '',
        value: 0,
        frequency: Frequency.MONTHLY,
        category: 'Other',
        isCredit: true,
        isHidden: false
      });
      setIsAddingBenefit(false);
      setEditingBenefitId(null);
  };

  const handleCancelBenefit = () => {
      setIsAddingBenefit(false);
      setEditingBenefitId(null);
      setNewBenefit({
        title: '',
        description: '',
        value: 0,
        frequency: Frequency.MONTHLY,
        category: 'Other',
        isCredit: true,
        isHidden: false
      });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh]">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-900 z-10 rounded-t-2xl">
          <h2 className="text-xl font-semibold text-white">Edit Card</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-slate-800">
            <button 
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'details' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
                Card Details
            </button>
            <button 
                onClick={() => setActiveTab('benefits')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'benefits' ? 'text-indigo-400 border-b-2 border-indigo-500 bg-slate-800/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
            >
                Manage Benefits ({editedCard.benefits.length})
            </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
           
           {activeTab === 'details' && (
               <div className="space-y-6">
                    <div className="flex justify-center">
                        <div className="w-64">
                            <CardVisual card={editedCard} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Nickname</label>
                                <input 
                                    type="text" 
                                    value={editedCard.nickname || ''}
                                    onChange={(e) => setEditedCard({...editedCard, nickname: e.target.value})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. John's Amex"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Last 4 Digits</label>
                                <input 
                                    type="text" 
                                    maxLength={4}
                                    value={editedCard.last4 || ''}
                                    onChange={(e) => setEditedCard({...editedCard, last4: e.target.value.replace(/\D/g,'')})}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 font-mono"
                                    placeholder="0000"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Login URL</label>
                                <div className="relative">
                                    <input 
                                        type="url" 
                                        value={editedCard.loginUrl || ''}
                                        onChange={(e) => setEditedCard({...editedCard, loginUrl: e.target.value})}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-10 py-2 text-white focus:outline-none focus:border-indigo-500"
                                        placeholder="https://..."
                                    />
                                    <IconLink className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Renewal Date</label>
                                <div className="relative">
                                        <input 
                                            type="date" 
                                            value={editedCard.renewalDate || ''}
                                            onChange={(e) => setEditedCard({...editedCard, renewalDate: e.target.value})}
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>
                        
                        {/* Autopay Toggle */}
                        <div>
                             <label className="flex items-center gap-3 cursor-pointer group p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 hover:border-slate-700 transition-colors">
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${editedCard.autoPay ? 'bg-emerald-600 border-emerald-600' : 'bg-slate-900 border-slate-600'}`}>
                                    {editedCard.autoPay && <Check size={14} className="text-white" />}
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="hidden"
                                    checked={editedCard.autoPay || false}
                                    onChange={(e) => setEditedCard({...editedCard, autoPay: e.target.checked})}
                                />
                                <div>
                                    <span className="block text-sm font-medium text-white">Autopay Enabled</span>
                                    <span className="block text-xs text-slate-500">Is this card set to pay the full balance automatically?</span>
                                </div>
                            </label>
                        </div>

                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                            <div className="flex items-center gap-2 mb-3">
                                <Coins size={16} className="text-amber-400" />
                                <span className="text-sm font-medium text-white">Points Tracker</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Program Name</label>
                                    <input 
                                        type="text" 
                                        value={editedCard.pointsName || ''}
                                        onChange={(e) => setEditedCard({...editedCard, pointsName: e.target.value})}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                        placeholder="e.g. Membership Rewards"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Current Balance</label>
                                    <input 
                                        type="number" 
                                        value={editedCard.points || ''}
                                        onChange={(e) => setEditedCard({...editedCard, points: Number(e.target.value)})}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                                <label className="text-xs text-slate-400 uppercase tracking-wider block mb-2">Card Theme</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_THEMES.map((theme, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setEditedCard({...editedCard, colorFrom: theme.from, colorTo: theme.to})}
                                            className={`w-8 h-8 rounded-full bg-gradient-to-br ${theme.from} ${theme.to} border-2 transition-transform hover:scale-110 ${
                                                editedCard.colorFrom === theme.from ? 'border-white shadow-lg scale-110' : 'border-transparent opacity-70'
                                            }`}
                                            title={theme.label}
                                        />
                                    ))}
                                </div>
                        </div>
                    </div>
               </div>
           )}

           {activeTab === 'benefits' && (
               <div className="space-y-4">
                   {!isAddingBenefit ? (
                       <>
                           <p className="text-sm text-slate-400 mb-2">
                               Drag and drop to reorder. Use the eye icon to hide benefits from your main dashboard.
                           </p>
                           <div className="space-y-2">
                               {editedCard.benefits.map((benefit, idx) => (
                                   <div 
                                        key={benefit.id} 
                                        draggable
                                        onDragStart={(e) => {
                                            dragItem.current = idx;
                                            // Visual effect
                                            e.dataTransfer.effectAllowed = 'move';
                                            // Required for Firefox
                                            e.dataTransfer.setData('text/html', '');
                                        }}
                                        onDragEnter={(e) => {
                                            dragOverItem.current = idx;
                                            e.preventDefault();
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDragEnd={handleSort}
                                        className={`flex items-center justify-between bg-slate-950 p-2 rounded-lg border transition-all cursor-move group ${
                                            benefit.isHidden 
                                                ? 'border-slate-800/30 opacity-60' 
                                                : 'border-slate-800 hover:border-indigo-500/30'
                                        }`}
                                   >
                                       {/* Drag Handle */}
                                       <div className="px-2 text-slate-600 group-hover:text-indigo-400">
                                            <GripVertical size={18} />
                                       </div>

                                       {/* Content */}
                                       <div className="flex-1 mr-4 min-w-0">
                                           <div className="flex items-center gap-2 mb-0.5">
                                               <span className={`font-medium text-sm truncate ${benefit.isHidden ? 'text-slate-500 line-through' : 'text-white'}`}>{benefit.title}</span>
                                               {benefit.value > 0 && <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/30 px-1.5 rounded border border-emerald-900/50">${benefit.value}</span>}
                                               <span className="text-[10px] border border-slate-700 px-1.5 rounded text-slate-500">{benefit.category}</span>
                                               {benefit.isHidden && <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 rounded">Hidden</span>}
                                           </div>
                                           <p className="text-[10px] text-slate-500 truncate">{benefit.description}</p>
                                       </div>

                                       {/* Actions */}
                                       <div className="flex items-center gap-1" onMouseDown={(e) => e.stopPropagation()}>
                                            <button 
                                               onClick={(e) => { e.stopPropagation(); handleToggleHidden(benefit.id); }}
                                               className={`p-1.5 rounded-md transition-colors ${benefit.isHidden ? 'text-slate-500 hover:text-slate-300' : 'text-indigo-400 hover:text-indigo-300 bg-indigo-950/20'}`}
                                               title={benefit.isHidden ? "Show Benefit" : "Hide Benefit"}
                                            >
                                               {benefit.isHidden ? <EyeOff size={14} /> : <Eye size={14} />}
                                            </button>
                                            <button 
                                               onClick={(e) => { e.stopPropagation(); handleEditBenefit(benefit); }}
                                               className="text-slate-500 hover:text-white p-1.5 rounded-md hover:bg-slate-800 transition-colors"
                                               title="Edit Benefit"
                                            >
                                               <Edit2 size={14} />
                                            </button>
                                            <button 
                                               onClick={(e) => { e.stopPropagation(); handleRemoveBenefit(benefit.id); }}
                                               className="text-slate-500 hover:text-red-400 p-1.5 rounded-md hover:bg-red-950/30 transition-colors"
                                               title="Remove Benefit"
                                            >
                                               <Trash2 size={14} />
                                            </button>
                                       </div>
                                   </div>
                               ))}
                               {editedCard.benefits.length === 0 && (
                                   <p className="text-center text-slate-500 py-8 text-sm italic">No benefits added yet.</p>
                               )}
                           </div>
                           <button 
                               onClick={() => setIsAddingBenefit(true)}
                               className="w-full py-3 border-2 border-dashed border-slate-800 rounded-xl text-slate-400 hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-slate-900/50 transition-all flex items-center justify-center gap-2 text-sm font-medium mt-4"
                           >
                               <Plus size={16} /> Add Manually
                           </button>
                       </>
                   ) : (
                       <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2">
                           <div className="flex justify-between items-center mb-4">
                               <h3 className="text-sm font-medium text-white">{editingBenefitId ? 'Edit Benefit' : 'New Benefit'}</h3>
                               <button onClick={handleCancelBenefit} className="text-slate-500 hover:text-white">
                                   <X size={16} />
                               </button>
                           </div>
                           <div className="space-y-3">
                               <input 
                                   type="text" 
                                   placeholder="Benefit Title (e.g. $50 Hotel Credit)"
                                   className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                   value={newBenefit.title}
                                   onChange={e => setNewBenefit({...newBenefit, title: e.target.value})}
                               />
                               <textarea 
                                   placeholder="Description"
                                   className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 h-20 resize-none"
                                   value={newBenefit.description}
                                   onChange={e => setNewBenefit({...newBenefit, description: e.target.value})}
                               />
                               <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Value ($)</label>
                                        <input 
                                            type="number" 
                                            placeholder="0"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
                                            value={newBenefit.value}
                                            onChange={e => setNewBenefit({...newBenefit, value: Number(e.target.value)})}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Frequency</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                            value={newBenefit.frequency}
                                            onChange={e => setNewBenefit({...newBenefit, frequency: e.target.value as Frequency})}
                                        >
                                            {Object.values(Frequency).map(f => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                        </select>
                                    </div>
                               </div>
                               <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 block">Category</label>
                                        <select 
                                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                                            value={newBenefit.category}
                                            onChange={e => setNewBenefit({...newBenefit, category: e.target.value})}
                                        >
                                            <option value="Travel">Travel</option>
                                            <option value="Dining">Dining</option>
                                            <option value="Shopping">Shopping</option>
                                            <option value="Entertainment">Entertainment</option>
                                            <option value="Health">Health</option>
                                            <option value="Status">Status</option>
                                            <option value="Insurance">Insurance</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end pb-2 gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-offset-0 focus:ring-0"
                                                checked={newBenefit.isCredit}
                                                onChange={e => setNewBenefit({...newBenefit, isCredit: e.target.checked})}
                                            />
                                            <span className="text-xs text-slate-400">Credit?</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-500 focus:ring-offset-0 focus:ring-0"
                                                checked={newBenefit.isHidden}
                                                onChange={e => setNewBenefit({...newBenefit, isHidden: e.target.checked})}
                                            />
                                            <span className="text-xs text-slate-400">Hide?</span>
                                        </label>
                                    </div>
                               </div>
                               <div className="flex gap-3 mt-2">
                                   <button 
                                       onClick={handleCancelBenefit}
                                       className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded-lg text-sm font-medium transition-colors"
                                   >
                                       Cancel
                                   </button>
                                   <button 
                                       onClick={handleSaveBenefit}
                                       disabled={!newBenefit.title}
                                       className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                                   >
                                       {editingBenefitId ? 'Update Benefit' : 'Add Benefit'}
                                   </button>
                               </div>
                           </div>
                       </div>
                   )}
               </div>
           )}

           <div className="flex justify-between pt-4 border-t border-slate-800 mt-4">
               <button 
                   onClick={handleDelete}
                   className="text-red-400 hover:text-red-300 text-sm flex items-center gap-2 px-2"
               >
                   <Trash2 size={16} /> Remove Card
               </button>
               <div className="flex gap-3">
                   <button 
                       onClick={onClose}
                       className="px-4 py-2 text-slate-400 hover:text-white text-sm"
                   >
                       Cancel
                   </button>
                   <button 
                       onClick={handleSave}
                       className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-indigo-900/20"
                   >
                       <Save size={16} /> Save Changes
                   </button>
               </div>
           </div>

        </div>
      </div>
    </div>
  );
};
