import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  FlaskConical, 
  Lightbulb, 
  Trophy, 
  Building2, 
  HeartHandshake, 
  Layers, 
  Clock, 
  Users 
} from 'lucide-react';
import { BuildIntent, BuildOpportunity, BuildOpportunityType } from '../../types/builderMatch';
import { BuilderMatchService } from '../../services/builderMatchService';

interface StartBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBuildCreated: (newBuild: BuildOpportunity) => void;
  initialIntent?: BuildIntent;
}

export const StartBuildModal: React.FC<StartBuildModalProps> = ({
  isOpen,
  onClose,
  onBuildCreated,
  initialIntent = 'solve_challenge'
}) => {
  if (!isOpen) return null;

  const [intent, setIntent] = useState<BuildIntent>(initialIntent);
  const [roughConcept, setRoughConcept] = useState('');
  const [isAiStructuring, setIsAiStructuring] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState('Enterprise SaaS');
  const [duration, setDuration] = useState('2–4 weeks');
  const [teamSizeNeeded, setTeamSizeNeeded] = useState('Team of 2–3');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  const [capabilitiesNeeded, setCapabilitiesNeeded] = useState('Product Strategy, Frontend Prototyping, AI Engineering');
  const [whoCanParticipate, setWhoCanParticipate] = useState('Open to all builders with complementary capabilities');

  const intentOptions: { id: BuildIntent; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'solve_challenge', label: 'Solve a Challenge', icon: Building2 },
    { id: 'build_product', label: 'Build a Product', icon: Layers },
    { id: 'run_experiment', label: 'Run an Experiment', icon: FlaskConical },
    { id: 'validate_idea', label: 'Validate a Concept', icon: Lightbulb },
    { id: 'build_prototype', label: 'Build a Prototype', icon: Sparkles },
    { id: 'social_impact', label: 'Social Impact', icon: HeartHandshake },
  ];

  const handleAiStructure = () => {
    if (!roughConcept.trim()) return;
    setIsAiStructuring(true);

    setTimeout(() => {
      const structured = BuilderMatchService.aiStructureBuild(roughConcept, intent);
      if (structured.title) setTitle(structured.title);
      if (structured.domain) setDomain(structured.domain);
      if (structured.duration) setDuration(structured.duration);
      if (structured.teamSizeNeeded) setTeamSizeNeeded(structured.teamSizeNeeded);
      if (structured.challenge?.whyItMatters) setWhyItMatters(structured.challenge.whyItMatters);
      if (structured.expectedOutcomes && structured.expectedOutcomes.length > 0) {
        setExpectedOutcome(structured.expectedOutcomes.join('\n'));
      }
      if (structured.idealBuilderProfile?.capabilities) {
        setCapabilitiesNeeded(structured.idealBuilderProfile.capabilities.join(', '));
      }
      setIsAiStructuring(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const capabilities = capabilitiesNeeded.split(',').map(s => s.trim()).filter(Boolean);
    const outcomes = expectedOutcome.split('\n').map(s => s.trim()).filter(Boolean);

    // Determine type
    let type: BuildOpportunityType = 'product_challenge';
    if (intent === 'run_experiment') type = 'ai_experiment';
    else if (intent === 'validate_idea') type = 'product_idea';
    else if (intent === 'build_prototype') type = 'prototype_opportunity';
    else if (intent === 'social_impact') type = 'social_impact';
    else if (intent === 'solve_challenge') type = 'business_challenge';

    const newOpportunity: BuildOpportunity = {
      id: `build-${Date.now()}`,
      title: title || roughConcept || 'Collaborative Builder Sprint',
      intent,
      type,
      status: 'recruiting',
      creator: {
        name: 'You (Alex Chen)',
        organization: 'Independent Builder Squad',
        type: 'individual',
        verified: true
      },
      domain,
      duration,
      teamSizeNeeded,
      difficulty: 'Intermediate',
      workMode: 'Remote',
      matchScore: 95,
      shortDescription: whyItMatters || roughConcept || 'Collaborative sprint to build, test, and validate a working prototype.',
      challenge: {
        context: roughConcept || 'Identified user friction in modern collaborative workflows.',
        currentSituation: 'Current approaches are fragmented or overly manual.',
        problem: roughConcept,
        whyItMatters: whyItMatters || 'Resolving this bottleneck enables significant workflow velocity.',
        whatHasBeenTried: 'Off-the-shelf tools require heavy configuration.',
        constraints: ['Sub-second response latency', 'Accessible responsive interface']
      },
      expectedOutcomes: outcomes.length > 0 ? outcomes : [
        'Build interactive prototype in React / TypeScript',
        'Test with 3–5 representative users',
        'Generate reusable career evidence'
      ],
      availableResources: [
        { name: 'Core Design Tokens', type: 'design_system', detail: 'Tailwind UI components and typography' },
        { name: 'Staging API Access', type: 'api', detail: 'Sandbox testing environment' }
      ],
      idealBuilderProfile: {
        capabilities: capabilities.length > 0 ? capabilities : ['Product Strategy', 'Frontend Prototyping'],
        suggestedRoles: ['Product Lead', 'Fullstack Engineer', 'Product Designer'],
        experienceLevel: 'Intermediate'
      },
      recommendedBuilders: BuilderMatchService.getAllBuilders().slice(0, 3),
      userReadiness: {
        score: 90,
        strengths: ['Initiative Author', 'Product Vision', 'Rapid Execution'],
        gaps: ['Specialized Domain Deep Dive'],
        whatToCloseGap: ['Invite complementary co-builders from Find Builders tab']
      },
      recommendedKnowledge: [
        {
          id: 'kn-new',
          title: 'Rapid Prototyping & Lean Validation Sprints',
          category: 'Framework',
          duration: '15 min read',
          tag: 'Product Strategy',
          relevanceReason: 'Techniques to test assumptions with real builders.'
        }
      ],
      tags: ['Collaborative Build', domain, 'Prototype', intent],
      createdAt: new Date().toISOString().split('T')[0],
      deadline: 'Rolling'
    };

    BuilderMatchService.saveBuildOpportunity(newOpportunity);
    // Also add to My Builds
    BuilderMatchService.joinBuild(newOpportunity, 'Squad Lead / Creator');

    onBuildCreated(newOpportunity);
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
          <div>
            <h3 className="font-extrabold text-base text-slate-900">Start a Build</h3>
            <p className="text-2xs text-slate-500 font-medium">Turn challenges, experiments, and rough ideas into active build squads</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 overflow-y-auto space-y-5 text-xs">
          
          {/* Step 1: Build Intent Selector (Requirement 5 & 10) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-800 text-xs block">
              1. What do you want to do?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {intentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = intent === opt.id;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    onClick={() => setIntent(opt.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-2xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Rough Concept & AI Structuring Assistant (Requirement 10 & 17) */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border border-blue-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Start with a rough idea or problem (AI will structure it)
              </label>
              <button
                type="button"
                onClick={handleAiStructure}
                disabled={!roughConcept.trim() || isAiStructuring}
                className="flex items-center gap-1 px-3 py-1 rounded-lg text-2xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition cursor-pointer shadow-3xs"
              >
                <Sparkles className={`w-3 h-3 ${isAiStructuring ? 'animate-spin' : ''}`} />
                <span>{isAiStructuring ? 'Structuring...' : '✨ AI Structure Build'}</span>
              </button>
            </div>
            <textarea
              value={roughConcept}
              onChange={(e) => setRoughConcept(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none font-medium text-xs"
              placeholder="e.g. Build an autonomous voice reviewer for GitHub pull requests that reduces code review bikeshedding..."
            />
            <p className="text-[10px] text-slate-500">
              Tip: You can start with an incomplete or messy thought. Click "AI Structure Build" to auto-fill deliverables, domain, and capabilities.
            </p>
          </div>

          {/* Step 3: Structured Fields */}
          <div className="space-y-4 pt-1">
            
            {/* Title */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">What are you trying to build? (Title)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Conversational Voice Code Review Agent"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Domain */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. AI & Dev Tools"
                  required
                />
              </div>

              {/* Timeline */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Timeline</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 14 days, 3 weeks"
                  required
                />
              </div>

              {/* Team Size */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Team Size Needed</label>
                <input
                  type="text"
                  value={teamSizeNeeded}
                  onChange={(e) => setTeamSizeNeeded(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 2–3 builders"
                  required
                />
              </div>
            </div>

            {/* Why does it matter? */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Why does it matter? (Problem &amp; Impact)</label>
              <textarea
                value={whyItMatters}
                onChange={(e) => setWhyItMatters(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="Explain the friction, who it helps, and why it's worth building..."
                required
              />
            </div>

            {/* Expected Outcome */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Expected Outcome / Concrete Deliverables (one per line)</label>
              <textarea
                value={expectedOutcome}
                onChange={(e) => setExpectedOutcome(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 resize-none"
                placeholder="• Build interactive prototype&#10;• Test with 5 users&#10;• Deliver architecture documentation"
                required
              />
            </div>

            {/* Capabilities Needed */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Capabilities Needed (comma separated)</label>
              <input
                type="text"
                value={capabilitiesNeeded}
                onChange={(e) => setCapabilitiesNeeded(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Product Strategy, AI Engineering, UX Design"
                required
              />
            </div>

            {/* Who can participate */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700">Who can participate?</label>
              <input
                type="text"
                value={whoCanParticipate}
                onChange={(e) => setWhoCanParticipate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="e.g. Open to all engineers, designers, and product leaders"
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
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
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Publish Build Opportunity</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
