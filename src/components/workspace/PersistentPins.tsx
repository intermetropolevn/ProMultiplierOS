import React, { useState, useEffect, useRef } from 'react';
import { 
  Pin, 
  Plus, 
  CheckSquare, 
  Square, 
  Trash2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  MoreVertical, 
  ArrowRight, 
  Edit3, 
  Copy, 
  X,
  ListTodo,
  Bot,
  Target,
  Layers,
  Zap,
  Compass,
  ArrowUp,
  CheckCircle2,
  Columns2
} from 'lucide-react';
import { SavedJobApplication, UserCareerProfile, CareerMission, GrowthLoopStep } from '../../types';
import { 
  UnifiedTaskService, 
  PinnedViewItem, 
  TaskPriority, 
  CareerNote,
  PinCategory 
} from '../../services/unifiedTaskService';
import { CareerMissionService } from '../../services/careerMissionService';
import { StorageService } from '../../services/storageService';

export type PinsWorkspaceMode = 'pins' | 'assistant';

interface AssistantConversationTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  referencedPinTitle?: string;
  contextBadges?: string[];
  suggestedTaskTitle?: string;
  suggestedTaskDescription?: string;
  canLaunchLivePractice?: boolean;
  canExecuteMissionStep?: boolean;
}

interface PersistentPinsProps {
  savedJobs?: SavedJobApplication[];
  profile?: UserCareerProfile;
  activeMission?: CareerMission | null;
  onNavigateToJob?: (jobId: string) => void;
  onNavigateToKnowledge?: () => void;
  onStartPracticeTopic?: (topic: string) => void;
  onStartLiveInterview?: () => void;
  onStartMockPractice?: () => void;
  onOpenMissionControl?: () => void;
  onExecuteMissionStep?: (step: GrowthLoopStep) => void;
  className?: string;
  variant?: 'sidebar' | 'dashboard-strip';
  autoCollapseDelayMs?: number;
}

const INTENT_KEY = 'career_os_pins_intent';
const MODE_KEY = 'career_os_pins_mode';

