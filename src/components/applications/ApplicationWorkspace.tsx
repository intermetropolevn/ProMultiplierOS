import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Briefcase, 
  Building2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Layers, 
  ExternalLink, 
  ChevronRight, 
  BookOpen, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  Award, 
  CheckSquare, 
  Edit3, 
  Plus, 
  Lock, 
  HelpCircle,
  Eye,
  Share2,
  RefreshCw,
  Send,
  Download,
  AlertTriangle,
  Flame,
  Info,
  Languages,
  Zap
} from 'lucide-react';
import { 
  JobApplication, 
  ApplicationAssessment, 
  ApplicationCase, 
  PreparationTask, 
  ApplicationEvidence,
  JobApplicationStatus,
  ApplicationOutcome,
  CANONICAL_PIPELINE_STAGES
} from '../../features/applications/types';
import { StageTransitionModal } from '../tracker/StageTransitionModal';
import { AddTestAssignmentModal } from '../tracker/AddTestAssignmentModal';
import { ScheduleInterviewModal } from '../tracker/ScheduleInterviewModal';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { ContextualIntelligenceEngine } from '../../features/applications/services/contextualIntelligenceEngine';
import { IngestCaseModal } from './IngestCaseModal';
import { AnonymizeCaseModal } from './AnonymizeCaseModal';
import { MultilingualIntelligenceDashboard } from '../intelligence/MultilingualIntelligenceDashboard';
import { CapabilityActivationInspector } from '../intelligence/activation/CapabilityActivationInspector';
import { JobAssessment } from '../../features/assessments/types';
import { jobAssessmentStore } from '../../features/assessments/services/jobAssessmentStore';
import { JobAssessmentModal } from '../assessments/JobAssessmentModal';

interface ApplicationWorkspaceProps {
  applicationId: string;
  onBack: () => void;
  onStartPracticeSimilarCase?: (caseId: string) => void;
  onOpenSourceInLibrary?: (sourceId: string) => void;
}

