import React from 'react';
import { 
  Trophy, 
  Rocket, 
  Tag, 
  Building2, 
  Clock, 
  MapPin, 
  Sparkles, 
  ExternalLink, 
  Check, 
  Radar, 
  Gift, 
  DollarSign, 
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { CareerOpportunity } from '../../types';

interface OpportunityCardProps {
  opportunity: CareerOpportunity;
  onSelect: (opp: CareerOpportunity) => void;
  onToggleRadar: (opp: CareerOpportunity) => void;
  isInRadar: boolean;
  onCtaClick?: (opp: CareerOpportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onSelect,
  onToggleRadar,
  isInRadar,
  onCtaClick,
}) => {
  const getTypeBadge = () => {
    switch (opportunity.type) {
      case 'challenge':
        return {
          label: 'Challenge',
          bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
          icon: Trophy,
          iconColor: 'text-amber-600',
        };
      case 'venture':
        return {
          label: 'Venture & Founder',
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
          icon: Rocket,
          iconColor: 'text-indigo-600',
        };
      case 'promotion':
        return {
          label: 'Partner Offer & Deal',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
          icon: Gift,
          iconColor: 'text-emerald-600',
        };
      case 'company_signal':
        return {
          label: 'Company Signal',
          bg: 'bg-purple-50 text-purple-800 border-purple-200/80',
          icon: Building2,
          iconColor: 'text-purple-600',
        };
      default:
        return {
          label: 'Opportunity',
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: Sparkles,
          iconColor: 'text-slate-500',
        };
    }
  };

  const badgeInfo = getTypeBadge();
  const BadgeIcon = badgeInfo.icon;
  const commercial = opportunity.commercial;

  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className="group relative bg-white hover:bg-slate-50/60 rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs p-5 transition-all flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-3.5">
        
        {/* ROW 1: Type Badge, Native Commercial Badge & Radar Button */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeInfo.bg}`}>
              <BadgeIcon className={`w-3 h-3 ${badgeInfo.iconColor}`} />
              <span>{badgeInfo.label}</span>
            </span>

            {/* Subtle Native Commercial Badges (Non-ad network style) */}
            {commercial?.sponsorshipStatus === 'partner' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-600" />
                <span>Partner Opportunity</span>
              </span>
            )}
            {commercial?.sponsorshipStatus === 'sponsored' && (
              <span className="inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200/70 px-1.5 py-0.5 rounded-md">
                Sponsored
              </span>
            )}
            {commercial?.sponsorshipStatus === 'featured' && (
              <span className="inline-flex items-center text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                Featured
              </span>
            )}
            {commercial?.sponsorshipStatus === 'member_benefit' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                <Award className="w-2.5 h-2.5 text-emerald-600" />
                <span>Member Benefit</span>
              </span>
            )}
          </div>

          {/* Add to Radar Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRadar(opportunity);
            }}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isInRadar
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-3xs'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80'
            }`}
            title={isInRadar ? 'Remove from Career Radar' : 'Save / Add to Career Radar'}
          >
            <Radar className={`w-3.5 h-3.5 ${isInRadar ? 'text-blue-600 animate-spin-slow' : 'text-slate-400'}`} />
            <span>{isInRadar ? 'In Radar' : 'Add to Radar'}</span>
          </button>
        </div>

        {/* ROW 2: Organization, Logo, and Opportunity Title */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center">
            {opportunity.organizationLogo ? (
              <img 
                src={opportunity.organizationLogo} 
                alt={opportunity.organization} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-2xs font-semibold text-slate-500 truncate">
              {opportunity.organization}
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
              {opportunity.title}
            </h3>
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {opportunity.shortDescription || opportunity.description}
        </p>

        {/* Reward / Benefit Highlight Badge */}
        {opportunity.reward && (
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 truncate">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{opportunity.reward}</span>
            </div>
            {commercial?.rewardCredits && (
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md shrink-0">
                +{commercial.rewardCredits} Credits
              </span>
            )}
          </div>
        )}

        {/* Recommendation / Match Score Chip (Personalization Readiness) */}
        {opportunity.matchScore && (
          <div className="flex items-center gap-1.5 text-2xs text-slate-500">
            <span className="font-extrabold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-100">
              {opportunity.matchScore}% Match
            </span>
            {opportunity.recommendationReason && (
              <span className="truncate max-w-[220px]">
                {opportunity.recommendationReason}
              </span>
            )}
          </div>
        )}

      </div>

      {/* FOOTER: Metadata Strip + Dynamic Primary CTA */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        
        {/* Location & Deadline */}
        <div className="flex items-center gap-3 text-2xs text-slate-500 flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span className="truncate max-w-[130px]">{opportunity.location}</span>
          </span>

          {opportunity.deadline && (
            <span className="flex items-center gap-1 text-slate-700 font-semibold">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{opportunity.deadline}</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(opportunity);
            }}
            className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Details
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onCtaClick) {
                onCtaClick(opportunity);
              } else if (opportunity.applicationUrl && opportunity.applicationUrl !== '#') {
                window.open(opportunity.applicationUrl, '_blank', 'noopener,noreferrer');
              } else {
                onSelect(opportunity);
              }
            }}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-3xs cursor-pointer active:scale-95"
          >
            <span>{opportunity.ctaText || 'View Opportunity'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </button>
        </div>

      </div>

    </div>
  );
};
