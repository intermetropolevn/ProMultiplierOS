import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  Edit3, 
  DollarSign, 
  Clock, 
  TrendingUp, 
  Layers, 
  Briefcase, 
  ChevronRight, 
  Copy, 
  Save, 
  Check, 
  AlertCircle,
  Wand2,
  Compass,
  Lock
} from 'lucide-react';
import { 
  RoleBlueprint, 
  RoleCategory, 
  SectorDomain, 
  ExperienceLevel, 
  CompetencyPillar, 
  CompensationBenchmarkTier, 
  InterviewPipelineStage 
} from '../../types';
import { RoleBlueprintService } from '../../services/roleBlueprintService';
import { ROLES_DATA } from '../../data/rolesData';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface CreateRoleBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBlueprintCreated: (blueprint: RoleBlueprint) => void;
  initialRoleToEdit?: RoleBlueprint | null;
  initialDuplicateFromRole?: RoleBlueprint | null;
}

const ROLE_CATEGORIES: RoleCategory[] = [
  'Software Engineering',
  'Product Management',
  'Product & Technical Operations',
  'UI/UX & Product Design',
  'Data Analytics & BI',
  'Data & Machine Learning',
  'Business Analysis & Strategy',
  'Program & Project Management',
  'Growth & Product Marketing',
  'DevOps & Cloud',
  'Security & Systems',
];

const SECTOR_DOMAINS: SectorDomain[] = [
  'Enterprise SaaS',
  'Fintech & Payments',
  'AI & Machine Learning',
  'Cloud Infrastructure & DevOps',
  'Cybersecurity',
  'E-Commerce & Retail',
  'Healthcare & MedTech',
  'Logistics & Supply Chain',
  'EdTech & E-Learning',
  'Gaming & Entertainment',
  'Web3 & Blockchain',
  'Others'
];

const SENIORITY_LEVELS: ExperienceLevel[] = [
  'Junior',
  'Mid-Level',
  'Senior',
  'Lead / Staff',
  'Principal / Fellow',
  'Manager / Director',
  'Executive / C-Suite'
];

const MARKET_DEMANDS = ['Very High', 'High', 'Medium', 'Emerging', 'Surging'] as const;

