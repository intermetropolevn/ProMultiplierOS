import React, { useState, useEffect } from 'react';
import { 
  User, 
  Target, 
  Briefcase, 
  MapPin, 
  Mail, 
  Edit3, 
  Save, 
  X, 
  Sparkles, 
  Award,
  CheckCircle2,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { UserCareerProfile, RoleCategory, SectorDomain, ExperienceLevel, RoleBlueprint } from '../../types';
import { RoleBlueprintService } from '../../services/roleBlueprintService';
import { CANONICAL_DOMAINS } from '../../data/jobTaxonomies';

interface ProfileHeaderProps {
  profile: UserCareerProfile;
  onUpdateProfile: (updates: Partial<UserCareerProfile>) => void;
  onOpenLivePractice?: () => void;
  onOpenAIDiagnostic?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  onUpdateProfile,
  onOpenLivePractice,
  onOpenAIDiagnostic,
}) => {
  const [isEditingCalibration, setIsEditingCalibration] = useState(false);
  const [availableBlueprints, setAvailableBlueprints] = useState<RoleBlueprint[]>(() => 
    RoleBlueprintService.getAllBlueprints(true)
  );

  useEffect(() => {
    const handleRolesUpdated = () => {
      setAvailableBlueprints(RoleBlueprintService.getAllBlueprints(true));
    };
    window.addEventListener('career_roles_updated', handleRolesUpdated);
    return () => window.removeEventListener('career_roles_updated', handleRolesUpdated);
  }, []);

  const [selectedBlueprintId, setSelectedBlueprintId] = useState<string>(() => {
    if (profile.targetRoleBlueprintId) return profile.targetRoleBlueprintId;
    const matchTitle = availableBlueprints.find(b => b.title === profile.targetTitle);
    if (matchTitle) return matchTitle.id;
    const matchCat = availableBlueprints.find(b => b.category === profile.targetRole);
    if (matchCat) return matchCat.id;
    return 'role-product-mgr';
  });

  const [targetRole, setTargetRole] = useState(profile.targetRole || 'Product Management');
  const [targetIndustryDomains, setTargetIndustryDomains] = useState<SectorDomain[]>(() => {
    if (profile.targetIndustryDomains && profile.targetIndustryDomains.length > 0) {
      return profile.targetIndustryDomains;
    }
    return profile.targetDomain ? [profile.targetDomain] : ['Enterprise SaaS', 'Fintech & Payments'];
  });
  const [targetLevel, setTargetLevel] = useState(profile.experienceLevel || 'Staff / Principal');
  const [targetTitle, setTargetTitle] = useState(profile.targetTitle || 'Technical Product Manager');

  // Keep in sync with profile updates
  useEffect(() => {
    if (profile.targetRoleBlueprintId) {
      setSelectedBlueprintId(profile.targetRoleBlueprintId);
    }
    if (profile.targetRole) {
      setTargetRole(profile.targetRole);
    }
    if (profile.targetTitle) {
      setTargetTitle(profile.targetTitle);
    }
  }, [profile.targetRoleBlueprintId, profile.targetRole, profile.targetTitle]);

  const handleSaveCalibration = () => {
    const finalDomains = targetIndustryDomains.length > 0 ? targetIndustryDomains : ['Enterprise SaaS' as SectorDomain];
    const bp = availableBlueprints.find(b => b.id === selectedBlueprintId);
    onUpdateProfile({
      targetRole: (bp?.category || targetRole) as RoleCategory,
      targetRoleBlueprintId: selectedBlueprintId,
      targetDomain: finalDomains[0],
      targetIndustryDomains: finalDomains,
      experienceLevel: targetLevel as ExperienceLevel,
      targetTitle: bp?.title || targetTitle.trim() || undefined,
    });
    setIsEditingCalibration(false);
  };

  const handleRemoveDomain = (domToRemove: SectorDomain) => {
    if (targetIndustryDomains.length <= 1) return; // Keep at least one
    setTargetIndustryDomains(prev => prev.filter(d => d !== domToRemove));
  };

  const handleAddDomain = (domToAdd: SectorDomain) => {
    if (!targetIndustryDomains.includes(domToAdd)) {
      setTargetIndustryDomains(prev => [...prev, domToAdd]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 relative overflow-hidden transition-all">
      {/* Background Accent Subtle Glow */}
      <div className="absolute -top-16 -right-16 w-52 h-52 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        
        {/* Left: User Identity & Headline */}
        <div className="flex items-start gap-4">
          <div className="relative group shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-900 to-indigo-800 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md ring-4 ring-slate-50">
              {profile.name ? profile.name.slice(0, 2).toUpperCase() : 'ME'}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center" title="Active Career Engine">
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {profile.name || 'Alex Chen'}
              </h1>
              <span className="text-slate-300">·</span>
              <span className="inline-flex items-center gap-1 text-2xs font-bold text-emerald-700">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Career Engine Active
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              {profile.targetTitle || 'Staff Platform Architect & Distributed Systems Engineer'}
            </p>

            <div className="flex flex-wrap items-center gap-2 text-2xs text-slate-500 pt-0.5">
              <span>
                Target: <strong className="text-slate-700 font-semibold">{profile.targetTitle || profile.targetRole || 'Technical Product Manager'}</strong>
              </span>
              <span className="text-slate-300">·</span>
              <span>
                Level: <strong className="text-slate-700 font-semibold">{profile.experienceLevel || 'Staff / Principal'}</strong>
              </span>
              <span className="text-slate-300">·</span>
              <span>
                Domains: <strong className="text-slate-700 font-semibold">{(profile.targetIndustryDomains && profile.targetIndustryDomains.length > 0 ? profile.targetIndustryDomains : [profile.targetDomain || 'Enterprise SaaS']).join(', ')}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          {onOpenAIDiagnostic && (
            <button
              id="btn-profile-ai-diagnostic"
              type="button"
              onClick={onOpenAIDiagnostic}
              className="px-3.5 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200/80 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Diagnostic</span>
            </button>
          )}

          <button
            id="btn-edit-career-calibration"
            type="button"
            onClick={() => setIsEditingCalibration(true)}
            className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span>Edit Calibration</span>
          </button>

          {onOpenLivePractice && (
            <button
              id="btn-profile-launch-live"
              type="button"
              onClick={onOpenLivePractice}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Live Practice</span>
            </button>
          )}
        </div>

      </div>

      {/* Calibration Modal */}
      {isEditingCalibration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Edit Career Target Calibration</h3>
              </div>
              <button
                onClick={() => setIsEditingCalibration(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Role</label>
                <p className="text-2xs text-slate-500 mb-1.5">
                  Select from verified Role Blueprints loaded across the platform.
                </p>
                <select
                  value={selectedBlueprintId}
                  onChange={(e) => {
                    const bpId = e.target.value;
                    setSelectedBlueprintId(bpId);
                    const bp = availableBlueprints.find(b => b.id === bpId);
                    if (bp) {
                      setTargetRole(bp.category);
                      setTargetTitle(bp.title);
                    }
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                >
                  {availableBlueprints.map((bp) => (
                    <option key={bp.id} value={bp.id}>
                      {bp.title} — {bp.category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Specific Title Override (Optional)</label>
                <input
                  type="text"
                  value={targetTitle}
                  onChange={(e) => setTargetTitle(e.target.value)}
                  placeholder="e.g. Technical Product Manager, Staff Backend Architect"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Target Industry Domains ({targetIndustryDomains.length})
                </label>
                <p className="text-2xs text-slate-500 mb-2">
                  Select one or more domains to calibrate blueprints, workflows, and industry intelligence.
                </p>
                <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 border border-slate-200 rounded-lg min-h-[42px] mb-2">
                  {targetIndustryDomains.map((dom) => (
                    <span
                      key={dom}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                    >
                      <span>{dom}</span>
                      {targetIndustryDomains.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveDomain(dom)}
                          className="text-slate-400 hover:text-red-600 rounded-full p-0.5 transition-colors cursor-pointer"
                          title={`Remove ${dom}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddDomain(e.target.value as SectorDomain);
                        e.target.value = '';
                      }
                    }}
                    defaultValue=""
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-800 text-xs font-medium focus:ring-2 focus:ring-blue-500 bg-white cursor-pointer"
                  >
                    <option value="" disabled>+ Add target domain...</option>
                    {CANONICAL_DOMAINS.filter(d => !targetIndustryDomains.includes(d)).map(dom => (
                      <option key={dom} value={dom}>{dom}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Experience Level Benchmark</label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Senior">Senior (IC5 / L5)</option>
                  <option value="Staff / Principal">Staff / Principal (IC6-IC7 / L6-L7)</option>
                  <option value="Director / Executive">Director / Executive (M2+ / VP)</option>
                  <option value="Mid-Level">Mid-Level (IC4 / L4)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsEditingCalibration(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCalibration}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 text-xs"
              >
                <Save className="w-3.5 h-3.5" /> Save Calibration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
