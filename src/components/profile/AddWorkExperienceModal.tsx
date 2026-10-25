import React, { useState, useEffect, useRef } from 'react';
import { X, Building2, Briefcase, Calendar, MapPin, Award, CheckCircle2, Sparkles, Plus, Trash2, Lock } from 'lucide-react';
import { WorkExperienceService, WorkExperienceRecord } from '../../services/workExperienceService';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface AddWorkExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdded?: (record: WorkExperienceRecord) => void;
  onSaved?: (record: WorkExperienceRecord) => void;
  initialRecord?: WorkExperienceRecord | null;
}

export const AddWorkExperienceModal: React.FC<AddWorkExperienceModalProps> = ({
  isOpen,
  onClose,
  onAdded,
  onSaved,
  initialRecord
}) => {
  const isEditMode = !!initialRecord;
  const { capabilities, canCreate, openContextualPrompt } = useAccessControl();
  const isSubmittingRef = useRef(false);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [dates, setDates] = useState('');
  const [location, setLocation] = useState('');
  const [scope, setScope] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');
  const [responsibilities, setResponsibilities] = useState<string[]>([
    'Architected core system capabilities and technical RFCs.',
    'Aligned cross-functional product and engineering partners.'
  ]);
  const [achievementInput, setAchievementInput] = useState('');
  const [achievements, setAchievements] = useState<string[]>([
    'Achieved 0 downtime across high-scale production cutover.'
  ]);
  const [metricInput, setMetricInput] = useState('');
  const [measurableOutcomes, setMeasurableOutcomes] = useState<string[]>([
    '99.999% data verification parity'
  ]);
  const [skillInput, setSkillInput] = useState('');
  const [relevantSkills, setRelevantSkills] = useState<string[]>([
    'Distributed Systems',
    'PostgreSQL',
    'Stakeholder Management'
  ]);

  useEffect(() => {
    isSubmittingRef.current = false;
    if (initialRecord) {
      setCompany(initialRecord.company || '');
      setRole(initialRecord.role || '');
      setDates(initialRecord.dates || '');
      setLocation(initialRecord.location || '');
      setScope(initialRecord.scope || '');
      setResponsibilities(initialRecord.responsibilities || []);
      setAchievements(initialRecord.achievements || []);
      setMeasurableOutcomes(initialRecord.measurableOutcomes || []);
      setRelevantSkills(initialRecord.relevantSkills || []);
    } else {
      setCompany('');
      setRole('');
      setDates('');
      setLocation('');
      setScope('');
      setResponsibilities([
        'Architected core system capabilities and technical RFCs.',
        'Aligned cross-functional product and engineering partners.'
      ]);
      setAchievements([
        'Achieved 0 downtime across high-scale production cutover.'
      ]);
      setMeasurableOutcomes([
        '99.999% data verification parity'
      ]);
      setRelevantSkills([
        'Distributed Systems',
        'PostgreSQL',
        'Stakeholder Management'
      ]);
    }
  }, [initialRecord, isOpen]);

  if (!isOpen) return null;

  const handleAddResponsibility = () => {
    if (responsibilityInput.trim()) {
      setResponsibilities([...responsibilities, responsibilityInput.trim()]);
      setResponsibilityInput('');
    }
  };

  const handleAddAchievement = () => {
    if (achievementInput.trim()) {
      setAchievements([...achievements, achievementInput.trim()]);
      setAchievementInput('');
    }
  };

  const handleAddMetric = () => {
    if (metricInput.trim()) {
      setMeasurableOutcomes([...measurableOutcomes, metricInput.trim()]);
      setMetricInput('');
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !relevantSkills.includes(skillInput.trim())) {
      setRelevantSkills([...relevantSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!capabilities.canCreate) {
      openContextualPrompt();
      return;
    }
    if (!isEditMode && !canCreate('work_experiences')) {
      return;
    }
    if (!company.trim() || !role.trim()) return;
    isSubmittingRef.current = true;

    if (isEditMode && initialRecord) {
      const updated = WorkExperienceService.updateWorkExperience(initialRecord.id, {
        company: company.trim(),
        role: role.trim(),
        dates: dates.trim() || '2024 — Present',
        location: location.trim() || 'Remote',
        scope: scope.trim() || `${role} leading core mission-critical initiatives.`,
        responsibilities: responsibilities.length > 0 ? responsibilities : ['Led high-impact engineering projects.'],
        achievements: achievements.length > 0 ? achievements : ['Successfully delivered key roadmap milestones.'],
        measurableOutcomes: measurableOutcomes.length > 0 ? measurableOutcomes : ['Delivered on-time with zero regressions.'],
        relevantSkills: relevantSkills.length > 0 ? relevantSkills : ['Software Engineering']
      });

      if (updated) {
        onSaved?.(updated);
        onAdded?.(updated);
      }
    } else {
      const newRecord = WorkExperienceService.addWorkExperience({
        company: company.trim(),
        role: role.trim(),
        dates: dates.trim() || '2024 — Present',
        location: location.trim() || 'Remote',
        scope: scope.trim() || `${role} leading core mission-critical initiatives.`,
        responsibilities: responsibilities.length > 0 ? responsibilities : ['Led high-impact engineering projects.'],
        achievements: achievements.length > 0 ? achievements : ['Successfully delivered key roadmap milestones.'],
        measurableOutcomes: measurableOutcomes.length > 0 ? measurableOutcomes : ['Delivered on-time with zero regressions.'],
        relevantSkills: relevantSkills.length > 0 ? relevantSkills : ['Software Engineering'],
        provenance: 'manual',
      });

      onAdded?.(newRecord);
      onSaved?.(newRecord);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {isEditMode ? 'Edit Work Experience Record' : 'Add Work Experience Record'}
              </h2>
              <p className="text-xs text-slate-500">
                {isEditMode 
                  ? 'Updates your experience and syncs evidence across Career OS.'
                  : 'Structures your history into career evidence, auto-synced with Knowledge Ledger.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <DemoQuotaGate workflowKey="work_experiences" isEditing={isEditMode} onViewExistingItems={onClose}>
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          <AccessCreationBanner workflowKey="work_experiences" workflowLabel="Work Experiences" />

          {/* BASIC SECTION: Company, Role, Dates, Short Description */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Basic Work Experience Fields
              </span>
              <span className="text-[11px] text-slate-400">
                Company · Role · Dates · Short Description
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Company *</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe, Robinhood, Ramp"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Role *</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lead Platform Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Dates</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="e.g. 2023 — Present"
                    value={dates}
                    onChange={(e) => setDates(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Short Description</label>
              <textarea
                rows={2}
                placeholder="High-level mandate, team mission, and system scale (e.g. Core payment platform processing $40M daily volume)..."
                value={scope}
                onChange={(e) => setScope(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>

          {/* ADVANCED SECTION: Capability Mapping, Responsibility Architecture, Outcome Metrics, Role Alignment, Evidence Attribution */}
          <ProgressiveCreationSection workflowKey="work_experiences">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Location / Work Mode</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. San Francisco, CA (Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
              />
            </div>
          </div>

          {/* Key Responsibilities */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Key Responsibilities</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Add a core responsibility or initiative..."
                value={responsibilityInput}
                onChange={(e) => setResponsibilityInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddResponsibility(); } }}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddResponsibility}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {responsibilities.map((resp, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200/80 rounded-lg text-slate-700">
                  <span className="line-clamp-1">{resp}</span>
                  <button
                    type="button"
                    onClick={() => setResponsibilities(responsibilities.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Measurable Outcomes / Proof */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Measurable Outcomes & Metrics</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. 0 downtime during cutover, $35k/mo license savings..."
                value={metricInput}
                onChange={(e) => setMetricInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddMetric(); } }}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddMetric}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Metric
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {measurableOutcomes.map((metric, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-medium">
                  {metric}
                  <button
                    type="button"
                    onClick={() => setMeasurableOutcomes(measurableOutcomes.filter((_, idx) => idx !== i))}
                    className="text-emerald-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Relevant Skills */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Relevant Skills & Stack</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Kafka, PostgreSQL, Distributed Systems..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Skill
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {relevantSkills.map((sk, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 border border-blue-200 rounded-md font-medium">
                  {sk}
                  <button
                    type="button"
                    onClick={() => setRelevantSkills(relevantSkills.filter((_, idx) => idx !== i))}
                    className="text-blue-500 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/80 text-amber-900 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-2xs leading-relaxed">
              This experience will be indexed into your canonical career ledger and linked to relevant interview questions and stories for live practice.
            </p>
          </div>
          </ProgressiveCreationSection>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-semibold transition-colors"
            >
              Cancel
            </button>
            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openContextualPrompt()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> {isEditMode ? 'Save Changes' : 'Save Work Experience'}
              </button>
            )}
          </div>
        </form>
        </DemoQuotaGate>
      </div>
    </div>
  );
};
