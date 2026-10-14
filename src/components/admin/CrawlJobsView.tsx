import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCw, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Loader2, 
  Layers, 
  Plus, 
  X, 
  Sliders
} from 'lucide-react';
import { CrawlJob, Source, CrawlMode, CrawlJobStatus } from '../../features/admin/types';

interface CrawlJobsViewProps {
  jobs: CrawlJob[];
  sources: Source[];
  onTriggerJob: (sourceId: string, mode: CrawlMode) => void;
  onPauseJob: (jobId: string) => void;
  onCancelJob: (jobId: string) => void;
}

export const CrawlJobsView: React.FC<CrawlJobsViewProps> = ({
  jobs,
  sources,
  onTriggerJob,
  onPauseJob,
  onCancelJob
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isNewJobModalOpen, setIsNewJobModalOpen] = useState(false);
  const [selectedSourceId, setSelectedSourceId] = useState<string>(sources[0]?.id || '');
  const [selectedMode, setSelectedMode] = useState<CrawlMode>('discover');
  const [activeLogJob, setActiveLogJob] = useState<CrawlJob | null>(null);

  const filteredJobs = jobs.filter(j => {
    if (selectedStatus === 'all') return true;
    return j.status === selectedStatus;
  });

  const getStatusBadge = (status: CrawlJobStatus) => {
    switch (status) {
      case 'running':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
            <span>Running</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Completed</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>Failed</span>
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Pause className="w-3 h-3 text-amber-600" />
            <span>Paused</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            <Square className="w-3 h-3 text-slate-500" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            <Clock className="w-3 h-3" />
            <span>Queued</span>
          </span>
        );
    }
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSourceId) return;
    setIsNewJobModalOpen(false);
    onTriggerJob(selectedSourceId, selectedMode);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Launch Control */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="space-y-0.5">
          <h3 className="text-sm font-bold text-slate-900">Crawl Jobs Queue & Runner</h3>
          <p className="text-xs text-slate-500">
            Bounded asynchronous crawling with robots.txt enforcement, rate limits, and SSRF shields.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="all">All Jobs ({jobs.length})</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            onClick={() => setIsNewJobModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Crawl Job</span>
          </button>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">Job ID & Source</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Status & Progress</th>
                <th className="py-3.5 px-4">Discovered / Fetched</th>
                <th className="py-3.5 px-4">Extracted</th>
                <th className="py-3.5 px-4">Requested By</th>
                <th className="py-3.5 px-6 text-right">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                  
                  {/* Job ID & Source */}
                  <td className="py-4 px-6">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <span>{job.sourceName}</span>
                        <code className="font-mono text-[10px] text-slate-400 font-normal">
                          {job.id}
                        </code>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Started: {new Date(job.startedAt).toLocaleTimeString()}</span>
                        {job.completedAt && (
                          <span>• Done in {Math.max(1, Math.round((new Date(job.completedAt).getTime() - new Date(job.startedAt).getTime()) / 1000))}s</span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Mode */}
                  <td className="py-4 px-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                      job.mode === 'full_sync' 
                        ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                        : job.mode === 'update'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {job.mode}
                    </span>
                  </td>

                  {/* Status & Progress */}
                  <td className="py-4 px-4 min-w-[200px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(job.status)}
                        <span className="font-mono text-[11px] font-bold text-slate-700">
                          {job.progress}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            job.status === 'failed' ? 'bg-red-500' :
                            job.status === 'completed' ? 'bg-emerald-500' :
                            job.status === 'paused' ? 'bg-amber-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>

                      {job.currentAction && (
                        <p className="text-[10px] text-slate-500 truncate max-w-[220px]">
                          {job.currentAction}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Discovered / Fetched */}
                  <td className="py-4 px-4 text-[11px] text-slate-700 font-mono">
                    <div>{job.pagesFetched} / {job.pagesDiscovered} pages</div>
                    {job.errorsCount > 0 && (
                      <span className="text-red-600 text-[10px] font-bold">
                        {job.errorsCount} error{job.errorsCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </td>

                  {/* Extracted */}
                  <td className="py-4 px-4 font-mono text-[11px]">
                    <span className="font-bold text-blue-600">{job.recordsExtracted}</span>
                    <span className="text-slate-400 ml-1">records</span>
                  </td>

                  {/* Requested By */}
                  <td className="py-4 px-4 text-[11px] text-slate-600">
                    {job.requestedBy}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {job.status === 'running' && (
                        <>
                          <button
                            onClick={() => onPauseJob(job.id)}
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer"
                            title="Pause Job"
                          >
                            <Pause className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onCancelJob(job.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Cancel Job"
                          >
                            <Square className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {job.errorLogs.length > 0 && (
                        <button
                          onClick={() => setActiveLogJob(job)}
                          className="px-2 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          View Logs
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredJobs.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-xs">
            No crawl jobs in this view. Click "Launch Crawl Job" above to begin ingestion.
          </div>
        )}
      </div>

      {/* New Job Launch Modal */}
      {isNewJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">Launch New Crawl Job</h3>
              <button onClick={() => setIsNewJobModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Source</label>
                <select
                  value={selectedSourceId}
                  onChange={(e) => setSelectedSourceId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  required
                >
                  {sources.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.provider}) {s.enabled ? '✓ Enabled' : '⚠ Disabled'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400 mt-1">
                  Target host must match the registered source allowlist.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Crawl Execution Mode</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['discover', 'update', 'full_sync'] as CrawlMode[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setSelectedMode(mode)}
                      className={`p-3 rounded-xl border text-center font-bold capitalize transition-all cursor-pointer ${
                        selectedMode === mode
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{mode.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  {selectedMode === 'discover' && 'Discover: Fetches top pages to sample newly published interview curriculum.'}
                  {selectedMode === 'update' && 'Update: Checks existing known URLs for revisions and changes.'}
                  {selectedMode === 'full_sync' && 'Full Sync: Deep walk of all allowed paths. Elevates audit logging.'}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsNewJobModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Start Crawl</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Error Logs Modal */}
      {activeLogJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Job Diagnostics & Error Log</h3>
              <button onClick={() => setActiveLogJob(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-2 font-mono text-[11px] bg-slate-950 text-slate-200">
              {activeLogJob.errorLogs.map((log, idx) => (
                <div key={idx} className="p-2 bg-red-950/40 border border-red-900/50 rounded text-red-300">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
