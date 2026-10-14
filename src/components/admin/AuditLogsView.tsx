import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Clock, 
  Lock, 
  KeyRound,
  FileText
} from 'lucide-react';
import { AuditLog, AuditAction, AuditResult } from '../../features/admin/types';

interface AuditLogsViewProps {
  logs: AuditLog[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResult, setSelectedResult] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorUsername.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.sourceId && log.sourceId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesResult = selectedResult === 'all' || log.result === selectedResult;
    const matchesAction = selectedAction === 'all' || log.action === selectedAction;

    return matchesSearch && matchesResult && matchesAction;
  });

  const getResultBadge = (result: AuditResult) => {
    switch (result) {
      case 'SUCCESS':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>SUCCESS</span>
          </span>
        );
      case 'DENIED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3 h-3 text-red-600" />
            <span>DENIED</span>
          </span>
        );
      case 'FLAGGED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>FLAGGED</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700">
            {result}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Security Governance Notice */}
      <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl border border-slate-800 flex items-start gap-3.5 shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-0.5 text-xs">
          <h4 className="font-bold text-white text-sm">Administrative Audit Trail & Access Governance</h4>
          <p className="text-slate-400 leading-relaxed">
            Every crawl dispatch, policy modification, duplicate merge, and ontology publication is recorded with actor metadata.
            In compliance with Career OS crawler security rules, passwords, session cookies, and API secret keys are strictly redacted from audit payloads.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search audit records by actor, action, or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={selectedResult}
            onChange={(e) => setSelectedResult(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Outcomes</option>
            <option value="SUCCESS">Success Only</option>
            <option value="DENIED">Denied / Unauthorized</option>
            <option value="FLAGGED">Flagged Events</option>
          </select>

          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Actions</option>
            <option value="RUN_CRAWL">RUN_CRAWL</option>
            <option value="UPDATE_SOURCE">UPDATE_SOURCE</option>
            <option value="PUBLISH_RESOURCE">PUBLISH_RESOURCE</option>
            <option value="APPROVE_RESOURCE">APPROVE_RESOURCE</option>
            <option value="REJECT_RESOURCE">REJECT_RESOURCE</option>
            <option value="VERIFY_ADMIN">VERIFY_ADMIN</option>
            <option value="MERGE_DUPLICATE">MERGE_DUPLICATE</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Timestamp & Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Outcome</th>
                <th className="py-3.5 px-4">Target Reference</th>
                <th className="py-3.5 px-6">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Timestamp & Actor */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>{log.actorUsername}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <code className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded font-mono text-[11px] font-bold">
                      {log.action}
                    </code>
                  </td>

                  {/* Outcome */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    {getResultBadge(log.result)}
                  </td>

                  {/* Target Reference */}
                  <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                    {log.sourceId || log.jobId || log.resourceId || '—'}
                  </td>

                  {/* Details */}
                  <td className="py-4 px-6 text-slate-700 leading-relaxed max-w-md">
                    <span className="line-clamp-2">{log.details}</span>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      IP: {log.ip}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No audit records found matching your filters.
          </div>
        )}
      </div>

    </div>
  );
};
