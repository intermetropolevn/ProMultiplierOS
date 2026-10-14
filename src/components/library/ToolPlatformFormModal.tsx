import React, { useState } from 'react';
import { 
  ToolPlatformEntry, 
  ToolCategory, 
  ToolPricingModel, 
  ToolHostingType,
  ToolVersionStatus,
  IngestionSourceState,
  TOOL_CATEGORIES_LIST,
  TOOL_VERSION_STATUS_CONFIG
} from '../../features/knowledge/types/toolsPlatforms';
import { analyzeToolPlatformUrl } from '../../features/knowledge/services/smartUrlAnalyzer';
import { 
  X, 
  Sparkles, 
  Wrench, 
  Globe, 
  CheckCircle2, 
  History, 
  ExternalLink,
  Layers,
  Database,
  Cable,
  Users,
  Compass,
  FileText
} from 'lucide-react';
import { CANONICAL_ROLES, CANONICAL_DOMAINS } from '../../data/jobTaxonomies';

interface ToolPlatformFormModalProps {
  initialTool?: ToolPlatformEntry | null;
  onClose: () => void;
  onSave: (tool: ToolPlatformEntry, preserveHistory: boolean) => void;
}

export const ToolPlatformFormModal: React.FC<ToolPlatformFormModalProps> = ({
  initialTool,
  onClose,
  onSave
}) => {
  const isEditing = !!initialTool;
  const today = new Date().toISOString().split('T')[0];

  // Smart URL Import State
  const [pasteUrl, setPasteUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeSuccess, setAnalyzeSuccess] = useState(false);

  // Form Fields
  const [name, setName] = useState(initialTool?.name || '');
  const [companyProvider, setCompanyProvider] = useState(initialTool?.companyProvider || '');
  const [tagline, setTagline] = useState(initialTool?.tagline || '');
  const [category, setCategory] = useState<ToolCategory>(initialTool?.category || 'Developer Tools');
  const [subcategory, setSubcategory] = useState(initialTool?.subcategory || '');
  const [primaryDomain, setPrimaryDomain] = useState(initialTool?.primaryDomain || CANONICAL_DOMAINS[0] || 'Software Engineering');
  const [targetUsers, setTargetUsers] = useState(initialTool?.targetUsers || '');
  const [pricingModel, setPricingModel] = useState<ToolPricingModel>(initialTool?.pricingModel || 'Freemium');
  
  // URLs & Sources
  const [officialWebsite, setOfficialWebsite] = useState(initialTool?.officialWebsite || '');
  const [productUrl, setProductUrl] = useState(initialTool?.productUrl || '');
  const [sourceUrl, setSourceUrl] = useState(initialTool?.sourceUrl || '');
  const [sourceName, setSourceName] = useState(initialTool?.sourceName || '');
  const [sourceType, setSourceType] = useState(initialTool?.sourceType || 'Official Documentation');
  const [referenceLinksText, setReferenceLinksText] = useState((initialTool?.referenceLinks || []).join('\n'));

  // Version & Temporal Data
  const [version, setVersion] = useState(initialTool?.version || '1.0.0');
  const [releaseDate, setReleaseDate] = useState(initialTool?.releaseDate || today);
  const [observedDate, setObservedDate] = useState(initialTool?.observedDate || today);
  const [lastVerified, setLastVerified] = useState(initialTool?.lastVerified || today);
  const [dataSourceDate, setDataSourceDate] = useState(initialTool?.dataSourceDate || today);
  const [status, setStatus] = useState<ToolVersionStatus>(initialTool?.status || 'Current');
  const [preserveHistory, setPreserveHistory] = useState(true);

  // Ingestion Source State
  const [sourceState, setSourceState] = useState<IngestionSourceState>(initialTool?.sourceState || 'User Edited');

  // Capability Summary
  const [keyCapacitiesText, setKeyCapacitiesText] = useState(
    (initialTool?.capabilitiesSummary.keyCapacities || [
      'Core high-performance execution engine',
      'Automated synchronization and cloud integration'
    ]).join('\n')
  );
  const [howItWorks, setHowItWorks] = useState(initialTool?.capabilitiesSummary.howItWorks || '');
  const [productPhilosophy, setProductPhilosophy] = useState(initialTool?.capabilitiesSummary.productPhilosophy || '');
  
  // Usage & Storage
  const [usageModel, setUsageModel] = useState(initialTool?.capabilitiesSummary.usageAndStorage.usageModel || 'Subscription monthly / annual');
  const [storageModel, setStorageModel] = useState(initialTool?.capabilitiesSummary.usageAndStorage.storageModel || 'Cloud relational & document store');
  const [dataModel, setDataModel] = useState(initialTool?.capabilitiesSummary.usageAndStorage.dataModel || 'Relational entities and JSON payloads');
  const [limits, setLimits] = useState(initialTool?.capabilitiesSummary.usageAndStorage.limits || 'Standard rate limits and team quotas');
  const [hosting, setHosting] = useState<ToolHostingType>(initialTool?.capabilitiesSummary.usageAndStorage.hosting || 'Cloud SaaS');
  const [dataRetention, setDataRetention] = useState(initialTool?.capabilitiesSummary.usageAndStorage.dataRetention || 'Indefinite with export');
  const [environment, setEnvironment] = useState<'Local' | 'Cloud' | 'Hybrid'>(initialTool?.capabilitiesSummary.usageAndStorage.environment || 'Cloud');
  const [consumptionModel, setConsumptionModel] = useState(initialTool?.capabilitiesSummary.usageAndStorage.consumptionModel || 'Per-seat');

  // Integrations
  const [apisText, setApisText] = useState((initialTool?.capabilitiesSummary.integrations.apis || ['REST API', 'GraphQL API']).join(', '));
  const [sdksText, setSdksText] = useState((initialTool?.capabilitiesSummary.integrations.sdks || ['TypeScript', 'Python']).join(', '));
  const [connectorsText, setConnectorsText] = useState((initialTool?.capabilitiesSummary.integrations.connectors || ['GitHub', 'Slack']).join(', '));
  const [nativeIntegrationsText, setNativeIntegrationsText] = useState((initialTool?.capabilitiesSummary.integrations.nativeIntegrations || []).join(', '));
  const [mcpSupport, setMcpSupport] = useState(initialTool?.capabilitiesSummary.integrations.mcpSupport || '');
  const [webhooks, setWebhooks] = useState(initialTool?.capabilitiesSummary.integrations.webhooks || 'Standard webhook notifications on events');
  const [importExport, setImportExport] = useState(initialTool?.capabilitiesSummary.integrations.importExport || 'JSON, CSV export');
  const [automationText, setAutomationText] = useState((initialTool?.capabilitiesSummary.integrations.automationIntegrations || ['Zapier', 'GitHub Actions']).join(', '));

  // User Experiences
  const [interactionsText, setInteractionsText] = useState((initialTool?.capabilitiesSummary.userExperiences.primaryInteractions || ['Web App', 'CLI', 'API']).join(', '));
  const [uxDetails, setUxDetails] = useState(initialTool?.capabilitiesSummary.userExperiences.details || 'Keyboard-centric workflow with Command Palette.');

  // Best Suited For
  const [userTypesText, setUserTypesText] = useState((initialTool?.capabilitiesSummary.bestSuitedFor.userTypes || ['Software Engineers', 'Product Managers']).join(', '));
  const [teamsText, setTeamsText] = useState((initialTool?.capabilitiesSummary.bestSuitedFor.teams || ['Engineering Squads', 'Product Teams']).join(', '));
  const [companySizesText, setCompanySizesText] = useState((initialTool?.capabilitiesSummary.bestSuitedFor.companySizes || ['Startups', 'Mid-Market']).join(', '));
  const [useCasesText, setUseCasesText] = useState((initialTool?.capabilitiesSummary.bestSuitedFor.useCases || ['Production software development']).join(', '));
  const [technicalLevel, setTechnicalLevel] = useState<'No-Code' | 'Low-Code' | 'Pro-Code' | 'All Levels'>(
    initialTool?.capabilitiesSummary.bestSuitedFor.technicalLevel || 'All Levels'
  );

  // Supporting Features
  const [otherFeaturesText, setOtherFeaturesText] = useState((initialTool?.capabilitiesSummary.otherSupportingFeatures || ['Dark mode', 'SSO']).join('\n'));

  // Roles & Pathways
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialTool?.relevantRoles || ['Software Engineering']);
  const [relatedPathwaysText, setRelatedPathwaysText] = useState((initialTool?.relatedWorkPathways || ['Feature Delivery & Production Engineering Lifecycle']).join(', '));

  // Active form section
  const [activeSection, setActiveSection] = useState<'smart_import' | 'core' | 'temporal' | 'capacities' | 'architecture' | 'integrations' | 'suitability'>('smart_import');

  // Trigger Smart Import
  const handleSmartImport = () => {
    if (!pasteUrl.trim()) return;
    setIsAnalyzing(true);
    setAnalyzeSuccess(false);

    setTimeout(() => {
      const res = analyzeToolPlatformUrl(pasteUrl);
      setName(res.name);
      setCompanyProvider(res.companyProvider);
      setTagline(res.tagline);
      setCategory(res.category);
      setSubcategory(res.subcategory);
      setPrimaryDomain(res.primaryDomain);
      setTargetUsers(res.targetUsers);
      setOfficialWebsite(res.officialWebsite);
      setProductUrl(res.productUrl);
      setSourceUrl(res.sourceUrl);
      setSourceName(res.sourceName);
      setSourceType(res.sourceType);
      setVersion(res.version);
      setReleaseDate(res.releaseDate);
      setObservedDate(res.observedDate);
      setLastVerified(res.lastVerified);
      setDataSourceDate(res.dataSourceDate);
      setStatus('Current');
      setSourceState(res.sourceState);

      setKeyCapacitiesText(res.capabilitiesSummary.keyCapacities.join('\n'));
      setHowItWorks(res.capabilitiesSummary.howItWorks);
      setProductPhilosophy(res.capabilitiesSummary.productPhilosophy);

      setUsageModel(res.capabilitiesSummary.usageAndStorage.usageModel);
      setStorageModel(res.capabilitiesSummary.usageAndStorage.storageModel);
      setDataModel(res.capabilitiesSummary.usageAndStorage.dataModel);
      setLimits(res.capabilitiesSummary.usageAndStorage.limits);
      setHosting(res.capabilitiesSummary.usageAndStorage.hosting);
      setDataRetention(res.capabilitiesSummary.usageAndStorage.dataRetention);
      setEnvironment(res.capabilitiesSummary.usageAndStorage.environment);
      setConsumptionModel(res.capabilitiesSummary.usageAndStorage.consumptionModel);

      setApisText(res.capabilitiesSummary.integrations.apis.join(', '));
      setSdksText(res.capabilitiesSummary.integrations.sdks.join(', '));
      setConnectorsText(res.capabilitiesSummary.integrations.connectors.join(', '));
      setNativeIntegrationsText(res.capabilitiesSummary.integrations.nativeIntegrations.join(', '));
      if (res.capabilitiesSummary.integrations.mcpSupport) {
        setMcpSupport(res.capabilitiesSummary.integrations.mcpSupport);
      }
      setWebhooks(res.capabilitiesSummary.integrations.webhooks);
      setImportExport(res.capabilitiesSummary.integrations.importExport);
      setAutomationText(res.capabilitiesSummary.integrations.automationIntegrations.join(', '));

      setInteractionsText(res.capabilitiesSummary.userExperiences.primaryInteractions.join(', '));
      setUxDetails(res.capabilitiesSummary.userExperiences.details);

      setUserTypesText(res.capabilitiesSummary.bestSuitedFor.userTypes.join(', '));
      setTeamsText(res.capabilitiesSummary.bestSuitedFor.teams.join(', '));
      setCompanySizesText(res.capabilitiesSummary.bestSuitedFor.companySizes.join(', '));
      setUseCasesText(res.capabilitiesSummary.bestSuitedFor.useCases.join(', '));
      setTechnicalLevel(res.capabilitiesSummary.bestSuitedFor.technicalLevel);

      setOtherFeaturesText(res.capabilitiesSummary.otherSupportingFeatures.join('\n'));
      setSelectedRoles(res.relevantRoles);
      setRelatedPathwaysText(res.relatedWorkPathways.join(', '));

      setIsAnalyzing(false);
      setAnalyzeSuccess(true);
      setActiveSection('core');
    }, 600);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const toolEntry: ToolPlatformEntry = {
      id: initialTool?.id || `tool-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      companyProvider: companyProvider.trim() || 'Independent Provider',
      category,
      subcategory: subcategory.trim() || 'General Platform',
      primaryDomain,
      targetUsers: targetUsers.trim() || 'Software Engineers and Technical Operators',
      officialWebsite: officialWebsite.trim() || undefined,
      productUrl: productUrl.trim() || undefined,
      sourceUrl: sourceUrl.trim() || undefined,
      sourceName: sourceName.trim() || undefined,
      sourceType: sourceType.trim() || undefined,
      referenceLinks: referenceLinksText.split('\n').map(s => s.trim()).filter(Boolean),
      
      version: version.trim() || '1.0.0',
      releaseDate: releaseDate.trim() || today,
      observedDate: observedDate.trim() || today,
      lastVerified: lastVerified.trim() || today,
      dataSourceDate: dataSourceDate.trim() || today,
      status,
      versionHistory: initialTool?.versionHistory || [],
      
      pricingModel,
      tagline: tagline.trim() || 'High-performance capability platform.',
      capabilitiesSummary: {
        keyCapacities: keyCapacitiesText.split('\n').map(s => s.trim()).filter(Boolean),
        howItWorks: howItWorks.trim() || 'Platform operates with standard cloud architecture and service pipelines.',
        productPhilosophy: productPhilosophy.trim() || 'Focus on developer velocity, reliability, and composability.',
        usageAndStorage: {
          usageModel: usageModel.trim() || 'Subscription',
          storageModel: storageModel.trim() || 'Cloud relational storage',
          dataModel: dataModel.trim() || 'Structured relational and JSON data',
          limits: limits.trim() || 'Standard tier limits',
          hosting,
          dataRetention: dataRetention.trim() || 'Standard retention',
          environment,
          consumptionModel: consumptionModel.trim() || 'Per-seat'
        },
        integrations: {
          apis: apisText.split(',').map(s => s.trim()).filter(Boolean),
          sdks: sdksText.split(',').map(s => s.trim()).filter(Boolean),
          connectors: connectorsText.split(',').map(s => s.trim()).filter(Boolean),
          nativeIntegrations: nativeIntegrationsText.split(',').map(s => s.trim()).filter(Boolean),
          mcpSupport: mcpSupport.trim() || undefined,
          webhooks: webhooks.trim() || 'Webhooks available',
          importExport: importExport.trim() || 'JSON/CSV',
          automationIntegrations: automationText.split(',').map(s => s.trim()).filter(Boolean)
        },
        userExperiences: {
          primaryInteractions: interactionsText.split(',').map(s => s.trim()).filter(Boolean),
          details: uxDetails.trim() || 'Web app and API interactions.'
        },
        bestSuitedFor: {
          userTypes: userTypesText.split(',').map(s => s.trim()).filter(Boolean),
          teams: teamsText.split(',').map(s => s.trim()).filter(Boolean),
          companySizes: companySizesText.split(',').map(s => s.trim()).filter(Boolean),
          useCases: useCasesText.split(',').map(s => s.trim()).filter(Boolean),
          workflows: ['Feature delivery', 'Operational workflows'],
          industries: ['Software & SaaS'],
          technicalLevel
        },
        otherSupportingFeatures: otherFeaturesText.split('\n').map(s => s.trim()).filter(Boolean)
      },
      relevantRoles: selectedRoles.length > 0 ? selectedRoles : ['Software Engineering'],
      relatedSkills: (initialTool?.relatedSkills && initialTool.relatedSkills.length > 0) 
        ? initialTool.relatedSkills 
        : [{ name: `${category} Proficiency`, category: 'Technical Competency', proficiency: 'Practitioner' }],
      relatedWorkPathways: relatedPathwaysText.split(',').map(s => s.trim()).filter(Boolean),
      sourceState,
      lastUpdated: today
    };

    onSave(toolEntry, preserveHistory);
  };

  const statusConfig = TOOL_VERSION_STATUS_CONFIG[status] || { label: status, badgeColor: 'bg-slate-100 text-slate-800 border-slate-200' };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 my-6 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 bg-slate-50/80 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs">
                <Wrench className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {isEditing ? `Edit Tool: ${initialTool.name}` : 'Add Tool or Platform'}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${statusConfig.badgeColor}`}>
                {status}
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                sourceState === 'Verified' ? 'bg-emerald-50 text-emerald-800 border-emerald-300' :
                sourceState === 'AI Suggested' ? 'bg-purple-50 text-purple-800 border-purple-300' :
                sourceState === 'Imported' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                State: {sourceState}
              </span>
            </div>
            <p className="text-xs text-slate-600">
              Profiles are structured with 8-part capability models, historical version tracking, and Career OS integration.
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

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-1.5 px-6 pt-3 border-b border-slate-200 bg-white overflow-x-auto no-scrollbar text-xs">
          <button
            type="button"
            onClick={() => setActiveSection('smart_import')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'smart_import' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart URL Import</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('core')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'core' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Identity & Links</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('temporal')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'temporal' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Version & Temporal</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('capacities')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'capacities' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Capacities & Philosophy</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('architecture')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'architecture' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>How It Works & Storage</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('integrations')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'integrations' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cable className="w-3.5 h-3.5" />
            <span>Integrations & UX</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('suitability')}
            className={`pb-2.5 px-3 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'suitability' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Suitability & Roles</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB: SMART URL IMPORT */}
          {activeSection === 'smart_import' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-5 rounded-2xl bg-linear-to-r from-teal-50 via-cyan-50 to-blue-50 border border-teal-200 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-700" />
                  <h3 className="text-sm font-black text-slate-900">
                    Smart URL Import & Automated Extraction
                  </h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Enter a company or product URL (e.g., <code>https://linear.app</code>, <code>https://github.com/astral-sh/uv</code>, <code>https://stripe.com</code>). The system will analyze the source and pre-populate the entire 8-part capability profile. All fields remain 100% editable.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                  <div className="relative flex-1">
                    <input
                      type="url"
                      placeholder="Paste product, company, or documentation URL..."
                      value={pasteUrl}
                      onChange={(e) => setPasteUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-teal-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSmartImport}
                    disabled={isAnalyzing || !pasteUrl.trim()}
                    className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer shrink-0"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Analyzing Source...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Import & Analyze</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">Try Sample:</span>
                  <button
                    type="button"
                    onClick={() => setPasteUrl('https://linear.app')}
                    className="px-2 py-0.5 rounded-md bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 font-semibold cursor-pointer"
                  >
                    linear.app
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasteUrl('https://vercel.com')}
                    className="px-2 py-0.5 rounded-md bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 font-semibold cursor-pointer"
                  >
                    vercel.com
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasteUrl('https://github.com/astral-sh/uv')}
                    className="px-2 py-0.5 rounded-md bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 font-semibold cursor-pointer"
                  >
                    astral-sh/uv (GitHub)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasteUrl('https://postman.com')}
                    className="px-2 py-0.5 rounded-md bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 font-semibold cursor-pointer"
                  >
                    postman.com
                  </button>
                </div>

                {analyzeSuccess && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Analyzed and pre-populated successfully! Switch tabs to review and refine the profile.</span>
                  </div>
                )}
              </div>

              {/* Source State Status Selector */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700">Source Verification Status</span>
                <p className="text-[11px] text-slate-500">
                  Indicates whether this tool entry was imported, AI suggested, manually edited, or formally verified.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['Imported', 'AI Suggested', 'User Edited', 'Verified'] as IngestionSourceState[]).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSourceState(st)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        sourceState === st
                          ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: CORE IDENTITY & LINKS */}
          {activeSection === 'core' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tool / Platform Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => { setName(e.target.value); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Linear, Supabase, Datadog"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Company / Provider *</label>
                  <input
                    type="text"
                    required
                    value={companyProvider}
                    onChange={(e) => { setCompanyProvider(e.target.value); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Linear Orbit, Inc."
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Tagline / Summary Sentence</label>
                  <input
                    type="text"
                    value={tagline}
                    onChange={(e) => { setTagline(e.target.value); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
                    placeholder="Concise value proposition..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Category (29 Standardized) *</label>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value as ToolCategory); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {TOOL_CATEGORIES_LIST.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Subcategory</label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => { setSubcategory(e.target.value); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Issue Tracking, Relational DB"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Pricing Model</label>
                  <select
                    value={pricingModel}
                    onChange={(e) => { setPricingModel(e.target.value as ToolPricingModel); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Open Source">Open Source</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Usage-Based">Usage-Based</option>
                    <option value="Commercial / SaaS">Commercial / SaaS</option>
                    <option value="Free">Free</option>
                    <option value="Enterprise">Enterprise</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Primary Domain</label>
                  <select
                    value={primaryDomain}
                    onChange={(e) => { setPrimaryDomain(e.target.value); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    {CANONICAL_DOMAINS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Target Users</label>
                  <input
                    type="text"
                    value={targetUsers}
                    onChange={(e) => { setTargetUsers(e.target.value); setSourceState('User Edited'); }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
                    placeholder="e.g. Product managers, software engineers, DevOps leads"
                  />
                </div>
              </div>

              {/* URLs Section */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Official Website & Knowledge References
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Official Website URL</label>
                    <input
                      type="url"
                      value={officialWebsite}
                      onChange={(e) => setOfficialWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Product / Docs URL</label>
                    <input
                      type="url"
                      value={productUrl}
                      onChange={(e) => setProductUrl(e.target.value)}
                      placeholder="https://.../docs"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Primary Source URL</label>
                    <input
                      type="url"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600">Source Name / Attribution</label>
                    <input
                      type="text"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="e.g. Official Documentation"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-[11px] font-bold text-slate-600">Reference Links (One per line)</label>
                    <textarea
                      rows={2}
                      value={referenceLinksText}
                      onChange={(e) => setReferenceLinksText(e.target.value)}
                      placeholder="https://github.com/...&#10;https://docs...."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VERSION & TEMPORAL DATA */}
          {activeSection === 'temporal' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-amber-700" />
                  <span>Version & Temporal Integrity</span>
                </span>
                <p className="text-xs text-amber-900/80">
                  Tools evolve rapidly. Every record preserves historical version-aware metadata and does not treat state as timeless.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Current Version / Release String *</label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold font-mono"
                    placeholder="e.g. 4.2, 2026.3, v1.8"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Tool Lifecycle Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as ToolVersionStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white"
                  >
                    <option value="Current">Current</option>
                    <option value="Previous Version">Previous Version</option>
                    <option value="Beta">Beta</option>
                    <option value="Experimental">Experimental</option>
                    <option value="Deprecated">Deprecated</option>
                    <option value="Discontinued">Discontinued</option>
                    <option value="Acquired">Acquired</option>
                    <option value="Merged">Merged</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Release Date</label>
                  <input
                    type="date"
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Observed Date</label>
                  <input
                    type="date"
                    value={observedDate}
                    onChange={(e) => setObservedDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Last Verified Date</label>
                  <input
                    type="date"
                    value={lastVerified}
                    onChange={(e) => setLastVerified(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Data Source Date</label>
                  <input
                    type="date"
                    value={dataSourceDate}
                    onChange={(e) => setDataSourceDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {isEditing && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-800">Preserve Previous Version in Changelog</span>
                    <p className="text-[11px] text-slate-500">
                      Keeps the previous version snapshot ({initialTool?.version || 'old'}) in the tool's historical version record.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={preserveHistory}
                    onChange={(e) => setPreserveHistory(e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded-sm focus:ring-teal-500 cursor-pointer"
                  />
                </div>
              )}

              {/* Existing Version History preview if present */}
              {initialTool?.versionHistory && initialTool.versionHistory.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-slate-700">Historical Versions on Record:</span>
                  <div className="space-y-2">
                    {initialTool.versionHistory.map((vh, vIdx) => (
                      <div key={vIdx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{vh.version}</span>
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-sm bg-slate-200 text-slate-700">
                            {vh.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{vh.notes || vh.capabilitiesSnapshot}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CAPACITIES & PHILOSOPHY */}
          {activeSection === 'capacities' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  1. Key Capacities (What It Does - One per line) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={keyCapacitiesText}
                  onChange={(e) => setKeyCapacitiesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 leading-relaxed"
                  placeholder="Real-time collaborative issue tracking&#10;Bi-directional GitHub pull request integration&#10;Cycles & Milestone Roadmaps"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  3. Product Philosophy & Design Principles *
                </label>
                <textarea
                  required
                  rows={3}
                  value={productPhilosophy}
                  onChange={(e) => setProductPhilosophy(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 leading-relaxed"
                  placeholder="Explain the product's core design philosophy, operating principles, or strategic approach..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  8. Other Supporting Features (Secondary capabilities - One per line)
                </label>
                <textarea
                  rows={3}
                  value={otherFeaturesText}
                  onChange={(e) => setOtherFeaturesText(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500"
                  placeholder="Dark mode and OLED theme options&#10;SOC2 Type II compliance&#10;Automated stale issue archiving"
                />
              </div>
            </div>
          )}

          {/* TAB: HOW IT WORKS & ARCHITECTURE */}
          {activeSection === 'architecture' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  2. How It Works (Operating mechanism, architecture, workflow) *
                </label>
                <textarea
                  required
                  rows={3}
                  value={howItWorks}
                  onChange={(e) => setHowItWorks(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-teal-500 leading-relaxed"
                  placeholder="Explain the underlying operating mechanism, architecture, workflow, or product mechanics..."
                />
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  4. Usage & Storage Architecture
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Hosting Type</label>
                    <select
                      value={hosting}
                      onChange={(e) => setHosting(e.target.value as ToolHostingType)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Cloud SaaS">Cloud SaaS</option>
                      <option value="Self-Hosted">Self-Hosted</option>
                      <option value="Local / Desktop">Local / Desktop</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Edge">Edge</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Environment</label>
                    <select
                      value={environment}
                      onChange={(e) => setEnvironment(e.target.value as 'Local' | 'Cloud' | 'Hybrid')}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="Cloud">Cloud</option>
                      <option value="Local">Local</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Usage Model</label>
                    <input
                      type="text"
                      value={usageModel}
                      onChange={(e) => setUsageModel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Storage Model</label>
                    <input
                      type="text"
                      value={storageModel}
                      onChange={(e) => setStorageModel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Data Model</label>
                    <input
                      type="text"
                      value={dataModel}
                      onChange={(e) => setDataModel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Limits & Scale</label>
                    <input
                      type="text"
                      value={limits}
                      onChange={(e) => setLimits(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Data Retention</label>
                    <input
                      type="text"
                      value={dataRetention}
                      onChange={(e) => setDataRetention(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-600">Consumption Model</label>
                    <input
                      type="text"
                      value={consumptionModel}
                      onChange={(e) => setConsumptionModel(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INTEGRATIONS & UX */}
          {activeSection === 'integrations' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                5. Integrations & Connectivity
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">APIs (Comma separated)</label>
                  <input
                    type="text"
                    value={apisText}
                    onChange={(e) => setApisText(e.target.value)}
                    placeholder="REST API, GraphQL API"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">SDKs (Comma separated)</label>
                  <input
                    type="text"
                    value={sdksText}
                    onChange={(e) => setSdksText(e.target.value)}
                    placeholder="TypeScript, Python, Go"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-600">MCP Support (Model Context Protocol)</label>
                  <input
                    type="text"
                    value={mcpSupport}
                    onChange={(e) => setMcpSupport(e.target.value)}
                    placeholder="e.g. Official MCP server for Claude and Cursor agents"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Webhooks</label>
                  <input
                    type="text"
                    value={webhooks}
                    onChange={(e) => setWebhooks(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Import / Export</label>
                  <input
                    type="text"
                    value={importExport}
                    onChange={(e) => setImportExport(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-600">Automations & Connectors (Comma separated)</label>
                  <input
                    type="text"
                    value={connectorsText}
                    onChange={(e) => setConnectorsText(e.target.value)}
                    placeholder="GitHub, Slack, Jira, Zapier, n8n"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  6. User Experiences & Interaction Models
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">
                      Primary Interaction Models (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={interactionsText}
                      onChange={(e) => setInteractionsText(e.target.value)}
                      placeholder="Web App, Desktop, Mobile, CLI, API, Agent Interface"
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600">Interaction UX Details</label>
                    <textarea
                      rows={2}
                      value={uxDetails}
                      onChange={(e) => setUxDetails(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SUITABILITY & ROLES */}
          {activeSection === 'suitability' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                7. Best Suited For
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Target User Personas (Comma separated)</label>
                  <input
                    type="text"
                    value={userTypesText}
                    onChange={(e) => setUserTypesText(e.target.value)}
                    placeholder="Product Managers, Software Engineers"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Company Sizes / Stages</label>
                  <input
                    type="text"
                    value={companySizesText}
                    onChange={(e) => setCompanySizesText(e.target.value)}
                    placeholder="Startups, Scale-ups, Enterprises"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-600">Primary Use Cases (Comma separated)</label>
                  <input
                    type="text"
                    value={useCasesText}
                    onChange={(e) => setUseCasesText(e.target.value)}
                    placeholder="Sprint planning, Issue tracking, API testing"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-600">Technical Level</label>
                  <select
                    value={technicalLevel}
                    onChange={(e) => setTechnicalLevel(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="All Levels">All Levels</option>
                    <option value="No-Code">No-Code</option>
                    <option value="Low-Code">Low-Code</option>
                    <option value="Pro-Code">Pro-Code</option>
                  </select>
                </div>
              </div>

              {/* Career OS Connections */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Career OS Alignment & Work Pathways
                </h4>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-600">Applicable Career OS Roles</label>
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
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {role}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600">
                    Connected Work Pathways (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={relatedPathwaysText}
                    onChange={(e) => setRelatedPathwaysText(e.target.value)}
                    placeholder="Feature Delivery & Production Engineering Lifecycle, PRD & Product Specification"
                    className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions inside form */}
          <div className="p-4 bg-slate-50 -mx-6 -mb-6 border-t border-slate-200 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-6 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Create Tool Profile'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
