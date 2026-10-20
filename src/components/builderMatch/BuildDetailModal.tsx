import React, { useState } from 'react';
import { 
  X, 
  Bookmark, 
  Sparkles, 
  Clock, 
  Users, 
  MapPin, 
  Building2, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  BookOpen, 
  ArrowUpRight, 
  UserPlus, 
  Share2, 
  ShieldCheck, 
  Cpu, 
  Briefcase, 
  Code, 
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { BuildOpportunity, BuilderProfile } from '../../types/builderMatch';

interface BuildDetailModalProps {
  opportunity: BuildOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinBuild: (opportunity: BuildOpportunity, role: string) => void;
  onFormTeam: (opportunity: BuildOpportunity) => void;
  onSelectBuilder: (builder: BuilderProfile) => void;
  onInviteBuilder: (builder: BuilderProfile, opportunity: BuildOpportunity) => void;
  onToggleSave: (id: string) => void;
  onOpenKnowledge: (topicTitle: string) => void;
}

export const BuildDetailModal: React.FC<BuildDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onJoinBuild,
  onFormTeam,
  onSelectBuilder,
  onInviteBuilder,
  onToggleSave,
  onOpenKnowledge
}) => {
  if (!isOpen || !opportunity) return null;

  const [selectedRoleToJoin, setSelectedRoleToJoin] = useState(
    opportunity.idealBuilderProfile.suggestedRoles[0] || 'Product Lead'
  );
  const [joinedSuccess, setJoinedSuccess] = useState(false);

  const handleJoin = () => {
    onJoinBuild(opportunity, selectedRoleToJoin);
    setJoinedSuccess(true);
    setTimeout(() => {
      setJoinedSuccess(false);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200">
      
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-left"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ==================================================
            1. TOP BAR: Type Kicker, Save, Close
            ================================================== */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="uppercase tracking-wider font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {opportunity.type.replace('_', ' ')}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Status: <strong className="text-emerald-700 font-bold capitalize">{opportunity.status}</strong></span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-slate-500">{opportunity.domain}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.id)}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                opportunity.isSaved 
                  ? 'text-blue-600 bg-blue-50 border-blue-200' 
                  : 'text-slate-400 hover:text-slate-700 border-slate-200 bg-white hover:bg-slate-50'
              }`}
              title={opportunity.isSaved ? 'Saved to My Builds' : 'Save for later'}
            >
              <Bookmark className={`w-4 h-4 ${opportunity.isSaved ? 'fill-blue-600' : ''}`} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ==================================================
            MODAL BODY: Scrollable Workspace
            ================================================== */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8">
          
          {/* HEADER SECTION: Title, Organization, Match */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                  {opportunity.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 font-medium flex items-center gap-2">
                  <span>Initiated by <strong className="text-slate-800">{opportunity.creator.name}</strong></span>
                  {opportunity.creator.organization && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">/</span>
                      <span className="text-slate-700">{opportunity.creator.organization}</span>
                    </>
                  )}
                </p>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-2xl border border-emerald-200 shrink-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-base shadow-xs">
                  {opportunity.matchScore}%
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-800 block">AI Builder Match</span>
                  <span className="text-xs font-semibold text-emerald-950">High Complementary Fit</span>
                </div>
              </div>
            </div>

            {/* Unboxed Metadata Strip (Zero-Pill Discipline) */}
            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-600 font-medium">
              <span className="flex items-center gap-1.5 text-slate-800">
                <Clock className="w-4 h-4 text-blue-600" />
                Duration: <strong>{opportunity.duration}</strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 text-slate-800">
                <Users className="w-4 h-4 text-blue-600" />
                Team Size: <strong>{opportunity.teamSizeNeeded}</strong>
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Work Mode: <strong>{opportunity.workMode}</strong></span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Difficulty: <strong>{opportunity.difficulty}</strong></span>
            </div>
          </div>

          {/* ==================================================
              SECTION: The Challenge Deep Dive (Requirement 6)
              ================================================== */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-600" />
              The Challenge &amp; Problem Context
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-slate-700">Current Situation &amp; Background</p>
                <p className="text-slate-600 leading-relaxed">{opportunity.challenge.currentSituation}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">The Core Friction / Problem</p>
                <p className="text-slate-600 leading-relaxed">{opportunity.challenge.problem}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">Why It Matters &amp; Business Impact</p>
                <p className="text-slate-600 leading-relaxed">{opportunity.challenge.whyItMatters}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">What Has Already Been Tried</p>
                <p className="text-slate-600 leading-relaxed">{opportunity.challenge.whatHasBeenTried}</p>
              </div>
            </div>

            {/* Constraints */}
            {opportunity.challenge.constraints.length > 0 && (
              <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                <p className="text-2xs font-bold uppercase tracking-wider text-slate-500">Known Constraints &amp; Guardrails</p>
                <ul className="text-xs text-slate-600 space-y-1">
                  {opportunity.challenge.constraints.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ==================================================
              SECTION: What Needs to be Built / Solved (Requirement 6)
              ================================================== */}
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-indigo-600" />
              Expected Outcomes &amp; Deliverables
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {opportunity.expectedOutcomes.map((outcome, idx) => (
                <div 
                  key={idx} 
                  className="p-3 rounded-xl bg-white border border-slate-200/90 shadow-3xs flex items-start gap-2.5 text-xs text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium leading-snug">{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              SECTION: Available Resources (Requirement 6)
              ================================================== */}
          <div className="space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              Available Resources &amp; Sandbox Access
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {opportunity.availableResources.map((res, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between text-2xs font-bold uppercase tracking-wider text-slate-400">
                    <span>{res.type}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">{res.name}</h4>
                  <p className="text-2xs text-slate-600 leading-relaxed">{res.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              SECTION: Ideal Builder Profile (Requirement 6)
              ================================================== */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Ideal Builder Squad Profile
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Suggested roles:</span>
              {opportunity.idealBuilderProfile.suggestedRoles.map((role, idx) => (
                <span 
                  key={idx} 
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {role}
                </span>
              ))}
            </div>

            <div className="pt-2 text-xs text-slate-600 flex flex-wrap gap-x-2 gap-y-1">
              <span className="text-slate-400">Target capabilities:</span>
              {opportunity.idealBuilderProfile.capabilities.map((cap, idx) => (
                <span key={idx} className="font-medium text-slate-700">
                  {cap}{idx < opportunity.idealBuilderProfile.capabilities.length - 1 ? ' ·' : ''}
                </span>
              ))}
            </div>
          </div>

          {/* ==================================================
              SECTION: Build Readiness (Requirement 16)
              ================================================== */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-white border border-blue-200/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-2xs font-bold uppercase tracking-wider text-blue-700">Personal Evaluation</span>
                <h3 className="text-base font-extrabold text-slate-900">Your Build Readiness: {opportunity.userReadiness.score}%</h3>
              </div>
              <div className="w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden shrink-0">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${opportunity.userReadiness.score}%` }} 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-blue-100 space-y-1">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Your Key Strengths
                </span>
                <ul className="text-slate-600 space-y-0.5 pl-5 list-disc text-2xs">
                  {opportunity.userReadiness.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3 bg-white rounded-xl border border-blue-100 space-y-1">
                <span className="font-bold text-amber-800 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Complementary Gaps Identified
                </span>
                <ul className="text-slate-600 space-y-0.5 pl-5 list-disc text-2xs">
                  {opportunity.userReadiness.gaps.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* What you need to close the gap */}
            <div className="text-xs text-slate-700 bg-white/80 p-3 rounded-xl border border-blue-100 space-y-1">
              <p className="font-bold text-slate-900">What you need to close the gap:</p>
              <ul className="text-slate-600 space-y-1">
                {opportunity.userReadiness.whatToCloseGap.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* ==================================================
              SECTION: Knowledge Library Integration (Requirement 15)
              ================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Recommended Knowledge &amp; Frameworks
              </h2>
              <span className="text-2xs text-slate-400">Loop: Gap → Learn → Build → Evidence</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {opportunity.recommendedKnowledge.map((kn) => (
                <div 
                  key={kn.id} 
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-2 shadow-3xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-2xs font-semibold text-slate-400">
                      <span>{kn.category} · {kn.duration}</span>
                      <span className="text-blue-600 font-bold">{kn.tag}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{kn.title}</h4>
                    <p className="text-2xs text-slate-500">{kn.relevanceReason}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenKnowledge(kn.title)}
                    className="self-start text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer pt-1"
                  >
                    <span>Learn &amp; Build</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================
              SECTION: Recommended Builders / Co-Builders (Requirement 7 & 8)
              ================================================== */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-600" />
                Recommended Co-Builders for this Challenge
              </h2>
              <span className="text-2xs text-slate-500 font-medium">Matched on skills, evidence &amp; complementary gaps</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {opportunity.recommendedBuilders.map((builder) => (
                <div 
                  key={builder.id} 
                  className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 text-left shadow-3xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={builder.avatar} 
                          alt={builder.name} 
                          className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0" 
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">{builder.name}</h4>
                          <span className="text-2xs text-slate-500">{builder.primaryRole}</span>
                        </div>
                      </div>
                      <span className="text-2xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {builder.matchScore}%
                      </span>
                    </div>

                    <p className="text-2xs text-slate-600 line-clamp-2">
                      {builder.whyMatch[0]}
                    </p>

                    {builder.potentialGap && (
                      <p className="text-[10px] text-amber-800 bg-amber-50/60 p-1 rounded font-medium line-clamp-1">
                        Gap: {builder.potentialGap.split('—')[0]}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => onSelectBuilder(builder)}
                      className="text-2xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onInviteBuilder(builder, opportunity)}
                      className="flex items-center gap-1 text-2xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Invite</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ==================================================
            FOOTER ACTION BAR: Builder-Oriented Actions (NEVER "Apply")
            ================================================== */}
        <div className="px-6 py-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-700">Join as:</label>
            <select
              value={selectedRoleToJoin}
              onChange={(e) => setSelectedRoleToJoin(e.target.value)}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              {opportunity.idealBuilderProfile.suggestedRoles.map((role, idx) => (
                <option key={idx} value={role}>{role}</option>
              ))}
              <option value="Independent Collaborator">Independent Collaborator</option>
            </select>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onFormTeam(opportunity)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            >
              Form a Team
            </button>

            <button
              type="button"
              onClick={handleJoin}
              className={`flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer active:scale-95 ${
                joinedSuccess 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {joinedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Joined Build! (Added to My Builds)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Join Build as {selectedRoleToJoin}</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
