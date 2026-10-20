import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Calendar, 
  MapPin, 
  Sparkles, 
  Trophy, 
  Rocket, 
  Gift, 
  CheckCircle2, 
  Radar, 
  ArrowUpRight, 
  Clock, 
  ShieldCheck, 
  Tag, 
  ThumbsUp, 
  Share2, 
  Check, 
  Layers,
  ChevronRight,
  Award,
  Hammer,
  Target,
  CheckSquare
} from 'lucide-react';
import { CareerOpportunity } from '../../types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { ParticipationType } from '../../features/applications/types';

interface OpportunityDetailModalProps {
  opportunity: CareerOpportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleRadar: (opp: CareerOpportunity) => void;
  isInRadar: boolean;
  onSelectRelated?: (opp: CareerOpportunity) => void;
  relatedOpportunities?: CareerOpportunity[];
  onBuildMission?: (title: string, domain?: string) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  onToggleRadar,
  isInRadar,
  onSelectRelated,
  relatedOpportunities = [],
  onBuildMission,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const applications = applicationStore.getApplications();
  const linkedItem = opportunity ? applications.find(a => 
    a.roleTitle.toLowerCase() === opportunity.title.toLowerCase() ||
    a.hackathonData?.projectName?.toLowerCase() === opportunity.title.toLowerCase()
  ) : undefined;

