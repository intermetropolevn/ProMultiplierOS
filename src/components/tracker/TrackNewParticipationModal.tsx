import React, { useState, useRef } from 'react';
import { 
  X, 
  Briefcase, 
  Trophy, 
  Hammer, 
  Users, 
  Award, 
  Check, 
  Calendar, 
  Clock, 
  Building2, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Target,
  Plus,
  Video,
  FileText,
  Compass,
  BookOpen,
  Tv,
  Share2,
  Heart,
  Paperclip,
  CheckCircle2,
  ChevronDown,
  Lock
} from 'lucide-react';
import { 
  ParticipationType, 
  ParticipationRole,
  UnifiedParticipationStatus,
  PARTICIPATION_LIFECYCLES, 
  CANONICAL_PARTICIPATION_TYPES,
  JobApplication,
  EvidenceType
} from '../../features/applications/types';
import { applicationStore } from '../../features/applications/services/applicationStore';
import { JOBS_DATA } from '../../data/jobsData';
import { AccessCreationBanner } from '../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../access/DemoQuotaGate';
import { useAccessControl } from '../../services/accessControlService';

interface TrackNewParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemCreated: (item: JobApplication) => void;
  initialType?: ParticipationType;
  initialContext?: Partial<JobApplication>;
}

export const TrackNewParticipationModal: React.FC<TrackNewParticipationModalProps> = ({
  isOpen,
  onClose,
  onItemCreated,
  initialType,
  initialContext
}) => {
  // 1. Primary Field: Participation Type
  const [selectedType, setSelectedType] = useState<ParticipationType>(initialType || 'workshop');
  
  const { accessLevel, can, canCreate, capabilities, openAccessModal } = useAccessControl();
  const [accessError, setAccessError] = useState<string | null>(null);
  const isSubmittingRef = useRef(false);

  // 2. Common Fields
  const [title, setTitle] = useState(initialContext?.roleTitle || '');
  const [organization, setOrganization] = useState(initialContext?.organization || initialContext?.companyName || '');
  const [startDate, setStartDate] = useState(initialContext?.startDate ? initialContext.startDate.split('T')[0] : new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialContext?.startTime || '09:00 AM');
  const [endTime, setEndTime] = useState(initialContext?.endTime || '05:00 PM');
  const [duration, setDuration] = useState(initialContext?.duration || '1 Day');
  const [location, setLocation] = useState(initialContext?.location || 'Remote / Virtual');
  const [isOnline, setIsOnline] = useState<boolean>(initialContext?.isOnline ?? true);
  const [status, setStatus] = useState<UnifiedParticipationStatus>(initialContext?.unifiedStatus || 'registered');
  const [role, setRole] = useState<ParticipationRole>('Participant');
  const [description, setDescription] = useState(initialContext?.description || '');
  const [topicsInput, setTopicsInput] = useState(initialContext?.topics?.join(', ') || '');
  const [skillsInput, setSkillsInput] = useState(initialContext?.skillIds?.join(', ') || '');
  const [notes, setNotes] = useState(initialContext?.notes || '');
  const [priority, setPriority] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('HIGH');

  // Integrations / Links
  const [relatedOpportunity, setRelatedOpportunity] = useState(initialContext?.relatedOpportunityTitle || '');
  const [relatedProject, setRelatedProject] = useState(initialContext?.relatedProjectTitle || '');
  const [relatedKnowledge, setRelatedKnowledge] = useState(initialContext?.relatedKnowledgeTitle || '');
  const [followUpTaskTitle, setFollowUpTaskTitle] = useState('');
  const [followUpTaskDate, setFollowUpTaskDate] = useState('');

  // Initial Evidence
  const [evidenceTitle, setEvidenceTitle] = useState('');
  const [evidenceType, setEvidenceType] = useState<EvidenceType>('certificate');
  const [evidenceUrl, setEvidenceUrl] = useState('');

  // 3. Dynamic Type-Specific Fields
  // Workshop
  const [wsInstructor, setWsInstructor] = useState('');
  const [wsTopic, setWsTopic] = useState('');
  const [wsLearningObjectives, setWsLearningObjectives] = useState('');
  const [wsMaterials, setWsMaterials] = useState('');
  const [wsKeyTakeaways, setWsKeyTakeaways] = useState('');
  const [wsCertificate, setWsCertificate] = useState('');

  // Conference
  const [confVenue, setConfVenue] = useState('');
  const [confSpeakers, setConfSpeakers] = useState('');
  const [confSessions, setConfSessions] = useState('');
  const [confTracks, setConfTracks] = useState('');
  const [confNetworking, setConfNetworking] = useState('');
  const [confBadge, setConfBadge] = useState('');

  // Meeting (Operational layout)
  const [mtgParticipants, setMtgParticipants] = useState('');
  const [mtgAgenda, setMtgAgenda] = useState('');
  const [mtgObjective, setMtgObjective] = useState('');
  const [mtgDecisions, setMtgDecisions] = useState('');
  const [mtgActionItems, setMtgActionItems] = useState('');
  const [mtgFollowUpDate, setMtgFollowUpDate] = useState('');

  // Webinar / Seminar / Meetup
  const [webSpeaker, setWebSpeaker] = useState('');
  const [webTopic, setWebTopic] = useState('');
  const [webPlatform, setWebPlatform] = useState('Zoom / YouTube Live');
  const [webResources, setWebResources] = useState('');

  // Bootcamp
  const [bootProvider, setBootProvider] = useState('');
  const [bootCurriculum, setBootCurriculum] = useState('');
  const [bootEndDate, setBootEndDate] = useState('');
  const [bootStatus, setBootStatus] = useState('Enrolled / Active');
  const [bootCert, setBootCert] = useState('');

  // Hackathon / Competition
  const [hackTeam, setHackTeam] = useState('Squad 1');
  const [hackProject, setHackProject] = useState('');
  const [hackRole, setHackRole] = useState('Full-Stack Engineer & Architect');
  const [hackSubmission, setHackSubmission] = useState('');
  const [hackResult, setHackResult] = useState('');
  const [hackAward, setHackAward] = useState('');

  // Community / Volunteer
  const [volCause, setVolCause] = useState('Youth Education & Open Source');
  const [volContribution, setVolContribution] = useState('');
  const [volImpact, setVolImpact] = useState('');
  const [volHours, setVolHours] = useState(8);

  // Interview
  const [ivInterviewer, setIvInterviewer] = useState('');
  const [ivRoundType, setIvRoundType] = useState('TECHNICAL');

  // Assessment
  const [casePrompt, setCasePrompt] = useState('');
  const [caseDeliverable, setCaseDeliverable] = useState('');

  if (!isOpen) return null;

  const currentLifecycle = PARTICIPATION_LIFECYCLES[selectedType] || PARTICIPATION_LIFECYCLES['workshop'];

  const allSupportedTypes: { id: ParticipationType; label: string; icon: React.FC<{ className?: string }>; desc: string }[] = [
    { id: 'workshop', label: 'Workshop', icon: Sparkles, desc: 'Hands-on practical training & skill labs' },
    { id: 'conference', label: 'Conference', icon: Users, desc: 'Industry summits, keynotes & tracks' },
    { id: 'meeting', label: 'Meeting', icon: Calendar, desc: 'Operational alignment, decisions & tasks' },
    { id: 'webinar', label: 'Webinar', icon: Tv, desc: 'Live broadcast & online presentations' },
    { id: 'seminar', label: 'Seminar', icon: BookOpen, desc: 'Academic or deep-dive expert session' },
    { id: 'meetup', label: 'Meetup', icon: Compass, desc: 'Local/virtual tech communities' },
    { id: 'networking', label: 'Networking Event', icon: Share2, desc: 'Social mixers & recruiting nights' },
    { id: 'bootcamp', label: 'Bootcamp', icon: Award, desc: 'Intensive cohort curriculum' },
    { id: 'hackathon', label: 'Hackathon', icon: Trophy, desc: 'Timed sprint building products' },
    { id: 'competition', label: 'Competition', icon: Target, desc: 'Case or pitch contest' },
    { id: 'community', label: 'Community Event', icon: Hammer, desc: 'Open source circles & meetups' },
    { id: 'volunteer', label: 'Volunteer / NGO', icon: Heart, desc: 'Pro-bono consulting & social impact' },
    { id: 'interview', label: 'Interview', icon: Video, desc: 'Technical or leadership round' },
    { id: 'assessment', label: 'Assessment / Assignment', icon: FileText, desc: 'Take-home case or skills test' },
    { id: 'other', label: 'Other', icon: Layers, desc: 'Custom professional activity' },
  ];

  const handleTypeSelect = (typeId: ParticipationType) => {
    setSelectedType(typeId);
    // Dynamic default role
    if (typeId === 'conference' || typeId === 'meetup' || typeId === 'seminar' || typeId === 'webinar' || typeId === 'networking') {
      setRole('Attendee');
      setStatus('registered');
    } else if (typeId === 'meeting') {
      setRole('Participant');
      setStatus('confirmed');
    } else if (typeId === 'hackathon') {
      setRole('Team Member');
      setStatus('registered');
    } else if (typeId === 'volunteer') {
      setRole('Volunteer');
      setStatus('confirmed');
    } else if (typeId === 'interview' || typeId === 'assessment') {
      setRole('Candidate');
      setStatus('confirmed');
    } else {
      setRole('Participant');
      setStatus('registered');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingRef.current) return;
    if (!canCreate('participation')) {
      return;
    }
    if (!title.trim()) return;
    isSubmittingRef.current = true;

    const initialStage = currentLifecycle.stages[0];

    const parsedTopics = topicsInput.split(',').map(s => s.trim()).filter(Boolean);
    const parsedSkills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const newItem: Partial<JobApplication> = {
      roleTitle: title.trim(),
      companyName: organization.trim() || 'Organization',
      organization: organization.trim() || 'Organization',
      domain: parsedTopics[0] || 'General Tech',
      location: location.trim(),
      isOnline,
      startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
      startTime,
      endTime,
      duration,
      participationType: selectedType,
      participationStatus: status === 'completed' || status === 'attended' ? 'COMPLETED' : status === 'saved' ? 'SAVED' : 'ACTIVE',
      unifiedStatus: status,
      participationRole: role,
      currentStageId: initialStage.id,
      currentStageName: initialStage.label,
      priority,
      description: description.trim(),
      topics: parsedTopics,
      skillIds: parsedSkills,
      readinessSkills: parsedSkills.slice(0, 3),
      readinessContribution: parsedSkills.length * 4,
      notes: notes.trim(),
      relatedOpportunityTitle: relatedOpportunity.trim() || undefined,
      relatedProjectTitle: relatedProject.trim() || undefined,
      relatedKnowledgeTitle: relatedKnowledge.trim() || undefined,
      evidenceItems: [],
      followUpTasks: [],
      activities: [
        {
          id: `act-${Date.now()}`,
          itemId: `track-${selectedType.substring(0, 4)}-${Date.now()}`,
          type: 'STAGE_CHANGE',
          title: `Registered in Participation Tracker (${selectedType})`,
          timestamp: new Date().toISOString()
        }
      ]
    };

    // Attach initial evidence item if provided
    if (evidenceTitle.trim()) {
      newItem.evidenceItems?.push({
        id: `ev-${Date.now()}`,
        title: evidenceTitle.trim(),
        type: evidenceType,
        url: evidenceUrl.trim() || undefined,
        uploadedAt: new Date().toISOString(),
        verificationBadge: evidenceType === 'certificate' || evidenceType === 'badge'
      });
    }

    // Attach initial follow-up task if provided
    if (followUpTaskTitle.trim()) {
      newItem.followUpTasks?.push({
        id: `task-${Date.now()}`,
        title: followUpTaskTitle.trim(),
        completed: false,
        dueDate: followUpTaskDate || undefined,
        priority: 'HIGH'
      });
    }

    // Type-specific field mapping
    if (selectedType === 'workshop') {
      newItem.workshopDetails = {
        instructor: wsInstructor.trim() || undefined,
        workshopTopic: wsTopic.trim() || title.trim(),
        learningObjectives: wsLearningObjectives.split('\n').map(s => s.trim()).filter(Boolean),
        materials: wsMaterials ? [{ title: 'Workshop Materials', url: wsMaterials }] : [],
        keyTakeaways: wsKeyTakeaways.split('\n').map(s => s.trim()).filter(Boolean),
        certificateEvidence: wsCertificate.trim() || undefined
      };
      newItem.keyTakeaways = wsKeyTakeaways.split('\n').map(s => s.trim()).filter(Boolean);
    } else if (selectedType === 'conference') {
      newItem.conferenceDetails = {
        conferenceName: title.trim(),
        venue: confVenue.trim() || location.trim(),
        speakers: confSpeakers.split(',').map(s => s.trim()).filter(Boolean),
        tracks: confTracks.split(',').map(s => s.trim()).filter(Boolean),
        networkingOpportunities: confNetworking.split('\n').map(s => s.trim()).filter(Boolean),
        certificateBadge: confBadge.trim() || undefined
      };
    } else if (selectedType === 'meeting') {
      newItem.meetingDetails = {
        participants: mtgParticipants.split(',').map(s => s.trim()).filter(Boolean),
        agenda: mtgAgenda.trim() || undefined,
        meetingObjective: mtgObjective.trim() || undefined,
        decisions: mtgDecisions.split('\n').map(s => s.trim()).filter(Boolean),
        actionItems: mtgActionItems.split('\n').map(s => s.trim()).filter(Boolean).map(text => ({ text, done: false })),
        followUpDate: mtgFollowUpDate || undefined,
        relatedProjectId: relatedProject.trim() || undefined
      };
    } else if (selectedType === 'webinar' || selectedType === 'seminar' || selectedType === 'meetup') {
      newItem.webinarDetails = {
        speaker: webSpeaker.trim() || undefined,
        topic: webTopic.trim() || title.trim(),
        platformOrVenue: webPlatform.trim() || location.trim(),
        resources: webResources ? [{ title: 'Presentation Resource', url: webResources }] : []
      };
    } else if (selectedType === 'bootcamp') {
      newItem.bootcampDetails = {
        provider: bootProvider.trim() || organization.trim(),
        curriculum: bootCurriculum.split('\n').map(s => s.trim()).filter(Boolean),
        startDate,
        endDate: bootEndDate || undefined,
        completionStatus: bootStatus,
        certificate: bootCert.trim() || undefined,
        skillsAcquired: parsedSkills
      };
    } else if (selectedType === 'hackathon' || selectedType === 'competition') {
      newItem.hackathonDetails = {
        organizer: organization.trim(),
        team: hackTeam.trim(),
        project: hackProject.trim() || title.trim(),
        role: hackRole.trim(),
        submission: hackSubmission.trim() || undefined,
        resultOrRanking: hackResult.trim() || undefined,
        award: hackAward.trim() || undefined,
        relatedProject: relatedProject.trim() || undefined
      };
      newItem.hackathonData = {
        teamName: hackTeam.trim(),
        projectName: hackProject.trim() || title.trim(),
        repositoryUrl: hackSubmission.trim() || undefined,
        deliverables: [
          { id: 'del-1', title: 'RFC & Architecture Spec', completed: true },
          { id: 'del-2', title: 'Prototype Code & API', completed: false },
          { id: 'del-3', title: 'Demo Pitch & Slide Deck', completed: false }
        ]
      };
    } else if (selectedType === 'community' || selectedType === 'volunteer') {
      newItem.communityDetails = {
        organization: organization.trim(),
        causeOrDomain: volCause.trim(),
        role: role,
        contribution: volContribution.trim() || undefined,
        impactOrOutcome: volImpact.trim() || undefined,
        hours: Number(volHours) || 8
      };
    } else if (selectedType === 'interview') {
      newItem.interviews = [
        {
          id: `iv-${Date.now()}`,
          applicationId: '',
          type: ivRoundType as any,
          title: title.trim(),
          interviewer: ivInterviewer.trim() || undefined,
          scheduledAt: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
          status: status === 'attended' || status === 'completed' ? 'COMPLETED' : 'SCHEDULED'
        }
      ];
    }

    try {
      const created = applicationStore.trackNewParticipation(newItem);
      onItemCreated(created);
      onClose();
    } catch (err: any) {
      isSubmittingRef.current = false;
      setAccessError(err.message || 'Creation restricted by current access tier.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white sticky top-0 z-20">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Participation Tracker
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-2xs text-slate-500 font-medium">Add Engagement</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
              + Add Participation Activity
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <DemoQuotaGate workflowKey="participation" isEditing={false} onViewExistingItems={onClose}>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Access Control Tier Banner */}
          <AccessCreationBanner 
            workflowKey="participation" 
            workflowLabel="activities" 
            currentCount={applicationStore.getApplications().filter(a => a.id.startsWith('app-') || a.id.startsWith('track-')).length} 
          />

          {accessError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
              {accessError}
            </div>
          )}
          
          {/* ==================================================
              FIELD 1: ACTIVITY TYPE (Basic Field)
              ================================================== */}
          <div className="space-y-2.5">
            <label className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider block">
              1. Activity Type *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {allSupportedTypes.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedType === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTypeSelect(opt.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 shadow-2xs ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{opt.label}</h4>
                      <p className="text-[10px] text-slate-500 line-clamp-1 leading-tight">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ==================================================
              FIELD 2: BASIC PARTICIPATION DETAILS
              ================================================== */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              2. Basic Participation Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AI Product Architecture Workshop, ProductCon 2026..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Organization */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Organization *
                </label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. Stanford AI Lab, Google, Reforge, Internal..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Date */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Date *</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                />
              </div>

              {/* Participation Role */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as ParticipationRole)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors cursor-pointer font-medium"
                >
                  <option value="Participant">Participant</option>
                  <option value="Attendee">Attendee</option>
                  <option value="Speaker">Speaker</option>
                  <option value="Panelist">Panelist</option>
                  <option value="Facilitator">Facilitator</option>
                  <option value="Organizer">Organizer</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Guest">Guest</option>
                  <option value="Interviewer">Interviewer</option>
                  <option value="Candidate">Candidate</option>
                  <option value="Team Member">Team Member</option>
                </select>
              </div>
            </div>
          </div>

          {/* ==================================================
              ADVANCED SECTION: EVIDENCE MAPPING, CAPABILITY ATTRIBUTION, READINESS IMPACT, VERIFICATION
              ================================================== */}
          <ProgressiveCreationSection workflowKey="participation">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                {/* Status */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Participation Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UnifiedParticipationStatus)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors cursor-pointer capitalize font-medium"
                  >
                    <option value="saved">Saved (Considering)</option>
                    <option value="invited">Invited</option>
                    <option value="registered">Registered</option>
                    <option value="confirmed">Confirmed / Confirmed Seat</option>
                    <option value="attended">Attended</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No-Show</option>
                  </select>
                </div>

                {/* Start Time & End Time */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Start Time</label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="09:00 AM"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">End Time / Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 2 hours, 1 Day, 6 Weeks"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                  />
                </div>

                {/* Location & Online/Offline */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Location / Platform</label>
                    <label className="inline-flex items-center gap-1 cursor-pointer text-2xs text-blue-600 font-bold">
                      <input
                        type="checkbox"
                        checked={isOnline}
                        onChange={(e) => {
                          setIsOnline(e.target.checked);
                          if (e.target.checked && (!location || location === 'In-Person')) {
                            setLocation('Remote / Online');
                          }
                        }}
                        className="rounded text-blue-600 w-3 h-3"
                      />
                      <span>Online / Virtual</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Zoom, Moscone Center San Francisco, Hanoi Office"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                  />
                </div>
              </div>

              {/* Description & Topics & Skills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Topics (comma-separated)</label>
                  <input
                    type="text"
                    value={topicsInput}
                    onChange={(e) => setTopicsInput(e.target.value)}
                    placeholder="e.g. AI Agents, LLM Evaluation, Growth Loops, Vector Search"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Skills Acquired / Practiced (Capability Attribution)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. Strategic Thinking, Python, Kubernetes, Product Strategy"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold text-slate-700">Description &amp; Objective</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief summary of what this activity covers and key objectives..."
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
                  />
                </div>
              </div>
            </div>

          {/* ==================================================
              FIELD 3: DYNAMIC FIELDS BY PARTICIPATION TYPE
              ================================================== */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-blue-600">
                3. Dynamic Fields for {selectedType.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold border border-blue-200">
                Tailored Attributes
              </span>
            </div>

            {/* A. Workshop */}
            {selectedType === 'workshop' && (
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Instructor / Facilitator</label>
                    <input
                      type="text"
                      value={wsInstructor}
                      onChange={(e) => setWsInstructor(e.target.value)}
                      placeholder="e.g. Dr. Andrew Ng, Harrison Chase"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Workshop Topic</label>
                    <input
                      type="text"
                      value={wsTopic}
                      onChange={(e) => setWsTopic(e.target.value)}
                      placeholder="e.g. Agentic RAG & Multi-Agent Workflows"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Learning Objectives (1 per line)</label>
                    <textarea
                      rows={2}
                      value={wsLearningObjectives}
                      onChange={(e) => setWsLearningObjectives(e.target.value)}
                      placeholder="Master LangGraph state machine&#10;Benchmark retrieval precision&#10;Deploy Pydantic guardrails"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Key Takeaways (1 per line)</label>
                    <textarea
                      rows={2}
                      value={wsKeyTakeaways}
                      onChange={(e) => setWsKeyTakeaways(e.target.value)}
                      placeholder="Evaluate retrieval precision independently&#10;Use state machines over prompt chains"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Materials / Resources Link</label>
                    <input
                      type="url"
                      value={wsMaterials}
                      onChange={(e) => setWsMaterials(e.target.value)}
                      placeholder="https://slides.deeplearning.ai/..."
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Certificate / Completion URL</label>
                    <input
                      type="url"
                      value={wsCertificate}
                      onChange={(e) => setWsCertificate(e.target.value)}
                      placeholder="https://verify.deeplearning.ai/..."
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* B. Conference */}
            {selectedType === 'conference' && (
              <div className="bg-indigo-50/40 border border-indigo-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Venue / Host City</label>
                    <input
                      type="text"
                      value={confVenue}
                      onChange={(e) => setConfVenue(e.target.value)}
                      placeholder="Moscone West, San Francisco & Virtual Stream Hub"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Key Speakers (comma-separated)</label>
                    <input
                      type="text"
                      value={confSpeakers}
                      onChange={(e) => setConfSpeakers(e.target.value)}
                      placeholder="Satya Nadella, Claire Vo, Aakash Gupta"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Conference Tracks</label>
                    <input
                      type="text"
                      value={confTracks}
                      onChange={(e) => setConfTracks(e.target.value)}
                      placeholder="AI Product Growth, Enterprise Infrastructure, Executive Leadership"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Badge / Ticket Reference</label>
                    <input
                      type="text"
                      value={confBadge}
                      onChange={(e) => setConfBadge(e.target.value)}
                      placeholder="VIP Delegate Pass #99824"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Networking Opportunities &amp; Meetups</label>
                    <textarea
                      rows={2}
                      value={confNetworking}
                      onChange={(e) => setConfNetworking(e.target.value)}
                      placeholder="Founders Breakfast Roundtable&#10;Southeast Asia Tech Mixer&#10;AI Startup Pitch Lounge"
                      className="w-full px-3 py-2 bg-white border border-indigo-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* C. Meeting (Operational Layout) */}
            {selectedType === 'meeting' && (
              <div className="bg-slate-100/70 border border-slate-300 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Meeting Objective</label>
                    <input
                      type="text"
                      value={mtgObjective}
                      onChange={(e) => setMtgObjective(e.target.value)}
                      placeholder="e.g. Approve Q4 architecture RFC and reduce telemetry p99 latency"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Participants (comma-separated)</label>
                    <input
                      type="text"
                      value={mtgParticipants}
                      onChange={(e) => setMtgParticipants(e.target.value)}
                      placeholder="Elena Vance (VP Product), Minh Tran (Architect), David Pham"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Operational Agenda</label>
                    <textarea
                      rows={2}
                      value={mtgAgenda}
                      onChange={(e) => setMtgAgenda(e.target.value)}
                      placeholder="1. Telemetry latency bottleneck&#10;2. Kafka CDC vs NATS JetStream&#10;3. Decree 53 compliance&#10;4. Assign sprint deliverable owners"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Decisions Made (1 per line)</label>
                    <textarea
                      rows={2}
                      value={mtgDecisions}
                      onChange={(e) => setMtgDecisions(e.target.value)}
                      placeholder="Adopt Kafka CDC connectors with Schema Registry&#10;Approved hybrid deployment model"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Action Items (1 per line)</label>
                    <textarea
                      rows={2}
                      value={mtgActionItems}
                      onChange={(e) => setMtgActionItems(e.target.value)}
                      placeholder="Publish approved RFC to Confluence&#10;Provision sandbox Kafka cluster&#10;Run 48h load test"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D. Webinar / Seminar / Meetup */}
            {(selectedType === 'webinar' || selectedType === 'seminar' || selectedType === 'meetup' || selectedType === 'networking') && (
              <div className="bg-teal-50/40 border border-teal-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Speaker / Host</label>
                    <input
                      type="text"
                      value={webSpeaker}
                      onChange={(e) => setWebSpeaker(e.target.value)}
                      placeholder="e.g. Brian Balfour (CEO Reforge)"
                      className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Platform / Livestream URL</label>
                    <input
                      type="text"
                      value={webPlatform}
                      onChange={(e) => setWebPlatform(e.target.value)}
                      placeholder="Zoom / YouTube Live / Google Meet"
                      className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Shared Resources &amp; Links</label>
                    <input
                      type="url"
                      value={webResources}
                      onChange={(e) => setWebResources(e.target.value)}
                      placeholder="https://reforge.com/tools/cohort-calculator"
                      className="w-full px-3 py-2 bg-white border border-teal-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* E. Bootcamp */}
            {selectedType === 'bootcamp' && (
              <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Bootcamp Provider</label>
                    <input
                      type="text"
                      value={bootProvider}
                      onChange={(e) => setBootProvider(e.target.value)}
                      placeholder="e.g. FullStack Academy, Reforge, Le Wagon"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cohort End Date</label>
                    <input
                      type="date"
                      value={bootEndDate}
                      onChange={(e) => setBootEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Curriculum Modules (1 per line)</label>
                    <textarea
                      rows={2}
                      value={bootCurriculum}
                      onChange={(e) => setBootCurriculum(e.target.value)}
                      placeholder="Module 1: Transformers & Attention Mechanics&#10;Module 2: LoRA Fine-Tuning&#10;Module 3: vLLM High Throughput Inference"
                      className="w-full px-3 py-2 bg-white border border-amber-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* F. Hackathon / Competition */}
            {(selectedType === 'hackathon' || selectedType === 'competition' || selectedType === 'challenge_hackathon') && (
              <div className="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Team Name</label>
                    <input
                      type="text"
                      value={hackTeam}
                      onChange={(e) => setHackTeam(e.target.value)}
                      placeholder="VectorVanguard"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Project Prototype Name</label>
                    <input
                      type="text"
                      value={hackProject}
                      onChange={(e) => setHackProject(e.target.value)}
                      placeholder="CatalogVision Agent"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Submission URL / Repo</label>
                    <input
                      type="url"
                      value={hackSubmission}
                      onChange={(e) => setHackSubmission(e.target.value)}
                      placeholder="https://github.com/..."
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Result / Ranking</label>
                    <input
                      type="text"
                      value={hackResult}
                      onChange={(e) => setHackResult(e.target.value)}
                      placeholder="Top 3 Finalist / 1st Place"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Award / Recognition</label>
                    <input
                      type="text"
                      value={hackAward}
                      onChange={(e) => setHackAward(e.target.value)}
                      placeholder="$10,000 AWS Cloud Credits & Best Technical Architecture Award"
                      className="w-full px-3 py-2 bg-white border border-rose-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* G. Community / Volunteer Event */}
            {(selectedType === 'community' || selectedType === 'volunteer') && (
              <div className="bg-pink-50/40 border border-pink-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Cause / Social Domain</label>
                    <input
                      type="text"
                      value={volCause}
                      onChange={(e) => setVolCause(e.target.value)}
                      placeholder="Youth STEAM Education & Open-Source Mentorship"
                      className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Volunteer Hours Documented</label>
                    <input
                      type="number"
                      value={volHours}
                      onChange={(e) => setVolHours(Number(e.target.value))}
                      placeholder="12"
                      className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Contribution &amp; Impact Outcome</label>
                    <textarea
                      rows={2}
                      value={volImpact}
                      onChange={(e) => setVolImpact(e.target.value)}
                      placeholder="Conducted 4 mock interviews for underrepresented engineers; 2 secured technical internships."
                      className="w-full px-3 py-2 bg-white border border-pink-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* H. Interview */}
            {selectedType === 'interview' && (
              <div className="bg-blue-50/40 border border-blue-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Interviewer Name &amp; Title</label>
                    <input
                      type="text"
                      value={ivInterviewer}
                      onChange={(e) => setIvInterviewer(e.target.value)}
                      placeholder="e.g. Nguyen Minh Tu (VP Vehicle Software)"
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 block mb-1">Interview Round</label>
                    <select
                      value={ivRoundType}
                      onChange={(e) => setIvRoundType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl focus:outline-hidden cursor-pointer"
                    >
                      <option value="RECRUITER">Recruiter / Talent Screen</option>
                      <option value="TECHNICAL">Technical Deep-Dive</option>
                      <option value="SYSTEM_DESIGN">System Design / Architecture</option>
                      <option value="HIRING_MANAGER">Hiring Manager Round</option>
                      <option value="FINAL_EXECUTIVE">Final Executive / VP Review</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* I. Assessment */}
            {selectedType === 'assessment' && (
              <div className="bg-purple-50/40 border border-purple-200/80 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700 block mb-1">Case Study Prompt / Assessment Objective</label>
                    <textarea
                      rows={2}
                      value={casePrompt}
                      onChange={(e) => setCasePrompt(e.target.value)}
                      placeholder="e.g. Evaluate Southeast Asia market entry beachhead and calculate 3-year unit economics..."
                      className="w-full px-3 py-2 bg-white border border-purple-200 rounded-xl focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ==================================================
              FIELD 4: EVIDENCE, FOLLOW-UP & CAREER OS INTEGRATION
              ================================================== */}
          <div className="space-y-4 pt-2 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              4. Evidence, Follow-Up &amp; Career OS Linking
            </h3>

            {/* Initial Evidence Attachment */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                <span>Attach Initial Evidence / Artifact (Optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <input
                    type="text"
                    value={evidenceTitle}
                    onChange={(e) => setEvidenceTitle(e.target.value)}
                    placeholder="Evidence Title (e.g. Certificate, RFC PDF)"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <select
                    value={evidenceType}
                    onChange={(e) => setEvidenceType(e.target.value as EvidenceType)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden cursor-pointer capitalize"
                  >
                    <option value="certificate">Certificate</option>
                    <option value="badge">Badge</option>
                    <option value="notes">Notes</option>
                    <option value="presentation">Presentation</option>
                    <option value="project_output">Project Output</option>
                    <option value="recording">Recording</option>
                    <option value="document">Document / PDF</option>
                    <option value="link">External Link</option>
                  </select>
                </div>
                <div>
                  <input
                    type="url"
                    value={evidenceUrl}
                    onChange={(e) => setEvidenceUrl(e.target.value)}
                    placeholder="URL / File Link"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Initial Follow-Up Task */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Initial Follow-Up Action Item (Optional)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    value={followUpTaskTitle}
                    onChange={(e) => setFollowUpTaskTitle(e.target.value)}
                    placeholder="e.g. Send thank-you note, summarize takeaways to Confluence, schedule 1-on-1"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
                <div>
                  <input
                    type="date"
                    value={followUpTaskDate}
                    onChange={(e) => setFollowUpTaskDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Career OS Connections */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Related Opportunity</label>
                <input
                  type="text"
                  value={relatedOpportunity}
                  onChange={(e) => setRelatedOpportunity(e.target.value)}
                  placeholder="e.g. Product Strategy Manager (Company X)"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Related Project</label>
                <input
                  type="text"
                  value={relatedProject}
                  onChange={(e) => setRelatedProject(e.target.value)}
                  placeholder="e.g. Enterprise Vector Search"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Related Knowledge / Blueprint</label>
                <input
                  type="text"
                  value={relatedKnowledge}
                  onChange={(e) => setRelatedKnowledge(e.target.value)}
                  placeholder="e.g. AI Product Manager Blueprint"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">General Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Log any personal reflections, links, or context..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden"
              />
            </div>

          </div>
          </ProgressiveCreationSection>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 sticky bottom-0 bg-white py-2 z-20">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openAccessModal('DEMO')}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                id="submit-participation-btn"
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Track Participation</span>
              </button>
            )}
          </div>

        </form>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
