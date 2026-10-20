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
import { YourPinsAssistantDrawer } from './components/workspace/YourPinsAssistantDrawer';
import { BusinessEnglishWorkspace } from './components/businessEnglish/BusinessEnglishWorkspace';
import { BuilderMatchWorkspace } from './components/builderMatch/BuilderMatchWorkspace';
import { PracticeActionType } from './components/practice/PracticeActionGroup';
import { StorageService } from './services/storageService';
import { UnifiedTaskService } from './services/unifiedTaskService';
import { CareerMissionService } from './services/careerMissionService';
import { ActiveMissionBanner } from './components/mission/ActiveMissionBanner';
import { MissionControlModal } from './components/mission/MissionControlModal';
import { CreateMissionModal } from './components/mission/CreateMissionModal';
import { GetExpertFeedbackModal } from './components/feedback/GetExpertFeedbackModal';
import { FeedbackWorkspaceModal } from './components/feedback/FeedbackWorkspaceModal';
import { ExpertNetworkDirectoryModal } from './components/feedback/ExpertNetworkDirectoryModal';
import { ExpertFeedbackService } from './services/expertFeedbackService';
import { FeedbackContext, ExpertProfile } from './types/expertFeedback';
import { CareerMission, GrowthLoopStep } from './types';
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
  const [pinsCount, setPinsCount] = useState(() => UnifiedTaskService.getAllPinnedItems(wishlist).length);

  // Career Mission & Growth Loop State
  const [activeMission, setActiveMission] = useState<CareerMission | null>(() => CareerMissionService.getActiveMission());
  const [allMissions, setAllMissions] = useState<CareerMission[]>(() => CareerMissionService.getAllMissions());
  const [isMissionControlOpen, setIsMissionControlOpen] = useState(false);
  const [isCreateMissionOpen, setIsCreateMissionOpen] = useState(false);
  const [missionInitialRole, setMissionInitialRole] = useState('');
  const [missionInitialDomain, setMissionInitialDomain] = useState('');

  // Expert Feedback & Expert Network State
  const [isGetFeedbackOpen, setIsGetFeedbackOpen] = useState(false);
  const [isFeedbackWorkspaceOpen, setIsFeedbackWorkspaceOpen] = useState(false);
  const [isExpertNetworkOpen, setIsExpertNetworkOpen] = useState(false);
  const [feedbackContext, setFeedbackContext] = useState<Partial<FeedbackContext> | undefined>();
  const [feedbackTargetExpertId, setFeedbackTargetExpertId] = useState<string | undefined>();
  const [activeFeedbackRequestId, setActiveFeedbackRequestId] = useState<string | null>(null);

  useEffect(() => {
    const handlePinsChange = () => {
      setPinsCount(UnifiedTaskService.getAllPinnedItems(wishlist).length);
    };
    const handleMissionChange = () => {
      setActiveMission(CareerMissionService.getActiveMission());
      setAllMissions(CareerMissionService.getAllMissions());
    };
    window.addEventListener('career_pins_updated', handlePinsChange);
    window.addEventListener('career_tasks_updated', handlePinsChange);
    window.addEventListener('career_mission_updated', handleMissionChange);
    return () => {
      window.removeEventListener('career_pins_updated', handlePinsChange);
      window.removeEventListener('career_tasks_updated', handlePinsChange);
      window.removeEventListener('career_mission_updated', handleMissionChange);
    };
  }, [wishlist]);

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
    const handleNavTab = (e: Event) => {
      const custom = e as CustomEvent;
      if (custom.detail) {
        setActiveTab(custom.detail as ActiveTab);
      }
    };
    const handleOpenParticipation = (e: Event) => {
      const custom = e as CustomEvent<{ itemId: string }>;
      if (custom.detail?.itemId) {
        setSelectedApplicationId(custom.detail.itemId);
        setActiveTab('tracker');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('career_navigate_tab', handleNavTab);
    window.addEventListener('open_participation_item', handleOpenParticipation);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('career_navigate_tab', handleNavTab);
      window.removeEventListener('open_participation_item', handleOpenParticipation);
    };
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
      level: profile.experienceLevel || 'Senior',
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
      level: profile.experienceLevel || 'Senior',
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

  // Career Mission & Growth Loop Handlers
  const handleExecuteMissionStep = (step: GrowthLoopStep) => {
    setIsPlatformAdminOpen(false);
    if (step.targetTab) {
      setActiveTab(step.targetTab);
    }
    if (step.actionType === 'practice_drill' || step.actionType === 'live_simulation') {
      setActiveTab('practice');
      handleSelectPracticeAction(step.actionType === 'live_simulation' ? 'live' : 'mock');
    } else if (step.actionType === 'builder_challenge') {
      setActiveTab('builder_match');
    } else if (step.actionType === 'feedback_review' || step.stage === 'feedback') {
      handleOpenGetFeedback({
        careerGoal: activeMission?.title || 'Become a Senior Product Manager',
        targetRole: activeMission?.targetRoleTitle || profile.targetRole || 'Senior Product Manager',
        relevantCapability: activeMission?.capabilityGaps[0]?.capability || 'Product Strategy',
        workSubmittedTitle: `${activeMission?.title || 'Role Target'}: ${step.title}`,
        workSubmittedContent: `Practice Drill Output for ${activeMission?.targetRoleTitle || 'Senior Role'}:\n\nProposed strategic solution addressing activation drop and governance requirements with measurable target outcomes.`,
        sourceType: 'mission',
        sourceId: step.id,
        readinessScore: activeMission?.currentReadiness || 76,
        knownSkillGaps: activeMission?.capabilityGaps.map(g => g.capability) || ['Product Strategy']
      });
    } else if (step.actionType === 'knowledge_read') {
      setActiveTab('knowledge');
    } else if (step.actionType === 'opportunity_apply') {
      setActiveTab('discover');
    } else if (step.actionType === 'evidence_document') {
      setActiveTab('profile');
    }
  };

  const handleCompleteMissionStep = (stepId: string) => {
    if (!activeMission) return;
    const updated = CareerMissionService.completeStep(activeMission.id, stepId);
    if (updated) {
      setActiveMission(updated);
    }
  };

  const handleSkipMissionStep = (stepId: string) => {
    if (!activeMission) return;
    const updated = CareerMissionService.skipStep(activeMission.id, stepId);
    if (updated) {
      setActiveMission(updated);
    }
  };

  const handleStartMissionForRole = (roleTitle: string, domain?: string) => {
    setMissionInitialRole(roleTitle);
    setMissionInitialDomain(domain || '');
    setIsCreateMissionOpen(true);
  };

  // Expert Feedback Handlers
  const handleOpenGetFeedback = (ctx?: Partial<FeedbackContext>, expertId?: string) => {
    const defaultContext: Partial<FeedbackContext> = {
      careerGoal: activeMission?.title || 'Become a Senior Product Manager',
      targetRole: activeMission?.targetRoleTitle || profile.targetRole || 'Senior Product Manager',
      roleBlueprintId: 'role-senior-pm',
      relevantCapability: activeMission?.capabilityGaps[0]?.capability || 'Product Strategy',
      workSubmittedTitle: 'Product Strategy & Trial Activation Case',
      workSubmittedContent: `We observed that trial-to-active workspace completion dropped from 31% to 19% after releasing multi-workspace permissions.\n\nMy proposed intervention:\n1. Progressive Permission Staging: teams explore features in a sandbox without SOC2 IT admin blockers.\n2. Automated 2-minute compliance audit export for IT procurement officers.\n3. Defined checkpoints: Day-3 collaborative invite rate, Day-7 workspace completion, Day-14 contract signed.`,
      sourceType: 'practice',
      readinessScore: activeMission?.currentReadiness || 76,
      knownSkillGaps: activeMission?.capabilityGaps.map(g => g.capability) || [
        'AI Model Evaluation & System Quality Benchmarking',
        'Executive Strategic Trade-offs & Scope Elimination'
      ]
    };
    setFeedbackContext({ ...defaultContext, ...ctx });
    setFeedbackTargetExpertId(expertId);
    setIsGetFeedbackOpen(true);
  };

  const handleOpenFeedbackWorkspace = (reqId?: string) => {
    if (reqId) {
      setActiveFeedbackRequestId(reqId);
    } else {
      const all = ExpertFeedbackService.getAllRequests();
      setActiveFeedbackRequestId(all[0]?.id || null);
    }
    setIsFeedbackWorkspaceOpen(true);
  };

  const handleOpenExpertNetwork = () => {
    setIsExpertNetworkOpen(true);
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
        pinsCount={pinsCount}
        onOpenMissionControl={() => setIsMissionControlOpen(true)}
        activeMissionTitle={activeMission?.title}
        activeMissionReadiness={activeMission?.currentReadiness}
        onOpenFeedbackWorkspace={() => handleOpenFeedbackWorkspace()}
        onOpenExpertNetwork={handleOpenExpertNetwork}
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
              
              {/* 0. ACTIVE CAREER MISSION & GROWTH LOOP BANNER */}
              {activeMission && (
                <div className="mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                  <ActiveMissionBanner
                    mission={activeMission}
                    onOpenMissionControl={() => setIsMissionControlOpen(true)}
                    onExecuteStep={handleExecuteMissionStep}
                    onCompleteStep={handleCompleteMissionStep}
                  />
                </div>
              )}

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
                  onOpenMissionControl={() => setIsMissionControlOpen(true)}
                  onOpenCreateMission={() => {
                    setMissionInitialRole('');
                    setMissionInitialDomain('');
                    setIsCreateMissionOpen(true);
                  }}
                  onGetExpertFeedback={handleOpenGetFeedback}
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
                    onStartMission={handleStartMissionForRole}
                    onOpenApplication={(appId) => {
                      setSelectedApplicationId(appId);
                      setActiveTab('tracker');
                    }}
                  />
                </div>
              )}

              {/* 2.5 BUILDER MATCH (Innovation & Collaborative Network) */}
              {activeTab === 'builder_match' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <BuilderMatchWorkspace
                    onNavigateToKnowledge={(query) => {
                      setActiveTab('knowledge');
                    }}
                    onNavigateToDiscover={() => {
                      setActiveTab('discover');
                    }}
                    onRequestFeedback={(buildData) => handleOpenGetFeedback({
                      workSubmittedTitle: buildData.title,
                      workSubmittedContent: buildData.content,
                      relevantCapability: buildData.capability,
                      sourceType: 'build'
                    })}
                  />
                </div>
              )}

              {/* 3. KNOWLEDGE SYSTEM (Role Intelligence + Evidence Intelligence + Preferred Role Mapping + Global Knowledge Library) */}
              {(activeTab === 'knowledge' || activeTab === 'library' || activeTab === 'role_intelligence' || activeTab === 'evidence_intelligence') && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  <KnowledgeSystemWorkspace
                    initialDestination={
                      activeTab === 'role_intelligence' 
                        ? 'role_intelligence' 
                        : activeTab === 'evidence_intelligence'
                        ? 'evidence_intelligence'
                        : activeTab === 'library' 
                        ? 'global_knowledge_library' 
                        : undefined
                    }
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
                    onNavigateToOpportunities={() => setActiveTab('discover')}
                    onNavigateToParticipation={() => setActiveTab('tracker')}
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
                      onGetFeedback={(sessionData) => handleOpenGetFeedback({
                        workSubmittedTitle: sessionData.title,
                        workSubmittedContent: sessionData.content,
                        relevantCapability: sessionData.capability,
                        readinessScore: sessionData.score,
                        sourceType: 'practice'
                      })}
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

      {/* Slide-Over Drawer: Your Pins & Assistant (One Unified Header & Dedicated Layout) */}
      <YourPinsAssistantDrawer
        isOpen={isPinsDrawerOpen}
        onClose={() => setIsPinsDrawerOpen(false)}
        profile={profile}
        savedJobs={wishlist}
        onOpenApplication={(appId) => {
          setSelectedApplicationId(appId);
          setActiveTab('tracker');
          setIsPinsDrawerOpen(false);
        }}
        onNavigateToJob={() => {
          setActiveTab('discover');
          setIsPinsDrawerOpen(false);
        }}
        onNavigateToKnowledge={() => {
          setActiveTab('knowledge');
          setIsPinsDrawerOpen(false);
        }}
      />

      {/* Global Quick Command Palette (Cmd+K) */}
      <QuickCommandModal
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={(tab) => {
          setActiveTab(tab);
          setIsCommandOpen(false);
        }}
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

      {/* Career Mission Control Modal */}
      {activeMission && (
        <MissionControlModal
          isOpen={isMissionControlOpen}
          onClose={() => setIsMissionControlOpen(false)}
          mission={activeMission}
          allMissions={allMissions}
          onSelectMission={(missionId) => {
            CareerMissionService.setActiveMission(missionId);
            setActiveMission(CareerMissionService.getActiveMission());
          }}
          onOpenCreateMission={() => {
            setIsMissionControlOpen(false);
            setMissionInitialRole('');
            setMissionInitialDomain('');
            setIsCreateMissionOpen(true);
          }}
          onExecuteStep={handleExecuteMissionStep}
          onCompleteStep={handleCompleteMissionStep}
          onSkipStep={handleSkipMissionStep}
          onGetFeedback={handleOpenGetFeedback}
        />
      )}

      {/* Create Career Mission Modal */}
      <CreateMissionModal
        isOpen={isCreateMissionOpen}
        onClose={() => setIsCreateMissionOpen(false)}
        initialTargetRole={missionInitialRole}
        initialTargetDomain={missionInitialDomain}
        onMissionCreated={(missionId) => {
          CareerMissionService.setActiveMission(missionId);
          setActiveMission(CareerMissionService.getActiveMission());
          setAllMissions(CareerMissionService.getAllMissions());
          setIsMissionControlOpen(true);
        }}
      />

      {/* Get Expert Feedback Flow Modal */}
      <GetExpertFeedbackModal
        isOpen={isGetFeedbackOpen}
        onClose={() => setIsGetFeedbackOpen(false)}
        initialContext={feedbackContext}
        initialExpertId={feedbackTargetExpertId}
        onFeedbackRequested={(requestId) => {
          handleOpenFeedbackWorkspace(requestId);
        }}
      />

      {/* Feedback Workspace Modal */}
      <FeedbackWorkspaceModal
        isOpen={isFeedbackWorkspaceOpen}
        onClose={() => setIsFeedbackWorkspaceOpen(false)}
        requestId={activeFeedbackRequestId}
        onNavigateToBuilderMatch={() => {
          setIsFeedbackWorkspaceOpen(false);
          setActiveTab('builder_match');
        }}
        onNavigateToKnowledge={() => {
          setIsFeedbackWorkspaceOpen(false);
          setActiveTab('knowledge');
        }}
        onAddToCareerEvidence={(evidenceData) => {
          if (activeMission) {
            CareerMissionService.linkEvidence(activeMission.id, `ev-${Date.now()}`);
            setActiveMission(CareerMissionService.getActiveMission());
          }
        }}
      />

      {/* Expert Network Directory Modal */}
      <ExpertNetworkDirectoryModal
        isOpen={isExpertNetworkOpen}
        onClose={() => setIsExpertNetworkOpen(false)}
        onRequestFeedbackForExpert={(expert) => {
          handleOpenGetFeedback(undefined, expert.id);
        }}
      />

      {/* Footer */}
      <Footer onNavigate={(tab) => setActiveTab(tab)} />
    </div>
  );
}
