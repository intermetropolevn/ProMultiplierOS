import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DiscoverHub } from './components/discover/DiscoverHub';
import { PrepareHub, PrepareSubTab } from './components/prepare/PrepareHub';
import { PracticeSetup } from './components/practice/PracticeSetup';
import { MockInterviewRoom } from './components/practice/MockInterviewRoom';
import { LiveInterviewWorkspace } from './components/practice/live/LiveInterviewWorkspace';
import { MockInterviewWorkspace } from './components/practice/mock/MockInterviewWorkspace';
import { InterviewReportCard } from './components/practice/InterviewReportCard';
import { TrackerDashboard } from './components/tracker/TrackerDashboard';
import { QuickCommandModal } from './components/common/QuickCommandModal';
import { ProfileKnowledgeHub } from './components/knowledge/ProfileKnowledgeHub';
import { MyProfileDashboard } from './components/profile/MyProfileDashboard';
import { PlatformAdminWorkspace, PlatformAdminTab } from './components/admin/PlatformAdminWorkspace';
import { PlatformHelpModal } from './components/common/PlatformHelpModal';
import { PersistentPins } from './components/workspace/PersistentPins';
import { AIChatLauncher } from './components/workspace/AIChatLauncher';
import { BusinessEnglishWorkspace } from './components/businessEnglish/BusinessEnglishWorkspace';
import { PracticeActionType } from './components/practice/PracticeActionGroup';
import { StorageService } from './services/storageService';
import { 
  JobListing, 
  RoleBlueprint, 
  IndustryDomainGuide, 
  InterviewConfig, 
  MockInterviewSession, 
  UserCareerProfile, 
  InterviewQuestion, 
  JobApplicationStatus 
} from './types';
import { QUESTIONS_DATA } from './data/questionsData';
import { StructuredAnswerBlueprint } from './features/knowledge/types';
import { CASES_DATA } from './data/casesData';
import { LibraryHub } from './components/library/LibraryHub';
import { KnowledgeSystemWorkspace } from './components/knowledge/KnowledgeSystemWorkspace';
import { CapabilityActivationModal } from './components/intelligence/activation/CapabilityActivationModal';
import { PanelLeftClose, PanelLeft, Sparkles, Pin, X } from 'lucide-react';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('profile');
  const [prepareSubTab, setPrepareSubTab] = useState<PrepareSubTab>('roles');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPlatformAdminOpen, setIsPlatformAdminOpen] = useState(false);
  const [platformAdminInitialTab, setPlatformAdminInitialTab] = useState<PlatformAdminTab>('admin');
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  // Workspace Sidebar State (Your Pins + AI Chat Drawer)
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isPinsDrawerOpen, setIsPinsDrawerOpen] = useState(false);

  // Persistence State
  const [wishlist, setWishlist] = useState(StorageService.getWishlist());
  const [sessions, setSessions] = useState(StorageService.getSessions());
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState(StorageService.getBookmarkedQuestions());
  const [profile, setProfile] = useState(StorageService.getUserProfile());

  // Practice State
  const [practiceMode, setPracticeMode] = useState<'setup' | 'simulating' | 'report'>('setup');
  const [practiceConfig, setPracticeConfig] = useState<InterviewConfig | null>(null);
  const [practiceQuestions, setPracticeQuestions] = useState<InterviewQuestion[]>([]);
  const [currentSessionReport, setCurrentSessionReport] = useState<MockInterviewSession | null>(null);
  const [activePracticeAction, setActivePracticeAction] = useState<PracticeActionType | null>(null);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Job Wishlist Actions
  const handleToggleSaveJob = (job: JobListing) => {
    const isSaved = wishlist.some(item => item.jobId === job.id);
    if (isSaved) {
      const updated = StorageService.removeJobFromWishlist(job.id);
      setWishlist(updated);
    } else {
      const updated = StorageService.saveJobToWishlist(job);
      setWishlist(updated);
    }
  };

  const isJobSaved = (jobId: string) => {
    return wishlist.some(item => item.jobId === jobId);
  };

  const handleUpdateJobStatus = (id: string, status: JobApplicationStatus) => {
    const updated = StorageService.updateJobStatus(id, status);
    setWishlist(updated);
  };

  const handleUpdateJobNotes = (id: string, notes: string) => {
    const updated = StorageService.updateJobNotes(id, notes);
    setWishlist(updated);
  };

  const handleRemoveSavedJob = (id: string) => {
    const updated = StorageService.removeJobFromWishlist(id);
    setWishlist(updated);
  };

  // Question Bookmark Action
  const handleToggleBookmarkQuestion = (questionId: string) => {
    const updated = StorageService.toggleBookmarkQuestion(questionId);
    setBookmarkedQuestionIds(updated);
  };

  // Launch Practice Simulator from any source
  const handleStartPracticeSession = (config: InterviewConfig) => {
    setPracticeConfig(config);

    // Filter relevant questions following selected: Role, Sector, Domain, Level, Question Set
    const scoredQuestions = QUESTIONS_DATA.map(q => {
      let score = 0;
      if (q.roleCategory === config.roleCategory) score += 30;
      if (q.domain === config.domain) score += 25;
      if (q.level === config.level) score += 15;
      if (q.type === config.interviewType) score += 15;

      // Question Set prioritization
      if (config.questionSet) {
        const qText = `${q.question} ${q.context || ''} ${q.type}`.toLowerCase();
        if (config.questionSet === 'conflict_leadership' && (qText.includes('conflict') || qText.includes('disagree') || qText.includes('stakeholder') || q.type === 'Behavioral (STAR)')) {
          score += 40;
        } else if (config.questionSet === 'architecture_scale' && (qText.includes('architect') || qText.includes('idempotency') || qText.includes('distributed') || q.type === 'Technical Architecture' || q.type === 'System Design')) {
          score += 40;
        } else if (config.questionSet === 'product_strategy' && (qText.includes('priorit') || qText.includes('churn') || q.type === 'Product Sense & Strategy')) {
          score += 40;
        }
      }

      return { question: q, score };
    });

    scoredQuestions.sort((a, b) => b.score - a.score);
    const selected = scoredQuestions.slice(0, config.questionCount).map(sq => sq.question);

    // Ensure fallback question
    if (selected.length === 0) {
      selected.push(QUESTIONS_DATA[0]);
    }

    setPracticeQuestions(selected);
    setPracticeMode('simulating');
    setIsPlatformAdminOpen(false);
    setActiveTab('practice');
  };

  const handleFinishMockSession = (session: MockInterviewSession) => {
    const updated = StorageService.saveSession(session);
    setSessions(updated);
    setCurrentSessionReport(session);
    setPracticeMode('report');
  };

  const handleReviewSession = (session: MockInterviewSession) => {
    setCurrentSessionReport(session);
    setPracticeMode('report');
    setActiveTab('practice');
  };

  // Practice Action Group Launcher
  const handleSelectPracticeAction = (actionType: PracticeActionType) => {
    setActivePracticeAction(actionType);

    if (actionType === 'live') {
      const liveConfig: InterviewConfig = {
        roleCategory: profile.targetRole,
        domain: profile.targetDomain,
        level: profile.targetLevel,
        interviewType: 'Technical Architecture',
        questionCount: 3,
        timePerQuestionSeconds: 180,
        enableVoiceReading: false,
        interviewMode: 'live_intelligence',
        questionSet: 'architecture_scale'
      };
      handleStartPracticeSession(liveConfig);
    } else if (actionType === 'mock') {
      const mockConfig: InterviewConfig = {
        roleCategory: profile.targetRole,
        domain: profile.targetDomain,
        level: profile.targetLevel,
        interviewType: 'Behavioral (STAR)',
        questionCount: 3,
        timePerQuestionSeconds: 180,
        enableVoiceReading: false,
        interviewMode: 'mock',
        mockExperienceType: 'classic',
        questionSet: 'conflict_leadership'
      };
      handleStartPracticeSession(mockConfig);
    } else if (actionType === 'biz_english') {
      setActivePracticeAction('biz_english');
      setIsPlatformAdminOpen(false);
      setActiveTab('business_english');
      return;
    }
  };

  // Contextual Launchers from Roles / Domains / Questions
  const handleStartPracticeForRole = (role: RoleBlueprint) => {
    const config: InterviewConfig = {
      roleCategory: role.category,
      domain: profile.targetDomain,
      level: profile.targetLevel,
      interviewType: 'Technical Architecture',
      questionCount: 3,
      timePerQuestionSeconds: 180,
      enableVoiceReading: true,
      interviewMode: 'mock',
      mockExperienceType: 'realtime_ai',
      questionSet: 'architecture_scale'
    };
    handleStartPracticeSession(config);
  };

  const handleStartPracticeForDomain = (domainName: string) => {
    const config: InterviewConfig = {
      roleCategory: profile.targetRole,
      domain: domainName as any,
      level: profile.targetLevel,
      interviewType: 'Domain Deep-Dive',
      questionCount: 3,
      timePerQuestionSeconds: 180,
      enableVoiceReading: true,
      interviewMode: 'mock',
      mockExperienceType: 'realtime_ai'
    };
    handleStartPracticeSession(config);
  };

  const handleStartPracticeForJob = (job: JobListing) => {
    const config: InterviewConfig = {
      roleCategory: job.roleCategory,
      domain: job.domain,
      level: job.level,
      interviewType: 'Technical Architecture',
      questionCount: 3,
      timePerQuestionSeconds: 180,
      enableVoiceReading: true,
      interviewMode: 'mock',
      mockExperienceType: 'realtime_ai',
      questionSet: 'architecture_scale'
    };
    handleStartPracticeSession(config);
  };

  const handleStartPracticeSingleQuestion = (question: InterviewQuestion) => {
    const config: InterviewConfig = {
      roleCategory: question.roleCategory,
      domain: question.domain,
      level: question.level,
      interviewType: question.type,
      questionCount: 1,
      timePerQuestionSeconds: 180,
      enableVoiceReading: true,
      interviewMode: 'mock',
      mockExperienceType: 'realtime_ai'
    };
    setPracticeConfig(config);
    setPracticeQuestions([question]);
    setPracticeMode('simulating');
    setIsPlatformAdminOpen(false);
    setActiveTab('practice');
  };

  const handleStartLiveCasePractice = (scenarioTitle?: string) => {
    const targetRole = profile.targetRole || 'Software Engineering';
    const targetDomain = (profile.targetIndustryDomains && profile.targetIndustryDomains.length > 0)
      ? profile.targetIndustryDomains[0]
      : 'Enterprise SaaS';

    const config: InterviewConfig = {
      roleCategory: targetRole,
      domain: targetDomain,
      level: profile.currentLevel || 'Senior',
      interviewType: 'System Design',
      questionCount: 1,
      timePerQuestionSeconds: 300,
      enableVoiceReading: true,
      interviewMode: 'live_intelligence',
      mockExperienceType: 'realtime_ai',
      questionSet: 'architecture_scale'
    };
    setPracticeConfig(config);
    const caseQuestion: InterviewQuestion = {
      id: `case-spar-${Date.now()}`,
      question: scenarioTitle
        ? `Live Case Sparring: "${scenarioTitle}". Walk me through your incident triage, architectural trade-offs, and how you defend your resolution under executive scrutiny.`
        : 'Walk me through your incident triage, architectural trade-offs, and how you defend your resolution under executive scrutiny.',
      context: 'Real-world high-severity production incident scenario.',
      roleCategory: targetRole,
      domain: targetDomain,
      level: profile.currentLevel || 'Senior',
      type: 'System Design',
      rubricCriteria: [
        {
          criterion: 'Architectural Defense & Tradeoffs',
          weight: 40,
          whatStrongCandidatesSay: 'Evaluates failure modes, isolates invariants, and defends decisions under pressure.',
          redFlags: 'Overlooks concurrency or state corruption edge cases.'
        }
      ],
      keywordsToMention: ['Idempotency', 'Circuit Breaker', 'WAL', 'SLO'],
      exemplaryModelAnswer: 'Strong architectural synthesis addressing failure isolation and business continuity.'
    };
    setPracticeQuestions([caseQuestion]);
    setPracticeMode('simulating');
    setActiveTab('practice');
  };

  const handleStartPracticeWithBlueprint = (blueprint: StructuredAnswerBlueprint) => {
    const matched = QUESTIONS_DATA.find(q => q.id === blueprint.questionId) || QUESTIONS_DATA[0];
    handleStartPracticeSingleQuestion(matched);
  };

  const handleOpenQuestionFromKnowledge = (questionId: string) => {
    setActiveTab('profile');
    setPrepareSubTab('questions');
  };

  // Command palette selection dispatcher
  const handleCommandSelect = (item: any) => {
    setIsPlatformAdminOpen(false);
    if (item.type === 'job') {
      setActiveTab('discover');
    } else if (item.type === 'role') {
      setActiveTab('profile');
      setPrepareSubTab('roles');
    } else if (item.type === 'domain') {
      setActiveTab('profile');
      setPrepareSubTab('domains');
    } else if (item.type === 'workflow') {
      setActiveTab('profile');
      setPrepareSubTab('workflows');
    } else if (item.type === 'case') {
      setActiveTab('profile');
      setPrepareSubTab('cases');
    } else if (item.type === 'question') {
      setActiveTab('profile');
      setPrepareSubTab('questions');
    } else if (item.type === 'source') {
      setActiveTab('knowledge');
    }
  };

  // Determine if the persistent left column (Your Pins + AI Chat) should be visible:
  // Must NOT be shown during immersive live interview simulation to prioritize zero-distraction live dialogue!
  const isImmersiveExperience = activeTab === 'practice' && practiceMode === 'simulating';
  const showPersistentSidebar = isSidebarVisible && !isImmersiveExperience && !isPlatformAdminOpen;

  return (
    <div className="min-h-screen flex flex-col bg-[#fafbfc] text-slate-900 selection:bg-blue-500 selection:text-white font-sans antialiased">
      
      {/* Global Application Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setIsPlatformAdminOpen(false);
          setActiveTab(tab);
        }}
        savedJobsCount={wishlist.length}
        onOpenCommand={() => setIsCommandOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenPlatformAdmin={() => setIsPlatformAdminOpen(prev => !prev)}
        onSelectPracticeAction={handleSelectPracticeAction}
        activePracticeAction={activePracticeAction}
        isPlatformAdminOpen={isPlatformAdminOpen}
        onTogglePins={() => setIsPinsDrawerOpen(prev => !prev)}
        pinsCount={wishlist.length + 4}
      />

      {/* Main Workspace Layout Shell */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* LEVEL 2: PLATFORM ADMIN WORKSPACE */}
        {isPlatformAdminOpen ? (
          <PlatformAdminWorkspace
            initialTab={platformAdminInitialTab}
            onBackToCareerOS={() => setIsPlatformAdminOpen(false)}
          />
        ) : (
          /* LEVEL 1: USER CAREER OS WORKSPACE */
          <div className="w-full">
            
            {/* MAIN CONTENT WORKSPACE AREA */}
            <main className="w-full">
              
              {/* 1. MY PROFILE (MODE 1: Career OS Dashboard / Personal Workspace) */}
              {activeTab === 'profile' && (
                <MyProfileDashboard
                  profile={profile}
                  onUpdateProfile={(updates) => {
                    const updated = StorageService.saveUserProfile(updates);
                    setProfile(updated);
                  }}
                  savedJobs={wishlist}
                  bookmarkedQuestionIds={bookmarkedQuestionIds}
                  onToggleBookmarkQuestion={handleToggleBookmarkQuestion}
                  onStartLiveInterview={() => handleSelectPracticeAction('live')}
                  onStartMockPractice={() => handleSelectPracticeAction('mock')}
                  onStartPracticeQuestion={handleStartPracticeSingleQuestion}
                  onStartPracticeRole={handleStartPracticeForRole}
                  onStartPracticeDomain={handleStartPracticeForDomain}
                  onOpenApplicationWorkspace={(appId) => {
                    setSelectedApplicationId(appId);
                    setActiveTab('tracker');
                  }}
                  onNavigateToBusinessEnglish={() => {
                    setActiveTab('business_english');
                  }}
                />
              )}

              {/* 2. DISCOVER PILLAR (Job Opportunities) */}
              {activeTab === 'discover' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <DiscoverHub
                    onSelectJob={() => {}}
                    onToggleSaveJob={handleToggleSaveJob}
                    isJobSaved={isJobSaved}
                    onStartPracticeForJob={handleStartPracticeForJob}
                    onSelectRole={() => {}}
                    onStartPracticeForRole={handleStartPracticeForRole}
                  />
                </div>
              )}

              {/* 3. KNOWLEDGE SYSTEM (Preferred Role Mapping + Global Knowledge Library) */}
              {(activeTab === 'knowledge' || activeTab === 'library') && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <KnowledgeSystemWorkspace
                    profile={profile}
                    onUpdateProfile={(updates) => {
                      const updated = StorageService.saveUserProfile(updates);
                      setProfile(updated);
                    }}
                    bookmarkedQuestionIds={bookmarkedQuestionIds}
                    onToggleBookmarkQuestion={handleToggleBookmarkQuestion}
                    onStartPracticeRole={handleStartPracticeForRole}
                    onStartPracticeDomain={handleStartPracticeForDomain}
                    onStartPracticeQuestion={handleStartPracticeSingleQuestion}
                    onStartLivePractice={handleStartLiveCasePractice}
                    onNavigateToProfile={() => setActiveTab('profile')}
                  />
                </div>
              )}

              {/* 4. PRACTICE PILLAR */}
              {activeTab === 'practice' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {practiceMode === 'setup' && (
                    <PracticeSetup
                      initialConfig={practiceConfig || undefined}
                      onStartSession={handleStartPracticeSession}
                    />
                  )}

                  {practiceMode === 'simulating' && practiceQuestions.length > 0 && practiceConfig && (
                    practiceConfig.interviewMode === 'live_intelligence' ? (
                      <LiveInterviewWorkspace
                        config={practiceConfig}
                        onFinishSession={handleFinishMockSession}
                        onExit={() => setPracticeMode('setup')}
                      />
                    ) : (
                      <MockInterviewWorkspace
                        questions={practiceQuestions}
                        config={practiceConfig}
                        onFinishSession={handleFinishMockSession}
                        onExit={() => setPracticeMode('setup')}
                      />
                    )
                  )}

                  {practiceMode === 'report' && currentSessionReport && (
                    <InterviewReportCard
                      session={currentSessionReport}
                      onRetake={() => {
                        if (practiceConfig) {
                          handleStartPracticeSession(practiceConfig);
                        } else {
                          setPracticeMode('setup');
                        }
                      }}
                      onGoToTracker={() => setActiveTab('tracker')}
                      onGoToDiscover={() => setActiveTab('discover')}
                    />
                  )}
                </div>
              )}

              {/* 5. APPLICATION TRACKER */}
              {activeTab === 'tracker' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <TrackerDashboard
                    wishlist={wishlist}
                    onUpdateJobStatus={handleUpdateJobStatus}
                    onUpdateJobNotes={handleUpdateJobNotes}
                    onRemoveJob={handleRemoveSavedJob}
                    onStartPracticeForJob={handleStartPracticeForJob}
                    sessions={sessions}
                    onReviewSession={handleReviewSession}
                    bookmarkedQuestionIds={bookmarkedQuestionIds}
                    onPracticeQuestion={handleStartPracticeSingleQuestion}
                    profile={profile}
                    onUpdateProfile={(updates) => {
                      const updated = StorageService.saveUserProfile(updates);
                      setProfile(updated);
                    }}
                    initialSelectedApplicationId={selectedApplicationId}
                    onClearSelectedApplication={() => setSelectedApplicationId(null)}
                  />
                </div>
              )}

              {/* 6. BUSINESS ENGLISH & WORKPLACE COMMUNICATION WORKSPACE */}
              {activeTab === 'business_english' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <BusinessEnglishWorkspace
                    profile={profile}
                    onUpdateProfile={(updates) => {
                      const updated = StorageService.saveUserProfile(updates);
                      setProfile(updated);
                    }}
                  />
                </div>
              )}

            </main>
          </div>
        )}
      </div>

      {/* Slide-Over Drawer: Your Pins & AI Assistant */}
      {isPinsDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          <div 
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsPinsDrawerOpen(false)}
          />
          <aside className="relative w-full sm:w-[420px] bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col z-50 p-5 space-y-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
                  <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Your Pins &amp; Assistant</h3>
                  <p className="text-[11px] text-slate-500">Quick personal context, active notes &amp; AI copilot</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPinsDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                title="Close drawer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Persistent Pins in Sidebar mode */}
            <PersistentPins
              variant="sidebar"
              savedJobs={wishlist}
              onNavigateToJob={() => {
                setActiveTab('discover');
                setIsPinsDrawerOpen(false);
              }}
              onNavigateToKnowledge={() => {
                setActiveTab('knowledge');
                setIsPinsDrawerOpen(false);
              }}
              onStartPracticeTopic={() => {
                handleSelectPracticeAction('live');
                setIsPinsDrawerOpen(false);
              }}
            />

            {/* AI Chat Launcher in Drawer */}
            <AIChatLauncher
              profile={profile}
              savedJobs={wishlist}
              onOpenApplication={(appId) => {
                setSelectedApplicationId(appId);
                setActiveTab('tracker');
                setIsPinsDrawerOpen(false);
              }}
            />
          </aside>
        </div>
      )}

      {/* Floating Quick Launcher for Your Pins (when drawer is closed) */}
      {!isPinsDrawerOpen && !isImmersiveExperience && (
        <button
          type="button"
          onClick={() => setIsPinsDrawerOpen(true)}
          className="fixed left-4 bottom-5 z-30 flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg transition-all cursor-pointer text-xs font-bold active:scale-95 border border-slate-700"
          title="Open Your Pins & AI Assistant"
        >
          <Pin className="w-3.5 h-3.5 text-amber-400 fill-amber-400/30 rotate-45" />
          <span>Your Pins</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        </button>
      )}

      {/* Global Quick Command Palette (Cmd+K) */}
      <QuickCommandModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onSelectItem={handleCommandSelect}
      />

      {/* Help & Architecture Tour Modal */}
      <PlatformHelpModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />

      {/* Trigger Engine Modal (Direct Invocation) */}
      <CapabilityActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
      />

      {/* Footer */}
      <Footer onSelectRole={handleStartPracticeForRole} />
    </div>
  );
}
