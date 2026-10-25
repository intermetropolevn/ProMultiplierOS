import React, { useState, useRef, useMemo } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  ExternalLink, 
  Sparkles, 
  Building2, 
  Briefcase, 
  Calendar, 
  Award, 
  Plus, 
  Wrench, 
  ShieldCheck, 
  Layers, 
  Tag, 
  Loader2,
  RefreshCw,
  Eye,
  FileCheck,
  Pencil,
  MapPin,
  Target,
  Info,
  Check,
  ChevronRight,
  TrendingUp,
  Download,
  FileSpreadsheet,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WorkExperienceService, WorkExperienceRecord } from '../../services/workExperienceService';
import {
  CsvImportProcessingStep,
  CSV_PROCESSING_STEPS,
  CsvImportBatchSummary,
  StagedWorkExperienceImportItem,
  SAMPLE_WORK_EXPERIENCE_CSV,
  downloadWorkExperienceCsvTemplate,
  processWorkExperienceCsvImport
} from '../../services/workExperienceCsvService';
import { SkillService, CanonicalSkill, SkillProvenance } from '../../services/skillService';
import { CareerIntelligenceService, CapabilityRecord } from '../../services/careerIntelligenceService';
import { careerGraphEventBus } from '../../services/careerGraphEventBus';
import { AddWorkExperienceModal } from './AddWorkExperienceModal';
import { WorkExperienceDetailModal } from './WorkExperienceDetailModal';
import { ReviewImportedExperiencesModal } from './ReviewImportedExperiencesModal';

interface BackgroundCapacityViewProps {
  onOpenEvidenceDetail?: (evidenceId: string) => void;
}

