import React, { useState } from 'react';
import { 
  InnovationSystemEntry, 
  InnovationType, 
  TransformationDimension, 
  InnovationStage, 
  InnovationStatus,
  INNOVATION_TYPE_CONFIG,
  TRANSFORMATION_DIMENSION_CONFIG 
} from '../../features/knowledge/types/innovationSystems';
import { X, Sparkles, CheckCircle2, Globe, FileText, Layers, Rocket } from 'lucide-react';
import { CANONICAL_DOMAINS, CANONICAL_ROLES } from '../../data/jobTaxonomies';

interface InnovationSystemFormModalProps {
  initialEntry?: InnovationSystemEntry | null;
  onClose: () => void;
  onSave: (entry: InnovationSystemEntry) => void;
}

export const InnovationSystemFormModal: React.FC<InnovationSystemFormModalProps> = ({
  initialEntry,
  onClose,
  onSave
}) => {
  const isEditing = !!initialEntry;
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState(initialEntry?.name || '');
  const [shortDescription, setShortDescription] = useState(initialEntry?.shortDescription || '');
  const [innovationType, setInnovationType] = useState<InnovationType>(initialEntry?.innovationType || 'AI-native Product');
  const [domain, setDomain] = useState(initialEntry?.domain || 'Artificial Intelligence & Systems Engineering');
  const [industry, setIndustry] = useState(initialEntry?.industry || 'Software & Tech');
  const [problemSolved, setProblemSolved] = useState(initialEntry?.problemSolved || '');
  const [existingAlternative, setExistingAlternative] = useState(initialEntry?.existingAlternative || '');
  const [coreInnovation, setCoreInnovation] = useState(initialEntry?.coreInnovation || '');
  const [howItWorks, setHowItWorks] = useState(initialEntry?.howItWorks || '');
  const [productSystemArchitecture, setProductSystemArchitecture] = useState(initialEntry?.productSystemArchitecture || '');
  const [keyTechnologiesText, setKeyTechnologiesText] = useState((initialEntry?.keyTechnologies || ['CRDT', 'Local-First DB', 'WebAssembly']).join(', '));
  const [userExperience, setUserExperience] = useState(initialEntry?.userExperience || 'Sub-millisecond instant UI with zero spinner delay.');
  const [businessModel, setBusinessModel] = useState(initialEntry?.businessModel || 'Open Core SaaS / Hosted Cloud Sync');
  const [distributionModel, setDistributionModel] = useState(initialEntry?.distributionModel || 'Product-Led Growth & Open Source Community');
  const [differentiation, setDifferentiation] = useState(initialEntry?.differentiation || '');
  const [transformativePotential, setTransformativePotential] = useState(initialEntry?.transformativePotential || '');
  const [currentStage, setCurrentStage] = useState<InnovationStage>(initialEntry?.currentStage || 'Production / Scaling');
  const [status, setStatus] = useState<InnovationStatus>(initialEntry?.status || 'Active');
  const [targetUsers, setTargetUsers] = useState(initialEntry?.targetUsers || 'Software Engineers and Modern Tech Teams');
  const [versionRelease, setVersionRelease] = useState(initialEntry?.versionRelease || 'v2.0 (2026)');

  // Selected Dimensions
  const [selectedDimensions, setSelectedDimensions] = useState<TransformationDimension[]>(
    initialEntry?.transformationDimensions || ['Workflow Transformation', 'User Experience Transformation']
  );

  // URLs & Sources
  const [officialWebsite, setOfficialWebsite] = useState(initialEntry?.officialWebsite || '');
  const [sourceUrl, setSourceUrl] = useState(initialEntry?.sourceUrl || '');
  const [sourceName, setSourceName] = useState(initialEntry?.sourceName || 'Foundational Research Paper / Architecture Post');
  const [sourceType, setSourceType] = useState(initialEntry?.sourceType || 'Technical Specification');
  const [dateObserved, setDateObserved] = useState(initialEntry?.dateObserved || today);
  const [referenceLinksText, setReferenceLinksText] = useState((initialEntry?.referenceLinks || []).join('\n'));

  // Career OS Links
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialEntry?.relevantRoles || ['Software Engineering', 'Product Management']);
  const [relatedToolsText, setRelatedToolsText] = useState((initialEntry?.relatedToolsPlatforms || ['Linear', 'SQLite']).join(', '));
  const [relatedPathwaysText, setRelatedPathwaysText] = useState((initialEntry?.relatedWorkPathways || ['Feature Delivery & Production Engineering Lifecycle']).join(', '));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const entry: InnovationSystemEntry = {
      id: initialEntry?.id || `inno-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      shortDescription: shortDescription.trim() || 'Transformative breakthrough system.',
      innovationType,
      domain: domain.trim(),
      industry: industry.trim(),
      problemSolved: problemSolved.trim() || 'Inefficient legacy paradigms.',
      existingAlternative: existingAlternative.trim() || 'Traditional centralized approaches.',
      coreInnovation: coreInnovation.trim() || 'Breakthrough decentralized architecture.',
      howItWorks: howItWorks.trim() || 'Combines local-first computation with distributed delta synchronization.',
      productSystemArchitecture: productSystemArchitecture.trim() || 'Client-side reactive runtime with edge messaging hub.',
      keyTechnologies: keyTechnologiesText.split(',').map(s => s.trim()).filter(Boolean),
      userExperience: userExperience.trim(),
      businessModel: businessModel.trim(),
      distributionModel: distributionModel.trim(),
      differentiation: differentiation.trim() || 'Radical reduction in latency and operational overhead.',
      transformativePotential: transformativePotential.trim() || 'Redefines the category standards across industry workflows.',
      transformationDimensions: selectedDimensions.length > 0 ? selectedDimensions : ['Workflow Transformation'],
      currentStage,
      targetUsers: targetUsers.trim(),
      relevantRoles: selectedRoles.length > 0 ? selectedRoles : ['Software Engineering'],
      relatedSkills: initialEntry?.relatedSkills || [
        { name: `${innovationType} Architecture`, category: 'Transformative Technology', proficiency: 'Expert' }
      ],
      relatedToolsPlatforms: relatedToolsText.split(',').map(s => s.trim()).filter(Boolean),
      relatedWorkPathways: relatedPathwaysText.split(',').map(s => s.trim()).filter(Boolean),
      relatedOrganizations: initialEntry?.relatedOrganizations || ['Open Source Foundation'],
      relatedKnowledgeSources: initialEntry?.relatedKnowledgeSources || [
        { title: sourceName || 'Innovation Research Paper', type: 'Paper', url: sourceUrl }
      ],
      officialWebsite: officialWebsite.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      referenceLinks: referenceLinksText.split('\n').map(s => s.trim()).filter(Boolean),
      sourceName: sourceName.trim() || undefined,
      sourceType: sourceType.trim() || undefined,
      dateObserved: dateObserved.trim() || today,
      versionRelease: versionRelease.trim() || undefined,
      status,
      isArchived: initialEntry?.isArchived || false
    };

    onSave(entry);
  };

  const typesList = Object.keys(INNOVATION_TYPE_CONFIG) as InnovationType[];
  const dimensionsList = Object.keys(TRANSFORMATION_DIMENSION_CONFIG) as TransformationDimension[];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-700 text-white flex items-center justify-center shadow-xs">
                <Rocket className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isEditing ? `Edit Innovation: ${initialEntry.name}` : 'Add Innovation & Transformative System'}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Captures structured breakthrough concepts, transformative platforms, novel business models, and system-level innovations.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Innovation Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. Local-First Software Architecture & CRDT Data Layer"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Short Description *</label>
              <textarea
                required
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                placeholder="Core definition and high-level summary..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Innovation Type *</label>
              <select
                value={innovationType}
                onChange={(e) => setInnovationType(e.target.value as InnovationType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
              >
                {typesList.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Current Stage</label>
              <select
                value={currentStage}
                onChange={(e) => setCurrentStage(e.target.value as InnovationStage)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Concept / Speculative">Concept / Speculative</option>
                <option value="Prototype / Early Access">Prototype / Early Access</option>
                <option value="Production / Scaling">Production / Scaling</option>
                <option value="Mature / Category Leader">Mature / Category Leader</option>
                <option value="Open Protocol / Ecosystem">Open Protocol / Ecosystem</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Version / Release</label>
              <input
                type="text"
                value={versionRelease}
                onChange={(e) => setVersionRelease(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Core Innovation *</label>
              <textarea
                required
                rows={2}
                value={coreInnovation}
                onChange={(e) => setCoreInnovation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                placeholder="What is the breakthrough mechanism that changes the status quo?"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">How It Works & Architecture</label>
              <textarea
                rows={3}
                value={howItWorks}
                onChange={(e) => setHowItWorks(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                placeholder="Technical architecture, data flow, and underlying operating mechanics..."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Problem Solved vs. Existing Alternative</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <textarea
                  rows={2}
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="Problem being solved..."
                />
                <textarea
                  rows={2}
                  value={existingAlternative}
                  onChange={(e) => setExistingAlternative(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  placeholder="Existing alternative / traditional approach..."
                />
              </div>
            </div>
          </div>

          {/* Transformation Dimensions Multi-Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Transformation Dimensions</label>
            <div className="flex flex-wrap gap-1.5">
              {dimensionsList.map(dim => {
                const isSelected = selectedDimensions.includes(dim);
                return (
                  <button
                    key={dim}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedDimensions(selectedDimensions.filter(d => d !== dim));
                      } else {
                        setSelectedDimensions([...selectedDimensions, dim]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-700 text-white border-purple-700 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {dim}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source URLs & Attribution */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>Source URL & Reference Verification</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-600">Official Website URL</label>
                <input
                  type="url"
                  value={officialWebsite}
                  onChange={(e) => setOfficialWebsite(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Source URL / Research Paper</label>
                <input
                  type="url"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Source Name</label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. arXiv Research Paper"
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-600">Date Observed</label>
                <input
                  type="date"
                  value={dateObserved}
                  onChange={(e) => setDateObserved(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="font-bold text-slate-600">Reference Links (One per line)</label>
                <textarea
                  rows={2}
                  value={referenceLinksText}
                  onChange={(e) => setReferenceLinksText(e.target.value)}
                  placeholder="https://...&#10;https://..."
                  className="w-full px-3 py-1.5 rounded-xl border border-slate-200 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 -mx-6 -mb-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Innovation System'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
