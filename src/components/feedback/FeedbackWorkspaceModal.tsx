import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Award, 
  Hammer, 
  BookOpen, 
  Send, 
  MessageSquare, 
  TrendingUp, 
  RotateCcw, 
  ShieldCheck, 
  Check, 
  Lightbulb, 
  AlertCircle,
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import { FeedbackRequest } from '../../types/expertFeedback';
import { ExpertFeedbackService } from '../../services/expertFeedbackService';

interface FeedbackWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
  onNavigateToBuilderMatch?: () => void;
  onNavigateToKnowledge?: () => void;
  onAddToCareerEvidence?: (evidenceData: any) => void;
}

export const FeedbackWorkspaceModal: React.FC<FeedbackWorkspaceModalProps> = ({
  isOpen,
  onClose,
  requestId,
  onNavigateToBuilderMatch,
  onNavigateToKnowledge,
  onAddToCareerEvidence
}) => {
  const [request, setRequest] = useState<FeedbackRequest | null>(() => {
    return requestId ? ExpertFeedbackService.getRequestById(requestId) : null;
  });

  const [activeTab, setActiveTab] = useState<'feedback' | 'iterations' | 'discussion'>('feedback');
  const [isImprovingWork, setIsImprovingWork] = useState(false);
  const [improvedAnswer, setImprovedAnswer] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');
  const [isSimulatingResponse, setIsSimulatingResponse] = useState(false);
  const [savedResourceIds, setSavedResourceIds] = useState<string[]>([]);
  const [evidenceCreatedSuccess, setEvidenceCreatedSuccess] = useState(false);

  // Sync request when ID changes
  React.useEffect(() => {
    if (requestId) {
      const found = ExpertFeedbackService.getRequestById(requestId);
      setRequest(found);
      if (found) {
        setImprovedAnswer(found.context.workSubmittedContent);
      }
    }
  }, [requestId]);

  if (!isOpen || !request) return null;

  const expert = ExpertFeedbackService.getExpertById(request.expertId || 'expert-sarah-chen');
  const hasDeliveredFeedback = request.status === 'feedback_delivered' && request.expertFeedback;

  const handleSimulateDelivery = () => {
    setIsSimulatingResponse(true);
    setTimeout(() => {
      const delivered = ExpertFeedbackService.deliverSimulatedFeedback(request.id);
      if (delivered) {
        setRequest({ ...delivered });
      }
      setIsSimulatingResponse(false);
    }, 600);
  };

  const handleSubmitImprovement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!improvedAnswer.trim()) return;

    const updated = ExpertFeedbackService.submitPracticeImprovement(request.id, improvedAnswer);
    if (updated) {
      setRequest({ ...updated });
      setIsImprovingWork(false);
    }
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpInput.trim()) return;

    const updated = ExpertFeedbackService.sendFollowUpMessage(request.id, followUpInput);
    if (updated) {
      setRequest({ ...updated });
      setFollowUpInput('');
      // Re-fetch after 1.5s to see expert reply
      setTimeout(() => {
        const refreshed = ExpertFeedbackService.getRequestById(request.id);
        if (refreshed) setRequest({ ...refreshed });
      }, 1400);
    }
  };

  const handleSaveResource = (resourceId: string) => {
    setSavedResourceIds(prev => [...prev, resourceId]);
  };

  const handleCreateEvidence = () => {
    if (onAddToCareerEvidence && request.expertFeedback) {
      onAddToCareerEvidence({
        title: request.context.workSubmittedTitle,
        capability: request.context.relevantCapability,
        expertValidation: {
          expertName: request.expertFeedback.expertName,
          score: request.expertFeedback.scoreAfter,
          overallAssessment: request.expertFeedback.overallAssessment,
          deliveredAt: request.expertFeedback.deliveredAt
        },
        outcome: `Validated with ${request.expertFeedback.expertName} (+5% readiness lift: ${request.expertFeedback.scoreBefore}% → ${request.expertFeedback.scoreAfter}%)`
      });
      setEvidenceCreatedSuccess(true);
      setTimeout(() => setEvidenceCreatedSuccess(false), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150 text-left">
        
        {/* ==================================================
            1. HEADER & STATUS BAR
            ================================================== */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                hasDeliveredFeedback
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse'
              }`}>
                {hasDeliveredFeedback ? 'Feedback Delivered' : 'Waiting for Expert Review'}
              </span>

              <span className="text-2xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                Format: {request.feedbackFormat === 'async' ? 'Async Review' : '1:1 Session'}
              </span>
            </div>

            <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">
              {request.context.workSubmittedTitle}
            </h1>

            <p className="text-xs text-slate-500 font-medium">
              Target Capability: <strong className="text-slate-800">{request.context.relevantCapability}</strong> · Reviewer: <strong className="text-blue-700">{request.expertName}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!hasDeliveredFeedback && (
              <button
                type="button"
                onClick={handleSimulateDelivery}
                disabled={isSimulatingResponse}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 text-xs font-black rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                title="Prototype simulation: Deliver Expert Review"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-900" />
                <span>{isSimulatingResponse ? 'Processing Review...' : 'Simulate Expert Reply'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================
            2. SUB-TABS (Expert Feedback | Practice Iterations | Discussion)
            ================================================== */}
        <div className="px-6 border-b border-slate-100 bg-white flex items-center gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('feedback')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'feedback'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Expert Feedback</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('iterations')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'iterations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Practice Iterations ({request.iterations?.length || 1})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('discussion')}
            className={`py-3.5 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'discussion'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Ask Follow-Up ({request.followUpMessages?.length || 0})</span>
          </button>
        </div>

        {/* ==================================================
            3. CONTENT BODY
            ================================================== */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50/50">
          
          {/* TAB 1: EXPERT FEEDBACK */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              
              {/* Submitted Work Summary Accordion */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-2xs font-extrabold uppercase tracking-wider text-slate-400">
                  <span>Your Submitted Work &amp; Solution</span>
                  <span className="text-blue-600 font-bold">{request.context.sourceType.toUpperCase()} SUBMISSION</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 whitespace-pre-line leading-relaxed font-mono">
                  {request.context.workSubmittedContent}
                </div>
              </div>

              {/* EXPERT FEEDBACK PANEL (When delivered) */}
              {hasDeliveredFeedback && request.expertFeedback ? (
                <div className="space-y-5 animate-in fade-in duration-200">
                  
                  {/* Expert Assessment Hero Card */}
                  <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-blue-500/30">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 text-white font-black text-base flex items-center justify-center border border-white/20 shrink-0">
                          {request.expertName?.split(' ').map(n => n[0]).join('') || 'SC'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white">{request.expertName}</span>
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3 text-emerald-400" />
                              Verified Practitioner Feedback
                            </span>
                          </div>
                          <p className="text-2xs text-blue-200">{expert?.role} · {expert?.company}</p>
                        </div>
                      </div>

                      {/* Readiness progression benchmark (Section 12 & 14) */}
                      <div className="bg-white/10 backdrop-blur-md p-3 px-4 rounded-2xl border border-white/10 text-right shrink-0">
                        <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">
                          Capability Readiness Lift
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs line-through text-slate-400 font-bold">
                            {request.expertFeedback.scoreBefore}%
                          </span>
                          <span className="text-xl font-black text-emerald-400">
                            → {request.expertFeedback.scoreAfter}%
                          </span>
                          <span className="text-2xs font-extrabold text-emerald-300 bg-emerald-900/60 px-1.5 py-0.2 rounded">
                            +5% Lift
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                        Overall Assessment
                      </span>
                      <p className="text-sm font-bold text-white">
                        &ldquo;{request.expertFeedback.overallAssessment}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* What Worked & What Could Improve (Section 10) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        What Worked
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {request.expertFeedback.whatWorked.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                      <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 text-amber-600" />
                        What Could Improve
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {request.expertFeedback.whatCouldImprove.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Concrete Expert Recommendation */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>Expert Strategic Recommendation</span>
                    </div>
                    <p className="text-xs text-blue-950 font-medium leading-relaxed">
                      {request.expertFeedback.expertRecommendation}
                    </p>
                  </div>

                  {/* Recommended Resources (Section 19: Save to Knowledge) */}
                  {request.expertFeedback.recommendedResources && request.expertFeedback.recommendedResources.length > 0 && (
                    <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-blue-600" />
                          Recommended Resources from Expert
                        </span>
                      </div>

                      <div className="space-y-2">
                        {request.expertFeedback.recommendedResources.map(res => {
                          const isSaved = savedResourceIds.includes(res.id);
                          return (
                            <div key={res.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3">
                              <div>
                                <h5 className="text-xs font-bold text-slate-900">{res.title}</h5>
                                <p className="text-2xs text-slate-500">{res.type}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleSaveResource(res.id)}
                                className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                                  isSaved
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-700'
                                }`}
                              >
                                {isSaved ? <Check className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                                <span>{isSaved ? 'Saved to Knowledge' : 'Save Resource'}</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ==================================================
                      WHAT DO YOU WANT TO DO NEXT? (SECTION 11, 13, 25)
                      ================================================== */}
                  <div className="p-5 rounded-3xl bg-white border-2 border-blue-500/40 shadow-md space-y-4">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 fill-blue-600" />
                        Next Career Growth Loop Actions
                      </span>
                      <h3 className="text-sm font-black text-slate-900">What do you want to do next?</h3>
                      <p className="text-2xs text-slate-500">
                        Turn this feedback into tangible proof, improved work, or an active team build.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                      
                      {/* Action 1: Improve Work */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsImprovingWork(true);
                          setActiveTab('iterations');
                        }}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-blue-400 bg-slate-50/70 hover:bg-white text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                      >
                        <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">Improve my work</h4>
                        <p className="text-[10px] text-slate-500">Create a calibrated Practice #2 iteration</p>
                      </button>

                      {/* Action 2: Find a Build (Section 25 Scenario) */}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (onNavigateToBuilderMatch) onNavigateToBuilderMatch();
                        }}
                        className="p-3.5 rounded-2xl border border-amber-300 bg-amber-50/40 hover:bg-amber-50 text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                      >
                        <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Hammer className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-amber-950">Find a Build</h4>
                        <p className="text-[10px] text-amber-800">Prove capability in Builder Match challenge</p>
                      </button>

                      {/* Action 3: Ask Follow-up */}
                      <button
                        type="button"
                        onClick={() => setActiveTab('discussion')}
                        className="p-3.5 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-white text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                      >
                        <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <MessageSquare className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900">Ask a follow-up</h4>
                        <p className="text-[10px] text-slate-500">Clarify strategic advice with {request.expertName}</p>
                      </button>

                      {/* Action 4: Add to Career Evidence (Section 13) */}
                      <button
                        type="button"
                        onClick={handleCreateEvidence}
                        className="p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50 text-left transition-all cursor-pointer space-y-1 shadow-3xs group"
                      >
                        <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Award className="w-3.5 h-3.5" />
                        </div>
                        <h4 className="text-xs font-bold text-emerald-950">
                          {evidenceCreatedSuccess ? 'Evidence Created!' : 'Add to Evidence'}
                        </h4>
                        <p className="text-[10px] text-emerald-800">Attach expert validation to Profile</p>
                      </button>

                    </div>
                  </div>

                </div>
              ) : (
                /* WAITING STATE */
                <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Review in progress with {request.expertName}</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                      Your practice case and context are being reviewed. Expected turnaround is within 24 hours.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSimulateDelivery}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                    >
                      Fast-Forward Prototype: View Sarah Chen&apos;s Review
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: PRACTICE ITERATIONS (Section 12: Practice #1 → Practice #2 Loop) */}
          {activeTab === 'iterations' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Practice Improvement Loop</h3>
                  <p className="text-2xs text-slate-500">
                    Track incremental score calibration between practice attempts
                  </p>
                </div>

                {!isImprovingWork && (
                  <button
                    type="button"
                    onClick={() => setIsImprovingWork(true)}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    + New Iteration
                  </button>
                )}
              </div>

              {/* In-place Iteration Editor */}
              {isImprovingWork && (
                <form onSubmit={handleSubmitImprovement} className="p-5 rounded-2xl bg-white border-2 border-blue-500 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-900">
                      Draft Iteration #{(request.iterations?.length || 1) + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsImprovingWork(false)}
                      className="text-2xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-2xs text-slate-500">
                    Apply Sarah Chen&apos;s recommendation: explicitly declare what you are NOT building in v1 to protect shipping velocity.
                  </p>

                  <textarea
                    rows={5}
                    value={improvedAnswer}
                    onChange={(e) => setImprovedAnswer(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Refine your strategy answer..."
                  />

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsImprovingWork(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
                    >
                      Submit Calibrated Iteration
                    </button>
                  </div>
                </form>
              )}

              {/* Iterations Timeline */}
              <div className="space-y-3">
                {request.iterations?.map((iter, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 font-black text-xs flex items-center justify-center">
                          #{iter.iterationNumber}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">
                          Practice Attempt #{iter.iterationNumber}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                          Score: {iter.score}%
                        </span>
                        <span className="text-2xs text-slate-400">
                          {new Date(iter.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 whitespace-pre-line font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {iter.submittedAnswer}
                    </p>

                    {iter.deltaSummary && (
                      <div className="text-2xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 inline-block">
                        {iter.deltaSummary}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: DISCUSSION / ASK FOLLOW-UP */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Direct Expert Coaching Thread</h3>
                <p className="text-2xs text-slate-500">
                  Ask clarifying questions about the feedback directly with {request.expertName}
                </p>
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 min-h-[200px]">
                {(!request.followUpMessages || request.followUpMessages.length === 0) ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No follow-up questions asked yet. Ask {request.expertName} for specific tactical advice.
                  </div>
                ) : (
                  request.followUpMessages.map((msg, idx) => {
                    const isUser = msg.sender === 'user';
                    return (
                      <div
                        key={idx}
                        className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-lg bg-indigo-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {expert?.name[0] || 'S'}
                          </div>
                        )}
                        <div className={`p-3.5 rounded-2xl max-w-md text-xs leading-relaxed ${
                          isUser 
                            ? 'bg-blue-600 text-white rounded-br-xs' 
                            : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-3xs'
                        }`}>
                          <div className="text-[10px] opacity-75 font-bold mb-1">
                            {msg.senderName}
                          </div>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendFollowUp} className="flex gap-2 pt-2">
                <input
                  type="text"
                  value={followUpInput}
                  onChange={(e) => setFollowUpInput(e.target.value)}
                  placeholder={`Ask ${request.expertName} a follow-up question...`}
                  className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          )}

        </div>

        {/* ==================================================
            4. FOOTER
            ================================================== */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-3">
          <div className="text-2xs text-slate-500">
            Expert Review attached to active mission: <strong className="text-slate-800">{request.context.careerGoal}</strong>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition cursor-pointer"
          >
            Close Workspace
          </button>
        </div>

      </div>
    </div>
  );
};
