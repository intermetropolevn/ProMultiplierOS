import React from 'react';
import { Target, Compass, Award, ShieldAlert, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { UserCareerProfile } from '../../types';

interface TargetSectionProps {
  profile: UserCareerProfile;
  onEditClick?: () => void;
}

export const TargetSection: React.FC<TargetSectionProps> = ({
  profile,
  onEditClick,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 transition-all">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Active Calibration Targets</h3>
            <p className="text-2xs text-slate-500">Benchmark alignment for interview rubrics and evidence grading</p>
          </div>
        </div>

        {onEditClick && (
          <button
            onClick={onEditClick}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Adjust
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* Role Target */}
        <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Target Role</span>
          <div className="text-xs font-bold text-slate-900 line-clamp-1">
            {profile.targetTitle || profile.targetRole || 'Technical Product Manager'}
          </div>
          <p className="text-2xs text-slate-500">
            {profile.targetRole || 'Product Management'}
          </p>
        </div>

        {/* Domain Target */}
        <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Target Industry Domains</span>
          <div className="text-xs font-bold text-slate-900 line-clamp-1" title={(profile.targetIndustryDomains || [profile.targetDomain || 'Enterprise SaaS']).join(', ')}>
            {(profile.targetIndustryDomains && profile.targetIndustryDomains.length > 0 ? profile.targetIndustryDomains : [profile.targetDomain || 'Enterprise SaaS']).join(' • ')}
          </div>
          <p className="text-2xs text-slate-500">
            {profile.targetIndustryDomains && profile.targetIndustryDomains.length > 1 ? `${profile.targetIndustryDomains.length} active target sectors` : 'Primary target sector calibration'}
          </p>
        </div>

        {/* Level Benchmark */}
        <div className="p-3 bg-slate-50/70 border border-slate-200/70 rounded-xl space-y-1">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400">Seniority Level</span>
          <div className="text-xs font-bold text-slate-900 line-clamp-1">
            {profile.experienceLevel || 'Staff / Principal'}
          </div>
          <p className="text-2xs text-slate-500">
            IC6 / IC7 scope calibration
          </p>
        </div>

      </div>
    </div>
  );
};
