import React, { useState, useRef, useEffect } from 'react';
import { 
  User, 
  Target, 
  Briefcase, 
  FileText, 
  BookOpen, 
  Activity, 
  Sparkles, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Mic2, 
  TrendingUp, 
  ShieldCheck, 
  ListTodo,
  Globe,
  FolderKanban,
  ArrowRight,
  Building2,
  ChevronDown,
  Check
} from 'lucide-react';
import { UserCareerProfile, SavedJobApplication, RoleBlueprint, InterviewQuestion } from '../../types';
import { ProfileHeader } from './ProfileHeader';
import { TargetSection } from './TargetSection';
import { ChecklistSection } from './ChecklistSection';
import { CompactSkillEvidenceGraph } from './CompactSkillEvidenceGraph';
import { CoreProcessVisualization, CareerProcessStage } from './CoreProcessVisualization';
import { BackgroundCapacityView } from './BackgroundCapacityView';
import { ProjectsStorybanksWorkspace } from './projects/ProjectsStorybanksWorkspace';
import { QuestionAnswerBlueprintsView } from './QuestionAnswerBlueprintsView';
import { RecentActivitiesView } from './RecentActivitiesView';
import { BusinessEnglishProfileSection } from './BusinessEnglishProfileSection';
import { StructuredAnswerBlueprint } from '../../features/knowledge/types';
import { PersistentPins } from '../workspace/PersistentPins';

export type ProfileViewTab = 'background_capacity' | 'projects_storybanks' | 'qa_blueprints' | 'recent_activities' | 'business_english';

interface MyProfileDashboardProps {
  profile: UserCareerProfile;
  activeMission?: import('../../types').CareerMission | null;
  onUpdateProfile: (updates: Partial<UserCareerProfile>) => void;
  savedJobs: SavedJobApplication[];
  bookmarkedQuestionIds: string[];
  onToggleBookmarkQuestion: (questionId: string) => void;
  onStartLiveInterview: () => void;
  onStartMockPractice: () => void;
  onStartPracticeQuestion: (question: InterviewQuestion) => void;
  onStartPracticeRole: (role: RoleBlueprint) => void;
  onStartPracticeDomain: (domainName: string) => void;
  onOpenApplicationWorkspace?: (applicationId: string) => void;
  onNavigateToBusinessEnglish?: (tab?: string) => void;
  onOpenMissionControl?: () => void;
  onOpenCreateMission?: () => void;
  onExecuteMissionStep?: (step: import('../../types').GrowthLoopStep) => void;
  onGetExpertFeedback?: (context?: any) => void;
  initialTab?: ProfileViewTab;
}

