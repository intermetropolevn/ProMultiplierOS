import React, { useState } from 'react';
import { 
  X, 
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Briefcase, 
  Compass, 
  Check,
  Zap,
  Search
} from 'lucide-react';
import { CreateMissionPayload, MissionCapabilityGap } from '../../types/careerMission';
import { CareerMissionService } from '../../services/careerMissionService';

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionCreated: (missionId: string) => void;
  initialTargetRole?: string;
  initialTargetDomain?: string;
}

const PRESET_ROLES = [
  { id: 'role-senior-pm', title: 'Senior Product Manager', domain: 'Enterprise SaaS & Cloud' },
  { id: 'role-ai-pm', title: 'AI Product Manager', domain: 'AI / Machine Learning & Data Platforms' },
  { id: 'role-tech-lead', title: 'Full Stack Tech Lead / Architect', domain: 'Distributed Cloud Systems' },
  { id: 'role-staff-eng', title: 'Staff Software Engineer', domain: 'High-Throughput Systems' },
  { id: 'role-growth-lead', title: 'Growth Product Lead', domain: 'Product-Led Growth & FinTech' },
];

export const CreateMissionModal: React.FC<CreateMissionModalProps> = ({
  isOpen,
  onClose,
  onMissionCreated,
  initialTargetRole = '',
  initialTargetDomain = '',
}) => {
  const [selectedRoleTitle, setSelectedRoleTitle] = useState(initialTargetRole || 'AI Product Manager');
  const [customRoleInput, setCustomRoleInput] = useState('');
  const [isCustomRole, setIsCustomRole] = useState(false);
  const [domain, setDomain] = useState(initialTargetDomain || 'AI / Machine Learning');
  const [horizon, setHorizon] = useState<'30_days' | '60_days' | '90_days' | '6_months'>('90_days');
  const [targetReadiness, setTargetReadiness] = useState<number>(90);
  const [step, setStep] = useState<'configure' | 'diagnose'>('configure');

  // Preview diagnostics
  const activeRoleTitle = isCustomRole ? (customRoleInput || 'Custom Target Role') : selectedRoleTitle;
  const diagnosis = CareerMissionService.diagnoseGapsForRole(activeRoleTitle, domain);

  if (!isOpen) return null;

  const handleLaunch = () => {
    const payload: CreateMissionPayload = {
      title: `Become ${activeRoleTitle}`,
      targetRoleId: isCustomRole ? 'custom-role' : (PRESET_ROLES.find(r => r.title === selectedRoleTitle)?.id || 'custom-role'),
      targetRoleTitle: activeRoleTitle,
      targetDomain: domain,
      missionHorizon: horizon,
      targetReadiness: targetReadiness,
    };

    const newMission = CareerMissionService.createMission(payload);
    onMissionCreated(newMission.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-3 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                Create a Career Mission
              </h2>
              <p className="text-2xs text-slate-500 font-medium">
                Turn your career ambition into a continuous 8-stage Growth Loop
              </p>
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

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          {step === 'configure' ? (
            <div className="space-y-4">
              
              {/* Target Role selection */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Target Role Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {PRESET_ROLES.map(role => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoleTitle(role.title);
                        setDomain(role.domain);
                        setIsCustomRole(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        !isCustomRole && selectedRoleTitle === role.title
                          ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-2xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{role.title}</div>
                      <div className="text-2xs text-slate-500 truncate">{role.domain}</div>
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setIsCustomRole(true)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isCustomRole
                        ? 'border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">+ Custom Target Role</div>
                    <div className="text-2xs text-slate-500">Define your own career trajectory</div>
                  </button>
                </div>

                {isCustomRole && (
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="e.g. Chief of Staff, Machine Learning Architect, Product Ops Director"
                      value={customRoleInput}
                      onChange={(e) => setCustomRoleInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-blue-400 bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                )}
              </div>

              {/* Target Domain */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Target Domain &amp; Industry
                </label>
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. AI / Machine Learning, FinTech, HealthTech, B2B SaaS"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-blue-500/30"
                />
              </div>

              {/* Mission Horizon */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Target Horizon &amp; Cadence
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '30_days', label: '30 Days' },
                    { id: '60_days', label: '60 Days' },
                    { id: '90_days', label: '90 Days' },
                    { id: '6_months', label: '6 Months' },
                  ].map(h => (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() => setHorizon(h.id as any)}
                      className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        horizon === h.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Benchmark Ambition */}
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-blue-900">Target Readiness Goal</div>
                  <div className="text-2xs text-blue-700">Recommended benchmark to guarantee top-tier candidate status</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-blue-900">{targetReadiness}%</span>
                  <input
                    type="range"
                    min="75"
                    max="98"
                    value={targetReadiness}
                    onChange={(e) => setTargetReadiness(Number(e.target.value))}
                    className="w-24 accent-blue-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* STEP 2: DIAGNOSTIC PREVIEW */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                      Auto-Diagnosed Baseline
                    </span>
                    <h3 className="text-base font-black text-white">{activeRoleTitle}</h3>
                    <p className="text-2xs text-blue-100">Baseline calculated from verified profile capabilities</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-white">{diagnosis.readiness}%</span>
                    <div className="text-2xs text-emerald-300">Baseline Readiness</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Identified Capability Gaps ({diagnosis.gaps.length})
                </h4>
                <div className="space-y-2">
                  {diagnosis.gaps.map((gap, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1 shadow-3xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{gap.capability}</span>
                        <span className="text-2xs font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200">
                          {gap.gapSeverity} Gap
                        </span>
                      </div>
                      <p className="text-2xs text-slate-500">{gap.rationale}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          {step === 'configure' ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => setStep('diagnose')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <span>Run Gap Diagnostic</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep('configure')}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
              >
                Back to Config
              </button>

              <button
                type="button"
                onClick={handleLaunch}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-white" />
                <span>Launch Mission &amp; Activate Growth Loop</span>
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
