import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  Layers, 
  MessageSquare, 
  Lightbulb, 
  Compass, 
  Cpu, 
  Hammer, 
  Edit3, 
  AlertCircle,
  HelpCircle,
  Check,
  Zap,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  ExpertHelpType, 
  FeedbackContext, 
  FocusArea, 
  FeedbackFormat, 
  ExpertProfile, 
  CreateFeedbackPayload 
} from '../../types/expertFeedback';
import { ExpertFeedbackService } from '../../services/expertFeedbackService';

interface GetExpertFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: Partial<FeedbackContext>;
  initialExpertId?: string;
  onFeedbackRequested: (requestId: string) => void;
}

const HELP_CARDS: {
  type: ExpertHelpType;
  title: string;
  tagline: string;
  icon: React.FC<{ className?: string }>;
}[] = [
  {
    type: 'review_work',
    title: 'Review my work',
    tagline: 'Tell me what\'s strong, weak, and what I should improve.',
    icon: CheckCircle2
  },
  {
    type: 'challenge_thinking',
    title: 'Challenge my thinking',
    tagline: 'Stress-test my assumptions and reasoning under pressure.',
    icon: Lightbulb
  },
  {
    type: 'career_advice',
    title: 'Career advice',
    tagline: 'Help me make a career, role, or strategic trajectory decision.',
    icon: Compass
  },
  {
    type: 'technical_expertise',
    title: 'Technical / domain expertise',
    tagline: 'Help me solve a specific technical or industry architecture question.',
    icon: Cpu
  },
  {
    type: 'practice_coaching',
    title: 'Practice / coaching',
    tagline: 'Help me improve through guided simulation and live feedback.',
    icon: Sparkles
  },
  {
    type: 'build_with_me',
    title: 'Build with me',
    tagline: 'I need someone who can collaborate with me on the actual build.',
    icon: Hammer
  }
];

const FOCUS_AREAS: { key: FocusArea; label: string }[] = [
  { key: 'problem_framing', label: 'Problem framing' },
  { key: 'product_thinking', label: 'Product thinking' },
  { key: 'strategy', label: 'Strategy & trade-offs' },
  { key: 'ux', label: 'UX & ergonomics' },
  { key: 'technical_feasibility', label: 'Technical feasibility' },
  { key: 'business_impact', label: 'Business impact & ROI' },
  { key: 'communication', label: 'Executive communication' },
  { key: 'prioritization', label: 'Prioritization & scope' },
  { key: 'interview_performance', label: 'Interview performance' }
];

