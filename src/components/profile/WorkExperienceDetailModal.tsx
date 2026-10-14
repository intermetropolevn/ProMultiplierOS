import React from 'react';
import { 
  X, 
  Building2, 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Target, 
  FileCheck, 
  Cpu, 
  Pencil, 
  Trash2,
  ExternalLink
} from 'lucide-react';
import { WorkExperienceRecord } from '../../services/workExperienceService';

interface WorkExperienceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: WorkExperienceRecord | null;
  onEdit?: (record: WorkExperienceRecord) => void;
  onDelete?: (id: string) => void;
}

export const WorkExperienceDetailModal: React.FC<WorkExperienceDetailModalProps> = ({
  isOpen,
  onClose,
  record,
  onEdit,
  onDelete
}) => {
  if (!isOpen || !record) return null;

  const provenanceBadge = () => {
    switch (record.provenance) {
      case 'extracted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Extracted from Resume
          </span>
        );
      case 'edited':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            User Edited
          </span>
        );
      case 'manual':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
            Manual Record
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Audited Evidence
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs mt-0.5">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{record.role}</h2>
                {provenanceBadge()}
              </div>
              <p className="text-sm font-medium text-slate-600 mt-0.5">{record.company}</p>
              
              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {record.dates}
                </span>
                {record.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {record.location}
                  </span>
                )}
                {record.linkedEvidenceId && (
                  <span className="flex items-center gap-1 text-emerald-700 font-medium">
                    <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Linked to Evidence Ledger
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit this record"
              >
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${record.role} at ${record.company}"?`)) {
                    onDelete(record.id);
                    onClose();
                  }
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Delete this record"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Executive Scope / Mandate */}
          {record.scope && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
              <h3 className="text-2xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Executive Scope & Mandate
              </h3>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {record.scope}
              </p>
            </div>
          )}

          {/* Measurable Outcomes */}
          {record.measurableOutcomes && record.measurableOutcomes.length > 0 && (
            <div>
              <h3 className="text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-blue-600" />
                Measurable Impact & Quantitative Proof
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {record.measurableOutcomes.map((metric, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-2 p-2.5 bg-blue-50/60 border border-blue-100 rounded-lg text-blue-950 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span>{metric}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Core Responsibilities */}
          {record.responsibilities && record.responsibilities.length > 0 && (
            <div>
              <h3 className="text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-600" />
                Key Responsibilities & System Ownership
              </h3>
              <ul className="space-y-2">
                {record.responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0"></span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Key Achievements */}
          {record.achievements && record.achievements.length > 0 && (
            <div>
              <h3 className="text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Key Achievements & Delivery
              </h3>
              <ul className="space-y-2">
                {record.achievements.map((ach, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                    <span>{ach}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Relevant Skills & Stack */}
          {record.relevantSkills && record.relevantSkills.length > 0 && (
            <div>
              <h3 className="text-2xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-slate-600" />
                Associated Competences & Technologies
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {record.relevantSkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-slate-800 font-medium text-xs transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="text-2xs text-slate-500">
            Last updated: {new Date(record.updatedAt).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(record);
                }}
                className="px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white text-slate-700 rounded-xl font-semibold transition-colors text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit Record
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold transition-colors text-xs shadow-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
