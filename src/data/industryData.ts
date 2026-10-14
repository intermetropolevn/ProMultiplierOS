import {
  Industry,
  IndustryReport,
  IndustryDataPoint,
  IndustryIntelligence,
  CaseStudy,
  CaseExhibit,
  CaseQuestion
} from '../features/industry/types';

// =========================================================================
// 1. CANONICAL INDUSTRIES (Hierarchical)
// =========================================================================

export const SEED_INDUSTRIES: Industry[] = [
  // Technology Group
  {
    id: 'ind-tech',
    name: 'Technology & Software',
    slug: 'technology-software',
    domainId: 'Enterprise SaaS',
    description: 'Digital infrastructure, enterprise application software, developer tools, and cloud platforms.',
    geography: 'Global',
    aliases: ['Tech', 'Information Technology', 'Software'],
    tags: ['SaaS', 'Cloud', 'Infrastructure', 'Software'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'ind-saas',
    name: 'Enterprise SaaS',
    slug: 'enterprise-saas',
    domainId: 'Enterprise SaaS',
    parentIndustryId: 'ind-tech',
    description: 'Subscription-based B2B software solutions, workflow automation, and collaborative enterprise platforms.',
    geography: 'Global',
    aliases: ['B2B SaaS', 'Cloud Software', 'Enterprise Software'],
    tags: ['B2B', 'SaaS', 'Subscription', 'ARR', 'NRR'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'ind-ai',
    name: 'AI & Machine Learning Infrastructure',
    slug: 'ai-machine-learning',
    domainId: 'AI & Machine Learning',
    parentIndustryId: 'ind-tech',
    description: 'Foundation models, AI runtime platforms, vector retrieval engines, and machine learning developer tooling.',
    geography: 'Global',
    aliases: ['Artificial Intelligence', 'ML', 'GenAI', 'Deep Learning'],
    tags: ['AI', 'LLM', 'Inference', 'Compute', 'Data Infrastructure'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },

  // Automotive Group
  {
    id: 'ind-auto',
    name: 'Automotive & Mobility',
    slug: 'automotive-mobility',
    domainId: 'Enterprise SaaS',
    description: 'Vehicles, powertrains, transportation networks, OEM supply chains, and mobility fleets.',
    geography: 'Global',
    aliases: ['Automotive', 'Transportation', 'Mobility'],
    tags: ['OEM', 'Powertrain', 'Mobility', 'Fleet'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'ind-ev',
    name: 'Electric Vehicles (EV) & Fleet Electrification',
    slug: 'electric-vehicles',
    domainId: 'Enterprise SaaS',
    parentIndustryId: 'ind-auto',
    description: 'Battery electric passenger vehicles, commercial electric two-wheelers, charging networks, and commercial fleet electrification.',
    geography: 'Global',
    aliases: ['EV', 'Electric Mobility', 'e-Mobility', 'BEV'],
    tags: ['EV', 'Battery', 'Charging', 'Fleet', 'CleanTech', 'Two-Wheelers'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },
  {
    id: 'ind-battery',
    name: 'Battery Energy Storage & Chemistry',
    slug: 'battery-energy-storage',
    domainId: 'Enterprise SaaS',
    parentIndustryId: 'ind-auto',
    description: 'Lithium iron phosphate (LFP), nickel-manganese-cobalt (NMC) chemistries, grid-scale storage, and battery swapping systems.',
    geography: 'Global',
    aliases: ['BESS', 'Battery Tech', 'Energy Storage', 'LFP'],
    tags: ['Storage', 'Battery Pack', 'LFP', 'Energy'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },

  // Financial Services Group
  {
    id: 'ind-fintech',
    name: 'Financial Services & Fintech',
    slug: 'fintech-payments',
    domainId: 'Fintech & Payments',
    description: 'Payment gateway rails, core banking infrastructure, neobanks, embedded lending, and credit scoring.',
    geography: 'Global',
    aliases: ['Fintech', 'Financial Technology', 'Banking'],
    tags: ['Payments', 'Banking', 'Credit', 'Ledger', 'PCI-DSS'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  },

  // Consumer & Retail
  {
    id: 'ind-retail',
    name: 'Consumer E-Commerce & Retail',
    slug: 'ecommerce-retail',
    domainId: 'E-Commerce & Retail',
    description: 'Online direct-to-consumer commerce, marketplaces, logistics fulfillment, and omnichannel retail.',
    geography: 'Global',
    aliases: ['E-Commerce', 'Retail', 'DTC', 'Marketplaces'],
    tags: ['Cart', 'Checkout', 'Omnichannel', 'Logistics'],
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-03-01T12:00:00Z'
  }
];

// =========================================================================
// 2. AUTHORITATIVE INDUSTRY REPORTS & DATASETS
// =========================================================================

export const SEED_REPORTS: IndustryReport[] = [
  {
    id: 'rep-iea-ev-2026',
    title: 'IEA Global EV Outlook 2026: The Exponential S-Curve',
    industryIds: ['ind-auto', 'ind-ev', 'ind-battery'],
    publisher: 'International Energy Agency (IEA)',
    publicationDate: '2026-04-15',
    reportingPeriod: '2023-2026',
    geography: ['Global', 'Southeast Asia', 'China', 'Europe', 'North America'],
    reportType: 'MARKET_REPORT',
    sourceUrl: 'https://www.iea.org/reports/global-ev-outlook-2026',
    accessMode: 'public_full',
    license: 'CC-BY-4.0',
    credibilityScore: 98,
    summary: 'Comprehensive empirical analysis of global electric vehicle sales, battery pack pricing curves, public charging infrastructure density, and emerging Asian fleet electrification.',
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'rep-mckinsey-auto-2026',
    title: 'McKinsey Mobility Revolution: Commercial Fleet Electrification Economics',
    industryIds: ['ind-auto', 'ind-ev'],
    publisher: 'McKinsey & Company',
    publicationDate: '2026-02-18',
    reportingPeriod: '2025-2026',
    geography: ['Global', 'Southeast Asia', 'Vietnam'],
    reportType: 'CONSULTING_REPORT',
    sourceUrl: 'https://www.mckinsey.com/industries/automotive-and-assembly/our-insights/commercial-fleet-electrification-2026',
    accessMode: 'concept_only',
    license: 'Proprietary Research (Fair Use Concept Extraction)',
    credibilityScore: 95,
    summary: 'Strategic evaluation of Total Cost of Ownership (TCO) parity between electric and ICE vehicles across urban delivery two-wheelers and last-mile transport fleets.',
    status: 'active',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z'
  },
  {
    id: 'rep-gartner-saas-2026',
    title: 'Gartner Enterprise SaaS Spend & Net Retention Benchmark Report',
    industryIds: ['ind-tech', 'ind-saas'],
    publisher: 'Gartner Research',
    publicationDate: '2026-01-20',
    reportingPeriod: 'FY2025-FY2026',
    geography: ['Global', 'North America', 'Europe'],
    reportType: 'MARKET_RESEARCH',
    sourceUrl: 'https://www.gartner.com/en/information-technology/research/saas-metrics-benchmarks-2026',
    accessMode: 'concept_only',
    license: 'Proprietary Research (Fair Use Concept Extraction)',
    credibilityScore: 94,
    summary: 'Empirical survey of 1,200 enterprise SaaS companies tracking median Net Revenue Retention (NRR), customer acquisition cost payback, churn rates, and usage-based monetization.',
    status: 'active',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z'
  },
  {
    id: 'rep-bain-pe-2026',
    title: 'Bain Global Technology M&A and Unit Economics Guide',
    industryIds: ['ind-tech', 'ind-saas', 'ind-fintech'],
    publisher: 'Bain & Company',
    publicationDate: '2026-03-12',
    reportingPeriod: '2026',
    geography: ['Global', 'North America'],
    reportType: 'CONSULTING_REPORT',
    sourceUrl: 'https://www.bain.com/insights/global-tech-report-2026/',
    accessMode: 'concept_only',
    license: 'Proprietary Research (Fair Use Concept Extraction)',
    credibilityScore: 95,
    summary: 'Valuation multiples, profitability thresholds (Rule of 40), and strategic playbook for software acquisitions in high-interest-rate environments.',
    status: 'active',
    createdAt: '2026-03-20T09:00:00Z',
    updatedAt: '2026-03-20T09:00:00Z'
  },
  {
    id: 'rep-vietnam-mot-2026',
    title: 'Vietnam Ministry of Transport Urban Two-Wheeler Transition Data',
    industryIds: ['ind-auto', 'ind-ev'],
    publisher: 'Vietnam Ministry of Transport & Statistical Office',
    publicationDate: '2026-01-15',
    reportingPeriod: '2024-2026',
    geography: ['Vietnam'],
    reportType: 'GOVERNMENT_REPORT',
    sourceUrl: 'https://mt.gov.vn/en/Pages/electric-mobility-roadmap-2026',
    accessMode: 'public_full',
    license: 'Open Government Data',
    credibilityScore: 96,
    summary: 'Official vehicle registration registry numbers, 2-wheeler gasoline vs electric registration breakdowns in Hanoi and Ho Chi Minh City, and municipal emissions mandates.',
    status: 'active',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z'
  }
];

// =========================================================================
// 3. REUSABLE NORMALIZED INDUSTRY DATA POINTS
// =========================================================================

export const SEED_DATA_POINTS: IndustryDataPoint[] = [
  // Automotive / EV Temporal Series: Global EV Penetration
  {
    id: 'dp-ev-pen-global-2023',
    industryId: 'ind-ev',
    metric: 'EV Share of New Passenger Vehicle Sales',
    metricSlug: 'ev-share-passenger-sales',
    value: 18.0,
    rawValue: '18.0%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Global',
    periodStart: '2023-01-01',
    periodEnd: '2023-12-31',
    periodLabel: '2023',
    sourceResourceId: 'rep-iea-ev-2026',
    sourceReportId: 'rep-iea-ev-2026',
    sourceUrl: 'https://www.iea.org/reports/global-ev-outlook-2026',
    publisher: 'IEA',
    pageOrSection: 'Executive Summary, p. 12',
    definition: 'Percentage of total new light-duty passenger vehicle registrations that are battery electric (BEV) or plug-in hybrid (PHEV).',
    methodology: 'National transport ministry registration aggregation across 65 automotive markets.',
    confidenceScore: 0.98,
    credibilityScore: 98,
    dataQualityScore: 94,
    tags: ['EV', 'Penetration', 'Sales', 'Global', 'Time-Series'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'dp-ev-pen-global-2024',
    industryId: 'ind-ev',
    metric: 'EV Share of New Passenger Vehicle Sales',
    metricSlug: 'ev-share-passenger-sales',
    value: 22.4,
    rawValue: '22.4%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Global',
    periodStart: '2024-01-01',
    periodEnd: '2024-12-31',
    periodLabel: '2024',
    sourceResourceId: 'rep-iea-ev-2026',
    sourceReportId: 'rep-iea-ev-2026',
    sourceUrl: 'https://www.iea.org/reports/global-ev-outlook-2026',
    publisher: 'IEA',
    pageOrSection: 'Executive Summary, p. 14',
    definition: 'Percentage of total new light-duty passenger vehicle registrations that are battery electric (BEV) or plug-in hybrid (PHEV).',
    confidenceScore: 0.98,
    credibilityScore: 98,
    dataQualityScore: 96,
    tags: ['EV', 'Penetration', 'Sales', 'Global', 'Time-Series'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'dp-ev-pen-global-2025',
    industryId: 'ind-ev',
    metric: 'EV Share of New Passenger Vehicle Sales',
    metricSlug: 'ev-share-passenger-sales',
    value: 27.1,
    rawValue: '27.1%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Global',
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    periodLabel: '2025',
    sourceResourceId: 'rep-iea-ev-2026',
    sourceReportId: 'rep-iea-ev-2026',
    sourceUrl: 'https://www.iea.org/reports/global-ev-outlook-2026',
    publisher: 'IEA',
    pageOrSection: 'Global Trends, p. 28',
    definition: 'Percentage of total new light-duty passenger vehicle registrations that are battery electric (BEV) or plug-in hybrid (PHEV).',
    confidenceScore: 0.97,
    credibilityScore: 98,
    dataQualityScore: 97,
    tags: ['EV', 'Penetration', 'Sales', 'Global', 'Time-Series'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'dp-ev-pen-global-2026',
    industryId: 'ind-ev',
    metric: 'EV Share of New Passenger Vehicle Sales',
    metricSlug: 'ev-share-passenger-sales',
    value: 32.0,
    rawValue: '32.0%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Global',
    periodStart: '2026-01-01',
    periodEnd: '2026-12-31',
    periodLabel: '2026',
    sourceResourceId: 'rep-iea-ev-2026',
    sourceReportId: 'rep-iea-ev-2026',
    sourceUrl: 'https://www.iea.org/reports/global-ev-outlook-2026',
    publisher: 'IEA',
    pageOrSection: 'Global Trends, p. 32',
    definition: 'Percentage of total new light-duty passenger vehicle registrations that are battery electric (BEV) or plug-in hybrid (PHEV).',
    confidenceScore: 0.96,
    credibilityScore: 98,
    dataQualityScore: 98,
    tags: ['EV', 'Penetration', 'Sales', 'Global', 'Time-Series'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },

  // Battery Pack Cost Curve (Global)
  {
    id: 'dp-battery-cost-2023',
    industryId: 'ind-battery',
    metric: 'Lithium-Ion Battery Pack Cost',
    metricSlug: 'battery-pack-cost-per-kwh',
    value: 138,
    rawValue: '$138 / kWh',
    valueType: 'CURRENCY',
    unit: 'USD',
    geography: 'Global',
    periodLabel: '2023',
    sourceResourceId: 'rep-iea-ev-2026',
    publisher: 'IEA / BloombergNEF',
    pageOrSection: 'Battery Economics, p. 55',
    definition: 'Volume-weighted average cost of automotive battery pack per kilowatt-hour of usable capacity.',
    confidenceScore: 0.96,
    credibilityScore: 97,
    dataQualityScore: 93,
    tags: ['Battery', 'Cost', 'Economics', 'kWh'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'dp-battery-cost-2026',
    industryId: 'ind-battery',
    metric: 'Lithium-Ion Battery Pack Cost',
    metricSlug: 'battery-pack-cost-per-kwh',
    value: 84,
    rawValue: '$84 / kWh',
    valueType: 'CURRENCY',
    unit: 'USD',
    geography: 'Global',
    periodLabel: '2026',
    sourceResourceId: 'rep-iea-ev-2026',
    publisher: 'IEA / BloombergNEF',
    pageOrSection: 'Battery Economics, p. 58',
    definition: 'Volume-weighted average cost of automotive battery pack per kilowatt-hour of usable capacity, driven by LFP chemistries and sodium-ion adoption.',
    confidenceScore: 0.95,
    credibilityScore: 97,
    dataQualityScore: 98,
    tags: ['Battery', 'Cost', 'Economics', 'kWh', 'Parity'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },

  // Vietnam Two-Wheeler Mobility Datapoints
  {
    id: 'dp-vn-2w-sales-2026',
    industryId: 'ind-ev',
    metric: 'Annual Two-Wheeler Total Market Sales',
    metricSlug: 'two-wheeler-market-sales',
    value: 2800000,
    rawValue: '2.8 million units',
    valueType: 'COUNT',
    unit: 'units',
    geography: 'Vietnam',
    periodLabel: '2026',
    sourceResourceId: 'rep-vietnam-mot-2026',
    publisher: 'Vietnam Ministry of Transport',
    definition: 'Total combined annual registrations of gasoline and electric two-wheelers in Vietnam.',
    confidenceScore: 0.98,
    credibilityScore: 96,
    dataQualityScore: 97,
    tags: ['Vietnam', 'Two-Wheeler', 'Market Sizing', 'Sales Volume'],
    status: 'active',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z'
  },
  {
    id: 'dp-vn-2w-ev-share-2026',
    industryId: 'ind-ev',
    metric: 'Electric Two-Wheeler (E2W) Market Penetration',
    metricSlug: 'electric-two-wheeler-penetration',
    value: 22.5,
    rawValue: '22.5%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Vietnam',
    periodLabel: '2026',
    sourceResourceId: 'rep-vietnam-mot-2026',
    publisher: 'Vietnam Ministry of Transport',
    definition: 'Proportion of new two-wheeler registrations powered by electric battery systems.',
    confidenceScore: 0.97,
    credibilityScore: 96,
    dataQualityScore: 97,
    tags: ['Vietnam', 'Two-Wheeler', 'EV', 'Penetration'],
    status: 'active',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-02-01T08:00:00Z'
  },
  {
    id: 'dp-vn-commercial-tco-savings',
    industryId: 'ind-ev',
    metric: 'Commercial Driver Monthly Operating Fuel/Energy Cost Savings',
    metricSlug: 'driver-monthly-energy-savings',
    value: 48,
    rawValue: '48%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Vietnam',
    periodLabel: '2026',
    sourceResourceId: 'rep-mckinsey-auto-2026',
    publisher: 'McKinsey & Company',
    definition: 'Percentage fuel expenditure savings for high-mileage (120 km/day) ride-hailing and courier riders switching from gasoline 125cc to battery-swapped E2W.',
    confidenceScore: 0.93,
    credibilityScore: 95,
    dataQualityScore: 94,
    tags: ['Vietnam', 'TCO', 'Ride-Hailing', 'Unit Economics'],
    status: 'active',
    createdAt: '2026-03-01T11:00:00Z',
    updatedAt: '2026-03-01T11:00:00Z'
  },

  // Enterprise SaaS Datapoints
  {
    id: 'dp-saas-nrr-median-2026',
    industryId: 'ind-saas',
    metric: 'Enterprise SaaS Median Net Revenue Retention (NRR)',
    metricSlug: 'median-nrr',
    value: 112,
    rawValue: '112%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Global',
    periodLabel: '2026',
    sourceResourceId: 'rep-gartner-saas-2026',
    publisher: 'Gartner Research',
    definition: 'Median Net Revenue Retention across enterprise B2B SaaS companies ($20M - $100M ARR cohort).',
    confidenceScore: 0.95,
    credibilityScore: 94,
    dataQualityScore: 95,
    tags: ['SaaS', 'NRR', 'Retention', 'Benchmark'],
    status: 'active',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z'
  },
  {
    id: 'dp-saas-gross-margin-2026',
    industryId: 'ind-saas',
    metric: 'Enterprise SaaS Benchmark Gross Margin',
    metricSlug: 'gross-margin',
    value: 78.5,
    rawValue: '78.5%',
    valueType: 'PERCENTAGE',
    unit: '%',
    geography: 'Global',
    periodLabel: '2026',
    sourceResourceId: 'rep-gartner-saas-2026',
    publisher: 'Gartner Research',
    definition: 'Cost of goods sold (hosting compute, customer support, payment transaction fees) deducted from total subscription revenues.',
    confidenceScore: 0.96,
    credibilityScore: 94,
    dataQualityScore: 96,
    tags: ['SaaS', 'Gross Margin', 'Profitability'],
    status: 'active',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z'
  },
  {
    id: 'dp-saas-cac-payback-2026',
    industryId: 'ind-saas',
    metric: 'Customer Acquisition Cost (CAC) Payback Period',
    metricSlug: 'cac-payback-months',
    value: 19.2,
    rawValue: '19.2 months',
    valueType: 'NUMBER',
    unit: 'months',
    geography: 'Global',
    periodLabel: '2026',
    sourceResourceId: 'rep-gartner-saas-2026',
    publisher: 'Gartner Research',
    definition: 'Number of months required to recoup sales and marketing expenditure from customer gross profit contribution.',
    confidenceScore: 0.94,
    credibilityScore: 94,
    dataQualityScore: 94,
    tags: ['SaaS', 'CAC', 'Payback', 'Unit Economics'],
    status: 'active',
    createdAt: '2026-02-10T14:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z'
  },

  // Conflicting Data Points Demonstration (Section 24: Preserves both, flags conflict)
  {
    id: 'dp-ev-market-size-src-a',
    industryId: 'ind-ev',
    metric: 'Global Electric Vehicle Market Revenue',
    metricSlug: 'global-ev-market-revenue',
    value: 420000000000,
    rawValue: '$420 billion USD',
    valueType: 'CURRENCY',
    unit: 'USD',
    geography: 'Global',
    periodLabel: '2026',
    sourceResourceId: 'rep-iea-ev-2026',
    publisher: 'IEA',
    definition: 'Total light-duty passenger electric vehicle transaction turnover worldwide.',
    confidenceScore: 0.95,
    credibilityScore: 98,
    dataQualityScore: 96,
    conflictWarning: true,
    conflictingDataPointIds: ['dp-ev-market-size-src-b'],
    tags: ['Market Size', 'EV', 'Revenue', 'Conflicting Sources'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  },
  {
    id: 'dp-ev-market-size-src-b',
    industryId: 'ind-ev',
    metric: 'Global Electric Vehicle Market Revenue',
    metricSlug: 'global-ev-market-revenue',
    value: 455000000000,
    rawValue: '$455 billion USD',
    valueType: 'CURRENCY',
    unit: 'USD',
    geography: 'Global',
    periodLabel: '2026',
    sourceResourceId: 'rep-mckinsey-auto-2026',
    publisher: 'McKinsey & Company',
    definition: 'Total electric passenger vehicle and commercial delivery vehicle transaction turnover worldwide including battery lease options.',
    confidenceScore: 0.92,
    credibilityScore: 95,
    dataQualityScore: 94,
    conflictWarning: true,
    conflictingDataPointIds: ['dp-ev-market-size-src-a'],
    tags: ['Market Size', 'EV', 'Revenue', 'Conflicting Sources'],
    status: 'active',
    createdAt: '2026-05-01T10:00:00Z',
    updatedAt: '2026-05-01T10:00:00Z'
  }
];

// =========================================================================
// 4. STRUCTURED INDUSTRY INTELLIGENCE
// =========================================================================

export const SEED_INTELLIGENCE: IndustryIntelligence[] = [
  {
    id: 'intel-sea-e2w-fleet-acceleration',
    industryId: 'ind-ev',
    title: 'EV Adoption Accelerating in Southeast Asian Commercial Urban Fleets',
    type: 'MARKET_TREND',
    summary: 'While private consumer adoption of 4-wheel passenger EVs faces high capital cost resistance in Southeast Asia, commercial 2-wheeler fleets (couriers, food delivery, ride-hailing) are undergoing rapid electrification driven by battery-swapping networks and 48% monthly fuel savings.',
    dataPointIds: ['dp-vn-2w-sales-2026', 'dp-vn-2w-ev-share-2026', 'dp-vn-commercial-tco-savings'],
    sourceResourceIds: ['rep-vietnam-mot-2026', 'rep-mckinsey-auto-2026'],
    geography: ['Vietnam', 'Southeast Asia'],
    period: '2025-2026',
    confidenceScore: 0.96,
    evidenceLevel: 'HIGH',
    implications: [
      'Incumbent ICE motorcycle manufacturers (Honda, Yamaha) face structural fleet market erosion if they delay electric subscription models.',
      'Battery-as-a-Service (BaaS) infrastructure operators capture sticky recurring subscription revenue while eliminating driver battery replacement risk.',
      'Municipal emissions quotas in Hanoi and Ho Chi Minh City accelerate fleet conversion schedules.'
    ],
    tags: ['Commercial Fleet', 'Vietnam', 'Two-Wheeler', 'TCO', 'BaaS'],
    origin: 'CAREER_OS_SYNTHESIS',
    status: 'active',
    createdAt: '2026-03-05T09:00:00Z',
    updatedAt: '2026-03-05T09:00:00Z'
  },
  {
    id: 'intel-battery-cost-parity',
    industryId: 'ind-battery',
    title: 'Lithium Iron Phosphate (LFP) Breaches Sub-$85/kWh Cost Parity',
    type: 'COST_TREND',
    summary: 'Volume-weighted battery pack costs have declined from $138/kWh in 2023 to $84/kWh in 2026. This breakthrough achieves purchase price parity with internal combustion engine vehicles without government subsidies.',
    dataPointIds: ['dp-battery-cost-2023', 'dp-battery-cost-2026', 'dp-ev-pen-global-2026'],
    sourceResourceIds: ['rep-iea-ev-2026'],
    geography: ['Global', 'China', 'North America'],
    period: '2023-2026',
    confidenceScore: 0.97,
    evidenceLevel: 'HIGH',
    implications: [
      'Automotive OEM profit margins shift from depending on government regulatory credits to positive gross vehicle margins.',
      'Used EV resale values stabilize as battery replacement packs drop below $3,000 for standard 40kWh commuters.',
      'Energy storage systems (BESS) become competitive against natural gas peaker plants on electrical grids.'
    ],
    tags: ['Battery', 'LFP', 'Cost Parity', 'TCO'],
    origin: 'FACT',
    status: 'active',
    createdAt: '2026-05-02T11:00:00Z',
    updatedAt: '2026-05-02T11:00:00Z'
  },
  {
    id: 'intel-saas-nrr-compression',
    industryId: 'ind-saas',
    title: 'Enterprise SaaS Expansion Shift: From Seat Expansion to Usage Monetization',
    type: 'INDUSTRY_BENCHMARK',
    summary: 'Median Net Revenue Retention (NRR) has compressed from 121% in 2023 to 112% in 2026 as corporate buyers rationalize seat licenses. Sustainable growth now mandates consumption/usage telemetry and direct ROI justification rather than per-seat bloat.',
    dataPointIds: ['dp-saas-nrr-median-2026', 'dp-saas-cac-payback-2026'],
    sourceResourceIds: ['rep-gartner-saas-2026', 'rep-bain-pe-2026'],
    geography: ['Global', 'North America'],
    period: '2024-2026',
    confidenceScore: 0.94,
    evidenceLevel: 'HIGH',
    implications: [
      'Sales teams must pivot from top-down multi-year seat lockups to land-and-expand product usage triggers.',
      'Customer Success departments are evaluated on telemetry feature adoption speed rather than manual check-in cadence.',
      'Pricing redesigns increasingly incorporate baseline platform fee + tiered compute/transaction metering.'
    ],
    tags: ['SaaS', 'NRR', 'Seat Rationalization', 'Pricing Strategy'],
    origin: 'INTERPRETATION',
    status: 'active',
    createdAt: '2026-02-15T15:00:00Z',
    updatedAt: '2026-02-15T15:00:00Z'
  },
  {
    id: 'intel-saas-ai-gross-margin-drag',
    industryId: 'ind-saas',
    title: 'Generative AI Compute Costs Creating 400-600 bps Gross Margin Drag',
    type: 'RISK',
    summary: 'Enterprise SaaS applications packaging un-metered LLM queries into traditional flat-rate subscription tiers are observing gross margins decline from historical 80% levels to 74-76% due to token inference expenses.',
    dataPointIds: ['dp-saas-gross-margin-2026'],
    sourceResourceIds: ['rep-gartner-saas-2026'],
    geography: ['Global'],
    period: '2025-2026',
    confidenceScore: 0.91,
    evidenceLevel: 'MEDIUM',
    implications: [
      'Companies must implement model routing (dispatching 80% of routine requests to compact distilled models) to curb GPU hosting costs.',
      'Un-metered AI add-ons will transition to monthly token quotas with overage charges.'
    ],
    tags: ['GenAI', 'Gross Margin', 'COGS', 'Token Cost'],
    origin: 'CAREER_OS_SYNTHESIS',
    status: 'active',
    createdAt: '2026-02-16T12:00:00Z',
    updatedAt: '2026-02-16T12:00:00Z'
  }
];

// =========================================================================
// 5. CANONICAL CASE EXHIBITS (Referencing Reusable Data Points)
// =========================================================================

export const SEED_EXHIBITS: CaseExhibit[] = [
  // Exhibits for Case 1: VinMobility Two-Wheeler Expansion
  {
    id: 'exh-vin-01-pen-curve',
    caseStudyId: 'case-vin-mobility-e2w',
    title: 'Exhibit 1: Global vs Vietnam EV Adoption Trajectory (2023 - 2026)',
    type: 'CHART',
    dataPointIds: [
      'dp-ev-pen-global-2023',
      'dp-ev-pen-global-2024',
      'dp-ev-pen-global-2025',
      'dp-ev-pen-global-2026',
      'dp-vn-2w-ev-share-2026'
    ],
    chartConfig: {
      chartType: 'line',
      xAxisKey: 'period',
      series: [
        { key: 'globalEV', name: 'Global Passenger EV Penetration (%)', color: '#2563eb' },
        { key: 'vietnamE2W', name: 'Vietnam Two-Wheeler EV Penetration (%)', color: '#10b981' }
      ],
      data: [
        { period: '2023', globalEV: 18.0, vietnamE2W: 5.2 },
        { period: '2024', globalEV: 22.4, vietnamE2W: 10.4 },
        { period: '2025', globalEV: 27.1, vietnamE2W: 16.1 },
        { period: '2026', globalEV: 32.0, vietnamE2W: 22.5 }
      ]
    },
    question: 'How does the adoption curve of two-wheelers in Southeast Asia compare to passenger cars globally?',
    interpretation: 'Vietnam two-wheeler electrification is tracking an accelerated S-curve trajectory (+17.3% points in 3 years), outpacing passenger car adoption due to dense urban corridors and favorable commercial TCO.',
    order: 1
  },
  {
    id: 'exh-vin-02-tco-table',
    caseStudyId: 'case-vin-mobility-e2w',
    title: 'Exhibit 2: Commercial Fleet Total Cost of Ownership (TCO) Breakdown (Annual / Per 40,000 km)',
    type: 'TABLE',
    dataPointIds: [
      'dp-battery-cost-2026',
      'dp-vn-commercial-tco-savings'
    ],
    tableData: {
      headers: ['Cost Component', 'Gasoline 125cc ICE Scooter', 'VinMobility E2W (Battery Swap)', 'Variance (%)'],
      rows: [
        ['Vehicle CapEx / Lease Amortization', '$720 / yr', '$780 / yr', '+8.3%'],
        ['Fuel / Battery Swap Subscription', '$1,380 / yr', '$720 / yr', '-47.8% (Savings)'],
        ['Scheduled Maintenance & Oil Changes', '$240 / yr', '$90 / yr', '-62.5% (Savings)'],
        ['Brake Pads & Wear Items', '$90 / yr', '$90 / yr', '0.0%'],
        ['Total Annual Operating Cost', '$2,430 / yr', '$1,680 / yr', '-30.9% Net Savings ($750/yr)']
      ]
    },
    question: 'Which cost levers drive the decisive commercial competitive advantage for the electric fleet?',
    interpretation: 'Despite higher upfront vehicle amortization (+$60/yr), battery-swap electricity and maintenance generate $750/year in net cash savings for a full-time courier rider.',
    order: 2
  },
  {
    id: 'exh-vin-03-fleet-tam',
    caseStudyId: 'case-vin-mobility-e2w',
    title: 'Exhibit 3: Target Segment Sizing — Commercial Couriers vs Private Commuters',
    type: 'DATA_CARD',
    dataPointIds: ['dp-vn-2w-sales-2026', 'dp-vn-2w-ev-share-2026'],
    tableData: {
      headers: ['Segment Metric', 'Commercial Courier & Ride-Hailing', 'Private Urban Commuter'],
      rows: [
        ['Active Vehicles in Fleet', '850,000 bikes', '42,000,000 bikes'],
        ['Daily Mileage Average', '120 km / day', '18 km / day'],
        ['Price Sensitivity to Upfront CapEx', 'High (Requires Lease/Swap)', 'Moderate (Financed)'],
        ['Sensitivity to Downtime / Charging Time', 'Extremely High (<3 min swap)', 'Low (Overnight Home Charge)'],
        ['Annual Turnover / Replacement Cycle', '2.5 years', '7.0 years']
      ]
    },
    order: 3
  },

  // Exhibits for Case 2: CloudSync Net Revenue Retention
  {
    id: 'exh-cloud-01-nrr-bench',
    caseStudyId: 'case-cloudsync-nrr',
    title: 'Exhibit 1: CloudSync NRR Performance vs Enterprise SaaS Benchmarks (FY2024 - FY2026)',
    type: 'CHART',
    dataPointIds: ['dp-saas-nrr-median-2026'],
    chartConfig: {
      chartType: 'bar',
      xAxisKey: 'cohort',
      series: [
        { key: 'cloudsync', name: 'CloudSync NRR (%)', color: '#ef4444' },
        { key: 'benchmark', name: 'Gartner Industry Median (%)', color: '#64748b' },
        { key: 'topQuartile', name: 'Top Quartile (>125%)', color: '#10b981' }
      ],
      data: [
        { cohort: 'FY2024', cloudsync: 119, benchmark: 118, topQuartile: 128 },
        { cohort: 'FY2025', cloudsync: 108, benchmark: 115, topQuartile: 125 },
        { cohort: 'FY2026', cloudsync: 98, benchmark: 112, topQuartile: 123 }
      ]
    },
    order: 1
  },
  {
    id: 'exh-cloud-02-cohort-matrix',
    caseStudyId: 'case-cloudsync-nrr',
    title: 'Exhibit 2: Enterprise Tier Retention & Churn Breakdown',
    type: 'TABLE',
    dataPointIds: ['dp-saas-nrr-median-2026', 'dp-saas-gross-margin-2026'],
    tableData: {
      headers: ['Customer Tier (Annual Spend)', 'Beginning ARR', 'Gross Churn', 'Expansion ARR', 'Ending ARR', 'Net NRR'],
      rows: [
        ['Strategic ($250k+)', '$32.0M', '-$2.2M (6.9%)', '+$3.8M (11.9%)', '$33.6M', '105.0%'],
        ['Mid-Market ($50k-$250k)', '$44.0M', '-$5.8M (13.2%)', '+$3.1M (7.0%)', '$41.3M', '93.8% (Danger)'],
        ['Commercial SMB (<$50k)', '$24.0M', '-$4.8M (20.0%)', '+$1.2M (5.0%)', '$20.4M', '85.0% (Severe)']
      ]
    },
    order: 2
  }
];

// =========================================================================
// 6. CANONICAL CASE QUESTIONS
// =========================================================================

export const SEED_QUESTIONS: CaseQuestion[] = [
  // Questions for Case 1: VinMobility Two-Wheeler Expansion
  {
    id: 'cq-vin-01',
    caseStudyId: 'case-vin-mobility-e2w',
    question: 'Structure an executive framework to determine whether VinMobility should launch a dedicated B2B Battery-as-a-Service (BaaS) subscription fleet for ride-hailing and delivery couriers in Hanoi and Ho Chi Minh City.',
    type: 'STRUCTURING',
    skillIds: ['Structuring', 'Market Entry', 'Business Acumen'],
    difficulty: 'INTERMEDIATE',
    expectedApproach: 'Use a MECE 4-pillar structure: 1) Market Attractiveness (Fleet size, mileage demand, regulatory emissions tailwinds); 2) Unit Economics & Driver Value Prop (TCO savings vs gasoline, swap network density, subscription pricing); 3) Operational & Infrastructure Feasibility (Swap station footprint CapEx, battery degradation curves, real estate partnerships); 4) Competitive Defense & Execution Risks (Honda/Yamaha response, grid reliability).',
    hints: [
      'Focus on the distinction between private commuters (who charge overnight at home) vs commercial drivers (who cannot wait 3 hours to charge mid-shift).',
      'Examine the TCO table in Exhibit 2 for the driver value proposition.'
    ],
    answer: 'A strong candidate immediately isolates commercial drivers from casual commuters, recognizing that battery swapping is the only viable infrastructure model for drivers doing >100 km/day. The recommendation framework balances Driver Unit Economics against VinMobility Station CapEx payback.',
    order: 1
  },
  {
    id: 'cq-vin-02',
    caseStudyId: 'case-vin-mobility-e2w',
    question: 'Based on Exhibits 2 and 3 and the industry datapoints, estimate the Total Addressable Market (TAM) in annual revenue for commercial 2-wheeler electric fleet subscriptions in Vietnam.',
    type: 'MARKET_SIZING',
    skillIds: ['Market Sizing', 'Quantitative Reasoning'],
    difficulty: 'INTERMEDIATE',
    expectedCalculation: '850,000 active commercial couriers * $60/month subscription ($720/year) = ~$612 Million USD annually in recurring BaaS revenue, plus upfront vehicle lease revenue of 850,000 / 2.5 year replacement cycle * $1,200 hardware ASP = $408 Million USD/year. Total TAM = ~$1.02 Billion USD/year.',
    expectedApproach: 'Step 1: Size the vehicle pool from Exhibit 3 (850,000 active courier/ride-hail bikes). Step 2: Extract the monthly subscription pricing from Exhibit 2 ($720/year or $60/month). Step 3: Multiply recurring software/swap revenue. Step 4: Add hardware replacement amortization.',
    hints: [
      'Look at Exhibit 3 for the commercial fleet vehicle volume.',
      'Look at Exhibit 2 for the annual fuel/swap subscription rate ($720/year).'
    ],
    answer: 'The annual recurring subscription TAM is approximately $612M, and with hardware replenishment cycles of 2.5 years, the total market exceeds $1.0B annually.',
    exhibitId: 'exh-vin-02-tco-table',
    order: 2
  },
  {
    id: 'cq-vin-03',
    caseStudyId: 'case-vin-mobility-e2w',
    question: 'Evaluate the Station CapEx Payback: A standard battery-swap automated cabinet costs $12,000 installed, houses 12 swappable battery packs ($84/kWh * 2.5 kWh = $210/pack, total $2,520 in battery CapEx), and serves 80 active drivers per day. Calculate the gross payback period in months.',
    type: 'QUANTITATIVE',
    skillIds: ['Unit Economics', 'Quantitative Reasoning'],
    difficulty: 'INTERMEDIATE',
    expectedCalculation: 'Total Station CapEx = $12,000 (cabinet) + $2,520 (batteries) = $14,520. Monthly revenue per station = 80 drivers * $60/month = $4,800. Monthly electricity utility cost (80 drivers * 2.5 kWh/swap * $0.08/kWh * 30 days) = ~$480/month. Gross monthly profit per station = $4,800 - $480 = $4,320. Payback period = $14,520 / $4,320 = ~3.4 months!',
    expectedApproach: '1) Sum total CapEx (cabinet + batteries). 2) Calculate monthly revenue from 80 drivers. 3) Deduct wholesale grid electricity costs. 4) Divide CapEx by monthly contribution.',
    hints: [
      'Remember to add the cost of the 12 battery packs to the cabinet installation cost.',
      'Each driver pays $60/month into the subscription pool.'
    ],
    answer: 'The gross hardware payback is remarkably fast at approximately 3.4 months per station, illustrating that swap networks in dense urban markets have exceptionally strong capital returns once driver density exceeds 60 users per station.',
    order: 3
  },
  {
    id: 'cq-vin-04',
    caseStudyId: 'case-vin-mobility-e2w',
    question: 'Synthesize your final strategic recommendation to the Board of Directors. What is the single biggest operational risk and how should VinMobility mitigate it?',
    type: 'RECOMMENDATION',
    skillIds: ['Recommendation', 'Synthesis', 'Strategic Thinking'],
    difficulty: 'INTERMEDIATE',
    expectedApproach: 'Structure as: 1) Clear GO decision with conviction; 2) Key financial thesis (3.4 month station payback, $750/yr driver savings); 3) Primary Risk: Real-estate access for swap cabinets in prime urban locations (competing with convenience stores/gas stations); 4) Mitigation: Exclusive long-term revenue-share master lease agreements with nationwide retail chains (e.g. WinMart, Circle K) to lock out competitors.',
    hints: [
      'Start with a direct answer: "I recommend that VinMobility greenlight the commercial fleet expansion."',
      'Address the barrier to entry: what prevents Honda from copying this in 18 months?'
    ],
    answer: 'Direct GO recommendation backed by rapid payback economics. The primary bottleneck is prime physical real-estate for swap stations; locking down convenience store partnerships creates an insurmountable territorial moat before Japanese legacy OEMs enter.',
    order: 4
  },

  // Questions for Case 2: CloudSync NRR
  {
    id: 'cq-cloud-01',
    caseStudyId: 'case-cloudsync-nrr',
    question: 'Diagnose CloudSync\'s plunging Net Revenue Retention (NRR) in Exhibit 1 and Exhibit 2. Identify the root cause across customer tiers and calculate overall company NRR for FY2026.',
    type: 'QUANTITATIVE',
    skillIds: ['Quantitative Reasoning', 'Business Acumen'],
    difficulty: 'ADVANCED',
    expectedCalculation: 'Total Beginning ARR = $32M + $44M + $24M = $100.0M. Total Churn = $2.2M + $5.8M + $4.8M = $12.8M. Total Expansion = $3.8M + $3.1M + $1.2M = $8.1M. Total Ending ARR = $100M - $12.8M + $8.1M = $95.3M. Overall FY2026 NRR = $95.3M / $100.0M = 95.3%. Root cause: Mid-Market and SMB churn is exceeding expansion by 2x due to seat license layoffs and lack of usage metering.',
    hints: [
      'Net Revenue Retention = (Beginning ARR - Churn + Expansion) / Beginning ARR.',
      'Compare the Strategic tier (105% NRR) with Mid-Market (93.8%) and SMB (85.0%).'
    ],
    answer: 'Overall NRR is 95.3%, indicating the existing customer base is shrinking in net value. The decay is concentrated in the Mid-Market ($50k-$250k) and SMB tiers.',
    exhibitId: 'exh-cloud-02-cohort-matrix',
    order: 1
  },
  {
    id: 'cq-cloud-02',
    caseStudyId: 'case-cloudsync-nrr',
    question: 'CloudSync\'s product team proposes adding an un-metered Generative AI Assistant feature for all Enterprise tiers to stop churn. Based on Industry Intelligence data regarding AI compute gross margin drag, evaluate the risks of this proposal and suggest an alternative pricing architecture.',
    type: 'BRAINSTORMING',
    skillIds: ['Pricing', 'Product Strategy', 'Unit Economics'],
    difficulty: 'ADVANCED',
    expectedApproach: '1) Highlight the 400-600 bps margin drag from un-metered LLM inference. 2) Note that heavy users will erode gross margins below 70%. 3) Propose alternative hybrid architecture: Include baseline bundle of 500 queries/seat/month, with automated billing for overage credits ($10 per 1,000 queries) and model routing to smaller distilled models for simple queries.',
    hints: [
      'Review Industry Intelligence on AI compute gross margin drag.',
      'Un-metered flat-rate pricing creates a moral hazard where the most active users cost the company more than they pay.'
    ],
    answer: 'Reject un-metered flat rate. Implement hybrid platform fee + token consumption tiering with smart model distillation.',
    order: 2
  }
];

// =========================================================================
// 7. COMPREHENSIVE CASE STUDIES
// =========================================================================

export const SEED_CASE_STUDIES: CaseStudy[] = [
  {
    id: 'case-vin-mobility-e2w',
    title: 'VinMobility: Southeast Asian Commercial Two-Wheeler Fleet Electrification',
    slug: 'vinmobility-electric-two-wheeler-fleet',
    description: 'Evaluate whether a regional mobility manufacturer should launch a capital-intensive Battery-as-a-Service (BaaS) and commercial two-wheeler electric subscription fleet for 850,000 urban delivery couriers across Vietnam and Southeast Asia.',
    domainId: 'Enterprise SaaS',
    industryId: 'ind-ev',
    geography: 'Vietnam',
    caseTypeIds: ['MARKET_ENTRY', 'MARKET_SIZING', 'PROFITABILITY', 'OPERATIONS'],
    difficulty: 'INTERMEDIATE',
    context: 'Urban delivery drivers and ride-hailing couriers in Southeast Asia represent the most fuel-intensive vehicle demographic on city streets, traveling 120 km per day. While electric passenger car adoption remains bottlenecked by high vehicle CapEx, battery-swappable electric scooters have achieved critical TCO parity with internal combustion engines. VinMobility must decide whether to pivot from consumer retail to a dedicated B2B fleet operator model.',
    objective: 'Determine whether VinMobility should enter the commercial B2B electric two-wheeler fleet market, size the addressable revenue opportunity, validate the battery-swap station unit economics, and formulate a competitive defense strategy against Japanese legacy motorcycle manufacturers.',
    setup: 'You are advising the CEO and Board of Directors of VinMobility. You have access to national vehicle registration statistics, battery chemistry cost curves, commercial driver TCO breakdowns, and station infrastructure economics.',
    questionIds: ['cq-vin-01', 'cq-vin-02', 'cq-vin-03', 'cq-vin-04'],
    exhibitIds: ['exh-vin-01-pen-curve', 'exh-vin-02-tco-table', 'exh-vin-03-fleet-tam'],
    industryReportIds: ['rep-vietnam-mot-2026', 'rep-mckinsey-auto-2026', 'rep-iea-ev-2026'],
    dataPointIds: [
      'dp-vn-2w-sales-2026',
      'dp-vn-2w-ev-share-2026',
      'dp-vn-commercial-tco-savings',
      'dp-battery-cost-2026'
    ],
    intelligenceIds: ['intel-sea-e2w-fleet-acceleration', 'intel-battery-cost-parity'],
    knowledgeIds: ['concept-unit-economics', 'concept-first-principles'],
    frameworkIds: ['Porter\'s Five Forces', 'Total Cost of Ownership (TCO)', 'Unit Economics'],
    skillIds: [
      'Structuring',
      'Market Sizing',
      'Market Entry',
      'Unit Economics',
      'Quantitative Reasoning',
      'Recommendation'
    ],
    sourceResourceIds: ['rep-vietnam-mot-2026', 'rep-mckinsey-auto-2026', 'rep-iea-ev-2026'],
    estimatedTime: 45,
    recommendedLevel: 'Senior Product Manager / Strategy Consultant',
    solution: 'VinMobility should aggressively enter the commercial B2B two-wheeler market with an integrated vehicle lease + battery-swap subscription package at $60/month. The economics demonstrate a 3.4 month CapEx payback per swap cabinet and $750/year in net fuel savings for the driver. Securing exclusive physical retail real estate for swap cabinets provides an unbeatable first-mover advantage against legacy Japanese manufacturers.',
    solutionFramework: '1) Market Sizing TAM ($1.02B/yr); 2) Unit Economics ($4,320/mo gross margin per station, 3.4 mo payback); 3) Real Estate Lockup Moat.',
    expectedApproach: 'MECE market sizing followed by detailed station-level unit economics and competitive barrier synthesis.',
    qualityScore: 98,
    status: 'active',
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-03-05T08:00:00Z'
  },
  {
    id: 'case-cloudsync-nrr',
    title: 'CloudSync: Halting Enterprise Churn & Restructuring SaaS Unit Economics',
    slug: 'cloudsync-nrr-retention-pricing',
    description: 'Analyze why a $100M ARR collaborative SaaS platform has seen Net Revenue Retention decline to 95.3%, evaluate the risks of un-metered AI feature bundling, and design a modern consumption-based pricing overhaul.',
    domainId: 'Enterprise SaaS',
    industryId: 'ind-saas',
    geography: 'Global',
    caseTypeIds: ['PROFITABILITY', 'PRICING', 'GROWTH', 'PRODUCT'],
    difficulty: 'ADVANCED',
    context: 'CloudSync expanded rapidly during the 2021-2023 tech boom by selling flat-rate per-seat annual licenses. In 2025-2026, enterprise clients downsized headcount and consolidated software spend, causing massive seat down-sell. Meanwhile, adding generative AI functionality caused hosting compute costs to jump, squeezing gross margins.',
    objective: 'Diagnose the cohort-level drivers of retention degradation, evaluate the gross margin impact of GenAI feature sets, and architect a 90-day turnaround strategy to return NRR above 115%.',
    setup: 'You are the VP of Product Strategy presenting to the executive leadership team. Analyze the cohort retention matrix and industry benchmarks.',
    questionIds: ['cq-cloud-01', 'cq-cloud-02'],
    exhibitIds: ['exh-cloud-01-nrr-bench', 'exh-cloud-02-cohort-matrix'],
    industryReportIds: ['rep-gartner-saas-2026', 'rep-bain-pe-2026'],
    dataPointIds: [
      'dp-saas-nrr-median-2026',
      'dp-saas-gross-margin-2026',
      'dp-saas-cac-payback-2026'
    ],
    intelligenceIds: ['intel-saas-nrr-compression', 'intel-saas-ai-gross-margin-drag'],
    knowledgeIds: ['concept-unit-economics'],
    frameworkIds: ['SaaS Metrics Decomposition', 'Value-Based Pricing', 'Gross Margin Optimization'],
    skillIds: [
      'Pricing',
      'Quantitative Reasoning',
      'Product Strategy',
      'Unit Economics',
      'Strategic Thinking'
    ],
    sourceResourceIds: ['rep-gartner-saas-2026', 'rep-bain-pe-2026'],
    estimatedTime: 50,
    recommendedLevel: 'Director of Product / Principal Systems Architect',
    solution: 'Transition CloudSync from a pure seat-based model to a hybrid model with lower baseline seat cost plus metered active usage and AI token quotas. Sunset manual discounting in Mid-Market and institute automated renewal health monitoring.',
    qualityScore: 96,
    status: 'active',
    createdAt: '2026-03-08T10:00:00Z',
    updatedAt: '2026-03-08T10:00:00Z'
  }
];
