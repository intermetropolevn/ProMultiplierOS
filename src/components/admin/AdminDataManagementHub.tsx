import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Layers, 
  Play, 
  Plus, 
  FileText, 
  GitBranch, 
  Building2, 
  Scale, 
  HelpCircle, 
  Briefcase, 
  BookOpen,
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  UserCheck, 
  Users, 
  Lock,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  Award,
  TrendingUp,
  Languages
} from 'lucide-react';
import { 
  DataManagementTab, 
  Source, 
  CrawlJob, 
  ExtractedResource, 
  AuditLog, 
  AdminCrawlerStats, 
  AdminUser, 
  CrawlMode 
} from '../../features/admin/types';
import { AdminCrawlerApi } from '../../features/admin/services/adminCrawlerApi';
import { crawlerStore } from '../../features/admin/services/crawlerEngine';
import { SourcesRegistryView } from './SourcesRegistryView';
import { SourceDetailModal } from './SourceDetailModal';
import { CrawlJobsView } from './CrawlJobsView';
import { ImportQueueView } from './ImportQueueView';
import { AuditLogsView } from './AuditLogsView';
import { AdminVerificationModal } from './AdminVerificationModal';
import { ExistingDataBrowser } from './ExistingDataBrowser';
import { NonAdminAccessDenied } from './NonAdminAccessDenied';
import { BooksCatalogView } from './BooksCatalogView';
import { KnowledgeUnitsView } from './KnowledgeUnitsView';
import { ResearchPapersView } from './ResearchPapersView';
import { SynthesesView } from './SynthesesView';
import { KnowledgeGraphView } from './KnowledgeGraphView';
import { KnowledgePipelineRunnerView } from './KnowledgePipelineRunnerView';
import { AdminIndustryHub } from './industry/AdminIndustryHub';
import { MultilingualIntelligenceDashboard } from '../intelligence/MultilingualIntelligenceDashboard';
import { AdminBusinessEnglishView } from '../businessEnglish/AdminBusinessEnglishView';
import { Globe } from 'lucide-react';
import { knowledgeStore } from '../../features/knowledge/services/knowledgeStore';
import { knowledgePipeline } from '../../features/admin/services/knowledgeAcquisitionPipeline';
import { industryStore } from '../../features/industry/services/industryStore';

interface AdminDataManagementHubProps {
  initialTab?: DataManagementTab;
  onPublishToCareerOS?: (resource: ExtractedResource) => void;
  onGoHome?: () => void;
}

