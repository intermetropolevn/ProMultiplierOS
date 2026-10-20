import React from 'react';
import { 
  Users, 
  Sparkles, 
  Clock, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  ArrowUpRight 
} from 'lucide-react';
import { BuildTeam } from '../../types/builderMatch';

interface BuildTeamCardProps {
  team: BuildTeam;
  onSelect: (team: BuildTeam) => void;
  onJoinTeam: (team: BuildTeam, e: React.MouseEvent) => void;
}

export const BuildTeamCard: React.FC<BuildTeamCardProps> = ({
  team,
  onSelect,
  onJoinTeam
}) => {
  return (
    <div 
      onClick={() => onSelect(team)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between p-5 text-left cursor-pointer relative"
    >
      <div className="space-y-3.5">
        
        {/* Header: Team Name, Challenge Connection, Team Fit */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-2xs text-slate-500 font-semibold uppercase tracking-wider">
              <Users className="w-3 h-3 text-blue-600" />
              <span>Temporary Build Squad</span>
            </div>
            <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors mt-0.5">
              {team.name}
            </h3>
            {team.challengeTitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                <span>Building for:</span>
                <span className="text-slate-700 font-semibold truncate max-w-[220px]">
                  {team.challengeTitle}
                </span>
              </p>
            )}
          </div>

          {/* Team Fit Indicator (Requirement 9) */}
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Team Fit: {team.teamFitScore}%</span>
          </div>
        </div>

        {/* Purpose */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {team.purpose}
        </p>

        {/* Current Members & Needed Seats */}
        <div className="space-y-2 pt-1">
          <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">Team Composition</p>
          <div className="flex flex-wrap items-center gap-2">
            {team.members.map((member, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-1.5 p-1 pr-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
              >
                <img 
                  src={member.builder.avatar} 
                  alt={member.builder.name} 
                  className="w-5 h-5 rounded-md object-cover" 
                />
                <span className="font-semibold text-slate-800">{member.role}</span>
                {member.isLead && (
                  <span className="text-[9px] uppercase font-bold text-blue-600 bg-blue-50 px-1 rounded">Lead</span>
                )}
              </div>
            ))}

            {team.neededRoles.map((role, idx) => (
              <div 
                key={idx} 
                className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 text-xs text-amber-900 font-semibold"
              >
                <UserPlus className="w-3 h-3 text-amber-600" />
                <span>Open: {role}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Potential Gaps (Requirement 9) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs pt-1">
          <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100 text-emerald-900 space-y-0.5">
            <span className="font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Strengths
            </span>
            <p className="line-clamp-2 text-slate-600">{team.fitStrengths[0]}</p>
          </div>

          <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100 text-amber-900 space-y-0.5">
            <span className="font-bold flex items-center gap-1">
              <AlertCircle className="w-3 h-3 text-amber-600" />
              Potential Gap
            </span>
            <p className="line-clamp-2 text-slate-600">{team.fitGaps[0] || 'Security compliance review'}</p>
          </div>
        </div>

        {/* Metadata Strip */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-3 text-2xs text-slate-500 font-medium">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            {team.duration}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1">
            <Globe className="w-3 h-3 text-slate-400" />
            {team.workMode}
          </span>
        </div>

      </div>

      {/* Footer CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-xs text-slate-500 font-medium">
          {team.neededRoles.length > 0 ? `${team.neededRoles.length} open role(s)` : 'Squad full'}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onJoinTeam(team, e);
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
        >
          <span>Join Team</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
