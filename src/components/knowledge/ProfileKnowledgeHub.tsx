import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  Plus, 
  Download, 
  Upload, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Play,
  BookmarkPlus,
  Info,
  ChevronRight
} from 'lucide-react';
import { 
  EvidenceItem, 
  CandidateStory, 
  StructuredAnswerBlueprint, 
  MetricLedgerItem, 
  ProfileKnowledgeSection 
} from '../../features/knowledge/types';
import { KnowledgeStorageService } from '../../features/knowledge/services/knowledgeStorageService';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { ContextualIntelligenceEngine } from '../../features/applications/services/contextualIntelligenceEngine';
import { EvidenceSection } from './EvidenceSection';
import { StoryBankSection } from './StoryBankSection';
import { AnswerBlueprintsSection } from './AnswerBlueprintsSection';
import { MetricsLedgerSection } from './MetricsLedgerSection';
import { EvidenceModal } from './EvidenceModal';
import { StoryModal } from './StoryModal';
import { BlueprintModal } from './BlueprintModal';
import { MetricModal } from './MetricModal';
import { KnowledgeInfoPopover } from './KnowledgeInfoPopover';
import { SkillEvidenceGraphView } from './SkillEvidenceGraphView';
import { sourceStore } from '../../features/sources/services/sourceStore';

interface ProfileKnowledgeHubProps {
  onStartPracticeWithBlueprint?: (blueprint: StructuredAnswerBlueprint) => void;
  onOpenQuestionDetail?: (questionId: string) => void;
  onOpenApplicationWorkspace?: (applicationId: string) => void;
}