export const GetExpertFeedbackModal: React.FC<GetExpertFeedbackModalProps> = ({
  isOpen,
  onClose,
  initialContext,
  initialExpertId,
  onFeedbackRequested
}) => {
  // 1. Context state (auto-populated by default)
  const [context, setContext] = useState<FeedbackContext>({
    careerGoal: initialContext?.careerGoal || 'Become a Senior Product Manager',
    targetRole: initialContext?.targetRole || 'Senior Product Manager',
    roleBlueprintId: initialContext?.roleBlueprintId || 'role-senior-pm',
    relevantCapability: initialContext?.relevantCapability || 'Product Strategy',
    workSubmittedTitle: initialContext?.workSubmittedTitle || 'Product Growth Case: Acme Cloud Trial Activation',
    workSubmittedContent: initialContext?.workSubmittedContent || `We observed that trial-to-active workspace completion dropped from 31% to 19% after releasing multi-workspace permissions.\n\nMy proposed intervention:\n1. Progressive Permission Staging: teams explore features in a sandbox without SOC2 IT admin blockers.\n2. Automated 2-minute compliance audit export for IT procurement officers.\n3. Defined checkpoints: Day-3 collaborative invite rate, Day-7 workspace completion, Day-14 contract signed.`,
    sourceType: initialContext?.sourceType || 'practice',
    readinessScore: initialContext?.readinessScore ?? 76,
    knownSkillGaps: initialContext?.knownSkillGaps || [
      'AI Model Evaluation & System Quality Benchmarking',
      'Executive Strategic Trade-offs & Scope Elimination'
    ]
  });

  const [isEditingContext, setIsEditingContext] = useState(false);
  const [selectedHelpType, setSelectedHelpType] = useState<ExpertHelpType>('review_work');
  const [step, setStep] = useState<'help_type' | 'ai_eval' | 'expert_selection'>('help_type');
  
  // AI review state
  const aiReview = ExpertFeedbackService.generateAIReview(context, selectedHelpType);
  
  // Recommended experts
  const recommendedExperts = ExpertFeedbackService.getRecommendedExperts(context, selectedHelpType);
  const [selectedExpertId, setSelectedExpertId] = useState<string>(initialExpertId || recommendedExperts[0]?.id || 'expert-sarah-chen');

  // Synchronize when modal is opened with new context or expert
  React.useEffect(() => {
    if (isOpen) {
      if (initialContext) {
        setContext(prev => ({
          ...prev,
          ...initialContext,
          knownSkillGaps: initialContext.knownSkillGaps || prev.knownSkillGaps
        }));
      }
      if (initialExpertId) {
        setSelectedExpertId(initialExpertId);
      }
      setStep('help_type');
    }
  }, [isOpen, initialContext, initialExpertId]);
  
  // Focus areas and format
  const [selectedFocus, setSelectedFocus] = useState<FocusArea[]>(['strategy', 'product_thinking', 'prioritization']);
  const [feedbackFormat, setFeedbackFormat] = useState<FeedbackFormat>('session_30');

  // Privacy controls
  const [privacyShared, setPrivacyShared] = useState({
    practiceResponse: true,
    careerGoal: true,
    targetRole: true,
    relevantCapability: true,
    fullCareerProfile: false,
    otherCareerEvidence: false,
    currentApplications: false
  });

  if (!isOpen) return null;

  const handleToggleFocus = (key: FocusArea) => {
    setSelectedFocus(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleSubmitRequest = () => {
    const assignedExpert = recommendedExperts.find(e => e.id === selectedExpertId) || recommendedExperts[0];

    const payload: CreateFeedbackPayload = {
      helpType: selectedHelpType,
      context: context,
      selectedFocusAreas: selectedFocus,
      feedbackFormat: feedbackFormat,
      expertId: assignedExpert?.id,
      expertName: assignedExpert?.name,
      privacyShared: privacyShared
    };

    const newRequest = ExpertFeedbackService.createFeedbackRequest(payload);
    onFeedbackRequested(newRequest.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 text-left">
        
        {/* ==================================================
            1. MODAL HEADER & CONTEXT CALLOUT
            ================================================== */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 space-y-3 sticky top-0 z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  Career OS · Feedback Layer
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  Get Expert Feedback
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Automatically Attached Context Summary (Section 4) */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-3xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Review Context (Auto-Attached)
              </span>

              <button
                type="button"
                onClick={() => setIsEditingContext(!isEditingContext)}
                className="text-2xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingContext ? 'Done Editing' : 'Edit Context'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-2xs">
              <div>
                <span className="text-slate-400 block font-medium">Target Capability</span>
                <span className="font-bold text-slate-800 truncate block">{context.relevantCapability}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Current Readiness</span>
                <span className="font-bold text-blue-600 block">{context.readinessScore}%</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Work Submitted</span>
                <span className="font-bold text-slate-800 truncate block" title={context.workSubmittedTitle}>
                  {context.workSubmittedTitle}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Active Mission</span>
                <span className="font-bold text-slate-800 truncate block">{context.careerGoal}</span>
              </div>
            </div>

            {/* Expandable context editor */}
            {isEditingContext && (
              <div className="pt-2 border-t border-slate-100 space-y-2 animate-in fade-in duration-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Work Title</label>
                  <input
                    type="text"
                    value={context.workSubmittedTitle}
                    onChange={(e) => setContext({ ...context, workSubmittedTitle: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Submitted Answer / Work Snippet</label>
                  <textarea
                    rows={3}
                    value={context.workSubmittedContent}
                    onChange={(e) => setContext({ ...context, workSubmittedContent: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50 font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            2. STEP CONTENT BODY
            ================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STEP 1: WHAT KIND OF HELP DO YOU NEED? */}
          {step === 'help_type' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">What kind of help do you need?</h3>
                <p className="text-2xs text-slate-500">
                  Select the interaction format to match with the ideal specialist or reviewer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {HELP_CARDS.map(card => {
                  const Icon = card.icon;
                  const isSelected = selectedHelpType === card.type;

                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setSelectedHelpType(card.type)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{card.title}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                        </h4>
                        <p className="text-2xs text-slate-500 leading-relaxed">
                          {card.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: AI REVIEW & MODE RECOMMENDATION */}
          {step === 'ai_eval' && (
            <div className="space-y-5">
              
              {/* AI Recommendation Banner (Section 5) */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                    AI Feedback Intelligence
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  {aiReview.recommendationNote}
                </h4>
                <p className="text-2xs text-blue-200">
                  {aiReview.humanExpertRationale}
                </p>
              </div>

              {/* Instant AI Review Output (Section 6) */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      Instant Baseline Evaluation
                    </span>
                    <h4 className="text-xs font-bold text-slate-900">AI Review &amp; Quality Check</h4>
                  </div>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                    {aiReview.capabilityAssessment.capability}: {aiReview.capabilityAssessment.score}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Strengths Identified
                    </span>
                    <ul className="space-y-1">
                      {aiReview.strengths.map((str, idx) => (
                        <li key={idx} className="text-2xs text-emerald-950 font-medium flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1 shrink-0" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Gaps */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100 space-y-1.5">
                    <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                      Gaps to Address
                    </span>
                    <ul className="space-y-1">
                      {aiReview.gaps.map((gap, idx) => (
                        <li key={idx} className="text-2xs text-amber-950 font-medium flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1 shrink-0" />
                          <span>{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Recommended Polish
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    &ldquo;{aiReview.recommendedImprovement}&rdquo;
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: RECOMMENDED EXPERTS & FOCUS SELECTION */}
          {step === 'expert_selection' && (
            <div className="space-y-5">
              
              {/* Expert Selection (Section 7) */}
              <div>
                <h3 className="text-sm font-bold text-slate-900">Recommended Practitioners &amp; Reviewers</h3>
                <p className="text-2xs text-slate-500">
                  Ranked by relevant capability, domain problem alignment, and verified outcomes.
                </p>
              </div>

              <div className="space-y-3">
                {recommendedExperts.map(exp => {
                  const isSelected = selectedExpertId === exp.id;

                  return (
                    <div
                      key={exp.id}
                      onClick={() => setSelectedExpertId(exp.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-indigo-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                            {exp.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{exp.name}</h4>
                              <span className="text-2xs text-slate-400 font-mono">{exp.handle}</span>
                              <span className="text-2xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                                {exp.matchScore}% Match
                              </span>
                            </div>
                            <p className="text-2xs text-slate-600 font-medium">
                              {exp.role} · <span className="text-slate-400">{exp.company}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-auto">
                          {exp.feedbackFormats.map(fmt => (
                            <span key={fmt} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {fmt === 'async' ? 'Async Review' : fmt === 'session_30' ? '30m Session' : '60m Session'}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white/80 border border-slate-100 text-2xs space-y-1">
                        <span className="font-bold text-blue-900 block">Why Recommended:</span>
                        <p className="text-slate-700 leading-relaxed">{exp.whyRecommended}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {exp.skills.slice(0, 4).map((sk, idx) => (
                          <span key={idx} className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.2 rounded">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Focus Areas Checklist (Section 9) */}
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  What should the expert focus on?
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FOCUS_AREAS.map(fa => {
                    const isChecked = selectedFocus.includes(fa.key);
                    return (
                      <button
                        key={fa.key}
                        type="button"
                        onClick={() => handleToggleFocus(fa.key)}
                        className={`px-3 py-1.5 rounded-xl text-2xs font-bold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-blue-600 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {fa.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback Format Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Feedback Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'async', label: 'Async Review', desc: 'Written notes within 24h' },
                    { id: 'session_30', label: '30 min Session', desc: '1:1 video drill' },
                    { id: 'session_60', label: '60 min Session', desc: 'Deep architecture spar' },
                  ].map(fmt => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFeedbackFormat(fmt.id as any)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        feedbackFormat === fmt.id
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{fmt.label}</div>
                      <div className="text-[10px] text-slate-500">{fmt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Privacy and Control (Section 21) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                    Privacy Controls · Shared with Expert
                  </span>
                  <span className="text-2xs text-slate-400">Encrypted in AI Studio sandbox</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-2xs font-semibold text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={privacyShared.practiceResponse} readOnly className="accent-blue-600" />
                    <span>Practice Response</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={privacyShared.careerGoal} readOnly className="accent-blue-600" />
                    <span>Career Goal &amp; Target Role</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={privacyShared.relevantCapability} readOnly className="accent-blue-600" />
                    <span>Target Capability</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={privacyShared.fullCareerProfile} 
                      onChange={(e) => setPrivacyShared({ ...privacyShared, fullCareerProfile: e.target.checked })} 
                      className="accent-blue-600" 
                    />
                    <span>Full Career Profile (Optional)</span>
                  </label>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* ==================================================
            3. FOOTER STEP NAVIGATION
            ================================================== */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          {step === 'help_type' && (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setStep('ai_eval')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Run Instant AI Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          {step === 'ai_eval' && (
            <>
              <button
                type="button"
                onClick={() => setStep('help_type')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Back
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSubmitRequest}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                  title="Use Instant AI Review only"
                >
                  Save AI Review Only
                </button>

                <button
                  type="button"
                  onClick={() => setStep('expert_selection')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <span>Match with Recommended Experts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}

          {step === 'expert_selection' && (
            <>
              <button
                type="button"
                onClick={() => setStep('ai_eval')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Back
              </button>

              <button
                type="button"
                onClick={handleSubmitRequest}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Send Request to {recommendedExperts.find(e => e.id === selectedExpertId)?.name || 'Expert'}</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
