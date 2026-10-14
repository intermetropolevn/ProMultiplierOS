import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Layers,
  Globe,
  Award,
  BookOpen,
  CheckCircle2,
  Loader2,
  AlertCircle,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';
import { industryStore } from '../../../features/industry/services/industryStore';
import { CaseGenerator } from '../../../features/industry/services/caseGenerator';
import { CaseDifficultyLevel, CaseTypeCategory, CaseStudy } from '../../../features/industry/types';

interface AdminAiCaseGenModalProps {
  onClose: () => void;
  onSuccess: (newCase: CaseStudy) => void;
}

const AVAILABLE_SKILLS = [
  'Structuring',
  'Market Sizing',
  'Market Entry',
  'Unit Economics',
  'Quantitative Reasoning',
  'Pricing',
  'Business Acumen',
  'Recommendation',
  'Synthesis',
  'Operational Analysis'
];

export const AdminAiCaseGenModal: React.FC<AdminAiCaseGenModalProps> = ({
  onClose,
  onSuccess
}) => {
  const industries = industryStore.getIndustries();

  const [industryId, setIndustryId] = useState<string>(industries[0]?.id || 'ind-ev');
  const [geography, setGeography] = useState<string>('Vietnam');
  const [caseType, setCaseType] = useState<CaseTypeCategory>('MARKET_ENTRY');
  const [difficulty, setDifficulty] = useState<CaseDifficultyLevel>('INTERMEDIATE');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Structuring',
    'Market Sizing',
    'Unit Economics',
    'Recommendation'
  ]);
  const [topicPrompt, setTopicPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const result = await CaseGenerator.generateCaseFromIndustry({
        industryId,
        geography,
        caseType,
        difficulty,
        focusSkills: selectedSkills,
        topicPrompt: topicPrompt.trim() || undefined
      });

      setIsGenerating(false);
      onSuccess(result.caseStudy);
      onClose();
    } catch (err) {
      setIsGenerating(false);
      console.error('Case generation failed:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Case Generator from Industry Intelligence
              </h3>
              <p className="text-xs text-slate-500">
                Grounds new case studies in verified sector data points & provenance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* Industry Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Target Industry
            </label>
            <select
              value={industryId}
              onChange={(e) => setIndustryId(e.target.value)}
              className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
            >
              {industries.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.parentIndustryId ? `↳ ${ind.name}` : ind.name}
                </option>
              ))}
            </select>
          </div>

          {/* Geography & Case Type Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider block">
                Target Geography
              </label>
              <input
                type="text"
                value={geography}
                onChange={(e) => setGeography(e.target.value)}
                placeholder="e.g. Vietnam, Southeast Asia, Global, US"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 uppercase tracking-wider block">
                Case Type Archetype
              </label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value as CaseTypeCategory)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
              >
                <option value="MARKET_ENTRY">Market Entry</option>
                <option value="PROFITABILITY">Profitability & Cost Reduction</option>
                <option value="MARKET_SIZING">Market Sizing</option>
                <option value="GROWTH">Growth & Expansion</option>
                <option value="PRICING">Pricing & Monetization</option>
                <option value="M_AND_A">M&A / Acquisition</option>
                <option value="OPERATIONS">Operations & Supply Chain</option>
                <option value="STRATEGY">Competitive Strategy</option>
              </select>
            </div>
          </div>

          {/* Difficulty Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Calibrated Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'] as CaseDifficultyLevel[]).map(diff => (
                <button
                  type="button"
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 text-center rounded-xl font-bold transition-all cursor-pointer ${
                    difficulty === diff
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Focus Skills Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Focus Skills Tested ({selectedSkills.length} selected)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_SKILLS.map((skill, idx) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    type="button"
                    key={`gen-skill-${skill}-${idx}`}
                    onClick={() => toggleSkill(skill)}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-100 text-purple-800 border border-purple-300'
                        : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Angle Prompt (Optional) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase tracking-wider block">
              Custom Topic or Angle (Optional)
            </label>
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="e.g. Battery Swapping B2B Fleet Expansion for Couriers"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Provenance & Safety Guarantee */}
          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-purple-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4 text-purple-700" />
              <span>Grounded Architecture Guarantee:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Factual claims are mapped directly to canonical Industry Data Points with publisher IDs. Any synthetic scenario constraints are explicitly tagged with <code className="font-mono bg-purple-200/60 px-1 rounded">[ASSUMPTION]</code>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || selectedSkills.length === 0}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Assembling Case & Exhibits...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Grounded Case Study</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
