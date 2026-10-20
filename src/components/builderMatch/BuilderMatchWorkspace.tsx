import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Layers, 
  Compass, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight, 
  FolderCheck, 
  SlidersHorizontal, 
  Award, 
  FlaskConical, 
  Building2, 
  Lightbulb, 
  HeartHandshake, 
  Flame, 
  Hammer, 
  Cpu, 
  ChevronRight,
  UserPlus
} from 'lucide-react';
import { 
  BuildOpportunity, 
  BuilderProfile, 
  BuildTeam, 
  MyBuildItem, 
  BuildIntent, 
  BuildOpportunityType,
  CareerEvidence 
} from '../../types/builderMatch';
import { BuilderMatchService } from '../../services/builderMatchService';
import { BuildCard } from './BuildCard';
import { BuilderCard } from './BuilderCard';
import { BuildTeamCard } from './BuildTeamCard';
import { BuildDetailModal } from './BuildDetailModal';
import { BuilderProfileModal } from './BuilderProfileModal';
import { InviteBuilderModal } from './InviteBuilderModal';
import { StartBuildModal } from './StartBuildModal';
import { CreateTeamModal } from './CreateTeamModal';
import { AddToCareerEvidenceModal } from './AddToCareerEvidenceModal';
import { KnowledgePreviewModal } from './KnowledgePreviewModal';

export type BuilderMatchTab = 'explore' | 'builders' | 'teams' | 'my_builds';

interface BuilderMatchWorkspaceProps {
  onNavigateToKnowledge?: (query?: string) => void;
  onNavigateToDiscover?: () => void;
  onRequestFeedback?: (context: { title: string; content: string; capability: string }) => void;
}

