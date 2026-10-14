import React, { useState } from 'react';
import { X, Video, Calendar, Clock, User, Link2, Sparkles, Building2 } from 'lucide-react';
import { JobApplication, InterviewRoundType } from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';

interface ScheduleInterviewModalProps {
  applications: JobApplication[];
  preselectedAppId?: string;
  isOpen: boolean;
  onClose: () => void;
  onInterviewScheduled: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  applications,
  preselectedAppId,
  isOpen,
  onClose,
  onInterviewScheduled
}) => {
  const [targetAppId, setTargetAppId] = useState<string>(
    preselectedAppId || applications[0]?.id || ''
  );
  const [roundTitle, setRoundTitle] = useState('');
  const [roundType, setRoundType] = useState<InterviewRoundType>('TECHNICAL');
  const [scheduledAt, setScheduledAt] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [interviewerName, setInterviewerName] = useState('');
  const [interviewerRole, setInterviewerRole] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [prepNotes, setPrepNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAppId || !roundTitle.trim() || !scheduledAt) return;

    applicationStore.addInterview(targetAppId, {
      title: roundTitle.trim(),
      type: roundType,
      scheduledAt: new Date(scheduledAt).toISOString(),
      durationMinutes,
      interviewer: interviewerName.trim() || undefined,
      interviewerRole: interviewerRole.trim() || undefined,
      locationOrUrl: meetingUrl.trim() || undefined,
      notes: prepNotes.trim() || undefined,
      status: 'SCHEDULED'
    });

    onInterviewScheduled();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Schedule Interview Round
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Log upcoming live rounds, panel sessions, and calendar commitments.
              </p>
            </div>
          </div>

          <button
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
              className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500 transition-colors"
            >
              {applications.map(a => (
                <option key={a.id} value={a.id}>
                  {a.companyName} — {a.roleTitle}
                </option>
              ))}
            </select>
          </div>

          {/* Round Title & Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Round Title *
              </label>
              <input
                type="text"
                required
                value={roundTitle}
                onChange={(e) => setRoundTitle(e.target.value)}
                placeholder="e.g., VP of Product Loop"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Interview Type
              </label>
              <select
                value={roundType}
                onChange={(e) => setRoundType(e.target.value as InterviewRoundType)}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
              >
                <option value="SCREENING">Recruiter Screen</option>
                <option value="TECHNICAL">Technical Deep Dive</option>
                <option value="BEHAVIORAL">Behavioral / Leadership</option>
                <option value="PANEL">Panel / Cross-Functional</option>
                <option value="CASE_PRESENTATION">Case Presentation</option>
                <option value="FINAL">Executive / Final Round</option>
                <option value="HIRING_MANAGER">Hiring Manager Chat</option>
              </select>
            </div>
          </div>

          {/* Date / Time & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Date &amp; Time *
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Duration (Minutes)
              </label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
              >
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>2 hours (Panel)</option>
              </select>
            </div>
          </div>

          {/* Interviewer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Interviewer Name
              </label>
              <input
                type="text"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                placeholder="e.g., Sarah Chen"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Interviewer Title
              </label>
              <input
                type="text"
                value={interviewerRole}
                onChange={(e) => setInterviewerRole(e.target.value)}
                placeholder="e.g., VP of Product"
                className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          {/* Video Meeting Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Meeting URL / Link (Google Meet, Zoom, Teams)
            </label>
            <input
              type="url"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
              placeholder="https://meet.google.com/..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500"
            />
          </div>

          {/* Preparation Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Focus Areas &amp; Prep Notes
            </label>
            <textarea
              rows={2}
              value={prepNotes}
              onChange={(e) => setPrepNotes(e.target.value)}
              placeholder="Key questions to expect, frameworks to highlight, case references..."
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:bg-white focus:border-blue-500 resize-none"
            />
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
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
            >
              <span>Schedule Interview Round</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
