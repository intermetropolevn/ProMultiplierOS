import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Search, 
  Filter, 
  ShieldCheck, 
  UserCheck, 
  Clock, 
  Award, 
  Briefcase, 
  ArrowRight, 
  Star,
  CheckCircle2,
  Building2,
  MapPin,
  Cpu,
  Hammer
} from 'lucide-react';
import { ExpertProfile, ExpertMode } from '../../types/expertFeedback';
import { ExpertFeedbackService } from '../../services/expertFeedbackService';

interface ExpertNetworkDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestFeedbackForExpert: (expert: ExpertProfile) => void;
}

const MODES: { key: ExpertMode | 'all'; label: string }[] = [
  { key: 'all', label: 'All Modes' },
  { key: 'reviewer', label: 'Reviewer' },
  { key: 'practitioner', label: 'Practitioner' },
  { key: 'mentor', label: 'Mentor' },
  { key: 'coach', label: 'Coach' },
  { key: 'advisor', label: 'Advisor' },
  { key: 'specialist', label: 'Specialist' },
  { key: 'builder', label: 'Builder' },
];

export const ExpertNetworkDirectoryModal: React.FC<ExpertNetworkDirectoryModalProps> = ({
  isOpen,
  onClose,
  onRequestFeedbackForExpert
}) => {
  const [experts] = useState<ExpertProfile[]>(() => ExpertFeedbackService.getAllExperts());
  const [selectedMode, setSelectedMode] = useState<ExpertMode | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredExperts = experts.filter(exp => {
    if (selectedMode !== 'all' && !exp.modes.includes(selectedMode)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = exp.name.toLowerCase().includes(q);
      const matchRole = exp.role.toLowerCase().includes(q);
      const matchCompany = exp.company.toLowerCase().includes(q);
      const matchSkill = exp.skills.some(s => s.toLowerCase().includes(q));
      if (!matchName && !matchRole && !matchCompany && !matchSkill) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 text-left">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 space-y-3 sticky top-0 z-20">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white flex items-center justify-center shadow-xs shrink-0">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                  Career OS · Practitioner Directory
                </span>
                <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5">
                  The Expert Network
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            Experienced leaders and practitioners calibrated to provide high-conviction reviews on your actual work.
          </p>

          {/* Search & Mode Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by skill, domain, role, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {MODES.map(m => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setSelectedMode(m.key)}
                  className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer ${
                    selectedMode === m.key
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Experts List */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExperts.map(exp => (
              <div
                key={exp.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-slate-900 to-indigo-900 text-white font-black text-sm flex items-center justify-center shrink-0">
                        {exp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{exp.name}</h4>
                          <span className="text-2xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                            {exp.matchScore}% Match
                          </span>
                        </div>
                        <p className="text-2xs text-slate-600 font-medium">
                          {exp.role} · <span className="text-slate-400">{exp.company}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mode tags */}
                  <div className="flex flex-wrap gap-1">
                    {exp.modes.map(mode => (
                      <span key={mode} className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                        {mode}
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {exp.whyRecommended}
                  </p>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-2xs space-y-1">
                    <span className="font-bold text-slate-800 block">Evidence &amp; Shipped Highlights:</span>
                    <ul className="space-y-0.5 text-slate-600">
                      {exp.evidenceHighlights.map((hi, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 mt-0.5 shrink-0" />
                          <span>{hi}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400 font-medium">
                    {exp.verifiedValidationCount} verified reviews
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestFeedbackForExpert(exp);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Request Feedback</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition cursor-pointer"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
