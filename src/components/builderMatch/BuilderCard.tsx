import React from 'react';
import { 
  Sparkles, 
  ArrowUpRight, 
  Bookmark, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  Layers 
} from 'lucide-react';
import { BuilderProfile } from '../../types/builderMatch';

interface BuilderCardProps {
  builder: BuilderProfile;
  onSelect: (builder: BuilderProfile) => void;
  onInvite: (builder: BuilderProfile, e: React.MouseEvent) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
}

export const BuilderCard: React.FC<BuilderCardProps> = ({
  builder,
  onSelect,
  onInvite,
  onToggleSave
}) => {
  return (
    <div 
      onClick={() => onSelect(builder)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between p-5 text-left cursor-pointer relative"
    >
      <div className="space-y-3.5">
        
        {/* Header: Avatar, Name, Role, Match %, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src={builder.avatar} 
              alt={builder.name} 
              className="w-11 h-11 rounded-xl object-cover ring-1 ring-slate-200/80 shrink-0" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                  {builder.name}
                </h3>
                <span className="text-2xs font-semibold text-slate-400">{builder.handle}</span>
              </div>
              <p className="text-xs font-medium text-slate-600 line-clamp-1 mt-0.5">
                {builder.headline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Match Percentage Indicator */}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              {builder.matchScore}%
            </span>

            <button
              type="button"
              onClick={(e) => onToggleSave(builder.id, e)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                builder.isSaved 
                  ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={builder.isSaved ? 'Saved to Saved Builders' : 'Save builder profile'}
              aria-label="Save Builder"
            >
              <Bookmark className={`w-3.5 h-3.5 ${builder.isSaved ? 'fill-blue-600' : ''}`} />
            </button>
          </div>
        </div>

        {/* Why Match Highlights (Requirement 7) */}
        <div className="space-y-1.5 pt-1">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Why Complementary</p>
          <ul className="text-xs text-slate-600 space-y-1">
            {builder.whyMatch.slice(0, 2).map((item, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Evidence Highlights (Requirement 7: Shipped products / evidence) */}
        {builder.evidence.length > 0 && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <div className="flex items-center justify-between text-2xs font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Shipped Evidence
              </span>
              <span className="text-slate-400">{builder.evidence[0].role}</span>
            </div>
            <p className="text-xs font-medium text-slate-800 line-clamp-1">
              {builder.evidence[0].title}
            </p>
            <p className="text-2xs text-slate-500 line-clamp-1">
              {builder.evidence[0].outcome}
            </p>
          </div>
        )}

        {/* Potential Gap Alert (Requirement 7) */}
        {builder.potentialGap && (
          <div className="flex items-start gap-1.5 text-2xs text-amber-800 bg-amber-50/80 border border-amber-200/80 rounded-lg p-2 font-medium">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
            <span className="leading-snug">Potential gap: {builder.potentialGap}</span>
          </div>
        )}

        {/* Metadata Strip: Availability & Location */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-3 gap-y-1 text-2xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {builder.availability}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            {builder.location}
          </span>
        </div>

      </div>

      {/* Footer CTAs: View Profile and Invite to Build */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelect(builder)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          View Profile
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onInvite(builder, e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <UserPlus className="w-3.5 h-3.5 text-white" />
          <span>Invite to Build</span>
        </button>
      </div>
    </div>
  );
};
