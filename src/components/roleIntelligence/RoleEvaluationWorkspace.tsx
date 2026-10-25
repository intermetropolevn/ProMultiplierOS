import React, { useState } from 'react';
import { 
  RoleIntelligenceItem, 
  ReferenceFrameworkId,
  CareerOSDimensionKey,
  CareerOSDimensionScore,
  EvidenceCoverage,
  AssessmentConfidence,
  DeltaStatus,
  SupportingWorkInitiative,
  HumanSignalFeedback,
  RoleAssessmentSummaryData,
  CareerOSTrack
} from '../../features/roleIntelligence/types';
import { FRAMEWORK_METADATA_LIST } from '../../features/roleIntelligence/data/rolesIntelligenceData';
import { RadarChart, RadarLayer } from './RadarChart';
import { AddHumanContextDrawer } from './AddHumanContextDrawer';
import { SystemEvidenceDrawer } from './SystemEvidenceDrawer';
import { AdjustAssessmentModal } from './AdjustAssessmentModal';
import { WhyAssessmentModal } from './WhyAssessmentModal';
import { SelfSystemOthersComparison } from './SelfSystemOthersComparison';
import { useAccessControl } from '../../services/accessControlService';
import { CareerOSIntelligenceGate, IntelligenceModeBadge } from '../access/CareerOSIntelligenceGate';
import { 
  Sliders, 
  Award, 
  Layers, 
  ChevronRight, 
  HelpCircle, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Target,
  ShieldCheck,
  Briefcase,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  Edit3,
  MessageSquare,
  FileText,
  Calendar,
  Check,
  BrainCircuit,
  Compass
} from 'lucide-react';

interface RoleEvaluationWorkspaceProps {
  role: RoleIntelligenceItem;
  onUpdateScore: (key: CareerOSDimensionKey, score: number) => void;
  onNavigateToLeveling: () => void;
  onNavigateToReadiness: () => void;
  onNavigateToProfile: () => void;
  onNavigateToFrameworks: () => void;
  onNavigateToEvidenceIntelligence?: () => void;
}

