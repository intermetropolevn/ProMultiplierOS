import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Filter, 
  Search, 
  ChevronRight, 
  Play, 
  Bookmark, 
  ShieldCheck, 
  Sliders, 
  TrendingUp, 
  UserCheck, 
  Lightbulb, 
  Save,
  HelpCircle
} from 'lucide-react';
import { 
  BusinessEnglishScenario, 
  RolePlayMessage, 
  RolePlaySessionFeedback, 
  PracticeDifficulty, 
  SeniorityLevel, 
  ConversationPartnerRole,
  WorkplaceContext
} from '../../features/businessEnglish/types';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';
import { AudioPermissionGate } from '../common/AudioPermissionGate';
import { AudioPermissionService } from '../../services/audioPermissionService';

interface RolePlayStudioProps {
  initialScenarioId?: string;
  onSaveToProfile?: (sessionFeedback: RolePlaySessionFeedback) => void;
  onSaveVocabTerm?: (term: string) => void;
  className?: string;
}

export const RolePlayStudio: React.FC<RolePlayStudioProps> = ({
  initialScenarioId,
  onSaveToProfile,
  onSaveVocabTerm,
  className = ''
}) => {
  const scenarios = BusinessEnglishService.getScenarios();

  // Mode: 'select_scenario' | 'active_roleplay' | 'session_report'
  const [stage, setStage] = useState<'select_scenario' | 'active_roleplay' | 'session_report'>(
    initialScenarioId ? 'active_roleplay' : 'select_scenario'
  );

  const [selectedScenario, setSelectedScenario] = useState<BusinessEnglishScenario>(() => {
    if (initialScenarioId) {
      const found = scenarios.find(s => s.id === initialScenarioId);
      if (found) return found;
    }
    return scenarios[0];
  });

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Roleplay Session State
  const [messages, setMessages] = useState<RolePlayMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);
  const [sessionFeedback, setSessionFeedback] = useState<RolePlaySessionFeedback | null>(null);
  const [savedPhrases, setSavedPhrases] = useState<string[]>([]);
  const [isAudioGateOpen, setIsAudioGateOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Release any active microphone stream on unmount
  useEffect(() => {
    return () => {
      AudioPermissionService.releaseStream();
    };
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiResponding]);

  // Handle initial scenario change if prop updates
  useEffect(() => {
    if (initialScenarioId) {
      const found = scenarios.find(s => s.id === initialScenarioId);
      if (found) {
        setSelectedScenario(found);
        handleStartScenario(found);
      }
    }
  }, [initialScenarioId]);

  // Start a scenario
  const handleStartScenario = (scenario: BusinessEnglishScenario) => {
    setSelectedScenario(scenario);
    const initialAiMessage: RolePlayMessage = {
      id: `msg-${Date.now()}`,
      sender: 'partner',
      text: scenario.initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      audioAvailable: true
    };
    setMessages([initialAiMessage]);
    setStage('active_roleplay');
    setSessionFeedback(null);

    // Speak initial message if audio enabled
    if (isAudioEnabled) {
      BusinessEnglishService.speak(scenario.initialMessage);
    }
  };

  // Send User Message
  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isAiResponding) return;

    BusinessEnglishService.stopSpeaking();

    const userMessage: RolePlayMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsAiResponding(true);

    // Generate Partner AI Reply after conversational delay
    setTimeout(() => {
      const { replyText, coachingFeedback } = BusinessEnglishService.generatePartnerReply(
        selectedScenario,
        updatedMessages,
        text
      );

      const partnerMessage: RolePlayMessage = {
        id: `msg-partner-${Date.now()}`,
        sender: 'partner',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        audioAvailable: true,
        coachingFeedback
      };

      setMessages(prev => [...prev, partnerMessage]);
      setIsAiResponding(false);

      if (isAudioEnabled) {
        BusinessEnglishService.speak(replyText);
      }
    }, 900);
  };

  // Start voice capture after microphone permission is verified
  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        setIsRecording(true);

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(prev => prev ? `${prev} ${transcript}` : transcript);
          setIsRecording(false);
        };

        recognition.onerror = () => {
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition error:', err);
      }
    }

    // Fallback simulation when microphone is granted or simulated
    setIsRecording(true);
    setTimeout(() => {
      const suggested = selectedScenario.suggestedPhrases[0] || "I recommend we prioritize this in Phase 1.";
      setInputText(suggested);
      setIsRecording(false);
    }, 2000);
  };

  // Contextual Microphone Trigger: Feature Intent -> Mic Pre-flight -> Browser Permission -> Mic Ready -> Session Started
  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      AudioPermissionService.releaseStream();
      return;
    }

    const { canStartImmediately } = await AudioPermissionService.initiateFeatureIntent('business_english');
    if (canStartImmediately) {
      startVoiceRecording();
    } else {
      setIsAudioGateOpen(true);
    }
  };

  // Complete and Evaluate Session
  const handleFinishSession = () => {
    BusinessEnglishService.stopSpeaking();
    AudioPermissionService.releaseStream();
    const feedback = BusinessEnglishService.evaluateRolePlaySession(selectedScenario, messages);
    setSessionFeedback(feedback);
    setStage('session_report');

    if (onSaveToProfile) {
      onSaveToProfile(feedback);
    }
  };

  // Filtered scenario catalog
  const filteredScenarios = scenarios.filter(sc => {
    const matchesCategory = selectedCategory === 'All' || sc.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || sc.difficulty === selectedDifficulty;
    const matchesSearch = !searchQuery || 
      sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.partnerRole.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const categories = ['All', 'Meetings & Syncs', 'Project Management & Delivery', 'Conflict & Negotiation', 'Stakeholder Alignment', 'Technical Trade-offs', 'Presentations & Pitches', 'Feedback & Performance'];
  const difficulties = ['All', 'Foundational', 'Intermediate', 'Advanced', 'Executive'];

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* -----------------------------------------------------------------
          STAGE 1: SCENARIO SELECTION & PRACTICE CATALOG
          ----------------------------------------------------------------- */}
      {stage === 'select_scenario' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-sm border border-blue-800/40">
            <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none"></div>

            <div className="max-w-3xl space-y-3 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Interactive Role-Play Studio</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Master Real Workplace Conversations
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Step into realistic workplace conversations with interactive personas—managers, product partners, engineers, and executives. Practice disagreeing diplomatically, articulating technical trade-offs, and leading executive updates with native pronunciation feedback.
              </p>

              {/* Quick Calibration Indicators */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>Interactive AI Partners</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4 text-blue-400" />
                  <span>Real-time Speech Synthesis (TTS)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-400" />
                  <span>Multi-Tier Executive Polish</span>
                </span>
              </div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Box */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search scenarios by role, situation, or keyword (e.g., trade-off, delay, onboarding)..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-sans"
                />
              </div>

              {/* Difficulty Dropdown */}
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-blue-600"
                >
                  {difficulties.map(d => (
                    <option key={d} value={d}>Level: {d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Scenario Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScenarios.map((sc) => (
              <div
                key={sc.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Top Metadata: Partner Badge & Level */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {sc.category}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sc.difficulty === 'Foundational' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      sc.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                      sc.difficulty === 'Advanced' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {sc.difficulty}
                    </span>
                  </div>

                  {/* Title & Situation */}
                  <div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {sc.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {sc.situation}
                    </p>
                  </div>

                  {/* Partner Persona Bar */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-tr ${sc.partnerAvatarColor} flex items-center justify-center text-white text-xs font-bold shadow-2xs shrink-0`}>
                      {sc.partnerName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate">
                        {sc.partnerName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {sc.partnerTitle} ({sc.partnerRole})
                      </div>
                    </div>
                  </div>

                  {/* Learning Objectives Preview */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Key Objective:
                    </div>
                    <p className="text-xs text-slate-700 italic">
                      "{sc.learningObjectives[0]}"
                    </p>
                  </div>
                </div>

                {/* Launch Button */}
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Tone: {sc.expectedTone.split(',')[0]}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleStartScenario(sc)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer group-hover:translate-x-0.5"
                  >
                    <span>Start Practice</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* -----------------------------------------------------------------
          STAGE 2: ACTIVE ROLE-PLAY CONVERSATION STUDIO
          ----------------------------------------------------------------- */}
      {stage === 'active_roleplay' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col h-[750px] animate-in fade-in duration-150">
          
          {/* Top Session Header: Partner Persona & Controls */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${selectedScenario.partnerAvatarColor} flex items-center justify-center text-white text-sm font-black shadow-md`}>
                  {selectedScenario.partnerName.charAt(0)}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-black text-white">
                    {selectedScenario.partnerName}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                    {selectedScenario.partnerRole}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {selectedScenario.partnerTitle} • <span className="text-slate-300">{selectedScenario.title}</span>
                </p>
              </div>
            </div>

            {/* Top Right Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isAudioEnabled ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isAudioEnabled ? "Audio Speech Enabled" : "Audio Muted"}
              >
                {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                <span className="hidden sm:inline">{isAudioEnabled ? 'Voice On' : 'Voice Off'}</span>
              </button>

              <button
                type="button"
                onClick={handleFinishSession}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete & Review</span>
              </button>

              <button
                type="button"
                onClick={() => setStage('select_scenario')}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                title="Exit to Scenario Catalog"
              >
                Switch
              </button>
            </div>
          </div>

          {/* Context Banner */}
          <div className="px-6 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between text-xs text-blue-900 shrink-0">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="font-medium truncate">
                <strong>Context:</strong> {selectedScenario.businessContext}
              </span>
            </div>
            <span className="text-[11px] font-bold text-blue-700 shrink-0 pl-2">
              Target: {selectedScenario.seniority}
            </span>
          </div>

          {/* Dialogue Message Thread */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div className="flex items-center gap-2 px-1">
                  <span className="text-[11px] font-bold text-slate-500">
                    {msg.sender === 'user' ? 'You' : selectedScenario.partnerName}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {msg.timestamp}
                  </span>
                  {msg.sender === 'partner' && (
                    <button
                      type="button"
                      onClick={() => BusinessEnglishService.speak(msg.text)}
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                      title="Listen to partner speech"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-xs shadow-xs font-medium'
                      : 'bg-white text-slate-800 rounded-tl-xs border border-slate-200/90 shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>

                {/* Inline Coaching Pill from Lexi (if available on partner reply) */}
                {msg.coachingFeedback && (
                  <div className="max-w-xl mt-1.5 p-3 rounded-xl bg-indigo-50/90 border border-indigo-200/80 text-xs text-indigo-950 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold text-indigo-900 text-[11px] uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Lexi Coaching Feedback</span>
                    </div>
                    <p className="text-slate-700">
                      <strong>Strength:</strong> {msg.coachingFeedback.strength}
                    </p>
                    <p className="text-indigo-800">
                      <strong>Tip:</strong> {msg.coachingFeedback.suggestion}
                    </p>
                    {msg.coachingFeedback.betterPhrasing && (
                      <div className="pt-1 border-t border-indigo-200/60 flex items-start justify-between gap-2">
                        <div className="text-[11px] font-mono text-indigo-950">
                          <strong>Alternative Senior Phrasing:</strong> "{msg.coachingFeedback.betterPhrasing}"
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSavedPhrases(prev => [...prev, msg.coachingFeedback!.betterPhrasing!]);
                            if (onSaveVocabTerm) onSaveVocabTerm(msg.coachingFeedback!.betterPhrasing!);
                          }}
                          className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold underline shrink-0 cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isAiResponding && (
              <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200/80 w-fit">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]"></div>
                <span className="text-xs text-slate-500 font-medium ml-1">
                  {selectedScenario.partnerName} is considering response...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggested Phrase Chips */}
          <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-amber-500" />
              Suggested Starters:
            </span>
            {selectedScenario.suggestedPhrases.map((phrase, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setInputText(phrase)}
                className="text-xs px-3 py-1 rounded-full bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 font-medium transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
              >
                "{phrase}"
              </button>
            ))}
          </div>

          {/* User Input Dock */}
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-3 rounded-2xl transition-all cursor-pointer ${
                  isRecording 
                    ? 'bg-rose-600 text-white animate-pulse shadow-md' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
                title={isRecording ? "Recording speech... Click to stop" : "Speak using microphone"}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={isRecording ? "Listening to your speech..." : `Reply to ${selectedScenario.partnerName} (or click mic / choose suggested starter)...`}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 focus:bg-white transition-colors"
                disabled={isAiResponding}
              />

              <button
                type="submit"
                disabled={!inputText.trim() || isAiResponding}
                className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>
      )}

      {/* -----------------------------------------------------------------
          STAGE 3: COMPREHENSIVE POST-SESSION FEEDBACK & CALIBRATION
          ----------------------------------------------------------------- */}
      {stage === 'session_report' && sessionFeedback && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Top Scorecard Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800/40 shadow-sm relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  <span>Workplace Communication Calibration</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Session Completed: {selectedScenario.title}
                </h2>
                <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                  {sessionFeedback.coachSummary}
                </p>
              </div>

              {/* Overall Score Circle */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/10 flex flex-col items-center justify-center shrink-0 min-w-[140px]">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-emerald-400">
                  {sessionFeedback.overallScore}
                </span>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider mt-1">
                  Overall Index / 100
                </span>
              </div>
            </div>
          </div>

          {/* 8-Dimensional Metric Evaluation Grid */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Multi-Dimensional Competency Breakdown</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'English Accuracy', val: sessionFeedback.metrics.englishAccuracy, desc: 'Grammar & precision' },
                { label: 'Naturalness', val: sessionFeedback.metrics.naturalness, desc: 'Idiomatic fluency' },
                { label: 'Business Vocabulary', val: sessionFeedback.metrics.businessVocabulary, desc: 'High-signal terms' },
                { label: 'Clarity & Conciseness', val: sessionFeedback.metrics.clarityConciseness, desc: 'Signal-to-noise ratio' },
                { label: 'Professional Tone', val: sessionFeedback.metrics.professionalTone, desc: 'Politeness & diplomacy' },
                { label: 'Executive Confidence', val: sessionFeedback.metrics.confidenceAssertiveness, desc: 'Firmness & ownership' },
                { label: 'Effectiveness', val: sessionFeedback.metrics.communicationEffectiveness, desc: 'Reaching decision outcome' },
                { label: 'Domain Terminology', val: sessionFeedback.metrics.domainTerminology, desc: 'Functional context mastery' },
              ].map((m, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{m.label}</span>
                    <span className="font-black text-blue-600">{m.val}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${m.val}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* In-Context Side-by-Side Phrasing Alternatives */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Side-by-Side Phrasing Upgrades (What You Said vs Executive Framing)</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">Context-Aware Calibration</span>
            </div>

            <div className="space-y-4">
              {sessionFeedback.inContextAlternatives.map((alt, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  {/* Left: What You Said */}
                  <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      What you said:
                    </div>
                    <p className="text-sm text-slate-700 italic">
                      "{alt.original}"
                    </p>
                  </div>

                  {/* Right: Senior Phrasing */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {alt.toneCategory} Phrasing
                      </span>
                      <button
                        type="button"
                        onClick={() => BusinessEnglishService.speak(alt.improved)}
                        className="text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                        title="Listen to audio"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-slate-900">
                      "{alt.improved}"
                    </p>
                    <p className="text-xs text-slate-500 pt-1">
                      <strong>Why this works:</strong> {alt.why}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-white rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => handleStartScenario(selectedScenario)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry This Scenario</span>
            </button>

            <button
              type="button"
              onClick={() => setStage('select_scenario')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>Explore More Scenarios</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* Contextual Microphone Permission Gate — Only shown when user initiates voice speaking */}
      <AudioPermissionGate
        isOpen={isAudioGateOpen}
        feature="business_english"
        subFeatureLabel="Role-Play Speaking Mode"
        onClose={() => setIsAudioGateOpen(false)}
        onMicrophoneReady={() => {
          setIsAudioGateOpen(false);
          startVoiceRecording();
        }}
        onContinueWithoutMicrophone={() => {
          setIsAudioGateOpen(false);
          const suggested = selectedScenario.suggestedPhrases[0] || "I recommend we prioritize this in Phase 1.";
          if (!inputText.trim()) {
            setInputText(suggested);
          }
        }}
      />

    </div>
  );
};