export const AdminDataManagementHub: React.FC<AdminDataManagementHubProps> = ({
  initialTab = 'sources',
  onPublishToCareerOS,
  onGoHome
}) => {
  const [activeTab, setActiveTab] = useState<DataManagementTab>(initialTab);
  const [currentUser, setCurrentUser] = useState<AdminUser>(AdminCrawlerApi.getCurrentUser());
  const [sources, setSources] = useState<Source[]>([]);
  const [jobs, setJobs] = useState<CrawlJob[]>([]);
  const [queue, setQueue] = useState<ExtractedResource[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<AdminCrawlerStats>(crawlerStore.getStats());

  // Modals state
  const [selectedSourceForDetail, setSelectedSourceForDetail] = useState<Source | null>(null);
  const [verificationConfig, setVerificationConfig] = useState<{
    isOpen: boolean;
    actionTitle: string;
    actionDescription: string;
    onVerified: () => void;
  }>({
    isOpen: false,
    actionTitle: '',
    actionDescription: '',
    onVerified: () => {}
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Load data
  const loadData = async () => {
    const s = await AdminCrawlerApi.getSources();
    const j = await AdminCrawlerApi.getJobs();
    const q = await AdminCrawlerApi.getQueue();
    const a = await AdminCrawlerApi.getAuditLogs();
    const st = await AdminCrawlerApi.getStats();
    setSources(s);
    setJobs(j);
    setQueue(q);
    setAuditLogs(a);
    setStats(st);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(() => {
      loadData();
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleRoleSwitch = (newRole: 'admin' | 'candidate') => {
    const user = AdminCrawlerApi.switchRole(newRole);
    setCurrentUser(user);
    showNotification(`Switched session to ${user.name} (${user.role.toUpperCase()})`, 'info');
  };

  // Trigger elevated verification
  const requireAdminVerification = (actionTitle: string, actionDescription: string, onVerified: () => void) => {
    setVerificationConfig({
      isOpen: true,
      actionTitle,
      actionDescription,
      onVerified: () => {
        setVerificationConfig(prev => ({ ...prev, isOpen: false }));
        onVerified();
      }
    });
  };

  // Crawl execution
  const handleRunCrawlPrompt = (source: Source, mode: CrawlMode = 'discover') => {
    if (!source.enabled) {
      showNotification(`"${source.name}" is currently disabled. Please enable it first.`, 'error');
      return;
    }

    requireAdminVerification(
      `Execute Crawl Job: ${source.name}`,
      `You are about to launch a ${mode} crawl against "${source.baseUrl}". This will query the target host, check robots.txt, and stage new resources into the Import Queue.`,
      async () => {
        try {
          const job = await AdminCrawlerApi.createAndRunJob(source.id, mode);
          showNotification(`Crawl job initiated for ${source.name}!`, 'success');
          setActiveTab('crawl_jobs');
          loadData();
        } catch (err: any) {
          showNotification(err.message || 'Failed to start crawl job', 'error');
        }
      }
    );
  };

  // Source updates
  const handleToggleEnableSource = async (source: Source) => {
    const updated: Source = {
      ...source,
      enabled: !source.enabled,
      status: !source.enabled ? 'active' : 'disabled'
    };
    await AdminCrawlerApi.saveSource(updated);
    showNotification(`Source "${source.name}" ${updated.enabled ? 'enabled' : 'disabled'}.`);
    loadData();
  };

  // Import Queue Actions
  const handleApproveQueueItem = async (id: string) => {
    await AdminCrawlerApi.reviewQueueItem(id, 'approve');
    showNotification('Resource approved in queue.');
    loadData();
  };

  const handleRejectQueueItem = async (id: string, reason: string) => {
    await AdminCrawlerApi.reviewQueueItem(id, 'reject', reason);
    showNotification('Resource marked as rejected.');
    loadData();
  };

  const handleMergeQueueItem = async (id: string, targetId: string) => {
    await AdminCrawlerApi.reviewQueueItem(id, 'merge', undefined, targetId);
    showNotification('Duplicate resource merged with canonical record.');
    loadData();
  };

  const handlePublishQueueItem = async (id: string) => {
    requireAdminVerification(
      'Publish Ingested Resource to Career OS',
      'This will transform the extracted case/curriculum and inject it into the active Career OS preparation catalog and mock interview simulator.',
      async () => {
        const item = await AdminCrawlerApi.publishQueueItem(id);
        if (item) {
          showNotification(`Published "${item.title}" into Career OS!`);
          if (onPublishToCareerOS) {
            onPublishToCareerOS(item);
          }
          loadData();
        }
      }
    );
  };

  // If candidate role, render access denied
  if (currentUser.role !== 'admin' && currentUser.role !== 'super_admin') {
    return (
      <NonAdminAccessDenied
        onSwitchToAdmin={() => handleRoleSwitch('admin')}
        onGoHome={onGoHome || (() => {})}
      />
    );
  }

  const knowledgeUnitsCount = knowledgeStore.getKnowledgeUnits().length;
  const booksCount = knowledgeStore.getBooks().length;
  const researchCount = knowledgeStore.getResearchPapers().length + knowledgeStore.getArticles().length;
  const synthesesCount = knowledgeStore.getSyntheses().length;
  const stagedCount = knowledgePipeline.getStagedItems().filter(i => i.status === 'staged').length;

  const subTabs = [
    // Business English Content & Learning Engine
    { id: 'business_english_content', label: 'Business English Content', icon: Globe, count: 16, isNew: true, badgeColor: 'bg-indigo-600 text-white' },

    // Multilingual Intelligence & Cross-Language Ontology
    { id: 'multilingual_ontology', label: 'Multilingual & Audit', icon: Languages, isNew: true, badgeColor: 'bg-emerald-600 text-white' },

    // Industry Intelligence & Case Studies Layer
    { id: 'industry_intelligence', label: 'Industry & Case Studies', icon: TrendingUp, count: industryStore.getDataPoints().length, isNew: true, badgeColor: 'bg-purple-600 text-white' },

    // Knowledge Acquisition & Research Ingestion System
    { id: 'knowledge_concepts', label: 'Concepts & Units', icon: Sparkles, count: knowledgeUnitsCount, isNew: true },
    { id: 'books_catalog', label: 'Books & Guides', icon: BookOpen, count: booksCount, isNew: true },
    { id: 'research_papers', label: 'Research & Articles', icon: FileText, count: researchCount, isNew: true },
    { id: 'syntheses', label: 'Syntheses', icon: Award, count: synthesesCount, isNew: true },
    { id: 'knowledge_graph', label: 'Knowledge Graph', icon: GitBranch, isNew: true },
    { id: 'pipeline_runner', label: 'Pipeline Runner', icon: Play, count: stagedCount, isNew: true, badgeColor: stagedCount > 0 ? 'bg-amber-500 text-white' : undefined },
    
    // Web Crawler & Data Ingestion
    { id: 'sources', label: 'Sources Registry', icon: Database, count: sources.length },
    { id: 'crawl_jobs', label: 'Crawl Jobs', icon: Activity, count: jobs.length, isPulsing: stats.activeJobs > 0 },
    { id: 'import_queue', label: 'Import Queue', icon: Scale, count: stats.resourcesAwaitingReview, badgeColor: stats.resourcesAwaitingReview > 0 ? 'bg-amber-500 text-white' : undefined },
    
    // Career OS Core Ontology
    { id: 'jobs_roles', label: 'Jobs / Roles', icon: Briefcase, count: 10 },
    { id: 'skills', label: 'Skills', icon: Layers, count: 15 },
    { id: 'domains', label: 'Domains', icon: Building2, count: 6 },
    { id: 'audit_logs', label: 'Audit Logs', icon: ShieldCheck, count: auditLogs.length },
  ];

  return (
    <div className="space-y-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2 animate-in slide-in-from-bottom-5 duration-200 ${
          notification.type === 'success' ? 'bg-slate-900 text-white border-slate-800' :
          notification.type === 'error' ? 'bg-red-600 text-white border-red-700' :
          'bg-blue-600 text-white border-blue-700'
        }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top Banner & Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <button onClick={onGoHome} className="hover:text-blue-600 transition-colors">Career OS</button>
            <span>/</span>
            <span className="text-slate-900">Admin</span>
            <span>/</span>
            <span className="text-blue-600 font-bold">Data Management & Ingestion</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Data Management & Source Crawler</span>
            <span className="px-2.5 py-0.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg uppercase tracking-wider">
              Admin Only
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Configure verified authoritative knowledge sources, orchestrate rate-limited crawler jobs with SSRF shields, and curate the Import Queue into Career OS.
          </p>
        </div>

        {/* User Session & Role Toggle */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-slate-200/80 shadow-xs shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            LA
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">{currentUser.name}</span>
              <span className="px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[10px] font-extrabold uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">{currentUser.email}</p>
          </div>

          <div className="pl-2 border-l border-slate-200">
            <button
              onClick={() => handleRoleSwitch(currentUser.role === 'admin' ? 'candidate' : 'admin')}
              className="px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Test non-admin forbidden access behavior"
            >
              Simulate Candidate Role
            </button>
          </div>
        </div>
      </div>

      {/* Section 29: Admin Crawler Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Active Jobs</span>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-slate-900">{stats.activeJobs}</span>
            {stats.activeJobs > 0 && (
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            )}
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sources</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-black text-slate-900">{stats.totalSources}</span>
            <span className="text-[11px] text-emerald-600 font-semibold">({stats.enabledSources} active)</span>
          </div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Discovered</span>
          <div className="text-xl font-black text-slate-900 mt-1">{stats.resourcesDiscovered}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Review Queue</span>
          <div className="text-xl font-black text-amber-600 mt-1">{stats.resourcesAwaitingReview}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Published</span>
          <div className="text-xl font-black text-emerald-600 mt-1">{stats.importedResources}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Duplicates</span>
          <div className="text-xl font-black text-slate-700 mt-1">{stats.duplicateCandidates}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Failed Jobs</span>
          <div className="text-xl font-black text-red-600 mt-1">{stats.failedJobs}</div>
        </div>

        <div className="p-3 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Last Crawl</span>
          <div className="text-xs font-bold text-slate-700 mt-2 truncate">
            {stats.lastSuccessfulCrawl ? new Date(stats.lastSuccessfulCrawl).toLocaleTimeString() : 'Ready'}
          </div>
        </div>
      </div>

      {/* Main Subnavigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/80">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as DataManagementTab)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.isNew && (
                <span className="px-1 py-0.2 text-[9px] font-extrabold uppercase rounded bg-blue-500/20 text-blue-300">
                  NEW
                </span>
              )}
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                tab.badgeColor ? tab.badgeColor :
                isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}

      {/* BUSINESS ENGLISH CONTENT & TAXONOMY */}
      {activeTab === 'business_english_content' && (
        <AdminBusinessEnglishView />
      )}

      {/* MULTILINGUAL INTELLIGENCE & ONTOLOGY AUDIT */}
      {activeTab === 'multilingual_ontology' && (
        <MultilingualIntelligenceDashboard />
      )}

      {/* INDUSTRY INTELLIGENCE & CASE STUDIES LAYER */}
      {activeTab === 'industry_intelligence' && (
        <AdminIndustryHub />
      )}

      {/* KNOWLEDGE CONCEPTS */}
      {activeTab === 'knowledge_concepts' && (
        <KnowledgeUnitsView
          onOpenGraph={(unitId) => {
            setActiveTab('knowledge_graph');
          }}
        />
      )}

      {/* BOOKS & GUIDES CATALOG */}
      {activeTab === 'books_catalog' && (
        <BooksCatalogView
          onLaunchPipeline={(book) => {
            setActiveTab('pipeline_runner');
          }}
        />
      )}

      {/* RESEARCH PAPERS & ARTICLES */}
      {activeTab === 'research_papers' && (
        <ResearchPapersView />
      )}

      {/* CROSS-SOURCE SYNTHESES */}
      {activeTab === 'syntheses' && (
        <SynthesesView />
      )}

      {/* INTERACTIVE KNOWLEDGE GRAPH */}
      {activeTab === 'knowledge_graph' && (
        <KnowledgeGraphView />
      )}

      {/* PIPELINE RUNNER & REVIEW QUEUE */}
      {activeTab === 'pipeline_runner' && (
        <KnowledgePipelineRunnerView
          onUnitPublished={() => {
            loadData();
            showNotification('Knowledge unit verified and published to Career OS Knowledge Graph!', 'success');
          }}
        />
      )}

      {/* Existing Sections */}
      {['jobs_roles', 'skills', 'domains', 'knowledge', 'workflows', 'resources'].includes(activeTab) && (
        <ExistingDataBrowser section={activeTab as any} />
      )}

      {/* SOURCES (Source Registry) */}
      {activeTab === 'sources' && (
        <SourcesRegistryView
          sources={sources}
          onSelectSource={(s) => setSelectedSourceForDetail(s)}
          onRunCrawlPrompt={(s) => handleRunCrawlPrompt(s, 'discover')}
          onToggleEnable={handleToggleEnableSource}
          onAddNewSource={() => {
            showNotification('To register a new source, specify an authorized URL with SSRF whitelist validation.', 'info');
          }}
        />
      )}

      {/* CRAWL JOBS */}
      {activeTab === 'crawl_jobs' && (
        <CrawlJobsView
          jobs={jobs}
          sources={sources}
          onTriggerJob={(sourceId, mode) => {
            const src = sources.find(s => s.id === sourceId);
            if (src) handleRunCrawlPrompt(src, mode);
          }}
          onPauseJob={async (jobId) => {
            await AdminCrawlerApi.pauseJob(jobId);
            loadData();
          }}
          onCancelJob={async (jobId) => {
            await AdminCrawlerApi.cancelJob(jobId);
            loadData();
          }}
        />
      )}

      {/* IMPORT QUEUE */}
      {activeTab === 'import_queue' && (
        <ImportQueueView
          queue={queue}
          onApprove={handleApproveQueueItem}
          onReject={handleRejectQueueItem}
          onMerge={handleMergeQueueItem}
          onPublish={handlePublishQueueItem}
        />
      )}

      {/* AUDIT LOGS */}
      {activeTab === 'audit_logs' && (
        <AuditLogsView logs={auditLogs} />
      )}

      {/* Source Detail Modal */}
      <SourceDetailModal
        source={selectedSourceForDetail}
        isOpen={Boolean(selectedSourceForDetail)}
        onClose={() => setSelectedSourceForDetail(null)}
        onRunCrawl={(s) => {
          setSelectedSourceForDetail(null);
          handleRunCrawlPrompt(s, 'discover');
        }}
        onSourceUpdated={(updated) => {
          setSelectedSourceForDetail(updated);
          loadData();
        }}
      />

      {/* Admin Password Re-Verification Modal */}
      <AdminVerificationModal
        isOpen={verificationConfig.isOpen}
        actionTitle={verificationConfig.actionTitle}
        actionDescription={verificationConfig.actionDescription}
        onClose={() => setVerificationConfig(prev => ({ ...prev, isOpen: false }))}
        onVerified={verificationConfig.onVerified}
      />

    </div>
  );
};
