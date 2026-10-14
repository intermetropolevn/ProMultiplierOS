import React, { useState } from 'react';
import { X, FileText, Calendar, Clock, Link2, Sparkles, Building2, AlertCircle } from 'lucide-react';
import { JobApplication, AssessmentType } from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';

interface AddTestAssignmentModalProps {
  applications: JobApplication[];
  preselectedAppId?: string;
  isOpen: boolean;
  onClose: () => void;
  onAssignmentCreated: () => void;
}

export const AddTestAssignmentModal: React.FC<AddTestAssignmentModalProps> = ({
  applications,
  preselectedAppId,
  isOpen,
  onClose,
  onAssignmentCreated
}) => {
  const [targetAppId, setTargetAppId] = useState<string>(
    preselectedAppId || applications[0]?.id || ''
  );
  const [title, setTitle] = useState('');
  const [type, setType] = useState<AssessmentType>('TAKE_HOME_CASE');
  // Default deadline to 5 days from today at 18:00
  const [deadline, setDeadline] = useState(() => {
    const d = new Date(Date.now() + 5 * 86400000);
    d.setHours(18, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [estimatedEffort, setEstimatedEffort] = useState('6-8 hours');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedAppId = targetAppId || applications[0]?.id;
    if (!resolvedAppId || !title.trim()) return;

    applicationStore.createTestAssignment({
      applicationId: resolvedAppId,
      title: title.trim(),
      type,
      description: description.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : undefined,
      estimatedEffort: estimatedEffort.trim() || undefined,
      submissionUrl: submissionUrl.trim() || undefined,
      status: 'PREPARING'
    });

    onAssignmentCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-purple-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Log Test Assignment / Case Challenge
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Track prompt requirements, submission deadline countdown, and deliverables.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Target Application Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Target Job Application *
            </label>
            <select
              value={targetAppId}
              onChange={(e) => setTargetAppId(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500 transition-colors"
            >
              {applications.map(a => (
                <option key={a.id} value={a.id}>
                  {a.companyName} — {a.roleTitle} ({a.pipelineState?.replace(/_/g, ' ') || a.status})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Assignment / Challenge Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Southeast Asia Market Expansion Strategy Case"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500 transition-colors"
            />
          </div>

          {/* Assessment Type & Estimated Effort */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AssessmentType)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500"
              >
                <option value="TAKE_HOME_CASE">Take-Home Case</option>
                <option value="BUSINESS_CASE">Business / Strategy Case</option>
                <option value="TECHNICAL_TEST">Technical Test / Coding</option>
                <option value="DESIGN_CHALLENGE">Design Challenge</option>
                <option value="PRESENTATION">Executive Presentation</option>
                <option value="WRITTEN_ASSIGNMENT">Written Assignment</option>
                <option value="PORTFOLIO_REVIEW">Portfolio Review</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Estimated Effort
              </label>
              <input
                type="text"
                value={estimatedEffort}
                onChange={(e) => setEstimatedEffort(e.target.value)}
                placeholder="e.g., 6-8 hours"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500"
              />
            </div>
          </div>

          {/* Deadline Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
              <span>Submission Deadline *</span>
              <span className="text-[10px] text-purple-700 font-semibold">Powers urgent countdown</span>
            </label>
            <input
              type="datetime-local"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500"
            />
          </div>

          {/* Submission URL / Portal */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Submission Link / Portal URL (Optional)
            </label>
            <input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://company.greenhouse.io/tests/... or Google Drive"
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500"
            />
          </div>

          {/* Description / Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Instructions / Prompt Brief
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste company prompt, key questions, deliverables, and scoring rubric..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-purple-500 resize-none"
            />
          </div>

          {/* Notice */}
          <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200/70 flex items-start gap-2.5 text-xs text-purple-900">
            <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Adding this assignment advances the application to <strong>Assessment &amp; Case</strong> and automatically schedules it in your Upcoming Deadlines timeline.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Create Test Assignment</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