// Dimension default data generator for evidence-backed assessment
const getEnrichedDimension = (dim: CareerOSDimensionScore, role: RoleIntelligenceItem): CareerOSDimensionScore => {
  // If already enriched with custom fields, return as is
  if (dim.evidenceCoverage && dim.observedLevelLabel) {
    return dim;
  }

  const score = dim.score || 4;

  switch (dim.key) {
    case 'functional_technical_knowledge':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Verified across 14 API specifications, schema design reviews, and engineering ADRs.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 4.2,
        humanSignalScore: 4.0,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 4.0,
        managerSignalScore: 4.0,
        targetRoleScore: 4.5,
        observedEvidenceList: [
          'Authored complex product specifications with detailed API request/response contracts',
          'Evaluated latency and throughput constraints directly with Core Infrastructure Engineering',
          'Translated technical distributed systems constraints into user-facing UX trade-offs',
          'Repeated technical review approvals across 4 major production initiatives'
        ],
        humanSignalSummary: 'Engineering stakeholders consistently report strong technical judgment and zero rework from unvetted technical assumptions.',
        assessmentRationale: 'Demonstrates strong technical fluency required to translate engineering constraints into product decisions without owning deep engineering implementation.',
        deltaStatus: 'Ready',
        deltaGuidance: 'Technical fluency fully satisfies Staff/Lead requirements. Maintain focus on architectural governance rather than low-level implementation.',
        contextChips: ['ctx-tech-complexity', 'ctx-cross-func'],
        validationStatus: 'Confirmed'
      };

    case 'business_domain_knowledge':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Substantial telemetry and cohort retention models linked to business metrics.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 4.0,
        humanSignalScore: 3.8,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 3.9,
        managerSignalScore: 4.0,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Formulated unit economics and customer acquisition cost (CAC) paybacks for pricing tiers',
          'Monitored net revenue retention (NRR) cohorts across enterprise customer segments',
          'Identified regulatory compliance boundaries across European payments expansion'
        ],
        humanSignalSummary: 'Sales and BizOps partners rely on domain pricing guidance during contract renewals.',
        assessmentRationale: 'Synthesizes market dynamics and competitive positioning directly into roadmap prioritization.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Deepen multi-year portfolio P&L forecasting to match Staff PM expectations.',
        contextChips: ['ctx-high-stakes'],
        validationStatus: 'Confirmed'
      };

    case 'problem_complexity':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Documented post-mortems and multi-layered algorithmic workflow designs.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 4.2,
        humanSignalScore: 4.1,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 4.2,
        managerSignalScore: 4.0,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Decomposed opaque multi-tenant permissioning challenges into decoupled microservice services',
          'Navigated conflicting stakeholder requirements between automated compliance and user friction',
          'Executed structured trade-off evaluations under extreme latency requirements'
        ],
        humanSignalSummary: 'Peers recognize exceptional ability to bring structure to highly ambiguous problems.',
        assessmentRationale: 'Comfortably navigates high ambiguity without requiring pre-defined solution patterns.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Expand blast radius to solve company-wide platform bottlenecks.',
        contextChips: ['ctx-ambiguity', 'ctx-tech-complexity'],
        validationStatus: 'Confirmed'
      };

    case 'decision_scope':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Decision rights logged on 6 pivotal roadmap forks without leadership rollback.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 4.0,
        humanSignalScore: 4.0,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 3.9,
        managerSignalScore: 4.0,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Owned go/no-go launch criteria for major customer-facing surface',
          'Established API deprecation lifecycle despite vocal customer enterprise objections',
          'Decided core database indexing migration strategy balancing downtime risk vs cost'
        ],
        humanSignalSummary: 'Executive leadership rarely intervenes in scope or prioritization decisions.',
        assessmentRationale: 'Exercises autonomous decision rights over an entire domain area with accountable blast radius.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Transition from single-domain decision ownership to cross-portfolio resource trade-offs.',
        contextChips: ['ctx-high-stakes', 'ctx-cross-func'],
        validationStatus: 'Confirmed'
      };

    case 'product_customer_impact':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Telemetry shows +34% activation lift and 4.7/5 customer satisfaction on new surface.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 4.4,
        humanSignalScore: 4.2,
        selfAssessmentScore: 4.5,
        crossFunctionalScore: 4.2,
        managerSignalScore: 4.3,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Delivered onboarding revamp reducing time-to-first-value from 14 days to 4 hours',
          'Synthesized 28 customer interviews into unified feature backlog',
          'Iterated through 4 multivariate experiments to eliminate drop-off in verification flow'
        ],
        humanSignalSummary: 'Design and Customer Success teams praise continuous empathy and focus on customer friction points.',
        assessmentRationale: 'Drives measurable step-change improvements in key customer journey metrics.',
        deltaStatus: 'Strong',
        deltaGuidance: 'Impact is standout. Connect customer wins into broad company narrative.',
        contextChips: ['ctx-cross-func'],
        validationStatus: 'Validated'
      };

    case 'business_impact':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Moderate',
        assessmentConfidence: 'Medium',
        confidenceReason: 'Multiple business outcomes detected, but attribution to user is partially shared with Growth and Sales.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 3.8,
        humanSignalScore: 3.7,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 3.8,
        managerSignalScore: 3.8,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Contributed to $2.4M ARR expansion through self-serve tier upgrade pathways',
          'Reduced infrastructure egress costs by 18% via payload caching redesign',
          'Secured renewal of top 3 tier-1 enterprise accounts through SLA feature commitments'
        ],
        humanSignalSummary: 'BizOps recognizes clear contribution to monetization efficiency.',
        assessmentRationale: 'Strong business acumen with demonstrable impact on top-line retention and cost optimization.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Disentangle shared attribution by leading direct business cases with explicit ROI ownership.',
        contextChips: ['ctx-high-stakes', 'ctx-resources'],
        validationStatus: 'Confirmed'
      };

    case 'operational_scope':
      return {
        ...dim,
        observedLevelLabel: '3 — Advanced',
        evidenceCoverage: 'Moderate',
        assessmentConfidence: 'Medium',
        confidenceReason: 'Manages squad sprint operating rhythm; multi-squad cadence managed via Program Lead.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 3.4,
        humanSignalScore: 3.6,
        selfAssessmentScore: 3.5,
        crossFunctionalScore: 3.5,
        managerSignalScore: 3.5,
        targetRoleScore: 4.0,
        observedEvidenceList: [
          'Established triage SLA reducing bug backlog resolution time by 30%',
          'Authored squad kickoff playbook adopted by two adjacent pods',
          'Maintains transparent roadmap dashboard viewed by 40+ cross-functional colleagues'
        ],
        humanSignalSummary: 'Operations and Product Operations leads praise predictable delivery cadences.',
        assessmentRationale: 'Operates squad execution with high discipline and repeatable operational rituals.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Scale operational processes beyond own squad to department-level operating cadence.',
        contextChips: ['ctx-cross-func'],
        validationStatus: 'Confirmed'
      };

    case 'stakeholder_complexity':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Regular alignment with VP of Eng, Legal counsel, and GTM leads on high-friction topics.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 4.0,
        humanSignalScore: 4.1,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 4.0,
        managerSignalScore: 4.0,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Aligned conflicting timelines between Enterprise Sales commitments and Core Platform refactors',
          'Navigated GDPR/CCPA privacy constraints with Corporate Legal while preserving data analytics',
          'Managed executive expectations during two-week critical incident mitigation'
        ],
        humanSignalSummary: 'Stakeholders across all levels view the candidate as collaborative, calm under pressure, and fair.',
        assessmentRationale: 'Diplomatically aligns diverse stakeholder groups with competing incentives without creating friction.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Step up to C-suite and Board-level narrative management.',
        contextChips: ['ctx-org-complexity', 'ctx-cross-func'],
        validationStatus: 'Confirmed'
      };

    case 'strategic_influence':
      return {
        ...dim,
        observedLevelLabel: '4 — Senior',
        evidenceCoverage: 'Moderate',
        assessmentConfidence: 'Medium',
        confidenceReason: 'Authored 12-month vision doc for domain; company-wide strategic bets owned by Director.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 3.7,
        humanSignalScore: 3.9,
        selfAssessmentScore: 4.0,
        crossFunctionalScore: 3.8,
        managerSignalScore: 3.8,
        targetRoleScore: 5.0,
        observedEvidenceList: [
          'Authored 2027 domain roadmap accepted by executive team',
          'Formulated thesis on generative AI workflow integration that pivoted Q4 team goals',
          'Represented company at industry roundtable on API developer experience'
        ],
        humanSignalSummary: 'Peers look to this candidate for vision and clarity on where the product area is heading.',
        assessmentRationale: 'Shapes domain direction and influences adjacent squad roadmaps effectively.',
        deltaStatus: 'Developing',
        deltaGuidance: 'Influence organization-wide capital allocation and product moat defense.',
        contextChips: ['ctx-ambiguity', 'ctx-transformation'],
        validationStatus: 'Confirmed'
      };

    case 'leadership_ownership':
      return {
        ...dim,
        observedLevelLabel: role.track === 'management' ? '4 — Senior' : 'Insufficient Evidence',
        evidenceCoverage: role.track === 'management' ? 'Moderate' : 'Limited',
        assessmentConfidence: 'Medium',
        confidenceReason: 'CareerOS observes strong cross-functional squad leadership, but has insufficient evidence of direct people management or performance appraisal ownership.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: 3.2,
        humanSignalScore: 3.5,
        selfAssessmentScore: 3.5,
        crossFunctionalScore: 3.4,
        managerSignalScore: 3.5,
        targetRoleScore: 4.0,
        observedEvidenceList: [
          'Mentored 2 Associate PMs through discovery and PRD authoring rituals',
          'Acted as culture anchor and squad advocate during high-pressure releases',
          'Cross-functional leadership demonstrated without formal hierarchical authority'
        ],
        humanSignalSummary: 'Mentees give glowing reviews; note exceptional patience and clear mental models.',
        assessmentRationale: 'Natural lead on cross-functional initiatives; formal people management evidence is currently limited.',
        deltaStatus: 'Evidence Gap',
        deltaGuidance: 'If seeking Management track (GPM/Director), take on formal direct reporting or Associate PM internship mentorship.',
        contextChips: ['ctx-cross-func'],
        validationStatus: 'Suggested'
      };

    default:
      return {
        ...dim,
        observedLevelLabel: `${score} — Senior`,
        evidenceCoverage: 'Strong',
        assessmentConfidence: 'High',
        confidenceReason: 'Evidence verified from completed work artifacts.',
        systemEvidenceWeight: 70,
        humanSignalWeight: 30,
        systemEvidenceScore: score,
        humanSignalScore: score,
        selfAssessmentScore: score,
        crossFunctionalScore: score,
        managerSignalScore: score,
        targetRoleScore: Math.min(5, score + 1),
        observedEvidenceList: [
          'Demonstrated repeated execution across key initiatives',
          'Produced peer-reviewed documentation and deliverables'
        ],
        humanSignalSummary: 'Positive qualitative stakeholder feedback logged.',
        assessmentRationale: 'Consistent capability demonstrated in day-to-day work.',
        deltaStatus: 'Strong',
        deltaGuidance: 'Continue building evidence in target complexity environments.',
        validationStatus: 'Confirmed'
      };
  }
};

