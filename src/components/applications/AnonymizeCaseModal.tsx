import React, { useState } from 'react';
import { X, Shield, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles } from 'lucide-react';
import { ApplicationCase } from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { industryStore } from '../../features/industry/services/industryStore';

interface AnonymizeCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  appCase: ApplicationCase;
  companyName: string;
  onAnonymized: (anonymizedCase: ApplicationCase) => void;
}

export const AnonymizeCaseModal: React.FC<AnonymizeCaseModalProps> = ({
  isOpen,
  onClose,
  appCase,
  companyName,
  onAnonymized
}) => {
  const [anonymizedTitle, setAnonymizedTitle] = useState(
    appCase.title.replace(new RegExp(companyName, 'gi'), 'Enterprise Corp').replace(/Product [A-Z]/g, 'Platform Core')
  );
  const [confirmedRisk, setConfirmedRisk] = useState(false);
  const [publishToPersonalLibrary, setPublishToPersonalLibrary] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleAnonymize = () => {
    if (!confirmedRisk) return;
    setIsProcessing(true);

    setTimeout(() => {
      const anon = applicationStore.anonymizeCase(appCase.id, anonymizedTitle);
      if (anon) {
        // Optionally create in industry store as a reusable practice case study
        if (publishToPersonalLibrary) {
          industryStore.saveCaseStudy({
            id: `cs-anon-${Date.now()}`,
            slug: `anon-${Date.now()}`,
            title: anonymizedTitle,
            description: `Anonymized practical business case derived from a live enterprise evaluation in ${appCase.geography || 'Southeast Asia'}.`,
            industryId: 'ind-saas',
            geography: appCase.geography || 'Southeast Asia',
            difficulty: 'ADVANCED',
            caseTypeIds: ['MARKET_ENTRY', 'STRATEGY'],
            context: appCase.context || 'Strategic business expansion and go-to-market evaluation.',
            objective: 'Develop a market entry recommendation and unit economics model.',
            setup: 'Review prompt details and financial assumptions.',
            questionIds: [],
            exhibitIds: [],
            industryReportIds: [],
            dataPointIds: appCase.relatedDataPointIds || [],
            intelligenceIds: appCase.relatedIntelligenceIds || [],
            knowledgeIds: [],
            frameworkIds: [],
            skillIds: [],
            sourceResourceIds: [],
            estimatedTime: 45,
            qualityScore: 90,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        onAnonymized(anon);
      }
      setIsProcessing(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Anonymized Case Study</h2>
              <p className="text-xs text-slate-500">Safely transform confidential case material into a reusable practice asset.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <AlertCircle className="w-4 h-4 text-amber-700" />
              <span>Automated Sanitization Pipeline:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-800">
              <li>Replaces "{companyName}" with generic entity ("Enterprise Corp")</li>
              <li>Strips proprietary internal URLs, documents, and candidate notes</li>
              <li>Transforms proprietary internal product codenames into general equivalents</li>
              <li>Does not expose private interview feedback or scoring rubrics</li>
            </ul>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Sanitized Case Study Title</label>
            <input
              type="text"
              value={anonymizedTitle}
              onChange={(e) => setAnonymizedTitle(e.target.value)}
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={publishToPersonalLibrary}
                onChange={(e) => setPublishToPersonalLibrary(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-bold text-slate-800">Add to Reusable Practice Case Library</span>
            </label>
            <p className="text-[11px] text-slate-500 pl-6">
              Allows you to replay or practice this case simulation in the Prepare & Practice hubs.
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmedRisk}
                onChange={(e) => setConfirmedRisk(e.target.checked)}
                className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-700 font-medium leading-tight">
                I confirm that no proprietary intellectual property, employee names, or strictly confidential trade secrets remain in this sanitized case prompt.
              </span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAnonymize}
            disabled={!confirmedRisk || isProcessing}
            className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isProcessing ? (
              <span>Sanitizing...</span>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Anonymized Case</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
