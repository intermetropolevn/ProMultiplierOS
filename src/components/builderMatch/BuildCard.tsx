import React from 'react';
import { 
  Bookmark, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Users, 
  Building2, 
  FlaskConical, 
  Lightbulb, 
  Trophy, 
  HeartHandshake, 
  Cpu, 
  CheckCircle2 
} from 'lucide-react';
import { BuildOpportunity } from '../../types/builderMatch';

interface BuildCardProps {
  opportunity: BuildOpportunity;
  onSelect: (opportunity: BuildOpportunity) => void;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onStartBuildWithTeam?: (opportunity: BuildOpportunity) => void;
}

export const BuildCard: React.FC<BuildCardProps> = ({
  opportunity,
  onSelect,
  onToggleSave
}) => {
  // Format Type Label nicely without static pills
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'business_challenge': return 'Company Challenge';
      case 'product_challenge': return 'Product Challenge';
      case 'tech_challenge': return 'Tech Architecture';
      case 'ai_experiment': return 'AI Experiment';
      case 'growth_experiment': return 'Growth Experiment';
      case 'hackathon': return 'Hackathon';
      case 'social_impact': return 'Social Impact';
      case 'product_idea': return 'Product Idea';
      case 'prototype_opportunity': return 'Prototype';
      case 'research_to_product': return 'Research → Product';
      default: return 'Build Opportunity';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ai_experiment':
      case 'growth_experiment':
        return <FlaskConical className="w-3.5 h-3.5 text-indigo-600" />;
      case 'product_idea':
        return <Lightbulb className="w-3.5 h-3.5 text-amber-600" />;
      case 'hackathon':
        return <Trophy className="w-3.5 h-3.5 text-amber-600" />;
      case 'social_impact':
        return <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
    }
  };

  return (
    <div 
      onClick={() => onSelect(opportunity)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between p-5 text-left cursor-pointer relative"
    >
      <div className="space-y-3.5">
        
        {/* Top Bar: Clean unboxed metadata kicker & Save Bookmark button */}
        <div className="flex items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            {getTypeIcon(opportunity.type)}
            <span className="font-semibold text-slate-800">{getTypeLabel(opportunity.type)}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="truncate max-w-[140px]">{opportunity.domain}</span>
          </div>

          <button
            type="button"
            onClick={(e) => onToggleSave(opportunity.id, e)}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              opportunity.isSaved 
                ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' 
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            title={opportunity.isSaved ? 'Saved to My Builds' : 'Save for later'}
            aria-label="Save Build Opportunity"
          >
            <Bookmark className={`w-4 h-4 ${opportunity.isSaved ? 'fill-blue-600' : ''}`} />
          </button>
        </div>

        {/* Title & Creator */}
        <div>
          <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
            {opportunity.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1.5">
            <span>By {opportunity.creator.name}</span>
            {opportunity.creator.organization && (
              <>
                <span aria-hidden="true" className="text-slate-300">/</span>
                <span className="text-slate-600">{opportunity.creator.organization}</span>
              </>
            )}
          </p>
        </div>

        {/* Short Problem Description */}
        <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
          {opportunity.shortDescription}
        </p>

        {/* Unboxed Metadata Strip (Zero-Pill Discipline: using typographic separators) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-x-2 gap-y-1 text-2xs text-slate-500 font-medium">
          <span className="flex items-center gap-1 text-slate-700">
            <Clock className="w-3 h-3 text-slate-400" />
            {opportunity.duration}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1 text-slate-700">
            <Users className="w-3 h-3 text-slate-400" />
            {opportunity.teamSizeNeeded}
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{opportunity.workMode}</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span>{opportunity.difficulty}</span>
        </div>

      </div>

      {/* Footer Area: Recommended Match & Action */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
        
        {/* Recommended for you match indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Recommended: {opportunity.matchScore}%</span>
        </div>

        {/* Primary CTA (Builder-oriented verb, NEVER "Apply") */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(opportunity);
          }}
          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 group-hover:translate-x-0.5 transition-all cursor-pointer"
        >
          <span>View Challenge</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </div>
  );
};
