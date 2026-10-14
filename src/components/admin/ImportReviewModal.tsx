import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Scale, 
  Award, 
  ExternalLink, 
  GitMerge, 
  Send, 
  Layers, 
  BookOpen, 
  Hash, 
  Sparkles, 
  Calculator, 
  Table, 
  ShieldCheck,
  Building2
} from 'lucide-react';
import { ExtractedResource } from '../../features/admin/types';

interface ImportReviewModalProps {
  item: ExtractedResource | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onMerge: (id: string, targetId: string) => void;
  onPublish: (id: string) => void;
}

export const ImportReviewModal: React.FC<ImportReviewModalProps> = ({
  item,
  isOpen,
  onClose,
  onApprove,
  onReject,
  onMerge,
  onPublish
}) => {
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'exhibits' | 'governance'>('content');

  if (!isOpen || !item) return null;

  const caseData = item.caseData;

  const handleConfirmReject = () => {
    if (!rejectionReason.trim()) return;
    onReject(item.id, rejectionReason);
    setIsRejecting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">{item.title}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {item.resourceType.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {item.sourceName} • Domain: {item.domain} • Ingested: {new Date(item.crawledAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subnav Pills */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Case Content & Solution
            </button>
            <button
              onClick={() => setActiveTab('exhibits')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'exhibits'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Exhibits & Calculations ({caseData?.exhibits?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('governance')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                activeTab === 'governance'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              License & Provenance
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Confidence:</span>
              <span className="font-bold text-emerald-600">{item.extractionConfidence}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Quality:</span>
              <span className="font-bold text-blue-600">{item.qualityScore}/100</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* Duplicate candidate alert */}
          {item.status === 'duplicate_candidate' && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-amber-900 block">Potential Duplicate Detected</span>
                <p className="text-amber-800 leading-relaxed">
                  Similarity score: <span className="font-bold">{Math.round((item.similarityScore || 0.8) * 100)}%</span> with existing entry in Career OS.
                  You can merge these records or publish as an alternative version.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-5">
              
              {/* Classification Badges */}
              {caseData && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold rounded-lg uppercase tracking-wide text-[10px]">
                    Type: {caseData.caseType}
                  </span>
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold rounded-lg text-[10px]">
                    Difficulty: {caseData.difficultyLevel} ({caseData.difficultyScore}/100)
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-lg text-[10px]">
                    Firm: {caseData.firm}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-200 text-slate-700 font-bold rounded-lg text-[10px]">
                    Industry: {caseData.industry}
                  </span>
                </div>
              )}

              {/* Case Prompt */}
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                  Case Interview Prompt
                </span>
                <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-xl font-medium text-slate-900 leading-relaxed text-sm">
                  {caseData?.prompt || item.description}
                </div>
              </div>

              {/* Clarifying Questions */}
              {caseData?.candidateClarifyingQuestions && caseData.candidateClarifyingQuestions.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                    Target Clarifying Questions (Candidate Rubric)
                  </span>
                  <ul className="space-y-1.5 bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl">
                    {caseData.candidateClarifyingQuestions.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 leading-relaxed">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Framework Outline */}
              {caseData?.frameworkOutline && caseData.frameworkOutline.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                    Diagnostic Framework & Structuring Outline
                  </span>
                  <div className="bg-slate-50 border border-slate-200/80 p-3.5 rounded-xl space-y-1.5">
                    {caseData.frameworkOutline.map((step, idx) => (
                      <div key={idx} className="text-slate-800 font-medium">
                        {step}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Solution & Recommendation */}
              <div className="space-y-1.5">
                <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                  Exemplary Solution & Recommendation
                </span>
                <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-xl text-slate-800 leading-relaxed">
                  {caseData?.solution || item.extractedContent}
                </div>
              </div>

              {/* Skills Tags */}
              {caseData?.skills && (
                <div className="space-y-1.5">
                  <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                    Calibrated Candidate Competencies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {caseData.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg text-[11px]">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {activeTab === 'exhibits' && (
            <div className="space-y-4">
              <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] block">
                Extracted Case Exhibits & Math Formulas
              </span>

              {caseData?.caseMathCalculations && caseData.caseMathCalculations.length > 0 && (
                <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Calculator className="w-4 h-4" />
                    Case Math Formulas & Numerical Solutions
                  </span>
                  <div className="space-y-1.5 font-mono text-xs text-slate-200">
                    {caseData.caseMathCalculations.map((calc, i) => (
                      <div key={i} className="p-2 bg-slate-800 rounded">
                        {calc}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {caseData?.exhibits && caseData.exhibits.length > 0 ? (
                <div className="space-y-3">
                  {caseData.exhibits.map((ex) => (
                    <div key={ex.id} className="p-4 border border-slate-200 rounded-xl bg-white shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Table className="w-4 h-4 text-blue-600" />
                          <h4 className="font-bold text-slate-900">{ex.title}</h4>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                          {ex.type}
                        </span>
                      </div>
                      <p className="text-slate-600 leading-relaxed">
                        {ex.dataDescription}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-400 italic py-6 text-center">
                  No quantitative exhibits detected for this resource.
                </div>
              )}
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Ingestion Provenance & Legal Governance</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-slate-500 font-medium block">Canonical Origin:</span>
                    <a 
                      href={item.canonicalUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="text-blue-600 hover:underline font-mono break-all"
                    >
                      {item.canonicalUrl}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">License Classification:</span>
                    <span className="font-bold text-slate-800 capitalize">{item.license.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Content Storage Mode:</span>
                    <span className="font-mono text-slate-800">{item.contentMode}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block">Content SHA-256 Hash:</span>
                    <span className="font-mono text-slate-600">{item.contentHash}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <span className="font-semibold block mb-0.5">Mandatory Attribution Requirement:</span>
                  {item.attribution}
                </div>
              </div>
            </div>
          )}

          {/* Rejection reason box */}
          {isRejecting && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
              <label className="block font-bold text-red-900 text-xs">
                Specify Reason for Rejection
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="E.g., Outdated numerical figures, duplicate with Case #102, or incomplete solution tree..."
                className="w-full p-2.5 bg-white border border-red-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-red-500"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRejecting(false)}
                  className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs shadow-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {item.status !== 'rejected' && !isRejecting && (
              <button
                onClick={() => setIsRejecting(true)}
                className="px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl border border-red-200 transition-all cursor-pointer"
              >
                Reject Item
              </button>
            )}

            {item.duplicateOfId && (
              <button
                onClick={() => onMerge(item.id, item.duplicateOfId!)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-all cursor-pointer"
              >
                <GitMerge className="w-3.5 h-3.5" />
                <span>Merge Duplicate</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl"
            >
              Close
            </button>

            {item.status !== 'approved' && item.status !== 'published' && (
              <button
                onClick={() => {
                  onApprove(item.id);
                  onClose();
                }}
                className="px-4 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-all cursor-pointer"
              >
                Approve
              </button>
            )}

            <button
              onClick={() => {
                onPublish(item.id);
                onClose();
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish to Career OS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
