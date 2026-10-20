import React from 'react';
import { 
  Building2, 
  ThumbsUp, 
  Star, 
  TrendingUp, 
  Award, 
  Radar, 
  ArrowUpRight, 
  ShieldCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { CareerOpportunity } from '../../types';

interface CompanySignalCardProps {
  opportunity: CareerOpportunity;
  onSelect: (opp: CareerOpportunity) => void;
  onToggleUpvote: (oppId: string) => void;
  onToggleRadar: (opp: CareerOpportunity) => void;
  isInRadar: boolean;
}

export const CompanySignalCard: React.FC<CompanySignalCardProps> = ({
  opportunity,
  onSelect,
  onToggleUpvote,
  onToggleRadar,
  isInRadar,
}) => {
  const signal = opportunity.companySignal || {
    companyRanking: 1,
    upvoteCount: 1000,
    trendingScore: 90,
    communityScore: 4.8,
    awards: ['Top Tech Employer'],
    userHasUpvoted: false
  };

  const hasUpvoted = signal.userHasUpvoted;

  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className="group relative bg-white hover:bg-slate-50/70 rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-2xs hover:shadow-xs p-5 transition-all flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-4">
        
        {/* ROW 1: Ranking Badge & Community Radar */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {signal.companyRanking && (
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                <span>#{signal.companyRanking} Ranked</span>
              </span>
            )}
            
            {signal.employerPopularity && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                {signal.employerPopularity}
              </span>
            )}
          </div>

          {/* Add to Radar */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleRadar(opportunity);
            }}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              isInRadar
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-3xs'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={isInRadar ? 'Tracked in Career Radar' : 'Add to Career Radar'}
          >
            <Radar className={`w-3.5 h-3.5 ${isInRadar ? 'text-blue-600' : 'text-slate-400'}`} />
            <span>{isInRadar ? 'Tracked' : 'Radar'}</span>
          </button>
        </div>

        {/* ROW 2: Organization Logo & Name */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden shrink-0 flex items-center justify-center shadow-3xs">
            {opportunity.organizationLogo ? (
              <img 
                src={opportunity.organizationLogo} 
                alt={opportunity.organization} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <Building2 className="w-6 h-6 text-slate-400" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
              {opportunity.organization}
            </h3>
            <p className="text-2xs text-slate-500 font-medium truncate mt-0.5">
              {opportunity.industry} · {opportunity.location}
            </p>
          </div>
        </div>

        {/* Short Mission / Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
          {opportunity.shortDescription}
        </p>

        {/* ROW 3: Community Score & Trending Metric Strip */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Community Score
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="flex items-center text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(signal.communityScore) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} 
                  />
                ))}
              </div>
              <span className="font-extrabold text-slate-900 text-xs">
                {signal.communityScore}
              </span>
              {signal.reviewCount && (
                <span className="text-2xs text-slate-400">({signal.reviewCount})</span>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Trending Signal
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-extrabold text-indigo-700 text-xs">
                {signal.trendingScore}/100
              </span>
              <span className="text-2xs text-slate-500">Signal Velocity</span>
            </div>
          </div>
        </div>

        {/* Verified Community Awards */}
        {signal.awards && signal.awards.length > 0 && (
          <div className="flex flex-wrap items-center gap-1">
            {signal.awards.map((award, idx) => (
              <span 
                key={idx}
                className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-3xs"
              >
                <Award className="w-2.5 h-2.5 text-amber-500" />
                <span>{award}</span>
              </span>
            ))}
          </div>
        )}

      </div>

      {/* FOOTER: Upvote Interactive Action & View Company */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        
        {/* Transparent Interactive Upvote Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleUpvote(opportunity.id);
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs ${
            hasUpvoted
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
          title={hasUpvoted ? 'Remove your community upvote' : 'Upvote this company in community rankings'}
        >
          <ThumbsUp className={`w-3.5 h-3.5 ${hasUpvoted ? 'fill-white' : 'text-slate-500'}`} />
          <span>{signal.upvoteCount.toLocaleString()}</span>
          <span className="text-[11px] font-normal opacity-90 hidden sm:inline">
            {hasUpvoted ? 'Upvoted' : 'Upvote'}
          </span>
        </button>

        {/* View Company CTA */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(opportunity);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <span>View Company</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
        </button>

      </div>

    </div>
  );
};
