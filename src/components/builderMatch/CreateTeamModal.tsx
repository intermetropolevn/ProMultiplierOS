import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  UserPlus, 
  Clock, 
  Globe 
} from 'lucide-react';
import { BuildTeam, BuildOpportunity } from '../../types/builderMatch';
import { BuilderMatchService } from '../../services/builderMatchService';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeamCreated: (team: BuildTeam) => void;
  availableOpportunities: BuildOpportunity[];
  initialOpportunity?: BuildOpportunity | null;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({
  isOpen,
  onClose,
  onTeamCreated,
  availableOpportunities,
  initialOpportunity
}) => {
  if (!isOpen) return null;

  const [teamName, setTeamName] = useState(
    initialOpportunity ? `${initialOpportunity.title.slice(0, 30)} Squad` : 'Product Innovation Squad'
  );
  const [selectedChallengeId, setSelectedChallengeId] = useState(initialOpportunity?.id || '');
  const [purpose, setPurpose] = useState(
    initialOpportunity 
      ? `Forming a dedicated team to solve and prototype: ${initialOpportunity.title}` 
      : 'Rapidly prototyping and validating a high-impact solution.'
  );
  const [targetOutcome, setTargetOutcome] = useState('Build working interactive prototype and test with 5 target users.');
  const [requiredCapabilities, setRequiredCapabilities] = useState('Product Strategy, AI Systems, UX Design, Growth');
  const [duration, setDuration] = useState('3 weeks');
  const [teamSize, setTeamSize] = useState('3–4 builders');
  const [workMode, setWorkMode] = useState('Remote (Async-First)');
  const [availability, setAvailability] = useState('10 hrs/week · Evenings & Weekends');

  // AI Recommendation preview
  const aiRecommendation = BuilderMatchService.aiRecommendTeam(
    purpose,
    requiredCapabilities.split(',').map(s => s.trim())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const capabilities = requiredCapabilities.split(',').map(s => s.trim()).filter(Boolean);
    const selectedOpp = availableOpportunities.find(o => o.id === selectedChallengeId);

    const newTeam = BuilderMatchService.createTeam({
      name: teamName,
      challengeId: selectedOpp?.id,
      challengeTitle: selectedOpp?.title,
      purpose,
      targetOutcome,
      requiredCapabilities: capabilities,
      teamFitScore: aiRecommendation.fitScore,
      fitStrengths: aiRecommendation.strengths,
      fitGaps: aiRecommendation.gaps,
      members: [
        {
          builder: {
            id: 'current-user',
            name: 'Alex Chen',
            handle: '@alexchen',
            headline: 'Product Lead & Founder',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
            location: 'San Francisco, CA (Remote)',
            primaryRole: 'Product Lead',
            capabilities: ['Product Strategy', 'SaaS', 'Prototyping'],
            skills: ['Product', 'Strategy'],
            availability: '10 hrs/week',
            matchScore: 95,
            whyMatch: ['Squad Creator'],
            evidence: [],
            potentialGap: '',
            pastBuildsCount: 3,
            verifiedEvidenceCount: 2
          },
          role: 'Squad Lead / Product Lead',
          isLead: true,
          status: 'confirmed'
        },
        ...aiRecommendation.recommendedMembers.slice(0, 2).map((b, idx) => ({
          builder: b,
          role: idx === 0 ? 'AI Systems Engineer' : 'Product Designer',
          isLead: false,
          status: 'invited' as const
        }))
      ],
      neededRoles: ['Growth Strategist'],
      duration,
      workMode,
      status: 'recruiting'
    });

    onTeamCreated(newTeam);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Build a Team</h3>
              <p className="text-2xs text-slate-500 font-medium">Create a temporary project squad and match complementary builders</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs">
          
          {/* Team Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Team Name</label>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g. SaaS Activation Strike Team"
              required
            />
          </div>

          {/* Associate with Challenge (Optional) */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Connected Challenge or Build Opportunity (Optional)</label>
            <select
              value={selectedChallengeId}
              onChange={(e) => {
                setSelectedChallengeId(e.target.value);
                const opp = availableOpportunities.find(o => o.id === e.target.value);
                if (opp) {
                  setPurpose(`Forming a dedicated team to solve and prototype: ${opp.title}`);
                }
              }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Independent Squad (No sponsor challenge)</option>
              {availableOpportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.duration})
                </option>
              ))}
            </select>
          </div>

          {/* What are you building & Purpose */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">What are you building? (Purpose)</label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
              placeholder="Explain the build focus and why this squad is being formed..."
              required
            />
          </div>

          {/* Target Outcome */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Target Outcome to Achieve</label>
            <input
              type="text"
              value={targetOutcome}
              onChange={(e) => setTargetOutcome(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g. Build interactive prototype and validate with 5 users"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Duration */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Expected Duration</label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 3 weeks"
                required
              />
            </div>

            {/* Team Size */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Team Size</label>
              <input
                type="text"
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. 3–4 builders"
                required
              />
            </div>

            {/* Work Mode */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Work Mode</label>
              <input
                type="text"
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Remote (Async-first)"
                required
              />
            </div>
          </div>

          {/* Required Capabilities */}
          <div className="space-y-1">
            <label className="font-bold text-slate-700">Required Capabilities (comma separated)</label>
            <input
              type="text"
              value={requiredCapabilities}
              onChange={(e) => setRequiredCapabilities(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g. Product Strategy, AI Systems, UX Design, Growth"
              required
            />
          </div>

          {/* ==================================================
              AI TEAM RECOMMENDATION & FIT PREVIEW (Requirement 9)
              ================================================== */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-white border border-blue-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                AI Recommended Squad Composition
              </h4>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Team Fit: {aiRecommendation.fitScore}%
              </span>
            </div>

            {/* Role Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {aiRecommendation.roleBreakdown.map((item, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-white border border-blue-100 text-center">
                  <span className="text-2xs font-semibold text-slate-500 block truncate">{item.role}</span>
                  <span className="text-xs font-black text-blue-700">{item.matchPercent}%</span>
                </div>
              ))}
            </div>

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-emerald-100 space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Squad Strengths
                </span>
                <p className="text-slate-600 leading-snug">{aiRecommendation.strengths[0]}</p>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-amber-100 space-y-1">
                <span className="font-bold text-amber-800 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  Potential Gaps to Cover
                </span>
                <p className="text-slate-600 leading-snug">{aiRecommendation.gaps[0]}</p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
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
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-white" />
              <span>Invite Team &amp; Create Squad</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
