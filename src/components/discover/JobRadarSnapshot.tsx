import React, { useMemo } from 'react';
import { JobListing, UserCareerProfile } from '../../types';
import { JobRelevanceEngine, JobRelevanceReport } from '../../features/jobs/services/jobRelevanceEngine';
import { resolveJobSource } from '../../data/jobTaxonomies';
import { 
  Radar, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  Globe, 
  Play
} from 'lucide-react';

interface JobRadarSnapshotProps {
  jobs: JobListing[];
  profile: UserCareerProfile;
  isJobSaved: (jobId: string) => boolean;
  onToggleSaveJob: (job: JobListing) => void;
  onSelectJob: (job: JobListing) => void;
  onInspectEvidenceMatch: (job: JobListing) => void;
  onStartPracticeForJob: (job: JobListing) => void;
}

export const JobRadarSnapshot: React.FC<JobRadarSnapshotProps> = ({
  jobs,
  profile,
  isJobSaved,
  onToggleSaveJob,
  onSelectJob,
  onInspectEvidenceMatch,
  onStartPracticeForJob,
}) => {
  // Compute Top Matches via JobRelevanceEngine
  const topMatches = useMemo(() => {
    return JobRelevanceEngine.rankTopMatches(jobs, profile, 3);
  }, [jobs, profile]);

  if (topMatches.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-800 space-y-5">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 shrink-0">
            <Radar className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                Job Radar & Top Match Snapshot
              </h2>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30">
                AI Evaluated
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Calibrated against your profile: <span className="font-semibold text-slate-200">{profile.targetRole}</span> • <span className="font-semibold text-slate-200">{profile.targetDomain}</span> • <span className="font-semibold text-slate-200">{profile.targetLevel}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time Opportunity Fit</span>
        </div>
      </div>

      {/* Top Match Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topMatches.map(({ job, report }) => {
          const saved = isJobSaved(job.id);
          const sourceInfo = resolveJobSource(job.externalUrl, job.jobSource || job.externalPlatform, job.company);

          return (
            <div
              key={job.id}
              className="bg-slate-800/60 hover:bg-slate-800/90 rounded-2xl p-4 border border-slate-700/60 hover:border-blue-400/50 transition-all flex flex-col justify-between group text-left"
            >
              <div className="space-y-3">
                {/* Top Row: Score Badge + Save Toggle */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {report.relevanceScore}% Match
                    </span>
                    <span className="text-[11px] font-bold text-slate-300">
                      {report.ratingTier}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleSaveJob(job);
                    }}
                    className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                      saved
                        ? 'bg-blue-600 text-white border-blue-500 shadow-xs'
                        : 'bg-slate-700/50 text-slate-400 hover:text-white border-slate-600/60 hover:bg-slate-700'
                    }`}
                    title={saved ? 'Remove from Saved' : 'Save Job'}
                    aria-label={saved ? 'Remove from Saved' : 'Save Job'}
                  >
                    {saved ? (
                      <BookmarkCheck className="w-4 h-4 fill-white" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Job Title & Company */}
                <div>
                  <h4 
                    onClick={() => onSelectJob(job)}
                    className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors cursor-pointer line-clamp-1"
                    title={job.title}
                  >
                    {job.title}
                  </h4>
                  <div className="text-xs font-medium text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <span className="text-slate-300 font-semibold">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      {job.location.toLowerCase().includes('global') ? (
                        <Globe className="w-3 h-3 text-blue-400" />
                      ) : (
                        <MapPin className="w-3 h-3 text-slate-500" />
                      )}
                      <span className="truncate max-w-[120px]">{job.location}</span>
                    </span>
                  </div>
                </div>

                {/* Structured Match Reason Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {report.matchReasons.map((reason, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/40"
                    >
                      {reason}
                    </span>
                  ))}
                </div>

                {/* Deadline indicator if available */}
                {report.deadlineInfo.status !== 'none' && (
                  <div className="flex items-center gap-1.5 text-[11px] pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className={
                      report.deadlineInfo.status === 'approaching'
                        ? 'text-amber-300 font-bold'
                        : report.deadlineInfo.status === 'passed'
                        ? 'text-rose-400 font-semibold'
                        : 'text-slate-400'
                    }>
                      {report.deadlineInfo.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Actions Row */}
              <div className="pt-4 mt-3 border-t border-slate-700/60 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onInspectEvidenceMatch(job)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/50 transition-all flex items-center gap-1 cursor-pointer"
                  title="Validate candidate career evidence vs requirements"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span>Inspect Fit</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onStartPracticeForJob(job)}
                    className="p-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all cursor-pointer"
                    title="Launch Mock Interview for this Job"
                    aria-label="Launch Mock Interview"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </button>

                  <a
                    href={job.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-700/80 hover:bg-slate-600 text-white transition-all flex items-center gap-1 cursor-pointer"
                    title={`Open on ${sourceInfo.sourceName}`}
                  >
                    <span>{sourceInfo.sourceName}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
