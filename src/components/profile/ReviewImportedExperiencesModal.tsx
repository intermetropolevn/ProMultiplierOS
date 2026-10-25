import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  Building2,
  Calendar,
  MapPin,
  Target,
  Briefcase,
  Cpu,
  Pencil,
  Trash2,
  Check,
  FileSpreadsheet,
  Users,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  CsvImportBatchSummary,
  StagedWorkExperienceImportItem
} from '../../services/workExperienceCsvService';

interface ReviewImportedExperiencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  batch: CsvImportBatchSummary | null;
  onUpdateStagedItem: (
    stagingId: string,
    updater: (item: StagedWorkExperienceImportItem) => StagedWorkExperienceImportItem
  ) => void;
  onAcceptSingle: (stagingId: string) => void;
  onDiscardSingle: (stagingId: string) => void;
  onAcceptAll: () => void;
}

export const ReviewImportedExperiencesModal: React.FC<ReviewImportedExperiencesModalProps> = ({
  isOpen,
  onClose,
  batch,
  onUpdateStagedItem,
  onAcceptSingle,
  onDiscardSingle,
  onAcceptAll
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [expandedDetailIds, setExpandedDetailIds] = useState<Record<string, boolean>>({});

  // Local edit draft fields
  const [editCompany, setEditCompany] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editDates, setEditDates] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editScope, setEditScope] = useState('');
  const [editResponsibilitiesText, setEditResponsibilitiesText] = useState('');
  const [editAchievementsText, setEditAchievementsText] = useState('');
  const [editOutcomesText, setEditOutcomesText] = useState('');
  const [editSkillsText, setEditSkillsText] = useState('');

  if (!isOpen || !batch) return null;

  const pendingItems = batch.items.filter(i => i.status === 'pending');
  const acceptedCount = batch.items.filter(i => i.status === 'accepted').length;
  const discardedCount = batch.items.filter(i => i.status === 'discarded').length;

  const startEdit = (item: StagedWorkExperienceImportItem) => {
    setEditingId(item.stagingId);
    setEditCompany(item.record.company);
    setEditRole(item.record.role);
    setEditDates(item.record.dates);
    setEditLocation(item.record.location || '');
    setEditScope(item.record.scope || '');
    setEditResponsibilitiesText(item.record.responsibilities.join('\n'));
    setEditAchievementsText(item.record.achievements.join('\n'));
    setEditOutcomesText(item.record.measurableOutcomes.join('\n'));
    setEditSkillsText(item.record.relevantSkills.join(', '));
  };

  const saveEdit = (stagingId: string) => {
    onUpdateStagedItem(stagingId, item => {
      const nextCompany = editCompany.trim() || item.record.company;
      const nextRole = editRole.trim() || item.record.role;
      const nextDates = editDates.trim() || item.record.dates;
      const nextLocation = editLocation.trim() || item.record.location;
      const nextScope = editScope.trim() || item.record.scope;
      const nextResp = editResponsibilitiesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const nextAch = editAchievementsText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const nextOut = editOutcomesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
      const nextSkills = editSkillsText
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      return {
        ...item,
        record: {
          ...item.record,
          company: nextCompany,
          role: nextRole,
          dates: nextDates,
          location: nextLocation,
          scope: nextScope,
          responsibilities: nextResp.length > 0 ? nextResp : item.record.responsibilities,
          achievements: nextAch.length > 0 ? nextAch : item.record.achievements,
          measurableOutcomes: nextOut.length > 0 ? nextOut : item.record.measurableOutcomes,
          relevantSkills: nextSkills.length > 0 ? nextSkills : item.record.relevantSkills,
          userProvided: {
            ...item.record.userProvided,
            company: nextCompany,
            role: nextRole,
            location: nextLocation,
            importedSummaryLine: `${nextRole} — ${nextCompany} — ${nextDates.replace(/\s*—\s*/g, '–')}`
          }
        }
      };
    });
    setEditingId(null);
  };

  const toggleExpandDetail = (id: string) => {
    setExpandedDetailIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-start justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs mt-0.5 shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base font-bold text-slate-900">
                  Review Imported Work Experience Records
                </h2>
                <span className="px-2 py-0.5 rounded-full text-2xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {batch.fileName}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Compare your user-provided CSV fields against CareerOS inferred intelligence before committing to your profile.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary Metrics Strip */}
        <div className="px-6 py-3 bg-indigo-50/50 border-b border-indigo-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {batch.totalDetected} work experience{batch.totalDetected === 1 ? '' : 's'} detected
            </span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-700 font-medium">{batch.totalDetected} records structured</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-700 font-medium">{batch.rolesClassifiedCount} roles classified</span>
            <span className="text-slate-300">·</span>
            <span className="text-indigo-700 font-semibold">{batch.competenciesDetectedCount} competencies detected</span>
            <span className="text-slate-300">·</span>
            <span className="text-blue-700 font-semibold">{batch.measurableOutcomesCount} measurable outcomes detected</span>
          </div>

          <div className="flex items-center gap-2 text-2xs font-semibold">
            {acceptedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {acceptedCount} Accepted
              </span>
            )}
            {discardedCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                {discardedCount} Discarded
              </span>
            )}
          </div>
        </div>

        {/* Records Review List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 bg-slate-50/40">
          {pendingItems.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">
                All staged records have been processed
              </h3>
              <p className="text-xs text-slate-500">
                {acceptedCount} record{acceptedCount === 1 ? '' : 's'} committed to Work Experiences · {discardedCount} discarded.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                Done
              </button>
            </div>
          ) : (
            pendingItems.map((item, idx) => {
              const { record } = item;
              const { userProvided, inferredIntelligence } = record;
              const isEditing = editingId === item.stagingId;
              const isExpanded = expandedDetailIds[item.stagingId] ?? idx === 0;

              return (
                <div
                  key={item.stagingId}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Record Top Bar */}
                  <div className="px-5 py-3.5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                        <Building2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-slate-900">{record.role}</h4>
                          <span className="text-slate-300">·</span>
                          <span className="text-xs font-semibold text-slate-700">{record.company}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Ready to Commit
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-2xs text-slate-500 mt-0.5 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> {record.dates}
                          </span>
                          {record.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" /> {record.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Individual Record Actions: Review / Edit / Accept / Discard */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleExpandDetail(item.stagingId)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-2xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="w-3.5 h-3.5" /> Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-3.5 h-3.5" /> Inspect Structure
                          </>
                        )}
                      </button>

                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => startEdit(item)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-2xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Pencil className="w-3 h-3" /> Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onAcceptSingle(item.stagingId)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-2xs font-bold flex items-center gap-1 shadow-2xs cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => onDiscardSingle(item.stagingId)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="Discard this imported record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Core Distinction: User-Provided Information vs. CareerOS Intelligence */}
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/60 border-b border-slate-100">
                    {/* Left: User-Provided Source Material */}
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                          Imported · User-Provided Information
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-semibold text-slate-600">
                          CSV Source
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-900">
                        {userProvided.importedSummaryLine}
                      </p>
                      {userProvided.rawDescription ? (
                        <p className="text-2xs text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-700">Description:</span> {userProvided.rawDescription}
                        </p>
                      ) : (
                        <p className="text-2xs text-slate-400 italic">
                          No description provided in CSV (structured automatically from role &amp; company).
                        </p>
                      )}
                      {userProvided.rawAchievements && (
                        <p className="text-2xs text-slate-600 leading-relaxed">
                          <span className="font-semibold text-slate-700">Key Outcomes:</span> {userProvided.rawAchievements}
                        </p>
                      )}
                    </div>

                    {/* Right: CareerOS Inferred / Classified Intelligence */}
                    <div className="p-3.5 rounded-xl bg-indigo-50/60 border border-indigo-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                          <Sparkles className="w-3 h-3 text-indigo-600" />
                          CareerOS Intelligence · Auto-Classified
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-indigo-200 text-[10px] font-semibold text-indigo-700">
                          {inferredIntelligence.roleFamily}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-indigo-950 leading-snug">
                        {inferredIntelligence.intelligenceSummaryLine}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        <span className="px-2 py-0.5 rounded bg-white border border-indigo-200/80 text-[10px] font-semibold text-indigo-800">
                          Domain: {inferredIntelligence.domain}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-indigo-200/80 text-[10px] font-semibold text-indigo-800">
                          Area: {inferredIntelligence.functionalArea}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white border border-indigo-200/80 text-[10px] font-semibold text-indigo-800">
                          Pillars: {inferredIntelligence.relationshipPillars.join(' + ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-indigo-800 pt-0.5 flex-wrap">
                        <span className="inline-flex items-center gap-1">
                          <Users className="w-3 h-3 text-indigo-500" />
                          Stakeholders: {inferredIntelligence.stakeholders.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Inline Editor Mode */}
                  {isEditing && (
                    <div className="p-5 bg-blue-50/30 border-b border-blue-100 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-950 uppercase tracking-wider text-2xs">
                          Edit Structured Work Experience Before Committing
                        </span>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-2xs text-slate-500 hover:text-slate-700 font-semibold"
                        >
                          Cancel
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">Company</label>
                          <input
                            type="text"
                            value={editCompany}
                            onChange={e => setEditCompany(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">Role / Job Title</label>
                          <input
                            type="text"
                            value={editRole}
                            onChange={e => setEditRole(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">Dates</label>
                          <input
                            type="text"
                            value={editDates}
                            onChange={e => setEditDates(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">Location</label>
                          <input
                            type="text"
                            value={editLocation}
                            onChange={e => setEditLocation(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-700 mb-1">
                          Executive Scope &amp; Mandate
                        </label>
                        <textarea
                          rows={2}
                          value={editScope}
                          onChange={e => setEditScope(e.target.value)}
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">
                            Key Responsibilities (1 per line)
                          </label>
                          <textarea
                            rows={3}
                            value={editResponsibilitiesText}
                            onChange={e => setEditResponsibilitiesText(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-2xs font-bold text-slate-700 mb-1">
                            Measurable Impact &amp; Outcomes (1 per line)
                          </label>
                          <textarea
                            rows={3}
                            value={editOutcomesText}
                            onChange={e => setEditOutcomesText(e.target.value)}
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-2xs font-bold text-slate-700 mb-1">
                          Associated Competencies &amp; Technologies (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={editSkillsText}
                          onChange={e => setEditSkillsText(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>

                      <div className="flex justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-600"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => saveEdit(item.stagingId)}
                          className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Save Edits
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Canonical Work Experience Detail Structure Preview */}
                  {isExpanded && !isEditing && (
                    <div className="p-4 space-y-4 text-xs bg-white">
                      {/* Executive Scope & Mandate */}
                      <div>
                        <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                          Executive Scope &amp; Mandate
                        </h5>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                          {record.scope}
                        </p>
                      </div>

                      {/* Measurable Impact & Quantitative Proof */}
                      {record.measurableOutcomes.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                            <Target className="w-3 h-3 text-blue-600" />
                            Measurable Impact &amp; Quantitative Proof
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {record.measurableOutcomes.map((m, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50/70 text-blue-950 border border-blue-100 rounded-lg text-2xs font-medium"
                              >
                                <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Key Responsibilities & System Ownership */}
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-500" />
                            Key Responsibilities &amp; System Ownership
                          </h5>
                          <ul className="space-y-1 text-2xs text-slate-700">
                            {record.responsibilities.map((r, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Key Achievements & Delivery */}
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Key Achievements &amp; Delivery
                          </h5>
                          <ul className="space-y-1 text-2xs text-slate-700">
                            {record.achievements.map((a, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                                <span>{a}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Associated Competencies & Technologies */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1 mr-1">
                            <Cpu className="w-3 h-3 text-slate-500" />
                            Competencies &amp; Tech:
                          </span>
                          {record.relevantSkills.map((sk, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-2xs font-medium text-slate-800"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>

                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Layers className="w-3 h-3 text-emerald-600" />
                          {inferredIntelligence.evidenceRelationships[0]}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            {pendingItems.length > 0
              ? `${pendingItems.length} record${pendingItems.length === 1 ? '' : 's'} ready to commit to your canonical Work Experiences ledger.`
              : 'All records reviewed.'}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              Close
            </button>
            {pendingItems.length > 0 && (
              <button
                type="button"
                onClick={onAcceptAll}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept All ({pendingItems.length})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
