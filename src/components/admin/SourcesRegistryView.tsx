import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Sliders, 
  Database,
  Building2,
  GraduationCap,
  Users,
  GitBranch,
  Eye,
  Power
} from 'lucide-react';
import { Source, SourceType } from '../../features/admin/types';

interface SourcesRegistryViewProps {
  sources: Source[];
  onSelectSource: (source: Source) => void;
  onRunCrawlPrompt: (source: Source) => void;
  onToggleEnable: (source: Source) => void;
  onAddNewSource: () => void;
}

export const SourcesRegistryView: React.FC<SourcesRegistryViewProps> = ({
  sources,
  onSelectSource,
  onRunCrawlPrompt,
  onToggleEnable,
  onAddNewSource
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'disabled'>('all');

  const domains = ['all', 'Consulting', 'Product Management', 'Engineering'];
  const types = ['all', 'official', 'university', 'community', 'github', 'aggregator'];

  const filteredSources = sources.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.baseUrl.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDomain = selectedDomain === 'all' || s.domain.toLowerCase() === selectedDomain.toLowerCase();
    const matchesType = selectedType === 'all' || s.sourceType === selectedType;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'enabled' && s.enabled) ||
      (statusFilter === 'disabled' && !s.enabled);

    return matchesSearch && matchesDomain && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: SourceType) => {
    switch (type) {
      case 'official': return <Building2 className="w-3.5 h-3.5 text-blue-600" />;
      case 'university': return <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />;
      case 'community': return <Users className="w-3.5 h-3.5 text-purple-600" />;
      case 'github': return <GitBranch className="w-3.5 h-3.5 text-slate-800" />;
      default: return <Database className="w-3.5 h-3.5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search sources by name, provider, or URL..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filters and Add button */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Domain Filter */}
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="Consulting">Consulting (Case Prep)</option>
            <option value="Product Management">Product Management</option>
            <option value="Engineering">Engineering & Arch</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="official">Official Firm Portals</option>
            <option value="university">MBA Casebooks / Univ</option>
            <option value="community">Community Guides</option>
            <option value="github">GitHub Repositories</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="enabled">Active / Enabled</option>
            <option value="disabled">Disabled</option>
          </select>

          <button
            onClick={onAddNewSource}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Source</span>
          </button>
        </div>
      </div>

      {/* Sources Table / Grid */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">Source Registry</h3>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              {filteredSources.length} registered
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Preconfigured case interview seeds require explicit administrator enablement
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Source & Provider</th>
                <th className="py-3.5 px-4">Domain & Type</th>
                <th className="py-3.5 px-4">Trust Score</th>
                <th className="py-3.5 px-4">Policy & Limits</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Crawl</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSources.map((source) => (
                <tr key={source.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Name & Provider */}
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <button 
                        onClick={() => onSelectSource(source)}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left flex items-center gap-1.5"
                      >
                        <span>{source.name}</span>
                      </button>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2">
                        <span>{source.provider}</span>
                        <span>•</span>
                        <span className="font-mono text-[10px] text-slate-400 max-w-[200px] truncate block">
                          {source.baseUrl.replace(/^https?:\/\//, '')}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Domain & Type */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold">
                        {source.domain}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] text-slate-600 capitalize">
                        {getTypeIcon(source.sourceType)}
                        <span>{source.sourceType}</span>
                      </div>
                    </div>
                  </td>

                  {/* Trust Score */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{source.trustScore}</span>
                        <span className="text-[10px] text-slate-400">/ 100</span>
                      </div>
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full" 
                          style={{ width: `${source.trustScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* Policy & Limits */}
                  <td className="py-4 px-4">
                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>{source.requestsPerMinute} req/min • Max {source.maxPages} pgs</div>
                      <div className="text-[10px] text-slate-400">
                        {source.respectRobots ? 'Robots.txt enforced' : 'Robots ignored'}
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => onToggleEnable(source)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                        source.enabled 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                      }`}
                      title={source.enabled ? 'Click to disable' : 'Click to enable'}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${source.enabled ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      <span>{source.enabled ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>

                  {/* Last Crawl */}
                  <td className="py-4 px-4 text-[11px] text-slate-500">
                    {source.lastCrawledAt ? (
                      <div>{new Date(source.lastCrawledAt).toLocaleDateString()}</div>
                    ) : (
                      <span className="text-slate-400 italic">Never</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectSource(source)}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="View Source Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onRunCrawlPrompt(source)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                        title="Run Crawl Job"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Crawl</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSources.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No sources found matching your search and filter criteria.
          </div>
        )}
      </div>

    </div>
  );
};