export const RoleEvaluationWorkspace: React.FC<RoleEvaluationWorkspaceProps> = ({
  role,
  onUpdateScore,
  onNavigateToLeveling,
  onNavigateToReadiness,
  onNavigateToProfile,
  onNavigateToFrameworks,
  onNavigateToEvidenceIntelligence
}) => {
  const { recordMeaningfulInteraction, getIntelligenceAccess, consumeDemoIntelligenceSignal } = useAccessControl();
  const [selectedFrameworkId, setSelectedFrameworkId] = useState<ReferenceFrameworkId>('careeros_native');
  const [highlightDimensionKey, setHighlightDimensionKey] = useState<string>('functional_technical_knowledge');
  const [selectedTrack, setSelectedTrack] = useState<CareerOSTrack>(role.track || 'ic');

  // Modals and Drawers
  const [isHumanContextOpen, setIsHumanContextOpen] = useState(false);
  const [isSystemEvidenceOpen, setIsSystemEvidenceOpen] = useState(false);
  const [isAdjustAssessmentOpen, setIsAdjustAssessmentOpen] = useState(false);
  const [isWhyAssessmentOpen, setIsWhyAssessmentOpen] = useState(false);
  const [drawerDimension, setDrawerDimension] = useState<CareerOSDimensionScore | null>(null);
  const [gateModalOpen, setGateModalOpen] = useState(false);

  // Local overrides map
  const [localOverrides, setLocalOverrides] = useState<{ [key: string]: Partial<CareerOSDimensionScore> }>({});

  const evalAccess = getIntelligenceAccess('advanced_role_evaluation');
  const isFull = evalAccess.isFull;

  const selectedFramework = FRAMEWORK_METADATA_LIST.find(f => f.id === selectedFrameworkId) || FRAMEWORK_METADATA_LIST[0];
  const refEval = role.referenceEvaluations.find(re => re.frameworkId === selectedFrameworkId);

  // Enriched dimensions combining role data and local overrides
  const enrichedDimensions = role.careerosDimensions.map(dim => {
    const base = getEnrichedDimension(dim, role);
    const override = localOverrides[dim.key];
    return override ? { ...base, ...override } : base;
  });

  // Only send curated sample dimensions to DOM for Guest/Demo
  const visibleDimensions = isFull ? enrichedDimensions : enrichedDimensions.slice(0, 3);

  const selectedDimension = visibleDimensions.find(d => d.key === highlightDimensionKey) || visibleDimensions[0];

  // Assessment summary stats
  const assessmentSummary: RoleAssessmentSummaryData = {
    currentLevel: 'Senior Product Specialist',
    currentLevelCode: role.levelMapping.levelCode || 'P4',
    targetLevel: 'Staff / Group Product Specialist',
    targetLevelCode: 'P5 / Staff',
    systemEvidencePercentage: 70,
    humanContextPercentage: 30,
    evidenceCoveragePercentage: 84,
    assessmentConfidence: 'High',
    lastAssessedDate: '18 Oct 2026',
    synthesisRationale: 'Synthesized from 4 initiatives, 28 artifacts, and 12 qualitative peer observations.',
    systemSignalsCount: 28,
    humanSignalsCount: 12,
    initiativesCount: 4
  };

  const getTrackBadge = (track: string) => {
    switch (track) {
      case 'ic': return 'Individual Contributor Track';
      case 'management': return 'Management Track';
      case 'hybrid': return 'Hybrid / Cross-functional Track';
      default: return track;
    }
  };

  const getCoverageBadge = (coverage?: EvidenceCoverage) => {
    switch (coverage) {
      case 'Strong':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">Coverage: Strong</span>;
      case 'Moderate':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">Coverage: Moderate</span>;
      case 'Limited':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">Coverage: Limited</span>;
      case 'Insufficient':
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">Coverage: Insufficient</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">Coverage: Moderate</span>;
    }
  };

  const getConfidenceBadge = (confidence?: AssessmentConfidence) => {
    switch (confidence) {
      case 'High':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">Conf: High</span>;
      case 'Medium':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">Conf: Medium</span>;
      case 'Low':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-50 text-rose-800 border border-rose-200">Conf: Low</span>;
      default:
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700">Conf: High</span>;
    }
  };

  const getDeltaStatusBadge = (status?: DeltaStatus) => {
    switch (status) {
      case 'Ready':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1"><span>✓</span> Ready</span>;
      case 'Strong':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1"><span>✓</span> Strong</span>;
      case 'Developing':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1"><span>△</span> Developing</span>;
      case 'Evidence Gap':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1"><span>○</span> Evidence Gap</span>;
      case 'Experience Gap':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1"><span>○</span> Experience Gap</span>;
      case 'Context Gap':
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 flex items-center gap-1"><span>○</span> Context Gap</span>;
      default:
        return <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700">Developing</span>;
    }
  };

  // Handlers for drawer actions
  const handleOpenSystemEvidence = (dim: CareerOSDimensionScore) => {
    if (evalAccess.isDemo) {
      const ok = consumeDemoIntelligenceSignal('advanced_role_evaluation', `ev-${dim.key}`);
      if (!ok) {
        setGateModalOpen(true);
        return;
      }
    }
    recordMeaningfulInteraction('detail_open');
    setDrawerDimension(dim);
    setIsSystemEvidenceOpen(true);
  };

  const handleOpenHumanContext = (dim: CareerOSDimensionScore) => {
    if (evalAccess.isGuest) {
      recordMeaningfulInteraction('protected_action');
      setGateModalOpen(true);
      return;
    }
    if (evalAccess.isDemo) {
      const ok = consumeDemoIntelligenceSignal('advanced_role_evaluation', `ctx-${dim.key}`);
      if (!ok) {
        setGateModalOpen(true);
        return;
      }
    }
    setDrawerDimension(dim);
    setIsHumanContextOpen(true);
  };

  const handleOpenAdjustAssessment = (dim: CareerOSDimensionScore) => {
    if (!isFull) {
      recordMeaningfulInteraction('protected_action');
      setGateModalOpen(true);
      return;
    }
    setDrawerDimension(dim);
    setIsAdjustAssessmentOpen(true);
  };

  const handleSaveHumanContext = (
    key: string,
    selfScore: number | null,
    newSignals: HumanSignalFeedback[],
    chips: string[],
    addlText: string
  ) => {
    setLocalOverrides(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        selfAssessmentScore: selfScore || undefined,
        humanSignalsList: newSignals,
        contextChips: chips,
        additionalContext: addlText,
        humanSignalWeight: 35,
        systemEvidenceWeight: 65,
        validationStatus: 'Confirmed'
      }
    }));
  };

  const handleSaveAdjustment = (
    key: string,
    adjustedScore: number,
    rationale: string,
    valStatus: 'Detected' | 'Suggested' | 'Confirmed' | 'Validated'
  ) => {
    const isInsufficient = adjustedScore === 0;
    const scoreVal = isInsufficient ? 0 : adjustedScore;
    
    setLocalOverrides(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        score: scoreVal,
        observedLevelLabel: isInsufficient 
          ? 'Insufficient Evidence' 
          : `${scoreVal} — ${scoreVal === 1 ? 'Foundational' : scoreVal === 2 ? 'Working' : scoreVal === 3 ? 'Advanced' : scoreVal === 4 ? 'Senior' : 'Strategic'}`,
        evidenceCoverage: isInsufficient ? 'Insufficient' : 'Strong',
        isUserAdjusted: true,
        userAdjustmentNotes: rationale,
        validationStatus: valStatus
      }
    }));

    if (!isInsufficient) {
      onUpdateScore(key as CareerOSDimensionKey, scoreVal);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* ==================================================
          1. ROLE ASSESSMENT SUMMARY CARD (Section 14 & 23)
          ================================================== */}
      <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm p-5 sm:p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Role Assessment
              </span>
              <IntelligenceModeBadge capability="advanced_role_evaluation" />
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-amber-400" />
                AI Synthesized from System Evidence + Human Signals
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Evidence-Backed Role Assessment Summary
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              CareerOS estimates capability levels by combining observed work artifacts with qualitative human signals and environmental context.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-start lg:self-center">
            <button
              type="button"
              onClick={() => {
                recordMeaningfulInteraction('detail_open');
                setIsWhyAssessmentOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Why this assessment?</span>
            </button>
          </div>
        </div>

        {/* 6 Key Assessment Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-3 border-t border-slate-800/80 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Current Level</span>
            <span className="font-black text-white text-sm mt-0.5 block">{assessmentSummary.currentLevelCode} — Senior</span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Target Level</span>
            <span className="font-black text-blue-400 text-sm mt-0.5 block">{assessmentSummary.targetLevelCode}</span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">System Evidence</span>
            <span className="font-black text-emerald-400 text-sm mt-0.5 block">
              Primary Driver
            </span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Human / Context</span>
            <span className="font-black text-amber-300 text-sm mt-0.5 block">
              Calibrated Signal
            </span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Evidence Coverage</span>
            <span className="font-black text-white text-sm mt-0.5 block">Strong</span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Assessment Conf</span>
            <span className="font-black text-emerald-400 text-sm mt-0.5 block">{assessmentSummary.assessmentConfidence}</span>
          </div>
        </div>

        {/* Conceptual Model Ribbon */}
        <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400 flex-wrap">
          <span className="font-mono text-slate-300">Model:</span>
          <span className="text-slate-300">SYSTEM EVIDENCE</span>
          <span>+</span>
          <span className="text-slate-300">HUMAN SIGNALS</span>
          <span>+</span>
          <span className="text-slate-300">CONTEXT</span>
          <span>↓</span>
          <span className="text-blue-300 font-bold">AI SYNTHESIS</span>
          <span>↓</span>
          <span className="text-emerald-300 font-bold">CAPABILITY ASSESSMENT</span>
          <span>↓</span>
          <span className="text-white font-bold">ROLE LEVEL</span>
          <span>↓</span>
          <span className="text-amber-300 font-bold">READINESS</span>
          <span>↓</span>
          <span className="text-purple-300 font-bold">CAREER MOBILITY</span>
        </div>
      </div>

      {/* ==================================================
          2. ROLE EVALUATION OVERVIEW CARD (Section 2 & 23)
          ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
              <span>Job Family: <strong className="text-slate-800">{role.jobFamily}</strong></span>
              <span aria-hidden="true">·</span>
              <span>Domain: <strong className="text-slate-800">{role.domain}</strong></span>
              <span aria-hidden="true">·</span>
              <span className="text-blue-700 font-semibold">{getTrackBadge(selectedTrack)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {role.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              {role.rolePurpose}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            <button
              type="button"
              onClick={onNavigateToReadiness}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Target className="w-3.5 h-3.5" />
              <span>Readiness Analysis</span>
            </button>

            <button
              type="button"
              onClick={onNavigateToProfile}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>Full Role Profile</span>
            </button>

            {onNavigateToEvidenceIntelligence && (
              <button
                type="button"
                onClick={onNavigateToEvidenceIntelligence}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-700 text-xs font-bold transition-all border border-emerald-200 flex items-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Evidence Layer</span>
              </button>
            )}
          </div>
        </div>

        {/* Track Switcher & Status Strip */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">Track:</span>
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {[
                { id: 'ic', label: 'Individual Contributor' },
                { id: 'management', label: 'Management' },
                { id: 'hybrid', label: 'Hybrid / Cross-functional' }
              ].map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setSelectedTrack(t.id as CareerOSTrack)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedTrack === t.id
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Inferred Grade: <strong className="text-slate-800">{role.levelMapping.levelCode}</strong></span>
            <span>·</span>
            <span>Target: <strong className="text-blue-700">{role.targetLevel}</strong></span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              {role.evaluationStatus}
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================
          3. REFERENCE FRAMEWORK SELECTOR (Section 3 & 23)
          ================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Reference Evaluation Framework</h2>
              <span className="text-xs text-slate-500">· Select benchmark methodology</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reference methodologies possess distinct evaluation dimensions. They are not interchangeable scoring systems.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToFrameworks}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <span>Compare All 6 Frameworks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Framework Selector Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {FRAMEWORK_METADATA_LIST.map((fw) => {
            const isSelected = selectedFrameworkId === fw.id;
            return (
              <button
                key={fw.id}
                type="button"
                onClick={() => setSelectedFrameworkId(fw.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50/80 border-blue-500 text-slate-900 ring-2 ring-blue-500/10 shadow-xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                }`}
              >
                <div>
                  <span className={`text-[10px] font-black uppercase tracking-wider block ${isSelected ? 'text-blue-700' : 'text-slate-500'}`}>
                    {fw.creator.split(' ')[0]}
                  </span>
                  <span className="font-bold text-xs mt-0.5 block leading-tight">
                    {fw.shortName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 mt-2 block capitalize font-medium">
                  {fw.frameworkType.replace(/_/g, ' ')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          4. CAREEROS CAPABILITY ASSESSMENT (Section 2, 4, 5, 23)
          ================================================== */}
      {selectedFrameworkId === 'careeros_native' ? (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* LEFT 7 COLS: 10 Evidence-Backed Capability Dimension Cards */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">
                    CareerOS Capability Assessment
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    CareerOS synthesizes observed work evidence, human signals, and contextual factors to estimate capability level.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 self-start sm:self-auto shrink-0">
                  Evidence-Backed Model
                </span>
              </div>

              {/* Dimension Cards */}
              <div className="space-y-4">
                {visibleDimensions.map((dim) => {
                  const isSelected = highlightDimensionKey === dim.key;
                  const isInsufficient = dim.observedLevelLabel?.includes('Insufficient');

                  return (
                    <div
                      key={dim.key}
                      onClick={() => setHighlightDimensionKey(dim.key)}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3.5 ${
                        isSelected
                          ? 'bg-blue-50/50 border-blue-400 ring-2 ring-blue-500/10 shadow-xs'
                          : 'bg-white border-slate-200/90 hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Dimension Top Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSelected ? 'bg-blue-600' : 'bg-slate-400'}`} />
                          <h4 className="text-sm font-bold text-slate-900">
                            {dim.label}
                          </h4>
                        </div>

                        {/* Level + Coverage + Confidence Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded border ${
                            isInsufficient 
                              ? 'bg-amber-50 text-amber-900 border-amber-300' 
                              : 'bg-blue-50 text-blue-800 border-blue-200'
                          }`}>
                            {dim.observedLevelLabel}
                          </span>
                          {getCoverageBadge(dim.evidenceCoverage)}
                          {getConfidenceBadge(dim.assessmentConfidence)}
                        </div>
                      </div>

                      {/* Evidence Split Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                          <span className="flex items-center gap-1 text-emerald-700">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>System Evidence: Primary Driver</span>
                          </span>
                          <span className="flex items-center gap-1 text-amber-700">
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                            <span>Human &amp; Context: Calibrated</span>
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                          <div 
                            className="bg-emerald-500 h-full transition-all" 
                            style={{ width: '70%' }}
                          />
                          <div 
                            className="bg-amber-400 h-full transition-all" 
                            style={{ width: '30%' }}
                          />
                        </div>
                      </div>

                      {/* Observed Evidence Bullets */}
                      {dim.observedEvidenceList && dim.observedEvidenceList.length > 0 && (
                        <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/70 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Observed Work Evidence
                          </span>
                          <ul className="space-y-1 text-xs text-slate-700">
                            {dim.observedEvidenceList.slice(0, 3).map((item, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <span className="text-blue-500 font-bold shrink-0 mt-0.5">•</span>
                                <span className="leading-snug">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Human Signal Quote */}
                      {dim.humanSignalSummary && (
                        <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
                              Cross-Functional Perception
                            </span>
                            <p className="italic text-slate-800 mt-0.5">{dim.humanSignalSummary}</p>
                          </div>
                        </div>
                      )}

                      {/* Assessment Rationale */}
                      {dim.assessmentRationale && (
                        <p className="text-xs text-slate-600 leading-relaxed font-normal">
                          <strong className="text-slate-800 font-semibold">Synthesis Rationale: </strong>
                          &ldquo;{dim.assessmentRationale}&rdquo;
                        </p>
                      )}

                      {/* 3 Action Buttons */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenSystemEvidence(dim);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors border border-emerald-200 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>View Evidence</span>
                          </button>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenHumanContext(dim);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors border border-amber-200 flex items-center gap-1.5 cursor-pointer shadow-3xs"
                          >
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                            <span>Add Human Context</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAdjustAssessment(dim);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Adjust Assessment</span>
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>

              {!isFull && (
                <CareerOSIntelligenceGate
                  capability="advanced_role_evaluation"
                  title="CareerOS Intelligence — Advanced Role Evaluation"
                  description="Turn career activity into structured evidence, capabilities and readiness signals. Unlock all 10 capability evaluation dimensions, multi-framework leveling calibration, and stakeholder signal concordance."
                  sampleCountLabel={`Showing ${visibleDimensions.length} of ${enrichedDimensions.length} capability dimensions`}
                />
              )}

            </div>

            {/* RIGHT 5 COLS: Multidimensional Radar with 4-Way Toggles & Active Dimension Inspector */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Radar Card (Section 11) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">Multidimensional Capability Profile</span>
                  <span className="text-[10px] text-slate-400 font-mono">4-Way Signal Radar</span>
                </div>

                <div className="py-2 w-full">
                  <RadarChart
                    dimensions={enrichedDimensions}
                    size={310}
                    highlightKey={highlightDimensionKey}
                    onSelectDimension={(key) => setHighlightDimensionKey(key)}
                  />
                </div>

                <div className="w-full pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-600" />
                    <span>Current Synthesized Assessment</span>
                  </span>
                  <span className="font-mono text-slate-700">{isFull ? '10 Dimensions' : '3 Sample Dimensions'}</span>
                </div>
              </div>

              {/* Active Dimension Inspector Card */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
                    <Sliders className="w-4 h-4" />
                    <span>Dimension Deep-Dive</span>
                  </div>
                  {getCoverageBadge(selectedDimension.evidenceCoverage)}
                </div>

                <h4 className="text-base font-bold text-slate-900">
                  {selectedDimension.label}
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Synthesized Rationale
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {selectedDimension.assessmentRationale || selectedDimension.rationale}
                    </p>
                  </div>

                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                      Demonstrated Signal Prompt
                    </span>
                    <p className="text-slate-700 leading-relaxed font-normal">
                      {selectedDimension.evidencePrompt}
                    </p>
                  </div>
                </div>

                {/* Direct quick action buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleOpenSystemEvidence(selectedDimension)}
                    className="py-2 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all border border-emerald-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Evidence Sources</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenHumanContext(selectedDimension)}
                    className="py-2 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all border border-amber-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                  >
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>Peer Signals</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onNavigateToLeveling}
                  className="w-full mt-2 py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <span>View Inferred Role Level Profile</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* ==================================================
              5. SELF / SYSTEM / OTHERS COMPARISON (Section 12)
              ================================================== */}
          <SelfSystemOthersComparison
            dimensions={visibleDimensions}
            highlightKey={highlightDimensionKey}
            onSelectDimension={(key) => setHighlightDimensionKey(key)}
          />

          {/* ==================================================
              6. CURRENT → TARGET ASSESSMENT DELTA (Section 15)
              ================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                    Mobility Delta
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500 font-medium">Readiness Bridge</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Current → Target Role Assessment Delta
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Comparison between your assessed Senior level (P4) and the target requirements for Staff / Group PM (P5).
                </p>
              </div>

              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200 self-start sm:self-auto">
                Target: {role.targetLevel}
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {visibleDimensions.map((dim) => {
                const currentScore = dim.score || 4;
                const targetScore = dim.targetRoleScore || 5;

                return (
                  <div 
                    key={`delta-${dim.key}`}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors px-2 rounded-xl"
                  >
                    <div className="space-y-1 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{dim.label}</span>
                        <span className="text-slate-400">·</span>
                        <span className="font-mono text-slate-600">
                          Current: <strong>{currentScore}</strong> → Target: <strong className="text-purple-700">{targetScore}</strong>
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] leading-relaxed">
                        {dim.deltaGuidance || 'Continue demonstrating sustained outcome-driven ownership in cross-functional forums.'}
                      </p>
                    </div>

                    <div className="shrink-0 self-start sm:self-center">
                      {getDeltaStatusBadge(dim.deltaStatus)}
                    </div>
                  </div>
                );
              })}
            </div>

            {!isFull && (
              <CareerOSIntelligenceGate
                capability="readiness_intelligence"
                variant="compact"
                sampleCountLabel={`Showing ${visibleDimensions.length} of ${enrichedDimensions.length} mobility delta bridges`}
              />
            )}
          </div>

          {/* ==================================================
              7. ASSESSMENT HISTORY (Section 18)
              ================================================== */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Assessment History &amp; Longitudinal Trajectory
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500">Continuous Assessment Model</span>
            </div>
            <p className="text-xs text-slate-500">
              CareerOS does not rely on a single annual review. It continuously evolves an understanding of your capabilities as real work is completed.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900">Oct 2026</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-200/80 text-blue-900">Current</span>
                </div>
                <div className="text-sm font-black text-slate-900">P4 — Senior</div>
                <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                  <div>Confidence: <strong>High</strong></div>
                  <div>Coverage: <strong>Strong</strong> (10 dimensions)</div>
                </div>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-blue-200/60">
                  Validated API Gateway &amp; Onboarding Revamp launches.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Jul 2026</span>
                  <span className="text-[10px] text-slate-400 font-mono">3 months ago</span>
                </div>
                <div className="text-sm font-black text-slate-900">P4 — Senior</div>
                <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                  <div>Confidence: <strong>Moderate</strong></div>
                  <div>Coverage: <strong>Moderate</strong> (8 dimensions)</div>
                </div>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  First detection of cross-functional trade-off ownership.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Apr 2026</span>
                  <span className="text-[10px] text-slate-400 font-mono">6 months ago</span>
                </div>
                <div className="text-sm font-black text-slate-900">P3 — Advanced / Mid</div>
                <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                  <div>Confidence: <strong>Moderate</strong></div>
                  <div>Coverage: <strong>Baseline</strong></div>
                </div>
                <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                  Initial workspace baseline from Jira and Notion ingestion.
                </p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* Reference Framework Detailed Methodology View */
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Methodology: <strong>{selectedFramework.creator}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Type: <strong className="capitalize">{selectedFramework.frameworkType.replace(/_/g, ' ')}</strong></span>
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                {selectedFramework.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                {selectedFramework.primaryPurpose}
              </p>
            </div>

            {refEval && (
              <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 text-right shrink-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Calculated Level</span>
                <span className="text-base sm:text-lg font-black text-blue-950 mt-0.5 block">{refEval.levelOrScore}</span>
              </div>
            )}
          </div>

          {/* Reference Dimensions Table */}
          {refEval ? (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Framework Evaluation Breakdown for {role.title}
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                      <th className="py-2.5 px-3">Dimension</th>
                      <th className="py-2.5 px-3">Scope</th>
                      <th className="py-2.5 px-3">Assigned Factor</th>
                      <th className="py-2.5 px-3">Interpretation &amp; Rationale</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(isFull ? refEval.dimensions : refEval.dimensions.slice(0, 2)).map((dim, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3 font-bold text-slate-900">{dim.name}</td>
                        <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">Core Factor</td>
                        <td className="py-3 px-3 font-semibold text-blue-700 font-mono text-[11px]">{dim.scoreOrBand}</td>
                        <td className="py-3 px-3 text-slate-600 max-w-md">{dim.interpretation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!isFull && (
                <CareerOSIntelligenceGate
                  capability="advanced_role_evaluation"
                  variant="compact"
                  sampleCountLabel={`Showing 2 of ${refEval.dimensions.length} reference framework factors`}
                />
              )}

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 space-y-1.5 text-xs text-slate-600">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Methodology Alignment Notes</span>
                <p className="leading-relaxed">{refEval.rationale}</p>
                <p className="text-[11px] text-slate-500 italic mt-1 font-mono">Market Calibration: {refEval.marketAlignmentNotes}</p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Reference evaluation data calibrated for {selectedFramework.shortName}.
            </div>
          )}

          {/* Framework Context Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">CareerOS Relevance</span>
              <p className="text-slate-700 leading-relaxed">{selectedFramework.careerosRelevance}</p>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Evaluation Logic</span>
              <p className="text-slate-700 leading-relaxed">{selectedFramework.evaluationLogic}</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          DRAWERS & MODALS MOUNTED
          ================================================== */}
      
      {/* 1. Add Human Context Drawer (Right-side drawer) */}
      <AddHumanContextDrawer
        isOpen={isHumanContextOpen}
        onClose={() => {
          setIsHumanContextOpen(false);
          setDrawerDimension(null);
        }}
        dimension={drawerDimension}
        onSaveContext={handleSaveHumanContext}
      />

      {/* 2. System Evidence Drawer (Right-side drawer) */}
      <SystemEvidenceDrawer
        isOpen={isSystemEvidenceOpen}
        onClose={() => {
          setIsSystemEvidenceOpen(false);
          setDrawerDimension(null);
        }}
        dimension={drawerDimension}
        onNavigateToEvidenceIntelligence={onNavigateToEvidenceIntelligence}
      />

      {/* 3. Adjust Assessment Modal */}
      <AdjustAssessmentModal
        isOpen={isAdjustAssessmentOpen}
        onClose={() => {
          setIsAdjustAssessmentOpen(false);
          setDrawerDimension(null);
        }}
        dimension={drawerDimension}
        onSaveAdjustment={handleSaveAdjustment}
      />

      {/* 4. Why Assessment Modal */}
      <WhyAssessmentModal
        isOpen={isWhyAssessmentOpen}
        onClose={() => setIsWhyAssessmentOpen(false)}
        summary={assessmentSummary}
        onNavigateToTarget={onNavigateToLeveling}
      />

      {gateModalOpen && (
        <CareerOSIntelligenceGate
          capability="advanced_role_evaluation"
          variant="modal"
          onClose={() => setGateModalOpen(false)}
        />
      )}

    </div>
  );
};
