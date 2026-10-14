import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Paperclip, 
  X, 
  Plus, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  UserCheck,
  Bookmark,
  Share2,
  AlertCircle
} from 'lucide-react';
import { 
  JobAssessment, 
  AssessmentStage, 
  AssessmentResult, 
  DemonstratedSkillItem 
} from '../../features/assessments/types';
import { jobAssessmentStore } from '../../features/assessments/services/jobAssessmentStore';

interface JobAssessmentModalProps {
  assessment: JobAssessment | null;
  isOpen: boolean;
  onClose: () => void;
  onAssessmentUpdated?: (updated: JobAssessment) => void;
  onOpenSourceInLibrary?: (sourceId: string) => void;
}

export const JobAssessmentModal: React.FC<JobAssessmentModalProps> = ({
  assessment,
  isOpen,
  onClose,
  onAssessmentUpdated,
  onOpenSourceInLibrary
}) => {
  if (!isOpen || !assessment) return null;

  const [activeTab, setActiveTab] = useState<'case' | 'submission' | 'evaluation' | 'skills' | 'reusable'>('case');
  const [currentAssessment, setCurrentAssessment] = useState<JobAssessment>(assessment);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);

  // Editable local state for quick adjustments
  const [scoreInput, setScoreInput] = useState(assessment.evaluation?.score?.toString() || '');
  const [feedbackInput, setFeedbackInput] = useState(assessment.evaluation?.feedback || '');
  const [resultInput, setResultInput] = useState<AssessmentResult>(assessment.evaluation?.result || 'passed');
  const [submissionUrlInput, setSubmissionUrlInput] = useState(assessment.submission.url || '');
  const [submissionContentInput, setSubmissionContentInput] = useState(assessment.submission.content || '');
  const [lessonsLearnedInput, setLessonsLearnedInput] = useState(assessment.lessonsLearned || '');
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillProof, setNewSkillProof] = useState('');

  // Synchronize when assessment prop changes
  React.useEffect(() => {
    setCurrentAssessment(assessment);
    setScoreInput(assessment.evaluation?.score?.toString() || '');
    setFeedbackInput(assessment.evaluation?.feedback || '');
    setResultInput(assessment.evaluation?.result || 'passed');
    setSubmissionUrlInput(assessment.submission.url || '');
    setSubmissionContentInput(assessment.submission.content || '');
    setLessonsLearnedInput(assessment.lessonsLearned || '');
  }, [assessment]);

  const handleSaveEvaluation = () => {
    const updated: JobAssessment = {
      ...currentAssessment,
      stage: 'evaluated',
      submission: {
        ...currentAssessment.submission,
        url: submissionUrlInput,
        content: submissionContentInput
      },
      evaluation: {
        evaluatedAt: currentAssessment.evaluation?.evaluatedAt || new Date().toISOString(),
        evaluatorName: currentAssessment.evaluation?.evaluatorName || 'Hiring Committee',
        evaluatorRole: currentAssessment.evaluation?.evaluatorRole || 'Evaluator',
        score: scoreInput,
        ratingTier: Number(scoreInput.replace(/\D/g, '')) >= 90 ? 'Exceptional' : 'Strong',
        feedback: feedbackInput,
        result: resultInput,
        rubricPerformance: currentAssessment.evaluation?.rubricPerformance
      },
      lessonsLearned: lessonsLearnedInput,
      updatedAt: new Date().toISOString()
    };

    const saved = jobAssessmentStore.saveAssessment(updated);
    setCurrentAssessment(saved);
    if (onAssessmentUpdated) onAssessmentUpdated(saved);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const newSkill: DemonstratedSkillItem = {
      skillName: newSkillName.trim(),
      level: 6,
      proofStatement: newSkillProof.trim() || `Demonstrated during ${currentAssessment.company} ${currentAssessment.assessmentType}.`
    };

    const updated: JobAssessment = {
      ...currentAssessment,
      skillsDemonstrated: [...currentAssessment.skillsDemonstrated, newSkill]
    };

    const saved = jobAssessmentStore.saveAssessment(updated);
    setCurrentAssessment(saved);
    setNewSkillName('');
    setNewSkillProof('');
    if (onAssessmentUpdated) onAssessmentUpdated(saved);
  };

  const handleRemoveSkill = (skillName: string) => {
    const updated: JobAssessment = {
      ...currentAssessment,
      skillsDemonstrated: currentAssessment.skillsDemonstrated.filter(s => s.skillName !== skillName)
    };
    const saved = jobAssessmentStore.saveAssessment(updated);
    setCurrentAssessment(saved);
    if (onAssessmentUpdated) onAssessmentUpdated(saved);
  };

  const handleConvertToEvidence = () => {
    setIsConverting(true);
    try {
      // First ensure latest edits are saved into assessment
      const assessmentToConvert: JobAssessment = {
        ...currentAssessment,
        submission: {
          ...currentAssessment.submission,
          url: submissionUrlInput,
          content: submissionContentInput
        },
        evaluation: {
          ...currentAssessment.evaluation,
          score: scoreInput || currentAssessment.evaluation?.score,
          feedback: feedbackInput || currentAssessment.evaluation?.feedback,
          result: resultInput || currentAssessment.evaluation?.result || 'passed',
          evaluatedAt: currentAssessment.evaluation?.evaluatedAt || new Date().toISOString()
        },
        lessonsLearned: lessonsLearnedInput || currentAssessment.lessonsLearned
      };
      jobAssessmentStore.saveAssessment(assessmentToConvert);

      // Perform promotion to Evidence
      const { assessment: converted } = jobAssessmentStore.convertToEvidence(assessmentToConvert.id);
      setCurrentAssessment(converted);
      setConversionSuccess(true);
      setActiveTab('reusable');
      if (onAssessmentUpdated) onAssessmentUpdated(converted);
    } catch (e) {
      console.error('Error converting assessment to evidence:', e);
    } finally {
      setIsConverting(false);
    }
  };

  const isConverted = currentAssessment.stage === 'converted_to_evidence' || Boolean(currentAssessment.convertedEvidenceId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* MODAL HEADER */}
        <div className="p-6 sm:p-7 border-b border-slate-100 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-slate-50/50">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {currentAssessment.roleCategory}
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-purple-100 text-purple-800">
                {currentAssessment.assessmentType}
              </span>
              {isConverted ? (
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Level {currentAssessment.evidenceStrength || 6} Validated Evidence
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                  Capability Demonstration Event
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {currentAssessment.title}
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 font-bold text-slate-900">
                <Building2 className="w-4 h-4 text-slate-400" />
                {currentAssessment.company}
              </span>
              <span>•</span>
              <span className="text-slate-700 font-medium">
                {currentAssessment.role}
              </span>
              {currentAssessment.deadline && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-amber-700">
                    <Clock className="w-3.5 h-3.5" />
                    Deadline: {new Date(currentAssessment.deadline).toLocaleDateString()}
                  </span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors cursor-pointer self-start"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 7-STEP CAPABILITY EVENT LIFECYCLE BAR */}
        <div className="px-6 py-3.5 bg-slate-900 text-white border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[580px] text-xs">
            <div className="flex items-center gap-1.5 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-[10px]">1</span>
              <span>Job Opportunity</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className="flex items-center gap-1.5 font-semibold text-slate-300">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-[10px]">2</span>
              <span>Assessment Prompt</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 font-semibold ${currentAssessment.submission.content ? 'text-emerald-400' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full ${currentAssessment.submission.content ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'} flex items-center justify-center font-bold text-[10px]`}>3</span>
              <span>Submission</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 font-semibold ${currentAssessment.evaluation?.score ? 'text-purple-400' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full ${currentAssessment.evaluation?.score ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'} flex items-center justify-center font-bold text-[10px]`}>4</span>
              <span>Evaluation</span>
            </div>
            <span className="text-slate-600">→</span>
            <div className={`flex items-center gap-1.5 font-semibold ${isConverted ? 'text-amber-300 font-bold' : 'text-slate-400'}`}>
              <span className={`w-5 h-5 rounded-full ${isConverted ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'} flex items-center justify-center font-bold text-[10px]`}>5</span>
              <span>Career Evidence</span>
            </div>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center px-6 border-b border-slate-200 bg-white overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab('case')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'case'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Case Prompt & Context
          </button>
          <button
            onClick={() => setActiveTab('submission')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'submission'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Candidate Submission ({currentAssessment.submission.attachments.length + (currentAssessment.submission.url ? 1 : 0)})
          </button>
          <button
            onClick={() => setActiveTab('evaluation')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'evaluation'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Evaluation & Score {currentAssessment.evaluation?.score ? `(${currentAssessment.evaluation.score})` : ''}</span>
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'skills'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Demonstrated Skills ({currentAssessment.skillsDemonstrated.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('reusable')}
            className={`px-4 py-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reusable'
                ? 'border-amber-500 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Reusable Career Outputs {isConverted ? '★' : ''}</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">

          {/* SUCCESS BANNER WHEN CONVERTED */}
          {conversionSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fadeIn">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold">Successfully Converted to Reusable Career Evidence!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  This case is now permanently grounded into your Career OS evidence ledger at <strong>Level 6 Validated Strength</strong>.
                  It now feeds directly into your Profile, Skill Intelligence, Job Matching, and Interview Preparation.
                </p>
              </div>
            </div>
          )}

          {/* TAB 1: CASE PROMPT & CONTEXT */}
          {activeTab === 'case' && (
            <div className="space-y-6">
              
              {/* Problem Prompt */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Official Case Prompt</span>
                  <span className="text-[11px] font-semibold text-slate-400">Captured from {currentAssessment.company}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                  {currentAssessment.casePrompt}
                </p>
              </div>

              {/* Context & Constraints */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Company & Background Context</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentAssessment.caseContext || 'Standard enterprise business context and capital constraints.'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Problem Constraints</span>
                  {currentAssessment.constraints && currentAssessment.constraints.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {currentAssessment.constraints.map((c, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-rose-500 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No specific constraints specified.</p>
                  )}
                </div>
              </div>

              {/* Deliverables Expected & Exhibits */}
              {currentAssessment.deliverablesExpected && currentAssessment.deliverablesExpected.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Deliverables Expected by Hiring Team</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentAssessment.deliverablesExpected.map((del, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentAssessment.exhibits && currentAssessment.exhibits.length > 0 && (
                <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Case Data Exhibits</span>
                  <div className="space-y-2">
                    {currentAssessment.exhibits.map(ex => (
                      <div key={ex.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{ex.title}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">{ex.type}</span>
                        </div>
                        {ex.preview && <p className="text-slate-600 text-[11px]">{ex.preview}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: CANDIDATE SUBMISSION */}
          {activeTab === 'submission' && (
            <div className="space-y-6">
              
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Submission Notes, Proposal & Executive Recommendation
                </label>
                <textarea
                  value={submissionContentInput}
                  onChange={(e) => setSubmissionContentInput(e.target.value)}
                  placeholder="Paste or write your case solution, structured framework, calculations, and strategic recommendation..."
                  rows={8}
                  className="w-full text-xs font-mono border border-slate-200 rounded-2xl p-4 focus:border-blue-500 focus:outline-hidden leading-relaxed text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deliverable URL (Figma, GitHub, Loom, Deck, Live Demo)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={submissionUrlInput}
                      onChange={(e) => setSubmissionUrlInput(e.target.value)}
                      placeholder="https://figma.com/... or https://docs.google.com/..."
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 focus:border-blue-500 focus:outline-hidden"
                    />
                    {submissionUrlInput && (
                      <a
                        href={submissionUrlInput}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Submitted Date / Timestamp
                  </label>
                  <div className="text-xs text-slate-600 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {currentAssessment.submission.submittedAt 
                      ? new Date(currentAssessment.submission.submittedAt).toLocaleString()
                      : 'Not submitted yet'}
                  </div>
                </div>
              </div>

              {/* Attachments list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Saved Attachments & Deliverables ({currentAssessment.submission.attachments.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentAssessment.submission.attachments.map(att => (
                    <div key={att.id} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <Paperclip className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">{att.name}</span>
                          <span className="text-[10px] text-slate-400">{att.type} • {att.size || '1.2 MB'}</span>
                        </div>
                      </div>
                      {att.url && (
                        <a
                          href={att.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 font-bold hover:underline shrink-0"
                        >
                          Open
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveEvaluation}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Submission Changes
                </button>
              </div>

            </div>
          )}

          {/* TAB 3: EVALUATION & RESULTS */}
          {activeTab === 'evaluation' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 text-purple-900 text-xs flex items-start gap-2.5">
                <Award className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <p>
                  <strong>Capability Demonstration Event:</strong> An assessment is an objective evaluation of capability by an external hiring team or benchmark rubric. Recording feedback and score grounds this as high-credibility career proof.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Score / Evaluation Tier</label>
                  <input
                    type="text"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    placeholder="e.g. 94/100, Top 3%, A+"
                    className="w-full text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 focus:border-purple-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Assessment Result</label>
                  <select
                    value={resultInput}
                    onChange={(e) => setResultInput(e.target.value as any)}
                    className="w-full text-xs font-semibold border border-slate-200 rounded-xl px-3 py-2.5 focus:border-purple-500 focus:outline-hidden bg-white"
                  >
                    <option value="passed">Passed Assessment</option>
                    <option value="offer">Offer Extended 🎉</option>
                    <option value="advanced">Advanced to Next Round</option>
                    <option value="top_tier">Top Tier Benchmark</option>
                    <option value="completed">Completed (Self-evaluated)</option>
                    <option value="rejected">Did Not Advance</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Evaluator / Reviewer</label>
                  <div className="text-xs text-slate-600 py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl">
                    {currentAssessment.evaluation?.evaluatorName || 'Hiring Team'} ({currentAssessment.evaluation?.evaluatorRole || 'Reviewer'})
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Company / Evaluator Feedback & Comments
                </label>
                <textarea
                  value={feedbackInput}
                  onChange={(e) => setFeedbackInput(e.target.value)}
                  placeholder="e.g. 'Strong unit economics and TAM calculations. Defended contrarian beachhead recommendation well during executive review.'"
                  rows={4}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-purple-500 focus:outline-hidden leading-relaxed text-slate-800"
                />
              </div>

              {/* Rubric scores if available */}
              {currentAssessment.evaluation?.rubricPerformance && currentAssessment.evaluation.rubricPerformance.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                    Rubric Breakdown & Performance
                  </span>
                  <div className="space-y-2">
                    {currentAssessment.evaluation.rubricPerformance.map((rubric, rIdx) => (
                      <div key={rIdx} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{rubric.criterion}</span>
                          {rubric.comments && <span className="text-slate-500 text-[11px]">{rubric.comments}</span>}
                        </div>
                        <span className="font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
                          {rubric.score} / {rubric.maxScore}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  onClick={handleSaveEvaluation}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Save Evaluation Details
                </button>
              </div>

            </div>
          )}

          {/* TAB 4: DEMONSTRATED SKILLS & LESSONS LEARNED */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Capabilities Proven in this Assessment ({currentAssessment.skillsDemonstrated.length})
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {currentAssessment.skillsDemonstrated.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/40 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-emerald-900">{item.skillName}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Level {item.level} Proof
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-normal">{item.proofStatement}</p>
                      </div>

                      <button
                        onClick={() => handleRemoveSkill(item.skillName)}
                        className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                        title="Remove skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Skill form */}
                <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Add Demonstrated Skill Proof</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      placeholder="e.g. Unit Economics, GTM Strategy, Design Systems"
                      className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                    />
                    <input
                      type="text"
                      value={newSkillProof}
                      onChange={(e) => setNewSkillProof(e.target.value)}
                      placeholder="Proof statement (how you demonstrated it)"
                      className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white"
                    />
                  </div>
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attach Skill Demonstration</span>
                  </button>
                </div>
              </div>

              {/* Lessons Learned & Candidate Retrospective */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Lessons Learned & Retrospective
                  </label>
                  <p className="text-[11px] text-slate-500">
                    What would you execute differently next time? What nuances in unit economics or stakeholder alignment did you discover?
                  </p>
                </div>

                <textarea
                  value={lessonsLearnedInput}
                  onChange={(e) => setLessonsLearnedInput(e.target.value)}
                  placeholder="e.g. 'In international SaaS expansion, customer willingness-to-pay cannot be decoupled from local distributor commissions...'"
                  rows={3}
                  className="w-full text-xs border border-slate-200 rounded-xl p-3 focus:border-blue-500 focus:outline-hidden leading-relaxed text-slate-800"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveEvaluation}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Save Lessons Learned
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: REUSABLE CAREER OS OUTPUTS */}
          {activeTab === 'reusable' && (
            <div className="space-y-6">
              
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-950">Reusable Career Evidence Intelligence</h4>
                  <p className="mt-0.5 text-amber-900/90 leading-relaxed">
                    By completing and converting this assessment, it is now an active capability asset powering 6 key Career OS subsystems.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Profile */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>1. Profile Credibility Statement</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentAssessment.reusableOutputs?.profileStatement || 
                     `Demonstrated ${currentAssessment.assessmentType} capability evaluated by ${currentAssessment.company} (${currentAssessment.evaluation?.score || 'Validated'}).`}
                  </p>
                </div>

                {/* 2. Skill Intelligence */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>2. Skill Intelligence Graph Proof</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentAssessment.reusableOutputs?.skillIntelligenceProof || 
                     `Elevates demonstrated skills [${currentAssessment.skillsDemonstrated.map(s => s.skillName).join(', ')}] to Level 6 Validated strength.`}
                  </p>
                </div>

                {/* 3. Job Matching */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span>3. Job Evidence Match Boost</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentAssessment.reusableOutputs?.jobMatchBoost || 
                     `Satisfies core competencies for ${currentAssessment.roleCategory} positions with verified candidate proof.`}
                  </p>
                </div>

                {/* 4. Interview Preparation */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <FileText className="w-4 h-4 text-rose-600" />
                    <span>4. Interview Preparation (STAR Story)</span>
                  </div>
                  {currentAssessment.reusableOutputs?.interviewStory ? (
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <div><strong className="text-slate-900">Prompt:</strong> {currentAssessment.reusableOutputs.interviewStory.practicePrompt}</div>
                      <div><strong className="text-slate-900">Result:</strong> {currentAssessment.reusableOutputs.interviewStory.result}</div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Ready to simulate interview questions based on this completed case.</p>
                  )}
                </div>

                {/* 5. Portfolio */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>5. Verified Portfolio Artifact</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentAssessment.reusableOutputs?.portfolioHighlight || 
                     `${currentAssessment.title} (${currentAssessment.company} ${currentAssessment.assessmentType} Deliverable)`}
                  </p>
                </div>

                {/* 6. Career Narrative */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Award className="w-4 h-4 text-amber-600" />
                    <span>6. Career Narrative Resume Bullet</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-mono">
                    {currentAssessment.reusableOutputs?.careerNarrativeBullet || 
                     `Delivered ${currentAssessment.title} for ${currentAssessment.company} demonstrating ${currentAssessment.skillsDemonstrated.map(s => s.skillName).join(', ')}.`}
                  </p>
                </div>

              </div>

              {currentAssessment.convertedEvidenceId && onOpenSourceInLibrary && (
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => onOpenSourceInLibrary(currentAssessment.convertedEvidenceId!)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Inspect Evidence Ledger Entry</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Status:</span>
            <span className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
              isConverted ? 'bg-emerald-100 text-emerald-800' :
              currentAssessment.evaluation?.score ? 'bg-purple-100 text-purple-800' :
              currentAssessment.submission.content ? 'bg-blue-100 text-blue-800' :
              'bg-slate-200 text-slate-700'
            }`}>
              {isConverted ? 'Converted to Career Evidence' : 
               currentAssessment.evaluation?.score ? `Evaluated (${currentAssessment.evaluation.result})` :
               currentAssessment.submission.content ? 'Submitted' : 'In Progress'}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Close
            </button>

            {!isConverted ? (
              <button
                onClick={handleConvertToEvidence}
                disabled={isConverting}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isConverting ? 'Promoting to Evidence...' : 'Convert to Career Evidence'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (onOpenSourceInLibrary && currentAssessment.convertedEvidenceId) {
                    onClose();
                    onOpenSourceInLibrary(currentAssessment.convertedEvidenceId);
                  } else {
                    setActiveTab('reusable');
                  }
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>View in Evidence Ledger</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
