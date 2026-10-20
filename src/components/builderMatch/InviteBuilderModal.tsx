import React, { useState } from 'react';
import { 
  X, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  UserPlus, 
  Layers 
} from 'lucide-react';
import { BuilderProfile, BuildOpportunity } from '../../types/builderMatch';

interface InviteBuilderModalProps {
  builder: BuilderProfile | null;
  currentOpportunity?: BuildOpportunity | null;
  availableOpportunities: BuildOpportunity[];
  isOpen: boolean;
  onClose: () => void;
  onSendInvite: (builderId: string, buildId: string, proposedRole: string, note: string) => void;
}

export const InviteBuilderModal: React.FC<InviteBuilderModalProps> = ({
  builder,
  currentOpportunity,
  availableOpportunities,
  isOpen,
  onClose,
  onSendInvite
}) => {
  if (!isOpen || !builder) return null;

  const [selectedBuildId, setSelectedBuildId] = useState<string>(
    currentOpportunity?.id || availableOpportunities[0]?.id || 'custom-idea'
  );
  const [proposedRole, setProposedRole] = useState(builder.primaryRole);
  const [note, setNote] = useState(
    `Hey ${builder.name.split(' ')[0]}, I saw your experience in ${builder.capabilities[0]} and would love to collaborate on this build sprint.`
  );
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendInvite(builder.id, selectedBuildId, proposedRole, note);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              Invite {builder.name} to Build
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-900">Invitation Dispatched!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              {builder.name} has been notified and invited to collaborate on this build.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            
            {/* Builder info strip */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <img 
                src={builder.avatar} 
                alt={builder.name} 
                className="w-10 h-10 rounded-lg object-cover shrink-0" 
              />
              <div>
                <p className="font-bold text-slate-900">{builder.name}</p>
                <p className="text-2xs text-slate-500">{builder.headline}</p>
              </div>
              <span className="ml-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                {builder.matchScore}% Match
              </span>
            </div>

            {/* Select Build Opportunity */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Select Build / Challenge</label>
              <select
                value={selectedBuildId}
                onChange={(e) => setSelectedBuildId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              >
                {availableOpportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title} ({opp.duration})
                  </option>
                ))}
                <option value="custom-idea">Independent New Experiment / Prototype</option>
              </select>
            </div>

            {/* Proposed Role */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Proposed Squad Role</label>
              <input
                type="text"
                value={proposedRole}
                onChange={(e) => setProposedRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Lead Product Strategist, AI Systems Architect"
                required
              />
            </div>

            {/* Collaborative Note */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Collaborative Note</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="Why do you think their background is a great fit?"
                required
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Collaboration Invite</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