export const ApplicationWorkspace: React.FC<ApplicationWorkspaceProps> = ({
  applicationId,
  onBack,
  onStartPracticeSimilarCase,
  onOpenSourceInLibrary
}) => {
  // Load application from store
  const [app, setApp] = useState<JobApplication | undefined>(() => 
    applicationStore.getApplicationById(applicationId)
  );

  const [assessments, setAssessments] = useState<ApplicationAssessment[]>(() => 
    applicationStore.getAssessments(applicationId)
  );

  const activeAssessment = assessments[0];

  const [appCase, setAppCase] = useState<ApplicationCase | undefined>(() => {
    if (activeAssessment?.caseId) {
      return applicationStore.getApplicationCase(activeAssessment.caseId);
    }
    return undefined;
  });

  const [tasks, setTasks] = useState<PreparationTask[]>(() => 
    applicationStore.getPreparationTasks(applicationId)
  );

  const [evidenceList, setEvidenceList] = useState<ApplicationEvidence[]>(() => 
    applicationStore.getEvidence(applicationId)
  );

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'overview' | 'assessment' | 'intelligence' | 'work' | 'prep' | 'review'>('intelligence');
  const [intelSubView, setIntelSubView] = useState<'references' | 'multilingual' | 'activation'>('references');
  const [intelLanguage, setIntelLanguage] = useState<'vi' | 'en'>('vi');

  // First-Class Job Assessment / Case Entity State (Supporting multiple assessments per job)
  const [allJobAssessments, setAllJobAssessments] = useState<JobAssessment[]>(() => 
    jobAssessmentStore.getAssessments()
  );

  const matchedJobAssessments = useMemo(() => {
    if (!app) return [];
    return allJobAssessments.filter(a => 
      a.jobId === applicationId ||
      a.company.toLowerCase() === app.companyName.toLowerCase() ||
      a.jobTitle.toLowerCase().includes(app.roleTitle.toLowerCase()) ||
      app.roleTitle.toLowerCase().includes(a.role.toLowerCase())
    );
  }, [allJobAssessments, applicationId, app]);

  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(() => {
    return matchedJobAssessments[0]?.id || null;
  });

  const selectedAssessment = useMemo(() => {
    if (selectedAssessmentId) {
      return matchedJobAssessments.find(a => a.id === selectedAssessmentId) || matchedJobAssessments[0];
    }
    return matchedJobAssessments[0];
  }, [matchedJobAssessments, selectedAssessmentId]);

  const [activeModalAssessment, setActiveModalAssessment] = useState<JobAssessment | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);

  // Sync assessments when store updates
  React.useEffect(() => {
    const handleAssessmentsChanged = () => {
      setAllJobAssessments(jobAssessmentStore.getAssessments());
    };
    window.addEventListener('career_os_assessments_updated', handleAssessmentsChanged);
    window.addEventListener('career_os_assessment_converted', handleAssessmentsChanged);
    return () => {
      window.removeEventListener('career_os_assessments_updated', handleAssessmentsChanged);
      window.removeEventListener('career_os_assessment_converted', handleAssessmentsChanged);
    };
  }, []);

  // Update selectedAssessmentId if matched assessments change
  React.useEffect(() => {
    if (matchedJobAssessments.length > 0 && (!selectedAssessmentId || !matchedJobAssessments.some(a => a.id === selectedAssessmentId))) {
      setSelectedAssessmentId(matchedJobAssessments[0].id);
    }
  }, [matchedJobAssessments, selectedAssessmentId]);

  // Modals
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [isAnonymizeModalOpen, setIsAnonymizeModalOpen] = useState(false);
  const [isTransitionModalOpen, setIsTransitionModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false);
  
  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Work state
  const [myNotes, setMyNotes] = useState(appCase?.myNotes || '');
  const [myHypotheses, setMyHypotheses] = useState(appCase?.myHypotheses || '');
  const [myAnalysis, setMyAnalysis] = useState(appCase?.myAnalysis || '');
  const [myRecommendation, setMyRecommendation] = useState(appCase?.myRecommendation || '');
  const [showStimulateMode, setShowStimulateMode] = useState(true);
  const [showModelSolution, setShowModelSolution] = useState(false);

  // Review checklist state
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    actualQuestion: true,
    assumptionsExplicit: true,
    calculationsCorrect: true,
    logicalStructure: true,
    evidenceSufficient: false,
    risksAddressed: true,
    alternativesConsidered: false,
    recommendationClear: true,
    executiveFormat: false
  });

  // Outcome state
  const [outcomeStatus, setOutcomeStatus] = useState<ApplicationOutcome['status']>(
    app?.outcome?.status || 'ADVANCED'
  );
  const [companyFeedback, setCompanyFeedback] = useState(app?.outcome?.companyFeedback || '');
  const [selfReview, setSelfReview] = useState(app?.outcome?.selfReview || '');

  // Intelligence sub-category filter
  const [intelFilter, setIntelFilter] = useState<'All' | 'Skills' | 'Knowledge' | 'Industry Data' | 'Industry Intelligence' | 'Similar Cases' | 'Resources'>('All');

  if (!app) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
        <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Application not found</h2>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Generate contextual intelligence dynamically
  const intelligence = useMemo(() => {
    return ContextualIntelligenceEngine.generateIntelligence(app, activeAssessment, appCase);
  }, [app, activeAssessment, appCase]);

  // Compute skill gaps
  const skillGaps = useMemo(() => {
    return ContextualIntelligenceEngine.computeSkillGaps(app, appCase);
  }, [app, appCase]);

  // Filtered intelligence items
  const filteredIntelItems = useMemo(() => {
    if (intelFilter === 'All') return intelligence.items;
    return intelligence.items.filter(i => i.intelligenceType === intelFilter);
  }, [intelligence, intelFilter]);

  // Contextual Nudge
  const activeNudge = useMemo(() => {
    const fullText = `${myNotes} ${myHypotheses} ${myAnalysis} ${myRecommendation}`;
    return ContextualIntelligenceEngine.evaluateNudge(fullText);
  }, [myNotes, myHypotheses, myAnalysis, myRecommendation]);

  // Stimulate mode questions
  const stimulateQuestions = useMemo(() => {
    return ContextualIntelligenceEngine.getStimulateQuestions(appCase);
  }, [appCase]);

  // Readiness calculation
  const readinessScore = useMemo(() => {
    let score = 30; // base from having created application
    if (appCase?.prompt) score += 20;
    if (tasks.length > 0) {
      const done = tasks.filter(t => t.status === 'DONE').length;
      score += Math.round((done / tasks.length) * 25);
    }
    if (myAnalysis.trim().length > 50) score += 15;
    const checkedCount = Object.values(checklist).filter(Boolean).length;
    score += Math.round((checkedCount / 9) * 10);
    return Math.min(100, score);
  }, [appCase, tasks, myAnalysis, checklist]);

  // Save notes & analysis
  const handleSaveWork = () => {
    if (!appCase) return;
    const updatedCase: ApplicationCase = {
      ...appCase,
      myNotes,
      myHypotheses,
      myAnalysis,
      myRecommendation,
      updatedAt: new Date().toISOString()
    };
    applicationStore.saveApplicationCase(updatedCase);
    setAppCase(updatedCase);
    showToast('Work and analysis drafts saved to private workspace.');
  };

  // Toggle preparation task
  const handleToggleTask = (taskId: string) => {
    const updated = applicationStore.toggleTaskStatus(taskId);
    if (updated) {
      setTasks(applicationStore.getPreparationTasks(app.id));
      showToast(updated.status === 'DONE' ? 'Task marked complete.' : 'Task marked to-do.');
    }
  };

  // Record outcome
  const handleSaveOutcome = () => {
    const outcome: ApplicationOutcome = {
      applicationId: app.id,
      status: outcomeStatus,
      decidedAt: new Date().toISOString(),
      companyFeedback,
      selfReview,
      learnings: [
        'Validated unit economics framework early in presentation',
        'Next time: tighten initial hypothesis to under 2 minutes'
      ],
      recommendedFollowUps: [
        'Review Executive Synthesis framework',
        'Complete 2 pricing sensitivity practice drills'
      ]
    };
    const updatedApp = applicationStore.recordOutcome(app.id, outcome);
    if (updatedApp) {
      setApp(updatedApp);
      setEvidenceList(applicationStore.getEvidence(app.id));
      showToast('Outcome and learning loop feedback recorded!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-fade-in border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              title="Return to Applications"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {app.companyName}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-base sm:text-lg font-bold text-blue-600">
                  {app.roleTitle}
                </span>
                {app.isSyntheticSample && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200">
                    SAMPLE / SYNTHETIC
                  </span>
                )}
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  Private Workspace
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {app.location || 'Remote'}
                </span>
                {app.deadline && (
                  <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    Deadline: {new Date(app.deadline).toLocaleDateString()}
                  </span>
                )}
                <span className="text-slate-400">Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Case Readiness</span>
              <div className="flex items-center justify-end gap-1.5 mt-0.5">
                <span className="text-xl font-black text-emerald-600">{readinessScore}%</span>
                <span className="text-[11px] text-slate-400 font-medium">Estimated</span>
              </div>
            </div>

            {/* Canonical Pipeline Stage & State Transition */}
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                Pipeline Stage
              </span>
              <div className="flex items-center gap-2">
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    app.pipelineState === 'applied_screening' ? 'bg-blue-500' :
                    app.pipelineState === 'assessment_case' ? 'bg-purple-500' :
                    app.pipelineState === 'interviews' ? 'bg-indigo-500' :
                    app.pipelineState === 'offer_negotiation' ? 'bg-emerald-500' :
                    'bg-slate-400'
                  }`} />
                  <span className="text-xs font-black text-slate-900">
                    {CANONICAL_PIPELINE_STAGES.find(s => s.id === app.pipelineState)?.title || app.status.replace(/_/g, ' ')}
                  </span>
                  {app.pipelineSubState && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                      {app.pipelineSubState.replace(/_/g, ' ')}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => setIsTransitionModalOpen(true)}
                  className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  Change Stage
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Canonical 5-Stage Stepper */}
        <div className="pt-2 border-t border-slate-100">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {CANONICAL_PIPELINE_STAGES.map((s, idx) => {
              const currentIdx = CANONICAL_PIPELINE_STAGES.findIndex(st => st.id === (app.pipelineState || 'applied_screening'));
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div 
                  key={s.id}
                  onClick={() => setIsTransitionModalOpen(true)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isCurrent 
                      ? 'bg-blue-50/80 border-blue-300 ring-1 ring-blue-400/30' 
                      : isPast 
                      ? 'bg-slate-50 border-slate-200 opacity-80' 
                      : 'bg-white border-slate-100 opacity-50 hover:opacity-100'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-700 truncate">
                    {s.title.split('&')[0].trim()}
                  </div>
                  <div className={`text-[9px] font-bold mt-0.5 ${
                    isCurrent ? 'text-blue-600' : 'text-slate-400'
                  }`}>
                    {isCurrent ? 'Active Stage' : isPast ? 'Passed' : 'Upcoming'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'intelligence', label: 'Career OS Intelligence', icon: Sparkles, badge: intelligence.items.length },
            { id: 'assessment', label: 'Assessment & Case', icon: FileText, badge: appCase ? 'Active' : undefined },
            { id: 'work', label: 'My Work & Analysis', icon: Edit3 },
            { id: 'prep', label: 'Preparation Plan', icon: Target, badge: tasks.filter(t => t.status === 'TODO').length },
            { id: 'overview', label: 'Job & Company Snapshot', icon: Briefcase },
            { id: 'review', label: 'Review & Outcome', icon: Award }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-xs' 
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* TAB 1: CONTEXTUAL INTELLIGENCE */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          
          {/* Top Intelligence Summary Card */}
          <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base sm:text-lg font-black tracking-tight">
                    Career OS Contextual Intelligence
                  </h2>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Proactively synthesized from your profile, the {app.companyName} {app.roleTitle} role description, and verified regional benchmarks. Every item includes an explicit relevance justification.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  {intelligence.items.length} Grounded References
                </span>
              </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
              <div 
                onClick={() => setIntelFilter('Skills')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300 block">Skills to Focus</span>
                <span className="text-xl font-black mt-1 block">{intelligence.skillsCount}</span>
              </div>

              <div 
                onClick={() => setIntelFilter('Knowledge')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-300 block">Knowledge & Models</span>
                <span className="text-xl font-black mt-1 block">{intelligence.knowledgeCount}</span>
              </div>

              <div 
                onClick={() => setIntelFilter('Industry Intelligence')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 block">Market Trends</span>
                <span className="text-xl font-black mt-1 block">{intelligence.items.filter(i => i.intelligenceType === 'Industry Intelligence').length}</span>
              </div>

              <div 
                onClick={() => setIntelFilter('Industry Data')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300 block">Verified Data</span>
                <span className="text-xl font-black mt-1 block">{intelligence.industryDataCount}</span>
              </div>

              <div 
                onClick={() => setIntelFilter('Similar Cases')}
                className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/10 cursor-pointer transition-colors"
              >
                <span className="text-[10px] uppercase font-bold tracking-wider text-rose-300 block">Similar Cases</span>
                <span className="text-xl font-black mt-1 block">{intelligence.similarCasesCount}</span>
              </div>
            </div>
          </div>

          {/* Intelligence Mode Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-1.5">
              <button
                id="btn-intel-subview-references"
                onClick={() => setIntelSubView('references')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  intelSubView === 'references'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Grounded References ({intelligence.items.length})</span>
              </button>

              <button
                id="btn-intel-subview-multilingual"
                onClick={() => setIntelSubView('multilingual')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  intelSubView === 'multilingual'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Languages className="w-3.5 h-3.5 text-emerald-500" />
                <span>Multilingual Semantic Ontology & Audit</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                  VI / EN
                </span>
              </button>

              <button
                id="btn-intel-subview-activation"
                onClick={() => setIntelSubView('activation')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                  intelSubView === 'activation'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>Trigger Engine</span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">
                  L0-L4
                </span>
              </button>
            </div>

            {intelSubView === 'references' && (
              <div className="flex items-center gap-2 px-2 self-end sm:self-auto">
                <span className="text-[11px] font-medium text-slate-400">Language:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setIntelLanguage('vi')}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                      intelLanguage === 'vi' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    VI
                  </button>
                  <button
                    onClick={() => setIntelLanguage('en')}
                    className={`px-2 py-0.5 text-[11px] font-bold rounded cursor-pointer ${
                      intelLanguage === 'en' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    EN
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SUBVIEW 1: MULTILINGUAL INTELLIGENCE & AUDIT SUITE */}
          {intelSubView === 'multilingual' && (
            <MultilingualIntelligenceDashboard
              initialQuery={appCase?.prompt || `${app.roleTitle} at ${app.companyName}`}
            />
          )}

          {/* SUBVIEW 2: GROUNDED REFERENCES CARDS */}
          {intelSubView === 'references' && (
            <>
              {/* Filter Bar */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5">
                  {(['All', 'Skills', 'Knowledge', 'Industry Intelligence', 'Industry Data', 'Similar Cases', 'Resources'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setIntelFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        intelFilter === f 
                          ? 'bg-blue-600 text-white shadow-xs' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400 font-medium shrink-0">
                  Showing {filteredIntelItems.length} items
                </span>
              </div>

              {/* Intelligence Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredIntelItems.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {item.intelligenceType}
                          </span>
                          {item.factType && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                              {item.factType}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                          <span className="text-[10px] font-bold text-emerald-800">{item.relevanceScore}% Match</span>
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 mt-2">
                        {intelLanguage === 'vi' && item.localizedTitle?.vi ? item.localizedTitle.vi : item.title}
                      </h3>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5">{item.subtitle}</p>
                      )}

                      {/* Why am I seeing this? - Section 17 & 39 requirement */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {intelLanguage === 'vi' ? 'Lý do phù hợp:' : 'Why Relevant:'}
                        </span>
                        <p className="text-xs leading-relaxed text-slate-600">
                          {intelLanguage === 'vi' && item.localizedReason?.vi ? item.localizedReason.vi : item.relevanceReason}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                      <span className="text-[11px] text-slate-400 font-medium">Source: Career OS Knowledge Base</span>
                      {item.intelligenceType === 'Similar Cases' && onStartPracticeSimilarCase && (
                        <button
                          onClick={() => onStartPracticeSimilarCase(item.sourceEntityId)}
                          className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Practice Similar Case</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SUBVIEW 3: CAPABILITY ACTIVATION & TRIGGER ENGINE */}
          {intelSubView === 'activation' && (
            <CapabilityActivationInspector
              initialPrompt={appCase?.prompt || `Phân tích job ${app.roleTitle} tại ${app.companyName}, tìm skill gap và đề xuất roadmap.`}
            />
          )}

        </div>
      )}

      {/* TAB 2: FIRST-CLASS JOB ASSESSMENTS & PROBLEM CASES */}
      {activeTab === 'assessment' && (
        <div className="space-y-6">
          
          {/* Header & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Job Assessments & Capability Cases</h2>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {matchedJobAssessments.length} {matchedJobAssessments.length === 1 ? 'Assessment' : 'Assessments'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Capability demonstration events evaluated during hiring at {app.companyName}.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  const newTemplate = jobAssessmentStore.createAssessment({
                    jobId: app.id,
                    jobTitle: app.roleTitle,
                    company: app.companyName,
                    role: app.roleTitle,
                    roleCategory: app.roleCategory,
                    assessmentType: app.roleCategory === 'Product Manager' ? 'GTM Challenge' :
                                    app.roleCategory === 'UX Designer' ? 'Prototype Submission' :
                                    app.roleCategory === 'SEO Specialist' ? 'Audit Report' :
                                    'Strategy Deck',
                    title: `${app.roleCategory === 'Product Manager' ? 'GTM Challenge' : 'Technical Challenge'} for ${app.companyName}`,
                    casePrompt: `Address core challenges for the ${app.roleTitle} role at ${app.companyName}.`
                  });
                  setAllJobAssessments(jobAssessmentStore.getAssessments());
                  setSelectedAssessmentId(newTemplate.id);
                  setActiveModalAssessment(newTemplate);
                  setIsAssessmentModalOpen(true);
                  showToast('Created new assessment track.');
                }}
                className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Assessment / Case</span>
              </button>

              <button
                onClick={() => setIsIngestModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Parse External Prompt</span>
              </button>
            </div>
          </div>

          {/* Multiple Assessments Selector Tabs / Chips */}
          {matchedJobAssessments.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
                {matchedJobAssessments.map((ass, idx) => {
                  const isSelected = selectedAssessment?.id === ass.id;
                  const isConverted = ass.stage === 'converted_to_evidence' || Boolean(ass.convertedEvidenceId);
                  return (
                    <button
                      key={ass.id}
                      onClick={() => setSelectedAssessmentId(ass.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer whitespace-nowrap border ${
                        isSelected 
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                        isSelected ? 'bg-purple-500 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>{ass.assessmentType}</span>
                      {isConverted ? (
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          L6 Evidence
                        </span>
                      ) : ass.evaluation?.score ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                          {ass.evaluation.score}
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {ass.stage.replace(/_/g, ' ')}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected Assessment Content Card */}
              {selectedAssessment && (
                <div className="space-y-6">
                  
                  {/* Top Banner with Convert to Evidence Action */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                            {selectedAssessment.assessmentType}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-800">
                            {selectedAssessment.roleCategory}
                          </span>
                          {selectedAssessment.stage === 'converted_to_evidence' ? (
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              Level {selectedAssessment.evidenceStrength || 6} Validated Career Evidence
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              Stage: {selectedAssessment.stage.replace(/_/g, ' ')}
                            </span>
                          )}
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-slate-900">
                          {selectedAssessment.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                          <span>{selectedAssessment.company}</span>
                          <span>•</span>
                          <span>{selectedAssessment.role}</span>
                          {selectedAssessment.deadline && (
                            <>
                              <span>•</span>
                              <span className="text-amber-700 font-semibold flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                Deadline: {new Date(selectedAssessment.deadline).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveModalAssessment(selectedAssessment);
                            setIsAssessmentModalOpen(true);
                          }}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          <span>Open Full Inspector</span>
                        </button>

                        {selectedAssessment.stage !== 'converted_to_evidence' ? (
                          <button
                            onClick={() => {
                              const { assessment: converted } = jobAssessmentStore.convertToEvidence(selectedAssessment.id);
                              setAllJobAssessments(jobAssessmentStore.getAssessments());
                              showToast(`Case converted to Level 6 Career Evidence!`);
                            }}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>Convert to Career Evidence</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              if (onOpenSourceInLibrary && selectedAssessment.convertedEvidenceId) {
                                onOpenSourceInLibrary(selectedAssessment.convertedEvidenceId);
                              } else {
                                setActiveModalAssessment(selectedAssessment);
                                setIsAssessmentModalOpen(true);
                              }
                            }}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>View in Evidence Ledger</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 7-Step Capability Lifecycle */}
                    <div className="p-3.5 bg-slate-900 rounded-2xl text-white text-xs overflow-x-auto">
                      <div className="flex items-center justify-between min-w-[560px]">
                        <span className="text-slate-400 font-medium">Job</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-blue-400 font-bold">Assessment</span>
                        <span className="text-slate-600">→</span>
                        <span className="text-slate-300 font-bold">Case</span>
                        <span className="text-slate-600">→</span>
                        <span className={selectedAssessment.submission?.content ? 'text-emerald-400 font-bold' : 'text-slate-500'}>Submission</span>
                        <span className="text-slate-600">→</span>
                        <span className={selectedAssessment.evaluation?.score ? 'text-purple-400 font-bold' : 'text-slate-500'}>Evaluation</span>
                        <span className="text-slate-600">→</span>
                        <span className={selectedAssessment.skillsDemonstrated.length > 0 ? 'text-cyan-400 font-bold' : 'text-slate-500'}>Demonstrated Skills</span>
                        <span className="text-slate-600">→</span>
                        <span className={selectedAssessment.stage === 'converted_to_evidence' ? 'text-amber-400 font-black' : 'text-slate-500'}>Career Evidence</span>
                      </div>
                    </div>
                  </div>

                  {/* Problem Case Prompt & Constraints */}
                  <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 space-y-4 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Case Prompt & Question</h4>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
                      {selectedAssessment.casePrompt}
                    </div>

                    {selectedAssessment.constraints && selectedAssessment.constraints.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">Constraints</span>
                        <div className="flex flex-wrap gap-2">
                          {selectedAssessment.constraints.map((con, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-100">
                              {con}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submission & Evaluation Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Candidate Submission */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Candidate Deliverables & Submission</h4>
                        <span className="text-[11px] text-slate-400">
                          {selectedAssessment.submission?.submittedAt 
                            ? new Date(selectedAssessment.submission.submittedAt).toLocaleDateString()
                            : 'In Progress'}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 max-h-40 overflow-y-auto leading-relaxed">
                        {selectedAssessment.submission?.content || 'No submission text recorded yet.'}
                      </div>

                      {selectedAssessment.submission?.url && (
                        <div className="pt-1">
                          <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Deliverable Link</span>
                          <a
                            href={selectedAssessment.submission.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline font-bold inline-flex items-center gap-1 truncate max-w-full"
                          >
                            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate">{selectedAssessment.submission.url}</span>
                          </a>
                        </div>
                      )}

                      {selectedAssessment.submission?.attachments && selectedAssessment.submission.attachments.length > 0 && (
                        <div className="pt-1 space-y-1.5">
                          <span className="text-[11px] text-slate-400 block font-semibold">Attachments</span>
                          <div className="space-y-1">
                            {selectedAssessment.submission.attachments.map(att => (
                              <div key={att.id} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                                <span className="font-semibold text-slate-800 truncate">{att.name}</span>
                                <span className="text-[10px] text-slate-400 shrink-0">{att.type}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Evaluation & Result */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5" />
                          <span>Hiring Team Evaluation & Feedback</span>
                        </h4>
                        {selectedAssessment.evaluation?.result && (
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                            {selectedAssessment.evaluation.result}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                          <span className="text-[10px] uppercase font-bold text-purple-700 block">Score / Tier</span>
                          <span className="text-sm font-black text-purple-950 mt-0.5 block">
                            {selectedAssessment.evaluation?.score || 'Pending Grade'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-500 block">Evaluator</span>
                          <span className="text-xs font-bold text-slate-800 mt-0.5 block truncate">
                            {selectedAssessment.evaluation?.evaluatorName || 'Review Committee'}
                          </span>
                        </div>
                      </div>

                      {selectedAssessment.evaluation?.feedback && (
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1 font-semibold">Feedback</span>
                          <p className="text-xs text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                            "{selectedAssessment.evaluation.feedback}"
                          </p>
                        </div>
                      )}

                      {/* Demonstrated Skills Proof */}
                      {selectedAssessment.skillsDemonstrated.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 space-y-2">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                            Demonstrated Skills Proven
                          </span>
                          <div className="space-y-1.5">
                            {selectedAssessment.skillsDemonstrated.map((sk, idx) => (
                              <div key={idx} className="p-2 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs flex items-center justify-between">
                                <span className="font-bold text-emerald-950">{sk.skillName}</span>
                                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                  Level {sk.level} Validated
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Lessons Learned & Retrospective */}
                  {selectedAssessment.lessonsLearned && (
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-2 shadow-2xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Candidate Retrospective & Lessons Learned
                      </h4>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {selectedAssessment.lessonsLearned}
                      </p>
                    </div>
                  )}

                  {/* Reusable Career OS Outputs (When Converted) */}
                  {selectedAssessment.stage === 'converted_to_evidence' && selectedAssessment.reusableOutputs && (
                    <div className="bg-gradient-to-br from-amber-50/60 to-purple-50/60 rounded-3xl p-6 sm:p-7 border border-amber-200/80 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5 text-amber-600" />
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                            Active Career OS Reusable Outputs
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Integrated Across 6 Subsystems
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-blue-600 block">1. Profile Badge</span>
                          <p className="text-[11px] text-slate-700 leading-normal">{selectedAssessment.reusableOutputs.profileStatement}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-600 block">2. Skill Intelligence</span>
                          <p className="text-[11px] text-slate-700 leading-normal">{selectedAssessment.reusableOutputs.skillIntelligenceProof}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-purple-600 block">3. Job Match Boost</span>
                          <p className="text-[11px] text-slate-700 leading-normal">{selectedAssessment.reusableOutputs.jobMatchBoost}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-rose-600 block">4. Interview Prep (STAR)</span>
                          <p className="text-[11px] text-slate-700 leading-normal font-medium">
                            {selectedAssessment.reusableOutputs.interviewStory?.practicePrompt || 'Ready to practice.'}
                          </p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-indigo-600 block">5. Portfolio Deliverable</span>
                          <p className="text-[11px] text-slate-700 leading-normal">{selectedAssessment.reusableOutputs.portfolioHighlight}</p>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-amber-600 block">6. Career Narrative Bullet</span>
                          <p className="text-[11px] text-slate-700 leading-normal font-mono">{selectedAssessment.reusableOutputs.careerNarrativeBullet}</p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Assessments or Cases Attached Yet</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Employers often assign take-home cases, coding challenges, design exercises, or strategy prompts. Track every assessment as a first-class capability demonstration event.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const newTemplate = jobAssessmentStore.createAssessment({
                      jobId: app.id,
                      jobTitle: app.roleTitle,
                      company: app.companyName,
                      role: app.roleTitle,
                      roleCategory: app.roleCategory,
                      assessmentType: app.roleCategory === 'Product Manager' ? 'Product Case' :
                                      app.roleCategory === 'UX Designer' ? 'Design Challenge' :
                                      app.roleCategory === 'SEO Specialist' ? 'SEO Audit' :
                                      'Growth Case',
                      title: `${app.roleCategory === 'Product Manager' ? 'Product Case' : 'Assessment'} for ${app.companyName}`,
                      casePrompt: `Address core challenges for the ${app.roleTitle} role at ${app.companyName}.`
                    });
                    setAllJobAssessments(jobAssessmentStore.getAssessments());
                    setSelectedAssessmentId(newTemplate.id);
                    setActiveModalAssessment(newTemplate);
                    setIsAssessmentModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs transition-colors"
                >
                  Create Assessment Track
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: MY WORK & ANALYSIS */}
      {activeTab === 'work' && (
        <div className="space-y-6">
          
          {/* Socratic "Stimulate" Mode Banner (Section 20 & 22) */}
          <div className="bg-linear-to-r from-blue-50 to-indigo-50/70 border border-blue-200/80 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  "STIMULATE" MODE — WHAT SHOULD I THINK ABOUT?
                </h3>
              </div>
              <button
                onClick={() => setShowStimulateMode(!showStimulateMode)}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                {showStimulateMode ? 'Hide prompts' : 'Expand reasoning prompts'}
              </button>
            </div>

            {showStimulateMode && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {stimulateQuestions.map((q, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-white/80 border border-blue-100 text-xs text-slate-700 flex items-start gap-2">
                    <span className="text-blue-600 font-bold shrink-0">→</span>
                    <span className="leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-time Contextual Nudge (Section 21) */}
          {activeNudge && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900 animate-fade-in">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">💡 Contextual Nudge ({activeNudge.topic}):</span>
                <p className="text-amber-800 leading-relaxed">{activeNudge.nudge}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activeNudge.relevantConcepts.map((c, idx) => (
                    <span key={`concept-${c}-${idx}`} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Structured Work Drafting Tabs */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Your Private Candidate Analysis</h3>
                <p className="text-xs text-slate-500">Draft your notes, hypotheses, quantitative sizing, and recommendations.</p>
              </div>

              <button
                onClick={handleSaveWork}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Analysis Draft</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  1. Notes & Key Problem Observations
                </label>
                <textarea
                  value={myNotes}
                  onChange={(e) => setMyNotes(e.target.value)}
                  placeholder="Capture raw observations, market dynamics, initial constraints..."
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  2. Core Hypotheses & Strategic Scenarios
                </label>
                <textarea
                  value={myHypotheses}
                  onChange={(e) => setMyHypotheses(e.target.value)}
                  placeholder="Hypothesis 1: Beachhead in Country X with localized Tiered Pricing...&#10;Hypothesis 2: Direct sales will underperform vs distributor partnerships..."
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  3. Quantitative Sizing & Unit Economics Modeling
                </label>
                <textarea
                  value={myAnalysis}
                  onChange={(e) => setMyAnalysis(e.target.value)}
                  placeholder="TAM = 8,900 firms x 20 seats x $144/yr = $6.9M SAM...&#10;CAC via distributor = $1,800. LTV @ 78% margin = $5,616. LTV/CAC = 3.12x..."
                  rows={4}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-hidden leading-relaxed font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  4. Executive Recommendation & 24-Month Roadmap
                </label>
                <textarea
                  value={myRecommendation}
                  onChange={(e) => setMyRecommendation(e.target.value)}
                  placeholder="Structured executive recommendation (Minto Pyramid): Lead with clear decision, followed by 3 core pillars and mitigation actions..."
                  rows={4}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-hidden leading-relaxed"
                />
              </div>
            </div>

            {/* Model Solution Sparing Mechanism (Section 22) */}
            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Career OS Model Solution Rubric</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Career OS prioritizes your own reasoning first. Only view the benchmark solution when ready to cross-calibrate.
                  </p>
                </div>
                <button
                  onClick={() => setShowModelSolution(!showModelSolution)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-200/70 transition-colors cursor-pointer"
                >
                  {showModelSolution ? 'Hide Model Rubric' : 'Reveal Model Rubric'}
                </button>
              </div>

              {showModelSolution && (
                <div className="mt-3 p-5 rounded-2xl bg-slate-900 text-slate-200 text-xs space-y-3 font-mono leading-relaxed">
                  <span className="text-emerald-400 font-bold block">MODEL SOLUTION SYNTHESIS:</span>
                  <p>1. Beachhead Recommendation: Enter Vietnam first due to lowest initial customer acquisition friction and deepest developer talent concentration (120k developers).</p>
                  <p>2. Pricing & Economics: Launch regional localized pricing at $12-$15/seat/month. Breakeven achieved at 1,400 seats (Month 14).</p>
                  <p>3. GTM Channel: 70% distributor / 30% direct inside sales. Prevents high fixed OpEx burn before PMF is established.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* TAB 4: PREPARATION PLAN & SKILL GAPS */}
      {activeTab === 'prep' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Personalized Preparation Plan</h2>
              <p className="text-xs text-slate-500">
                Tasks prioritized by deadline urgency, case relevance, and detected skill gaps.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">
                {tasks.filter(t => t.status === 'DONE').length} of {tasks.length} Completed
              </span>
            </div>
          </div>

          {/* Candidate Skill Gaps Matrix (Section 25) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-bold text-slate-900">Skill Gap Calibration for this Opportunity</h3>
              </div>
              <span className="text-xs text-slate-400">Comparing role requirements with your profile evidence</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skillGaps.map(gap => (
                <div key={gap.skillId} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{gap.skillName}</span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                      gap.importance === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {gap.importance}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Evidence in Profile: <strong className="text-slate-800">{gap.currentEvidenceCount} points</strong></span>
                    <span>Gap: <strong className={gap.gapScore > 50 ? 'text-rose-600' : 'text-emerald-600'}>{gap.gapScore}%</strong></span>
                  </div>

                  <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                    <span className="font-semibold text-slate-800">Recommended Practice:</span>
                    <p className="text-blue-700 font-medium mt-0.5">{gap.recommendedPracticeTitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prioritized Task List */}
          <div className="space-y-3">
            {tasks.map(task => {
              const isDone = task.status === 'DONE';
              return (
                <div
                  key={task.id}
                  className={`bg-white rounded-2xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isDone 
                      ? 'border-slate-200/60 bg-slate-50/40 opacity-75' 
                      : 'border-slate-200 hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 cursor-pointer text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-500" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-xs font-bold ${isDone ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                          {task.title}
                        </span>
                        <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.2 rounded-md ${
                          task.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-800' :
                          task.priority === 'HIGH' ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority}
                        </span>
                        <span className="text-[11px] text-slate-400">~{task.estimatedMinutes} mins</span>
                      </div>

                      <p className="text-xs text-slate-500 leading-normal">{task.whyRecommended}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      {isDone ? 'Mark To-do' : 'Mark Done'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 5: JOB & COMPANY SNAPSHOT */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Preserved Job Snapshot */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  PRESERVED JOB SNAPSHOT
                </h3>
                <span className="text-[11px] text-slate-400">
                  Captured: {new Date(app.jobSnapshot?.capturedAt || app.createdAt).toLocaleDateString()}
                </span>
              </div>

              {app.jobSnapshot ? (
                <div className="space-y-3 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">Role:</span> {app.jobSnapshot.title}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Company:</span> {app.jobSnapshot.company}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">Salary:</span> {app.jobSnapshot.salary || 'Not specified'}
                  </div>
                  <div className="pt-2 border-t border-slate-100">
                    <span className="font-semibold text-slate-900 block mb-1">Description:</span>
                    <p className="text-slate-600 leading-relaxed max-h-48 overflow-y-auto pr-1">
                      {app.jobSnapshot.description}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No snapshot saved.</p>
              )}
            </div>

            {/* Verified Company Intelligence */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  COMPANY INTELLIGENCE
                </h3>
                {app.companyIntelligence?.verifiedSource && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Source
                  </span>
                )}
              </div>

              {app.companyIntelligence ? (
                <div className="space-y-3 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Business Model:</span>
                    <p className="text-slate-600">{app.companyIntelligence.businessModel}</p>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Flagship Offerings:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {app.companyIntelligence.products.map((p, idx) => (
                        <span key={`prod-${p}-${idx}`} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Key Competitors:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {app.companyIntelligence.competitors.map((c, idx) => (
                        <span key={`comp-${c}-${idx}`} className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-100 text-[11px] font-medium">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-900 block mb-0.5">Strategic Priorities:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                      {app.companyIntelligence.strategicPriorities.map((sp, i) => (
                        <li key={i}>{sp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">No company intelligence stored.</p>
              )}
            </div>

          </div>

          {/* Extracted Structured Requirements */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              EXTRACTED JOB REQUIREMENTS & SKILL MAPPINGS
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {app.requirements.map(req => (
                <div key={req.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-md">
                      {req.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Confidence: {req.confidence}
                    </span>
                  </div>
                  <p className="text-xs text-slate-800 leading-normal">{req.text}</p>
                  {req.mappedSkillName && (
                    <div className="pt-1 text-[11px] text-slate-500">
                      Mapped Skill: <strong className="text-slate-900">{req.mappedSkillName}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 6: REVIEW & OUTCOME (LEARNING LOOP) */}
      {activeTab === 'review' && (
        <div className="space-y-6">
          
          {/* Pre-submission Checklist (Section 28) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pre-Submission Quality Checklist</h3>
                <p className="text-xs text-slate-500">Ensure your case solution meets top-tier hiring standards before submitting.</p>
              </div>

              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
                {Object.values(checklist).filter(Boolean).length} of 9 Items Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'actualQuestion', label: 'Did I answer the actual question posed?' },
                { key: 'assumptionsExplicit', label: 'Are all quantitative assumptions explicitly labeled ([ASSUMPTION])?' },
                { key: 'calculationsCorrect', label: 'Are unit economics & TAM calculations mathematically verified?' },
                { key: 'logicalStructure', label: 'Is the structure clear, logical, and MECE?' },
                { key: 'evidenceSufficient', label: 'Is sufficient industry data/benchmark proof cited?' },
                { key: 'risksAddressed', label: 'Did I identify failure modes and concrete mitigations?' },
                { key: 'alternativesConsidered', label: 'Did I evaluate trade-offs against alternative GTM approaches?' },
                { key: 'recommendationClear', label: 'Is the executive recommendation unambiguous and actionable?' },
                { key: 'executiveFormat', label: 'Can an executive understand the primary decision in under 2 minutes?' }
              ].map(item => (
                <label
                  key={item.key}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 flex items-start gap-3 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.key] || false}
                    onChange={(e) => setChecklist({ ...checklist, [item.key]: e.target.checked })}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-semibold text-slate-800 leading-snug">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Outcome & Learning Loop (Section 30 & 31) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="text-base font-bold text-slate-900">Outcome & Learning Loop Feedback</h3>
                <p className="text-xs text-slate-500">Record final interview/case feedback to automatically feed into your Career OS evidence.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Final Result / Outcome</label>
                <select
                  value={outcomeStatus}
                  onChange={(e) => setOutcomeStatus(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-hidden bg-white font-semibold"
                >
                  <option value="ADVANCED">Advanced to Next Stage</option>
                  <option value="OFFER">Offer Extended 🎉</option>
                  <option value="REJECTED">Did not advance</option>
                  <option value="WITHDRAWN">Withdrawn</option>
                  <option value="NO_RESPONSE">Awaiting response</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Company / Interviewer Feedback</label>
                <textarea
                  value={companyFeedback}
                  onChange={(e) => setCompanyFeedback(e.target.value)}
                  placeholder="e.g., 'Analysis was exceptionally strong and unit economics were well defended. Could improve concise delivery in initial executive pitch.'"
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-purple-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Candidate Self-Review & Learnings</label>
                <textarea
                  value={selfReview}
                  onChange={(e) => setSelfReview(e.target.value)}
                  placeholder="What would you execute differently next time? What skill gaps did this reveal?"
                  rows={2}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-purple-500 focus:outline-hidden leading-relaxed"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2">
                {selectedAssessment && selectedAssessment.stage !== 'converted_to_evidence' && (
                  <button
                    type="button"
                    onClick={() => {
                      const { assessment: converted } = jobAssessmentStore.convertToEvidence(selectedAssessment.id);
                      setAllJobAssessments(jobAssessmentStore.getAssessments());
                      showToast(`Case assessment converted to Level 6 Career Evidence!`);
                    }}
                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Convert Case to Career Evidence</span>
                  </button>
                )}
                <button
                  onClick={handleSaveOutcome}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Update Career OS Learning Loop</span>
                </button>
              </div>
            </div>

            {/* Generated Evidence Feed */}
            {evidenceList.length > 0 && (
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Grounded Evidence Logged for Profile
                </span>
                <div className="space-y-2">
                  {evidenceList.map(ev => (
                    <div key={ev.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{ev.title}</span>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                          {ev.evidenceType}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* Ingest Case Modal */}
      {isIngestModalOpen && (
        <IngestCaseModal
          isOpen={isIngestModalOpen}
          onClose={() => setIsIngestModalOpen(false)}
          applicationId={app.id}
          companyName={app.companyName}
          existingAssessment={activeAssessment}
          onCaseIngested={(assessment, newCase) => {
            setAssessments([assessment]);
            setAppCase(newCase);
            showToast('Case successfully analyzed and attached to workspace!');
          }}
        />
      )}

      {/* Anonymize Case Modal */}
      {isAnonymizeModalOpen && appCase && (
        <AnonymizeCaseModal
          isOpen={isAnonymizeModalOpen}
          onClose={() => setIsAnonymizeModalOpen(false)}
          appCase={appCase}
          companyName={app.companyName}
          onAnonymized={(anon) => {
            showToast(`Anonymized case "${anon.title}" created in practice library.`);
          }}
        />
      )}

      {/* First-Class Job Assessment / Case Entity Modal */}
      {isAssessmentModalOpen && activeModalAssessment && (
        <JobAssessmentModal
          isOpen={isAssessmentModalOpen}
          onClose={() => {
            setIsAssessmentModalOpen(false);
            setActiveModalAssessment(null);
          }}
          assessment={activeModalAssessment}
          onConverted={(converted) => {
            setAllJobAssessments(jobAssessmentStore.getAssessments());
            setSelectedAssessmentId(converted.id);
            showToast(`Assessment converted into Career OS Level 6 Evidence!`);
          }}
        />
      )}

      {/* Stage Transition Modal */}
      {isTransitionModalOpen && (
        <StageTransitionModal
          application={app}
          isOpen={isTransitionModalOpen}
          onClose={() => setIsTransitionModalOpen(false)}
          onTransitionComplete={(updated) => {
            setApp(updated);
            showToast(`Application transitioned to ${updated.pipelineState?.replace(/_/g, ' ')}`);
          }}
        />
      )}

      {/* Add Test Assignment Modal */}
      {isTestModalOpen && (
        <AddTestAssignmentModal
          applications={[app]}
          preselectedAppId={app.id}
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          onAssignmentCreated={() => {
            const reloaded = applicationStore.getApplicationById(app.id);
            if (reloaded) setApp(reloaded);
            showToast('Test assignment created and attached to workspace!');
          }}
        />
      )}

      {/* Schedule Interview Modal */}
      {isInterviewModalOpen && (
        <ScheduleInterviewModal
          applications={[app]}
          preselectedAppId={app.id}
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          onInterviewScheduled={() => {
            const reloaded = applicationStore.getApplicationById(app.id);
            if (reloaded) setApp(reloaded);
            showToast('Interview round scheduled and logged!');
          }}
        />
      )}

    </div>
  );
};
