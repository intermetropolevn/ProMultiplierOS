import React, { useState, useEffect } from 'react';
import { 
  X, 
  Folder, 
  FolderOpen, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowRight, 
  Users, 
  BookOpen, 
  Clock, 
  Layers,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { 
  ReusableQASet, 
  LiveInterviewStorageService 
} from './liveInterviewData';

interface QASetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSet: (qaSet: ReusableQASet) => void;
}

export const QASetLibraryModal: React.FC<QASetLibraryModalProps> = ({
  isOpen,
  onClose,
  onLoadSet,
}) => {
  const [qaSets, setQaSets] = useState<ReusableQASet[]>([]);
  const [editingSetId, setEditingSetId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQaSets(LiveInterviewStorageService.getSavedQASets());
      setEditingSetId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleStartEdit = (set: ReusableQASet, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSetId(set.id);
    setEditName(set.name);
    setEditDescription(set.description || '');
  };

  const handleSaveEdit = (setId: string, e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    const updated = LiveInterviewStorageService.updateQASetMeta(setId, editName, editDescription);
    setQaSets(updated);
    setEditingSetId(null);
  };

  const handleDelete = (setId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = LiveInterviewStorageService.deleteQASet(setId);
    setQaSets(updated);
  };

  const handleSelectSet = (set: ReusableQASet) => {
    onLoadSet(set);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <FolderOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Reusable Q&amp;A Set Library
              </h3>
              <p className="text-xs text-slate-500">
                Load previously saved interview panels and canonical blueprint configurations.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
          {qaSets.length === 0 ? (
            <div className="p-10 text-center rounded-2xl border-2 border-dashed border-slate-200 space-y-2">
              <Folder className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">No Saved Q&amp;A Sets</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Configure interviewers and blueprints in Pre-Interview processing, then click "Save as Q&amp;A Set" to store reusable presets here.
              </p>
            </div>
          ) : (
            qaSets.map((set) => {
              const isEditing = editingSetId === set.id;
              const bpCount = set.blueprintRefs ? set.blueprintRefs.length : set.selectedBlueprints?.length || 0;
              const roles = Array.from(new Set(set.interviewers.map(i => i.role)));

              if (isEditing) {
                return (
                  <form
                    key={set.id}
                    onSubmit={(e) => handleSaveEdit(set.id, e)}
                    className="p-4 rounded-2xl border-2 border-purple-300 bg-purple-50/40 space-y-3 animate-in fade-in"
                  >
                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1">Set Name</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-purple-900 mb-1">Description</label>
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setEditingSetId(null)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Save Changes
                      </button>
                    </div>
                  </form>
                );
              }

              return (
                <div
                  key={set.id}
                  className="p-4.5 rounded-2xl border border-slate-200 hover:border-purple-300 bg-white hover:bg-purple-50/20 transition-all shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-950">
                        {set.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Updated {set.updatedAt ? new Date(set.updatedAt).toLocaleDateString() : set.createdAt}
                      </span>
                    </div>

                    {set.description && (
                      <p className="text-xs text-slate-600 line-clamp-1">
                        {set.description}
                      </p>
                    )}

                    {/* Metadata chips */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        <Users className="w-3 h-3 text-slate-500" />
                        {set.interviewers.length} Interviewer{set.interviewers.length === 1 ? '' : 's'}
                      </span>

                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-[11px] border border-purple-200/60">
                        <BookOpen className="w-3 h-3 text-purple-600" />
                        {bpCount} Canonical Blueprint{bpCount === 1 ? '' : 's'}
                      </span>

                      {roles.map(r => (
                        <span key={r} className="px-1.5 py-0.2 rounded text-[10px] bg-blue-50 text-blue-700 border border-blue-200">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(set, e)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit set name & description"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => handleDelete(set.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete saved set"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSelectSet(set)}
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Load Set</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>
            Loading a set will dynamically pull the latest canonical versions of each blueprint from your Profile library.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