export const ProfileKnowledgeHub: React.FC<ProfileKnowledgeHubProps> = ({
  onStartPracticeWithBlueprint,
  onOpenQuestionDetail,
  onOpenApplicationWorkspace
}) => {
  const [activeSection, setActiveSection] = useState<ProfileKnowledgeSection>('overview');
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  
  // Data state
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [stories, setStories] = useState<CandidateStory[]>([]);
  const [blueprints, setBlueprints] = useState<StructuredAnswerBlueprint[]>([]);
  const [metrics, setMetrics] = useState<MetricLedgerItem[]>([]);

  // Application Intelligence State
  const applications = useMemo(() => applicationStore.getApplications(), []);
  const activeApplications = useMemo(() => 
    applications.filter(a => !['REJECTED', 'WITHDRAWN', 'ACCEPTED'].includes(a.status)),
    [applications]
  );
  const totalUpcomingAssessments = useMemo(() => 
    applications.filter(a => ['ASSESSMENT', 'CASE'].includes(a.status)).length,
    [applications]
  );
  const totalTasks = useMemo(() => {
    let count = 0;
    applications.forEach(a => {
      count += applicationStore.getPreparationTasks(a.id).filter(t => t.status === 'TODO').length;
    });
    return count;
  }, [applications]);

  // Modals state
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [editingEvidence, setEditingEvidence] = useState<EvidenceItem | null>(null);

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState<CandidateStory | null>(null);

  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [editingBlueprint, setEditingBlueprint] = useState<StructuredAnswerBlueprint | null>(null);
  const [preselectedStoryForBlueprint, setPreselectedStoryForBlueprint] = useState<CandidateStory | null>(null);

  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<MetricLedgerItem | null>(null);

  // Status message
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  // Load from local storage
  const reloadData = () => {
    setEvidenceList(KnowledgeStorageService.getEvidence());
    setStories(KnowledgeStorageService.getStories());
    setBlueprints(KnowledgeStorageService.getBlueprints());
    setMetrics(KnowledgeStorageService.getMetrics());
  };

  useEffect(() => {
    reloadData();
  }, []);

  // Readiness calculations
  const readiness = useMemo(() => {
    const verifiedProofPoints = metrics.filter(m => m.verificationStatus === 'Verified').length;
    
    // Unique questions linked across all layers
    const qIds = new Set<string>();
    evidenceList.forEach(e => e.linkedQuestionIds?.forEach(id => qIds.add(id)));
    stories.forEach(s => s.linkedQuestionIds?.forEach(id => qIds.add(id)));
    blueprints.forEach(b => {
      if (b.targetQuestionId) qIds.add(b.targetQuestionId);
    });

    return {
      evidenceCount: evidenceList.length,
      verifiedProofPoints,
      totalProofPoints: metrics.length,
      storiesCount: stories.length,
      blueprintsCount: blueprints.length,
      questionsCovered: qIds.size
    };
  }, [evidenceList, stories, blueprints, metrics]);

  // Evidence actions
  const handleSaveEvidence = (item: EvidenceItem) => {
    const updated = KnowledgeStorageService.addOrUpdateEvidence(item);
    setEvidenceList(updated);
    showNotification(`Evidence "${item.title}" saved successfully`);
  };

  const handleDeleteEvidence = (id: string) => {
    if (window.confirm('Are you sure you want to delete this evidence record?')) {
      const updated = KnowledgeStorageService.deleteEvidence(id);
      setEvidenceList(updated);
      showNotification('Evidence record deleted');
    }
  };

  const handlePromoteEvidenceToStory = (evidence: EvidenceItem) => {
    const existing = stories.find(s => s.evidenceId === evidence.id);
    if (existing) {
      setEditingStory(existing);
      setIsStoryModalOpen(true);
      return;
    }

    const newStory: CandidateStory = {
      id: `story-${Date.now()}`,
      title: evidence.title,
      evidenceId: evidence.id,
      bestFor: ['Decision Making', 'Scale'],
      relevantRoles: evidence.roles.length > 0 ? evidence.roles : ['PM'],
      skills: evidence.skills.length > 0 ? evidence.skills : ['Stakeholder Management'],
      metricsStatus: evidence.metrics.some(m => !m.toLowerCase().includes('add a concrete metric')) ? 'Available' : 'Missing',
      metrics: evidence.metrics,
      evidenceQuality: evidence.metrics.some(m => !m.toLowerCase().includes('add a concrete metric')) ? 'Strong evidence' : 'Needs metrics',
      synopsis: evidence.shortSummary || evidence.context.slice(0, 140),
      context: evidence.context,
      myRole: evidence.myRole,
      actions: evidence.actions,
      decision: evidence.decision,
      tradeoffs: evidence.tradeoffs,
      outcome: evidence.outcome,
      linkedQuestionIds: evidence.linkedQuestionIds,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setEditingStory(newStory);
    setIsStoryModalOpen(true);
  };

  // Story actions
  const handleSaveStory = (story: CandidateStory) => {
    const updated = KnowledgeStorageService.addOrUpdateStory(story);
    setStories(updated);
    showNotification(`Story "${story.title}" saved to Stories`);
  };

  const handleDeleteStory = (id: string) => {
    if (window.confirm('Delete this story card?')) {
      const updated = KnowledgeStorageService.deleteStory(id);
      setStories(updated);
      showNotification('Story card deleted');
    }
  };

  const handleToggleStoryQuestionLink = (storyId: string, questionId: string) => {
    KnowledgeStorageService.toggleStoryQuestionLink(storyId, questionId);
    setStories(KnowledgeStorageService.getStories());
    setEvidenceList(KnowledgeStorageService.getEvidence());
  };

  const handleCreateBlueprintFromStory = (story: CandidateStory) => {
    setPreselectedStoryForBlueprint(story);
    setEditingBlueprint(null);
    setIsBlueprintModalOpen(true);
  };

  // Blueprint actions
  const handleSaveBlueprint = (bp: StructuredAnswerBlueprint) => {
    const updated = KnowledgeStorageService.addOrUpdateBlueprint(bp);
    setBlueprints(updated);
    showNotification(`Blueprint "${bp.title}" saved successfully`);
  };

  const handleDeleteBlueprint = (id: string) => {
    if (window.confirm('Delete this Answer Blueprint?')) {
      const updated = KnowledgeStorageService.deleteBlueprint(id);
      setBlueprints(updated);
      showNotification('Answer blueprint deleted');
    }
  };

  // Metrics actions
  const handleSaveMetric = (m: MetricLedgerItem) => {
    const updated = KnowledgeStorageService.addOrUpdateMetric(m);
    setMetrics(updated);
    showNotification(`Proof point recorded successfully`);
  };

  const handleDeleteMetric = (id: string) => {
    if (window.confirm('Delete this metric?')) {
      const updated = KnowledgeStorageService.deleteMetric(id);
      setMetrics(updated);
      showNotification('Metric deleted');
    }
  };

  // Export / Import / Reset
  const handleExport = () => {
    const jsonStr = KnowledgeStorageService.exportKnowledgeJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `career_interview_os_personal_knowledge_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Personal Knowledge exported as JSON');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      const text = event.target?.result as string;
      const success = KnowledgeStorageService.importKnowledgeJson(text);
      if (success) {
        reloadData();
        showNotification('Knowledge data imported successfully');
      } else {
        alert('Invalid knowledge JSON file format.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetDemo = () => {
    if (window.confirm('Reset all personal knowledge data to default verified interview seed records?')) {
      KnowledgeStorageService.resetToDemoData();
      reloadData();
      showNotification('Personal Knowledge reset to verified demo seed records');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 2. HUB / HEADER EXPERIENCE */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-linear-to-br from-blue-100/40 via-purple-100/30 to-emerald-100/30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-2xs">
                Personal Knowledge System
              </span>
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer border border-blue-200/70"
              >
                <span>How this works</span>
                <span className="font-serif">ⓘ</span>
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Personal Knowledge
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              Capture what you’ve done, attach proof, and turn your best work into interview-ready answers.
            </p>
          </div>

          {/* Action Tools */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Export all evidence, stories, and blueprints as JSON"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export JSON</span>
            </button>

            <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>

            <button
              type="button"
              onClick={handleResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
              title="Reset to rich verified demo data"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>

        {/* 3. KNOWLEDGE READINESS BLOCK */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                Knowledge Readiness
              </span>
              <KnowledgeInfoPopover
                label="Knowledge Readiness"
                explanation="Shows how well-equipped Career OS is to retrieve strong answers and proof points during your live interview simulations."
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Career OS uses these layers to assist you during live interview simulations.
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button
              type="button"
              onClick={() => setActiveSection('evidence')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeSection === 'evidence'
                  ? 'bg-blue-50/80 border-blue-200 shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/60'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Evidence Captured
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-slate-900">{readiness.evidenceCount}</span>
                <span className="text-xs text-slate-500 font-medium">items</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('metrics')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeSection === 'metrics'
                  ? 'bg-emerald-50/80 border-emerald-200 shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/60'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Verified Proof Points
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-emerald-700">{readiness.verifiedProofPoints}</span>
                <span className="text-xs text-slate-500 font-medium">metrics</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('stories')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeSection === 'stories'
                  ? 'bg-purple-50/80 border-purple-200 shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/60'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Behavioral Stories Ready
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-purple-900">{readiness.storiesCount}</span>
                <span className="text-xs text-slate-500 font-medium">stories</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setActiveSection('blueprints')}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                activeSection === 'blueprints'
                  ? 'bg-amber-50/80 border-amber-200 shadow-2xs'
                  : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200/60'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Answer Blueprints
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-amber-700">{readiness.blueprintsCount}</span>
                <span className="text-xs text-slate-500 font-medium">formed</span>
              </div>
            </button>

            <div className="p-3 rounded-2xl border border-slate-200/60 bg-slate-50/70 text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Questions Covered
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-xl font-black text-blue-900">{readiness.questionsCovered}</span>
                <span className="text-xs text-slate-500 font-medium">questions</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* SECTION 35: ACTIVE APPLICATIONS & ASSESSMENT READINESS INTEGRATION */}
      {activeApplications.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 tracking-tight uppercase">
                  Active Applications & Case Intelligence
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  Target Pipelines
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target opportunities with active preparation plans. Click an opportunity to open its dedicated Application Workspace.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                {activeApplications.length} Active {activeApplications.length === 1 ? 'App' : 'Apps'}
              </span>
              <span className="text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-100">
                {totalUpcomingAssessments} {totalUpcomingAssessments === 1 ? 'Assessment' : 'Assessments'}
              </span>
              <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                {totalTasks} Prep Tasks
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {activeApplications.map(appItem => {
              const hasCase = appItem.assessmentIds && appItem.assessmentIds.length > 0;
              return (
                <div
                  key={appItem.id}
                  onClick={() => {
                    if (onOpenApplicationWorkspace) {
                      onOpenApplicationWorkspace(appItem.id);
                    }
                  }}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between space-y-2 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {appItem.companyName}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-md ${
                        appItem.status === 'CASE' ? 'bg-purple-100 text-purple-800' :
                        appItem.status === 'ASSESSMENT' ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-200 text-slate-700'
                      }`}>
                        {appItem.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {appItem.roleTitle}
                    </h4>

                    {hasCase && (
                      <div className="flex items-center gap-1 text-[11px] text-purple-700 font-medium">
                        <span>• Take-home case attached</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">
                      {appItem.deadline ? `Due ${new Date(appItem.deadline).toLocaleDateString()}` : 'No deadline'}
                    </span>
                    <span className="font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                      Open Workspace →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. FIRST-TIME USER EDUCATION ONBOARDING BLOCK (when <= 2 items) */}
      {readiness.evidenceCount <= 2 && (
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/80 rounded-3xl border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-700 text-white text-[10px] font-black uppercase tracking-wider">
                Getting Started
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Start with Evidence.
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              Add 2–3 meaningful projects or roles. Once added, you can extract metrics, shape stories, and build answer blueprints for live interview practice.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingEvidence(null);
              setIsEvidenceModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Evidence</span>
          </button>
        </div>
      )}

      {/* Notification Toast */}
      {statusMessage && (
        <div className="p-3 bg-slate-900 text-white text-xs font-semibold rounded-xl flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
          <button 
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-slate-400 hover:text-white ml-3 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. PRIMARY PROFILE ARCHITECTURE TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSection('overview')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('evidence')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'evidence'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Evidence</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeSection === 'evidence' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {readiness.evidenceCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('stories')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'stories'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Stories</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeSection === 'stories' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {readiness.storiesCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('metrics')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'metrics'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Metrics & Proof</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeSection === 'metrics' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {readiness.totalProofPoints}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('blueprints')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'blueprints'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Answer Blueprints</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeSection === 'blueprints' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {readiness.blueprintsCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('skill_evidence')}
          className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeSection === 'skill_evidence'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-blue-500" />
          <span>Skill Evidence Graph</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
            activeSection === 'skill_evidence' ? 'bg-slate-800 text-slate-200' : 'bg-slate-200 text-slate-700'
          }`}>
            {sourceStore.getAggregateMetrics().validatedSkillsCount}
          </span>
        </button>
      </div>

      {/* OVERVIEW SECTION: Visual narrative pipeline and layer explorer */}
      {activeSection === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          
          {/* Core Narrative Step Flow: Evidence → Metrics & Proof → Stories → Answer Blueprints → Live Interview */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                The Personal Knowledge Lifecycle
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                How Your Experiences Become High-Scoring Interview Answers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
                Rather than memorizing scripts or fumbling for examples under pressure, organize what you actually did into four connected layers.
              </p>
            </div>

            {/* 5-Step Narrative Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* Step 1: Evidence */}
              <div 
                onClick={() => setActiveSection('evidence')}
                className="p-4 rounded-2xl border border-blue-200/90 bg-blue-50/40 hover:bg-blue-50 hover:shadow-xs transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                      {readiness.evidenceCount} items
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Evidence</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Raw accomplishments, projects, and career history.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-blue-700 pt-2">
                  <span>View Evidence</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Step 2: Metrics & Proof */}
              <div 
                onClick={() => setActiveSection('metrics')}
                className="p-4 rounded-2xl border border-emerald-200/90 bg-emerald-50/40 hover:bg-emerald-50 hover:shadow-xs transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {readiness.verifiedProofPoints} verified
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Metrics & Proof</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Concrete numbers, latency, revenue, scale, and validation.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-emerald-700 pt-2">
                  <span>View Metrics</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Step 3: Stories */}
              <div 
                onClick={() => setActiveSection('stories')}
                className="p-4 rounded-2xl border border-purple-200/90 bg-purple-50/40 hover:bg-purple-50 hover:shadow-xs transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {readiness.storiesCount} stories
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Stories</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Experiences packaged for themes (Conflict, Ambiguity, Leadership).
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-purple-700 pt-2">
                  <span>View Stories</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Step 4: Answer Blueprints */}
              <div 
                onClick={() => setActiveSection('blueprints')}
                className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/40 hover:bg-amber-50 hover:shadow-xs transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {readiness.blueprintsCount} blueprints
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Answer Blueprints</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Structured, question-specific response frameworks.
                  </p>
                </div>
                <div className="flex items-center text-xs font-bold text-amber-700 pt-2">
                  <span>View Blueprints</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>

              {/* Step 5: Live Interview */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-900 text-white space-y-2 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                      5
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      Live Retrieval
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">Live Interview</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Career OS pulls from these layers in real time during simulations.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-emerald-400 pt-2">
                  Ready during simulator
                </span>
              </div>
            </div>

            {/* Core Narrative Philosophy Quote */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3 text-xs text-slate-700">
              <span className="text-xl font-serif text-slate-400">“</span>
              <p className="font-medium italic">
                I capture what I actually did. I attach proof. I turn strong experiences into stories. I connect those stories to interview questions. Career OS retrieves them during practice.
              </p>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              type="button"
              onClick={() => {
                setEditingEvidence(null);
                setIsEvidenceModalOpen(true);
              }}
              className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 text-left transition-all shadow-2xs space-y-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Add Evidence Record</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Log a new project, role, or technical deliverable.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingMetric(null);
                setIsMetricModalOpen(true);
              }}
              className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 text-left transition-all shadow-2xs space-y-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Record Proof Point</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Add an audit-backed metric, latency reduction, or scale.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingStory(null);
                setIsStoryModalOpen(true);
              }}
              className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 text-left transition-all shadow-2xs space-y-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Shape Behavioral Story</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Package an experience for conflict, ambiguity, or scale.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingBlueprint(null);
                setPreselectedStoryForBlueprint(null);
                setIsBlueprintModalOpen(true);
              }}
              className="p-5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-200/90 text-left transition-all shadow-2xs space-y-2 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Create Answer Blueprint</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect a target question to your best story & rapid cues.
              </p>
            </button>
          </div>

          {/* Quick Preview Matrix: Recent Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Stories */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Recent Behavioral Stories</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('stories')}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 cursor-pointer"
                >
                  View all ({stories.length})
                </button>
              </div>

              {stories.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No stories created yet.</p>
              ) : (
                <div className="space-y-2">
                  {stories.slice(0, 3).map(st => (
                    <div
                      key={st.id}
                      onClick={() => setActiveSection('stories')}
                      className="p-3 rounded-xl border border-slate-200/70 hover:bg-purple-50/30 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{st.title}</span>
                        <span className="text-[10px] font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded-md">
                          {st.bestFor[0] || 'Story'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{st.synopsis}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Answer Blueprints */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900">Ready Answer Blueprints</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveSection('blueprints')}
                  className="text-xs font-bold text-blue-700 hover:text-blue-900 cursor-pointer"
                >
                  View all ({blueprints.length})
                </button>
              </div>

              {blueprints.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No answer blueprints created yet.</p>
              ) : (
                <div className="space-y-2">
                  {blueprints.slice(0, 3).map(bp => (
                    <div
                      key={bp.id}
                      onClick={() => setActiveSection('blueprints')}
                      className="p-3 rounded-xl border border-slate-200/70 hover:bg-blue-50/30 transition-colors cursor-pointer space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{bp.title}</span>
                        <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md">
                          {bp.framework}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 italic">"{bp.questionText}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* EVIDENCE SECTION */}
      {activeSection === 'evidence' && (
        <EvidenceSection
          evidenceList={evidenceList}
          onAddEvidence={() => {
            setEditingEvidence(null);
            setIsEvidenceModalOpen(true);
          }}
          onEditEvidence={item => {
            setEditingEvidence(item);
            setIsEvidenceModalOpen(true);
          }}
          onDeleteEvidence={handleDeleteEvidence}
          onPromoteToStory={handlePromoteEvidenceToStory}
          onOpenQuestionDetail={onOpenQuestionDetail}
        />
      )}

      {/* STORIES SECTION */}
      {activeSection === 'stories' && (
        <StoryBankSection
          stories={stories}
          blueprints={blueprints}
          onAddStory={() => {
            setEditingStory(null);
            setIsStoryModalOpen(true);
          }}
          onEditStory={story => {
            setEditingStory(story);
            setIsStoryModalOpen(true);
          }}
          onDeleteStory={handleDeleteStory}
          onCreateBlueprintFromStory={handleCreateBlueprintFromStory}
          onOpenBlueprint={bpId => {
            setActiveSection('blueprints');
          }}
          onToggleQuestionLink={handleToggleStoryQuestionLink}
          onOpenQuestionDetail={onOpenQuestionDetail}
        />
      )}

      {/* METRICS & PROOF SECTION */}
      {activeSection === 'metrics' && (
        <MetricsLedgerSection
          metrics={metrics}
          evidenceList={evidenceList}
          onAddMetric={() => {
            setEditingMetric(null);
            setIsMetricModalOpen(true);
          }}
          onEditMetric={m => {
            setEditingMetric(m);
            setIsMetricModalOpen(true);
          }}
          onDeleteMetric={handleDeleteMetric}
        />
      )}

      {/* ANSWER BLUEPRINTS SECTION */}
      {activeSection === 'blueprints' && (
        <AnswerBlueprintsSection
          blueprints={blueprints}
          stories={stories}
          onAddBlueprint={() => {
            setEditingBlueprint(null);
            setPreselectedStoryForBlueprint(null);
            setIsBlueprintModalOpen(true);
          }}
          onEditBlueprint={bp => {
            setEditingBlueprint(bp);
            setIsBlueprintModalOpen(true);
          }}
          onDeleteBlueprint={handleDeleteBlueprint}
          onPracticeBlueprint={bp => {
            if (onStartPracticeWithBlueprint) {
              onStartPracticeWithBlueprint(bp);
            }
          }}
          onOpenQuestionDetail={onOpenQuestionDetail}
        />
      )}

      {/* SKILL EVIDENCE GRAPH SECTION */}
      {activeSection === 'skill_evidence' && (
        <SkillEvidenceGraphView />
      )}

      {/* HOW THIS WORKS INTERACTIVE MODAL */}
      {isHowItWorksOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full flex flex-col overflow-hidden animate-in fade-in duration-150">
            
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  ⓘ
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  How Personal Knowledge Works
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs sm:text-sm">
              <p className="text-slate-600 leading-relaxed font-normal">
                Career OS reframes your experience into four connected layers so you never freeze or ramble during high-stakes interviews:
              </p>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-1">
                  <span className="font-bold text-blue-900 block text-xs uppercase tracking-wider">
                    1. Evidence
                  </span>
                  <p className="text-slate-700 text-xs">
                    Raw accomplishments, projects, and work history.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
                  <span className="font-bold text-emerald-900 block text-xs uppercase tracking-wider">
                    2. Metrics & Proof
                  </span>
                  <p className="text-slate-700 text-xs">
                    Concrete numbers and validation for what you did.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-1">
                  <span className="font-bold text-purple-900 block text-xs uppercase tracking-wider">
                    3. Stories
                  </span>
                  <p className="text-slate-700 text-xs">
                    Experiences packaged for behavioral themes (Conflict, Ambiguity, Leadership).
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1">
                  <span className="font-bold text-amber-900 block text-xs uppercase tracking-wider">
                    4. Answer Blueprints
                  </span>
                  <p className="text-slate-700 text-xs">
                    Structured, question-specific response frameworks with rapid speaking cues.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 text-white space-y-1">
                  <span className="font-bold text-emerald-400 block text-xs uppercase tracking-wider">
                    5. Live Interview
                  </span>
                  <p className="text-slate-300 text-xs">
                    Career OS pulls from these layers in real time during practice sessions and live mock interviews.
                  </p>
                </div>
              </div>

              {/* Core Mantra Quote */}
              <div className="p-3.5 rounded-xl bg-slate-100 text-slate-800 text-xs italic font-medium">
                "I capture what I actually did. I attach proof. I turn strong experiences into stories. I connect those stories to interview questions. Career OS retrieves them during practice."
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-200 flex justify-end bg-slate-50">
              <button
                type="button"
                onClick={() => setIsHowItWorksOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs cursor-pointer hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modals */}
      <EvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => {
          setIsEvidenceModalOpen(false);
          setEditingEvidence(null);
        }}
        onSave={handleSaveEvidence}
        initialItem={editingEvidence}
      />

      <StoryModal
        isOpen={isStoryModalOpen}
        onClose={() => {
          setIsStoryModalOpen(false);
          setEditingStory(null);
        }}
        onSave={handleSaveStory}
        initialStory={editingStory}
      />

      <BlueprintModal
        isOpen={isBlueprintModalOpen}
        onClose={() => {
          setIsBlueprintModalOpen(false);
          setEditingBlueprint(null);
          setPreselectedStoryForBlueprint(null);
        }}
        onSave={handleSaveBlueprint}
        stories={stories}
        initialBlueprint={editingBlueprint}
        preselectedStory={preselectedStoryForBlueprint}
      />

      <MetricModal
        isOpen={isMetricModalOpen}
        onClose={() => {
          setIsMetricModalOpen(false);
          setEditingMetric(null);
        }}
        onSave={handleSaveMetric}
        evidenceList={evidenceList}
        initialMetric={editingMetric}
      />

    </div>
  );
};
