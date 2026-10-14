import React, { useState } from 'react';
import { X, Upload, FileText, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Link2 } from 'lucide-react';
import { ApplicationAssessment, ApplicationCase, AssessmentType } from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';

interface IngestCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  companyName: string;
  existingAssessment?: ApplicationAssessment;
  onCaseIngested: (assessment: ApplicationAssessment, appCase: ApplicationCase) => void;
}

export const IngestCaseModal: React.FC<IngestCaseModalProps> = ({
  isOpen,
  onClose,
  applicationId,
  companyName,
  existingAssessment,
  onCaseIngested
}) => {
  const [assessmentType, setAssessmentType] = useState<AssessmentType>(
    existingAssessment?.type || 'TAKE_HOME_CASE'
  );
  const [assessmentTitle, setAssessmentTitle] = useState(
    existingAssessment?.title || `${companyName} Take-home Strategic Case`
  );
  const [deadline, setDeadline] = useState(existingAssessment?.deadline || '');
  const [inputMethod, setInputMethod] = useState<'paste' | 'upload' | 'url'>('paste');
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleIngest = () => {
    let casePrompt = rawText;
    if (inputMethod === 'upload' && uploadedFileName) {
      casePrompt = `[Uploaded Case Document: ${uploadedFileName}]\n\n` + (rawText || `Company prompt received for ${companyName}. Evaluate market attractiveness, unit economics, and formulate an executive presentation.`);
    } else if (inputMethod === 'url' && sourceUrl) {
      casePrompt = `[Case Source: ${sourceUrl}]\n\n` + (rawText || `Brief retrieved from ${sourceUrl}. Review regional expansion feasibility and submit a 3-year strategic roadmap.`);
    }

    if (!casePrompt.trim()) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      // 1. Create or update assessment
      const assessment: ApplicationAssessment = existingAssessment || {
        id: `assess-${Date.now()}`,
        applicationId,
        type: assessmentType,
        title: assessmentTitle.trim() || `${companyName} Assessment`,
        description: `Assessment materials and case prompt provided by ${companyName}.`,
        deadline: deadline ? new Date(deadline).toISOString() : undefined,
        status: 'ANALYZING',
        taskIds: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      applicationStore.saveAssessment(assessment);

      // 2. Parse and analyze application case
      const appCase = applicationStore.parseAndIngestCase(
        applicationId,
        assessment.id,
        casePrompt,
        assessmentTitle
      );

      // Link case to assessment
      assessment.caseId = appCase.id;
      assessment.status = 'PREPARING';
      applicationStore.saveAssessment(assessment);

      setIsAnalyzing(false);
      onCaseIngested(assessment, appCase);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">Ingest Company Case / Assessment</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Private by Default
                </span>
              </div>
              <p className="text-xs text-slate-500">Attach and structure the problem statement received from {companyName}.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Assessment Meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Format</label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-purple-500 focus:outline-hidden bg-white"
              >
                <option value="TAKE_HOME_CASE">Take-home Business Case</option>
                <option value="CASE_INTERVIEW">Live Case Interview</option>
                <option value="PRODUCT_CASE">Product Strategy Case</option>
                <option value="STRATEGY_CASE">Corporate Strategy Case</option>
                <option value="TECHNICAL_TEST">Technical Architecture Test</option>
                <option value="PRESENTATION">Executive Presentation</option>
                <option value="WRITTEN_ASSIGNMENT">Written Memo / Brief</option>
                <option value="DESIGN_CHALLENGE">Design Challenge</option>
                <option value="PORTFOLIO_REVIEW">Portfolio Review</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Submission Deadline</label>
              <input
                type="datetime-local"
                value={deadline ? deadline.substring(0, 16) : ''}
                onChange={(e) => setDeadline(e.target.value ? new Date(e.target.value).toISOString() : '')}
                className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-purple-500 focus:outline-hidden bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Title</label>
            <input
              type="text"
              value={assessmentTitle}
              onChange={(e) => setAssessmentTitle(e.target.value)}
              placeholder="e.g., Southeast Asia Expansion Strategy Case"
              className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-purple-500 focus:outline-hidden"
            />
          </div>

          {/* Input Method Selector */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-slate-700">Case Ingestion Method</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setInputMethod('paste')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  inputMethod === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setInputMethod('upload')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  inputMethod === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Upload File / PDF
              </button>
              <button
                type="button"
                onClick={() => setInputMethod('url')}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  inputMethod === 'url' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Document URL
              </button>
            </div>
          </div>

          {inputMethod === 'paste' && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Paste Company Case Brief & Prompt
              </label>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the full prompt from the employer (e.g., 'Should Company X enter Market Y? Deliver an executive recommendation with unit economics and risks...')"
                rows={6}
                className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-purple-500 focus:outline-hidden leading-relaxed"
              />
            </div>
          )}

          {inputMethod === 'upload' && (
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-purple-400 transition-colors">
              <Upload className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-800">
                {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Select or drop case assignment PDF / DOCX / Image'}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Career OS runs client-side text parsing. Materials are strictly confidential and private to your account.
              </p>
              <input
                type="file"
                id="case-file-input"
                className="hidden"
                accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setUploadedFileName(e.target.files[0].name);
                  }
                }}
              />
              <label
                htmlFor="case-file-input"
                className="inline-block mt-3 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer transition-colors"
              >
                Browse Files
              </label>
            </div>
          )}

          {inputMethod === 'url' && (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-600">Company Brief URL / Google Drive link</label>
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-slate-400" />
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://docs.google.com/document/d/... or employer portal URL"
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 focus:border-purple-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Privacy & Security guarantee note */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900">Confidentiality Guarantee:</span> Application cases are marked <strong className="text-emerald-700">PRIVATE</strong> by default. They are never published to the public Case Study repository or shared without your explicit consent.
            </div>
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
            onClick={handleIngest}
            disabled={isAnalyzing || (inputMethod === 'paste' && !rawText.trim()) || (inputMethod === 'upload' && !uploadedFileName)}
            className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors shadow-xs disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running Career OS Case Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze & Launch Case Workspace</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
