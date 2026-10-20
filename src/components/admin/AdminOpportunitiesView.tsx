import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Rocket, 
  Gift, 
  Building2, 
  Plus, 
  Trash2, 
  Edit3, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  Search, 
  RotateCcw,
  Tag,
  Check,
  Award,
  DollarSign
} from 'lucide-react';
import { CareerOpportunity, OpportunityType, OpportunitySponsorshipBadge } from '../../types';
import { OpportunityService } from '../../services/opportunityService';
import { CreateOpportunityModal } from '../opportunities/CreateOpportunityModal';
import { OpportunityDetailModal } from '../opportunities/OpportunityDetailModal';

export const AdminOpportunitiesView: React.FC = () => {
  const [opportunities, setOpportunities] = useState<CareerOpportunity[]>(() => {
    return OpportunityService.getAllOpportunities();
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | OpportunityType>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [inspectOpp, setInspectOpp] = useState<CareerOpportunity | null>(null);

  useEffect(() => {
    const handleUpdate = () => {
      setOpportunities(OpportunityService.getAllOpportunities());
    };
    window.addEventListener('career_opportunities_updated', handleUpdate);
    return () => window.removeEventListener('career_opportunities_updated', handleUpdate);
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this opportunity?')) {
      OpportunityService.deleteOpportunity(id);
    }
  };

  const handleToggleFeatured = (opp: CareerOpportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    const current = opp.commercial?.featuredStatus || false;
    OpportunityService.updateOpportunity(opp.id, {
      commercial: {
        ...(opp.commercial || {
          opportunityId: opp.id,
          monetizationType: 'organic',
          sponsorshipStatus: 'organic',
        }),
        featuredStatus: !current,
      }
    });
  };

  const handleToggleSponsorship = (opp: CareerOpportunity, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStatus = opp.commercial?.sponsorshipStatus || 'organic';
    const nextStatus: OpportunitySponsorshipBadge = 
      currentStatus === 'organic' ? 'partner' :
      currentStatus === 'partner' ? 'sponsored' :
      currentStatus === 'sponsored' ? 'member_benefit' : 'organic';

    OpportunityService.updateOpportunity(opp.id, {
      commercial: {
        ...(opp.commercial || {
          opportunityId: opp.id,
          monetizationType: 'partnership',
          sponsorshipStatus: 'organic',
        }),
        sponsorshipStatus: nextStatus,
      }
    });
  };

  const handleResetSampleData = () => {
    if (confirm('Reset to initial sample opportunities dataset?')) {
      OpportunityService.resetToDefaultOpportunities();
    }
  };

  const filtered = opportunities.filter(opp => {
    if (typeFilter !== 'all' && opp.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.industry.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5 animate-in fade-in">
      
      {/* Top Banner & Quick Stats */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Opportunity Layer Ops
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-2xs text-slate-500 font-medium">Commercial &amp; Partnership Management</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Ecosystem Opportunities &amp; Campaign Registry
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              Manage hackathons, grant allocations, member perks, affiliate deals, and employer signal rankings.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetSampleData}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reset to default seed opportunities"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sample Data</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Opportunity</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {(['all', 'challenge', 'venture', 'promotion', 'company_signal'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                  typeFilter === t
                    ? 'bg-indigo-600 text-white shadow-3xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t === 'all' ? 'All Opportunities' : t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title or partner..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Opportunities Registry Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-3.5 pl-5">Opportunity &amp; Host</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Deadline</th>
                <th className="p-3.5">Commercial Status</th>
                <th className="p-3.5">Monetization</th>
                <th className="p-3.5">Featured</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(opp => {
                const comm = opp.commercial;
                const isFeatured = comm?.featuredStatus;
                const status = comm?.sponsorshipStatus || 'organic';

                return (
                  <tr 
                    key={opp.id} 
                    onClick={() => setInspectOpp(opp)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-500 text-xs">
                          {opp.organizationLogo ? (
                            <img src={opp.organizationLogo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            opp.organization.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <div className="font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                            {opp.title}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {opp.organization} · {opp.industry}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className="capitalize font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {opp.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="p-3.5 font-medium text-slate-700 whitespace-nowrap">
                      {opp.deadline || 'Rolling'}
                    </td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSponsorship(opp, e)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          status === 'partner' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                          status === 'sponsored' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                          status === 'member_benefit' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                        title="Click to cycle sponsorship status"
                      >
                        {status.replace('_', ' ')}
                      </button>
                    </td>

                    <td className="p-3.5 text-slate-600 font-medium capitalize">
                      {comm?.monetizationType || 'organic'}
                    </td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={(e) => handleToggleFeatured(opp, e)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                          isFeatured 
                            ? 'bg-amber-500 text-white shadow-3xs' 
                            : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {isFeatured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectOpp(opp);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                          title="Inspect Opportunity"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDelete(opp.id, e)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      <CreateOpportunityModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Inspect Detail Modal */}
      <OpportunityDetailModal
        opportunity={inspectOpp}
        isOpen={Boolean(inspectOpp)}
        onClose={() => setInspectOpp(null)}
        onToggleRadar={() => {}}
        isInRadar={false}
      />

    </div>
  );
};