export const BackgroundCapacityView: React.FC<BackgroundCapacityViewProps> = ({
  onOpenEvidenceDetail,
}) => {
  // Structured CSV Work Experience Import state
  const [isProcessingCsv, setIsProcessingCsv] = useState(false);
  const [processingStep, setProcessingStep] = useState<CsvImportProcessingStep>('importing');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [csvBatch, setCsvBatch] = useState<CsvImportBatchSummary | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [showTemplateGuide, setShowTemplateGuide] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Work experiences state
  const [experiences, setExperiences] = useState<WorkExperienceRecord[]>(() => 
    WorkExperienceService.getWorkExperiences()
  );
  const [isAddExpModalOpen, setIsAddExpModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperienceRecord | null>(null);
  const [viewingExperience, setViewingExperience] = useState<WorkExperienceRecord | null>(null);

  // Skills state
  const [skills, setSkills] = useState<CanonicalSkill[]>(() => SkillService.getSkills());
  const [newCompetenceInput, setNewCompetenceInput] = useState('');
  const [showAddCompetence, setShowAddCompetence] = useState(false);
  const [newToolInput, setNewToolInput] = useState('');
  const [showAddTool, setShowAddTool] = useState(false);
  
  // Capabilities state (Intelligence & Capability Ledger)
  const [capabilities, setCapabilities] = useState<CapabilityRecord[]>(() => 
    CareerIntelligenceService.getCapabilities()
  );
  const [viewProofCap, setViewProofCap] = useState<CapabilityRecord | null>(null);
  const [filterProvenance, setFilterProvenance] = useState<'all' | 'verified' | 'extracted' | 'edited' | 'manual'>('all');

  // Reactively synchronize whenever career graph updates
  React.useEffect(() => {
    const unsubscribe = careerGraphEventBus.subscribe(() => {
      setExperiences(WorkExperienceService.getWorkExperiences());
      setSkills(SkillService.getSkills());
      setCapabilities(CareerIntelligenceService.getCapabilities());
    });
    return () => unsubscribe();
  }, []);

  // Update underlying skill level and trigger deterministic recalculation
  const handleUpdateSkillLevel = (capId: string, skillId: string, delta: number) => {
    const cap = capabilities.find(c => c.id === capId);
    if (!cap) return;
    const skill = cap.underlyingSkills.find(s => s.id === skillId);
    if (!skill) return;
    const newLevel = Math.min(6, Math.max(1, skill.level + delta));
    CareerIntelligenceService.updateUnderlyingSkillLevel(capId, skillId, newLevel);
    setCapabilities(CareerIntelligenceService.getCapabilities());
  };

  const getDeterministicLevelBadge = (level: number) => {
    switch (level) {
      case 6:
        return { label: 'Level 6: Expert', bg: 'bg-emerald-100 text-emerald-900 border-emerald-300' };
      case 5:
        return { label: 'Level 5: Advanced', bg: 'bg-blue-100 text-blue-900 border-blue-300' };
      case 4:
        return { label: 'Level 4: Proficient', bg: 'bg-indigo-100 text-indigo-900 border-indigo-300' };
      case 3:
        return { label: 'Level 3: Competent', bg: 'bg-amber-100 text-amber-900 border-amber-300' };
      case 2:
        return { label: 'Level 2: Working', bg: 'bg-purple-100 text-purple-900 border-purple-300' };
      case 1:
      default:
        return { label: 'Level 1: Exposure', bg: 'bg-slate-100 text-slate-800 border-slate-300' };
    }
  };

  // Skill inline editing state
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [editingSkillName, setEditingSkillName] = useState('');

  // Filter skills by category
  const coreCompetences = useMemo(() => skills.filter(s => s.category === 'competence'), [skills]);
  const toolsAndStacks = useMemo(() => skills.filter(s => s.category === 'tool_stack'), [skills]);

  const filteredCompetences = useMemo(() => {
    if (filterProvenance === 'all') return coreCompetences;
    return coreCompetences.filter(c => c.provenance === filterProvenance);
  }, [coreCompetences, filterProvenance]);

  const filteredTools = useMemo(() => {
    if (filterProvenance === 'all') return toolsAndStacks;
    return toolsAndStacks.filter(t => t.provenance === filterProvenance);
  }, [toolsAndStacks, filterProvenance]);

  // Run CSV content through the 6-stage CareerOS classification & structuring pipeline
  const runCsvImportPipeline = async (csvContent: string, fileName: string) => {
    setUploadError(null);
    setImportSuccessMessage(null);
    setIsProcessingCsv(true);
    setProcessingStep('importing');
    setProcessingProgress(15);

    try {
      const { batch, errors } = await processWorkExperienceCsvImport(
        csvContent,
        fileName,
        (step, percent) => {
          setProcessingStep(step);
          setProcessingProgress(percent);
        }
      );

      if (errors.length > 0 && (!batch || batch.items.length === 0)) {
        setUploadError(errors.join(' '));
        setCsvBatch(null);
      } else if (batch) {
        setCsvBatch(batch);
        if (errors.length > 0) {
          setUploadError(`Note: ${errors.join(' ')}`);
        }
      }
    } catch (err: any) {
      setUploadError(err.message || 'Unable to process CSV file.');
    } finally {
      setIsProcessingCsv(false);
    }
  };

  // Handle CSV File Upload
  const handleCsvFileUpload = async (file: File) => {
    setUploadError(null);
    setImportSuccessMessage(null);

    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.pdf')) {
      setUploadError(
        'Production-ready PDF resume parsing is not currently available in this beta. Please download our lightweight CSV template and import a .csv file.'
      );
      return;
    }

    if (!lowerName.endsWith('.csv') && file.type !== 'text/csv' && file.type !== 'application/vnd.ms-excel') {
      setUploadError('Please select a valid .csv file using the CareerOS Work Experience template.');
      return;
    }

    try {
      const text = await file.text();
      await runCsvImportPipeline(text, file.name);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to read the selected CSV file.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleCsvFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Review & Commit handlers for staged CSV records
  const recomputeBatchCounts = (items: StagedWorkExperienceImportItem[], baseBatch: CsvImportBatchSummary): CsvImportBatchSummary => {
    const activeItems = items.filter(i => i.status === 'pending');
    const uniqueCompetencies = new Set<string>();
    let outcomesCount = 0;

    activeItems.forEach(item => {
      item.record.relevantSkills.forEach(sk => uniqueCompetencies.add(sk));
      item.record.inferredIntelligence.capabilities.forEach(cap => uniqueCompetencies.add(cap));
      outcomesCount += item.record.measurableOutcomes.length;
    });

    return {
      ...baseBatch,
      items,
      totalDetected: activeItems.length,
      rolesClassifiedCount: activeItems.length,
      competenciesDetectedCount: uniqueCompetencies.size,
      measurableOutcomesCount: outcomesCount
    };
  };

  const handleUpdateStagedItem = (
    stagingId: string,
    updater: (item: StagedWorkExperienceImportItem) => StagedWorkExperienceImportItem
  ) => {
    if (!csvBatch) return;
    const nextItems = csvBatch.items.map(i => (i.stagingId === stagingId ? updater(i) : i));
    setCsvBatch(recomputeBatchCounts(nextItems, csvBatch));
  };

  const handleAcceptSingleStaged = (stagingId: string) => {
    if (!csvBatch) return;
    const target = csvBatch.items.find(i => i.stagingId === stagingId && i.status === 'pending');
    if (!target) return;

    const updatedExperiences = WorkExperienceService.commitCsvImportedExperiences([target.record]);
    setExperiences(updatedExperiences);
    setSkills(SkillService.getSkills());

    const nextItems = csvBatch.items.map(i =>
      i.stagingId === stagingId ? { ...i, status: 'accepted' as const } : i
    );
    const remainingPending = nextItems.filter(i => i.status === 'pending');

    if (remainingPending.length === 0) {
      setCsvBatch(null);
      setIsReviewModalOpen(false);
      setImportSuccessMessage(
        `Committed "${target.record.role} — ${target.record.company}" to your Work Experiences & Career Evidence Ledger.`
      );
    } else {
      setCsvBatch(recomputeBatchCounts(nextItems, csvBatch));
    }
  };

  const handleDiscardSingleStaged = (stagingId: string) => {
    if (!csvBatch) return;
    const nextItems = csvBatch.items.map(i =>
      i.stagingId === stagingId ? { ...i, status: 'discarded' as const } : i
    );
    const remainingPending = nextItems.filter(i => i.status === 'pending');
    if (remainingPending.length === 0) {
      setCsvBatch(null);
      setIsReviewModalOpen(false);
    } else {
      setCsvBatch(recomputeBatchCounts(nextItems, csvBatch));
    }
  };

  const handleAcceptAllStaged = () => {
    if (!csvBatch) return;
    const pending = csvBatch.items.filter(i => i.status === 'pending');
    if (pending.length === 0) return;

    const updatedExperiences = WorkExperienceService.commitCsvImportedExperiences(
      pending.map(p => p.record)
    );
    setExperiences(updatedExperiences);
    setSkills(SkillService.getSkills());
    setCsvBatch(null);
    setIsReviewModalOpen(false);
    setImportSuccessMessage(
      `Imported and structured ${pending.length} work experience record${pending.length === 1 ? '' : 's'} with CareerOS role, domain, and capability classification.`
    );
  };

  // Add Competence
  const handleAddCompetence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompetenceInput.trim()) return;
    SkillService.addSkill({
      name: newCompetenceInput.trim(),
      category: 'competence',
      provenance: 'manual',
      level: 'Proficient',
      linkedEvidenceCount: 0
    });
    setSkills(SkillService.getSkills());
    setNewCompetenceInput('');
    setShowAddCompetence(false);
  };

  // Add Tool
  const handleAddTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolInput.trim()) return;
    SkillService.addSkill({
      name: newToolInput.trim(),
      category: 'tool_stack',
      provenance: 'manual',
      level: 'Proficient',
      linkedEvidenceCount: 0
    });
    setSkills(SkillService.getSkills());
    setNewToolInput('');
    setShowAddTool(false);
  };

  // Start inline editing of a skill
  const handleStartEditSkill = (skill: CanonicalSkill) => {
    setEditingSkillId(skill.id);
    setEditingSkillName(skill.name);
  };

  // Save inline edited skill
  const handleSaveEditSkill = (id: string) => {
    if (editingSkillName.trim()) {
      SkillService.updateSkill(id, { name: editingSkillName.trim() });
      setSkills(SkillService.getSkills());
    }
    setEditingSkillId(null);
    setEditingSkillName('');
  };

  // Delete Experience
  const handleDeleteExperience = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (window.confirm('Delete this work experience record from your career profile?')) {
      WorkExperienceService.removeWorkExperience(id);
      setExperiences(WorkExperienceService.getWorkExperiences());
    }
  };

  const renderProvenanceBadge = (provenance: SkillProvenance | WorkExperienceRecord['provenance']) => {
    switch (provenance) {
      case 'verified':
      case 'evidence':
        return (
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-help"
            title="Verified: Validated by auditable proof deliverables, projects, or certifications."
          >
            <ShieldCheck className="w-2.5 h-2.5" /> Verified
          </span>
        );
      case 'extracted':
        return (
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 cursor-help"
            title="Imported: Structured from your CSV work history with CareerOS intelligence classification."
          >
            <FileCheck className="w-2.5 h-2.5" /> Imported
          </span>
        );
      case 'edited':
        return (
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 cursor-help"
            title="Edited: Customized by you. Preserved during subsequent imports."
          >
            <Pencil className="w-2.5 h-2.5" /> Edited
          </span>
        );
      case 'manual':
      default:
        return (
          <span 
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-2xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 cursor-help"
            title="Manual: Added manually by you. Protected from automated overwrite."
          >
            Manual
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      
      {/* SECTION 1: IMPORT WORK EXPERIENCE (CSV) + COMPACT WORK EXPERIENCES (2-Column Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Import Work Experience (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
            
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center font-bold shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Import Work Experience</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    Import your work history using our simple CSV template. CareerOS will automatically organize and classify the imported information into structured career records.
                  </p>
                </div>
              </div>
            </div>

            {/* Clear Status Note: PDF Resume Extraction Not Enabled in Beta */}
            <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-2xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  Automated PDF resume extraction is not enabled in the current beta. Use structured CSV import below.
                </span>
              </span>
            </div>

            {/* Hidden CSV File Input */}
            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleCsvFileUpload(e.target.files[0]);
                  e.target.value = '';
                }
              }}
            />

            {/* Primary Actions: Download CSV Template | Import CSV | View Template Guide */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-download-work-exp-csv-template"
                type="button"
                onClick={downloadWorkExperienceCsvTemplate}
                className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-blue-600" />
                <span>Download CSV Template</span>
              </button>

              <button
                id="btn-import-work-exp-csv"
                type="button"
                onClick={() => csvInputRef.current?.click()}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import CSV</span>
              </button>

              <button
                id="btn-view-csv-template-guide"
                type="button"
                onClick={() => setShowTemplateGuide(prev => !prev)}
                className="px-2.5 py-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>View Template Guide</span>
                {showTemplateGuide ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            </div>

            {/* Collapsible Lightweight Template Guide */}
            {showTemplateGuide && (
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/90 space-y-3 text-2xs animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-slate-700">
                    Lightweight CSV Template Guide
                  </span>
                  <span className="text-slate-400">No CareerOS taxonomy required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-900 block">Required Fields (3)</span>
                    <ul className="text-slate-600 space-y-0.5">
                      <li>• <code className="font-mono text-blue-700">Company</code></li>
                      <li>• <code className="font-mono text-blue-700">Role / Job Title</code></li>
                      <li>• <code className="font-mono text-blue-700">Start Date</code></li>
                    </ul>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1">
                    <span className="font-bold text-slate-700 block">Optional Fields (5)</span>
                    <ul className="text-slate-500 space-y-0.5">
                      <li>• <code className="font-mono">End Date</code>, <code className="font-mono">Current Role</code>, <code className="font-mono">Location</code></li>
                      <li>• <code className="font-mono">Description / What You Did</code></li>
                      <li>• <code className="font-mono">Key Achievements / Outcomes</code></li>
                    </ul>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Example Minimal Row</span>
                    <button
                      type="button"
                      onClick={() => runCsvImportPipeline(SAMPLE_WORK_EXPERIENCE_CSV, 'careeros_work_experience_template.csv')}
                      className="text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer"
                    >
                      Preview with Sample CSV (4 rows)
                    </button>
                  </div>
                  <div className="text-slate-600 font-mono text-[10.5px] leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                    <div>Company: Stripe | Role: Product Manager</div>
                    <div>Start Date: 2023-06 | End Date: Present</div>
                    <div>Description: Led platform improvements for enterprise customers.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Import Success Banner */}
            {importSuccessMessage && !isProcessingCsv && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <div className="flex-1">
                  <p className="font-semibold">Work Experiences Committed</p>
                  <p className="text-2xs mt-0.5 text-emerald-700">{importSuccessMessage}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setImportSuccessMessage(null)}
                  className="text-emerald-500 hover:text-emerald-800 text-xs font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* Upload Error / Validation Notice */}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <div className="flex-1">
                  <p className="font-semibold">CSV Import Notice</p>
                  <p className="text-2xs mt-0.5">{uploadError}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setUploadError(null)}
                  className="text-red-400 hover:text-red-700 text-xs font-bold cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* 6-Stage Intelligent Processing State:
                Importing → Reading records → Structuring experience → Classifying roles & domains → Extracting evidence → Ready for review */}
            {isProcessingCsv && (
              <div className="p-4 border-2 border-dashed border-blue-400 rounded-xl bg-blue-50/50 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-blue-950">
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                    <span>
                      {CSV_PROCESSING_STEPS.find(s => s.id === processingStep)?.label || 'Processing CSV'}...
                    </span>
                  </span>
                  <span>{processingProgress}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-blue-200/80 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-full transition-all duration-200 rounded-full"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>

                {/* 6-Step Pipeline Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10.5px]">
                  {CSV_PROCESSING_STEPS.map((step, idx) => {
                    const activeIdx = CSV_PROCESSING_STEPS.findIndex(s => s.id === processingStep);
                    const isCurrent = idx === activeIdx;
                    const isDone = idx < activeIdx;

                    return (
                      <div
                        key={step.id}
                        className={`px-2 py-1.5 rounded-lg border transition-all truncate ${
                          isCurrent
                            ? 'bg-white border-blue-400 text-blue-900 font-bold shadow-3xs'
                            : isDone
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-medium'
                            : 'bg-slate-100/60 border-slate-200 text-slate-400'
                        }`}
                      >
                        {step.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Review State Card (Before Committing Records) */}
            {!isProcessingCsv && csvBatch && csvBatch.totalDetected > 0 && (
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      Ready for Review
                    </span>
                    <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">
                      {csvBatch.totalDetected} work experience{csvBatch.totalDetected === 1 ? '' : 's'} detected
                    </h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-indigo-200 text-2xs font-semibold text-indigo-700 truncate max-w-[160px]">
                    {csvBatch.fileName}
                  </span>
                </div>

                {/* Detection Breakdown */}
                <div className="grid grid-cols-2 gap-2 text-2xs">
                  <div className="p-2 rounded-lg bg-white border border-indigo-100 font-semibold text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{csvBatch.totalDetected} records structured</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-indigo-100 font-semibold text-slate-800 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{csvBatch.rolesClassifiedCount} roles classified</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-indigo-100 font-semibold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>{csvBatch.competenciesDetectedCount} competencies detected</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white border border-indigo-100 font-semibold text-slate-800 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{csvBatch.measurableOutcomesCount} measurable outcomes detected</span>
                  </div>
                </div>

                {/* Preview of first detected record: Imported vs CareerOS Intelligence */}
                {csvBatch.items.find(i => i.status === 'pending') && (() => {
                  const previewItem = csvBatch.items.find(i => i.status === 'pending')!;
                  return (
                    <div className="p-2.5 rounded-lg bg-white/90 border border-indigo-100 space-y-1.5 text-2xs">
                      <div>
                        <span className="font-extrabold uppercase tracking-wider text-[10px] text-slate-400 block">
                          Imported
                        </span>
                        <span className="font-bold text-slate-900">
                          {previewItem.record.userProvided.importedSummaryLine}
                        </span>
                      </div>
                      <div className="pt-1 border-t border-slate-100">
                        <span className="font-extrabold uppercase tracking-wider text-[10px] text-indigo-600 block">
                          CareerOS Intelligence
                        </span>
                        <span className="font-semibold text-indigo-950">
                          {previewItem.record.inferredIntelligence.intelligenceSummaryLine}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* Review Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <button
                    id="btn-review-imported-records"
                    type="button"
                    onClick={() => setIsReviewModalOpen(true)}
                    className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Review Imported Records</span>
                  </button>

                  <button
                    id="btn-accept-all-imported-records"
                    type="button"
                    onClick={handleAcceptAllStaged}
                    className="py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accept All</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCsvBatch(null)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-white transition-colors cursor-pointer"
                    title="Discard staged CSV import"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Compact CSV Dropzone (when not actively reviewing a staged batch) */}
            {!isProcessingCsv && !csvBatch && (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => csvInputRef.current?.click()}
                className={`py-5 px-4 text-center border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                  isDragOver 
                    ? 'border-blue-500 bg-blue-50/60 scale-[0.99]' 
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  Drop your completed CSV here, or <span className="text-blue-600 underline">browse .csv file</span>
                </h4>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Minimal required columns: <span className="font-semibold text-slate-700">Company, Role / Job Title, Start Date</span>
                </p>
                <div className="mt-2.5 flex items-center justify-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-200 rounded-lg text-[10.5px] font-semibold text-slate-600 shadow-3xs">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    Auto-classifies roles, domains, capabilities &amp; outcomes
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Work Experiences (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900">Work Experiences</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-2xs font-semibold">
                    Showing {experiences.length} records
                  </span>
                </div>
                <p className="text-2xs text-slate-500 mt-0.5">
                  Structured career chronology with measurable outcomes, CareerOS intelligence, and verified evidence.
                </p>
              </div>

              <button
                id="btn-add-work-experience"
                onClick={() => {
                  setEditingExperience(null);
                  setIsAddExpModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> New Record
              </button>
            </div>

            {/* Experience Records List (Compact Card Redesign) */}
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-3.5 bg-white border border-slate-200 hover:border-blue-300 rounded-xl transition-all shadow-2xs space-y-2.5 group"
                >
                  {/* Top Row: Role, Company, Provenance, and Dates */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1.5">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {exp.role}
                        </h4>
                        {renderProvenanceBadge(exp.provenance)}
                      </div>
                      <p className="text-2xs font-medium text-slate-600 pl-5 sm:pl-5 mt-0.5">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-2xs text-slate-400 pl-5 sm:pl-0 shrink-0">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" /> {exp.dates}
                      </span>
                      {exp.location && (
                        <span>• {exp.location}</span>
                      )}
                    </div>
                  </div>

                  {/* User-Provided vs CareerOS Intelligence Distinction (for Imported / Classified Records) */}
                  {(exp.userProvided || exp.inferredIntelligence) && (
                    <div className="p-2.5 rounded-lg bg-slate-50/90 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-2xs">
                      {exp.userProvided && (
                        <div>
                          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 block">
                            Imported
                          </span>
                          <span className="font-semibold text-slate-800">
                            {exp.userProvided.importedSummaryLine}
                          </span>
                        </div>
                      )}
                      {exp.inferredIntelligence && (
                        <div className="sm:border-l sm:border-slate-200/80 sm:pl-2.5">
                          <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 text-indigo-600" />
                            CareerOS Intelligence
                          </span>
                          <span className="font-semibold text-indigo-950">
                            {exp.inferredIntelligence.intelligenceSummaryLine}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 1 Summary Line */}
                  {exp.scope && (
                    <p className="text-2xs text-slate-600 leading-snug line-clamp-1 pl-0.5">
                      {exp.scope}
                    </p>
                  )}

                  {/* 2-3 Measurable Outcomes Chips */}
                  {exp.measurableOutcomes && exp.measurableOutcomes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {exp.measurableOutcomes.slice(0, 3).map((metric, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50/80 text-blue-900 border border-blue-200/80 rounded-md text-2xs font-medium"
                        >
                          <Target className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                          {metric}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Key Skills & Actions Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    
                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1 items-center">
                      {exp.relevantSkills?.slice(0, 4).map((sk, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded text-2xs font-medium"
                        >
                          {sk}
                        </span>
                      ))}
                      {(exp.relevantSkills?.length || 0) > 4 && (
                        <span className="text-2xs text-slate-400 font-medium">
                          +{(exp.relevantSkills?.length || 0) - 4} more
                        </span>
                      )}
                    </div>

                    {/* Compact Card Action Buttons: See Details, Edit, Delete */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingExperience(exp)}
                        className="px-2 py-1 text-2xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors flex items-center gap-1"
                        title="View complete record details and evidence"
                      >
                        <Eye className="w-3 h-3" /> See Details
                      </button>
                      <button
                        onClick={() => {
                          setEditingExperience(exp);
                          setIsAddExpModalOpen(true);
                        }}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                        title="Edit work experience"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteExperience(exp.id, e)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete work experience"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>

      {/* SECTION 2: SKILLS (Two-Column Layout: Core Competences | Tools & Stacks) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Skills & Capability Ledger</h3>
            <p className="text-2xs text-slate-500">
              Two-pillar taxonomy balancing conceptual strategic competences with practical technologies and tools.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-2xs font-semibold text-slate-500 flex-wrap">
            <span className="text-slate-400 mr-1">Filter:</span>
            <button
              onClick={() => setFilterProvenance('all')}
              className={`px-2 py-0.5 rounded-full border transition-colors ${
                filterProvenance === 'all'
                  ? 'bg-slate-800 text-white border-slate-800'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              All ({skills.length})
            </button>
            <button
              onClick={() => setFilterProvenance('verified')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-colors ${
                filterProvenance === 'verified'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Verified ({skills.filter(s => s.provenance === 'verified').length})
            </button>
            <button
              onClick={() => setFilterProvenance('extracted')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-colors ${
                filterProvenance === 'extracted'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
              }`}
            >
              <FileCheck className="w-3 h-3" /> Extracted ({skills.filter(s => s.provenance === 'extracted').length})
            </button>
            <button
              onClick={() => setFilterProvenance('edited')}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-colors ${
                filterProvenance === 'edited'
                  ? 'bg-amber-600 text-white border-amber-600'
                  : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Pencil className="w-3 h-3" /> Edited ({skills.filter(s => s.provenance === 'edited').length})
            </button>
            <button
              onClick={() => setFilterProvenance('manual')}
              className={`px-2 py-0.5 rounded-full border transition-colors ${
                filterProvenance === 'manual'
                  ? 'bg-slate-600 text-white border-slate-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              Manual ({skills.filter(s => s.provenance === 'manual').length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: Core Competences */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold text-slate-900">Core Competences</h4>
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-2xs font-bold">
                  {filteredCompetences.length}
                </span>
              </div>

              <button
                onClick={() => setShowAddCompetence(!showAddCompetence)}
                className="p-1 text-slate-600 hover:text-blue-600 rounded-md hover:bg-white transition-colors flex items-center gap-1 text-2xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Competence
              </button>
            </div>

            {showAddCompetence && (
              <form onSubmit={handleAddCompetence} className="flex gap-2 p-2 bg-white rounded-lg border border-blue-200 shadow-xs">
                <input
                  type="text"
                  placeholder="e.g. Failure Mode Analysis, RFC Consensus..."
                  value={newCompetenceInput}
                  onChange={(e) => setNewCompetenceInput(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-blue-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-1.5">
              {filteredCompetences.map((comp) => (
                <div
                  key={comp.id}
                  className="p-2.5 bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    {editingSkillId === comp.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editingSkillName}
                          onChange={(e) => setEditingSkillName(e.target.value)}
                          className="text-xs px-2 py-1 border border-blue-400 rounded flex-1 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditSkill(comp.id);
                            if (e.key === 'Escape') setEditingSkillId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEditSkill(comp.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-slate-800">{comp.name}</span>
                        {comp.linkedEvidenceCount && comp.linkedEvidenceCount > 0 && (
                          <span className="text-2xs text-slate-400 font-mono">({comp.linkedEvidenceCount} proof)</span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderProvenanceBadge(comp.provenance)}
                    <button
                      onClick={() => handleStartEditSkill(comp)}
                      className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Edit capability"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete competence "${comp.name}"?`)) {
                          SkillService.removeSkill(comp.id);
                          setSkills(SkillService.getSkills());
                        }
                      }}
                      className="text-slate-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete capability"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Tools & Stacks */}
          <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-purple-600" />
                <h4 className="text-xs font-bold text-slate-900">Tools & Stacks</h4>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-2xs font-bold">
                  {filteredTools.length}
                </span>
              </div>

              <button
                onClick={() => setShowAddTool(!showAddTool)}
                className="p-1 text-slate-600 hover:text-purple-600 rounded-md hover:bg-white transition-colors flex items-center gap-1 text-2xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tool/Stack
              </button>
            </div>

            {showAddTool && (
              <form onSubmit={handleAddTool} className="flex gap-2 p-2 bg-white rounded-lg border border-purple-200 shadow-xs">
                <input
                  type="text"
                  placeholder="e.g. Kafka, PostgreSQL, Docker, AWS..."
                  value={newToolInput}
                  onChange={(e) => setNewToolInput(e.target.value)}
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-purple-600 text-white rounded text-xs font-semibold"
                >
                  Save
                </button>
              </form>
            )}

            <div className="space-y-1.5">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="p-2.5 bg-white border border-slate-200/80 hover:border-slate-300 rounded-lg flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    {editingSkillId === tool.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editingSkillName}
                          onChange={(e) => setEditingSkillName(e.target.value)}
                          className="text-xs px-2 py-1 border border-purple-400 rounded flex-1 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEditSkill(tool.id);
                            if (e.key === 'Escape') setEditingSkillId(null);
                          }}
                        />
                        <button
                          onClick={() => handleSaveEditSkill(tool.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-xs font-semibold text-slate-800">{tool.name}</span>
                        {tool.linkedEvidenceCount && tool.linkedEvidenceCount > 0 && (
                          <span className="text-2xs text-slate-400 font-mono">({tool.linkedEvidenceCount} proof)</span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {renderProvenanceBadge(tool.provenance)}
                    <button
                      onClick={() => handleStartEditSkill(tool)}
                      className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100 transition-colors"
                      title="Edit technology"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete tool/stack "${tool.name}"?`)) {
                          SkillService.removeSkill(tool.id);
                          setSkills(SkillService.getSkills());
                        }
                      }}
                      className="text-slate-300 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors"
                      title="Delete technology"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: VERIFIED CAPABILITIES LEDGER & DETERMINISTIC LEVEL ASSESSMENT (Level 1-6) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Verified Capabilities & Level Assessment</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-2xs font-bold border border-indigo-200">
                {capabilities.length} Capabilities
              </span>
            </div>
            <p className="text-2xs text-slate-500 mt-0.5">
              Computed from underlying skills and cross-role career milestones. Levels 1 to 6 follow a strict deterministic average formula.
            </p>
          </div>

          <div className="flex items-center gap-2 text-2xs text-slate-500">
            <span className="flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <ShieldCheck className="w-3 h-3" /> Math-Verified Ledger
            </span>
          </div>
        </div>

        {/* Capability Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {capabilities.map((cap) => {
            const badge = getDeterministicLevelBadge(cap.level);
            return (
              <div
                key={cap.id}
                className="bg-slate-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl p-4 flex flex-col justify-between transition-all space-y-3 group shadow-2xs hover:shadow-xs"
              >
                {/* Header: Title + Level Badge + Confidence */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">
                      {cap.name}
                    </h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-bold border shrink-0 ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-2xs">
                    <span className="font-semibold text-indigo-700 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> {cap.confidence}% Confidence
                    </span>
                    <span className="text-slate-500 font-medium px-1.5 py-0.5 rounded bg-white border border-slate-200">
                      Source: {cap.source}
                    </span>
                  </div>

                  <p className="text-2xs text-slate-600 leading-relaxed">
                    {cap.shortExplanation}
                  </p>
                </div>

                {/* Key Supporting Evidence Points */}
                {cap.keySupportingEvidence && cap.keySupportingEvidence.length > 0 && (
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 space-y-1.5">
                    <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
                      Key Milestone Evidence
                    </span>
                    <ul className="space-y-1">
                      {cap.keySupportingEvidence.map((ev, idx) => (
                        <li key={idx} className="text-2xs text-slate-700 flex items-start gap-1.5 leading-tight">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{ev}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Underlying Skills with Interactive Deterministic Level Adjuster */}
                <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                  <div className="flex items-center justify-between text-2xs font-bold text-slate-500">
                    <span>Underlying Skills ({cap.underlyingSkills.length})</span>
                    <span className="text-slate-400 font-normal">Deterministic Avg: Level {cap.level}</span>
                  </div>

                  <div className="space-y-1">
                    {cap.underlyingSkills.map((sk) => (
                      <div
                        key={sk.id}
                        className="flex items-center justify-between py-1 px-1.5 rounded bg-white border border-slate-100 text-2xs"
                      >
                        <span className="font-medium text-slate-800 truncate max-w-[140px]" title={sk.name}>
                          {sk.name}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleUpdateSkillLevel(cap.id, sk.id, -1)}
                            disabled={sk.level <= 1}
                            className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 flex items-center justify-center font-bold text-2xs"
                            title="Decrease level"
                          >
                            -
                          </button>
                          <span className="px-1.5 font-bold text-indigo-700 font-mono">
                            L{sk.level}
                          </span>
                          <button
                            onClick={() => handleUpdateSkillLevel(cap.id, sk.id, 1)}
                            disabled={sk.level >= 6}
                            className="w-4 h-4 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 flex items-center justify-center font-bold text-2xs"
                            title="Increase level"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action: View Auditable Proof Breakdown */}
                <button
                  onClick={() => setViewProofCap(cap)}
                  className="w-full py-1.5 px-2.5 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-indigo-700 rounded-lg text-2xs font-semibold flex items-center justify-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" /> View Auditable Proof Breakdown
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proof Breakdown Modal */}
      {viewProofCap && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-xl max-h-[85vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{viewProofCap.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-2xs font-bold border ${getDeterministicLevelBadge(viewProofCap.level).bg}`}>
                    {getDeterministicLevelBadge(viewProofCap.level).label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified with {viewProofCap.confidence}% confidence across {viewProofCap.underlyingSkills.length} skills.
                </p>
              </div>
              <button
                onClick={() => setViewProofCap(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Grounding and Provenance Summary */}
            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1.5 text-xs text-indigo-900">
              <div className="flex items-center justify-between font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Grounded Career Evidence
                </span>
                <span className="text-2xs bg-indigo-200/70 px-2 py-0.5 rounded-full text-indigo-900 font-semibold">
                  Source: {viewProofCap.source}
                </span>
              </div>
              <p className="text-2xs text-indigo-800 leading-relaxed">
                {viewProofCap.shortExplanation}
              </p>
            </div>

            {/* Supporting Experience Sources */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Connected Experience Sources
              </h4>
              <div className="space-y-2">
                {viewProofCap.supportingEvidenceSources && viewProofCap.supportingEvidenceSources.length > 0 ? (
                  viewProofCap.supportingEvidenceSources.map((src, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800">
                        <span>{src.title}</span>
                        {src.date && <span className="text-2xs text-slate-500 font-normal">{src.date}</span>}
                      </div>
                      {src.detail && <p className="text-2xs text-slate-600 leading-relaxed">{src.detail}</p>}
                    </div>
                  ))
                ) : (
                  <p className="text-2xs text-slate-500">Connected through active work experience milestones.</p>
                )}
              </div>
            </div>

            {/* Underlying Skills Matrix */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-slate-400">
                Underlying Skills Assessment
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {viewProofCap.underlyingSkills.map((sk) => (
                  <div key={sk.id} className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate pr-2">{sk.name}</span>
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded font-bold text-2xs text-indigo-700">
                      L{sk.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setViewProofCap(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
              >
                Close Breakdown
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Work Experience Modal */}
      <AddWorkExperienceModal
        isOpen={isAddExpModalOpen}
        onClose={() => {
          setIsAddExpModalOpen(false);
          setEditingExperience(null);
        }}
        initialRecord={editingExperience}
        onSaved={(record) => {
          setExperiences(WorkExperienceService.getWorkExperiences());
        }}
        onAdded={(record) => {
          setExperiences(WorkExperienceService.getWorkExperiences());
        }}
      />

      {/* Work Experience Detail Modal (See Details action) */}
      <WorkExperienceDetailModal
        isOpen={!!viewingExperience}
        onClose={() => setViewingExperience(null)}
        record={viewingExperience}
        onEdit={(rec) => {
          setViewingExperience(null);
          setEditingExperience(rec);
          setIsAddExpModalOpen(true);
        }}
        onDelete={(id) => {
          WorkExperienceService.removeWorkExperience(id);
          setExperiences(WorkExperienceService.getWorkExperiences());
        }}
      />

      {/* Review Imported Work Experiences Modal */}
      <ReviewImportedExperiencesModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        batch={csvBatch}
        onUpdateStagedItem={handleUpdateStagedItem}
        onAcceptSingle={handleAcceptSingleStaged}
        onDiscardSingle={handleDiscardSingleStaged}
        onAcceptAll={handleAcceptAllStaged}
      />

    </div>
  );
};