  const handleTrackInParticipationTracker = () => {
    if (!opportunity) return;
    const titleLower = (opportunity.title || '').toLowerCase();
    const typeLower = (opportunity.type || '').toLowerCase();
    const subtypeLower = (opportunity.subtype || '').toLowerCase();

    let pType: ParticipationType = 'career_opportunity';
    if (titleLower.includes('workshop') || typeLower.includes('workshop')) {
      pType = 'workshop';
    } else if (titleLower.includes('conference') || typeLower.includes('conference')) {
      pType = 'conference';
    } else if (titleLower.includes('meetup') || typeLower.includes('meetup')) {
      pType = 'meetup';
    } else if (titleLower.includes('webinar') || typeLower.includes('webinar')) {
      pType = 'webinar';
    } else if (titleLower.includes('seminar') || typeLower.includes('seminar')) {
      pType = 'seminar';
    } else if (typeLower === 'challenge' || subtypeLower.includes('hackathon') || titleLower.includes('hackathon')) {
      pType = 'hackathon';
    } else if (typeLower === 'competition' || subtypeLower.includes('competition') || titleLower.includes('competition')) {
      pType = 'competition';
    } else if (typeLower === 'volunteer' || titleLower.includes('volunteer')) {
      pType = 'volunteer';
    } else if (titleLower.includes('bootcamp')) {
      pType = 'bootcamp';
    }

    applicationStore.createApplicationFromOpportunity({
      jobOpportunityId: opportunity.id,
      roleTitle: opportunity.title,
      companyName: opportunity.organization,
      organization: opportunity.organization,
      location: opportunity.location,
      isOnline: opportunity.isRemote,
      jobUrl: opportunity.applicationUrl,
      domain: opportunity.industry,
      priority: 'HIGH',
      participationType: pType,
      deadline: opportunity.deadline,
      startDate: opportunity.startDate || opportunity.deadline,
      expectedOutcome: opportunity.reward || (opportunity.benefits && opportunity.benefits[0]),
      relatedOpportunityId: opportunity.id,
      relatedOpportunityTitle: `${opportunity.title} (${opportunity.organization})`,
      hackathonData: (pType === 'hackathon' || (pType as string) === 'challenge_hackathon') ? {
        teamName: 'Squad Alpha',
        projectName: opportunity.title,
        projectDescription: opportunity.description,
        deliverables: [
          { id: 'del-1', title: 'Problem Discovery & Concept Note', completed: true },
          { id: 'del-2', title: 'Prototype Solution & Architecture', completed: false },
          { id: 'del-3', title: 'Pitch Deck & Final Demo Submission', completed: false }
        ]
      } : undefined
    });

    window.dispatchEvent(new CustomEvent('career_applications_updated'));
    setToastMessage('Converted & tracked in Participation Tracker!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleViewInTracker = (itemId: string) => {
    onClose();
    window.dispatchEvent(new CustomEvent('open_participation_item', { detail: { itemId } }));
  };

  if (!isOpen || !opportunity) return null;

  const commercial = opportunity.commercial;
  const isCompanySignal = opportunity.type === 'company_signal';
  const signal = opportunity.companySignal;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
      />

      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* ==================================================
            1. MODAL TOP BAR & ACTIONS
            ================================================== */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="text-2xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {opportunity.type.replace('_', ' ')}
            </span>
            {commercial?.sponsorshipStatus === 'partner' && (
              <span className="text-2xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                <span>Partner Program</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Share Opportunity"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* ==================================================
              HEADER SECTION
              ================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border border-slate-200/90 overflow-hidden shrink-0 flex items-center justify-center shadow-3xs">
                  {opportunity.organizationLogo ? (
                    <img 
                      src={opportunity.organizationLogo} 
                      alt={opportunity.organization} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-slate-400" />
                  )}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {opportunity.organization}
                  </div>
                  <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                    {opportunity.title}
                  </h1>
                </div>
              </div>

              {/* Primary Header CTAs */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => onToggleRadar(opportunity)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isInRadar
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-3xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Radar className={`w-4 h-4 ${isInRadar ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{isInRadar ? 'Tracked in Radar' : 'Add to Radar'}</span>
                </button>

                {/* Participation Tracker Action */}
                {linkedItem ? (
                  <button
                    type="button"
                    onClick={() => handleViewInTracker(linkedItem.id)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all cursor-pointer shadow-3xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>View in Tracker</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleTrackInParticipationTracker}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all cursor-pointer shadow-3xs"
                  >
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>+ Add to Tracker</span>
                  </button>
                )}

                <a
                  href={opportunity.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <span>{opportunity.ctaText || 'Apply / Join'}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Context Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/80 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status</span>
                <span className="font-bold text-emerald-700 capitalize flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {opportunity.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deadline</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  {opportunity.deadline || 'Rolling basis'}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5" title={opportunity.location}>
                  {opportunity.location}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Industry</span>
                <span className="font-bold text-slate-800 truncate block mt-0.5">
                  {opportunity.industry}
                </span>
              </div>
            </div>
          </div>

          {/* ==================================================
              READINESS & BUILD A MISSION CARD
              ================================================== */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-500/30">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-300" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">
                  Career Readiness Calibration
                </span>
              </div>
              <div className="text-sm font-bold text-white">
                You are currently <strong className="text-emerald-300">76% ready</strong> for this opportunity.
              </div>
              <p className="text-2xs text-blue-200">
                Activate a customized Career Mission to build prerequisite evidence, practice interview blueprints, and maximize selection odds.
              </p>
            </div>

            <button
              type="button"
              id="opp-build-mission-btn"
              onClick={() => {
                onClose();
                if (onBuildMission) onBuildMission(opportunity.title, opportunity.industry);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Target className="w-4 h-4" />
              <span>Build a Mission</span>
            </button>
          </div>

          {/* ==================================================
              OVERVIEW SECTION
              ================================================== */}
          <div className="space-y-3 pt-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Overview &amp; Mission
            </h2>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2 whitespace-pre-line">
              {opportunity.description}
            </div>

            {opportunity.eligibility && (
              <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs space-y-1">
                <span className="font-bold text-blue-900 block">Who It&apos;s For &amp; Eligibility:</span>
                <p className="text-blue-800/90 leading-relaxed">
                  {opportunity.eligibility}
                </p>
              </div>
            )}
          </div>

          {/* ==================================================
              REWARDS & BENEFITS SECTION
              ================================================== */}
          {opportunity.reward && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Reward, Prize &amp; Benefits
              </h2>
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-2.5">
                <div className="flex items-center gap-2 font-black text-sm text-amber-950">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>{opportunity.reward}</span>
                </div>
                {opportunity.benefits && opportunity.benefits.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-amber-900/90 pt-1 border-t border-amber-200/50">
                    {opportunity.benefits.map((b, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* ==================================================
              REQUIREMENTS & TECHNICAL DETAILS
              ================================================== */}
          {opportunity.requirements && opportunity.requirements.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Requirements &amp; Deliverables
              </h2>
              <ul className="space-y-2 text-xs text-slate-700">
                {opportunity.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 mt-0.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ==================================================
              SKILLS & TAGS
              ================================================== */}
          <div className="space-y-2.5 pt-2">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Target Competencies &amp; Tags
            </h2>
            <div className="flex flex-wrap items-center gap-1.5">
              {opportunity.skills.map((s, idx) => (
                <span key={idx} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200/80">
                  {s}
                </span>
              ))}
              {opportunity.tags.map((t, idx) => (
                <span key={idx} className="text-xs font-medium px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200/60">
                  #{t}
                </span>
              ))}
            </div>
          </div>

          {/* ==================================================
              COMMERCIAL / PARTNERSHIP METADATA (IF PRESENT)
              Transparent, professional disclosure
              ================================================== */}
          {commercial && commercial.monetizationType !== 'organic' && (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 text-2xs text-slate-500 space-y-1">
              <div className="flex items-center gap-1 font-semibold text-slate-700">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Partner Program</span>
              </div>
              <p>
                This opportunity is coordinated in partnership with {commercial.partnerName || opportunity.organization}. 
                {commercial.rewardCredits ? ` Completing verified participation rewards +${commercial.rewardCredits} Career OS platform credits.` : ''}
              </p>
            </div>
          )}

          {/* ==================================================
              RELATED OPPORTUNITIES (PART 5)
              ================================================== */}
          {relatedOpportunities.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-slate-100">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Related &amp; Similar Opportunities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relatedOpportunities.slice(0, 2).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold uppercase text-slate-400 block truncate">
                        {rel.organization}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {rel.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {rel.reward || rel.location}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================================================
              RELATED BUILDER MATCH SPRINT (REQUIREMENT 14)
              ================================================== */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="text-2xs font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <Hammer className="w-3.5 h-3.5 text-amber-700" />
                <span>Related Builds in Builder Match</span>
              </span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                Collaborative Sprints
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Form a temporary squad or build a prototype to solve challenges related to {opportunity.organization}.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent('career_navigate_tab', { detail: 'builder_match' }));
              }}
              className="text-xs font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer pt-0.5"
            >
              <span>Explore Related Challenges in Builder Match</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* ==================================================
            STICKY BOTTOM CONVERSION FOOTER
            ================================================== */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5 text-amber-500" />
            <span>Deadline: <strong className="text-slate-800">{opportunity.deadline || 'Rolling'}</strong></span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onToggleRadar(opportunity)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isInRadar
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300/80 shadow-3xs'
              }`}
            >
              {isInRadar ? '✓ In Career Radar' : '+ Add to Radar'}
            </button>

            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <span>{opportunity.ctaText || 'View Opportunity'}</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
