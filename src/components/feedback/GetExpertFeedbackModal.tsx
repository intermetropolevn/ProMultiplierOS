import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  MessageSquare, 
  Lightbulb, 
  Compass, 
  Cpu, 
  Hammer, 
  Edit3, 
  AlertCircle,
  Check,
  Zap,
  Award,
  BookOpen,
  Send,
  RotateCcw,
  Target,
  FileText
} from 'lucide-react';
import { 
  ExpertHelpType, 
  FeedbackContext, 
  FocusArea, 
  FeedbackFormat, 
  CreateFeedbackPayload,
  CareerFeedbackSession
} from '../../types/expertFeedback';
import { ExpertFeedbackService } from '../../services/expertFeedbackService';

export interface GetExpertFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContext?: Partial<FeedbackContext>;
  initialExpertId?: string;
  initialSessionId?: string | null;
  initialStep?: 'help_type' | 'ai_eval' | 'expert_selection' | 'feedback_result';
  onFeedbackRequested?: (requestId: string) => void;
  onNavigateToBuilderMatch?: () => void;
  onNavigateToKnowledge?: () => void;
  onAddToCareerEvidence?: (evidenceData: any) => void;
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
  initialSessionId,
  initialStep = 'help_type',
  onFeedbackRequested,
  onNavigateToBuilderMatch,
  onNavigateToKnowledge,
  onAddToCareerEvidence
}) => {
  // 1. Unified Context State (auto-populated from Dashboard / Readiness Confidence Signal)
  const [context, setContext] = useState<FeedbackContext>({
    careerGoal: initialContext?.careerGoal || 'Become an AI Product Manager',
    targetRole: initialContext?.targetRole || 'Senior Product Manager',
    targetDomain: initialContext?.targetDomain || 'AI Product & Enterprise SaaS',
    roleBlueprintId: initialContext?.roleBlueprintId || 'role-senior-pm',
    relevantCapability: initialContext?.relevantCapability || 'Product Strategy',
    workSubmittedTitle: initialContext?.workSubmittedTitle || 'Product Strategy & Strategic Trade-offs',
    workSubmittedContent: initialContext?.workSubmittedContent || `We observed that trial-to-active workspace completion dropped from 31% to 19% after releasing multi-workspace permissions.\n\nMy proposed intervention:\n1. Progressive Permission Staging: teams explore features in a sandbox without SOC2 IT admin blockers.\n2. Automated 2-minute compliance audit export for IT procurement officers.\n3. Defined checkpoints: Day-3 collaborative invite rate, Day-7 workspace completion, Day-14 contract signed.`,
    supportingEvidence: initialContext?.supportingEvidence || [
      'Sandbox Trial Activation Defense',
      'Multi-Workspace Permission Staging Spec'
    ],
    sourceType: initialContext?.sourceType || 'readiness',
    readinessScore: initialContext?.readinessScore ?? 68,
    knownSkillGaps: initialContext?.knownSkillGaps || [
      'AI Model Evaluation & System Quality Benchmarking',
      'Executive Strategic Trade-offs & Scope Elimination'
    ]
  });

  const [isEditingContext, setIsEditingContext] = useState(false);
  const [selectedHelpType, setSelectedHelpType] = useState<ExpertHelpType>('review_work');
  const [step, setStep] = useState<'help_type' | 'ai_eval' | 'expert_selection' | 'feedback_result'>(initialStep);

  // Active Career Feedback Session state for Step 4 (Expert Feedback Result)
  const [activeSession, setActiveSession] = useState<CareerFeedbackSession | null>(() => {
    const all = ExpertFeedbackService.getAllRequests();
    if (initialSessionId) {
      return ExpertFeedbackService.getRequestById(initialSessionId) || all[0] || null;
    }
    return all[0] || null;
  });

  // Result workspace sub-tabs (Expert Feedback | Practice Iterations | Ask Follow-up)
  const [resultTab, setResultTab] = useState<'feedback' | 'iterations' | 'discussion'>('feedback');
  const [isImprovingWork, setIsImprovingWork] = useState(false);
  const [improvedAnswer, setImprovedAnswer] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');
  const [isSimulatingResponse, setIsSimulatingResponse] = useState(false);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [evidenceAttachedSuccess, setEvidenceAttachedSuccess] = useState(false);

  // AI review state
  const aiReview = ExpertFeedbackService.generateAIReview(context, selectedHelpType);

  // Recommended experts
  const recommendedExperts = ExpertFeedbackService.getRecommendedExperts(context, selectedHelpType);
  const [selectedExpertId, setSelectedExpertId] = useState<string>(
    initialExpertId || recommendedExperts[0]?.id || 'expert-sarah-chen'
  );

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

  // Synchronize when modal opens
  useEffect(() => {
    if (isOpen) {
      if (initialContext) {
        setContext(prev => ({
          ...prev,
          ...initialContext,
          targetDomain: initialContext.targetDomain || prev.targetDomain || 'AI Product & Enterprise SaaS',
          supportingEvidence: initialContext.supportingEvidence || prev.supportingEvidence || [
            'Sandbox Trial Activation Defense',
            'Multi-Workspace Permission Staging Spec'
          ],
          knownSkillGaps: initialContext.knownSkillGaps || prev.knownSkillGaps
        }));
      }
      if (initialExpertId) {
        setSelectedExpertId(initialExpertId);
      }
      if (initialSessionId) {
        const found = ExpertFeedbackService.getRequestById(initialSessionId);
        if (found) {
          setActiveSession(found);
          setImprovedAnswer(found.context.workSubmittedContent);
        }
      } else {
        const all = ExpertFeedbackService.getAllRequests();
        if (all[0]) {
          setActiveSession(all[0]);
          setImprovedAnswer(all[0].context.workSubmittedContent);
        }
      }
      setStep(initialStep);
      setResultTab('feedback');
      setEvidenceAttachedSuccess(false);
    }
  }, [isOpen, initialContext, initialExpertId, initialSessionId, initialStep]);

  if (!isOpen) return null;

  const handleToggleFocus = (key: FocusArea) => {
    setSelectedFocus(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Launch or complete session and transition seamlessly into the Expert Feedback Result view
  const handleCompleteFeedbackSession = () => {
    const assignedExpert = recommendedExperts.find(e => e.id === selectedExpertId) || recommendedExperts[0];

    const payload: CreateFeedbackPayload = {
      helpType: selectedHelpType,
      context: context,
      selectedFocusAreas: selectedFocus,
      feedbackFormat: feedbackFormat,
      expertId: assignedExpert?.id,
      expertName: assignedExpert?.name,
      deliverImmediately: true,
      privacyShared: privacyShared
    };

    const createdSession = ExpertFeedbackService.createFeedbackRequest(payload);
    setActiveSession(createdSession);
    setImprovedAnswer(createdSession.context.workSubmittedContent);
    setResultTab('feedback');
    setStep('feedback_result');
    if (onFeedbackRequested) {
      onFeedbackRequested(createdSession.id);
    }
  };

  const handleSimulateDelivery = () => {
    if (!activeSession) return;
    setIsSimulatingResponse(true);
    setTimeout(() => {
      const delivered = ExpertFeedbackService.deliverSimulatedFeedback(activeSession.id);
      if (delivered) {
        setActiveSession({ ...delivered });
      }
      setIsSimulatingResponse(false);
    }, 500);
  };

  const handleSubmitImprovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !improvedAnswer.trim()) return;

    const updated = ExpertFeedbackService.submitPracticeImprovement(activeSession.id, improvedAnswer);
    if (updated) {
      setActiveSession({ ...updated });
      setIsImprovingWork(false);
    }
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSession || !followUpInput.trim()) return;

    const updated = ExpertFeedbackService.sendFollowUpMessage(activeSession.id, followUpInput);
    if (updated) {
      setActiveSession({ ...updated });
      setFollowUpInput('');
      setTimeout(() => {
        const refreshed = ExpertFeedbackService.getRequestById(activeSession.id);
        if (refreshed) setActiveSession({ ...refreshed });
      }, 1400);
    }
  };

  const handleSaveResource = (resourceId: string) => {
    setSavedResourceIds(prev => (prev.includes(resourceId) ? prev : [...prev, resourceId]));
  };

  const handleAttachToMissionAndEvidence = () => {
    if (!activeSession) return;
    if (onAddToCareerEvidence && activeSession.expertFeedback) {
      onAddToCareerEvidence({
        title: activeSession.context.workSubmittedTitle,
        capability: activeSession.context.relevantCapability,
        expertValidation: {
          expertName: activeSession.expertFeedback.expertName,
          score: activeSession.expertFeedback.scoreAfter,
          overallAssessment: activeSession.expertFeedback.overallAssessment,
          deliveredAt: activeSession.expertFeedback.deliveredAt
        },
        outcome: `Validated with ${activeSession.expertFeedback.expertName} (+5% readiness lift: ${activeSession.expertFeedback.scoreBefore}% → ${activeSession.expertFeedback.scoreAfter}%)`
      });
    }
    setEvidenceAttachedSuccess(true);
  };

  const expert = activeSession
    ? ExpertFeedbackService.getExpertById(activeSession.expertId || 'expert-sarah-chen')
    : recommendedExperts[0];
  const hasDeliveredFeedback = Boolean(
    activeSession && activeSession.status === 'feedback_delivered' && activeSession.expertFeedback
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto overflow-x-hidden">
      <div className="fixed inset-0" onClick={onClose} />

      {/* Responsive Modal Container:
          - 14" screens: max-w-2xl / max-w-3xl, zero horizontal overflow
          - 16" screens: xl:max-w-4xl
          - 23" screens: 2xl:max-w-5xl */}
      <div className="relative bg-white w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 text-left">
        
        {/* ==================================================
            1. UNIFIED MODAL HEADER & CANONICAL FLOW STEPPER
            ================================================== */}
        <div className="p-4 sm:p-5 xl:p-6 border-b border-slate-100 bg-slate-50/80 space-y-3 sticky top-0 z-20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Career OS — Feedback Layer
                  </span>
                  {step === 'feedback_result' && activeSession && (
                    <>
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        hasDeliveredFeedback
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {hasDeliveredFeedback ? 'Feedback Delivered' : 'Session Active'}
                      </span>
                      <span className="text-2xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                        Format: {activeSession.feedbackFormat === 'async' ? 'Async Review' : '1:1 Session'}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate">
                  {step === 'feedback_result' && activeSession
                    ? activeSession.context.workSubmittedTitle
                    : 'Get Expert Feedback'}
                </h2>

                {step === 'feedback_result' && activeSession && (
                  <p className="text-xs text-slate-500 font-medium truncate">
                    Target Capability: <strong className="text-slate-800">{activeSession.context.relevantCapability}</strong>
                    {' · '}Reviewer: <strong className="text-blue-700">{activeSession.expertName || 'Sarah Chen'}</strong>
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Quick toggle between Request Setup and Delivered Expert Feedback Result */}
              {step !== 'feedback_result' && activeSession && (
                <button
                  type="button"
                  onClick={() => setStep('feedback_result')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-2xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Open delivered Expert Feedback session"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="hidden sm:inline">Expert Feedback Result</span>
                  <span className="sm:hidden">Result</span>
                </button>
              )}

              {step === 'feedback_result' && (
                <button
                  type="button"
                  onClick={() => setStep('help_type')}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-2xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Configure Context &amp; Format</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Canonical 4-Stage Feedback Flow Indicator */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            {[
              { id: 'help_type', label: '1. Context & Format' },
              { id: 'ai_eval', label: '2. Review / AI Check' },
              { id: 'expert_selection', label: '3. Feedback Session' },
              { id: 'feedback_result', label: '4. Expert Feedback Result' },
            ].map((s, idx) => {
              const isCurrent = step === s.id;
              return (
                <React.Fragment key={s.id}>
                  <button
                    type="button"
                    onClick={() => setStep(s.id as any)}
                    className={`px-2.5 py-1 rounded-lg text-2xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80'
                    }`}
                  >
                    {s.label}
                  </button>
                  {idx < 3 && <span className="text-slate-300 text-xs">→</span>}
                </React.Fragment>
              );
            })}
          </div>

          {/* Auto-Attached Review Context Panel (Shown on Steps 1-3) */}
          {step !== 'feedback_result' && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-3xs space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Review Context
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-2xs">
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

              {/* Extended Auto-Attached Metadata: Role, Domain & Supporting Evidence */}
              <div className="flex flex-wrap items-center gap-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                  <Target className="w-3 h-3 text-blue-600" />
                  Role: {context.targetRole}
                </span>
                {context.targetDomain && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                    Domain: {context.targetDomain}
                  </span>
                )}
                {context.supportingEvidence && context.supportingEvidence.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/70 font-medium">
                    <FileText className="w-3 h-3 text-blue-600" />
                    Evidence: {context.supportingEvidence.join(' · ')}
                  </span>
                )}
              </div>

              {/* Expandable Context Editor */}
              {isEditingContext && (
                <div className="pt-2.5 border-t border-slate-100 space-y-2.5 animate-in fade-in duration-100">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Target Capability</label>
                      <input
                        type="text"
                        value={context.relevantCapability}
                        onChange={(e) => setContext({ ...context, relevantCapability: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Active Career Mission</label>
                      <input
                        type="text"
                        value={context.careerGoal}
                        onChange={(e) => setContext({ ...context, careerGoal: e.target.value })}
                        className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Work Submitted Title</label>
                    <input
                      type="text"
                      value={context.workSubmittedTitle}
                      onChange={(e) => setContext({ ...context, workSubmittedTitle: e.target.value })}
                      className="w-full text-xs p-2 rounded-lg border border-slate-200 bg-slate-50"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Submitted Work / Artifact Content</label>
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
          )}

          {/* Sub-Tabs for Step 4: Expert Feedback Result */}
          {step === 'feedback_result' && activeSession && (
            <div className="flex items-center gap-5 border-t border-slate-200/70 pt-2.5 text-xs font-bold overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setResultTab('feedback')}
                className={`pb-1.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  resultTab === 'feedback'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Expert Feedback</span>
              </button>

              <button
                type="button"
                onClick={() => setResultTab('iterations')}
                className={`pb-1.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  resultTab === 'iterations'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Iterations ({activeSession.iterations?.length || 1})</span>
              </button>

              <button
                type="button"
                onClick={() => setResultTab('discussion')}
                className={`pb-1.5 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  resultTab === 'discussion'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Ask Follow-up ({activeSession.followUpMessages?.length || 0})</span>
              </button>
            </div>
          )}
        </div>

        {/* ==================================================
            2. MODAL BODY CONTENT
            ================================================== */}
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden space-y-6 flex-1 bg-slate-50/30">
          
          {/* STEP 1: CHOOSE INTERACTION FORMAT */}
          {step === 'help_type' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">What kind of help do you need?</h3>
                <p className="text-2xs text-slate-500">
                  Select the interaction format to calibrate your AI check and match with the right domain practitioner.
                </p>
              </div>

              {/* Responsive Interaction Format Selection:
                  - 14" screens (<1400px): stacks into 1 column with full readable descriptions
                  - 16" & 23" screens (>=1400px): 2-column grid */}
              <div className="grid grid-cols-1 min-[1400px]:grid-cols-2 gap-3">
                {HELP_CARDS.map(card => {
                  const Icon = card.icon;
                  const isSelected = selectedHelpType === card.type;

                  return (
                    <button
                      key={card.type}
                      type="button"
                      onClick={() => setSelectedHelpType(card.type)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 relative ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 flex items-center justify-between gap-1.5">
                          <span>{card.title}</span>
                          {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {card.tagline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: INSTANT AI CHECK & REVIEW */}
          {step === 'ai_eval' && (
            <div className="space-y-5">
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

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Recommended Polish Before Practitioner Review
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    &ldquo;{aiReview.recommendedImprovement}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: FEEDBACK SESSION & EXPERT SELECTION */}
          {step === 'expert_selection' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Select Reviewer &amp; Session Format</h3>
                <p className="text-2xs text-slate-500">
                  Ranked by relevant capability ({context.relevantCapability}), domain problem alignment, and verified outcomes.
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
                            <div className="flex flex-wrap items-center gap-2">
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

              {/* Focus Areas Checklist */}
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

              {/* Session Format Choice */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Feedback Format
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'async', label: 'Async Review', desc: 'Written notes within 24h' },
                    { id: 'session_30', label: '1:1 Session (30m)', desc: 'Live calibration drill' },
                    { id: 'session_60', label: '1:1 Deep Dive (60m)', desc: 'Architecture & strategy spar' },
                  ].map(fmt => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFeedbackFormat(fmt.id as FeedbackFormat)}
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
            </div>
          )}

          {/* STEP 4: EXPERT FEEDBACK RESULT (Unified Result Workspace) */}
          {step === 'feedback_result' && activeSession && (
            <div className="space-y-6">
              
              {/* SUB-TAB 1: EXPERT FEEDBACK */}
              {resultTab === 'feedback' && (
                <div className="space-y-5">
                  
                  {/* Submitted Work Summary */}
                  <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-2xs font-extrabold uppercase tracking-wider text-slate-400">
                      <span>Submitted Work &amp; Context</span>
                      <span className="text-blue-600 font-bold">{activeSession.context.sourceType.toUpperCase()} SUBMISSION</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                      {activeSession.context.workSubmittedContent}
                    </div>
                  </div>

                  {/* Delivered Expert Feedback */}
                  {hasDeliveredFeedback && activeSession.expertFeedback ? (
                    <div className="space-y-5 animate-in fade-in duration-200">
                      
                      {/* Reviewer Profile & Readiness Lift Hero Card */}
                      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden border border-blue-500/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white font-black text-base flex items-center justify-center border border-white/20 shrink-0">
                              {activeSession.expertName?.split(' ').map(n => n[0]).join('') || 'SC'}
                            </div>
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-black text-white">{activeSession.expertName}</span>
                                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                                  Verified Practitioner Feedback
                                </span>
                              </div>
                              <p className="text-2xs text-blue-200">{expert?.role} · {expert?.company}</p>
                            </div>
                          </div>

                          {/* Readiness Lift */}
                          <div className="bg-white/10 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/10 text-right shrink-0">
                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">
                              Capability Readiness Lift
                            </span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-xs line-through text-slate-400 font-bold">
                                {activeSession.expertFeedback.scoreBefore}%
                              </span>
                              <span className="text-xl font-black text-emerald-400">
                                → {activeSession.expertFeedback.scoreAfter}%
                              </span>
                              <span className="text-2xs font-extrabold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.2 rounded">
                                +{activeSession.expertFeedback.scoreAfter - activeSession.expertFeedback.scoreBefore}% Lift
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                            Overall Assessment
                          </span>
                          <p className="text-sm font-bold text-white">
                            &ldquo;{activeSession.expertFeedback.overallAssessment}&rdquo;
                          </p>
                        </div>
                      </div>

                      {/* Detailed Feedback: What Worked & What Could Improve */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                          <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            What Worked
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {activeSession.expertFeedback.whatWorked.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            What Could Improve
                          </span>
                          <ul className="space-y-1.5 text-xs text-slate-700">
                            {activeSession.expertFeedback.whatCouldImprove.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Concrete Expert Strategic Recommendation */}
                      <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                          <Lightbulb className="w-4 h-4 text-amber-500" />
                          <span>Expert Strategic Recommendation</span>
                        </div>
                        <p className="text-xs text-blue-950 font-medium leading-relaxed">
                          {activeSession.expertFeedback.expertRecommendation}
                        </p>
                      </div>

                      {/* Recommended Resources */}
                      {activeSession.expertFeedback.recommendedResources && activeSession.expertFeedback.recommendedResources.length > 0 && (
                        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              Recommended Resources from Reviewer
                            </span>
                          </div>

                          <div className="space-y-2">
                            {activeSession.expertFeedback.recommendedResources.map(res => {
                              const isSaved = savedResourceIds.includes(res.id);
                              return (
                                <div key={res.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                                  <div>
                                    <h5 className="text-xs font-bold text-slate-900">{res.title}</h5>
                                    <p className="text-2xs text-slate-500">{res.type}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveResource(res.id)}
                                    className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                                      isSaved
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                    }`}
                                  >
                                    {isSaved ? <Check className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                    <span>{isSaved ? 'Saved to Knowledge' : 'Save Resource'}</span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Recommended Next Action & Mission / Capability Attachment */}
                      <div className="p-5 rounded-3xl bg-white border-2 border-blue-500/40 shadow-md space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                              <Zap className="w-3.5 h-3.5 fill-blue-600" />
                              Recommended Next Action
                            </span>
                            <h3 className="text-sm font-black text-slate-900">
                              Attach Feedback &amp; Advance Your Career Mission
                            </h3>
                            <p className="text-2xs text-slate-500">
                              Connect this expert review to <strong className="text-slate-700">{activeSession.context.careerGoal}</strong> and <strong className="text-slate-700">{activeSession.context.relevantCapability}</strong>.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                          <button
                            type="button"
                            onClick={handleAttachToMissionAndEvidence}
                            className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/60 hover:bg-emerald-50 text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Award className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-emerald-950">
                              {evidenceAttachedSuccess ? 'Attached to Mission!' : 'Attach to Mission'}
                            </h4>
                            <p className="text-[10px] text-emerald-800">
                              Link +5% lift to {activeSession.context.relevantCapability}
                            </p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setIsImprovingWork(true);
                              setResultTab('iterations');
                            }}
                            className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <RotateCcw className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">Improve my work</h4>
                            <p className="text-[10px] text-slate-500">Create a calibrated Practice #2 iteration</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => setResultTab('discussion')}
                            className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-white text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                              <MessageSquare className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-slate-900">Ask a follow-up</h4>
                            <p className="text-[10px] text-slate-500">Clarify trade-offs with {activeSession.expertName}</p>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onNavigateToBuilderMatch) onNavigateToBuilderMatch();
                            }}
                            className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                          >
                            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Hammer className="w-3.5 h-3.5" />
                            </div>
                            <h4 className="text-xs font-bold text-amber-950">Find a Build</h4>
                            <p className="text-[10px] text-amber-800">Prove capability in Builder Match challenge</p>
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                        <Clock className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">Review in progress with {activeSession.expertName}</h3>
                        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                          Your case and context are being reviewed. Expected turnaround is within 24 hours.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSimulateDelivery}
                        disabled={isSimulatingResponse}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        {isSimulatingResponse ? 'Delivering Review...' : `Deliver ${activeSession.expertName}'s Review Now`}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* SUB-TAB 2: PRACTICE ITERATIONS */}
              {resultTab === 'iterations' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Practice Improvement Loop</h3>
                      <p className="text-2xs text-slate-500">
                        Track incremental score calibration between practice attempts
                      </p>
                    </div>

                    {!isImprovingWork && (
                      <button
                        type="button"
                        onClick={() => setIsImprovingWork(true)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                      >
                        + New Iteration
                      </button>
                    )}
                  </div>

                  {isImprovingWork && (
                    <form onSubmit={handleSubmitImprovement} className="p-5 rounded-2xl bg-white border-2 border-blue-500 shadow-md space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-blue-900">
                          Draft Iteration #{(activeSession.iterations?.length || 1) + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsImprovingWork(false)}
                          className="text-2xs text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>

                      <p className="text-2xs text-slate-500">
                        Apply {activeSession.expertName}&apos;s recommendation: explicitly declare what you are NOT building in v1 to protect shipping velocity.
                      </p>

                      <textarea
                        rows={5}
                        value={improvedAnswer}
                        onChange={(e) => setImprovedAnswer(e.target.value)}
                        className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        placeholder="Refine your strategy answer..."
                      />

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsImprovingWork(false)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                        >
                          Submit Calibrated Iteration
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {activeSession.iterations?.map((iter, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                              #{iter.iterationNumber}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900">
                              Practice Attempt #{iter.iterationNumber}
                            </h4>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                              Score: {iter.score}%
                            </span>
                            <span className="text-2xs text-slate-400">
                              {new Date(iter.date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 whitespace-pre-line font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                          {iter.submittedAnswer}
                        </p>

                        {iter.deltaSummary && (
                          <div className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                            {iter.deltaSummary}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUB-TAB 3: ASK FOLLOW-UP */}
              {resultTab === 'discussion' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Direct Expert Coaching Thread</h3>
                    <p className="text-2xs text-slate-500">
                      Ask clarifying questions about the feedback directly with {activeSession.expertName}
                    </p>
                  </div>

                  <div className="space-y-3 min-h-[200px]">
                    {(!activeSession.followUpMessages || activeSession.followUpMessages.length === 0) ? (
                      <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200/80">
                        No follow-up questions asked yet. Ask {activeSession.expertName} for specific tactical advice.
                      </div>
                    ) : (
                      activeSession.followUpMessages.map((msg, idx) => {
                        const isUser = msg.sender === 'user';
                        return (
                          <div
                            key={idx}
                            className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isUser && (
                              <div className="w-7 h-7 rounded-lg bg-indigo-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                {expert?.name[0] || 'S'}
                              </div>
                            )}
                            <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                              isUser 
                                ? 'bg-blue-600 text-white rounded-br-xs' 
                                : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-3xs'
                            }`}>
                              <div className="text-[10px] opacity-75 font-bold mb-1">
                                {msg.senderName}
                              </div>
                              <p>{msg.content}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendFollowUp} className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={followUpInput}
                      onChange={(e) => setFollowUpInput(e.target.value)}
                      placeholder={`Ask ${activeSession.expertName} a follow-up question...`}
                      className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

        </div>

        {/* ==================================================
            3. UNIFIED FOOTER NAVIGATION
            ================================================== */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-3">
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
                  onClick={handleCompleteFeedbackSession}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
                >
                  Skip to Expert Feedback Result
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
                onClick={handleCompleteFeedbackSession}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>
                  Start Session with {recommendedExperts.find(e => e.id === selectedExpertId)?.name || 'Expert'}
                </span>
              </button>
            </>
          )}

          {step === 'feedback_result' && activeSession && (
            <>
              <div className="text-2xs text-slate-500">
                Expert Feedback linked to Career Mission: <strong className="text-slate-800">{activeSession.context.careerGoal}</strong>
                {' · '}Capability: <strong className="text-blue-700">{activeSession.context.relevantCapability}</strong>
              </div>

              <div className="flex items-center gap-2">
                {!evidenceAttachedSuccess && (
                  <button
                    type="button"
                    onClick={handleAttachToMissionAndEvidence}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                  >
                    <Award className="w-3.5 h-3.5" />
                    <span>Attach to Mission &amp; Capability</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
                >
                  Close Workspace
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
