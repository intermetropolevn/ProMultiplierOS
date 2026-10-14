import React, { useState, useEffect } from 'react';
import { X, Check, CheckCircle2, UserCheck, ShieldCheck, Info } from 'lucide-react';
import { StructuredAnswerBlueprint } from '../../features/knowledge/types';
import { KnowledgeStorageService } from '../../features/knowledge/services/knowledgeStorageService';
import { AVAILABLE_INTERVIEWER_ROLES, InterviewerRoleType } from '../practice/live/liveInterviewData';
import { ActivityService } from '../../services/activityService';

interface AssignBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: StructuredAnswerBlueprint | null;
  onAssigned?: (updated: StructuredAnswerBlueprint) => void;
}

const ROLE_DESCRIPTIONS: Record<InterviewerRoleType, string> = {
  'Hiring Manager': 'Team fit, ownership, conflict resolution, career trajectory, and leadership impact.',
  'Engineering Lead': 'System architecture, trade-offs, technical debt payoff, and technical leadership.',
  'Technical Interviewer': 'Deep-dive algorithms, concurrency, race conditions, debugging, and code craft.',
  'Product Manager': 'Product intuition, ambiguous decisions, prioritization, metrics, and customer empathy.',
  'Recruiter': 'Background trajectory, core motivation, compensation expectations, and role alignment.',
  'Peer': 'Day-to-day collaboration, PR reviews, pair programming, and communication clarity.',
  'Cross-functional Partner': 'Collaboration with design, sales, data science, and stakeholder alignment.',
  'Executive': 'High-level business impact, strategic alignment, executive presence, and vision.'
};

export const AssignBlueprintModal: React.FC<AssignBlueprintModalProps> = ({
  isOpen,
  onClose,
  blueprint,
  onAssigned,
}) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    if (blueprint) {
      setSelectedRoles(blueprint.assignedRoles || []);
    }
  }, [blueprint, isOpen]);

  if (!isOpen || !blueprint) return null;

  const originalAssignedRoles = new Set(blueprint.assignedRoles || []);

  const handleToggleRole = (role: InterviewerRoleType) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleSave = () => {
    // Deduplicate roles cleanly
    const uniqueRoles: string[] = Array.from(new Set<string>(selectedRoles));
    const updatedList = KnowledgeStorageService.assignBlueprintToRoles(blueprint.id, uniqueRoles);
    const updatedBp = updatedList.find(b => b.id === blueprint.id) || {
      ...blueprint,
      assignedRoles: uniqueRoles,
    };

    ActivityService.logActivity({
      category: 'blueprint',
      title: `Assigned Blueprint Roles: ${blueprint.title}`,
      description: `Mapped to ${uniqueRoles.length} interviewer role(s): ${uniqueRoles.join(', ')}`,
      source: 'Blueprint',
      badgeText: `${uniqueRoles.length} Roles`,
      badgeVariant: 'blue',
      metadata: { blueprintId: blueprint.id, roles: uniqueRoles },
    });

    if (onAssigned) {
      onAssigned(updatedBp);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-2xs">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Assign Q&amp;A Blueprint</h2>
              <p className="text-xs text-slate-500">
                Map this blueprint to specific interviewer roles for live copilot guidance.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Blueprint Overview */}
        <div className="px-6 py-3.5 bg-blue-50/50 border-b border-blue-100/60 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
              Selected Blueprint
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white border border-blue-200 text-blue-800">
              {blueprint.framework}
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{blueprint.title}</h3>
          <p className="text-xs text-slate-600 line-clamp-2 italic">
            "{blueprint.questionText}"
          </p>
        </div>

        {/* Role List */}
        <div className="p-6 overflow-y-auto space-y-2 flex-1">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Assign to Interviewer Roles
            </label>
            <span className="text-xs text-slate-500 font-medium">
              {selectedRoles.length} of {AVAILABLE_INTERVIEWER_ROLES.length} selected
            </span>
          </div>

          <div className="space-y-2">
            {AVAILABLE_INTERVIEWER_ROLES.map((role) => {
              const isSelected = selectedRoles.includes(role);
              const wasOriginallyAssigned = originalAssignedRoles.has(role);

              return (
                <div
                  key={role}
                  onClick={() => handleToggleRole(role)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/60 border-blue-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center transition-colors border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{role}</span>
                        {wasOriginallyAssigned && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Assigned
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {ROLE_DESCRIPTIONS[role]}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Duplicate protection note */}
          <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2 text-[11px] text-slate-600">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Duplicate Protection Active:</strong> Blueprints are stored canonically. Assigning multiple roles creates direct many-to-many relationships without duplicating data.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Role Assignments ({selectedRoles.length})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