export const BuilderMatchWorkspace: React.FC<BuilderMatchWorkspaceProps> = ({
  onNavigateToKnowledge,
  onNavigateToDiscover,
  onRequestFeedback
}) => {
  // Primary Tabs (Requirement 3: Explore, Find Builders, Build Teams, My Builds)
  const [activeTab, setActiveTab] = useState<BuilderMatchTab>('explore');

  // Data states
  const [opportunities, setOpportunities] = useState<BuildOpportunity[]>([]);
  const [builders, setBuilders] = useState<BuilderProfile[]>([]);
  const [teams, setTeams] = useState<BuildTeam[]>([]);
  const [myBuilds, setMyBuilds] = useState<MyBuildItem[]>([]);
  const [savedBuildIds, setSavedBuildIds] = useState<string[]>([]);
  const [savedBuilderIds, setSavedBuilderIds] = useState<string[]>([]);

  // Filter states for Explore
  const [selectedIntent, setSelectedIntent] = useState<BuildIntent>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Filter states for Builders
  const [builderRoleFilter, setBuilderRoleFilter] = useState<string>('all');
  const [builderSearchQuery, setBuilderSearchQuery] = useState('');

  // Filter states for My Builds
  const [myBuildsSubTab, setMyBuildsSubTab] = useState<'active' | 'experiments' | 'completed' | 'saved'>('active');

  // Modals
  const [selectedOpportunity, setSelectedOpportunity] = useState<BuildOpportunity | null>(null);
  const [selectedBuilder, setSelectedBuilder] = useState<BuilderProfile | null>(null);
  const [inviteTargetBuilder, setInviteTargetBuilder] = useState<BuilderProfile | null>(null);
  const [isStartBuildOpen, setIsStartBuildOpen] = useState(false);
  const [startBuildInitialIntent, setStartBuildInitialIntent] = useState<BuildIntent>('solve_challenge');
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [createTeamInitialOpp, setCreateTeamInitialOpp] = useState<BuildOpportunity | null>(null);
  const [convertingBuildItem, setConvertingBuildItem] = useState<MyBuildItem | null>(null);
  const [previewKnowledgeTitle, setPreviewKnowledgeTitle] = useState<string | null>(null);

  // Sync data from service
  const reloadData = () => {
    setOpportunities(BuilderMatchService.getAllBuildOpportunities());
    setBuilders(BuilderMatchService.getAllBuilders());
    setTeams(BuilderMatchService.getAllTeams());
    setMyBuilds(BuilderMatchService.getMyBuilds());
    setSavedBuildIds(BuilderMatchService.getSavedBuildIds());
    setSavedBuilderIds(BuilderMatchService.getSavedBuilderIds());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener('builder_match_updated', handleUpdate);
    window.addEventListener('career_evidence_updated', handleUpdate);
    return () => {
      window.removeEventListener('builder_match_updated', handleUpdate);
      window.removeEventListener('career_evidence_updated', handleUpdate);
    };
  }, []);

  // Intent filter options (Requirement 5)
  const intentFilters: { id: BuildIntent; label: string }[] = [
    { id: 'all', label: 'All Intents' },
    { id: 'solve_challenge', label: 'Solve a Challenge' },
    { id: 'build_product', label: 'Build a Product' },
    { id: 'run_experiment', label: 'Run an Experiment' },
    { id: 'validate_idea', label: 'Validate an Idea' },
    { id: 'build_prototype', label: 'Build a Prototype' },
    { id: 'join_hackathon', label: 'Join a Hackathon' },
    { id: 'find_cobuilder', label: 'Find a Co-builder' },
    { id: 'social_impact', label: 'Social Impact' },
    { id: 'commercialize_research', label: 'Commercialize Research' },
  ];

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(item => {
      if (selectedIntent !== 'all' && item.intent !== selectedIntent) return false;
      if (selectedDomain !== 'all' && item.domain !== selectedDomain) return false;
      if (selectedDifficulty !== 'all' && item.difficulty !== selectedDifficulty) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.shortDescription.toLowerCase().includes(query);
        const matchesDomain = item.domain.toLowerCase().includes(query);
        const matchesOrg = item.creator.name.toLowerCase().includes(query);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesDomain && !matchesOrg && !matchesTags) return false;
      }
      return true;
    });
  }, [opportunities, selectedIntent, selectedDomain, selectedDifficulty, searchQuery]);

  // Filtered Builders
  const filteredBuilders = useMemo(() => {
    return builders.filter(builder => {
      if (builderRoleFilter !== 'all' && builder.primaryRole !== builderRoleFilter) return false;
      if (builderSearchQuery.trim()) {
        const query = builderSearchQuery.toLowerCase();
        const matchesName = builder.name.toLowerCase().includes(query);
        const matchesHeadline = builder.headline.toLowerCase().includes(query);
        const matchesSkills = builder.skills.some(s => s.toLowerCase().includes(query));
        const matchesCaps = builder.capabilities.some(c => c.toLowerCase().includes(query));
        if (!matchesName && !matchesHeadline && !matchesSkills && !matchesCaps) return false;
      }
      return true;
    });
  }, [builders, builderRoleFilter, builderSearchQuery]);

  // Handlers
  const handleToggleSaveBuild = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    BuilderMatchService.toggleSaveBuild(id);
  };

  const handleToggleSaveBuilder = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    BuilderMatchService.toggleSaveBuilder(id);
  };

  const handleJoinBuild = (opp: BuildOpportunity, role: string) => {
    BuilderMatchService.joinBuild(opp, role);
    reloadData();
  };

  const handleOpenStartBuild = (intent: BuildIntent = 'solve_challenge') => {
    setStartBuildInitialIntent(intent);
    setIsStartBuildOpen(true);
  };

  const handleOpenCreateTeam = (opp?: BuildOpportunity) => {
    setCreateTeamInitialOpp(opp || null);
    setIsCreateTeamOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* ==================================================
          1. BUILDER MATCH HOME HEADER & BANNER (Requirement 2)
          ================================================== */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-5 text-left">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Hammer className="w-3 h-3 text-amber-600" />
                Collaborative Innovation Network
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-2xs text-slate-500 font-medium">Beyond Job Boards</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              Builder Match
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              Find the right people, challenges, and opportunities to build something meaningful. 
              Connect challenges to builders, form temporary teams, run experiments, and convert completed outcomes into certified career evidence.
            </p>
          </div>

          {/* Primary Action Buttons (Requirement 2: Explore, Find Builders, Create a Challenge, Start a Build) */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Explore
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('builders')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'builders'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Find Builders
            </button>

            <button
              type="button"
              onClick={() => handleOpenStartBuild('solve_challenge')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer shadow-3xs flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>Create a Challenge</span>
            </button>

            <button
              type="button"
              onClick={() => handleOpenStartBuild('build_product')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Start a Build</span>
            </button>
          </div>

        </div>

        {/* ==================================================
            2. FOUR PRIMARY TABS (Requirement 3)
            - Explore
            - Find Builders
            - Build Teams
            - My Builds
            ================================================== */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3 overflow-x-auto no-scrollbar">
          <div className="inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/80 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'explore'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-blue-600" />
              <span>Explore ({opportunities.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('builders')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'builders'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-indigo-600" />
              <span>Find Builders ({builders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('teams')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'teams'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Build Teams ({teams.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('my_builds')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'my_builds'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>My Builds ({myBuilds.length})</span>
            </button>
          </div>

          {/* Quick tab description */}
          <div className="text-2xs text-slate-500 font-medium hidden md:block">
            {activeTab === 'explore' && 'Discover challenges, experimental hypotheses & prototypes worth building'}
            {activeTab === 'builders' && 'Connect with complementary builders based on skills, gaps & shipped evidence'}
            {activeTab === 'teams' && 'Form or join temporary squads with verified AI team complementarity'}
            {activeTab === 'my_builds' && 'Manage your active builds & convert completed projects to career evidence'}
          </div>
        </div>
      </div>

      {/* ==================================================
          TAB 1: EXPLORE (Requirement 4 & 5)
          ================================================== */}
      {activeTab === 'explore' && (
        <div className="space-y-5">
          
          {/* Intent Filters Strip (Requirement 5: "What do you want to do?") */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
                What do you want to do?
              </span>
              <span className="text-2xs text-slate-500 font-medium">
                Showing {filteredOpportunities.length} opportunities
              </span>
            </div>

            {/* Interactive Intent Filter Buttons (clean segmented control) */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {intentFilters.map((intent) => {
                const isActive = selectedIntent === intent.id;
                return (
                  <button
                    key={intent.id}
                    type="button"
                    onClick={() => setSelectedIntent(intent.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {intent.label}
                  </button>
                );
              })}
            </div>

            {/* Secondary Controls: Search, Domain, Difficulty */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search challenges, keywords, skills, or sponsors..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <option value="all">All Domains</option>
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                  <option value="AI & Developer Tools">AI &amp; Developer Tools</option>
                  <option value="Fintech & Analytics">Fintech &amp; Analytics</option>
                  <option value="Healthcare & Emergency Response">Healthcare &amp; Impact</option>
                  <option value="Cybersecurity & AI Alignment">AI Safety</option>
                  <option value="Personal Knowledge & AI">Knowledge &amp; AI</option>
                </select>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 cursor-pointer focus:outline-hidden"
                >
                  <option value="all">All Levels</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>

                {(selectedIntent !== 'all' || selectedDomain !== 'all' || selectedDifficulty !== 'all' || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIntent('all');
                      setSelectedDomain('all');
                      setSelectedDifficulty('all');
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1 text-2xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredOpportunities.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <Compass className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
              <h3 className="text-sm font-bold text-slate-800">No build opportunities match your filter</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try switching intents, clearing domain filters, or start a new build from scratch.
              </p>
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedIntent('all');
                    setSelectedDomain('all');
                    setSelectedDifficulty('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Show All Builds
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenStartBuild('solve_challenge')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Start a Build
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredOpportunities.map((opportunity) => (
                <BuildCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onSelect={(opp) => setSelectedOpportunity(opp)}
                  onToggleSave={handleToggleSaveBuild}
                />
              ))}
            </div>
          )}

        </div>
      )}

      {/* ==================================================
          TAB 2: FIND BUILDERS (Requirement 7 & 8)
          ================================================== */}
      {activeTab === 'builders' && (
        <div className="space-y-5">
          
          {/* Builder Filters */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={builderSearchQuery}
                  onChange={(e) => setBuilderSearchQuery(e.target.value)}
                  placeholder="Search by builder name, capabilities, or technical skills..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 transition-all font-medium"
                />
              </div>

              {/* Role filter buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {['all', 'Product Lead', 'AI Engineer', 'Product Designer', 'Fullstack Architect', 'Growth Strategist'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setBuilderRoleFilter(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      builderRoleFilter === role
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {role === 'all' ? 'All Roles' : role}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Builders Grid */}
          {filteredBuilders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <Users className="w-8 h-8 mx-auto text-slate-300" />
              <h3 className="text-sm font-bold text-slate-800">No builders match this search</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try resetting role filters or searching for specific capabilities.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBuilderRoleFilter('all');
                  setBuilderSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                Show All Builders
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredBuilders.map((builder) => (
                <BuilderCard
                  key={builder.id}
                  builder={builder}
                  onSelect={(b) => setSelectedBuilder(b)}
                  onInvite={(b) => setInviteTargetBuilder(b)}
                  onToggleSave={handleToggleSaveBuilder}
                />
              ))}
            </div>
          )}

          {/* Bottom Banner: Co-Builder Request Promo */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 to-indigo-50/60 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div className="space-y-1">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-blue-700">
                Building an Independent Idea?
              </span>
              <h4 className="text-base font-extrabold text-slate-900">
                Post a Co-Builder Callout
              </h4>
              <p className="text-xs text-slate-600 max-w-xl">
                You don't need a corporate challenge to start building. Publish your project concept, specify what complementary capabilities you need, and match with peers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleOpenStartBuild('find_cobuilder')}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto"
            >
              Post Co-Builder Request
            </button>
          </div>

        </div>
      )}

      {/* ==================================================
          TAB 3: BUILD TEAMS (Requirement 9)
          ================================================== */}
      {activeTab === 'teams' && (
        <div className="space-y-5">
          
          {/* Header & Create Team CTA */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Temporary Build Squads</h3>
              <p className="text-xs text-slate-500 font-medium">
                Assemble lightweight, cross-functional squads to tackle specific challenges without permanent company structures.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenCreateTeam()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer shrink-0 self-start sm:self-auto active:scale-95"
            >
              <Users className="w-3.5 h-3.5 text-white" />
              <span>+ Build a Team</span>
            </button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {teams.map((team) => (
              <BuildTeamCard
                key={team.id}
                team={team}
                onSelect={(t) => {}}
                onJoinTeam={(t) => {
                  alert(`You applied to join ${t.name}! The squad lead has been notified.`);
                }}
              />
            ))}
          </div>

        </div>
      )}

      {/* ==================================================
          TAB 4: MY BUILDS (Requirement 12 & 13)
          ================================================== */}
      {activeTab === 'my_builds' && (
        <div className="space-y-5">
          
          {/* Subtabs Strip: Active, Experiments, Completed, Saved */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setMyBuildsSubTab('active')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  myBuildsSubTab === 'active'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Active Builds ({myBuilds.filter(b => b.status === 'active').length})
              </button>

              <button
                type="button"
                onClick={() => setMyBuildsSubTab('experiments')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  myBuildsSubTab === 'experiments'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Experiments ({myBuilds.filter(b => b.isExperiment).length})
              </button>

              <button
                type="button"
                onClick={() => setMyBuildsSubTab('completed')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  myBuildsSubTab === 'completed'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Completed Builds ({myBuilds.filter(b => b.status === 'completed').length})
              </button>

              <button
                type="button"
                onClick={() => setMyBuildsSubTab('saved')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  myBuildsSubTab === 'saved'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Saved ({savedBuildIds.length + savedBuilderIds.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenStartBuild('solve_challenge')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Start New Build</span>
            </button>
          </div>

          {/* Subtab Contents */}
          {myBuildsSubTab === 'active' && (
            <div className="space-y-4">
              {myBuilds.filter(b => b.status === 'active').length === 0 ? (
                /* Requirement 22: Empty State */
                <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
                  <Hammer className="w-8 h-8 mx-auto text-slate-300" />
                  <h3 className="text-base font-bold text-slate-800">No active builds</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Nothing on the workbench yet. Explore a challenge, start an experiment, or find a co-builder.
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('explore')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Explore Builder Match
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenStartBuild('build_product')}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Start a Build
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myBuilds.filter(b => b.status === 'active').map((build) => (
                    <div 
                      key={build.id} 
                      className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                            Active Build
                          </span>
                          <h4 className="text-base font-bold text-slate-900 mt-1">{build.title}</h4>
                          <p className="text-xs font-medium text-slate-600 mt-0.5">Role: {build.role}</p>
                        </div>
                        <span className="text-2xs font-semibold text-slate-400">{build.date}</span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                        <span className="text-2xs font-bold uppercase tracking-wider text-slate-500">Next Milestone</span>
                        <p className="font-semibold text-slate-800">{build.nextMilestone || 'In development'}</p>
                        <p className="text-2xs text-slate-500">Target deadline: {build.deadline}</p>
                      </div>

                      <div className="flex items-center justify-between text-2xs text-slate-500 pt-1">
                        <span>Squad: {build.team.join(' · ')}</span>
                      </div>

                      {/* Convert to Career Evidence Trigger (Requirement 13) */}
                      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-2xs text-slate-400">Mark complete when shipped</span>
                        
                        <div className="flex items-center gap-2">
                          {onRequestFeedback && (
                            <button
                              type="button"
                              onClick={() => onRequestFeedback({
                                title: build.title,
                                content: `Active Build Role: ${build.role}\nMilestone: ${build.nextMilestone || 'In development'}\nTeam: ${build.team.join(', ')}`,
                                capability: build.skills?.[0] || 'Product Strategy'
                              })}
                              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                              title="Get an expert perspective before turning this into evidence"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                              <span>Request Review</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => setConvertingBuildItem(build)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-xs cursor-pointer active:scale-95"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>Add to Evidence</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {myBuildsSubTab === 'experiments' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBuilds.filter(b => b.isExperiment).map((exp) => (
                  <div key={exp.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                          Structured Experiment
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-1">{exp.title}</h4>
                        <p className="text-xs text-slate-600 font-medium">Role: {exp.role}</p>
                      </div>
                      <span className="text-2xs font-semibold text-slate-400">{exp.date}</span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">{exp.contribution}</p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-2xs text-slate-500 font-medium">Team: {exp.team.join(', ')}</span>
                      <button
                        type="button"
                        onClick={() => setConvertingBuildItem(exp)}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        Convert to Evidence
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {myBuildsSubTab === 'completed' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBuilds.filter(b => b.status === 'completed').map((build) => (
                  <div key={build.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Completed &amp; Validated
                          </span>
                          {build.hasCareerEvidence && (
                            <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 flex items-center gap-1">
                              <Award className="w-3 h-3 text-blue-600" />
                              Career Evidence Certified (+8%)
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 mt-1.5">{build.title}</h4>
                        <p className="text-xs text-slate-600 font-medium">Role: {build.role}</p>
                      </div>
                      <span className="text-2xs font-semibold text-slate-400">{build.date}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                      <p className="text-slate-700 leading-relaxed"><strong>Outcome:</strong> {build.outcome}</p>
                      {build.metrics && (
                        <p className="text-emerald-700 font-semibold"><strong>Impact:</strong> {build.metrics}</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 text-2xs text-slate-500">
                      <span>Squad: {build.team.join(' · ')}</span>
                      {build.hasCareerEvidence ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          In Profile Portfolio
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConvertingBuildItem(build)}
                          className="font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                        >
                          + Add to Career Evidence
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {myBuildsSubTab === 'saved' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Bookmarked Challenges &amp; Builders</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {opportunities.filter(o => o.isSaved).map(opp => (
                  <BuildCard
                    key={opp.id}
                    opportunity={opp}
                    onSelect={(o) => setSelectedOpportunity(o)}
                    onToggleSave={handleToggleSaveBuild}
                  />
                ))}

                {builders.filter(b => b.isSaved).map(builder => (
                  <BuilderCard
                    key={builder.id}
                    builder={builder}
                    onSelect={(b) => setSelectedBuilder(b)}
                    onInvite={(b) => setInviteTargetBuilder(b)}
                    onToggleSave={handleToggleSaveBuilder}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================
          MODALS & FLYOUTS
          ================================================== */}
      
      {/* 1. Build Opportunity Deep Dive Workspace Modal */}
      <BuildDetailModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
        onJoinBuild={handleJoinBuild}
        onFormTeam={(opp) => {
          setSelectedOpportunity(null);
          handleOpenCreateTeam(opp);
        }}
        onSelectBuilder={(builder) => {
          setSelectedBuilder(builder);
        }}
        onInviteBuilder={(builder, opp) => {
          setSelectedOpportunity(null);
          setInviteTargetBuilder(builder);
        }}
        onToggleSave={handleToggleSaveBuild}
        onOpenKnowledge={(knTitle) => {
          setPreviewKnowledgeTitle(knTitle);
        }}
      />

      {/* 2. Builder Profile & Evidence Modal */}
      <BuilderProfileModal
        builder={selectedBuilder}
        isOpen={Boolean(selectedBuilder)}
        onClose={() => setSelectedBuilder(null)}
        onInvite={(builder) => {
          setSelectedBuilder(null);
          setInviteTargetBuilder(builder);
        }}
        onToggleSave={handleToggleSaveBuilder}
      />

      {/* 3. Invite Builder Modal */}
      <InviteBuilderModal
        builder={inviteTargetBuilder}
        currentOpportunity={selectedOpportunity}
        availableOpportunities={opportunities}
        isOpen={Boolean(inviteTargetBuilder)}
        onClose={() => setInviteTargetBuilder(null)}
        onSendInvite={(builderId, buildId, role, note) => {
          reloadData();
        }}
      />

      {/* 4. Start a Build / Create Challenge Modal with AI Structuring */}
      <StartBuildModal
        isOpen={isStartBuildOpen}
        onClose={() => setIsStartBuildOpen(false)}
        initialIntent={startBuildInitialIntent}
        onBuildCreated={(newBuild) => {
          reloadData();
          setSelectedOpportunity(newBuild);
        }}
      />

      {/* 5. Create Team Modal with AI Squad Fit Preview */}
      <CreateTeamModal
        isOpen={isCreateTeamOpen}
        onClose={() => setIsCreateTeamOpen(false)}
        initialOpportunity={createTeamInitialOpp}
        availableOpportunities={opportunities}
        onTeamCreated={(newTeam) => {
          reloadData();
          setActiveTab('teams');
        }}
      />

      {/* 6. Add to Career Evidence Modal */}
      <AddToCareerEvidenceModal
        buildItem={convertingBuildItem}
        isOpen={Boolean(convertingBuildItem)}
        onClose={() => setConvertingBuildItem(null)}
        onEvidenceSaved={(ev) => {
          reloadData();
        }}
        onGetExpertReview={onRequestFeedback}
      />

      {/* 7. Knowledge Preview Modal */}
      <KnowledgePreviewModal
        title={previewKnowledgeTitle}
        isOpen={Boolean(previewKnowledgeTitle)}
        onClose={() => setPreviewKnowledgeTitle(null)}
        onNavigateToKnowledge={() => {
          if (onNavigateToKnowledge) {
            onNavigateToKnowledge(previewKnowledgeTitle || undefined);
          }
        }}
      />

    </div>
  );
};
