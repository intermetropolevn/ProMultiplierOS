import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ArrowUpDown, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet, 
  Layers, 
  RefreshCw,
  HelpCircle,
  Filter,
  Check,
  Trash2,
  CheckSquare,
  Sparkles
} from 'lucide-react';
import { StructuredAnswerBlueprint } from '../../features/knowledge/types';
import { KnowledgeStorageService } from '../../features/knowledge/services/knowledgeStorageService';
import { ActivityService } from '../../services/activityService';
import { 
  generateCsvTemplate, 
  exportBlueprintsToCsv, 
  triggerCsvDownload, 
  parseAndValidateBlueprintCsv, 
  commitBlueprintImport,
  CsvValidationResult,
  BLUEPRINT_CSV_FIELD_DEFINITIONS
} from '../../features/knowledge/services/blueprintCsvService';

interface ImportExportBlueprintsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredBlueprints: StructuredAnswerBlueprint[];
  allBlueprints: StructuredAnswerBlueprint[];
  selectedBlueprints?: StructuredAnswerBlueprint[];
  activeFilterDescription?: string;
  onImportComplete: () => void;
}

export const ImportExportBlueprintsModal: React.FC<ImportExportBlueprintsModalProps> = ({
  isOpen,
  onClose,
  filteredBlueprints,
  allBlueprints,
  selectedBlueprints = [],
  activeFilterDescription,
  onImportComplete
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [isGuideOpen, setIsGuideOpen] = useState(true);

  // File import state
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<CsvValidationResult | null>(null);
  const [previewFilter, setPreviewFilter] = useState<'all' | 'valid' | 'error' | 'delete'>('all');
  const [isCommitting, setIsCommitting] = useState(false);
  const [importSuccessSummary, setImportSuccessSummary] = useState<{
    created: number;
    updated: number;
    deleted: number;
    total: number;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownloadTemplate = () => {
    const csv = generateCsvTemplate();
    triggerCsvDownload(csv, 'career_qa_blueprints_template.csv');
  };

  const handleExportSelected = () => {
    if (selectedBlueprints.length === 0) return;
    const csv = exportBlueprintsToCsv(selectedBlueprints);
    const timestamp = new Date().toISOString().slice(0, 10);
    triggerCsvDownload(csv, `blueprints_selected_${selectedBlueprints.length}_${timestamp}.csv`);
  };

  const handleExportFiltered = () => {
    const csv = exportBlueprintsToCsv(filteredBlueprints);
    const timestamp = new Date().toISOString().slice(0, 10);
    triggerCsvDownload(csv, `blueprints_filtered_${timestamp}.csv`);
  };

  const handleExportAll = () => {
    const csv = exportBlueprintsToCsv(allBlueprints);
    const timestamp = new Date().toISOString().slice(0, 10);
    triggerCsvDownload(csv, `blueprints_all_library_${timestamp}.csv`);
  };

  const handleProcessFile = (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      alert('Please upload a valid .csv file.');
      return;
    }

    setUploadedFileName(file.name);
    setImportSuccessSummary(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      const latestBlueprints = KnowledgeStorageService.getBlueprints();
      const result = parseAndValidateBlueprintCsv(text, latestBlueprints);
      setValidationResult(result);
    };
    reader.readAsText(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const handleResetImport = () => {
    setValidationResult(null);
    setUploadedFileName(null);
    setImportSuccessSummary(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCommitImport = () => {
    if (!validationResult || validationResult.validCount === 0) return;

    setIsCommitting(true);
    try {
      const latestBlueprints = KnowledgeStorageService.getBlueprints();
      const validRows = validationResult.rows.filter(r => r.isValid);
      
      const commitRes = commitBlueprintImport(validRows, latestBlueprints);
      KnowledgeStorageService.saveBlueprints(commitRes.allBlueprints);

      // Log activity
      ActivityService.logActivity({
        category: 'blueprint',
        title: `Bulk Imported Q&A Blueprints (${commitRes.createdCount} created, ${commitRes.updatedCount} updated, ${commitRes.deletedCount} deleted)`,
        description: `Successfully processed CSV bulk operations across ${validRows.length} canonical records.`,
        source: 'Blueprint',
        badgeText: 'Bulk CSV',
        badgeVariant: 'purple',
      });

      setImportSuccessSummary({
        created: commitRes.createdCount,
        updated: commitRes.updatedCount,
        deleted: commitRes.deletedCount,
        total: validRows.length
      });

      onImportComplete();
    } catch (err) {
      console.error('Failed to commit blueprint import', err);
      alert('An error occurred while saving the blueprints. Please try again.');
    } finally {
      setIsCommitting(false);
    }
  };

  const displayedPreviewRows = validationResult?.rows.filter(r => {
    if (previewFilter === 'valid') return r.isValid;
    if (previewFilter === 'error') return !r.isValid;
    if (previewFilter === 'delete') return r.operation === 'DELETE';
    return true;
  }) || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Import / Export Blueprints
              </h3>
              <p className="text-xs text-slate-500">
                Bulk create, update, and export Q&amp;A blueprints via standard CSV with live preview
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="px-6 pt-3 border-b border-slate-200 bg-white flex items-center gap-6">
          <button
            id="tab-import-blueprints"
            onClick={() => setActiveTab('import')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'import'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Import Blueprints from CSV
            {validationResult && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                validationResult.errorCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {validationResult.totalRows} rows
              </span>
            )}
          </button>

          <button
            id="tab-export-blueprints"
            onClick={() => setActiveTab('export')}
            className={`pb-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'export'
                ? 'border-purple-600 text-purple-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Export Blueprints
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
              {allBlueprints.length} total
            </span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* ============================================================ */}
          {/* IMPORT TAB                                                   */}
          {/* ============================================================ */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              
              {/* Success Notification Banner */}
              {importSuccessSummary && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-emerald-950">
                      {importSuccessSummary.total} Blueprints Successfully Processed!
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      ✓ {importSuccessSummary.created} created &bull; ✓ {importSuccessSummary.updated} updated &bull; {importSuccessSummary.deleted > 0 ? `✓ ${importSuccessSummary.deleted} deleted • ` : ''}0 errors. All Live Interview systems and Q&amp;A sets are in sync.
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        onClick={onClose}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Done &amp; View Library
                      </button>
                      <button
                        onClick={handleResetImport}
                        className="px-3 py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Upload Another CSV
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upload Dropzone & Actions Bar (When not viewing preview or can re-upload) */}
              {!validationResult && !importSuccessSummary && (
                <>
                  {/* Dropzone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-purple-500 bg-purple-50/50 scale-[0.99]'
                        : 'border-slate-300 hover:border-purple-400 bg-slate-50/50 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 mx-auto flex items-center justify-center mb-3">
                      <Upload className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">
                      Drop your CSV file here, or <span className="text-purple-600 underline">browse</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Supports CREATE, UPDATE, and DELETE operations across Custom Structure, STAR, CAR, and Problem &rarr; Decision &rarr; Impact frameworks.
                    </p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 text-2xs font-semibold">
                      <FileSpreadsheet className="w-3 h-3 text-slate-500" /> UTF-8 Standard RFC 4180 CSV
                    </div>
                  </div>

                  {/* Template & Helper Bar */}
                  <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <h5 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-purple-700" /> Need a starting point?
                      </h5>
                      <p className="text-2xs text-purple-800">
                        Download the human-friendly CSV template containing pre-filled examples with rich markdown formatting.
                      </p>
                    </div>
                    <button
                      id="btn-download-csv-template"
                      onClick={handleDownloadTemplate}
                      className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Download CSV Template
                    </button>
                  </div>
                </>
              )}

              {/* ============================================================ */}
              {/* IN-PRODUCT IMPORT & CSV FORMATTING GUIDE (Requirement 9)     */}
              {/* ============================================================ */}
              <div className="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(!isGuideOpen)}
                  className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/70 text-left flex items-center justify-between text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-purple-600" />
                    📘 Complete Blueprint Import &amp; CSV Formatting Guide
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 text-2xs font-normal">
                    {isGuideOpen ? 'Hide Guide' : 'Show Guide'}
                    {isGuideOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </span>
                </button>

                {isGuideOpen && (
                  <div className="p-4 border-t border-slate-200 space-y-4 text-xs text-slate-700 bg-white leading-relaxed">
                    {/* Summary Rules Pills */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
                        <span className="font-bold text-emerald-900 block text-2xs uppercase tracking-wider">
                          1. CREATE Operation
                        </span>
                        <p className="text-2xs text-emerald-800 mt-1">
                          Leave <code className="bg-white px-1 py-0.5 rounded border border-emerald-300 font-mono">blueprint_id</code> blank. Set <code className="font-bold">operation = CREATE</code>. A unique ID will be canonically assigned.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200">
                        <span className="font-bold text-blue-900 block text-2xs uppercase tracking-wider">
                          2. UPDATE Operation
                        </span>
                        <p className="text-2xs text-blue-800 mt-1">
                          Keep the exact <code className="bg-white px-1 py-0.5 rounded border border-blue-300 font-mono">blueprint_id</code> from export and set <code className="font-bold">operation = UPDATE</code>. Fields will patch cleanly.
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-red-50/70 border border-red-200">
                        <span className="font-bold text-red-900 block text-2xs uppercase tracking-wider">
                          3. DELETE Operation
                        </span>
                        <p className="text-2xs text-red-800 mt-1">
                          Provide the <code className="bg-white px-1 py-0.5 rounded border border-red-300 font-mono">blueprint_id</code> and set <code className="font-bold">operation = DELETE</code>. Other fields may be left blank.
                        </p>
                      </div>
                    </div>

                    {/* Canonical Schema Table */}
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                      <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 font-bold text-xs text-slate-800">
                        Canonical Blueprint CSV Columns (Single Source of Truth)
                      </div>
                      <div className="overflow-x-auto max-h-[320px]">
                        <table className="w-full text-left text-2xs">
                          <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200 sticky top-0">
                            <tr>
                              <th className="p-2.5">Field Header</th>
                              <th className="p-2.5">Required?</th>
                              <th className="p-2.5">What to Enter / Allowed Values</th>
                              <th className="p-2.5">Example</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {BLUEPRINT_CSV_FIELD_DEFINITIONS.map((field) => (
                              <tr key={field.field} className="hover:bg-slate-50/60">
                                <td className="p-2.5 font-mono font-bold text-purple-900">
                                  {field.header}
                                </td>
                                <td className="p-2.5">
                                  {field.required === true ? (
                                    <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-800 font-bold text-[10px]">
                                      Yes
                                    </span>
                                  ) : field.required === 'CONDITIONAL' ? (
                                    <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                                      For UPDATE/DELETE
                                    </span>
                                  ) : (
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                                      Optional
                                    </span>
                                  )}
                                </td>
                                <td className="p-2.5 text-slate-700">
                                  {field.description}
                                </td>
                                <td className="p-2.5 font-mono text-slate-500 text-[11px] max-w-xs truncate">
                                  {field.example}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Formatting & RFC 4180 Rules */}
                    <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200 text-2xs text-purple-950 space-y-1.5">
                      <span className="font-bold block text-xs text-purple-900">
                        Formatting &amp; Rich-Text Rules:
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-purple-900">
                        <li>
                          <strong>Rich Text in solution_impact:</strong> Full Markdown is supported! Use <code className="bg-white px-1 py-0.5 rounded border border-purple-200 font-mono">## Heading</code>, <code className="bg-white px-1 py-0.5 rounded border border-purple-200 font-mono">- Bullet points</code>, <code className="bg-white px-1 py-0.5 rounded border border-purple-200 font-mono">1. Numbered lists</code>, and <code className="bg-white px-1 py-0.5 rounded border border-purple-200 font-mono">**bold**</code>.
                        </li>
                        <li>
                          <strong>Multi-line Cells:</strong> When editing in Excel or Google Sheets, cell newlines (Alt+Enter) are preserved automatically inside quotes without splitting records.
                        </li>
                        <li>
                          <strong>Assigned Roles Separator:</strong> Separate multiple interviewer roles using a semicolon <code className="bg-white px-1 py-0.5 rounded border border-purple-200 font-mono font-bold">;</code> or pipe <code className="bg-white px-1 py-0.5 rounded border border-purple-200 font-mono font-bold">|</code> (e.g. <code className="font-mono">Engineering Lead;Technical Interviewer;Peer</code>).
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================================ */}
              {/* CSV VALIDATION & IMPORT PREVIEW                              */}
              {/* ============================================================ */}
              {validationResult && !importSuccessSummary && (
                <div className="space-y-4 pt-2 border-t border-slate-200 animate-in fade-in">
                  
                  {/* File status & Reset */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-slate-900 text-xs">{uploadedFileName}</span>
                      <span className="text-2xs text-slate-500">
                        ({validationResult.totalRows} rows parsed)
                      </span>
                    </div>
                    <button
                      onClick={handleResetImport}
                      className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" /> Choose Different File
                    </button>
                  </div>

                  {/* Global Errors if any */}
                  {validationResult.globalErrors.length > 0 && (
                    <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-900">
                        <XCircle className="w-4 h-4 text-red-600" /> CSV Structure Issue:
                      </div>
                      <ul className="list-disc list-inside text-xs text-red-800 space-y-0.5 pl-1">
                        {validationResult.globalErrors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Metrics Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-2xs font-bold uppercase tracking-wider text-emerald-800 block">
                        To Create
                      </span>
                      <span className="text-lg font-extrabold text-emerald-950">
                        {validationResult.createCount}
                      </span>
                      <span className="text-[11px] text-emerald-700 block mt-0.5">New blueprints</span>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
                      <span className="text-2xs font-bold uppercase tracking-wider text-blue-800 block">
                        To Update
                      </span>
                      <span className="text-lg font-extrabold text-blue-950">
                        {validationResult.updateCount}
                      </span>
                      <span className="text-[11px] text-blue-700 block mt-0.5">Existing IDs</span>
                    </div>

                    <div className="p-3 rounded-xl bg-red-50/80 border border-red-200">
                      <span className="text-2xs font-bold uppercase tracking-wider text-red-800 block">
                        To Delete
                      </span>
                      <span className="text-lg font-extrabold text-red-950">
                        {validationResult.deleteCount}
                      </span>
                      <span className="text-[11px] text-red-700 block mt-0.5">Permanent removal</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block">
                        Valid Rows
                      </span>
                      <span className="text-lg font-extrabold text-slate-800">
                        {validationResult.validCount}
                      </span>
                      <span className="text-[11px] text-slate-500 block mt-0.5">Ready to commit</span>
                    </div>

                    <div className={`p-3 rounded-xl border ${
                      validationResult.errorCount > 0 
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950' 
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      <span className={`text-2xs font-bold uppercase tracking-wider block ${
                        validationResult.errorCount > 0 ? 'text-amber-800' : 'text-slate-500'
                      }`}>
                        Errors
                      </span>
                      <span className="text-lg font-extrabold">
                        {validationResult.errorCount}
                      </span>
                      <span className={`text-[11px] block mt-0.5 ${
                        validationResult.errorCount > 0 ? 'text-amber-700' : 'text-slate-400'
                      }`}>
                        {validationResult.errorCount > 0 ? 'Requires attention' : 'No errors found'}
                      </span>
                    </div>
                  </div>

                  {/* Filter tabs for preview list */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-semibold">Show:</span>
                      <button
                        onClick={() => setPreviewFilter('all')}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                          previewFilter === 'all'
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        All ({validationResult.rows.length})
                      </button>
                      <button
                        onClick={() => setPreviewFilter('valid')}
                        className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                          previewFilter === 'valid'
                            ? 'bg-emerald-700 text-white'
                            : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        }`}
                      >
                        Valid ({validationResult.validCount})
                      </button>
                      {validationResult.deleteCount > 0 && (
                        <button
                          onClick={() => setPreviewFilter('delete')}
                          className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                            previewFilter === 'delete'
                              ? 'bg-red-700 text-white'
                              : 'bg-red-50 text-red-800 hover:bg-red-100'
                          }`}
                        >
                          Deletes ({validationResult.deleteCount})
                        </button>
                      )}
                      {validationResult.errorCount > 0 && (
                        <button
                          onClick={() => setPreviewFilter('error')}
                          className={`px-2.5 py-1 rounded-lg text-2xs font-bold transition-colors cursor-pointer ${
                            previewFilter === 'error'
                              ? 'bg-amber-700 text-white'
                              : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                          }`}
                        >
                          Errors ({validationResult.errorCount})
                        </button>
                      )}
                    </div>

                    <span className="text-2xs text-slate-400 font-medium">
                      Showing {displayedPreviewRows.length} rows
                    </span>
                  </div>

                  {/* Row Preview List */}
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {displayedPreviewRows.map((row) => (
                      <div
                        key={row.rowNumber}
                        className={`p-3.5 rounded-xl border transition-all text-xs ${
                          row.isValid
                            ? row.operation === 'CREATE'
                              ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-300'
                              : row.operation === 'DELETE'
                              ? 'bg-red-50/50 border-red-200/90 hover:border-red-300'
                              : 'bg-blue-50/40 border-blue-200/80 hover:border-blue-300'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                                Row {row.rowNumber}
                              </span>

                              {row.isValid ? (
                                row.operation === 'CREATE' ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                    <Check className="w-2.5 h-2.5" /> CREATE
                                  </span>
                                ) : row.operation === 'DELETE' ? (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                                    <Trash2 className="w-2.5 h-2.5" /> DELETE: {row.blueprint_id}
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                                    <RefreshCw className="w-2.5 h-2.5" /> UPDATE: {row.blueprint_id}
                                  </span>
                                )
                              ) : (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                                  <XCircle className="w-2.5 h-2.5" /> ERROR
                                </span>
                              )}

                              {row.operation !== 'DELETE' && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                                  {row.framework}
                                </span>
                              )}

                              {row.target_role_category && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] text-slate-600 bg-white border border-slate-200">
                                  {row.target_role_category}
                                </span>
                              )}
                            </div>

                            <h5 className="font-bold text-slate-900 text-xs pt-0.5">
                              {row.blueprint_title || (row.existingBlueprint ? row.existingBlueprint.title : <span className="italic text-slate-400">Untitled Blueprint</span>)}
                            </h5>

                            {row.interview_question && (
                              <p className="text-slate-600 text-2xs italic line-clamp-1">
                                "{row.interview_question}"
                              </p>
                            )}

                            {/* Assigned roles preview */}
                            {row.assigned_roles.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1 pt-1">
                                <span className="text-[10px] text-slate-400 font-medium">Assigned:</span>
                                {row.assigned_roles.map((r, i) => (
                                  <span key={i} className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-700">
                                    {r}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Delete warning preview */}
                            {row.operation === 'DELETE' && row.existingBlueprint && (
                              <div className="text-[11px] text-red-700 font-semibold pt-0.5">
                                ⚠ Will permanently delete "{row.existingBlueprint.title}" from library.
                              </div>
                            )}

                            {/* Update diff preview */}
                            {row.operation === 'UPDATE' && row.diffSummary && row.diffSummary.length > 0 && (
                              <div className="text-[10px] text-blue-900 pt-0.5 font-medium">
                                <span className="font-bold">Modified fields:</span> {row.diffSummary.join(', ')}
                              </div>
                            )}

                            {/* Errors breakdown */}
                            {row.errors.length > 0 && (
                              <div className="p-2 mt-1 rounded bg-red-100/70 border border-red-200 text-[11px] text-red-900 space-y-0.5">
                                {row.errors.map((err, i) => (
                                  <div key={i} className="flex items-center gap-1 font-medium">
                                    &bull; {err}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Commit Action Footer */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Ready to import {validationResult.validCount} valid record(s)?
                      </span>
                      {validationResult.errorCount > 0 && (
                        <span className="text-2xs text-amber-700 block">
                          Note: {validationResult.errorCount} row(s) with errors will be skipped.
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleResetImport}
                        className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>

                      <button
                        id="btn-confirm-import-blueprints"
                        onClick={handleCommitImport}
                        disabled={validationResult.validCount === 0 || isCommitting}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isCommitting ? 'Importing...' : `Import ${validationResult.validCount} Valid Blueprints`}
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* EXPORT TAB                                                   */}
          {/* ============================================================ */}
          {activeTab === 'export' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900 leading-relaxed">
                <span className="font-bold block mb-1">
                  💡 Bulk Edit Workflow via CSV Export:
                </span>
                Exporting downloads a clean RFC 4180 CSV containing canonical <code className="px-1 py-0.5 bg-white border rounded font-mono font-bold">blueprint_id</code> references. Open the file in Microsoft Excel, Google Sheets, or Apple Numbers, edit answers or interviewer roles, and upload it back via the <strong>Import</strong> tab to perform instant bulk updates with no duplicate records.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Card 1: Export Selected Blueprints */}
                <div className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                  selectedBlueprints.length > 0 
                    ? 'border-purple-300 bg-purple-50/30' 
                    : 'border-slate-200 bg-slate-50/40 opacity-75'
                }`}>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-200">
                        Selected Items
                      </span>
                      <span className="text-xs font-bold text-purple-900">
                        {selectedBlueprints.length} Selected
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      Export Selected Blueprints
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Exports only the blueprints you checked using checkboxes in the library view.
                    </p>

                    <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-2xs text-slate-600">
                      {selectedBlueprints.length > 0 ? (
                        <span className="text-purple-700 font-semibold">
                          ✓ Ready to export {selectedBlueprints.length} selected blueprint(s).
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">
                          No blueprints selected yet. Select cards using checkboxes in the library.
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    id="btn-export-selected-blueprints"
                    onClick={handleExportSelected}
                    disabled={selectedBlueprints.length === 0}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    <CheckSquare className="w-3.5 h-3.5" />
                    Export Selected ({selectedBlueprints.length})
                  </button>
                </div>

                {/* Card 2: Export Current Filter */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                        Current View Filter
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {filteredBlueprints.length} Records
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      Export Filtered Blueprints
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Exports blueprints currently matching your active search query, framework filter, and role selections.
                    </p>

                    {activeFilterDescription && (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-2xs text-slate-600">
                        <span className="font-bold text-slate-800">Criteria:</span> {activeFilterDescription}
                      </div>
                    )}
                  </div>

                  <button
                    id="btn-export-filtered-blueprints"
                    onClick={handleExportFiltered}
                    disabled={filteredBlueprints.length === 0}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Filtered ({filteredBlueprints.length})
                  </button>
                </div>

                {/* Card 3: Export All Library */}
                <div className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-purple-300 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                        Full Library
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {allBlueprints.length} Total
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">
                      Export All Canonical Blueprints
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed">
                      Exports the complete canonical Q&amp;A library across all categories, frameworks, and interviewer roles.
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-2xs text-slate-600">
                      Full text for all frameworks with canonical IDs for safe round-trip editing.
                    </div>
                  </div>

                  <button
                    id="btn-export-all-blueprints"
                    onClick={handleExportAll}
                    disabled={allBlueprints.length === 0}
                    className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export All ({allBlueprints.length})
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Single Source of Truth: Canonical Knowledge Service</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
