import React, { useState, useMemo } from 'react';
import { 
  NormalizedSource, 
  SourceFamily, 
  EvidenceStrengthLevel, 
  SmartImportResult,
  SuggestedRelationship
} from '../../features/sources/types';
import { SmartImportParser } from '../../features/sources/services/smartImportParser';
import { 
  SOURCE_TAXONOMY, 
  getFamilyConfig, 
  getTypeConfig, 
  getEvidenceStrengthDefinition 
} from '../../features/sources/taxonomy';
import { CanonicalSkillRegistry } from '../../features/intelligence/services/canonicalSkillRegistry';
import { ROLES_DATA } from '../../data/rolesData';
import { JOBS_DATA } from '../../data/jobsData';
import { sourceStore } from '../../features/sources/services/sourceStore';
import { 
  X, 
  Sparkles, 
  Check, 
  CheckCircle, 
  Link, 
  FileText, 
  Upload, 
  ShieldCheck, 
  RefreshCw, 
  BookOpen, 
  Award, 
  Layers, 
  FolderGit2, 
  Layout, 
  Briefcase, 
  Edit3, 
  Trash2, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  Globe, 
  AlertCircle, 
  ExternalLink,
  ChevronDown,
  CornerDownRight,
  Database,
  Search,
  Sliders
} from 'lucide-react';

export type InputMethod = 'url' | 'file' | 'text' | 'manual' | 'entity';

interface UniversalSourceIngestionModalProps {
  onClose: () => void;
  onSaveSource: (source: NormalizedSource) => void;
  initialMethod?: InputMethod;
  initialFamily?: SourceFamily;
}

interface EditableReviewItem {
  id: string;
  value: string;
  canonicalId?: string;
  origin: 'ai_suggested' | 'user_confirmed';
  status: 'pending' | 'accepted' | 'rejected';
  category?: string;
}

