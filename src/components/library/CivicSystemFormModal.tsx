import React, { useState } from 'react';
import { 
  CivicSystemEntry, 
  CivicEntityType, 
  CivicSystemStatus,
  CIVIC_ENTITY_TYPE_CONFIG 
} from '../../features/knowledge/types/civicSystems';
import { X, Landmark, CheckCircle2, Globe, ShieldCheck, ArrowRight, FileText } from 'lucide-react';
import { CANONICAL_DOMAINS, CANONICAL_ROLES } from '../../data/jobTaxonomies';

interface CivicSystemFormModalProps {
  initialEntry?: CivicSystemEntry | null;
  onClose: () => void;
  onSave: (entry: CivicSystemEntry) => void;
}

export const CivicSystemFormModal: React.FC<CivicSystemFormModalProps> = ({
  initialEntry,
  onClose,
  onSave
}) => {
  const isEditing = !!initialEntry;
  const today = new Date().toISOString().split('T')[0];

  const [name, setName] = useState(initialEntry?.name || '');
  const [entityType, setEntityType] = useState<CivicEntityType>(initialEntry?.entityType || 'Digital Public Infrastructure');
  const [countryRegion, setCountryRegion] = useState(initialEntry?.countryRegion || 'Global / Multi-National');
  const [domain, setDomain] = useState(initialEntry?.domain || 'Digital Public Infrastructure & Government Services');
  const [missionPurpose, setMissionPurpose] = useState(initialEntry?.missionPurpose || '');
  const [problemAddressed, setProblemAddressed] = useState(initialEntry?.problemAddressed || '');
  const [targetPopulation, setTargetPopulation] = useState(initialEntry?.targetPopulation || 'Citizens & Businesses');
  const [operatingModel, setOperatingModel] = useState(initialEntry?.operatingModel || '');
  const [status, setStatus] = useState<CivicSystemStatus>(initialEntry?.status || 'Operational');
  const [versionEdition, setVersionEdition] = useState(initialEntry?.versionEdition || 'National Edition v2.0');
  const [fundingModel, setFundingModel] = useState(initialEntry?.fundingProcurementModel || 'Public Appropriations & Central Bank / Treasury Budget');
  
  // URLs & Sources
  const [officialWebsite, setOfficialWebsite] = useState(initialEntry?.officialWebsite || '');
  const [sourceUrl, setSourceUrl] = useState(initialEntry?.sourceUrl || '');
  const [sourceName, setSourceName] = useState(initialEntry?.sourceName || 'Official Public Gazette / Architecture Spec');
  const [sourceType, setSourceType] = useState(initialEntry?.sourceType || 'Government Standard');
  const [dateObserved, setDateObserved] = useState(initialEntry?.dateObserved || today);
  const [referenceLinksText, setReferenceLinksText] = useState((initialEntry?.referenceLinks || []).join('\n'));

  // Lists (multi-line)
  const [keyProgramsText, setKeyProgramsText] = useState((initialEntry?.keyPrograms || ['National Deployment', 'Ecosystem Integration']).join('\n'));
  const [digitalCapabilitiesText, setDigitalCapabilitiesText] = useState((initialEntry?.digitalCapabilities || ['Open API Gateway', 'Zero-Knowledge ID Verification']).join('\n'));
  const [impactAreasText, setImpactAreasText] = useState((initialEntry?.impactAreas || ['Financial Inclusion', 'Government Efficiency']).join('\n'));
  const [toolsPlatformsText, setToolsPlatformsText] = useState((initialEntry?.relatedToolsPlatforms || ['Kubernetes', 'PostgreSQL', 'HSM Cryptography']).join(', '));
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialEntry?.relevantRoles || ['Security & Systems', 'Software Engineering']);

  // Workflow Summary
  const [howItWorks, setHowItWorks] = useState(initialEntry?.systemWorkflowSummary?.howItWorks || '');
  const [governance, setGovernance] = useState(initialEntry?.systemWorkflowSummary?.governanceAndCompliance || '');
  const [citizenJourney, setCitizenJourney] = useState(initialEntry?.systemWorkflowSummary?.citizenJourney || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const entry: CivicSystemEntry = {
      id: initialEntry?.id || `civic-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      entityType,
      countryRegion: countryRegion.trim() || 'Global',
      domain: domain.trim(),
      missionPurpose: missionPurpose.trim() || 'Provide accessible and transparent public infrastructure.',
      problemAddressed: problemAddressed.trim() || 'Fragmented and inaccessible government services.',
      targetPopulation: targetPopulation.trim() || 'Citizens',
      operatingModel: operatingModel.trim() || 'Public-private partnership with open standards.',
      keyPrograms: keyProgramsText.split('\n').map(s => s.trim()).filter(Boolean),
      services: initialEntry?.services || [
        { name: 'Core Service Interface', description: 'Universal citizen portal and programmatic access.' }
      ],
      technologyInfrastructure: initialEntry?.technologyInfrastructure || [
        { name: 'Secure API Gateway', role: 'Federated identity and transaction routing' }
      ],
      digitalCapabilities: digitalCapabilitiesText.split('\n').map(s => s.trim()).filter(Boolean),
      fundingProcurementModel: fundingModel.trim(),
      stakeholders: initialEntry?.stakeholders || [
        { group: 'Government Ministries', role: 'Regulatory oversight' }
      ],
      partners: initialEntry?.partners || [
        { name: 'National Telecommunications', type: 'Public Utility', role: 'Connectivity' }
      ],
      impactAreas: impactAreasText.split('\n').map(s => s.trim()).filter(Boolean),
      relevantRoles: selectedRoles.length > 0 ? selectedRoles : ['Software Engineering'],
      relatedSkills: initialEntry?.relatedSkills || [
        { name: 'Digital Public Infrastructure Architecture', category: 'Public Sector Tech', proficiency: 'Expert' }
      ],
      relatedToolsPlatforms: toolsPlatformsText.split(',').map(s => s.trim()).filter(Boolean),
      relatedInnovation: initialEntry?.relatedInnovation || ['Open Source DPI Protocol'],
      knowledgeSources: initialEntry?.knowledgeSources || [
        { title: sourceName || 'System Architecture Whitepaper', type: 'Architecture Spec', url: sourceUrl }
      ],
      officialWebsite: officialWebsite.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      referenceLinks: referenceLinksText.split('\n').map(s => s.trim()).filter(Boolean),
      sourceName: sourceName.trim() || undefined,
      sourceType: sourceType.trim() || undefined,
      dateObserved: dateObserved.trim() || today,
      dateTime: today,
      status,
      versionEdition: versionEdition.trim() || undefined,
      isArchived: initialEntry?.isArchived || false,
      systemRelationships: initialEntry?.systemRelationships || {
        modelType: 'government_service_delivery',
        flowTitle: 'Standard Public Service Delivery Chain',
        nodes: [
          { stageLabel: 'Mandate', title: 'Public Law', description: 'Legislative charter', colorClass: 'border-blue-300' },
          { stageLabel: 'Platform', title: 'Core DPI Platform', description: 'National digital exchange', colorClass: 'border-purple-300' },
          { stageLabel: 'Beneficiary', title: 'Citizens & Residents', description: 'Equitable direct delivery', colorClass: 'border-emerald-300' }
        ]
      },
      systemWorkflowSummary: {
        howItWorks: howItWorks.trim() || 'Centralized coordination with decentralized service delivery.',
        governanceAndCompliance: governance.trim() || 'Governed under national public procurement rules.',
        citizenJourney: citizenJourney.trim() || 'Seamless zero-paper digital self-service.'
      }
    };

    onSave(entry);
  };

  const entityTypes = Object.keys(CIVIC_ENTITY_TYPE_CONFIG) as CivicEntityType[];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shadow-xs">
                <Landmark className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isEditing ? `Edit Civic System: ${initialEntry.name}` : 'Add Public Sector & Civic System'}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              Captures how public institutions, DPI platforms, and civic systems operate with concrete technology and governance models.
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
              <label className="text-xs font-bold text-slate-700">System / Organization Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Unified Payments Interface (UPI), Aadhaar, NHS Digital"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Entity Type *</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value as CivicEntityType)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {entityTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Country / Region *</label>
              <input
                type="text"
                required
                value={countryRegion}
                onChange={(e) => setCountryRegion(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. India, Estonia, United States, Global"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Operating Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as CivicSystemStatus)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Nationwide Scaled">Nationwide Scaled</option>
                <option value="Operational">Operational</option>
                <option value="Active Program">Active Program</option>
                <option value="Global Standard">Global Standard</option>
                <option value="Piloting / Expanding">Piloting / Expanding</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Version / Edition</label>
              <input
                type="text"
                value={versionEdition}
                onChange={(e) => setVersionEdition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono"
                placeholder="e.g. UPI 2.0 / FedNow 2026"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Domain / Focus Area</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                placeholder="e.g. Digital Public Infrastructure & Real-Time Payments"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Mission & Purpose *</label>
              <textarea
                required
                rows={2}
                value={missionPurpose}
                onChange={(e) => setMissionPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                placeholder="Core mission and public value delivered..."
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Problem Addressed</label>
              <textarea
                rows={2}
                value={problemAddressed}
                onChange={(e) => setProblemAddressed(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                placeholder="What failure or gap in the public or social system does this solve?"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700">Operating Model & How It Works</label>
              <textarea
                rows={3}
                value={operatingModel}
                onChange={(e) => setOperatingModel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 leading-relaxed"
                placeholder="Explain the operating mechanism, multi-tiered institutional structure, and delivery model..."
              />
            </div>
          </div>

          {/* Sources and URLs Section */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-600" />
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
                <label className="font-bold text-slate-600">Primary Source / Documentation URL</label>
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
                  placeholder="e.g. Ministry Architecture Spec"
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

          {/* Roles Alignment */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700">Career OS Role Alignment</label>
            <div className="flex flex-wrap gap-1.5">
              {CANONICAL_ROLES.map(role => {
                const isSelected = selectedRoles.includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setSelectedRoles(selectedRoles.filter(r => r !== role));
                      } else {
                        setSelectedRoles([...selectedRoles, role]);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
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
              className="px-6 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Civic System'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
