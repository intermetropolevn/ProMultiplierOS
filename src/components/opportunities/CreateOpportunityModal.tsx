import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trophy, 
  Rocket, 
  Gift, 
  Building2, 
  DollarSign, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Award,
  Lock
} from 'lucide-react';
import { 
  CareerOpportunity, 
  OpportunityType, 
  OpportunitySubtype, 
  OpportunityMonetizationType,
  OpportunitySponsorshipBadge 
} from '../../types';
import { OpportunityService } from '../../services/opportunityService';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: (opportunity: CareerOpportunity) => void;
}

export const CreateOpportunityModal: React.FC<CreateOpportunityModalProps> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { capabilities, canCreate, openContextualPrompt } = useAccessControl();
  const isSubmittingRef = useRef(false);
  // Core Fields
  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('challenge');
  const [subtype, setSubtype] = useState<OpportunitySubtype>('hackathon');
  const [organization, setOrganization] = useState('');
  const [organizationLogo, setOrganizationLogo] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [deadline, setDeadline] = useState('Nov 30, 2026');
  const [location, setLocation] = useState('Remote · Global');
  const [isRemote, setIsRemote] = useState(true);
  const [eligibility, setEligibility] = useState('Open to all software engineers and AI builders worldwide');
  const [industry, setIndustry] = useState('AI & Machine Learning');
  const [reward, setReward] = useState('$10,000+ Prize Pool');
  const [skills, setSkills] = useState('TypeScript, Python, System Design');
  const [tags, setTags] = useState('Hackathon, AI, Global');
  const [applicationUrl, setApplicationUrl] = useState('https://');
  const [ctaText, setCtaText] = useState('Register for Opportunity');

  // Progressive Disclosure: Commercial & Monetization Layer
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [sponsorshipStatus, setSponsorshipStatus] = useState<OpportunitySponsorshipBadge>('organic');
  const [monetizationType, setMonetizationType] = useState<OpportunityMonetizationType>('organic');
  const [partnerName, setPartnerName] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [affiliateUrl, setAffiliateUrl] = useState('');
  const [affiliateCommission, setAffiliateCommission] = useState('');
  const [questId, setQuestId] = useState('');
  const [rewardCredits, setRewardCredits] = useState<number>(0);
  const [featuredStatus, setFeaturedStatus] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!capabilities.canCreate) {
      openContextualPrompt();
      return;
    }
    if (!canCreate('opportunities')) {
      return;
    }
    if (!title.trim() || !organization.trim()) return;
    isSubmittingRef.current = true;

    const parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    const parsedTags = tags.split(',').map(t => t.trim()).filter(Boolean);

    const hasCommercial = sponsorshipStatus !== 'organic' || monetizationType !== 'organic' || partnerName || rewardCredits > 0;

    const newOpp = OpportunityService.createOpportunity({
      title: title.trim(),
      type,
      subtype,
      organization: organization.trim(),
      organizationLogo: organizationLogo.trim() || undefined,
      description: description.trim() || shortDescription.trim() || title.trim(),
      shortDescription: shortDescription.trim() || description.trim().slice(0, 140),
      status: 'active',
      deadline: deadline.trim() || 'Rolling',
      location: location.trim(),
      isRemote,
      eligibility: eligibility.trim(),
      industry: industry.trim(),
      reward: reward.trim() || undefined,
      skills: parsedSkills.length > 0 ? parsedSkills : ['General'],
      tags: parsedTags.length > 0 ? parsedTags : ['Opportunity'],
      applicationUrl: applicationUrl.trim() || '#',
      ctaText: ctaText.trim() || 'View Opportunity',
      commercial: hasCommercial ? {
        opportunityId: '',
        partnerName: partnerName.trim() || undefined,
        campaignId: campaignId.trim() || undefined,
        monetizationType,
        sponsorshipStatus,
        featuredStatus,
        affiliateUrl: affiliateUrl.trim() || undefined,
        affiliateCommission: affiliateCommission.trim() || undefined,
        questId: questId.trim() || undefined,
        rewardCredits: rewardCredits > 0 ? rewardCredits : undefined,
      } : undefined,
      matchScore: 92,
      recommendationReason: `Calibrated for ${industry} career tracks`,
    });

    if (onCreated) {
      onCreated(newOpp);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Career Opportunity</h2>
              <p className="text-xs text-slate-500">Add challenge, venture program, deal, or company signal</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <DemoQuotaGate workflowKey="opportunities" isEditing={false} onViewExistingItems={onClose}>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 text-xs">
          <AccessCreationBanner workflowKey="opportunities" workflowLabel="Career Opportunities" />
          
          {/* Opportunity Type Select Buttons */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">Opportunity Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setType('challenge');
                  setSubtype('hackathon');
                  setCtaText('Register for Hackathon');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  type === 'challenge'
                    ? 'border-amber-400 bg-amber-50/70 text-amber-950 font-bold ring-1 ring-amber-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Trophy className="w-4 h-4 text-amber-600 mb-1" />
                <span>Challenge</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('venture');
                  setSubtype('accelerator');
                  setCtaText('Apply to Batch');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  type === 'venture'
                    ? 'border-indigo-400 bg-indigo-50/70 text-indigo-950 font-bold ring-1 ring-indigo-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Rocket className="w-4 h-4 text-indigo-600 mb-1" />
                <span>Venture / Grant</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('promotion');
                  setSubtype('deal');
                  setCtaText('Claim Offer');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  type === 'promotion'
                    ? 'border-emerald-400 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Gift className="w-4 h-4 text-emerald-600 mb-1" />
                <span>Promotion / Deal</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setType('company_signal');
                  setSubtype('trending_company');
                  setCtaText('View Company');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  type === 'company_signal'
                    ? 'border-purple-400 bg-purple-50/70 text-purple-950 font-bold ring-1 ring-purple-400/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Building2 className="w-4 h-4 text-purple-600 mb-1" />
                <span>Company Signal</span>
              </button>
            </div>
          </div>

          {/* Title & Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Opportunity Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Google Gemini AI Global Hackathon"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Organization / Host *</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Google Cloud, Y Combinator, Stripe"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Location & Application URL (Basic) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote · Global, SF"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">URL</label>
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Short Description *</label>
            <textarea
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              placeholder="Concise overview visible on opportunity card..."
              rows={2}
              className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 resize-none"
              required
            />
          </div>

          {/* ADVANCED SECTION: Required Core Skills, Salary & Reward Intelligence, Role Fit Signals, Market Signals, Opportunity Intelligence */}
          <ProgressiveCreationSection workflowKey="opportunities">
          {/* Reward, Deadline, CTA & Industry */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Reward / Prize / Benefit</label>
              <input
                type="text"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                placeholder="e.g. $50,000+ Prize, 40% Off"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Deadline</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. Nov 20, 2026 or Rolling"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Industry</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. AI & ML, Fintech"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Primary CTA Label</label>
              <input
                type="text"
                value={ctaText}
                onChange={(e) => setCtaText(e.target.value)}
                placeholder="e.g. Register, Apply, Claim Offer"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Skills & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Relevant Skills (comma-separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="Python, System Architecture, React"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Hackathon, Prizes, AI"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
              />
            </div>
          </div>

          {/* ==================================================
              PROGRESSIVE DISCLOSURE: PARTNERSHIP & MONETIZATION
              ================================================== */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCommercialOpen(prev => !prev)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors font-semibold text-xs cursor-pointer border border-slate-200"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Partnership, Commercial &amp; Monetization Settings</span>
                {sponsorshipStatus !== 'organic' && (
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded-full">
                    Active
                  </span>
                )}
              </div>
              {isCommercialOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isCommercialOpen && (
              <div className="mt-3 p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-3.5 animate-in fade-in">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Sponsorship Status</label>
                    <select
                      value={sponsorshipStatus}
                      onChange={(e) => setSponsorshipStatus(e.target.value as OpportunitySponsorshipBadge)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="organic">Organic (Standard)</option>
                      <option value="partner">Partner Opportunity</option>
                      <option value="sponsored">Sponsored Placement</option>
                      <option value="featured">Featured Listing</option>
                      <option value="member_benefit">Member Benefit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Monetization Type</label>
                    <select
                      value={monetizationType}
                      onChange={(e) => setMonetizationType(e.target.value as OpportunityMonetizationType)}
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="organic">Organic</option>
                      <option value="partnership">Direct Partnership</option>
                      <option value="affiliate">Affiliate Tracking</option>
                      <option value="sponsored">Sponsored Campaign</option>
                      <option value="quest">Quest &amp; Rewards</option>
                      <option value="membership">Membership Perk</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Partner Organization Name</label>
                    <input
                      type="text"
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="e.g. Google Developers, Coursera"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Campaign Identifier</label>
                    <input
                      type="text"
                      value={campaignId}
                      onChange={(e) => setCampaignId(e.target.value)}
                      placeholder="e.g. q4-2026-hackathon"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                {monetizationType === 'affiliate' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Affiliate Destination URL</label>
                      <input
                        type="url"
                        value={affiliateUrl}
                        onChange={(e) => setAffiliateUrl(e.target.value)}
                        placeholder="https://.../?aff=career_os"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Commission Structure</label>
                      <input
                        type="text"
                        value={affiliateCommission}
                        onChange={(e) => setAffiliateCommission(e.target.value)}
                        placeholder="e.g. 15% revenue share"
                        className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Reward Credits (Career OS)</label>
                    <input
                      type="number"
                      value={rewardCredits}
                      onChange={(e) => setRewardCredits(Number(e.target.value))}
                      placeholder="e.g. 500"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Linked Quest ID</label>
                    <input
                      type="text"
                      value={questId}
                      onChange={(e) => setQuestId(e.target.value)}
                      placeholder="e.g. quest-first-hackathon"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="chk-featured-status"
                    checked={featuredStatus}
                    onChange={(e) => setFeaturedStatus(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="chk-featured-status" className="font-semibold text-slate-700 cursor-pointer">
                    Pin as Featured Opportunity in Carousel &amp; Radar
                  </label>
                </div>

              </div>
            )}
          </div>
          </ProgressiveCreationSection>

          {/* Footer Submit */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openContextualPrompt()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Publish Opportunity
              </button>
            )}
          </div>

        </form>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
