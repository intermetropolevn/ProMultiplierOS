import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  ArrowRight, 
  Clock, 
  Bookmark, 
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { MockInterviewSession } from '../../types';

interface InterviewReportCardProps {
  session: MockInterviewSession;
  onRetake: () => void;
  onGoToTracker: () => void;
  onGoToDiscover: () => void;
  onGetFeedback?: (sessionData: { title: string; content: string; capability: string; score: number }) => void;
}

export const InterviewReportCard: React.FC<InterviewReportCardProps> = ({
  session,
  onRetake,
  onGoToTracker,
  onGoToDiscover,
  onGetFeedback,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyReport = () => {
    let report = `CAREER INTERVIEW OS - MOCK SESSION REPORT\n`;
    report += `==========================================\n`;
    report += `Role: ${session.config.roleCategory} (${session.config.level})\n`;
    report += `Domain: ${session.config.domain}\n`;
    report += `Overall Calibration Score: ${session.overallScore} / 100\n`;
    report += `Status: ${session.readinessSummary}\n\n`;

    session.responses.forEach((resp, idx) => {
      report += `[Q${idx + 1}] ${resp.question.question}\n`;
      report += `Score: ${resp.evaluation?.score || 'N/A'}/100 (${resp.evaluation?.ratingTier || 'Evaluated'})\n`;
      report += `Candidate Answer:\n${resp.candidateAnswer || '(No response provided)'}\n\n`;
      if (resp.evaluation) {
        report += `Strengths:\n- ${resp.evaluation.strengths.join('\n- ')}\n`;
        report += `Areas to Polish:\n- ${resp.evaluation.improvementAreas.join('\n- ')}\n`;
      }
      report += `------------------------------------------\n`;
    });

    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getTierColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 72) return 'text-blue-700 bg-blue-50 border-blue-200';
    if (score >= 55) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* Celebration & Overall Score Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Mock Interview Evaluated
              </span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Duration: {formatDuration(session.totalDurationSeconds)}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Executive Evaluation Report
            </h2>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Calibrated for <strong className="text-slate-900">{session.config.level} {session.config.roleCategory}</strong> in <strong className="text-slate-900">{session.config.domain}</strong>.
            </p>
          </div>

          {/* Big Score Dial */}
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-3xl sm:text-4xl font-black text-blue-600">
                {session.overallScore}
                <span className="text-sm text-slate-400 font-normal">/100</span>
              </div>
              <div className={`mt-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${getTierColor(session.overallScore)}`}>
                {session.overallScore >= 85 ? 'Exceptional' : session.overallScore >= 72 ? 'Strong' : session.overallScore >= 55 ? 'Competent' : 'Needs Polish'}
              </div>
            </div>
          </div>
        </div>

        {/* Readiness Summary */}
        <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900">
              Calibration Readiness Assessment
            </h4>
            <p className="text-sm text-blue-950 font-medium mt-0.5 leading-relaxed">
              {session.readinessSummary}
            </p>
          </div>
        </div>

        {/* Expert Feedback Callout (Requirement 2) */}
        {onGetFeedback && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/30 shadow-md">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Practitioner Feedback Available
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                Your work is ready for review.
              </div>
              <p className="text-2xs text-blue-200">
                Get an experienced practitioner or domain reviewer to evaluate your strategic trade-offs before saving to evidence.
              </p>
            </div>

            <button
              type="button"
              id="btn-report-get-feedback"
              onClick={() => {
                const firstResp = session.responses[0];
                onGetFeedback({
                  title: `Practice Interview: ${session.config.roleCategory} (${session.config.level})`,
                  content: firstResp ? `[Question]: ${firstResp.question.question}\n\n[Candidate Answer]:\n${firstResp.candidateAnswer}` : 'Practice interview session output',
                  capability: session.config.interviewType || 'Product Strategy',
                  score: session.overallScore
                });
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-slate-900" />
              <span>Get Feedback</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              id="copy-report-btn"
              onClick={handleCopyReport}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
              <span>{copied ? 'Report Copied to Clipboard!' : 'Copy Summary Report'}</span>
            </button>

            <button
              id="retake-interview-btn"
              onClick={onRetake}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Practice Again</span>
            </button>
          </div>

          <button
            id="report-tracker-btn"
            onClick={onGoToTracker}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
          >
            <span>View in Tracker & Analytics</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Per-Question Breakdown */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-slate-900 px-1">
          Question-by-Question Deep Analysis ({session.responses.length} Prompts)
        </h3>

        {session.responses.map((resp, idx) => {
          const ev = resp.evaluation;
          return (
            <div
              key={resp.questionId}
              className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 shadow-2xs"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Question {idx + 1} • {resp.question.type}
                  </span>
                  <h4 className="text-base font-bold text-slate-900">
                    {resp.question.question}
                  </h4>
                </div>
                {ev && (
                  <div className="text-right shrink-0">
                    <span className="text-xl font-extrabold text-blue-600">{ev.score}/100</span>
                    <div className="text-[10px] font-bold uppercase text-slate-500">{ev.ratingTier}</div>
                  </div>
                )}
              </div>

              {/* Candidate's Answer */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Your Answer:
                </span>
                <p className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 leading-relaxed whitespace-pre-wrap font-sans">
                  {resp.candidateAnswer || '(No response was recorded for this question)'}
                </p>
              </div>

              {/* Strengths & Improvements */}
              {ev && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">Demonstrated Strengths</span>
                    <ul className="space-y-1">
                      {ev.strengths.map((s, i) => (
                        <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">Recommended Polish</span>
                    <ul className="space-y-1">
                      {ev.improvementAreas.map((a, i) => (
                        <li key={i} className="text-xs text-amber-950 flex items-start gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Exemplary Benchmark Answer */}
              <div className="p-3.5 rounded-xl bg-blue-50/30 border border-blue-100 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-blue-600" />
                  Benchmark Model Answer for Comparison
                </div>
                <p className="text-xs text-slate-700 italic leading-relaxed">
                  &ldquo;{resp.question.exemplaryModelAnswer}&rdquo;
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
