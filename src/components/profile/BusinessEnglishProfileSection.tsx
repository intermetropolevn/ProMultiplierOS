import React from 'react';
import { 
  Globe, 
  BookOpen, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  Activity, 
  TrendingUp,
  Clock
} from 'lucide-react';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';
import { UserCareerProfile } from '../../types';

interface BusinessEnglishProfileSectionProps {
  profile: UserCareerProfile;
  onNavigateToBusinessEnglish?: (tab?: string) => void;
  className?: string;
}

export const BusinessEnglishProfileSection: React.FC<BusinessEnglishProfileSectionProps> = ({
  profile,
  onNavigateToBusinessEnglish,
  className = ''
}) => {
  const userSets = BusinessEnglishService.getUserVocabularySets();
  const curatedVocabulary = BusinessEnglishService.getVocabularyItems();

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 rounded-3xl p-6 sm:p-7 text-white border border-indigo-800/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black text-white">
              Business English & Executive Communication Portfolio
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            Personalized workplace vocabulary, practice history, and communication calibrations linked to your profile targets.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigateToBusinessEnglish && onNavigateToBusinessEnglish('role_play')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <span>Open Learning Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Target Alignment & Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Target Persona Calibration</span>
          <div className="text-sm font-black text-slate-900">
            {profile.targetRole || 'Senior Staff Engineer'}
          </div>
          <p className="text-xs text-slate-500">
            {profile.targetDomain || 'Fintech & Payments'} • {profile.experienceLevel || 'Senior'}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Active Vocabulary Sets</span>
          <div className="text-2xl font-black text-indigo-600">
            {userSets.length} Sets
          </div>
          <p className="text-xs text-slate-500">
            {userSets.reduce((sum, s) => sum + s.terms.length, 0)} target terms registered
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Communication Index</span>
          <div className="text-2xl font-black text-emerald-600">
            92%
          </div>
          <p className="text-xs text-slate-500">
            Executive Tone & Naturalness calibrated
          </p>
        </div>
      </div>

      {/* User's Synced Vocabulary Collections */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <h4 className="text-sm font-black text-slate-900">
              Synced Workplace Vocabulary Collections ({userSets.length})
            </h4>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToBusinessEnglish && onNavigateToBusinessEnglish('vocabulary')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            Manage Collections →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userSets.map((set) => (
            <div
              key={set.id}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                  {set.domainTag}
                </span>
                <span className="text-[11px] text-slate-400">
                  {set.terms.length} terms
                </span>
              </div>

              <div>
                <h5 className="text-sm font-bold text-slate-900">{set.title}</h5>
                <p className="text-xs text-slate-600 mt-0.5">{set.description}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {set.terms.map((term, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium"
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
