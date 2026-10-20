import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  Layers, 
  ArrowUpRight, 
  Link2, 
  Plus, 
  Trash2,
  FolderCheck
} from 'lucide-react';
import { MyBuildItem, CareerEvidence } from '../../types/builderMatch';
import { BuilderMatchService } from '../../services/builderMatchService';

interface AddToCareerEvidenceModalProps {
  buildItem: MyBuildItem | null;
  isOpen: boolean;
  onClose: () => void;
  onEvidenceSaved: (evidence: CareerEvidence) => void;
  onGetExpertReview?: (context: { title: string; content: string; capability: string }) => void;
}

export const AddToCareerEvidenceModal: React.FC<AddToCareerEvidenceModalProps> = ({
  buildItem,
  isOpen,
  onClose,
  onEvidenceSaved,
  onGetExpertReview
}) => {
  if (!isOpen || !buildItem) return null;

  const [challenge, setChallenge] = useState(
    buildItem.careerEvidence?.challenge || 
    'Enterprise operations teams suffered from manual review friction and 45-minute request turnaround bottlenecks.'
  );
  const [role, setRole] = useState(buildItem.role || 'Product Lead');
  const [whatBuilt, setWhatBuilt] = useState(
    buildItem.careerEvidence?.whatBuilt || 
    buildItem.contribution || 
    'Engineered an interactive conversational copilot prototype with AST diff analysis and webhook verification.'
  );
  const [skills, setSkills] = useState(
    buildItem.skills.join(', ') || 'Product Strategy, AI Systems, UX Research, Rapid Experimentation'
  );
  const [duration, setDuration] = useState('3 weeks');
  const [outcome, setOutcome] = useState(
    buildItem.outcome || 'Validated interactive solution with 12 enterprise design partners and demonstrated 40% cycle time reduction.'
  );
  const [metrics, setMetrics] = useState(
    buildItem.metrics || '40% reduction in manual cycle time, 92% user satisfaction'
  );
  const [teamMembers, setTeamMembers] = useState(
    buildItem.team.join(', ') || 'Alex Chen (Product Lead), Dev Patel (Architect), Elena Rostova (Designer)'
  );
  const [demoLink, setDemoLink] = useState('https://github.com/career-os/builder-prototype');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [generatedEvidence, setGeneratedEvidence] = useState<CareerEvidence | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const teamArray = teamMembers.split(',').map(s => s.trim()).filter(Boolean);

    const evidence = BuilderMatchService.convertBuildToEvidence(buildItem.id, {
      buildId: buildItem.id,
      challenge,
      role,
      whatBuilt,
      skills: skillsArray,
      duration,
      outcome,
      metrics,
      teamMembers: teamArray,
      artifacts: [
        { label: 'Interactive Prototype', url: demoLink }
      ]
    });

    setGeneratedEvidence(evidence);
    setSavedSuccess(true);
    onEvidenceSaved(evidence);
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
            <Award className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Add to Career Evidence</h3>
              <p className="text-2xs text-slate-500 font-medium">Convert real completed builds and experiments into structured career portfolio assets</p>
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

        {savedSuccess && generatedEvidence ? (
          <div className="p-8 text-center space-y-5">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-2xs uppercase font-extrabold text-emerald-700 tracking-wider">
                Evidence Verified &amp; Added to Career OS
              </span>
              <h4 className="text-lg font-black text-slate-900">Career Readiness +8% Boost!</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                This completed build is now certified evidence in your Career OS profile, storybank, and live interview blueprint.
              </p>
            </div>

            {/* Evidence Card Preview (Requirement 13) */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-700">{buildItem.title}</span>
                <span className="text-2xs font-bold text-slate-400">{generatedEvidence.duration}</span>
              </div>
              <div className="text-xs text-slate-700 space-y-1">
                <p><strong>Role:</strong> {generatedEvidence.role}</p>
                <p><strong>Skills:</strong> {generatedEvidence.skills.join(', ')}</p>
                <p><strong>Outcome:</strong> {generatedEvidence.outcome}</p>
                {generatedEvidence.metrics && (
                  <p className="text-emerald-700 font-semibold"><strong>Metric:</strong> {generatedEvidence.metrics}</p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition cursor-pointer"
            >
              Done &amp; Return to My Builds
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-4 text-xs">
            
            {/* Build context reminder */}
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-blue-900 space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">Converting Build</span>
              <p className="font-extrabold text-sm text-slate-900">{buildItem.title}</p>
            </div>

            {/* Strengthen Evidence with Expert Review (Requirement 2 & 13) */}
            {onGetExpertReview && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-blue-500/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Want to strengthen this evidence?</span>
                  </div>
                  <p className="text-2xs text-blue-100">
                    Get verified practitioner feedback to validate this solution before logging it into your permanent ledger.
                  </p>
                </div>
                <button
                  type="button"
                  id="btn-evidence-expert-review"
                  onClick={() => {
                    onClose();
                    onGetExpertReview({
                      title: buildItem.title,
                      content: `Build Challenge: ${challenge}\n\nWhat Built: ${whatBuilt}\n\nOutcome: ${outcome}`,
                      capability: skills.split(',')[0]?.trim() || 'Product Strategy'
                    });
                  }}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-2xs rounded-xl shadow-xs transition shrink-0 cursor-pointer"
                >
                  Get Expert Review
                </button>
              </div>
            )}

            {/* What was the challenge? */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">What was the challenge / problem?</label>
              <textarea
                value={challenge}
                onChange={(e) => setChallenge(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Role */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Your Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Product Lead"
                  required
                />
              </div>

              {/* Duration */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 3 weeks"
                  required
                />
              </div>
            </div>

            {/* What did you build? */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">What did you build? (Concrete Deliverable)</label>
              <textarea
                value={whatBuilt}
                onChange={(e) => setWhatBuilt(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
                required
              />
            </div>

            {/* Skills Used */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Skills Used (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Product Strategy, AI, UX, Experimentation"
                required
              />
            </div>

            {/* Outcome & Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Outcome &amp; Validation</label>
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. Reduced manual workflow by 40%"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Quantifiable Metrics</label>
                <input
                  type="text"
                  value={metrics}
                  onChange={(e) => setMetrics(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. -40% cycle time, 92% satisfaction"
                />
              </div>
            </div>

            {/* Team Members */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Team Members &amp; Collaborators</label>
              <input
                type="text"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Alex Chen (Product Lead), Dev Patel (Architect)"
              />
            </div>

            {/* Artifacts Link */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Artifact / Code / Prototype Link</label>
              <input
                type="text"
                value={demoLink}
                onChange={(e) => setDemoLink(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="https://..."
              />
            </div>

            {/* Footer Buttons */}
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
                <FolderCheck className="w-3.5 h-3.5" />
                <span>Save to Career Evidence (+8% Readiness)</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