export const MyProfileDashboard: React.FC<MyProfileDashboardProps> = ({
  profile,
  activeMission,
  onUpdateProfile,
  savedJobs,
  bookmarkedQuestionIds,
  onToggleBookmarkQuestion,
  onStartLiveInterview,
  onStartMockPractice,
  onStartPracticeQuestion,
  onStartPracticeRole,
  onStartPracticeDomain,
  onOpenApplicationWorkspace,
  onNavigateToBusinessEnglish,
  onOpenMissionControl,
  onOpenCreateMission,
  onExecuteMissionStep,
  onGetExpertFeedback,
  initialTab = 'background_capacity',
}) => {
  const [activeTab, setActiveTab] = useState<ProfileViewTab>(initialTab);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Close More dropdown on click outside or Escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreDropdownRef.current && !moreDropdownRef.current.contains(e.target as Node)) {
        setIsMoreOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Primary 3 Core Profile Tabs (always visible, never inside a scrolling carousel)
  const primaryProfileTabs: {
    id: ProfileViewTab;
    domId: string;
    label: string;
    icon: React.FC<{ className?: string }>;
    activeIconColor: string;
  }[] = [
    {
      id: 'background_capacity',
      domId: 'tab-profile-background-capacity',
      label: 'Background & Capacity',
      icon: FileText,
      activeIconColor: 'text-blue-600'
    },
    {
      id: 'projects_storybanks',
      domId: 'tab-profile-projects-storybanks',
      label: 'Projects & Story',
      icon: FolderKanban,
      activeIconColor: 'text-blue-600'
    },
    {
      id: 'qa_blueprints',
      domId: 'tab-profile-qa-blueprints',
      label: 'Q&A Blueprints',
      icon: BookOpen,
      activeIconColor: 'text-purple-600'
    }
  ];

  // Secondary Profile Tabs housed inside the "More" dropdown
  const moreProfileTabs: {
    id: ProfileViewTab;
    domId: string;
    label: string;
    description: string;
    icon: React.FC<{ className?: string }>;
    activeIconColor: string;
  }[] = [
    {
      id: 'recent_activities',
      domId: 'tab-profile-recent-activities',
      label: 'Recent Activities',
      description: 'Practice timeline, simulations, and workspace history',
      icon: Activity,
      activeIconColor: 'text-slate-800'
    },
    {
      id: 'business_english',
      domId: 'tab-profile-business-english',
      label: 'Business English',
      description: 'Executive communication & domain vocabulary calibration',
      icon: Globe,
      activeIconColor: 'text-indigo-600'
    }
  ];

  const activeMoreTab = moreProfileTabs.find(t => t.id === activeTab);
  const isMoreActive = Boolean(activeMoreTab);

  // Convert blueprint to InterviewQuestion and start practice
  const handleStartPracticeBlueprint = (blueprint: StructuredAnswerBlueprint) => {
    const questionObj: InterviewQuestion = {
      id: blueprint.questionId || `q-${blueprint.id}`,
      question: blueprint.questionText,
      roleCategory: (blueprint.roleCategory as any) || (profile.targetRole as any) || 'Software Engineering',
      domain: (blueprint.domain as any) || (profile.targetDomain as any) || 'Fintech & Payments',
      level: profile.experienceLevel || 'Lead / Staff',
      type: blueprint.framework === 'STAR' ? 'Behavioral (STAR)' : 'Technical Architecture',
      context: blueprint.components.situation || blueprint.components.openingHook || 'Structured Interview Blueprint',
      rubricCriteria: [
        {
          criterion: 'Structure & Execution Framework',
          weight: 40,
          whatStrongCandidatesSay: blueprint.components.openingHook || 'Demonstrates clear, metrics-driven framework progression.',
          redFlags: 'Rambling narrative with no concrete decision-making.'
        },
        {
          criterion: 'Technical Depth & Production Realism',
          weight: 60,
          whatStrongCandidatesSay: (blueprint.metrics || []).join('; ') || 'Directly references measurable impact and tradeoffs.',
          redFlags: 'Vague conceptual claims without verifiable evidence.'
        }
      ],
      starGuidance: {
        situation: blueprint.components.situation || '',
        task: blueprint.components.task || '',
        action: Array.isArray(blueprint.components.action) ? blueprint.components.action.join('. ') : (blueprint.components.action || ''),
        result: Array.isArray(blueprint.components.result) ? blueprint.components.result.join('. ') : (blueprint.components.result || ''),
      },
      keywordsToMention: blueprint.metrics && blueprint.metrics.length > 0 ? blueprint.metrics : ['Production Architecture', 'Idempotency', 'Zero Downtime'],
      exemplaryModelAnswer: blueprint.components.openingHook || 'Structured response with empirical outcomes and architectural tradeoffs.',
    };

    onStartPracticeQuestion(questionObj);
  };

  const handleNavigateStage = (stage: CareerProcessStage) => {
    if (stage === 'build_profile') {
      setActiveTab('background_capacity');
    } else if (stage === 'prepare') {
      setActiveTab('qa_blueprints');
    } else if (stage === 'practice') {
      onStartLiveInterview();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* 1. CANONICAL YOUR PINS & CONTEXTUAL ASSISTANT WORKSPACE (Directly beneath Active Career Mission) */}
      <PersistentPins
        variant="dashboard-strip"
        savedJobs={savedJobs}
        profile={profile}
        activeMission={activeMission}
        onStartLiveInterview={onStartLiveInterview}
        onStartMockPractice={onStartMockPractice}
        onOpenMissionControl={onOpenMissionControl}
        onExecuteMissionStep={onExecuteMissionStep}
      />

      {/* 2. PROFILE HEADER & CAREER CALIBRATION SNAPSHOT */}
      <ProfileHeader
        profile={profile}
        onUpdateProfile={onUpdateProfile}
        onOpenLivePractice={onStartLiveInterview}
        onOpenAIDiagnostic={() => {
          window.dispatchEvent(new CustomEvent('career_open_pins_assistant'));
        }}
      />

      {/* 3. FLEXIBLE TWO-COLUMN WORKSPACE: CURRENT FOCUS (7 cols) & CAREER STATUS (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* CURRENT FOCUS & NEXT ACTIONS (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <TargetSection
            profile={profile}
            onEditClick={() => {
              const editBtn = document.getElementById('btn-edit-career-calibration');
              editBtn?.click();
            }}
          />

          <ChecklistSection 
            onOpenMissionControl={onOpenMissionControl}
            onOpenCreateMission={onOpenCreateMission}
            onGetExpertFeedback={onGetExpertFeedback}
          />
        </div>

        {/* CAREER STATUS & READINESS SIGNALS (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Skill Evidence & Auditable Proof */}
          <CompactSkillEvidenceGraph
            onViewFullGraph={() => {
              setActiveTab('background_capacity');
            }}
          />

          {/* Active Application Radar */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Application Radar
                  </h4>
                  <p className="text-2xs text-slate-500">
                    {savedJobs.length > 0 ? `${savedJobs.length} active opportunities tracked` : 'Track opportunities in your pipeline'}
                  </p>
                </div>
              </div>

              {onOpenApplicationWorkspace && (
                <button
                  type="button"
                  onClick={() => onOpenApplicationWorkspace('')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer hover:underline"
                >
                  <span>Tracker</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {savedJobs.length === 0 ? (
              <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 text-center text-xs text-slate-500">
                No active applications in pipeline yet. Save opportunities from Job Opportunity to track them here.
              </div>
            ) : (
              <div className="space-y-2">
                {savedJobs.slice(0, 3).map((saved) => (
                  <div
                    key={saved.id}
                    className="p-3 rounded-xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-200/80 transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">
                        {saved.job.title}
                      </div>
                      <div className="text-2xs text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700">{saved.job.company}</span>
                        <span>·</span>
                        <span className="text-blue-600 font-semibold capitalize">{saved.status.replace(/_/g, ' ')}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onStartPracticeRole({
                        id: saved.job.id,
                        title: saved.job.title,
                        category: saved.job.roleCategory,
                        level: saved.job.level,
                        tagline: saved.job.description.slice(0, 80),
                        overview: saved.job.description,
                        dailyTasksTimeline: [],
                        primaryTechStack: saved.job.requiredSkills || [],
                        commonTools: [],
                        keyPerformanceMetrics: [],
                        careerProgression: [],
                        typicalInterviewStages: [],
                        competencies: [],
                        marketDemand: 'High',
                        salaryBenchmark: { junior: '$100k - $140k', mid: '$140k - $180k', senior: '$180k - $240k', lead: '$220k - $300k' }
                      })}
                      className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-slate-200 rounded-lg text-2xs font-semibold shrink-0 transition-colors shadow-3xs cursor-pointer"
                    >
                      Practice
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* 4. CAREER ACTIVITY & SUBSTANTIVE WORKSPACE (Full Width Flexible Block) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 xl:p-6 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Career Activity, Projects &amp; Answer Blueprints
            </h3>
            <p className="text-xs text-slate-500 font-normal">
              Substantive personal career assets: architectural case studies, STAR response blueprints, and practice timelines.
            </p>
          </div>

          {/* Structured Secondary Profile Navigation:
              3 Primary Visible Tabs (Background & Capacity | Projects & Story | Q&A Blueprints) + More ▾ Dropdown.
              Never uses a horizontal scrolling carousel. Adapts smoothly across 14", 16", and 23" viewports. */}
          <nav
            aria-label="My Profile Secondary Workspace Navigation"
            className="flex flex-wrap sm:flex-nowrap items-stretch gap-1 xl:gap-1.5 2xl:gap-2 p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium shrink-0"
          >
            {primaryProfileTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  id={tab.domId}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMoreOpen(false);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 xl:px-3 2xl:px-3.5 py-1.5 min-h-[36px] rounded-lg font-semibold transition-all flex items-center gap-1.5 xl:gap-2 cursor-pointer text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/70'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${
                      isActive ? tab.activeIconColor : 'text-slate-500'
                    }`}
                  />
                  <span className="text-[11.5px] xl:text-xs leading-[1.15] tracking-tight whitespace-normal [text-wrap:balance] sm:whitespace-nowrap">
                    {tab.label}
                  </span>
                </button>
              );
            })}

            {/* "More ▾" Dropdown for Remaining Secondary Profile Sections */}
            <div className="relative flex items-stretch" ref={moreDropdownRef}>
              <button
                id="tab-profile-more-dropdown"
                type="button"
                onClick={() => setIsMoreOpen(prev => !prev)}
                aria-expanded={isMoreOpen}
                aria-haspopup="menu"
                className={`px-2.5 xl:px-3 2xl:px-3.5 py-1.5 min-h-[36px] rounded-lg font-semibold transition-all flex items-center gap-1.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isMoreActive
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/70'
                    : isMoreOpen
                    ? 'bg-white/80 text-slate-900 border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                }`}
              >
                {activeMoreTab ? (
                  <activeMoreTab.icon className={`w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0 ${activeMoreTab.activeIconColor}`} />
                ) : null}
                <span className="text-[11.5px] xl:text-xs leading-[1.15] whitespace-nowrap">
                  More
                </span>
                {isMoreActive && (
                  <>
                    <span className="hidden xl:inline text-[11px] font-bold text-blue-600 whitespace-nowrap">
                      · {activeMoreTab?.label}
                    </span>
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"
                      aria-label={`Active section: ${activeMoreTab?.label}`}
                    />
                  </>
                )}
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 shrink-0 ${
                    isMoreOpen ? 'rotate-180 text-slate-700' : ''
                  }`}
                />
              </button>

              {isMoreOpen && (
                <div
                  role="menu"
                  aria-label="More Profile Sections"
                  className="absolute right-0 top-full mt-1.5 w-64 bg-white rounded-2xl border border-slate-200/90 shadow-xl py-2 z-30 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3.5 py-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      More Profile Sections
                    </span>
                  </div>

                  <div className="p-1.5 space-y-1">
                    {moreProfileTabs.map(item => {
                      const ItemIcon = item.icon;
                      const isItemSelected = activeTab === item.id;

                      return (
                        <button
                          key={item.id}
                          id={item.domId}
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMoreOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-start gap-2.5 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 ${
                            isItemSelected
                              ? 'bg-blue-50/80 text-slate-900 border border-blue-200/80 shadow-3xs'
                              : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              isItemSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1.5">
                              <span className={`text-xs ${isItemSelected ? 'font-bold text-slate-900' : 'font-semibold text-slate-800'}`}>
                                {item.label}
                              </span>
                              {isItemSelected && (
                                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Active Substantive Workspace Viewer */}
        <div className="pt-1">
          {activeTab === 'qa_blueprints' && (
            <div className="animate-in fade-in">
              <QuestionAnswerBlueprintsView
                onStartPracticeBlueprint={handleStartPracticeBlueprint}
                targetRole={profile.targetRole || 'Software Engineering'}
                targetDomain={profile.targetDomain || 'Fintech & Payments'}
              />
            </div>
          )}

          {activeTab === 'projects_storybanks' && (
            <div className="animate-in fade-in">
              <ProjectsStorybanksWorkspace
                onStartPracticeBlueprint={handleStartPracticeBlueprint}
                onNavigateToBlueprint={(bpId) => setActiveTab('qa_blueprints')}
              />
            </div>
          )}

          {activeTab === 'recent_activities' && (
            <div className="animate-in fade-in">
              <RecentActivitiesView
                onNavigateToTab={(tab) => {
                  if (tab === 'profile') setActiveTab('qa_blueprints');
                }}
              />
            </div>
          )}

          {activeTab === 'background_capacity' && (
            <div className="animate-in fade-in">
              <BackgroundCapacityView />
            </div>
          )}

          {activeTab === 'business_english' && (
            <div className="animate-in fade-in">
              <BusinessEnglishProfileSection
                profile={profile}
                onNavigateToBusinessEnglish={onNavigateToBusinessEnglish}
              />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