export const UniversalSourceIngestionModal: React.FC<UniversalSourceIngestionModalProps> = ({
  onClose,
  onSaveSource,
  initialMethod = 'text',
  initialFamily = 'learn'
}) => {
  // Step 1: Input, Step 2: Processing, Step 3: Review
  const [step, setStep] = useState<'input' | 'processing' | 'review'>('input');
  const [inputMethod, setInputMethod] = useState<InputMethod>(initialMethod);

  // Input states
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [fileNameInput, setFileNameInput] = useState('');
  const [fileSizeInput, setFileSizeInput] = useState('');
  const [fileSnippet, setFileSnippet] = useState('');
  
  // Manual form inputs
  const [manualFamily, setManualFamily] = useState<SourceFamily>(initialFamily);
  const [manualType, setManualType] = useState<string>('course');
  const [manualTitle, setManualTitle] = useState('');
  const [manualProvider, setManualProvider] = useState('');
  const [manualAuthor, setManualAuthor] = useState('');
  const [manualUrl, setManualUrl] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  // Entity search & selection inputs
  const [entityFilterTab, setEntityFilterTab] = useState<'project' | 'role' | 'job'>('project');
  const [entitySearchQuery, setEntitySearchQuery] = useState('');

  // Processing state
  const [processingStage, setProcessingStage] = useState(0);

  // Review State Fields
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewFamily, setReviewFamily] = useState<SourceFamily>('learn');
  const [reviewType, setReviewType] = useState<string>('course');
  const [reviewProvider, setReviewProvider] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewUrl, setReviewUrl] = useState('');
  const [reviewDescription, setReviewDescription] = useState('');
  const [reviewLanguages, setReviewLanguages] = useState<string[]>(['en']);
  const [reviewStrength, setReviewStrength] = useState<EvidenceStrengthLevel>(2);
  const [reviewReasoning, setReviewReasoning] = useState('');
  const [reviewApplication, setReviewApplication] = useState<{
    hasApplication: boolean;
    appliedToTarget?: string;
    description?: string;
  } | undefined>(undefined);

  // Granular Review Collections (with AI Suggested vs User Confirmed tracking)
  const [reviewKnowledge, setReviewKnowledge] = useState<EditableReviewItem[]>([]);
  const [reviewSkills, setReviewSkills] = useState<EditableReviewItem[]>([]);
  const [reviewDomains, setReviewDomains] = useState<EditableReviewItem[]>([]);
  const [reviewMethods, setReviewMethods] = useState<EditableReviewItem[]>([]);
  const [reviewFrameworks, setReviewFrameworks] = useState<EditableReviewItem[]>([]);
  const [reviewEvidence, setReviewEvidence] = useState<EditableReviewItem[]>([]);
  const [reviewRelationships, setReviewRelationships] = useState<SuggestedRelationship[]>([]);

  // Inline edit state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingItemValue, setEditingItemValue] = useState('');

  // New item inputs
  const [newConceptInput, setNewConceptInput] = useState('');
  const [newSkillInput, setNewSkillInput] = useState('');
  const [newDomainInput, setNewDomainInput] = useState('');
  const [newMethodInput, setNewMethodInput] = useState('');

  // Sample prompt buttons
  const samplePrompts = [
    {
      label: 'Vietnamese Course + Project Application',
      badge: 'User Example',
      text: 'Em học khóa này để hiểu thêm về product analytics và sau đó apply vào dashboard project.'
    },
    {
      label: 'Vietnamese Grab Case Study',
      badge: 'Assessment Case',
      text: 'Em làm product case cho vị trí Senior Product Ops của Grab về tối ưu SLA xác minh tài xế và giảm tỉ lệ churn tại Đông Nam Á.'
    },
    {
      label: 'Reforge Growth & Retention Strategy',
      badge: 'Cohort Learning',
      text: 'Khoá học Reforge Product Strategy này giúp mình hiểu khá sâu về retention loops, growth models và painted-door experiments.'
    },
    {
      label: 'Zero-Downtime Distributed Migration',
      badge: 'Work Project',
      text: 'Architected and shipped a zero-downtime dual-run migration of 12M customer records using Kafka Debezium CDC on AWS.'
    }
  ];

  // Pipeline execution
  const executeAnalysis = (result: SmartImportResult) => {
    setStep('processing');
    setProcessingStage(1);

    const interval = setInterval(() => {
      setProcessingStage(prev => {
        if (prev >= 6) {
          clearInterval(interval);
          populateReview(result);
          setStep('review');
          return 6;
        }
        return prev + 1;
      });
    }, 110);
  };

  const populateReview = (res: SmartImportResult) => {
    setReviewTitle(res.title);
    setReviewFamily(res.inferredFamily);
    setReviewType(res.inferredType);
    setReviewProvider(res.provider || '');
    setReviewAuthor(res.author || '');
    setReviewUrl(res.url || '');
    setReviewDescription(res.description || '');
    setReviewLanguages(res.detectedLanguages && res.detectedLanguages.length > 0 ? res.detectedLanguages : [res.detectedLanguage || 'en']);
    setReviewStrength(res.evidenceStrength);
    setReviewReasoning(res.reasoning);
    setReviewApplication(res.detectedApplication);

    // Populate review items
    if (res.reviewItems) {
      setReviewKnowledge(res.reviewItems.knowledge);
      setReviewSkills(res.reviewItems.skills);
      setReviewDomains(res.reviewItems.domains);
      setReviewMethods(res.reviewItems.methods);
      setReviewFrameworks(res.reviewItems.frameworks);
      setReviewEvidence(res.reviewItems.evidence);
      setReviewRelationships(res.reviewItems.relationships);
    } else {
      setReviewKnowledge(res.inferredKnowledge.map((k, i) => ({
        id: `k-${i}`,
        value: k,
        origin: 'ai_suggested',
        status: 'pending'
      })));
      setReviewSkills(res.inferredSkills.map((s, i) => ({
        id: `s-${i}`,
        value: s,
        origin: 'ai_suggested',
        status: 'pending'
      })));
      setReviewDomains(res.domains.map((d, i) => ({
        id: `d-${i}`,
        value: d,
        origin: 'ai_suggested',
        status: 'pending'
      })));
      setReviewMethods(res.methods.map((m, i) => ({
        id: `m-${i}`,
        value: m,
        origin: 'ai_suggested',
        status: 'pending'
      })));
      setReviewFrameworks(res.frameworks.map((f, i) => ({
        id: `f-${i}`,
        value: f,
        origin: 'ai_suggested',
        status: 'pending'
      })));
      setReviewEvidence((res.evidenceStatements || []).map((e, i) => ({
        id: `e-${i}`,
        value: e,
        origin: 'ai_suggested',
        status: 'pending'
      })));
      setReviewRelationships(res.suggestedRelationships || []);
    }
  };

  // Handlers for Input Submission
  const handleAnalyzeText = () => {
    if (!textInput.trim()) return;
    const res = SmartImportParser.parseText(textInput);
    executeAnalysis(res);
  };

  const handleAnalyzeUrl = () => {
    if (!urlInput.trim()) return;
    const res = SmartImportParser.parseUrl(urlInput);
    executeAnalysis(res);
  };

  const handleAnalyzeFile = () => {
    if (!fileNameInput) return;
    const res = SmartImportParser.parseFile(fileNameInput, fileSizeInput, fileSnippet);
    executeAnalysis(res);
  };

  const handleAnalyzeManual = () => {
    if (!manualTitle.trim()) return;
    const promptText = `${manualTitle}. ${manualDescription} ${manualProvider} ${manualUrl}`;
    const res = SmartImportParser.parseText(promptText);
    // Merge user explicit inputs
    res.inferredFamily = manualFamily;
    res.inferredType = manualType;
    res.title = manualTitle;
    res.provider = manualProvider || res.provider;
    res.author = manualAuthor || res.author;
    res.url = manualUrl || res.url;
    res.description = manualDescription || res.description;
    executeAnalysis(res);
  };

  const handleSelectEntity = (entity: {
    type: 'project' | 'artifact' | 'role' | 'job';
    id: string;
    title: string;
    data: any;
  }) => {
    const res = SmartImportParser.parseEntity(entity);
    executeAnalysis(res);
  };

  // Drag and drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setFileNameInput(file.name);
      setFileSizeInput(`${(file.size / 1024).toFixed(1)} KB`);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) setFileSnippet(text.slice(0, 500));
      };
      if (file.type.includes('text') || file.name.endsWith('.md') || file.name.endsWith('.json') || file.name.endsWith('.txt')) {
        reader.readAsText(file);
      }
    }
  };

  // Review Item Actions: Accept, Edit, Reject
  const toggleItemAccept = (
    list: EditableReviewItem[],
    setList: React.Dispatch<React.SetStateAction<EditableReviewItem[]>>,
    id: string
  ) => {
    setList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'accepted' ? 'pending' : 'accepted';
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const rejectItem = (
    list: EditableReviewItem[],
    setList: React.Dispatch<React.SetStateAction<EditableReviewItem[]>>,
    id: string
  ) => {
    setList(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: 'rejected' };
      }
      return item;
    }));
  };

  const saveEditItem = (
    list: EditableReviewItem[],
    setList: React.Dispatch<React.SetStateAction<EditableReviewItem[]>>
  ) => {
    if (!editingItemId || !editingItemValue.trim()) return;
    setList(prev => prev.map(item => {
      if (item.id === editingItemId) {
        return { 
          ...item, 
          value: editingItemValue.trim(), 
          origin: 'user_confirmed', 
          status: 'accepted' 
        };
      }
      return item;
    }));
    setEditingItemId(null);
    setEditingItemValue('');
  };

  const addCustomItem = (
    setList: React.Dispatch<React.SetStateAction<EditableReviewItem[]>>,
    value: string,
    clearFn: () => void,
    isSkill = false
  ) => {
    if (!value.trim()) return;
    const finalValue = isSkill ? CanonicalSkillRegistry.resolve(value.trim()).canonicalName : value.trim();
    setList(prev => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        value: finalValue,
        origin: 'user_confirmed',
        status: 'accepted'
      }
    ]);
    clearFn();
  };

  // Accept All AI Suggestions
  const handleAcceptAllAISuggestions = () => {
    const acceptAll = (items: EditableReviewItem[]) => items.map(item => 
      item.status === 'rejected' ? item : { ...item, status: 'accepted' as const }
    );
    setReviewKnowledge(acceptAll);
    setReviewSkills(acceptAll);
    setReviewDomains(acceptAll);
    setReviewMethods(acceptAll);
    setReviewFrameworks(acceptAll);
    setReviewEvidence(acceptAll);
    setReviewRelationships(prev => prev.map(r => r.status === 'rejected' ? r : { ...r, status: 'accepted' as const }));
  };

  // Final Ingestion Save
  const handleSaveToCareerOS = () => {
    // Separate confirmed vs inferred strictly
    const confirmedKnowledge = reviewKnowledge
      .filter(k => (k.status === 'accepted' || k.origin === 'user_confirmed') && k.status !== 'rejected')
      .map(k => k.value);
    
    const inferredKnowledge = reviewKnowledge
      .filter(k => k.origin === 'ai_suggested' && k.status === 'pending')
      .map(k => k.value);

    const confirmedSkills = reviewSkills
      .filter(s => (s.status === 'accepted' || s.origin === 'user_confirmed') && s.status !== 'rejected')
      .map(s => s.value);

    const inferredSkills = reviewSkills
      .filter(s => s.origin === 'ai_suggested' && s.status === 'pending')
      .map(s => s.value);

    const activeDomains = reviewDomains
      .filter(d => d.status !== 'rejected')
      .map(d => d.value);

    const activeMethods = reviewMethods
      .filter(m => m.status !== 'rejected')
      .map(m => m.value);

    const activeFrameworks = reviewFrameworks
      .filter(f => f.status !== 'rejected')
      .map(f => f.value);

    const activeEvidence = reviewEvidence
      .filter(e => e.status !== 'rejected')
      .map(e => e.value);

    const acceptedRelationships = reviewRelationships.filter(r => r.status === 'accepted');

    const newSource: NormalizedSource = {
      id: `src-universal-${Date.now()}`,
      title: reviewTitle || 'Untitled Source',
      sourceFamily: reviewFamily,
      sourceType: reviewType,
      description: reviewDescription,
      provider: reviewProvider || undefined,
      author: reviewAuthor || undefined,
      url: reviewUrl || undefined,
      status: reviewFamily === 'assessment' ? 'passed' : reviewFamily === 'credential' ? 'earned' : 'completed',
      language: reviewLanguages[0] || 'en',
      languages: reviewLanguages,
      evidenceStrength: reviewStrength,
      tags: [
        reviewFamily, 
        reviewType, 
        ...activeDomains.map(d => d.toLowerCase().replace(/[^a-z0-9]/g, ''))
      ],
      inferredKnowledge,
      confirmedKnowledge,
      inferredSkills,
      confirmedSkills,
      competencies: [],
      domains: activeDomains.length > 0 ? activeDomains : ['Enterprise SaaS'],
      methods: activeMethods,
      frameworks: activeFrameworks,
      evidenceStatements: activeEvidence.length > 0 ? activeEvidence : [
        `Verified source record: ${reviewTitle} (Evidence Level ${reviewStrength}).`
      ],
      careerRelevance: acceptedRelationships.map(r => r.title),
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metadata: {
        reasoning: reviewReasoning,
        detectedApplication: reviewApplication,
        linkedRelationships: acceptedRelationships
      }
    };

    onSaveSource(newSource);
    onClose();
  };

  // Metrics for Review Banner
  const totalAISuggestions = useMemo(() => {
    const all = [
      ...reviewKnowledge, 
      ...reviewSkills, 
      ...reviewDomains, 
      ...reviewMethods, 
      ...reviewFrameworks, 
      ...reviewEvidence
    ];
    return all.filter(i => i.origin === 'ai_suggested' && i.status !== 'rejected').length;
  }, [reviewKnowledge, reviewSkills, reviewDomains, reviewMethods, reviewFrameworks, reviewEvidence]);

  const totalConfirmed = useMemo(() => {
    const all = [
      ...reviewKnowledge, 
      ...reviewSkills, 
      ...reviewDomains, 
      ...reviewMethods, 
      ...reviewFrameworks, 
      ...reviewEvidence
    ];
    return all.filter(i => (i.status === 'accepted' || i.origin === 'user_confirmed') && i.status !== 'rejected').length;
  }, [reviewKnowledge, reviewSkills, reviewDomains, reviewMethods, reviewFrameworks, reviewEvidence]);

  // Entities for Tab 5
  const careerOSEntities = useMemo(() => {
    const projects = sourceStore.getSources().filter(s => s.sourceFamily === 'project' || s.sourceFamily === 'artifact');
    return {
      projects,
      roles: ROLES_DATA,
      jobs: JOBS_DATA
    };
  }, []);

  const strengthDef = getEvidenceStrengthDefinition(reviewStrength);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Universal Source Ingestion & Evidence Graph
              </span>
              {step === 'review' && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Sliders className="w-3 h-3" />
                  Step 12: Human-in-the-Loop Review
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {step === 'input' && 'Add Source to Career Evidence Ledger'}
              {step === 'processing' && 'Extracting Concepts & Calibrating Evidence...'}
              {step === 'review' && 'Review & Confirm Ingested Intelligence'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: INPUT METHOD SELECTOR & FORMS */}
        {step === 'input' && (
          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Input Method Navigation Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => setInputMethod('text')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMethod === 'text' 
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Paste Text</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMethod('url')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMethod === 'url' 
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Link className="w-3.5 h-3.5 text-indigo-600" />
                <span>Paste URL</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMethod('file')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMethod === 'file' 
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-purple-600" />
                <span>Upload File</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMethod('manual')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMethod === 'manual' 
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Manual Entry</span>
              </button>

              <button
                type="button"
                onClick={() => setInputMethod('entity')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  inputMethod === 'entity' 
                    ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-amber-600" />
                <span>Career OS Entity</span>
              </button>
            </div>

            {/* TAB 1: PASTE TEXT */}
            {inputMethod === 'text' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Unstructured Notes, Reflections, or Course Context
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Multilingual supported (VN, EN, JA)
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="E.g. Em học khóa này để hiểu thêm về product analytics và sau đó apply vào dashboard project..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm text-slate-900 placeholder-slate-400 outline-hidden transition-all resize-none font-sans"
                  />
                </div>

                {/* Sample Prompt Shortcuts */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Quick Sample Inputs (Click to test):
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {samplePrompts.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setTextInput(p.text)}
                        className="p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 bg-slate-50 hover:bg-indigo-50/40 text-left transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900">
                            {p.label}
                          </span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                            {p.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 font-mono">
                          {p.text}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!textInput.trim()}
                    onClick={handleAnalyzeText}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Run Deep Semantic Extraction</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: PASTE URL */}
            {inputMethod === 'url' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Source URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://coursera.org/learn/product-analytics or https://github.com/..."
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-sm text-slate-900 placeholder-slate-400 outline-hidden transition-all pl-10"
                    />
                    <Link className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                {/* Preset URL shortcuts */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Example Provider Links:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'Coursera Product Analytics', url: 'https://www.coursera.org/learn/product-analytics' },
                      { label: 'Reforge Strategy Cohort', url: 'https://www.reforge.com/product-strategy' },
                      { label: 'Credly AWS Architect Badge', url: 'https://www.credly.com/badges/aws-certified-solutions-architect' },
                      { label: 'GitHub Distributed Repo', url: 'https://github.com/facebook/react' }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setUrlInput(preset.url)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 cursor-pointer transition-colors"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!urlInput.trim()}
                    onClick={handleAnalyzeUrl}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Analyze URL & Ingest</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: UPLOAD FILE */}
            {inputMethod === 'file' && (
              <div className="space-y-4">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer"
                  onClick={() => {
                    const el = document.getElementById('file-upload-input');
                    if (el) el.click();
                  }}
                >
                  <input
                    id="file-upload-input"
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        setFileNameInput(file.name);
                        setFileSizeInput(`${(file.size / 1024).toFixed(1)} KB`);
                      }
                    }}
                  />
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-bold text-slate-900 block">
                    {fileNameInput ? `Selected: ${fileNameInput}` : 'Drag & drop artifact or click to browse'}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports Markdown (.md), PDF PRDs, Case Study Reports, Certificate Badges, JSON specs
                  </p>
                </div>

                {/* Preset Mock Artifacts */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Or select pre-staged sample artifact:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { name: 'PRD-Telemetry-Dashboard.md', size: '34 KB' },
                      { name: 'Grab-ProductOps-Takehome-Case.pdf', size: '1.2 MB' },
                      { name: 'AWS-Solutions-Architect-Cert.pdf', size: '420 KB' }
                    ].map((art, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setFileNameInput(art.name);
                          setFileSizeInput(art.size);
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                          fileNameInput === art.name 
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-900' 
                            : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-xs font-bold block truncate">{art.name}</span>
                        <span className="text-[10px] text-slate-500">{art.size}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={!fileNameInput}
                    onClick={handleAnalyzeFile}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Artifact Metadata</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: MANUAL ENTRY */}
            {inputMethod === 'manual' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Source Family
                    </label>
                    <select
                      value={manualFamily}
                      onChange={(e) => {
                        const fam = e.target.value as SourceFamily;
                        setManualFamily(fam);
                        const famCfg = getFamilyConfig(fam);
                        if (famCfg && famCfg.types.length > 0) {
                          setManualType(famCfg.types[0].id);
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    >
                      {SOURCE_TAXONOMY.map(f => (
                        <option key={f.id} value={f.id}>{f.label} ({f.id})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Source Type
                    </label>
                    <select
                      value={manualType}
                      onChange={(e) => setManualType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                    >
                      {getFamilyConfig(manualFamily)?.types.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Source Title *
                  </label>
                  <input
                    type="text"
                    value={manualTitle}
                    onChange={(e) => setManualTitle(e.target.value)}
                    placeholder="e.g. Advanced Product Strategy Cohort or Real-time Telemetry Dashboard"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      Provider / Organization
                    </label>
                    <input
                      type="text"
                      value={manualProvider}
                      onChange={(e) => setManualProvider(e.target.value)}
                      placeholder="e.g. Reforge, Coursera, Grab, Stripe"
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                      URL / Link
                    </label>
                    <input
                      type="url"
                      value={manualUrl}
                      onChange={(e) => setManualUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                    Description / Context
                  </label>
                  <textarea
                    rows={3}
                    value={manualDescription}
                    onChange={(e) => setManualDescription(e.target.value)}
                    placeholder="Describe what was learned, demonstrated, or delivered..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 italic">
                    AI Auto-Assistant will extract knowledge concepts and canonical skills
                  </span>
                  <button
                    type="button"
                    disabled={!manualTitle.trim()}
                    onClick={handleAnalyzeManual}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Proceed to Smart Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 5: SELECT CAREER OS ENTITY */}
            {inputMethod === 'entity' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setEntityFilterTab('project')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        entityFilterTab === 'project' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Projects & Artifacts ({careerOSEntities.projects.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntityFilterTab('role')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        entityFilterTab === 'role' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Role Blueprints ({careerOSEntities.roles.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setEntityFilterTab('job')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        entityFilterTab === 'job' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
                      }`}
                    >
                      Market Jobs ({careerOSEntities.jobs.length})
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={entitySearchQuery}
                      onChange={(e) => setEntitySearchQuery(e.target.value)}
                      placeholder="Filter entities..."
                      className="px-3 py-1.5 pl-8 rounded-xl border border-slate-200 text-xs text-slate-800"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                {/* Entity List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
                  {entityFilterTab === 'project' && careerOSEntities.projects
                    .filter(p => !entitySearchQuery || p.title.toLowerCase().includes(entitySearchQuery.toLowerCase()))
                    .map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectEntity({
                          type: p.sourceFamily === 'artifact' ? 'artifact' : 'project',
                          id: p.id,
                          title: p.title,
                          data: p
                        })}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 text-left transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                              {p.sourceFamily.toUpperCase()} • Level {p.evidenceStrength}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {p.confirmedSkills.length} skills
                            </span>
                          </div>
                          <span className="text-xs font-black text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                            {p.title}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {p.description}
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                          <span>Ingest & Create Verified Source</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </button>
                    ))}

                  {entityFilterTab === 'role' && careerOSEntities.roles
                    .filter(r => !entitySearchQuery || r.title.toLowerCase().includes(entitySearchQuery.toLowerCase()))
                    .map(r => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleSelectEntity({
                          type: 'role',
                          id: r.id,
                          title: r.title,
                          data: r
                        })}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 text-left transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-800">
                              ROLE BLUEPRINT • {r.level}
                            </span>
                            <span className="text-[10px] text-slate-400">{r.category}</span>
                          </div>
                          <span className="text-xs font-black text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                            {r.title}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {r.tagline}
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                          <span>Derive Evidence Profile</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </button>
                    ))}

                  {entityFilterTab === 'job' && careerOSEntities.jobs
                    .filter(j => !entitySearchQuery || j.title.toLowerCase().includes(entitySearchQuery.toLowerCase()) || j.company.toLowerCase().includes(entitySearchQuery.toLowerCase()))
                    .map(j => (
                      <button
                        key={j.id}
                        type="button"
                        onClick={() => handleSelectEntity({
                          type: 'job',
                          id: j.id,
                          title: j.title,
                          data: j
                        })}
                        className="p-3 rounded-2xl border border-slate-200 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/30 text-left transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                              {j.company} • {j.domain}
                            </span>
                            <span className="text-[10px] text-slate-400">{j.location}</span>
                          </div>
                          <span className="text-xs font-black text-slate-900 group-hover:text-indigo-900 line-clamp-1">
                            {j.title}
                          </span>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            Requires: {j.requiredSkills.slice(0, 3).join(', ')}
                          </p>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-indigo-600">
                          <span>Ingest as Assessment Target</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: PROCESSING ANIMATION / PIPELINE STAGES */}
        {step === 'processing' && (
          <div className="p-10 flex flex-col items-center justify-center space-y-6 flex-1">
            <div className="relative">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin absolute -top-1 -right-1" />
            </div>

            <div className="text-center space-y-1.5 max-w-md">
              <h3 className="text-base font-black text-slate-900">
                Running 12-Factor Career Intelligence Extraction
              </h3>
              <p className="text-xs text-slate-500">
                Resolving multilingual semantics, canonical skill registries, and non-inflated evidence strengths...
              </p>
            </div>

            {/* Pipeline progress steps */}
            <div className="w-full max-w-md space-y-2">
              {[
                '1. Detecting source family & specific taxonomy type',
                '2. Parsing multilingual code-switching & metadata',
                '3. Extracting knowledge concepts & actionable skills',
                '4. Identifying application cues (projects & artifacts)',
                '5. Matching against existing Career OS Projects, Roles & Jobs',
                '6. Calibrating non-inflated provisional evidence strength'
              ].map((st, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs">
                  {processingStage > i ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 shrink-0" />
                  )}
                  <span className={processingStage > i ? 'font-bold text-slate-900' : 'text-slate-400'}>
                    {st}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: STEP 12 - THE MASTER REVIEW STEP (Strict AI Suggested vs User Confirmed) */}
        {step === 'review' && (
          <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
            
            {/* Top Review Banner with Strict Distinction Notice */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  <span className="text-xs font-black text-indigo-950 uppercase tracking-wider">
                    Human-in-the-Loop Review
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                    {totalAISuggestions} AI Suggested
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {totalConfirmed} User Confirmed
                  </span>
                </div>
                <p className="text-xs text-indigo-900 font-medium">
                  AI suggestions are provisional. Accept, edit, or reject items before committing to your verified ledger.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAcceptAllAISuggestions}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs hover:shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Accept All Suggestions</span>
                </button>
              </div>
            </div>

            {/* 1. Core Source Metadata & Taxonomy */}
            <div className="p-4 rounded-2xl border border-slate-200 space-y-3 bg-slate-50/40">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
                <span className="text-xs font-black text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Source Metadata & Classification
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500">Language:</span>
                  {reviewLanguages.map(l => (
                    <span key={l} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-800 uppercase">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                    Source Title
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      Family
                    </label>
                    <select
                      value={reviewFamily}
                      onChange={(e) => {
                        const f = e.target.value as SourceFamily;
                        setReviewFamily(f);
                        const cfg = getFamilyConfig(f);
                        if (cfg && cfg.types.length > 0) setReviewType(cfg.types[0].id);
                      }}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      {SOURCE_TAXONOMY.map(f => (
                        <option key={f.id} value={f.id}>{f.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      Type
                    </label>
                    <select
                      value={reviewType}
                      onChange={(e) => setReviewType(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white"
                    >
                      {getFamilyConfig(reviewFamily)?.types.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-500 block mb-1">
                      Provider / Organization
                    </label>
                    <input
                      type="text"
                      value={reviewProvider}
                      onChange={(e) => setReviewProvider(e.target.value)}
                      placeholder="e.g. Coursera, Internal"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Detected Application Context (Highlights the User Example!) */}
            {reviewApplication && reviewApplication.hasApplication && (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CornerDownRight className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-black uppercase text-amber-900 tracking-wider">
                      Detected Practical Application
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900">
                    Learned → Applied
                  </span>
                </div>
                <div className="text-xs text-amber-950 font-medium">
                  <strong>Target:</strong> {reviewApplication.appliedToTarget}
                </div>
                <p className="text-[11px] text-amber-800">
                  {reviewApplication.description}
                </p>
              </div>
            )}

            {/* 3. Knowledge Concepts Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                  Knowledge Concepts
                </span>
                <span className="text-[11px] text-slate-400">
                  Principles, mental models, theories
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {reviewKnowledge.map(k => {
                  if (k.status === 'rejected') return null;
                  const isConfirmed = k.status === 'accepted' || k.origin === 'user_confirmed';
                  return (
                    <div
                      key={k.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isConfirmed 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                          : 'bg-purple-50/80 text-purple-900 border-purple-200'
                      }`}
                    >
                      <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                        isConfirmed ? 'bg-emerald-200 text-emerald-900' : 'bg-purple-200 text-purple-800'
                      }`}>
                        {isConfirmed ? '✓ Confirmed' : '✦ AI Suggestion'}
                      </span>
                      <span>{k.value}</span>
                      <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-300">
                        <button
                          type="button"
                          onClick={() => toggleItemAccept(reviewKnowledge, setReviewKnowledge, k.id)}
                          title={isConfirmed ? "Mark as AI Suggestion" : "Accept as Confirmed"}
                          className="p-1 hover:bg-white/80 rounded cursor-pointer text-slate-500 hover:text-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(k.id);
                            setEditingItemValue(k.value);
                          }}
                          className="p-1 hover:bg-white/80 rounded cursor-pointer text-slate-500 hover:text-blue-700"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectItem(reviewKnowledge, setReviewKnowledge, k.id)}
                          title="Reject / Dismiss"
                          className="p-1 hover:bg-white/80 rounded cursor-pointer text-slate-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Concept */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newConceptInput}
                  onChange={(e) => setNewConceptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomItem(setReviewKnowledge, newConceptInput, () => setNewConceptInput(''));
                    }
                  }}
                  placeholder="+ Add confirmed knowledge concept..."
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 max-w-xs focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addCustomItem(setReviewKnowledge, newConceptInput, () => setNewConceptInput(''))}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* 4. Actionable Skills Section (Canonical Normalization) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-indigo-600" />
                  Actionable Skills (Normalized via Canonical Registry)
                </span>
                <span className="text-[11px] text-slate-400">
                  Multilingual variants mapped to canonical tokens
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {reviewSkills.map(s => {
                  if (s.status === 'rejected') return null;
                  const isConfirmed = s.status === 'accepted' || s.origin === 'user_confirmed';
                  return (
                    <div
                      key={s.id}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        isConfirmed 
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                          : 'bg-purple-50/80 text-purple-900 border-purple-200'
                      }`}
                    >
                      <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                        isConfirmed ? 'bg-emerald-200 text-emerald-900' : 'bg-purple-200 text-purple-800'
                      }`}>
                        {isConfirmed ? '✓ Confirmed' : '✦ AI Suggestion'}
                      </span>
                      <span>{s.value}</span>
                      <div className="flex items-center gap-1 ml-1 pl-1 border-l border-slate-300">
                        <button
                          type="button"
                          onClick={() => toggleItemAccept(reviewSkills, setReviewSkills, s.id)}
                          title={isConfirmed ? "Mark as AI Suggestion" : "Accept as Confirmed"}
                          className="p-1 hover:bg-white/80 rounded cursor-pointer text-slate-500 hover:text-emerald-700"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItemId(s.id);
                            setEditingItemValue(s.value);
                          }}
                          className="p-1 hover:bg-white/80 rounded cursor-pointer text-slate-500 hover:text-blue-700"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectItem(reviewSkills, setReviewSkills, s.id)}
                          title="Reject / Dismiss"
                          className="p-1 hover:bg-white/80 rounded cursor-pointer text-slate-500 hover:text-red-700"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Skill */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomItem(setReviewSkills, newSkillInput, () => setNewSkillInput(''), true);
                    }
                  }}
                  placeholder="+ Add confirmed skill..."
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 max-w-xs focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => addCustomItem(setReviewSkills, newSkillInput, () => setNewSkillInput(''), true)}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* 5. Domains, Methods & Frameworks Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Domains */}
              <div className="p-3.5 rounded-2xl border border-slate-200 space-y-2 bg-slate-50/50">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                  Industry & Knowledge Domains
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {reviewDomains.map(d => {
                    if (d.status === 'rejected') return null;
                    const isConfirmed = d.status === 'accepted' || d.origin === 'user_confirmed';
                    return (
                      <span
                        key={d.id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                          isConfirmed ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        {d.value}
                        <button
                          type="button"
                          onClick={() => toggleItemAccept(reviewDomains, setReviewDomains, d.id)}
                          className="text-slate-400 hover:text-emerald-700 ml-0.5 cursor-pointer"
                        >
                          <Check className="w-2.5 h-2.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rejectItem(reviewDomains, setReviewDomains, d.id)}
                          className="text-slate-400 hover:text-red-700 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Methods & Frameworks */}
              <div className="p-3.5 rounded-2xl border border-slate-200 space-y-2 bg-slate-50/50">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 block">
                  Methods & Analytical Frameworks
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {[...reviewMethods, ...reviewFrameworks].map(item => {
                    if (item.status === 'rejected') return null;
                    return (
                      <span
                        key={item.id}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 flex items-center gap-1"
                      >
                        {item.value}
                        <button
                          type="button"
                          onClick={() => rejectItem(
                            reviewMethods.some(m => m.id === item.id) ? reviewMethods : reviewFrameworks,
                            reviewMethods.some(m => m.id === item.id) ? setReviewMethods : setReviewFrameworks,
                            item.id
                          )}
                          className="text-slate-400 hover:text-red-700 cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 6. Suggested Relationships to Existing Projects, Roles & Jobs */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  Suggested Career OS Relationships
                </span>
                <span className="text-[11px] text-slate-400">
                  Connects to existing Projects, Roles, and Jobs
                </span>
              </div>

              {reviewRelationships.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No direct entity relationship matches detected.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {reviewRelationships.map((rel, idx) => {
                    if (rel.status === 'rejected') return null;
                    const isAccepted = rel.status === 'accepted';
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-2 ${
                          isAccepted 
                            ? 'bg-emerald-50/70 border-emerald-200' 
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 uppercase font-mono">
                              {rel.entityType}
                            </span>
                            <span className="text-xs font-bold text-slate-900 line-clamp-1">
                              {rel.title}
                            </span>
                          </div>
                          {rel.subtitle && (
                            <span className="text-[11px] text-slate-500 block">
                              {rel.subtitle}
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 italic">
                            Match: {rel.matchReason}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setReviewRelationships(prev => prev.map((r, i) => i === idx ? {
                                ...r,
                                status: r.status === 'accepted' ? 'pending' : 'accepted'
                              } : r));
                            }}
                            className={`px-2.5 py-1 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                              isAccepted 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                            }`}
                          >
                            {isAccepted ? 'Linked' : 'Accept Link'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setReviewRelationships(prev => prev.map((r, i) => i === idx ? {
                                ...r,
                                status: 'rejected'
                              } : r));
                            }}
                            className="p-1 text-slate-400 hover:text-red-700 rounded cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 7. Provisional Evidence Strength & Non-Inflation Calibration */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <span className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    Provisional Evidence Strength (Non-Inflated Calibration)
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Assigned strictly based on evidence tiers. Advanced proficiency (L5/L6) requires production or validated assessments.
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                  {([0, 1, 2, 3, 4, 5, 6] as EvidenceStrengthLevel[]).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setReviewStrength(lvl)}
                      className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        reviewStrength === lvl 
                          ? 'bg-blue-600 text-white shadow-2xs' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      L{lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className={`px-2.5 py-1 rounded-xl text-xs font-black text-white shrink-0 ${
                  reviewStrength >= 5 ? 'bg-purple-600' : reviewStrength >= 3 ? 'bg-blue-600' : 'bg-slate-600'
                }`}>
                  Level {reviewStrength}: {strengthDef.name}
                </span>
                <div className="text-xs text-slate-600 space-y-0.5">
                  <p>{strengthDef.description}</p>
                  {reviewReasoning && (
                    <p className="text-[11px] text-slate-500 font-mono italic">
                      AI Reasoning: {reviewReasoning}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Inline Item Edit Modal / Drawer */}
            {editingItemId && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2">
                <span className="text-xs font-bold text-blue-900 shrink-0">Edit Item:</span>
                <input
                  type="text"
                  value={editingItemValue}
                  onChange={(e) => setEditingItemValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveEditItem(
                        reviewKnowledge.some(k => k.id === editingItemId) ? reviewKnowledge : reviewSkills,
                        reviewKnowledge.some(k => k.id === editingItemId) ? setReviewKnowledge : setReviewSkills
                      );
                    }
                  }}
                  className="flex-1 px-3 py-1.5 rounded-xl border border-blue-300 text-xs font-semibold text-slate-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() => saveEditItem(
                    reviewKnowledge.some(k => k.id === editingItemId) ? reviewKnowledge : reviewSkills,
                    reviewKnowledge.some(k => k.id === editingItemId) ? setReviewKnowledge : setReviewSkills
                  )}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  Save Confirmed
                </button>
                <button
                  type="button"
                  onClick={() => setEditingItemId(null)}
                  className="p-1 text-slate-500 hover:text-slate-800 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {step === 'review' ? (
            <button
              type="button"
              onClick={() => setStep('input')}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Edit Input</span>
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              Input parsed safely with no unconfirmed data retention.
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {step === 'review' && (
              <button
                type="button"
                onClick={handleSaveToCareerOS}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save Source to Career OS</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
