import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Send, 
  Eye, 
  Search, 
  Filter, 
  ExternalLink,
  Award,
  GitMerge,
  Sparkles
} from 'lucide-react';
import { ExtractedResource, ImportStatus } from '../../features/admin/types';
import { ImportReviewModal } from './ImportReviewModal';

interface ImportQueueViewProps {
  queue: ExtractedResource[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onMerge: (id: string, targetId: string) => void;
  onPublish: (id: string) => void;
}

export const ImportQueueView: React.FC<ImportQueueViewProps> = ({
  queue,
  onApprove,
  onReject,
  onMerge,
  onPublish
}) => {
  const [activeStatusTab, setActiveStatusTab] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResource, setSelectedResource] = useState<ExtractedResource | null>(null);

  const statusTabs = [
    { id: 'all', label: 'All Items', count: queue.length },
    { id: 'new', label: 'Awaiting Review', count: queue.filter(q => q.status === 'new').length },
    { id: 'duplicate_candidate', label: 'Duplicate Candidates', count: queue.filter(q => q.status === 'duplicate_candidate').length },
    { id: 'approved', label: 'Approved', count: queue.filter(q => q.status === 'approved').length },
    { id: 'published', label: 'Published', count: queue.filter(q => q.status === 'published').length },
    { id: 'rejected', label: 'Rejected', count: queue.filter(q => q.status === 'rejected').length },
  ];

  const filteredItems = queue.filter(item => {
    const matchesStatus = activeStatusTab === 'all' || item.status === activeStatusTab;
    const matchesDomain = selectedDomain === 'all' || item.domain.toLowerCase() === selectedDomain.toLowerCase();
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sourceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDomain && matchesSearch;
  });

  const getStatusBadge = (status: ImportStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">New / Review</span>;
      case 'duplicate_candidate':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Duplicate Candidate</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'published':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Published to OS</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search staged resources by title, prompt, or source..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Domains</option>
            <option value="Consulting">Consulting Cases</option>
            <option value="Product Management">Product Management</option>
            <option value="Engineering">Engineering</option>
          </select>
        </div>
      </div>

      {/* Subnav Pills for Status Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-200/80">
        {statusTabs.map(tab => {
          const isActive = activeStatusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStatusTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/70'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 text-[10px] rounded-full font-bold ${
                isActive ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Resource Title & Source</th>
                <th className="py-3.5 px-4">Type & Domain</th>
                <th className="py-3.5 px-4">Quality & Confidence</th>
                <th className="py-3.5 px-4">Case Calibration</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-6 text-right">Review & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Title & Source */}
                  <td className="py-4 px-6 max-w-sm">
                    <div className="space-y-1">
                      <button
                        onClick={() => setSelectedResource(item)}
                        className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left line-clamp-1 cursor-pointer"
                      >
                        {item.title}
                      </button>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-700">{item.sourceName}</span>
                        <span>•</span>
                        <span>{new Date(item.crawledAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </td>

                  {/* Type & Domain */}
                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-bold">
                        {item.domain}
                      </span>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                        {item.resourceType.replace('_', ' ')}
                      </div>
                    </div>
                  </td>

                  {/* Quality & Confidence */}
                  <td className="py-4 px-4 font-mono text-[11px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="text-slate-500 font-medium">Score:</span>
                        <span className="font-bold text-blue-600">{item.qualityScore}/100</span>
                      </div>
                      <div className="flex items-center gap-1.5 font-sans">
                        <span className="text-slate-400 font-medium">Confidence:</span>
                        <span className="font-semibold text-emerald-600">{item.extractionConfidence}%</span>
                      </div>
                    </div>
                  </td>

                  {/* Case Calibration */}
                  <td className="py-4 px-4">
                    {item.caseData ? (
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-purple-50 text-purple-700 font-bold text-[10px] rounded">
                          {item.caseData.caseType}
                        </span>
                        <div className="text-[10px] text-slate-500 font-semibold">
                          {item.caseData.difficultyLevel} ({item.caseData.difficultyScore})
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">General Resource</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {getStatusBadge(item.status)}
                    {item.similarityScore && (
                      <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
                        {Math.round(item.similarityScore * 100)}% match
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedResource(item)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review</span>
                      </button>

                      {item.status !== 'published' && (
                        <button
                          onClick={() => onPublish(item.id)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1"
                          title="Publish to Career OS Knowledge Base"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publish</span>
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No resources in this filter. Run a crawl job from the Sources Registry to ingest fresh records.
          </div>
        )}
      </div>

      {/* Deep Inspection & Review Modal */}
      <ImportReviewModal
        item={selectedResource}
        isOpen={Boolean(selectedResource)}
        onClose={() => setSelectedResource(null)}
        onApprove={onApprove}
        onReject={onReject}
        onMerge={onMerge}
        onPublish={onPublish}
      />

    </div>
  );
};
