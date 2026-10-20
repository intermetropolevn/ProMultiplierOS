import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  Rocket, 
  Gift, 
  Building2, 
  Radar, 
  Search, 
  Filter, 
  Sparkles, 
  Clock, 
  ArrowUpDown, 
  CheckCircle2, 
  X,
  TrendingUp,
  ShieldCheck,
  Award,
  SlidersHorizontal,
  BookmarkCheck,
  Calendar
} from 'lucide-react';
import { 
  CareerOpportunity, 
  OpportunityType, 
  TrackedRadarOpportunity 
} from '../../types';
import { OpportunityService } from '../../services/opportunityService';
import { OpportunityCard } from './OpportunityCard';
import { CompanySignalCard } from './CompanySignalCard';
import { OpportunityDetailModal } from './OpportunityDetailModal';
import { CreateOpportunityModal } from './CreateOpportunityModal';

interface OpportunitiesExplorerProps {
  onOpenCreateModal?: () => void;
  externalSearchQuery?: string;
  onBuildMission?: (title: string, domain?: string) => void;
}

export const OpportunitiesExplorer: React.FC<OpportunitiesExplorerProps> = ({
  onOpenCreateModal,
  externalSearchQuery = '',
  onBuildMission,
}) => {
  // Opportunities State
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>(() => {
    return OpportunityService.getAllOpportunities();
  });

  // Tracked Radar State
  const [radarItems, setRadarItems] = useState<TrackedRadarOpportunity[]>(() => {
    return OpportunityService.getRadarOpportunities();
  });

  // Filter & Search State
  const [activeCategory, setActiveCategory] = useState<'all' | OpportunityType | 'radar'>('all');
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [selectedSponsorship, setSelectedSponsorship] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'newest' | 'deadline' | 'popular' | 'trending'>('recommended');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Detail Modal State
  const [selectedOpportunity, setSelectedOpportunity] = useState<CareerOpportunity | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync state on custom events
  useEffect(() => {
    const handleOppsUpdated = () => {
      setOpportunities(OpportunityService.getAllOpportunities());
    };
    const handleRadarUpdated = () => {
      setRadarItems(OpportunityService.getRadarOpportunities());
    };

    window.addEventListener('career_opportunities_updated', handleOppsUpdated);
    window.addEventListener('career_radar_updated', handleRadarUpdated);

    return () => {
      window.removeEventListener('career_opportunities_updated', handleOppsUpdated);
      window.removeEventListener('career_radar_updated', handleRadarUpdated);
    };
  }, []);

  // Sync external search query
  useEffect(() => {
    if (externalSearchQuery) {
      setSearchQuery(externalSearchQuery);
    }
  }, [externalSearchQuery]);

  // Radar set for fast lookup
  const radarOpportunityIds = useMemo(() => {
    return new Set(radarItems.map(r => r.opportunityId));
  }, [radarItems]);

  // Toggle Radar action
  const handleToggleRadar = (opp: CareerOpportunity) => {
    if (radarOpportunityIds.has(opp.id)) {
      OpportunityService.removeOpportunityFromRadar(opp.id);
    } else {
      OpportunityService.addOpportunityToRadar(opp);
    }
  };

  // Upvote company signal action
  const handleToggleUpvote = (oppId: string) => {
    OpportunityService.toggleUpvote(oppId);
  };

  // Filter & Sort Logic
  const filteredOpportunities = useMemo(() => {
    let result = [...opportunities];

    // 1. Category Tab Filter
    if (activeCategory === 'radar') {
      const radarIds = new Set(radarItems.map(r => r.opportunityId));
      result = result.filter(o => radarIds.has(o.id));
    } else if (activeCategory !== 'all') {
      result = result.filter(o => o.type === activeCategory);
    }

    // 2. Search Query Filter
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(o => 
        o.title.toLowerCase().includes(q) ||
        o.organization.toLowerCase().includes(q) ||
        o.industry.toLowerCase().includes(q) ||
        o.shortDescription.toLowerCase().includes(q) ||
        o.tags.some(t => t.toLowerCase().includes(q)) ||
        o.skills.some(s => s.toLowerCase().includes(q))
      );
    }

    // 3. Industry Filter
    if (selectedIndustry !== 'all') {
      result = result.filter(o => o.industry.toLowerCase().includes(selectedIndustry.toLowerCase()));
    }

    // 4. Remote Filter
    if (remoteOnly) {
      result = result.filter(o => o.isRemote || o.location.toLowerCase().includes('remote'));
    }

    // 5. Sponsorship / Partner Filter
    if (selectedSponsorship !== 'all') {
      result = result.filter(o => o.commercial?.sponsorshipStatus === selectedSponsorship);
    }

    // 6. Sorting
    result.sort((a, b) => {
      if (sortBy === 'recommended') {
        return (b.matchScore || 80) - (a.matchScore || 80);
      }
      if (sortBy === 'popular') {
        const upvotesA = a.companySignal?.upvoteCount || 0;
        const upvotesB = b.companySignal?.upvoteCount || 0;
        return upvotesB - upvotesA;
      }
      if (sortBy === 'trending') {
        const trendA = a.companySignal?.trendingScore || a.matchScore || 0;
        const trendB = b.companySignal?.trendingScore || b.matchScore || 0;
        return trendB - trendA;
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
      }
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
    });

    return result;
  }, [
    opportunities, 
    radarItems, 
    activeCategory, 
    searchQuery, 
    selectedIndustry, 
    remoteOnly, 
    selectedSponsorship, 
    sortBy
  ]);

  // Related opportunities calculation for detail modal
  const relatedOpportunities = useMemo(() => {
    if (!selectedOpportunity) return [];
    return opportunities
      .filter(o => o.id !== selectedOpportunity.id && (o.type === selectedOpportunity.type || o.industry === selectedOpportunity.industry))
      .slice(0, 4);
  }, [selectedOpportunity, opportunities]);

  return (
    <div className="space-y-6">
      
      {/* 1. SECTION INTRO & ECOSYSTEM HIGHLIGHT */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Career Programs &amp; Signals
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-2xs text-slate-500 font-medium">Beyond Standard Job Postings</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Challenges, Venture Grants, Partner Benefits &amp; Company Signals
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Discover verified technical hackathons, venture grants, partner discounts, and community-ranked employer signals in one unified radar.
            </p>
          </div>
        </div>

        {/* Unified Category Tabs (Part 2 & Part 15: Single Navigation Section) */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Opportunities ({opportunities.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('challenge')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'challenge'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Challenges &amp; Hackathons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('venture')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'venture'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span>Venture &amp; Grants</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('promotion')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'promotion'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Promotions &amp; Deals</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('company_signal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'company_signal'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Company Signals &amp; Upvotes</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveCategory('radar')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeCategory === 'radar'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-blue-500" />
            <span>My Radar ({radarItems.length})</span>
          </button>
        </div>
      </div>

      {/* 2. FILTER & SEARCH CONTROL TOOLBAR */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hackathons, grants, partner deals, or companies..."
              className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters & Sorter */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer"
              >
                <option value="recommended">Sort: Recommended (Match %)</option>
                <option value="newest">Sort: Newest Added</option>
                <option value="deadline">Sort: Upcoming Deadline</option>
                <option value="popular">Sort: Most Upvoted</option>
                <option value="trending">Sort: Highest Trending</option>
              </select>
            </div>

            {/* Remote Only Toggle */}
            <button
              type="button"
              onClick={() => setRemoteOnly(prev => !prev)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                remoteOnly
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-3xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Remote Only
            </button>

            {/* Filter Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(prev => !prev)}
              className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showAdvancedFilters || selectedIndustry !== 'all' || selectedSponsorship !== 'all'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="More Filters"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

        </div>

        {/* Expandable Advanced Filters Row */}
        {showAdvancedFilters && (
          <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-in fade-in">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Target Industry / Domain</label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="all">All Industries &amp; Domains</option>
                <option value="AI">AI &amp; Machine Learning</option>
                <option value="Fintech">Fintech &amp; Payments</option>
                <option value="Developer Tools">Developer Tools &amp; Web</option>
                <option value="Cloud">Cloud &amp; Infrastructure</option>
                <option value="Design">Design Systems &amp; UX</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Commercial / Partner Placement</label>
              <select
                value={selectedSponsorship}
                onChange={(e) => setSelectedSponsorship(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
              >
                <option value="all">All Placements (Organic &amp; Partner)</option>
                <option value="partner">Verified Partner Programs</option>
                <option value="featured">Featured Opportunities</option>
                <option value="member_benefit">Member Benefits</option>
                <option value="sponsored">Sponsored Opportunities</option>
                <option value="organic">Organic Only</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedIndustry('all');
                  setSelectedSponsorship('all');
                  setRemoteOnly(false);
                  setSearchQuery('');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. OPPORTUNITIES CARDS GRID */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <Radar className="w-8 h-8 mx-auto text-slate-300 animate-pulse" />
          <h3 className="text-sm font-bold text-slate-800">No opportunities match your filter criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, switching categories, or clearing active industry filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveCategory('all');
              setSelectedIndustry('all');
              setSelectedSponsorship('all');
              setRemoteOnly(false);
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition cursor-pointer"
          >
            Show All Opportunities
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredOpportunities.map((opportunity) => {
            const isInRadar = radarOpportunityIds.has(opportunity.id);

            // Render Company Signal Card if type is company_signal
            if (opportunity.type === 'company_signal') {
              return (
                <CompanySignalCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  onSelect={(opp) => setSelectedOpportunity(opp)}
                  onToggleUpvote={handleToggleUpvote}
                  onToggleRadar={handleToggleRadar}
                  isInRadar={isInRadar}
                />
              );
            }

            // Standard Opportunity Card
            return (
              <OpportunityCard
                key={opportunity.id}
                opportunity={opportunity}
                onSelect={(opp) => setSelectedOpportunity(opp)}
                onToggleRadar={handleToggleRadar}
                isInRadar={isInRadar}
              />
            );
          })}
        </div>
      )}

      {/* 4. REUSABLE DETAIL MODAL */}
      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={Boolean(selectedOpportunity)}
        onClose={() => setSelectedOpportunity(null)}
        onToggleRadar={handleToggleRadar}
        isInRadar={selectedOpportunity ? radarOpportunityIds.has(selectedOpportunity.id) : false}
        onSelectRelated={(opp) => setSelectedOpportunity(opp)}
        relatedOpportunities={relatedOpportunities}
        onBuildMission={onBuildMission}
      />

      {/* 5. CREATE OPPORTUNITY MODAL */}
      <CreateOpportunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={(newOpp) => {
          setSelectedOpportunity(newOpp);
        }}
      />

    </div>
  );
};