export const PersistentPins: React.FC<PersistentPinsProps> = ({
  savedJobs = [],
  profile: propProfile,
  activeMission: propMission,
  onStartLiveInterview,
  onStartMockPractice,
  onOpenMissionControl,
  onExecuteMissionStep,
  className = '',
  variant = 'dashboard-strip',
}) => {
  const [pinnedItems, setPinnedItems] = useState<PinnedViewItem[]>(() => {
    return UnifiedTaskService.getAllPinnedItems(savedJobs);
  });

  // Load contextual CareerOS state if not explicitly passed via props
  const [resolvedProfile, setResolvedProfile] = useState<UserCareerProfile>(() => {
    return propProfile || StorageService.getUserProfile();
  });
  const [resolvedMission, setResolvedMission] = useState<CareerMission | null>(() => {
    return propMission !== undefined ? propMission : CareerMissionService.getActiveMission();
  });

  useEffect(() => {
    if (propProfile) setResolvedProfile(propProfile);
  }, [propProfile]);

  useEffect(() => {
    if (propMission !== undefined) setResolvedMission(propMission);
  }, [propMission]);

  // Canonical Expand / Collapse State:
  // Starts collapsed by default in dashboard-strip mode so the compact preview
  // "YOUR PINS · 8  [preview] [+7]  [Expand]" is immediately clear beneath Active Career Mission.
  const [isExpanded, setIsExpanded] = useState<boolean>(() => {
    if (variant === 'sidebar') return true;
    const storedIntent = sessionStorage.getItem(INTENT_KEY);
    return storedIntent === 'expanded';
  });

  // Active Mode inside the expanded workspace: 'pins' (Tab 1) | 'assistant' (Tab 2)
  const [activeMode, setActiveMode] = useState<PinsWorkspaceMode>(() => {
    const saved = sessionStorage.getItem(MODE_KEY);
    return saved === 'assistant' ? 'assistant' : 'pins';
  });

  // Optional side-by-side split view on 23" large desktop viewports
  const [isWideSplitActive, setIsWideSplitActive] = useState<boolean>(false);

  const [filterCategory, setFilterCategory] = useState<PinCategory>('all');
  
  // Compact Creation Form State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<'note' | 'task'>('note');
  const [createTitle, setCreateTitle] = useState('');
  const [createContent, setCreateContent] = useState('');
  const [createPriority, setCreatePriority] = useState<TaskPriority>('high');
  const [createDueDate, setCreateDueDate] = useState('Tomorrow');
  const [createTags, setCreateTags] = useState('');
  const [createContext, setCreateContext] = useState('');

  // Note -> Task Conversion Modal State
  const [conversionNote, setConversionNote] = useState<CareerNote | null>(null);
  const [convertTitle, setConvertTitle] = useState('');
  const [convertDescription, setConvertDescription] = useState('');
  const [convertPriority, setConvertPriority] = useState<TaskPriority>('high');
  const [convertDueDate, setConvertDueDate] = useState('Tomorrow');

  // Note Edit Modal State
  const [editingNote, setEditingNote] = useState<CareerNote | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  // Active contextual menu dropdown
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Assistant Mode State
  const [selectedPinForAssistant, setSelectedPinForAssistant] = useState<PinnedViewItem | null>(null);
  const [assistantInput, setAssistantInput] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [createdTaskFeedbackId, setCreatedTaskFeedbackId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Derived contextual signals for the Assistant
  const currentReadiness = resolvedMission?.currentReadiness ?? resolvedProfile?.readinessScore ?? 76;
  const targetReadiness = resolvedMission?.targetReadiness ?? 90;
  const targetRoleLabel = resolvedMission?.targetRoleTitle || resolvedProfile?.targetTitle || resolvedProfile?.targetRole || 'Senior Product Manager';
  const targetDomainLabel = resolvedMission?.targetDomain || resolvedProfile?.targetDomain || 'Enterprise AI & B2B SaaS';
  const activeMissionTitle = resolvedMission?.title || `Transition to ${targetRoleLabel}`;
  const capabilityGaps = resolvedMission?.capabilityGaps || [
    { capability: 'AI Model Evaluation & System Quality Benchmarking', currentScore: 55, requiredScore: 85, priority: 'critical' as const },
    { capability: 'Executive Strategic Trade-offs & Scope Elimination', currentScore: 68, requiredScore: 90, priority: 'high' as const },
    { capability: 'Cross-Functional Architecture Alignment', currentScore: 74, requiredScore: 85, priority: 'medium' as const },
  ];
  const nextBestActionStep = resolvedMission?.steps.find(s => s.id === resolvedMission.nextBestActionId)
    || resolvedMission?.steps.find(s => s.status === 'in_progress' || s.status === 'pending')
    || resolvedMission?.steps[0];

  const [assistantTurns, setAssistantTurns] = useState<AssistantConversationTurn[]>(() => [
    {
      id: 'initial-context-brief',
      role: 'assistant',
      timestamp: 'Synced with workspace',
      contextBadges: [
        `Mission: ${activeMissionTitle}`,
        `Target: ${targetRoleLabel}`,
        `Readiness: ${currentReadiness}% → ${targetReadiness}%`,
        `Pins: ${UnifiedTaskService.getAllPinnedItems(savedJobs).length} active`
      ],
      content: `CareerOS Contextual Intelligence is active for **${activeMissionTitle}**.\n\n• **Readiness Calibration**: Currently at **${currentReadiness}%** against a **${targetReadiness}%** benchmark (${targetReadiness - currentReadiness}% delta).\n• **Primary Capability Gap**: **${capabilityGaps[0]?.capability}** (${capabilityGaps[0]?.currentScore}% vs. ${capabilityGaps[0]?.requiredScore}% required).\n• **Pinned Workspace Context**: **${UnifiedTaskService.getAllPinnedItems(savedJobs).length} items** loaded (tasks, notes, saved roles, and blueprints).\n\nSelect a prompt below or reference any pinned item to synthesize your next move.`
    }
  ]);

  // Sync pinned items and mission state whenever updated
  useEffect(() => {
    const handleSync = () => {
      setPinnedItems(UnifiedTaskService.getAllPinnedItems(savedJobs));
    };
    const handleMissionSync = () => {
      if (propMission === undefined) {
        setResolvedMission(CareerMissionService.getActiveMission());
      }
    };
    const handleOpenAssistant = () => {
      setIsExpanded(true);
      sessionStorage.setItem(INTENT_KEY, 'expanded');
      setActiveMode('assistant');
      sessionStorage.setItem(MODE_KEY, 'assistant');
      setTimeout(() => {
        const el = document.getElementById('canonical-your-pins-expanded') || document.getElementById('canonical-your-pins-bar');
        el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 40);
    };
    window.addEventListener('career_tasks_updated', handleSync);
    window.addEventListener('career_pins_updated', handleSync);
    window.addEventListener('career_radar_updated', handleSync);
    window.addEventListener('career_mission_updated', handleMissionSync);
    window.addEventListener('career_open_pins_assistant', handleOpenAssistant);
    return () => {
      window.removeEventListener('career_tasks_updated', handleSync);
      window.removeEventListener('career_pins_updated', handleSync);
      window.removeEventListener('career_radar_updated', handleSync);
      window.removeEventListener('career_mission_updated', handleMissionSync);
      window.removeEventListener('career_open_pins_assistant', handleOpenAssistant);
    };
  }, [savedJobs, propMission]);

  // Click outside listener for note menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSetExpanded = (next: boolean, modeOverride?: PinsWorkspaceMode) => {
    setIsExpanded(next);
    sessionStorage.setItem(INTENT_KEY, next ? 'expanded' : 'collapsed');
    if (modeOverride) {
      setActiveMode(modeOverride);
      sessionStorage.setItem(MODE_KEY, modeOverride);
    }
  };

  const handleSwitchMode = (mode: PinsWorkspaceMode) => {
    setActiveMode(mode);
    sessionStorage.setItem(MODE_KEY, mode);
    if (!isExpanded) {
      handleSetExpanded(true, mode);
    }
  };

  // Toggle Task Completion
  const handleToggleTaskComplete = (taskId: string) => {
    UnifiedTaskService.toggleTaskComplete(taskId);
  };

  // Unpin item
  const handleUnpinItem = (item: PinnedViewItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);

    if (item.type === 'task') {
      UnifiedTaskService.toggleTaskPin(item.originalId);
    } else if (item.type === 'note') {
      UnifiedTaskService.toggleNotePin(item.originalId);
    } else {
      setPinnedItems(prev => prev.filter(p => p.id !== item.id));
    }
  };

  // Delete item completely
  const handleDeleteItem = (item: PinnedViewItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveMenuId(null);

    if (item.type === 'task') {
      UnifiedTaskService.deleteTask(item.originalId);
    } else if (item.type === 'note') {
      UnifiedTaskService.deleteNote(item.originalId);
    } else {
      setPinnedItems(prev => prev.filter(p => p.id !== item.id));
    }
  };

  // Duplicate Note
  const handleDuplicateNote = (noteId: string) => {
    setActiveMenuId(null);
    UnifiedTaskService.duplicateNote(noteId);
  };

  // Submit Unified Creation Form ([Note] or [Task])
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createTitle.trim()) return;

    const parsedTags = createTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (createType === 'note') {
      UnifiedTaskService.addNote({
        title: createTitle.trim(),
        content: createContent.trim() || createTitle.trim(),
        tags: parsedTags.length > 0 ? parsedTags : ['Active Thought'],
        context: createContext.trim() || 'Quick Note',
        isPinned: true,
      });
    } else {
      UnifiedTaskService.addTask({
        title: createTitle.trim(),
        description: createContent.trim() || undefined,
        completed: false,
        priority: createPriority,
        dueDate: createDueDate.trim() || 'Next actions',
        source: 'manual',
        sourceLabel: createContext.trim() || 'Your Pins',
        isPinned: true,
        tags: parsedTags.length > 0 ? parsedTags : ['Quick Task'],
      });
    }

    setCreateTitle('');
    setCreateContent('');
    setCreateTags('');
    setCreateContext('');
    setIsCreateOpen(false);
  };

  // Start Note -> Task Conversion
  const handleStartConversion = (note: CareerNote) => {
    setConversionNote(note);
    setConvertTitle(note.title);
    setConvertDescription(note.content);
    setConvertPriority('high');
    setConvertDueDate('Tomorrow');
    setActiveMenuId(null);
  };

  // Execute Note -> Task Conversion
  const handleExecuteConversion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversionNote || !convertTitle.trim()) return;

    UnifiedTaskService.convertNoteToTask(conversionNote.id, {
      title: convertTitle.trim(),
      description: convertDescription.trim(),
      priority: convertPriority,
      dueDate: convertDueDate.trim() || 'Tomorrow',
    });

    setConversionNote(null);
  };

  // Start Note Edit
  const handleStartEditNote = (note: CareerNote) => {
    setEditingNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
    setActiveMenuId(null);
  };

  // Save Note Edit
  const handleSaveEditNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editTitle.trim()) return;

    const parsedTags = editTags.split(',').map(t => t.trim()).filter(Boolean);
    UnifiedTaskService.updateNote(editingNote.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      tags: parsedTags.length > 0 ? parsedTags : editingNote.tags,
    });

    setEditingNote(null);
  };

  // Contextual Assistant Synthesis Logic
  const synthesizeAssistantResponse = (promptText: string, pinRef?: PinnedViewItem | null) => {
    const activePin = pinRef !== undefined ? pinRef : (selectedPinForAssistant || pinnedItems[0] || null);
    const trimmed = promptText.trim();
    if (!trimmed || isSynthesizing) return;

    const userTurn: AssistantConversationTurn = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: 'Just now',
      referencedPinTitle: activePin ? activePin.title : undefined,
    };

    setAssistantTurns(prev => [...prev, userTurn]);
    setAssistantInput('');
    setIsSynthesizing(true);

    setTimeout(() => {
      const lower = trimmed.toLowerCase();
      const topGap = capabilityGaps[0];
      const secondGap = capabilityGaps[1];
      const thirdGap = capabilityGaps[2];
      let replyContent = '';
      let suggestedTaskTitle: string | undefined;
      let suggestedTaskDescription: string | undefined;
      let canLaunchLivePractice = false;
      let canExecuteMissionStep = false;

      if (lower.includes('stuck') || lower.includes('why is my readiness') || lower.includes(`${currentReadiness}%`)) {
        replyContent = `Your readiness for **${targetRoleLabel}** is currently **${currentReadiness}%** (Target: **${targetReadiness}%**) because two high-weight capability thresholds lack verified L3/L4 execution evidence:\n\n1. **${topGap?.capability || 'AI Model Evaluation & System Quality Benchmarking'}** — Currently **${topGap?.currentScore ?? 55}%** vs. **${topGap?.requiredScore ?? 85}%** required (**-${(topGap?.requiredScore ?? 85) - (topGap?.currentScore ?? 55)}% gap**). This is your primary readiness bottleneck.\n2. **${secondGap?.capability || 'Executive Strategic Trade-offs & Scope Elimination'}** — Currently **${secondGap?.currentScore ?? 68}%** vs. **${secondGap?.requiredScore ?? 90}%** required.\n\n**How to unlock the next +${nextBestActionStep?.readinessImpact ?? 5}% readiness gain:**\nComplete the active mission step **"${nextBestActionStep?.title || '15-Min AI Failure Triage Case Drill'}"** to convert your theoretical knowledge into scored interview evidence.`;
        canExecuteMissionStep = true;
        canLaunchLivePractice = true;
      } else if (lower.includes('which pinned items') || lower.includes('most relevant')) {
        const topPins = pinnedItems.slice(0, 3);
        const pinLines = topPins.map((p, idx) => {
          const relevanceNote = idx === 0
            ? `Directly supports **${topGap?.capability || 'Primary Capability Gap'}** and your next practice drill.`
            : idx === 1
            ? `Provides concrete STAR proof for **${secondGap?.capability || 'Executive Trade-offs'}**.`
            : `Aligns with target role expectations for **${targetRoleLabel}** (${targetDomainLabel}).`;
          return `${idx + 1}. **[${p.type.toUpperCase()}] ${p.title}** — ${relevanceNote}`;
        }).join('\n');

        replyContent = `Out of your **${pinnedItems.length} pinned items**, these are the highest-leverage items for **${activeMissionTitle}**:\n\n${pinLines || '• No pinned items found.'}\n\n**Recommendation:** Prioritize **${topPins[0]?.title || 'your top pinned task'}** before starting your next live simulation so its metrics are fresh in your Q&A blueprint.`;
        if (topPins[0]) {
          suggestedTaskTitle = `Practice Drill: Apply "${topPins[0].title}" to ${targetRoleLabel} Rubric`;
          suggestedTaskDescription = `Synthesize key metrics and trade-offs from "${topPins[0].title}" into a 180-second structured response.`;
        }
      } else if (lower.includes('practice next') || lower.includes('what should i practice')) {
        replyContent = `Based on your active mission (**${activeMissionTitle}**) and your **${currentReadiness}%** readiness signal, here is your highest-impact practice sequence:\n\n1. **Immediate Next Best Action (+${nextBestActionStep?.readinessImpact ?? 5}% Readiness)**: **${nextBestActionStep?.title || 'Complete 15-Min AI Failure Triage Case Drill'}** — ${nextBestActionStep?.description || 'Defend architectural trade-offs and failure recovery under executive scrutiny.'}\n2. **Pinned Task Alignment**: Connect **${activePin?.title || 'your pinned notes'}** to the **${topGap?.capability || 'Core Capability'}** rubric.\n3. **Live Verification**: Run a 3-question **Live Interview** focused on Technical Architecture & Strategic Trade-offs.`;
        canLaunchLivePractice = true;
        canExecuteMissionStep = true;
        suggestedTaskTitle = `Rehearse STAR Opening Hook: ${topGap?.capability || 'System Architecture Trade-offs'}`;
        suggestedTaskDescription = `Deliver a 90-second opening framing covering invariants, failure modes, and measurable business outcomes.`;
      } else if (lower.includes('compare') || lower.includes('capability gaps')) {
        replyContent = `### Capability Gap vs. Target Role Comparison (**${targetRoleLabel}** · ${targetDomainLabel})\n\n• **${topGap?.capability || 'AI Model Evaluation & System Quality'}**: **${topGap?.currentScore ?? 55}% / ${topGap?.requiredScore ?? 85}%** (*Critical Gap*) — Target role requires defending evaluation harness design, latency/cost trade-offs, and hallucination guardrails.\n• **${secondGap?.capability || 'Executive Strategic Trade-offs'}**: **${secondGap?.currentScore ?? 68}% / ${secondGap?.requiredScore ?? 90}%** (*High Gap*) — Target role expects clear scope elimination and multi-quarter resource allocation defense.\n• **${thirdGap?.capability || 'Cross-Functional Architecture Alignment'}**: **${thirdGap?.currentScore ?? 74}% / ${thirdGap?.requiredScore ?? 85}%** (*Moderate Gap*) — Close to target benchmark; link 1 additional project proof point from your storybank to reach 85%.`;
        canLaunchLivePractice = true;
      } else if (lower.includes('turn this pinned item') || lower.includes('interview practice task') || lower.includes('convert')) {
        const targetPin = activePin || pinnedItems[0];
        const pinTitle = targetPin ? targetPin.title : 'System Architecture & Trade-off Notes';
        suggestedTaskTitle = `Interview Practice Task: ${pinTitle}`;
        suggestedTaskDescription = `Structure "${pinTitle}" into a 3-minute STAR + Trade-off defense for ${targetRoleLabel} (${topGap?.capability || 'Core Rubric'}). Quantify baseline metrics, intervention, and production outcome.`;
        replyContent = `I have structured **${pinTitle}** into an actionable interview practice task calibrated for **${targetRoleLabel}**:\n\n• **Task Title**: *${suggestedTaskTitle}*\n• **Target Capability**: ${topGap?.capability || 'Architectural Defense & Strategic Trade-offs'}\n• **Deliverable**: 180-second spoken defense covering context, trade-off matrix, and verified metric impact.\n\nClick **Add Practice Task to Your Pins** below to pin this directly to your active board, or launch a Live Interview session now.`;
        canLaunchLivePractice = true;
      } else {
        replyContent = `Grounded in your **${targetRoleLabel}** workspace (**${currentReadiness}% Readiness** · **${pinnedItems.length} Pins**):\n\n• **Active Mission Context**: ${activeMissionTitle}\n• **Referenced Pin**: ${activePin ? `*${activePin.title}* (${activePin.type.toUpperCase()})` : 'All Pinned Items'}\n• **Recommended Next Step**: Focus on closing the **${topGap?.capability || 'primary capability'}** gap (${topGap?.currentScore ?? 55}% → ${topGap?.requiredScore ?? 85}%) by pairing your pinned evidence with a timed practice simulation.`;
        if (activePin) {
          suggestedTaskTitle = `Action Item from Pin: ${activePin.title}`;
          suggestedTaskDescription = `Apply insights from "${activePin.title}" toward ${activeMissionTitle}.`;
        }
        canLaunchLivePractice = true;
      }

      const assistantTurn: AssistantConversationTurn = {
        id: `ast-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: 'Just now',
        referencedPinTitle: activePin ? activePin.title : undefined,
        contextBadges: [
          `Readiness: ${currentReadiness}%`,
          `Target: ${targetRoleLabel}`,
          ...(activePin ? [`@Pin: ${activePin.title}`] : [])
        ],
        suggestedTaskTitle,
        suggestedTaskDescription,
        canLaunchLivePractice,
        canExecuteMissionStep
      };

      setAssistantTurns(prev => [...prev, assistantTurn]);
      setIsSynthesizing(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 60);
    }, 380);
  };

  const handleAddSuggestedPracticeTask = (turn: AssistantConversationTurn) => {
    if (!turn.suggestedTaskTitle) return;
    UnifiedTaskService.addTask({
      title: turn.suggestedTaskTitle,
      description: turn.suggestedTaskDescription,
      completed: false,
      priority: 'high',
      dueDate: 'Today · Mission Priority',
      source: 'ai_copilot',
      sourceLabel: 'CareerOS Assistant',
      isPinned: true,
      tags: ['Practice Task', targetRoleLabel],
    });
    setCreatedTaskFeedbackId(turn.id);
    setTimeout(() => setCreatedTaskFeedbackId(null), 2500);
  };

  const handleReferencePinInAssistant = (item: PinnedViewItem, autoConvertPrompt = false) => {
    setSelectedPinForAssistant(item);
    handleSwitchMode('assistant');
    if (autoConvertPrompt) {
      synthesizeAssistantResponse(`Turn this pinned item ("${item.title}") into an interview practice task.`, item);
    }
  };

  const filteredItems = pinnedItems.filter(item => {
    if (filterCategory === 'all') return true;
    return item.type === filterCategory;
  });

  const suggestedPrompts = [
    `Why is my readiness stuck at ${currentReadiness}%?`,
    'Which pinned items are most relevant to my active mission?',
    'What should I practice next?',
    'Compare my current capability gaps with this target role.',
    'Turn this pinned item into an interview practice task.'
  ];

  // ============================================================================
  // 1. COLLAPSED LAUNCHER STATE (Canonical Compact Preview beneath Active Mission)
  // Format:
  // YOUR PINS · 8   [ pinned item preview ] [+7]                      [ Expand ]
  // ============================================================================
  if (variant === 'dashboard-strip' && !isExpanded) {
    const mostRecentItem = pinnedItems[0];
    const remainingCount = Math.max(0, pinnedItems.length - 1);

    return (
      <div
        id="canonical-your-pins-bar"
        className={`bg-white/95 rounded-2xl border border-slate-200/90 shadow-2xs px-4 py-2.5 flex items-center justify-between gap-3 transition-all duration-200 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shrink-0">
            <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
          </div>
          
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="font-extrabold tracking-wider text-slate-800 uppercase text-[11px]">
              YOUR PINS
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded-full">
              {pinnedItems.length}
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-200 shrink-0 hidden sm:block mx-1" />

          {mostRecentItem ? (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 min-w-0">
              <button
                type="button"
                onClick={() => handleSetExpanded(true, 'pins')}
                className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-xs font-medium text-slate-700 truncate max-w-[240px] sm:max-w-[320px] lg:max-w-[420px] flex items-center gap-1.5 transition cursor-pointer"
                title={mostRecentItem.title}
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  mostRecentItem.type === 'task' ? 'bg-amber-400' :
                  mostRecentItem.type === 'job' ? 'bg-blue-500' :
                  mostRecentItem.type === 'knowledge' ? 'bg-purple-500' :
                  'bg-emerald-400'
                }`} />
                <span className="truncate">{mostRecentItem.title}</span>
              </button>

              {remainingCount > 0 && (
                <button
                  type="button"
                  onClick={() => handleSetExpanded(true, 'pins')}
                  className="px-2 py-0.8 rounded-lg bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-600 border border-slate-200 transition cursor-pointer shrink-0"
                  title={`View all ${pinnedItems.length} pinned items`}
                >
                  +{remainingCount}
                </button>
              )}
            </div>
          ) : (
            <span className="text-xs text-slate-400 truncate">
              No pinned items yet — expand to pin notes, tasks, or ask Assistant
            </span>
          )}
        </div>

        {/* Right Controls: Quick Assistant Pill + Canonical [Expand] Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => handleSetExpanded(true, 'assistant')}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-semibold transition cursor-pointer"
            title="Open CareerOS Contextual Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Assistant</span>
          </button>

          <button
            id="btn-expand-your-pins"
            type="button"
            onClick={() => handleSetExpanded(true)}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200/90 px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-2xs"
            title="Expand Your Pins & Assistant Workspace"
          >
            <span>Expand</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. EXPANDED WORKSPACE
  // Format:
  // YOUR PINS · 8
  // [Your Pins] [Assistant]
  // [content]
  // ============================================================================
  const isDashboardStrip = variant === 'dashboard-strip';

  // Render the Pins content pane
  const renderPinsPane = () => (
    <div className="flex flex-col min-w-0">
      {/* Sub-bar: Category Filters + [+ Pin] Trigger */}
      <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(['all', 'task', 'note', 'job', 'knowledge'] as const).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-500 hidden md:inline">
            Click any pin&apos;s <strong className="text-indigo-600 font-semibold">Ask Assistant</strong> action to synthesize tasks
          </span>
          <button
            type="button"
            onClick={() => setIsCreateOpen(prev => !prev)}
            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer shadow-3xs"
            title="Create Note or Task"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Pin</span>
          </button>
        </div>
      </div>

      {/* COMPACT CREATION SURFACE ([Note] / [Task]) */}
      {isCreateOpen && (
        <div className="p-3.5 bg-slate-50 border-b border-slate-200 animate-in fade-in">
          <form onSubmit={handleCreateSubmit} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-800">Create new pinned item</span>
              
              <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setCreateType('note')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    createType === 'note'
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Note
                </button>
                <button
                  type="button"
                  onClick={() => setCreateType('task')}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    createType === 'task'
                      ? 'bg-white text-slate-900 shadow-3xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Task
                </button>
              </div>
            </div>

            {createType === 'note' ? (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Note title (e.g. System Design principles)..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="Add note, active thought, or insight..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={createTags}
                    onChange={(e) => setCreateTags(e.target.value)}
                    placeholder="Optional tags (e.g. Design, STAR)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />
                  <input
                    type="text"
                    value={createContext}
                    onChange={(e) => setCreateContext(e.target.value)}
                    placeholder="Optional context (e.g. Architecture)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                <input
                  type="text"
                  value={createTitle}
                  onChange={(e) => setCreateTitle(e.target.value)}
                  placeholder="Task title (e.g. Prepare 30 core interview questions)..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  autoFocus
                />
                <textarea
                  value={createContent}
                  onChange={(e) => setCreateContent(e.target.value)}
                  placeholder="Description (optional details)..."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs bg-slate-50/70 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <select
                    value={createPriority}
                    onChange={(e) => setCreatePriority(e.target.value as TaskPriority)}
                    className="px-2 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700 cursor-pointer"
                  >
                    <option value="high">HIGH Priority</option>
                    <option value="medium">MEDIUM Priority</option>
                    <option value="low">LOW Priority</option>
                  </select>

                  <input
                    type="text"
                    value={createDueDate}
                    onChange={(e) => setCreateDueDate(e.target.value)}
                    placeholder="Due date"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />

                  <input
                    type="text"
                    value={createTags}
                    onChange={(e) => setCreateTags(e.target.value)}
                    placeholder="Tags (comma-separated)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />

                  <input
                    type="text"
                    value={createContext}
                    onChange={(e) => setCreateContext(e.target.value)}
                    placeholder="Related context (e.g. My Profile)"
                    className="px-2.5 py-1 text-xs bg-slate-50/70 border border-slate-200 rounded-md text-slate-700"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!createTitle.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-3xs"
              >
                Pin
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PINNED CARDS GRID — Responsive across 14", 16", and 23" */}
      <div className={`p-3.5 sm:p-4 ${
        isDashboardStrip
          ? isWideSplitActive
            ? 'grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[420px] overflow-y-auto'
            : 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 max-h-[390px] overflow-y-auto'
          : 'space-y-2.5 max-h-[420px] overflow-y-auto'
      }`}>
        {filteredItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 col-span-full space-y-1">
            <Pin className="w-5 h-5 mx-auto text-slate-300 opacity-50" />
            <p>No pinned items in this category.</p>
            <p className="text-[11px] text-slate-400">Click [+ Pin] above or pin actions from My Profile.</p>
          </div>
        ) : (
          filteredItems.map(item => {
            const isTask = item.type === 'task';
            const isNote = item.type === 'note';
            const isSelectedInAssistant = selectedPinForAssistant?.id === item.id;

            return (
              <div 
                key={item.id} 
                className={`group relative bg-white hover:bg-slate-50/80 p-3 rounded-xl border transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs ${
                  isSelectedInAssistant
                    ? 'border-indigo-400 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Top Metadata Header with Category & Actions */}
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        item.type === 'task' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        item.type === 'job' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        item.type === 'knowledge' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}>
                        {item.type}
                      </span>

                      {item.priority && (
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1 py-0.2 rounded ${
                          item.priority === 'high' ? 'bg-rose-50 text-rose-700' :
                          item.priority === 'medium' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.priority}
                        </span>
                      )}

                      {item.convertedFromNote && (
                        <span className="text-[9px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1 py-0.2 rounded">
                          Converted from Note
                        </span>
                      )}
                    </div>

                    {/* Contextual Action Menu / Unpin */}
                    <div className="flex items-center gap-0.5">
                      {isNote && item.rawNote ? (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === item.id ? null : item.id);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Note options"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {activeMenuId === item.id && (
                            <div 
                              ref={menuRef}
                              className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-slate-200 shadow-xl py-1 z-30 text-xs font-medium text-slate-700 animate-in fade-in"
                            >
                              <button
                                type="button"
                                onClick={() => item.rawNote && handleStartEditNote(item.rawNote)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3 text-slate-400" />
                                <span>Edit Note</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => item.rawNote && handleStartConversion(item.rawNote)}
                                className="w-full text-left px-3 py-1.5 hover:bg-blue-50 text-blue-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                <ListTodo className="w-3 h-3 text-blue-600" />
                                <span>Convert to Task</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleReferencePinInAssistant(item, true);
                                }}
                                className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                              >
                                <Sparkles className="w-3 h-3 text-indigo-600" />
                                <span>Practice Task via AI</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => item.rawNote && handleDuplicateNote(item.rawNote.id)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-700 cursor-pointer"
                              >
                                <Copy className="w-3 h-3 text-slate-400" />
                                <span>Duplicate</span>
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleUnpinItem(item, e)}
                                className="w-full text-left px-3 py-1.5 hover:bg-slate-50 flex items-center gap-1.5 text-slate-600 cursor-pointer"
                              >
                                <Pin className="w-3 h-3 text-slate-400" />
                                <span>Unpin</span>
                              </button>
                              <div className="h-px bg-slate-100 my-1" />
                              <button
                                type="button"
                                onClick={(e) => handleDeleteItem(item, e)}
                                className="w-full text-left px-3 py-1.5 hover:bg-rose-50 text-rose-600 flex items-center gap-1.5 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3 text-rose-500" />
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleUnpinItem(item, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-amber-600 p-0.5 transition-opacity cursor-pointer"
                          title="Unpin from Your Pins"
                        >
                          <Pin className="w-3 h-3 rotate-45" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Title & Checkbox for Task */}
                  {isTask ? (
                    <div className="flex items-start gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleToggleTaskComplete(item.originalId)}
                        className="mt-0.5 shrink-0 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      >
                        {item.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-300" />
                        )}
                      </button>

                      <div className="min-w-0 flex-1">
                        <h4 className={`text-xs font-bold leading-snug ${
                          item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}>
                          {item.title}
                        </h4>

                        {item.excerpt && (
                          <p className={`text-[11px] leading-relaxed line-clamp-2 mt-1 ${
                            item.completed ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {item.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug mb-1">
                        {item.title}
                      </h4>
                      {item.excerpt && (
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-1.5">
                          {item.excerpt}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metadata + Quick Reference in Assistant */}
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5 truncate min-w-0">
                    {item.sourceLabel && (
                      <span className="font-semibold text-slate-600 truncate">
                        {item.sourceLabel}
                      </span>
                    )}
                    {item.dueDate && (
                      <>
                        <span>·</span>
                        <span className="text-slate-500 font-medium truncate">
                          {item.dueDate}
                        </span>
                      </>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleReferencePinInAssistant(item, false)}
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 font-semibold text-[10px] transition-colors cursor-pointer shrink-0"
                    title="Reference this pinned item in Assistant"
                  >
                    <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                    <span>Ask Assistant</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  // Render the Assistant content pane
  const renderAssistantPane = () => {
    const activePinRef = selectedPinForAssistant || pinnedItems[0] || null;

    return (
      <div className="flex flex-col min-w-0 bg-gradient-to-b from-indigo-50/25 via-white to-white">
        {/* 1. CURRENT-CONTEXT INDICATOR STRIP */}
        <div className="px-3.5 sm:px-4 py-2.5 bg-slate-50/90 border-b border-slate-200/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[10px] uppercase tracking-wider">
              <Sparkles className="w-2.5 h-2.5" />
              <span>Context Active</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-700 font-semibold">
              <Target className="w-3 h-3 text-blue-600" />
              <span className="truncate max-w-[180px] sm:max-w-[240px]">{activeMissionTitle}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200/90 text-slate-700 font-semibold">
              <Compass className="w-3 h-3 text-indigo-600" />
              <span>{targetRoleLabel}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/80 text-emerald-800 font-bold">
              <span>Readiness: {currentReadiness}%</span>
              <span className="text-emerald-600 font-normal">→ {targetReadiness}%</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200/80 text-amber-900 font-semibold">
              <Layers className="w-3 h-3 text-amber-600" />
              <span>{capabilityGaps.length} Capability Gaps</span>
            </span>
          </div>

          {/* Active Referenced Pin Selector Pill */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium hidden sm:inline">Referenced Pin:</span>
            <select
              value={activePinRef?.id || ''}
              onChange={(e) => {
                const found = pinnedItems.find(p => p.id === e.target.value) || null;
                setSelectedPinForAssistant(found);
              }}
              aria-label="Select pinned item to reference in Assistant"
              className="px-2 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 font-semibold text-[11px] max-w-[220px] truncate cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              {pinnedItems.map(p => (
                <option key={p.id} value={p.id}>
                  📌 [{p.type.toUpperCase()}] {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. MAIN ASSISTANT WORKSPACE BODY (Responsive for 14", 16", and 23") */}
        <div className="p-3.5 sm:p-4 grid grid-cols-1 2xl:grid-cols-12 gap-4 items-start">
          
          {/* LEFT / MAIN COLUMN: Suggested Prompts + Conversation Stream + Input */}
          <div className={`${isWideSplitActive ? '2xl:col-span-12' : '2xl:col-span-8'} flex flex-col space-y-3 min-w-0`}>
            
            {/* Suggested Contextual Prompts */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Suggested Contextual Prompts
                </span>
                {activePinRef && (
                  <span className="text-[10px] text-indigo-600 font-semibold truncate max-w-[250px]">
                    Active Pin: {activePinRef.title}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => synthesizeAssistantResponse(prompt, activePinRef)}
                    className="text-left px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50/80 text-slate-700 hover:text-indigo-900 border border-slate-200/90 hover:border-indigo-300 text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 shadow-3xs"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>{prompt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="bg-slate-50/70 rounded-2xl border border-slate-200/80 p-3 sm:p-3.5 space-y-3 max-h-[300px] overflow-y-auto">
              {assistantTurns.map(turn => (
                <div
                  key={turn.id}
                  className={`flex flex-col ${turn.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {turn.role === 'user' ? (
                    <div className="bg-slate-900 text-white px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[90%] text-xs font-medium shadow-2xs space-y-1">
                      {turn.referencedPinTitle && (
                        <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-white/15 text-amber-300 text-[10px] font-semibold">
                          <Pin className="w-2.5 h-2.5 rotate-45" />
                          <span className="truncate max-w-[220px]">{turn.referencedPinTitle}</span>
                        </div>
                      )}
                      <div>{turn.content}</div>
                    </div>
                  ) : (
                    <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-3.5 max-w-[98%] text-xs text-slate-800 shadow-2xs space-y-2.5">
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-indigo-50 border border-indigo-200/80 text-indigo-600 flex items-center justify-center">
                            <Bot className="w-3 h-3" />
                          </div>
                          <span className="font-bold text-slate-900 text-[11px]">
                            CareerOS Intelligence Assistant
                          </span>
                          <span className="text-[10px] text-slate-400">· {turn.timestamp}</span>
                        </div>

                        {turn.contextBadges && turn.contextBadges.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            {turn.contextBadges.slice(0, 3).map((badge, bIdx) => (
                              <span
                                key={bIdx}
                                className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium text-[10px]"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="whitespace-pre-line leading-relaxed text-xs text-slate-700">
                        {turn.content}
                      </div>

                      {/* Contextual Action Bar inside Assistant Turn */}
                      {(turn.suggestedTaskTitle || turn.canLaunchLivePractice || turn.canExecuteMissionStep) && (
                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          {turn.suggestedTaskTitle && (
                            createdTaskFeedbackId === turn.id ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Pinned to Your Pins</span>
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleAddSuggestedPracticeTask(turn)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200/90 text-amber-900 font-bold text-[11px] transition-colors cursor-pointer"
                              >
                                <Pin className="w-3 h-3 rotate-45 text-amber-600" />
                                <span>Add Practice Task to Your Pins</span>
                              </button>
                            )
                          )}

                          {turn.canExecuteMissionStep && nextBestActionStep && onExecuteMissionStep && (
                            <button
                              type="button"
                              onClick={() => onExecuteMissionStep(nextBestActionStep)}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] transition-colors cursor-pointer"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Execute Next Mission Action</span>
                            </button>
                          )}

                          {turn.canLaunchLivePractice && (onStartLiveInterview || onStartMockPractice) && (
                            <button
                              type="button"
                              onClick={() => {
                                if (onStartLiveInterview) onStartLiveInterview();
                                else if (onStartMockPractice) onStartMockPractice();
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition-colors cursor-pointer"
                            >
                              <span>Launch Practice Simulation</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isSynthesizing && (
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                  <span>Synthesizing mission readiness, capability gaps, and pinned context...</span>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Conversational Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                synthesizeAssistantResponse(assistantInput, activePinRef);
              }}
              className="flex items-center gap-2 bg-white rounded-xl border border-slate-200/90 px-3 py-2 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all shadow-2xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
              <input
                type="text"
                value={assistantInput}
                onChange={(e) => setAssistantInput(e.target.value)}
                placeholder={
                  activePinRef
                    ? `Ask about "${activePinRef.title}", your ${currentReadiness}% readiness, or capability gaps...`
                    : 'Ask about your active mission, readiness gaps, pinned items, or what to practice next...'
                }
                className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent min-w-0"
              />
              <button
                type="submit"
                disabled={!assistantInput.trim() || isSynthesizing}
                className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
              >
                <span>Ask</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* RIGHT CONTEXTUAL RAIL ON 23" WIDE DESKTOP (When not already in full split view) */}
          {!isWideSplitActive && (
            <div className="hidden 2xl:flex 2xl:col-span-4 flex-col space-y-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 p-3.5">
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-2">
                <div className="flex items-center gap-1.5">
                  <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500" />
                  <span className="text-xs font-bold text-slate-900">
                    Pinned Context &amp; Gaps
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Click to reference
                </span>
              </div>

              {/* Active Capability Gaps Summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Mission Capability Gaps ({targetRoleLabel})
                </span>
                {capabilityGaps.slice(0, 3).map((gap, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between gap-2 text-[11px]"
                  >
                    <span className="font-semibold text-slate-800 truncate">{gap.capability}</span>
                    <span className="font-mono font-bold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded shrink-0">
                      {gap.currentScore}% → {gap.requiredScore}%
                    </span>
                  </div>
                ))}
              </div>

              {/* Quick Pinned Items Reference List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Your Pins ({pinnedItems.length})
                </span>
                <div className="space-y-1.5 max-h-[185px] overflow-y-auto pr-0.5">
                  {pinnedItems.slice(0, 5).map(pin => {
                    const isSelected = activePinRef?.id === pin.id;
                    return (
                      <div
                        key={pin.id}
                        className={`p-2 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 font-semibold'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedPinForAssistant(pin)}
                          className="text-left truncate flex-1 cursor-pointer"
                          title={pin.title}
                        >
                          <span className="text-[9px] font-extrabold uppercase mr-1.5 px-1 py-0.2 rounded bg-slate-100 text-slate-600">
                            {pin.type}
                          </span>
                          <span>{pin.title}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReferencePinInAssistant(pin, true)}
                          className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold shrink-0 cursor-pointer"
                          title="Turn this pinned item into an interview practice task"
                        >
                          → Task
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  };

  return (
    <div
      id="canonical-your-pins-workspace"
      className={`flex flex-col bg-white/95 rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden transition-all duration-200 relative ${className}`}
    >
      {/* ==================================================
          CANONICAL TOP HEADER BAR
          Format:
          YOUR PINS · 8    [Your Pins] [Assistant]    [Collapse]
          ================================================== */}
      <div className="px-3.5 sm:px-4 py-2.5 border-b border-slate-200/80 bg-white flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Canonical Title + Count + Mode Tabs */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60 shrink-0">
              <Pin className="w-3.5 h-3.5 rotate-45 text-amber-500 fill-amber-500/20" />
            </div>
            <span className="font-extrabold tracking-wider text-slate-900 uppercase text-[11px]">
              YOUR PINS
            </span>
            <span className="text-slate-400 font-bold">·</span>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100/80 px-1.5 py-0.2 rounded-full">
              {pinnedItems.length}
            </span>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Primary Workspace Mode Tabs: [Your Pins] [Assistant] */}
          <div
            className="inline-flex items-center p-0.5 rounded-xl bg-slate-100 border border-slate-200/80"
            role="tablist"
            aria-label="Your Pins and Assistant Workspace Modes"
          >
            <button
              id="tab-mode-your-pins"
              type="button"
              role="tab"
              aria-selected={activeMode === 'pins'}
              onClick={() => {
                setIsWideSplitActive(false);
                handleSwitchMode('pins');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'pins' && !isWideSplitActive
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/70'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Pin className={`w-3 h-3 rotate-45 ${activeMode === 'pins' && !isWideSplitActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Your Pins</span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.1 rounded-full bg-slate-200/70 text-slate-700">
                {pinnedItems.length}
              </span>
            </button>

            <button
              id="tab-mode-assistant"
              type="button"
              role="tab"
              aria-selected={activeMode === 'assistant'}
              onClick={() => {
                setIsWideSplitActive(false);
                handleSwitchMode('assistant');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'assistant' && !isWideSplitActive
                  ? 'bg-white text-indigo-950 shadow-2xs border border-indigo-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className={`w-3 h-3 ${activeMode === 'assistant' && !isWideSplitActive ? 'text-indigo-600' : 'text-slate-400'}`} />
              <span>Assistant</span>
            </button>
          </div>
        </div>

        {/* Right: 23" Coexistence Split Toggle + Collapse Control */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsWideSplitActive(prev => !prev)}
            className={`hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors cursor-pointer ${
              isWideSplitActive
                ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
            }`}
            title="Coexist Your Pins and Assistant side-by-side on wide displays"
          >
            <Columns2 className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>

          {isDashboardStrip && (
            <button
              id="btn-collapse-your-pins"
              type="button"
              onClick={() => handleSetExpanded(false)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg flex items-center gap-1 transition cursor-pointer"
              title="Collapse into compact preview bar"
            >
              <span>Collapse</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          WORKSPACE CONTENT AREA
          - Standard Mode: Shows activeMode ('pins' or 'assistant')
          - 23" Wide Split Mode: Coexists Pins and Assistant horizontally
          ================================================== */}
      {isWideSplitActive ? (
        <div className="grid grid-cols-1 2xl:grid-cols-12 divide-y 2xl:divide-y-0 2xl:divide-x divide-slate-200/80">
          <div className="2xl:col-span-6 min-w-0">
            {renderPinsPane()}
          </div>
          <div className="2xl:col-span-6 min-w-0">
            {renderAssistantPane()}
          </div>
        </div>
      ) : (
        activeMode === 'pins' ? renderPinsPane() : renderAssistantPane()
      )}

      {/* NOTE -> TASK CONVERSION MODAL */}
      {conversionNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Convert Note to Task</h3>
              </div>
              <button
                type="button"
                onClick={() => setConversionNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleExecuteConversion} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  value={convertTitle}
                  onChange={(e) => setConvertTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Description / Context</label>
                <textarea
                  value={convertDescription}
                  onChange={(e) => setConvertDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={convertPriority}
                    onChange={(e) => setConvertPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 cursor-pointer"
                  >
                    <option value="high">HIGH</option>
                    <option value="medium">MEDIUM</option>
                    <option value="low">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="text"
                    value={convertDueDate}
                    onChange={(e) => setConvertDueDate(e.target.value)}
                    placeholder="e.g. Due tomorrow"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-500 italic">
                The original note will be converted into this shared task without duplicate records.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setConversionNote(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!convertTitle.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg font-bold cursor-pointer shadow-3xs"
                >
                  Convert to Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NOTE EDIT MODAL */}
      {editingNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">Edit Note</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingNote(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditNote} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Content</label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900 resize-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. Design, Personal"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingNote(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!editTitle.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white rounded-lg font-bold cursor-pointer shadow-3xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