export const CreateRoleBlueprintModal: React.FC<CreateRoleBlueprintModalProps> = ({
  isOpen,
  onClose,
  onBlueprintCreated,
  initialRoleToEdit,
  initialDuplicateFromRole,
}) => {
  const { capabilities, canCreate, openAccessModal } = useAccessControl();
  const [accessError, setAccessError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  // Mode: builder vs preview
  const [activeView, setActiveView] = useState<'build' | 'preview'>('build');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RoleCategory>('Software Engineering');
  const [domain, setDomain] = useState<SectorDomain>('Enterprise SaaS');
  const [seniority, setSeniority] = useState<ExperienceLevel>('Senior');
  const [marketDemand, setMarketDemand] = useState<'Very High' | 'High' | 'Medium' | 'Emerging' | 'Surging'>('Very High');
  const [tagline, setTagline] = useState('');
  const [missionScope, setMissionScope] = useState('');

  // Compensation Benchmarks
  const [compTiers, setCompTiers] = useState<Record<'junior' | 'mid' | 'senior' | 'lead', { min: number; max: number; currency: string; variable: boolean }>>({
    junior: { min: 95000, max: 125000, currency: '$', variable: false },
    mid: { min: 135000, max: 175000, currency: '$', variable: false },
    senior: { min: 180000, max: 240000, currency: '$', variable: false },
    lead: { min: 245000, max: 320000, currency: '$', variable: true },
  });

  // Competencies
  const [competencies, setCompetencies] = useState<CompetencyPillar[]>([
    {
      name: 'Distributed Systems & Concurrency',
      description: 'Design fault-tolerant services that scale horizontally and handle partial network partitions.',
      keyIndicators: ['CAP theorem trade-offs', 'Raft/Paxos consensus awareness', 'Distributed locking & idempotency', 'Deadlock avoidance'],
    },
    {
      name: 'Database Architecture & Query Optimization',
      description: 'Relational & NoSQL modeling, indexing strategy, transaction isolation levels, and replication.',
      keyIndicators: ['Postgres EXPLAIN ANALYZE tuning', 'ACID vs BASE trade-offs', 'Partitioning and sharding', 'Connection pooling'],
    }
  ]);

  // Typical Day
  const [dailyTimeline, setDailyTimeline] = useState<{ time: string; activity: string; description: string }[]>([
    { time: '09:00 AM', activity: 'Observability & Metrics Review', description: 'Review Datadog latency dashboards, p99 spikes, and asynchronous queue health.' },
    { time: '10:00 AM', activity: 'Cross-functional Architecture Sync', description: 'Align with Frontend and Product on payload contracts and error codes.' },
    { time: '11:00 AM', activity: 'Deep Coding & Implementation', description: 'Develop distributed locking and event-driven pipeline components.' },
    { time: '02:00 PM', activity: 'System RFC Architecture Review', description: 'Present technical proposal for database partitioning and schema migration.' },
    { time: '04:00 PM', activity: 'Code Review & Team Mentorship', description: 'Review pull requests focusing on query optimization and connection leak prevention.' }
  ]);

  // Tech Stack & Tools
  const [techStack, setTechStack] = useState<string[]>(['Go', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes']);
  const [newTechInput, setNewTechInput] = useState('');

  // Interview Pipeline
  const [interviewStages, setInterviewStages] = useState<InterviewPipelineStage[]>([
    { order: 1, name: 'Recruiter Alignment Screen', duration: '30m', description: 'Background overview, motivations, and expectations.' },
    { order: 2, name: 'Technical Coding & Data Structures', duration: '60m', description: 'Algorithmic problem solving and clean code readability.' },
    { order: 3, name: 'System Design & Distributed Scalability', duration: '60m', description: 'Architecting high-scale distributed systems under network constraints.' },
    { order: 4, name: 'Behavioral & Engineering Values', duration: '45m', description: 'Conflict resolution and engineering principles.' }
  ]);

  // Temporary input state for adding competencies/stages/timeline
  const [newSignalInputs, setNewSignalInputs] = useState<Record<number, string>>({});

  // AI Suggestions
  const [suggestions, setSuggestions] = useState<ReturnType<typeof RoleBlueprintService.getIntelligentSuggestions> | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Available blueprints for "Create from existing"
  const allExistingRoles = useMemo(() => {
    return RoleBlueprintService.getAllBlueprints(true);
  }, [isOpen]);

  // Prepopulate form if editing or duplicating
  useEffect(() => {
    isSubmittingRef.current = false;
    setAccessError(null);
    const target = initialRoleToEdit || initialDuplicateFromRole;
    if (target) {
      setTitle(initialDuplicateFromRole ? `${target.title} (Variant)` : target.title);
      setCategory(target.category || 'Software Engineering');
      setDomain((target.industryDomain as SectorDomain) || 'Enterprise SaaS');
      setSeniority(target.level || 'Senior');
      setMarketDemand(target.marketDemand || 'Very High');
      setTagline(target.tagline || '');
      setMissionScope(target.overview || target.missionScope || '');

      // Parse benchmarks if present
      if (target.compensationBenchmarks && target.compensationBenchmarks.length > 0) {
        const newComp = { ...compTiers };
        target.compensationBenchmarks.forEach(t => {
          if (t.level in newComp) {
            newComp[t.level] = {
              min: Number(t.min) || newComp[t.level].min,
              max: Number(t.max) || newComp[t.level].max,
              currency: t.currency || '$',
              variable: Boolean(t.hasVariable)
            };
          }
        });
        setCompTiers(newComp);
      } else if (target.salaryBenchmark) {
        // Parse strings like "$95,000 - $125,000"
        const parseRange = (str: string, fallbackMin: number, fallbackMax: number) => {
          const nums = str.match(/\d+[\d,]*/g);
          if (nums && nums.length >= 2) {
            const min = parseInt(nums[0].replace(/,/g, ''), 10);
            const max = parseInt(nums[1].replace(/,/g, ''), 10);
            return { min: min || fallbackMin, max: max || fallbackMax, currency: '$', variable: str.includes('+') };
          }
          return { min: fallbackMin, max: fallbackMax, currency: '$', variable: str.includes('+') };
        };

        setCompTiers({
          junior: parseRange(target.salaryBenchmark.junior, 95000, 125000),
          mid: parseRange(target.salaryBenchmark.mid, 135000, 175000),
          senior: parseRange(target.salaryBenchmark.senior, 180000, 240000),
          lead: parseRange(target.salaryBenchmark.lead, 245000, 320000),
        });
      }

      setCompetencies(target.competencies || []);
      
      if (target.typicalDay && target.typicalDay.length > 0) {
        setDailyTimeline(target.typicalDay);
      } else if (target.dailyTasksTimeline && target.dailyTasksTimeline.length > 0) {
        setDailyTimeline(target.dailyTasksTimeline.map(d => ({
          time: d.time,
          activity: d.task,
          description: d.description
        })));
      }

      setTechStack(target.primaryTechStack || target.techStack || []);

      if (target.interviewPipeline && target.interviewPipeline.length > 0) {
        setInterviewStages(target.interviewPipeline);
      } else if (target.typicalInterviewStages && target.typicalInterviewStages.length > 0) {
        setInterviewStages(target.typicalInterviewStages.map((stage, idx) => ({
          order: idx + 1,
          name: stage.replace(/\s*\(\d+m\)/, ''),
          duration: stage.match(/\((\d+m)\)/)?.[1] || '60m',
          description: `Standard interview round`
        })));
      }
    } else {
      // Reset defaults
      setTitle('');
      setCategory('Software Engineering');
      setDomain('Enterprise SaaS');
      setSeniority('Senior');
      setMarketDemand('Very High');
      setTagline('');
      setMissionScope('');
    }
  }, [initialRoleToEdit, initialDuplicateFromRole, isOpen]);

  // Load AI suggestions whenever Title, Category, or Seniority changes
  useEffect(() => {
    if (!title && !category) return;
    const sug = RoleBlueprintService.getIntelligentSuggestions({
      title: title || category,
      category,
      domain,
      seniority
    });
    setSuggestions(sug);
  }, [title, category, domain, seniority]);

  // Handle "Create from existing"
  const handleSelectExistingBlueprint = (existingId: string) => {
    if (!existingId) return;
    const source = allExistingRoles.find(r => r.id === existingId);
    if (!source) return;

    setTitle(`${source.title} (Custom)`);
    setCategory(source.category);
    setDomain((source.industryDomain as SectorDomain) || domain);
    setSeniority(source.level);
    setMarketDemand(source.marketDemand || 'Very High');
    setTagline(source.tagline || '');
    setMissionScope(source.overview || source.missionScope || '');
    setCompetencies(source.competencies || []);
    setTechStack(source.primaryTechStack || []);
    if (source.dailyTasksTimeline) {
      setDailyTimeline(source.dailyTasksTimeline.map(d => ({
        time: d.time,
        activity: d.task,
        description: d.description
      })));
    }
  };

  // Add Competency
  const handleAddCompetency = () => {
    setCompetencies(prev => [
      ...prev,
      {
        name: 'New Core Competency',
        description: 'Define the architectural or operational expectation for this domain competency.',
        keyIndicators: ['Proven track record with domain fundamentals', 'Trade-off evaluation under stress']
      }
    ]);
  };

  // Remove Competency
  const handleRemoveCompetency = (index: number) => {
    setCompetencies(prev => prev.filter((_, i) => i !== index));
  };

  // Move Competency
  const handleMoveCompetency = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= competencies.length) return;
    const updated = [...competencies];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setCompetencies(updated);
  };

  // Add Key Indicator signal
  const handleAddSignal = (compIdx: number) => {
    const val = newSignalInputs[compIdx]?.trim();
    if (!val) return;
    setCompetencies(prev => {
      const copy = [...prev];
      copy[compIdx].keyIndicators = [...copy[compIdx].keyIndicators, val];
      return copy;
    });
    setNewSignalInputs(prev => ({ ...prev, [compIdx]: '' }));
  };

  // Remove Key Indicator signal
  const handleRemoveSignal = (compIdx: number, sigIdx: number) => {
    setCompetencies(prev => {
      const copy = [...prev];
      copy[compIdx].keyIndicators = copy[compIdx].keyIndicators.filter((_, i) => i !== sigIdx);
      return copy;
    });
  };

  // Add Tech Tag
  const handleAddTech = (tech: string) => {
    const clean = tech.trim();
    if (!clean || techStack.includes(clean)) return;
    setTechStack(prev => [...prev, clean]);
    setNewTechInput('');
  };

  // Remove Tech Tag
  const handleRemoveTech = (tech: string) => {
    setTechStack(prev => prev.filter(t => t !== tech));
  };

  // Add Timeline Item
  const handleAddTimelineItem = () => {
    setDailyTimeline(prev => [
      ...prev,
      { time: '01:00 PM', activity: 'Technical Working Session', description: 'Cross-team collaborative execution or design review.' }
    ]);
  };

  // Add Stage
  const handleAddStage = () => {
    setInterviewStages(prev => [
      ...prev,
      { order: prev.length + 1, name: 'Technical Evaluation Stage', duration: '60m', description: 'Evaluation of domain architecture and real-world execution.' }
    ]);
  };

  // Format compensation tier to display string
  const formatCompTier = (tier: { min: number; max: number; currency: string; variable: boolean }) => {
    const minF = (tier.min / 1000).toLocaleString();
    const maxF = (tier.max / 1000).toLocaleString();
    return `${tier.currency}${minF}k – ${tier.currency}${maxF}k${tier.variable ? '+' : ''}`;
  };

  // Final Save / Publish
  const handleSave = (status: 'draft' | 'published') => {
    if (isSubmittingRef.current) return;
    if (!initialRoleToEdit?.id && !canCreate('roles')) {
      return;
    }
    if (!title.trim()) {
      setAccessError('Please provide a Role Title before saving.');
      return;
    }
    isSubmittingRef.current = true;

    const formattedBenchmark = {
      junior: formatCompTier(compTiers.junior),
      mid: formatCompTier(compTiers.mid),
      senior: formatCompTier(compTiers.senior),
      lead: formatCompTier(compTiers.lead),
    };

    const formattedCompensationBenchmarks: CompensationBenchmarkTier[] = [
      { level: 'junior', levelLabel: 'Junior', min: compTiers.junior.min, max: compTiers.junior.max, currency: compTiers.junior.currency, hasVariable: compTiers.junior.variable },
      { level: 'mid', levelLabel: 'Mid-Level', min: compTiers.mid.min, max: compTiers.mid.max, currency: compTiers.mid.currency, hasVariable: compTiers.mid.variable },
      { level: 'senior', levelLabel: 'Senior', min: compTiers.senior.min, max: compTiers.senior.max, currency: compTiers.senior.currency, hasVariable: compTiers.senior.variable },
      { level: 'lead', levelLabel: 'Lead / Staff', min: compTiers.lead.min, max: compTiers.lead.max, currency: compTiers.lead.currency, hasVariable: compTiers.lead.variable },
    ];

    const typicalStagesFormatted = interviewStages.map(s => `${s.name} (${s.duration})`);

    const dailyTasksTimeline = dailyTimeline.map(d => ({
      time: d.time,
      task: d.activity,
      description: d.description
    }));

    const blueprintPayload: Omit<RoleBlueprint, 'id' | 'createdAt' | 'updatedAt'> = {
      title: title.trim(),
      category,
      level: seniority,
      seniorityLevel: seniority,
      industryDomain: domain,
      marketDemand,
      tagline: tagline.trim() || `Market blueprint and competency framework for ${title.trim()}`,
      overview: missionScope.trim() || `The ${title.trim()} is responsible for high-leverage execution, architectural leadership, and cross-functional impact.`,
      missionScope: missionScope.trim(),
      salaryBenchmark: formattedBenchmark,
      compensationBenchmarks: formattedCompensationBenchmarks,
      competencies,
      dailyTasksTimeline,
      typicalDay: dailyTimeline,
      primaryTechStack: techStack,
      techStack,
      commonTools: techStack.slice(0, 5),
      keyPerformanceMetrics: ['Execution Velocity', 'System Reliability 99.9%', 'Architecture Quality', 'Mentorship & Culture'],
      careerProgression: ['Junior Engineer', 'Mid Engineer', 'Senior Engineer', 'Lead / Staff Architect'],
      typicalInterviewStages: typicalStagesFormatted,
      interviewPipeline: interviewStages,
      status,
      isCustom: true
    };

    try {
      if (initialRoleToEdit?.id) {
        const updated = RoleBlueprintService.updateBlueprint(initialRoleToEdit.id, blueprintPayload);
        if (updated) {
          onBlueprintCreated(updated);
          onClose();
        }
      } else {
        const created = RoleBlueprintService.createBlueprint(blueprintPayload);
        onBlueprintCreated(created);
        onClose();
      }
    } catch (err: any) {
      isSubmittingRef.current = false;
      setAccessError(err.message || 'Creation is restricted in your current access mode.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* HEADER BAR */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  {initialRoleToEdit ? 'Edit Role Blueprint' : 'Create Role Blueprint'}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  Market Standard Entity
                </span>
              </div>
              <p className="text-xs text-slate-500 font-normal">
                Define first-class market expectations, compensation tiers, and core competency rubrics.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* View Switcher: Builder vs Preview */}
            <div className="inline-flex p-1 bg-slate-200/80 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveView('build')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'build'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Structured Form</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeView === 'preview'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5 text-purple-600" />
                <span>Preview Blueprint</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY (SCROLLABLE) */}
        <DemoQuotaGate workflowKey="roles" isEditing={Boolean(initialRoleToEdit)} onViewExistingItems={onClose}>
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-7">
          <AccessCreationBanner workflowKey="roles" workflowLabel="role blueprints" />

          {accessError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{accessError}</span>
            </div>
          )}
          
          {/* VIEW 1: PREVIEW BLUEPRINT (Resembles RoleDetailModal) */}
          {activeView === 'preview' ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Preview Header (Basic Fields) */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
                      {category}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {domain} · {seniority}
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {title || 'Untitled Role Blueprint'}
                  </h1>
                  <p className="text-sm text-slate-600 mt-1">
                    {tagline || 'No short description specified.'}
                  </p>
                </div>
              </div>

              <ProgressiveCreationSection workflowKey="roles">
                {/* Mission & Scope */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Mission &amp; Scope
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-white p-4 rounded-xl border border-slate-200">
                    {missionScope || 'No mission & scope defined yet.'}
                  </p>
                </div>

                {/* Compensation Benchmarks */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    Market Compensation Benchmarks (Base + Variable)
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Junior</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{formatCompTier(compTiers.junior)}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Mid-Level</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{formatCompTier(compTiers.mid)}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-blue-200 bg-blue-50/40">
                      <div className="text-[11px] text-blue-700 font-bold">Senior (Benchmark)</div>
                      <div className="text-xs font-bold text-blue-900 mt-0.5">{formatCompTier(compTiers.senior)}</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-200">
                      <div className="text-[11px] text-slate-500 font-medium">Lead / Staff</div>
                      <div className="text-xs font-bold text-slate-900 mt-0.5">{formatCompTier(compTiers.lead)}</div>
                    </div>
                  </div>
                </div>

                {/* Core Competencies */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Core Competencies &amp; Calibration Standards ({competencies.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {competencies.map((comp, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold shrink-0">
                            {idx + 1}
                          </span>
                          <span>{comp.name}</span>
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {comp.description}
                        </p>
                        {comp.keyIndicators.length > 0 && (
                          <div className="pt-2 border-t border-slate-100">
                            <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">Key Calibration Signals:</div>
                            <ul className="space-y-1">
                              {comp.keyIndicators.map((ind, i) => (
                                <li key={i} className="text-[11px] text-slate-700 flex items-start gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                                  <span>{ind}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Typical Day */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-500" />
                    Typical Day in the Life
                  </h3>
                  <div className="space-y-2">
                    {dailyTimeline.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-xs font-mono font-bold text-blue-600 whitespace-nowrap pt-0.5">
                          {item.time}
                        </span>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.activity}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{item.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack & Interview Stages */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Primary Tech Stack &amp; Tools ({techStack.length})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {techStack.map((tech, idx) => (
                        <span key={idx} className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-white">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Standard Interview Pipeline ({interviewStages.length})
                    </h4>
                    <ol className="space-y-1.5">
                      {interviewStages.map((stage, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                            {stage.order || idx + 1}
                          </span>
                          <span className="font-semibold text-slate-900">{stage.name}</span>
                          <span className="text-slate-400 text-[11px]">({stage.duration})</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </ProgressiveCreationSection>

              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={() => setActiveView('build')}
                  className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Return to Form to Edit Details</span>
                </button>
              </div>
            </div>
          ) : (
            /* VIEW 2: STRUCTURED BUILDER FORM */
            <div className="space-y-8">
              
              {/* SECTION A: BASIC ROLE BLUEPRINT FIELDS */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">A</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Basic Role Blueprint Details</h3>
                  </div>
                  <span className="text-xs text-slate-400">Role Title, Family, Seniority, Domain &amp; Short Description</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Title */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Role Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="input-role-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Senior Backend Engineer, Staff AI Systems Architect"
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  {/* Role Family / Category */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Role Family <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="select-role-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as RoleCategory)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      {ROLE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Seniority Level */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Seniority
                    </label>
                    <select
                      id="select-role-seniority"
                      value={seniority}
                      onChange={(e) => setSeniority(e.target.value as ExperienceLevel)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      {SENIORITY_LEVELS.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  {/* Industry Domain */}
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Domain
                    </label>
                    <select
                      id="select-role-domain"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value as SectorDomain)}
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                    >
                      {SECTOR_DOMAINS.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  {/* Short Tagline */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Short Description
                    </label>
                    <input
                      id="input-role-tagline"
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Architect distributed systems, high-throughput APIs, and data integrity layers."
                      className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* ADVANCED SECTION: CAPABILITY ARCHITECTURE, COMPETENCY MAPPING, EVIDENCE REQUIREMENTS, EVALUATION CRITERIA, MARKET BENCHMARK */}
              <ProgressiveCreationSection workflowKey="roles">
                {/* SECONDARY ACTION: Create from existing blueprint */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <Copy className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-blue-950 block">Create from existing blueprint?</span>
                      <span className="text-[11px] text-blue-700">Pre-fill competencies, compensation tiers, and interview structure from an existing role ladder.</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <select
                      id="select-existing-blueprint"
                      onChange={(e) => handleSelectExistingBlueprint(e.target.value)}
                      defaultValue=""
                      className="text-xs font-semibold px-3 py-1.5 bg-white border border-blue-300 rounded-lg text-slate-800 shadow-2xs focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                      <option value="" disabled>Select existing blueprint...</option>
                      {allExistingRoles.map(r => (
                        <option key={r.id} value={r.id}>
                          {r.title} ({r.category})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Market Demand Signal */}
                <div className="max-w-xs">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Market Demand Signal
                  </label>
                  <select
                    id="select-market-demand"
                    value={marketDemand}
                    onChange={(e) => setMarketDemand(e.target.value as any)}
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                  >
                    {MARKET_DEMANDS.map(dem => (
                      <option key={dem} value={dem}>{dem} Demand</option>
                    ))}
                  </select>
                </div>

                {/* SECTION B: MISSION & SCOPE */}
                <div className="space-y-2">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">B</span>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Mission &amp; Scope</h3>
                    </div>
                    {suggestions && (
                      <button
                        type="button"
                        onClick={() => setMissionScope(suggestions.suggestedMissionScope)}
                        className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        <span>Use AI Draft</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Define what this role is responsible for, the problems it solves, and its expected scope of impact.
                  </p>

                  <textarea
                    id="textarea-mission-scope"
                    rows={4}
                    value={missionScope}
                    onChange={(e) => setMissionScope(e.target.value)}
                    placeholder="Backend Engineers are responsible for server-side logic, database reliability, performance optimization, and API orchestration..."
                    className="w-full text-xs font-medium p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed"
                  />
                </div>

                {/* SECTION C: COMPENSATION BENCHMARKS */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">C</span>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Compensation Benchmarks</h3>
                    </div>
                    <span className="text-xs text-slate-400">4-tier career level matrix</span>
                  </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['junior', 'mid', 'senior', 'lead'] as const).map(tierKey => {
                    const tierLabel = tierKey === 'junior' ? 'Junior' :
                                      tierKey === 'mid' ? 'Mid-Level' :
                                      tierKey === 'senior' ? 'Senior (Benchmark)' :
                                      'Lead / Staff';
                    const data = compTiers[tierKey];

                    return (
                      <div 
                        key={tierKey}
                        className={`p-3.5 rounded-xl border transition-all ${
                          tierKey === 'senior' ? 'bg-blue-50/30 border-blue-200 ring-1 ring-blue-300/40' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-900">{tierLabel}</span>
                          <span className="text-[10px] font-mono font-bold text-slate-500">
                            {formatCompTier(data)}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Min ($)</span>
                              <input
                                type="number"
                                step="5000"
                                value={data.min}
                                onChange={(e) => setCompTiers(prev => ({
                                  ...prev,
                                  [tierKey]: { ...prev[tierKey], min: Number(e.target.value) || 0 }
                                }))}
                                className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                              />
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 font-semibold block mb-0.5">Max ($)</span>
                              <input
                                type="number"
                                step="5000"
                                value={data.max}
                                onChange={(e) => setCompTiers(prev => ({
                                  ...prev,
                                  [tierKey]: { ...prev[tierKey], max: Number(e.target.value) || 0 }
                                }))}
                                className="w-full text-xs font-semibold px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                              />
                            </div>
                          </div>

                          <label className="flex items-center gap-1.5 text-[11px] text-slate-600 cursor-pointer pt-1">
                            <input
                              type="checkbox"
                              checked={data.variable}
                              onChange={(e) => setCompTiers(prev => ({
                                ...prev,
                                [tierKey]: { ...prev[tierKey], variable: e.target.checked }
                              }))}
                              className="rounded text-blue-600 focus:ring-blue-500"
                            />
                            <span>Includes variable / equity (+)</span>
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* SECTION D: CORE COMPETENCIES */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">D</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Core Competencies ({competencies.length})
                    </h3>
                  </div>

                  <button
                    id="btn-add-competency"
                    type="button"
                    onClick={handleAddCompetency}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Competency</span>
                  </button>
                </div>

                {/* AI Suggestions for Competencies */}
                {suggestions && suggestions.suggestedCompetencies.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                        AI Suggested Competencies for {title || category}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const existingNames = new Set(competencies.map(c => c.name));
                          const toAdd = suggestions.suggestedCompetencies.filter(c => !existingNames.has(c.name));
                          setCompetencies(prev => [...prev, ...toAdd]);
                        }}
                        className="text-2xs font-bold text-purple-700 hover:text-purple-900 bg-white px-2 py-1 rounded border border-purple-200 shadow-2xs cursor-pointer"
                      >
                        + Add all suggested
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {suggestions.suggestedCompetencies.map((sc, i) => {
                        const isAdded = competencies.some(c => c.name === sc.name);
                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isAdded}
                            onClick={() => setCompetencies(prev => [...prev, sc])}
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 ${
                              isAdded 
                                ? 'bg-purple-100/60 text-purple-400 border-purple-200 cursor-default'
                                : 'bg-white text-purple-800 border-purple-300 hover:border-purple-500 hover:bg-purple-50 cursor-pointer shadow-3xs'
                            }`}
                          >
                            <span>{sc.name}</span>
                            {isAdded ? <Check className="w-3 h-3 text-purple-400" /> : <Plus className="w-3 h-3 text-purple-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Competency Cards List */}
                <div className="space-y-4">
                  {competencies.map((comp, compIdx) => (
                    <div 
                      key={compIdx}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 shadow-3xs space-y-3 transition-all"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Competency Pillar #{compIdx + 1}
                            </label>
                            <input
                              type="text"
                              value={comp.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCompetencies(prev => {
                                  const copy = [...prev];
                                  copy[compIdx].name = val;
                                  return copy;
                                });
                              }}
                              placeholder="e.g. Distributed Systems & Concurrency"
                              className="w-full text-xs font-bold text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                              Definition &amp; Core Standards
                            </label>
                            <input
                              type="text"
                              value={comp.description}
                              onChange={(e) => {
                                const val = e.target.value;
                                setCompetencies(prev => {
                                  const copy = [...prev];
                                  copy[compIdx].description = val;
                                  return copy;
                                });
                              }}
                              placeholder="Design fault-tolerant services that scale horizontally..."
                              className="w-full text-xs font-medium text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Controls: Reorder & Delete */}
                        <div className="flex items-center gap-1 shrink-0 pt-4">
                          <button
                            type="button"
                            disabled={compIdx === 0}
                            onClick={() => handleMoveCompetency(compIdx, 'up')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={compIdx === competencies.length - 1}
                            onClick={() => handleMoveCompetency(compIdx, 'down')}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveCompetency(compIdx)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Delete Competency"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Key Calibration Signals */}
                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Key Calibration Signals (Interview Rubric Proof Points)
                        </span>

                        <div className="flex flex-wrap gap-1.5">
                          {comp.keyIndicators.map((sig, sigIdx) => (
                            <span 
                              key={sigIdx}
                              className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200/80"
                            >
                              <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>{sig}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveSignal(compIdx, sigIdx)}
                                className="text-slate-400 hover:text-rose-600 ml-0.5 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Add new signal */}
                        <div className="flex items-center gap-2 pt-1 max-w-md">
                          <input
                            type="text"
                            value={newSignalInputs[compIdx] || ''}
                            onChange={(e) => setNewSignalInputs(prev => ({ ...prev, [compIdx]: e.target.value }))}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddSignal(compIdx);
                              }
                            }}
                            placeholder="Add evaluation signal (e.g. CAP theorem trade-offs)..."
                            className="flex-1 text-[11px] px-2.5 py-1 rounded-md border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddSignal(compIdx)}
                            className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION E: TYPICAL DAY IN THE LIFE */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">E</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Typical Day in the Life ({dailyTimeline.length})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddTimelineItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Timeline Item</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {dailyTimeline.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <input
                        type="text"
                        value={item.time}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDailyTimeline(prev => {
                            const copy = [...prev];
                            copy[idx].time = val;
                            return copy;
                          });
                        }}
                        placeholder="09:00 AM"
                        className="w-24 text-xs font-mono font-bold text-blue-700 px-2 py-1.5 rounded-lg border border-slate-200 bg-white shrink-0"
                      />
                      <input
                        type="text"
                        value={item.activity}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDailyTimeline(prev => {
                            const copy = [...prev];
                            copy[idx].activity = val;
                            return copy;
                          });
                        }}
                        placeholder="Activity title..."
                        className="w-52 text-xs font-bold text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDailyTimeline(prev => {
                            const copy = [...prev];
                            copy[idx].description = val;
                            return copy;
                          });
                        }}
                        placeholder="Detailed task description..."
                        className="flex-1 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setDailyTimeline(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer self-end sm:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION F: PRIMARY TECH STACK & TOOLS */}
              <div className="space-y-3">
                <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">F</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Primary Tech Stack &amp; Tools ({techStack.length})
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">Tag-based chips</span>
                </div>

                {/* AI Tech Stack Suggestions */}
                {suggestions && suggestions.suggestedTechStack.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-purple-700 bg-purple-50/50 p-2.5 rounded-xl border border-purple-100">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                    <span className="font-bold text-[11px]">Quick Add:</span>
                    {suggestions.suggestedTechStack.map((tech, i) => {
                      const isAdded = techStack.includes(tech);
                      if (isAdded) return null;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleAddTech(tech)}
                          className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-purple-200 text-purple-800 hover:bg-purple-100 cursor-pointer shadow-3xs"
                        >
                          + {tech}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Chips Container */}
                <div className="p-3 rounded-xl border border-slate-200 bg-white flex flex-wrap items-center gap-1.5">
                  {techStack.map((tech, idx) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  <div className="flex items-center gap-1">
                    <input
                      id="input-new-tech"
                      type="text"
                      value={newTechInput}
                      onChange={(e) => setNewTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTech(newTechInput);
                        }
                      }}
                      placeholder="Type tech and press Enter..."
                      className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTech(newTechInput)}
                      className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION G: STANDARD INTERVIEW PIPELINE */}
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">G</span>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Standard Interview Pipeline ({interviewStages.length})
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddStage}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Stage</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {interviewStages.map((stage, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {stage.order || idx + 1}
                      </span>
                      <input
                        type="text"
                        value={stage.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInterviewStages(prev => {
                            const copy = [...prev];
                            copy[idx].name = val;
                            return copy;
                          });
                        }}
                        placeholder="Stage name (e.g. System Design)..."
                        className="flex-1 text-xs font-bold text-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        value={stage.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInterviewStages(prev => {
                            const copy = [...prev];
                            copy[idx].duration = val;
                            return copy;
                          });
                        }}
                        placeholder="Duration (e.g. 60m)"
                        className="w-24 text-xs font-semibold text-slate-700 px-2 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <input
                        type="text"
                        value={stage.description || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setInterviewStages(prev => {
                            const copy = [...prev];
                            copy[idx].description = val;
                            return copy;
                          });
                        }}
                        placeholder="Evaluation purpose..."
                        className="flex-1 text-xs text-slate-500 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setInterviewStages(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer self-end sm:self-center"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              </ProgressiveCreationSection>

            </div>
          )}

        </div>

        {/* FOOTER ACTIONS BAR */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              id="btn-cancel-blueprint"
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {capabilities.canCreate && (
              <button
                id="btn-save-draft-blueprint"
                type="button"
                onClick={() => handleSave('draft')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>Save as Draft</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeView === 'build' ? (
              <button
                type="button"
                onClick={() => setActiveView('preview')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5 text-purple-600" />
                <span>Preview Blueprint</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setActiveView('build')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                <span>Edit Details</span>
              </button>
            )}

            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openAccessModal('DEMO')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                id="btn-publish-blueprint"
                type="button"
                onClick={() => handleSave('published')}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm cursor-pointer flex items-center gap-2"
              >
                <Check className="w-4 h-4 text-white" />
                <span>{initialRoleToEdit ? 'Save Changes & Publish' : 'Create Role Blueprint'}</span>
              </button>
            )}
          </div>
        </div>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
