import React from 'react';
import { 
  X, 
  Bookmark, 
  Sparkles, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  Hammer,
  CheckSquare
} from 'lucide-react';
import { BuilderProfile } from '../../types/builderMatch';
import { applicationStore } from '../../features/applications/services/applicationStore';

interface BuilderProfileModalProps {
  builder: BuilderProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onInvite: (builder: BuilderProfile) => void;
  onToggleSave: (id: string) => void;
}

export const BuilderProfileModal: React.FC<BuilderProfileModalProps> = ({
  builder,
  isOpen,
  onClose,
  onInvite,
  onToggleSave
}) => {
  const applications = applicationStore.getApplications();
  const linkedItem = builder ? applications.find(a => 
    a.participationType === 'builder_match' && (
      a.builderMatchData?.matchedBuilderId === builder.id ||
      a.builderMatchData?.matchedBuilderName?.toLowerCase() === builder.name.toLowerCase()
    )
  ) : undefined;

  const handleTrackMatch = () => {
    if (!builder) return;
    applicationStore.createApplicationFromOpportunity({
      roleTitle: `Builder Match — ${builder.name} (${builder.primaryRole})`,
      companyName: 'ProMultiplier Builder Network',
      organization: 'Builder Match Network',
      location: builder.location,
      priority: 'HIGH',
      participationType: 'builder_match',
      builderMatchData: {
        matchedBuilderId: builder.id,
        matchedBuilderName: builder.name,
        matchedBuilderRole: builder.primaryRole,
        matchedBuilderAvatar: builder.avatar,
        matchedBuilderSkills: builder.skills,
        teamName: `${builder.name.split(' ')[0]} & Me Squad`,
        projectTitle: builder.evidence?.[0]?.title || 'Collaborative AI Product Sprint',
        availability: builder.availability,
        collaborationStatus: 'exploring',
        nextAction: 'Send introductory message and propose project scope.'
      }
    });
    window.dispatchEvent(new CustomEvent('career_applications_updated'));
  };

  const handleViewMatchInTracker = (itemId: string) => {
    onClose();
    window.dispatchEvent(new CustomEvent('open_participation_item', { detail: { itemId } }));
  };

  if (!isOpen || !builder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="uppercase tracking-wider font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Builder Profile
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-emerald-700 font-bold">{builder.matchScore}% Match Fit</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(builder.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                builder.isSaved 
                  ? 'text-blue-600 bg-blue-50 border-blue-200' 
                  : 'text-slate-400 hover:text-slate-700 border-slate-200 bg-white hover:bg-slate-50'
              }`}
              title={builder.isSaved ? 'Saved to Saved Builders' : 'Save builder profile'}
            >
              <Bookmark className={`w-4 h-4 ${builder.isSaved ? 'fill-blue-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 overflow-y-auto space-y-6">
          
          {/* Header Profile Info */}
          <div className="flex items-start gap-4">
            <img 
              src={builder.avatar} 
              alt={builder.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-200 shrink-0 shadow-xs" 
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900">{builder.name}</h2>
                <span className="text-xs font-semibold text-slate-400">{builder.handle}</span>
              </div>
              <p className="text-xs font-semibold text-blue-600">{builder.primaryRole}</p>
              <p className="text-xs text-slate-600 leading-relaxed">{builder.headline}</p>

              <div className="pt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {builder.location}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {builder.availability}
                </span>
              </div>
            </div>
          </div>

          {/* Why Complementary */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Complementary Fit Analysis
            </h3>
            <ul className="text-xs text-slate-700 space-y-1.5">
              {builder.whyMatch.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Shipped Evidence & Portfolio (Requirement 7 & 13) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Career Evidence &amp; Shipped Builds ({builder.evidence.length})
              </h3>
              <span className="text-2xs text-slate-500 font-medium">{builder.pastBuildsCount} total builds</span>
            </div>

            <div className="space-y-2.5">
              {builder.evidence.map((ev) => (
                <div key={ev.id} className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-3xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900">{ev.title}</h4>
                    <span className="text-2xs font-semibold text-slate-500">{ev.role}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{ev.outcome}</p>
                  {ev.metrics && (
                    <div className="text-2xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                      Impact: {ev.metrics}
                    </div>
                  )}
                  <div className="pt-1 flex flex-wrap gap-1 text-2xs text-slate-500">
                    {ev.skills.map((s, idx) => (
                      <span key={idx} className="font-medium text-slate-600">
                        {s}{idx < ev.skills.length - 1 ? ' ·' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Potential Gap */}
          {builder.potentialGap && (
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Potential Gap to Balance in Squad:</p>
                <p className="text-2xs text-slate-600 mt-0.5">{builder.potentialGap}</p>
              </div>
            </div>
          )}

          {/* Core Capabilities & Skills */}
          <div className="space-y-2">
            <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Core Capabilities</p>
            <div className="flex flex-wrap gap-1.5">
              {builder.capabilities.map((cap, idx) => (
                <span 
                  key={idx} 
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200/80"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>

            {/* Participation Tracker Action */}
            {linkedItem ? (
              <button
                type="button"
                onClick={() => handleViewMatchInTracker(linkedItem.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-3xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>View in Participation Tracker</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTrackMatch}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-purple-300 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-all cursor-pointer shadow-3xs"
              >
                <Hammer className="w-3.5 h-3.5 text-purple-600" />
                <span>+ Track Match</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onInvite(builder);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Invite to Build Squad</span>
          </button>
        </div>

      </div>
    </div>
  );
};
