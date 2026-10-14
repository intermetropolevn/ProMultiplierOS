import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Activity, 
  Lock, 
  RefreshCw,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  Database
} from 'lucide-react';
import { 
  KnowledgeSourceType, 
  ContentAccessMode, 
  KnowledgeUnit 
} from '../../features/knowledge/types';
import { 
  knowledgePipeline, 
  StagedKnowledgeItem, 
  PipelineStage, 
  PipelineExecutionLog 
} from '../../features/admin/services/knowledgeAcquisitionPipeline';
import { validateUrlForSSRF } from '../../features/admin/services/sanitizer';

interface KnowledgePipelineRunnerViewProps {
  onUnitPublished?: (unit: KnowledgeUnit) => void;
}

export const KnowledgePipelineRunnerView: React.FC<KnowledgePipelineRunnerViewProps> = ({
  onUnitPublished
}) => {
  const [stagedItems, setStagedItems] = useState<StagedKnowledgeItem[]>(knowledgePipeline.getStagedItems());
  const [selectedStagedItem, setSelectedStagedItem] = useState<StagedKnowledgeItem | null>(stagedItems[0] || null);

  // Form inputs
  const [targetTitle, setTargetTitle] = useState('User Stories Applied');
  const [sourceType, setSourceType] = useState<KnowledgeSourceType>('book');
  const [targetUrl, setTargetUrl] = useState('https://www.mountaingoatsoftware.com/agile/user-stories');
  const [isRunning, setIsRunning] = useState(false);
  const [currentLogs, setCurrentLogs] = useState<PipelineExecutionLog[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  // Pre-fill quick samples
  const samplePresets = [
    { title: 'The Scrum Guide (2020)', type: 'official_guide' as KnowledgeSourceType, url: 'https://scrumguides.org/scrum-guide.html' },
    { title: 'The Professional Scrum Product Owner', type: 'book' as KnowledgeSourceType, url: 'https://www.scrum.org/resources/professional-scrum-product-owner-book' },
    { title: 'In Search of an Understandable Consensus Algorithm (Raft)', type: 'academic_paper' as KnowledgeSourceType, url: 'https://raft.github.io/raft.pdf' },
    { title: 'Dynamo: Amazon Key-Value Store', type: 'academic_paper' as KnowledgeSourceType, url: 'https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf' },
    { title: 'Good Product Manager / Bad Product Manager', type: 'essay' as KnowledgeSourceType, url: 'https://a16z.com/good-product-manager-bad-product-manager/' }
  ];

  const pipelineStages: { id: PipelineStage; label: string; description: string }[] = [
    { id: 'SOURCE_REGISTERED', label: '1. Source Registered', description: 'Initialize target credentials and metadata.' },
    { id: 'DISCOVERY', label: '2. Discovery & SSRF Check', description: 'Discover endpoints and validate against IP shield.' },
    { id: 'ACCESS_POLICY_CHECK', label: '3. Access Policy & Copyright Check', description: 'Enforce CONCEPT_ONLY mode if book is copyrighted.' },
    { id: 'CONTENT_ACQUISITION', label: '4. Content Acquisition', description: 'Fetch public author articles, official essays, and talks.' },
    { id: 'EXTRACTION', label: '5. Text Extraction', description: 'Sanitize HTML, filter boilerplate, extract key text.' },
    { id: 'CONCEPT_EXTRACTION', label: '6. Concept Extraction', description: 'Isolate definitions, principles, frameworks, and metrics.' },
    { id: 'ONTOLOGY_MAPPING', label: '7. Career OS Ontology Mapping', description: 'Map concepts to target roles and skills taxonomy.' },
    { id: 'CITATION_PROVENANCE', label: '8. Citation & Provenance', description: 'Construct academic citations and legal provenance ledger.' },
    { id: 'KNOWLEDGE_STAGING', label: '9. Knowledge Staging', description: 'Place extracted unit into administrative review queue.' },
    { id: 'ADMIN_REVIEW', label: '10. Admin Verification', description: 'Review concept vs synthesis boundary before publishing.' },
    { id: 'PUBLISHED_TO_CAREEROS', label: '11. Published to Career OS', description: 'Integrated into live candidate evaluation ontology.' }
  ];

  const handleLaunchPipeline = async () => {
    if (!targetTitle.trim()) return;

    setIsRunning(true);
    setCurrentLogs([]);
    setActiveStepIndex(0);

    try {
      const item = await knowledgePipeline.runAcquisitionPipeline(
        targetTitle,
        sourceType,
        targetUrl,
        (log) => {
          setCurrentLogs(prev => [...prev, log]);
          const idx = pipelineStages.findIndex(s => s.id === log.stage);
          if (idx >= 0) {
            setActiveStepIndex(idx);
          }
        }
      );

      setStagedItems(knowledgePipeline.getStagedItems());
      setSelectedStagedItem(item);
    } catch (err: any) {
      setCurrentLogs(prev => [
        ...prev,
        {
          timestamp: new Date().toISOString(),
          stage: 'ACCESS_POLICY_CHECK',
          message: `Pipeline halted: ${err.message}`,
          level: 'security'
        }
      ]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleApprove = (id: string) => {
    const updated = knowledgePipeline.approveStagedItem(id);
    if (updated) {
      setStagedItems(knowledgePipeline.getStagedItems());
      setSelectedStagedItem({ ...updated });
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt('Specify rejection reason:');
    if (reason) {
      const updated = knowledgePipeline.rejectStagedItem(id, reason);
      if (updated) {
        setStagedItems(knowledgePipeline.getStagedItems());
        setSelectedStagedItem({ ...updated });
      }
    }
  };

  const handlePublish = (id: string) => {
    const published = knowledgePipeline.publishStagedItem(id);
    if (published) {
      setStagedItems(knowledgePipeline.getStagedItems());
      const item = knowledgePipeline.getStagedItemById(id);
      if (item) setSelectedStagedItem({ ...item });
      if (onUnitPublished) onUnitPublished(published);
    }
  };

  const urlSSRF = targetUrl ? validateUrlForSSRF(targetUrl) : { allowed: true };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[11px] font-bold uppercase tracking-wider">
              Autonomous Ingestion Engine
            </span>
            <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[11px] font-bold">
              SSRF & Copyright Hardened
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Knowledge Acquisition Pipeline Runner
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
            Execute the 11-stage acquisition pipeline from source registration through copyright policy check, concept synthesis, and administrative sign-off into the Career OS Knowledge Graph.
          </p>
        </div>
      </div>

      {/* Interactive Form & Presets */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900">
            Initiate Knowledge Acquisition
          </h3>
          <span className="text-xs text-slate-400">
            Select a verified preset or configure target
          </span>
        </div>

        {/* Quick presets */}
        <div className="flex flex-wrap gap-2">
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTargetTitle(preset.title);
                setSourceType(preset.type);
                setTargetUrl(preset.url);
              }}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              {preset.title}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
          
          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value as KnowledgeSourceType)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-medium"
            >
              <option value="book">Book (Enforces Concept-Only Mode)</option>
              <option value="official_guide">Official Guide (Open Access)</option>
              <option value="academic_paper">Academic Paper (Peer-Reviewed)</option>
              <option value="research">Research Whitepaper</option>
              <option value="article">Industry Article</option>
              <option value="essay">Author Essay</option>
              <option value="documentation">Official Documentation</option>
            </select>
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Target Title / Concept</label>
            <input
              type="text"
              value={targetTitle}
              onChange={(e) => setTargetTitle(e.target.value)}
              placeholder="e.g. Inspired or The Scrum Guide"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
          </div>

          <div className="sm:col-span-4 space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Canonical / Reference URL</label>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-medium"
            />
          </div>

        </div>

        {/* SSRF Shield Status */}
        {targetUrl && (
          <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
            urlSSRF.allowed 
              ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800'
              : 'bg-red-50/50 border-red-200 text-red-800'
          }`}>
            {urlSSRF.allowed ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>SSRF Shield:</strong> URL allowed. External public domain validated.</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span><strong>SSRF Block:</strong> {urlSSRF.reason}</span>
              </>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleLaunchPipeline}
            disabled={isRunning || !urlSSRF.allowed}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Run Knowledge Pipeline</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual Pipeline Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          11-Stage Pipeline Architecture
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {pipelineStages.slice(0, 6).map((stage, idx) => {
            const isCompleted = activeStepIndex > idx;
            const isCurrent = activeStepIndex === idx;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-500 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/70 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500">
                    Step {idx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {isCurrent && <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />}
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {stage.label.split('. ')[1]}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          {pipelineStages.slice(6).map((stage, idx) => {
            const actualIdx = idx + 6;
            const isCompleted = activeStepIndex > actualIdx;
            const isCurrent = activeStepIndex === actualIdx;

            return (
              <div
                key={stage.id}
                className={`p-3 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50 border-blue-500 shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-50/60 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/70 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500">
                    Step {actualIdx + 1}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  {isCurrent && <Activity className="w-3.5 h-3.5 text-blue-600 animate-pulse" />}
                </div>
                <div className="text-xs font-bold text-slate-900 leading-snug">
                  {stage.label.split('. ')[1]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Logs or Review Queue Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Staging Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Staged for Admin Review ({stagedItems.length})
            </h4>
            <span className="text-xs font-bold text-amber-600">
              {stagedItems.filter(i => i.status === 'staged').length} Pending
            </span>
          </div>

          {stagedItems.map(item => {
            const isSelected = selectedStagedItem?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedStagedItem(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.2 bg-slate-100 text-slate-700 rounded text-[10px] font-bold uppercase">
                        {item.sourceType}
                      </span>
                      <span className={`px-2 py-0.2 rounded text-[10px] font-extrabold uppercase ${
                        item.status === 'staged' ? 'bg-amber-100 text-amber-800' :
                        item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                        item.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 leading-snug">
                      {item.extractedUnit.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      From: {item.sourceTitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span>{item.extractedUnit.domain}</span>
                  <span className="font-bold text-emerald-600">
                    {Math.round(item.extractedUnit.confidence * 100)}% Conf
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Item Review & Publish Drawer */}
        <div className="lg:col-span-7">
          {selectedStagedItem ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5 sticky top-6">
              
              <div className="border-b border-slate-100 pb-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">
                    Review Staged Knowledge Unit
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Access Mode: <strong>{selectedStagedItem.accessMode}</strong>
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-900 leading-tight">
                  {selectedStagedItem.extractedUnit.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Origin Source: <strong>{selectedStagedItem.sourceTitle}</strong>
                </p>
              </div>

              {/* Legal Check Notice */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Administrative Verification Checklist</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Verify that the source definition is distinct from Career OS synthesis and no copyrighted full-text is reproduced verbatim beyond statutory fair use quotations.
                </p>
              </div>

              {/* Side-by-side definition inspection */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <span className="font-bold text-slate-700 block">Extracted Source Definition:</span>
                  <p className="text-slate-900">{selectedStagedItem.extractedUnit.officialDefinition}</p>
                </div>

                <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs space-y-1">
                  <span className="font-bold text-purple-800 block">Career OS Applied Interpretation:</span>
                  <p className="text-purple-950">{selectedStagedItem.extractedUnit.careerosInterpretation}</p>
                </div>
              </div>

              {/* Citations Preview */}
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Attached Citations ({selectedStagedItem.extractedUnit.sources.length})
                </span>
                {selectedStagedItem.extractedUnit.sources.map((cit, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-0.5">
                    <span className="font-bold text-slate-900 block">{cit.title}</span>
                    <span className="text-[11px] text-slate-500">{cit.author} • {cit.location}</span>
                    <blockquote className="text-[11px] text-slate-600 italic">"{cit.citationText}"</blockquote>
                  </div>
                ))}
              </div>

              {/* Review & Publish Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleReject(selectedStagedItem.id)}
                    className="px-3.5 py-2 border border-red-200 text-red-700 hover:bg-red-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Reject Item
                  </button>
                  <button
                    onClick={() => handleApprove(selectedStagedItem.id)}
                    className="px-3.5 py-2 border border-blue-200 text-blue-700 hover:bg-blue-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Approve Staging
                  </button>
                </div>

                <button
                  onClick={() => handlePublish(selectedStagedItem.id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish to Knowledge Graph</span>
                </button>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              Select an item from the staging queue to inspect and verify
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
