import React from 'react';
import { 
  X, 
  HelpCircle, 
  Compass, 
  User, 
  BookOpen, 
  Radio, 
  Kanban, 
  Pin, 
  Bot, 
  Sliders,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface PlatformHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PlatformHelpModal: React.FC<PlatformHelpModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Career OS — Navigation & Architecture Guide
              </h2>
              <p className="text-xs text-slate-500">
                A quick tour of your AI-powered career operating system
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tour Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          
          {/* Section 1: Two Levels */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-blue-950 text-sm">
                Two-Level Architecture
              </h3>
            </div>
            <p className="leading-relaxed text-slate-600">
              Career OS is split into two distinct tiers: **Level 1 (User Career OS)** for your everyday job preparation and tracking, and **Level 2 (Platform Admin)** for intelligence registries, trigger rules, and system data.
            </p>
          </div>

          {/* Section 2: Level 1 Primary Navigation */}
          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-slate-900 text-[11px]">
              Level 1 — Primary User Functions
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Compass className="w-3.5 h-3.5 text-blue-600" />
                  <span>Discovery</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Search tier-1 job openings with deep company engineering profiles.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>My Profile (Prepare + Profile)</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Unified identity, Skill Evidence Graph, Target Preferences, Checklist, and Knowledge Layers.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                  <span>Knowledge System</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Auditable repository of books, credentials, deliverables, and validated skill points.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                  <Kanban className="w-3.5 h-3.5 text-purple-600" />
                  <span>Application Tracker</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Manage interview pipelines, active take-home cases, and simulation history.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Practice Action Group */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Radio className="w-4 h-4 text-blue-600" />
              <span>Practice Action Group</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Located in the dashboard header: **Live Interview** (Primary action for real-time voice & rubric evaluation), plus secondary actions **Mock Interview** and **Biz English Session**.
            </p>
          </div>

          {/* Section 4: Left Workspace Column */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Pin className="w-4 h-4 text-amber-600" />
              <span>Your Pins & Persistent AI Chat</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The persistent left column keeps your active tasks, notes, and grounded AI assistant always within reach. It automatically minimizes during live interview simulation so you stay focused.
            </p>
          </div>

          {/* Section 5: Platform Admin */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-slate-900 text-white">
            <div className="flex items-center gap-2 font-bold text-indigo-400">
              <Sliders className="w-4 h-4" />
              <span>Platform Admin (Top Corner Icon)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Click the top-right Platform Admin icon to inspect the System Registries, the Career Intelligence Engine, or the L0–L4 Autonomous Trigger Engine.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors cursor-pointer text-xs"
          >
            Got it, continue to Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
