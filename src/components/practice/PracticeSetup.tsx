import React, { useState } from 'react';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Sliders, 
  ArrowRight,
  Shield,
  HelpCircle,
  Radio,
  UserCheck
} from 'lucide-react';
import { InterviewConfig, RoleCategory, SectorDomain, ExperienceLevel, QuestionType, QuestionSetId } from '../../types';
import { useAccessControl } from '../../services/accessControlService';
import { IntelligenceAccessBanner } from '../access/IntelligenceAccessBanner';
import { LiveInterviewEcosystemService } from '../../services/liveInterviewEcosystemService';
import { ConnectedEcosystemChainStrip } from './InterviewIntelligenceOutcomePanel';

interface PracticeSetupProps {
  initialConfig?: Partial<InterviewConfig>;
  onStartSession: (config: InterviewConfig) => void;
}

export const PracticeSetup: React.FC<PracticeSetupProps> = ({
  initialConfig,
  onStartSession,
}) => {
  const { accessLevel } = useAccessControl();
  const isGuest = accessLevel === 'PUBLIC' || accessLevel === 'GUEST';
  const isDemo = accessLevel === 'DEMO';

  const [roleCategory, setRoleCategory] = useState<RoleCategory>(
    initialConfig?.roleCategory || 'Software Engineering'
  );
  const [domain, setDomain] = useState<SectorDomain>(
    initialConfig?.domain || 'Fintech & Payments'
  );
  const [level, setLevel] = useState<ExperienceLevel>(
    initialConfig?.level || 'Senior'
  );
  const [interviewType, setInterviewType] = useState<QuestionType>(
    initialConfig?.interviewType || 'Technical Architecture'
  );
  const [questionCount, setQuestionCount] = useState<number>(
    initialConfig?.questionCount || 3
  );
  const [timePerQuestion, setTimePerQuestion] = useState<number>(
    initialConfig?.timePerQuestionSeconds || 180 // 3 minutes
  );
  const [enableVoiceReading, setEnableVoiceReading] = useState<boolean>(
    initialConfig?.enableVoiceReading ?? true
  );
  const [interviewMode, setInterviewMode] = useState<'mock' | 'live_intelligence'>(
    initialConfig?.interviewMode || 'live_intelligence'
  );
  const [mockExperienceType, setMockExperienceType] = useState<'realtime_ai' | 'classic' | 'timed_assignment'>(
    initialConfig?.mockExperienceType || 'realtime_ai'
  );
  const [questionSet, setQuestionSet] = useState<QuestionSetId>(
    initialConfig?.questionSet || 'architecture_scale'
  );

  const upstreamContext = LiveInterviewEcosystemService.resolveUpstreamContext({
    roleCategory,
    domain,
    level,
    interviewType,
    questionCount,
    questionSet
  });

  const roles: RoleCategory[] = [
    'Software Engineering',
    'Product Management',
    'UI/UX & Product Design',
    'Data & Machine Learning',
    'DevOps & Cloud',
    'Security & Systems',
  ];

  const domains: SectorDomain[] = [
    'Fintech & Payments',
    'Enterprise SaaS',
    'AI & Machine Learning',
    'Healthcare & MedTech',
    'E-Commerce & Retail',
    'Cloud Infrastructure & DevOps',
    'Cybersecurity',
  ];

  const levels: ExperienceLevel[] = ['Junior', 'Mid-Level', 'Senior', 'Lead / Staff'];

  const types: QuestionType[] = [
    'Behavioral (STAR)',
    'Technical Architecture',
    'Product Sense & Strategy',
    'System Design',
    'Domain Deep-Dive',
  ];

  const questionSets: { id: QuestionSetId; label: string; description: string }[] = [
    {
      id: 'standard_curriculum',
      label: 'Comprehensive Calibration (Mixed)',
      description: 'Standard hiring loop covering technical execution, collaboration, and architecture.'
    },
    {
      id: 'conflict_leadership',
      label: 'Stakeholder Conflict & Disagreement',
      description: 'Cross-functional engineering disagreement, pushback, trade-offs, and measurable impact.'
    },
    {
      id: 'architecture_scale',
      label: 'System Architecture & Resilience',
      description: 'Distributed design, failure mode recovery, idempotency, and throughput trade-offs.'
    },
    {
      id: 'product_strategy',
      label: 'Product Sense & Prioritization',
      description: 'Resource trade-offs, revenue vs retention balancing, and stakeholder alignment.'
    },
    {
      id: 'domain_deepdive',
      label: 'Domain & Regulatory Deep-Dive',
      description: 'Sector-specific challenges: compliance, transactions, security, and data privacy.'
    }
  ];

  const effectiveQuestionCount = isGuest
    ? 1
    : isDemo
      ? Math.min(questionCount, 2)
      : questionCount;

  const handleLaunch = () => {
    onStartSession({
      roleCategory,
      domain,
      level,
      interviewType,
      questionCount: effectiveQuestionCount,
      timePerQuestionSeconds: timePerQuestion,
      enableVoiceReading,
      interviewMode,
      mockExperienceType,
      questionSet,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Subtle Intelligence Access Banner */}
      <IntelligenceAccessBanner featureName="Interview Practice & Live Intelligence" />

      {/* Connected CareerOS Intelligence Ecosystem Pipeline */}
      <ConnectedEcosystemChainStrip activeStage="setup" upstream={upstreamContext} />

      {/* Studio Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Connected Live Interview &amp; Calibration Studio
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Configure Your Calibration Session
        </h2>
        <p className="text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          Connected directly to your Target Role, Role Blueprint, Capability Model, and Q&amp;A Blueprints. Interview performance signals flow into Evidence, Readiness, and your Next Best Action.
        </p>
      </div>

      {/* Setup Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        
        {/* Interview Experience Mode Selection */}
        <div className="space-y-2 pb-4 border-b border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Interview Operating Mode
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* Mode 1: Live Interview */}
            <button
              type="button"
              onClick={() => setInterviewMode('live_intelligence')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                interviewMode === 'live_intelligence'
                  ? 'bg-purple-50/90 border-purple-500 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-purple-100 text-purple-800">
                    <Radio className="w-4 h-4" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-900 text-sm">
                      1. Live Interview Copilot
                    </span>
                    <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-md bg-purple-200 text-purple-900">
                      Real-Time
                    </span>
                  </div>
                </div>
                {interviewMode === 'live_intelligence' && <CheckCircle2 className="w-4 h-4 text-purple-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Quiet intelligence layer for real interviews: speaker awareness, detected question intent, personal Q&amp;A blueprint context, notes, and conversation recording with post-processing.
              </p>
            </button>

            {/* Mode 2: Mock Interview */}
            <button
              type="button"
              onClick={() => setInterviewMode('mock')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer space-y-1.5 ${
                interviewMode === 'mock'
                  ? 'bg-blue-50/90 border-blue-500 shadow-2xs'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                    <UserCheck className="w-4 h-4" />
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm">
                    2. Mock Interview Simulator
                  </span>
                </div>
                {interviewMode === 'mock' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Controlled practice environment where AI acts as the interviewer: conversational text chat, timed assignments, progressive guidance (Hint → Framework), and STAR rubric scoring.
              </p>
            </button>

          </div>

          {/* Sub-selection for Mock Interview: Text Chat vs Timed Assignments */}
          {interviewMode === 'mock' && (
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/70 space-y-3 mt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Choose Practice Experience Format:</span>
                </label>
                <span className="text-[11px] text-blue-700 font-semibold">Switchable during session</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setMockExperienceType('classic')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    mockExperienceType === 'classic' || mockExperienceType === 'realtime_ai'
                      ? 'bg-white border-blue-600 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      💬 Conversational Text Chat
                    </span>
                    {(mockExperienceType === 'classic' || mockExperienceType === 'realtime_ai') && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    AI interviewer asks questions via text chat; candidate responds with typed answers, progressive guidance, and STAR evaluation.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setMockExperienceType('timed_assignment')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    mockExperienceType === 'timed_assignment'
                      ? 'bg-white border-blue-600 shadow-xs'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      ⏱️ Timed Interview Assignments
                    </span>
                    {mockExperienceType === 'timed_assignment' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    Strict time-constrained challenges (2 to 8 min): behavioral, technical architecture, system design, and product cases.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role & Domain Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Role */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              1. Target Discipline & Role
            </label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRoleCategory(r)}
                  className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                    roleCategory === r
                      ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{r}</span>
                  {roleCategory === r && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Industry Domain Context */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              2. Industry Domain Context
            </label>
            <div className="grid grid-cols-1 gap-2">
              {domains.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDomain(d)}
                  className={`px-4 py-2.5 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                    domain === d
                      ? 'bg-teal-50/80 border-teal-500 text-teal-900 shadow-2xs'
                      : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-100/80'
                  }`}
                >
                  <span>{d}</span>
                  {domain === d && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Level & Interview Type Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
          {/* Seniority Level */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              3. Seniority Calibration Level
            </label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`px-3 py-2.5 rounded-xl text-center text-xs font-semibold border transition-all cursor-pointer ${
                    level === l
                      ? 'bg-slate-900 border-slate-900 text-white shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Interview Type / Mode */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              4. Question Focus Mode
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              {types.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setInterviewType(t)}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-semibold border transition-all cursor-pointer flex items-center justify-between ${
                    interviewType === t
                      ? 'bg-purple-50 border-purple-400 text-purple-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{t}</span>
                  {interviewType === t && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Question Set Selection */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              5. Question Set
            </label>
            <span className="text-[11px] text-slate-400">Library curriculum grouping</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {questionSets.map(qs => (
              <button
                key={qs.id}
                type="button"
                onClick={() => setQuestionSet(qs.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer space-y-1 ${
                  questionSet === qs.id
                    ? 'bg-indigo-50/80 border-indigo-500 shadow-2xs'
                    : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    {qs.label}
                  </span>
                  {questionSet === qs.id && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  {qs.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Preferences (Question Count, Timer, Voice Reading) */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Question Count */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Question Count
            </span>
            <div className="flex gap-1.5">
              {[2, 3, 5].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    questionCount === cnt ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {cnt} Qs
                </button>
              ))}
            </div>
          </div>

          {/* Time Per Question */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Response Timer
            </span>
            <div className="flex gap-1.5">
              {[
                { label: '2 min', val: 120 },
                { label: '3 min', val: 180 },
                { label: '5 min', val: 300 },
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setTimePerQuestion(item.val)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                    timePerQuestion === item.val ? 'bg-blue-600 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Voice Narrator Toggle */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Audio Reader
              </span>
              <span className="text-xs text-slate-600">
                Voice reads questions aloud
              </span>
            </div>
            <button
              type="button"
              onClick={() => setEnableVoiceReading(!enableVoiceReading)}
              aria-label={enableVoiceReading ? 'Disable voice narration' : 'Enable voice narration'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                enableVoiceReading
                  ? 'bg-blue-600 text-white border-blue-700'
                  : 'bg-white text-slate-400 border-slate-300'
              }`}
            >
              {enableVoiceReading ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Launch Button */}
        <div className="pt-2">
          <button
            id="launch-mock-session-btn"
            type="button"
            onClick={handleLaunch}
            className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white font-bold text-base shadow-md hover:shadow-lg transition-all cursor-pointer ${
              interviewMode === 'live_intelligence'
                ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            }`}
          >
            {interviewMode === 'live_intelligence' ? (
              <>
                <Radio className="w-5 h-5 animate-pulse" />
                <span>Launch Live Interview Intelligence Room</span>
                <ArrowRight className="w-5 h-5" />
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Enter Mock Interview Room ({questionCount} Questions)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
