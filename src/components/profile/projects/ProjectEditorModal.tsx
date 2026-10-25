import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  Bold, 
  Italic, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Table, 
  FileText,
  AlertCircle,
  HelpCircle,
  Eye,
  Pencil,
  Tag,
  Lock
} from 'lucide-react';
import { CareerProject, ProjectSection, ProjectSectionType, SUGGESTED_SECTION_PRESETS } from '../../../features/projects/types';
import { convertClipboardToStructuredMarkdown } from '../../../features/knowledge/services/richTextPasteService';
import { BlueprintRichTextRenderer } from '../../common/BlueprintRichTextRenderer';
import { AccessCreationBanner } from '../../access/AccessCreationBanner';
import { ProgressiveCreationSection } from '../../access/ProgressiveCreationSection';
import { DemoQuotaGate } from '../../access/DemoQuotaGate';
import { useAccessControl } from '../../../services/accessControlService';

interface ProjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: CareerProject | null;
  onSave: (project: CareerProject) => void;
}

export const ProjectEditorModal: React.FC<ProjectEditorModalProps> = ({
  isOpen,
  onClose,
  project,
  onSave,
}) => {
  const { capabilities, canCreate, openContextualPrompt } = useAccessControl();
  const isSubmittingRef = useRef(false);
  if (!isOpen) return null;

  // Metadata form state (Basic: Project Name, Project Type, Description, Status)
  const [title, setTitle] = useState(project?.title || '');
  const [projectType, setProjectType] = useState('Production Architecture');
  const [tagline, setTagline] = useState(project?.tagline || '');
  const [role, setRole] = useState(project?.role || '');
  const [company, setCompany] = useState(project?.company || '');
  const [domain, setDomain] = useState(project?.domain || 'Fintech & Payments');
  const [status, setStatus] = useState<CareerProject['status']>(project?.status || 'active');
  const [timeframe, setTimeframe] = useState(project?.timeframe || '');
  const [techStackInput, setTechStackInput] = useState(project?.techStack.join(', ') || '');
  const [metricsInput, setMetricsInput] = useState(project?.metrics.join('\n') || '');

  // Sections state
  const [sections, setSections] = useState<ProjectSection[]>(() => {
    if (project && project.sections.length > 0) {
      return [...project.sections];
    }
    // Default starting blocks for a new project (non-mandatory, just helpful suggestions)
    return [
      {
        id: `sec-${Date.now()}-1`,
        type: 'business_context',
        title: 'Business Context & Objective',
        content: '',
        order: 1
      },
      {
        id: `sec-${Date.now()}-2`,
        type: 'problem',
        title: 'Core Problem Statement',
        content: '',
        order: 2
      },
      {
        id: `sec-${Date.now()}-3`,
        type: 'decision',
        title: 'Decision & Technical Strategy',
        content: '',
        order: 3
      },
      {
        id: `sec-${Date.now()}-4`,
        type: 'result',
        title: 'Measurable Outcomes & Business Impact',
        content: '',
        order: 4
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [showSectionPicker, setShowSectionPicker] = useState(false);
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Section handling
  const handleAddSuggestedSection = (type: ProjectSectionType) => {
    const preset = SUGGESTED_SECTION_PRESETS.find(p => p.type === type);
    if (!preset) return;

    const newSec: ProjectSection = {
      id: `sec-${Date.now()}`,
      type: type,
      title: preset.defaultTitle,
      content: '',
      order: sections.length + 1
    };
    setSections(prev => [...prev, newSec]);
    setShowSectionPicker(false);
  };

  const handleAddCustomSection = () => {
    if (!customSectionTitle.trim()) return;
    const newSec: ProjectSection = {
      id: `sec-${Date.now()}`,
      type: 'custom',
      title: customSectionTitle.trim(),
      content: '',
      order: sections.length + 1
    };
    setSections(prev => [...prev, newSec]);
    setCustomSectionTitle('');
    setShowCustomInput(false);
    setShowSectionPicker(false);
  };

  const handleRemoveSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const handleUpdateSectionTitle = (id: string, newTitle: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, title: newTitle } : s));
  };

  const handleUpdateSectionContent = (id: string, content: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, content } : s));
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;

    const reordered = [...sections];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);
    setSections(reordered.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  // Rich-text paste handler for textareas
  const handleSectionPaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
    sectionId: string
  ) => {
    const htmlData = e.clipboardData.getData('text/html');
    const plainText = e.clipboardData.getData('text/plain');

    if (htmlData && htmlData.trim()) {
      e.preventDefault();
      const markdown = convertClipboardToStructuredMarkdown(htmlData, plainText);
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentVal = textarea.value;

      const nextVal = currentVal.substring(0, start) + markdown + currentVal.substring(end);
      handleUpdateSectionContent(sectionId, nextVal);
    }
  };

  // Quick formatting insert helper
  const insertFormatting = (
    sectionId: string,
    prefix: string,
    suffix: string = '',
    sampleText: string = 'text'
  ) => {
    const textarea = document.getElementById(`textarea-sec-${sectionId}`) as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selected = currentVal.substring(start, end) || sampleText;

    const nextVal = currentVal.substring(0, start) + prefix + selected + suffix + currentVal.substring(end);
    handleUpdateSectionContent(sectionId, nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 10);
  };

  const handleSave = () => {
    if (isSubmittingRef.current) return;
    if (!capabilities.canCreate) {
      openContextualPrompt();
      return;
    }
    if (!project && !canCreate('projects')) {
      return;
    }
    if (!title.trim()) return;
    isSubmittingRef.current = true;

    const techArray = techStackInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const metricsArray = metricsInput
      .split('\n')
      .map(m => m.trim())
      .filter(Boolean);

    const updatedProject: CareerProject = {
      id: project?.id || `proj-${Date.now()}`,
      title: title.trim(),
      tagline: tagline.trim(),
      role: role.trim() || 'Software Engineer',
      company: company.trim() || 'Tech Enterprise',
      domain: domain,
      status: status,
      timeframe: timeframe.trim() || '2025',
      techStack: techArray,
      metrics: metricsArray,
      sections: sections.map((s, idx) => ({ ...s, order: idx + 1 })),
      workingNotes: project?.workingNotes || '',
      evidenceNotes: project?.evidenceNotes || '',
      linkedStoryIds: project?.linkedStoryIds || [],
      linkedBlueprintIds: project?.linkedBlueprintIds || [],
      createdAt: project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(updatedProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {project ? 'Edit Project Case Study' : 'Create New Project Case Study'}
              </h2>
              <p className="text-2xs text-slate-500">
                Flexible rich-text workspace. Sections are modular suggestions, not rigid mandatory gates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold text-slate-600">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'edit' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
                }`}
              >
                <Pencil className="w-3.5 h-3.5" />
                <span>Editor</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'preview' ? 'bg-slate-900 text-white' : 'hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <DemoQuotaGate workflowKey="projects" isEditing={Boolean(project)} onViewExistingItems={onClose}>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AccessCreationBanner workflowKey="projects" workflowLabel="Projects" />

          {activeTab === 'edit' ? (
            <>
              {/* BASIC FIELDS: Project Name, Project Type, Description, Status */}
              <div className="space-y-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Basic Project Fields
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Project Name · Project Type · Description · Status
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Core Checkout Idempotency & Payment Replay Engine"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Project Type
                    </label>
                    <select
                      value={projectType}
                      onChange={e => setProjectType(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Production Architecture">Production Architecture</option>
                      <option value="0-to-1 Product Build">0-to-1 Product Build</option>
                      <option value="AI & Data Pipeline">AI &amp; Data Pipeline</option>
                      <option value="System Migration & Reliability">System Migration &amp; Reliability</option>
                      <option value="Open Source / Developer Tool">Open Source / Developer Tool</option>
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={e => setStatus(e.target.value as any)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active (In Flight)</option>
                      <option value="completed">Completed (Shipped)</option>
                      <option value="in_review">In Review / Case Study</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={tagline}
                    onChange={e => setTagline(e.target.value)}
                    placeholder="High-throughput at-most-once payment processing pipeline with zero duplicate charges across $45M volume"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* ADVANCED SECTION: Capability Mapping, Evidence Model, Outcome Metrics, Role Alignment, Intelligence Tags */}
              <ProgressiveCreationSection workflowKey="projects">
              <div className="space-y-4 bg-slate-50/60 p-4 rounded-xl border border-slate-200/80">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Role Held
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Lead Platform Engineer"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Fintech Corp"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Domain
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={e => setDomain(e.target.value)}
                      placeholder="e.g. Fintech & Payments"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Timeframe
                    </label>
                    <input
                      type="text"
                      value={timeframe}
                      onChange={e => setTimeframe(e.target.value)}
                      placeholder="e.g. Q1 2025 - Q3 2025"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Tech Stack / Tools</span>
                      <span className="text-slate-400 font-normal">Comma-separated</span>
                    </label>
                    <input
                      type="text"
                      value={techStackInput}
                      onChange={e => setTechStackInput(e.target.value)}
                      placeholder="PostgreSQL, Redis, Kafka, Node.js, Kubernetes"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-2xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>Key Metrics & Quantifiable Impact</span>
                      <span className="text-slate-400 font-normal">One per line</span>
                    </label>
                    <textarea
                      rows={2}
                      value={metricsInput}
                      onChange={e => setMetricsInput(e.target.value)}
                      placeholder="0 duplicate charges across $45M processed volume&#10;85ms P99 cached replay latency"
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* MODULAR SECTIONS BUILDER */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Case Study Sections ({sections.length})
                    </span>
                    <span className="text-2xs text-slate-400 font-medium">
                      Add, reorder, or rename freely
                    </span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowSectionPicker(prev => !prev)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-blue-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Section</span>
                    </button>

                    {showSectionPicker && (
                      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-20 animate-in fade-in zoom-in-95">
                        <div className="px-2 py-1 text-2xs font-bold text-slate-400 uppercase tracking-wider">
                          Suggested Sections
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-0.5">
                          {SUGGESTED_SECTION_PRESETS.map(preset => (
                            <button
                              key={preset.type}
                              type="button"
                              onClick={() => handleAddSuggestedSection(preset.type)}
                              className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors flex flex-col cursor-pointer"
                            >
                              <span className="font-semibold">{preset.label}</span>
                              <span className="text-[10px] text-slate-400 truncate">{preset.description}</span>
                            </button>
                          ))}
                        </div>

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          {showCustomInput ? (
                            <div className="p-1 space-y-1.5">
                              <input
                                type="text"
                                value={customSectionTitle}
                                onChange={e => setCustomSectionTitle(e.target.value)}
                                placeholder="Custom section name..."
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs text-slate-800"
                                autoFocus
                                onKeyDown={e => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddCustomSection();
                                  }
                                }}
                              />
                              <div className="flex justify-end gap-1">
                                <button
                                  type="button"
                                  onClick={() => setShowCustomInput(false)}
                                  className="px-2 py-0.5 text-2xs text-slate-500 hover:text-slate-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={handleAddCustomSection}
                                  className="px-2 py-0.5 bg-blue-600 text-white rounded text-2xs font-bold"
                                >
                                  Add
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setShowCustomInput(true)}
                              className="w-full text-left px-2.5 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-1.5 cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Create Custom Section...</span>
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {sections.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <p className="text-xs text-slate-500 mb-2">No sections added yet.</p>
                    <button
                      type="button"
                      onClick={() => setShowSectionPicker(true)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      Choose a Suggested Section
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section, index) => (
                      <div
                        key={section.id}
                        className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100"
                      >
                        {/* Section Header */}
                        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {index + 1}
                            </span>
                            <input
                              type="text"
                              value={section.title}
                              onChange={e => handleUpdateSectionTitle(section.id, e.target.value)}
                              className="bg-transparent font-bold text-xs text-slate-800 hover:bg-white focus:bg-white px-2 py-0.5 rounded border border-transparent focus:border-slate-300 focus:outline-none flex-1 truncate"
                              title="Click to rename section"
                            />
                            <span className="text-[10px] uppercase font-semibold text-slate-400 shrink-0 hidden sm:inline">
                              {section.type}
                            </span>
                          </div>

                          {/* Action controls */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => handleMoveSection(index, 'up')}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Move section up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={index === sections.length - 1}
                              onClick={() => handleMoveSection(index, 'down')}
                              className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                              title="Move section down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveSection(section.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer ml-1"
                              title="Delete section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Formatting mini-toolbar */}
                        <div className="px-3 py-1 bg-slate-50/40 border-b border-slate-100 flex items-center gap-1 text-slate-600 overflow-x-auto">
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '**', '**', 'bold text')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Bold (**text**)"
                          >
                            <Bold className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '*', '*', 'italic text')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Italic (*text*)"
                          >
                            <Italic className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '## ', '', 'Heading 2')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Heading 2"
                          >
                            <Heading2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '### ', '', 'Heading 3')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Heading 3"
                          >
                            <Heading3 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '- ', '', 'Bullet item')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Bullet List"
                          >
                            <List className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '1. ', '', 'Numbered item')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Numbered List"
                          >
                            <ListOrdered className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '> ', '', 'Quote or Callout')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Quote"
                          >
                            <Quote className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => insertFormatting(section.id, '\n| Metric | Baseline | Target |\n| :--- | :--- | :--- |\n| Latency | 450ms | 85ms |\n', '', '')}
                            className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                            title="Table snippet"
                          >
                            <Table className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] text-slate-400 ml-auto pr-1">
                            Paste formatted text preserved
                          </span>
                        </div>

                        {/* Content textarea */}
                        <div className="p-3">
                          <textarea
                            id={`textarea-sec-${section.id}`}
                            rows={4}
                            value={section.content}
                            onChange={e => handleUpdateSectionContent(section.id, e.target.value)}
                            onPaste={e => handleSectionPaste(e, section.id)}
                            placeholder={`Enter ${section.title.toLowerCase()} details or paste formatted case study text...`}
                            className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-transparent border-0 focus:ring-0 focus:outline-none resize-y min-h-[90px]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              </ProgressiveCreationSection>
            </>
          ) : (
            /* PREVIEW TAB */
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {domain} · {role}
                </span>
                <h1 className="text-lg font-bold text-slate-900 mt-1">
                  {title || 'Untitled Project'}
                </h1>
                {tagline && (
                  <p className="text-xs text-slate-600 mt-1 font-medium">
                    {tagline}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2 mt-2 text-2xs text-slate-500">
                  <span>{company}</span>
                  <span>·</span>
                  <span>{timeframe}</span>
                  <span>·</span>
                  <span className="capitalize">{status}</span>
                </div>
              </div>

              {capabilities.canViewIntelligence && sections.map((section, idx) => (
                <div key={section.id} className="space-y-2 border-b border-slate-100 pb-4 last:border-0">
                  <h3 className="text-xs font-bold uppercase tracking-wide text-slate-800 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{section.title}</span>
                  </h3>
                  <div className="pl-6">
                    <BlueprintRichTextRenderer content={section.content} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xs text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Structured for 1-click Storybank &amp; Q&amp;A generation</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            {!capabilities.canCreate ? (
              <button
                type="button"
                onClick={() => openContextualPrompt()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Unlock in Demo</span>
              </button>
            ) : (
              <button
                type="button"
                disabled={!title.trim()}
                onClick={handleSave}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                {project ? 'Save Project Changes' : 'Save Project'}
              </button>
            )}
          </div>
        </div>
        </DemoQuotaGate>

      </div>
    </div>
  );
};
