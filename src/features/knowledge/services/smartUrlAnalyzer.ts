import { 
  ToolPlatformEntry, 
  ToolCategory, 
  IngestionSourceState 
} from '../types/toolsPlatforms';

export interface AnalyzedUrlResult {
  name: string;
  companyProvider: string;
  tagline: string;
  category: ToolCategory;
  subcategory: string;
  primaryDomain: string;
  targetUsers: string;
  officialWebsite: string;
  productUrl: string;
  sourceUrl: string;
  sourceName: string;
  sourceType: string;
  version: string;
  releaseDate: string;
  observedDate: string;
  lastVerified: string;
  dataSourceDate: string;
  status: 'Current' | 'Beta' | 'Experimental';
  sourceState: IngestionSourceState;
  capabilitiesSummary: {
    keyCapacities: string[];
    howItWorks: string;
    productPhilosophy: string;
    usageAndStorage: {
      usageModel: string;
      storageModel: string;
      dataModel: string;
      limits: string;
      hosting: 'Cloud SaaS' | 'Self-Hosted' | 'Local / Desktop' | 'Hybrid' | 'Edge';
      dataRetention: string;
      environment: 'Local' | 'Cloud' | 'Hybrid';
      consumptionModel: string;
    };
    integrations: {
      apis: string[];
      sdks: string[];
      connectors: string[];
      nativeIntegrations: string[];
      mcpSupport?: string;
      webhooks: string;
      importExport: string;
      automationIntegrations: string[];
    };
    userExperiences: {
      primaryInteractions: string[];
      details: string;
    };
    bestSuitedFor: {
      userTypes: string[];
      teams: string[];
      companySizes: string[];
      useCases: string[];
      workflows: string[];
      industries: string[];
      technicalLevel: 'No-Code' | 'Low-Code' | 'Pro-Code' | 'All Levels';
    };
    otherSupportingFeatures: string[];
  };
  relevantRoles: string[];
  relatedSkills: { name: string; category?: string; proficiency?: 'Fundamental' | 'Practitioner' | 'Expert' }[];
  relatedWorkPathways: string[];
}

/**
 * Intelligent URL analyzer that parses URLs (GitHub, SaaS, Docs, Cloud platforms)
 * and generates structured 8-part capability profiles with AI suggestion flags.
 */
export function analyzeToolPlatformUrl(rawUrl: string): AnalyzedUrlResult {
  let cleanedUrl = rawUrl.trim();
  if (!cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
    cleanedUrl = 'https://' + cleanedUrl;
  }

  let hostname = '';
  let pathname = '';
  try {
    const parsed = new URL(cleanedUrl);
    hostname = parsed.hostname.toLowerCase().replace('www.', '');
    pathname = parsed.pathname;
  } catch {
    hostname = cleanedUrl.toLowerCase();
  }

  const currentDate = new Date().toISOString().split('T')[0];

  // Specific domain presets for famous technology hubs
  if (hostname.includes('github.com')) {
    const parts = pathname.split('/').filter(Boolean);
    const org = parts[0] || 'Open Source Project';
    const repo = parts[1] || 'Library';
    const capitalizedRepo = repo.charAt(0).toUpperCase() + repo.slice(1);

    return {
      name: capitalizedRepo,
      companyProvider: `${org} (Open Source Community)`,
      tagline: `High-performance open-source repository and developer tool hosted on GitHub.`,
      category: 'Developer Tools',
      subcategory: 'Open Source Software & Tooling',
      primaryDomain: 'Software Engineering & Open Source',
      targetUsers: 'Software engineers, systems developers, and open-source contributors.',
      officialWebsite: `https://github.com/${org}/${repo}`,
      productUrl: cleanedUrl,
      sourceUrl: cleanedUrl,
      sourceName: `GitHub: ${org}/${repo}`,
      sourceType: 'Code Repository',
      version: 'v1.0.0-latest',
      releaseDate: currentDate,
      observedDate: currentDate,
      lastVerified: currentDate,
      dataSourceDate: currentDate,
      status: 'Current',
      sourceState: 'AI Suggested',
      capabilitiesSummary: {
        keyCapacities: [
          `Core modular command-line and programmatic runtime for ${capitalizedRepo}`,
          'Automated CI/CD workflow integration via GitHub Actions',
          'Standardized semantic versioning and release asset distributions',
          'Extensible plugin architecture with community-driven issue triage'
        ],
        howItWorks: `Executes locally or within containerized pipelines. Written in high-efficiency systems architecture, exposing both a CLI command surface and programmable library bindings.`,
        productPhilosophy: `Open-source transparency, community ownership, zero proprietary lock-in, and reproducible developer workflows.`,
        usageAndStorage: {
          usageModel: 'Free open source license (MIT / Apache 2.0 / GPL)',
          storageModel: 'Local disk and ephemeral workspace file systems',
          dataModel: 'File system artifacts, abstract syntax trees, and configuration files',
          limits: 'Bounded by local host compute, memory, and container specifications',
          hosting: 'Self-Hosted',
          dataRetention: 'Local git history and build artifact retention',
          environment: 'Local',
          consumptionModel: 'Free and open source'
        },
        integrations: {
          apis: ['Command-line flags and IPC pipes'],
          sdks: ['Node.js / Python / Rust native bindings'],
          connectors: ['GitHub Actions, Docker, Homebrew, Package Managers'],
          nativeIntegrations: ['Git CLI, Terminal emulators, VS Code'],
          mcpSupport: `Model Context Protocol tool bindings for repository inspection and automated code execution`,
          webhooks: 'GitHub commit and release notification webhooks',
          importExport: 'Standard JSON, YAML, and Tarball formats',
          automationIntegrations: ['GitHub Actions, Make, Docker Compose']
        },
        userExperiences: {
          primaryInteractions: ['CLI', 'API', 'IDE', 'Desktop'],
          details: `Direct command line execution with terminal flags (--help, --verbose), shell completions, and config dotfiles.`
        },
        bestSuitedFor: {
          userTypes: ['Software Engineers', 'DevOps Specialists', 'Open Source Maintainers'],
          teams: ['Core Infrastructure Squads', 'Platform Teams'],
          companySizes: ['Individual devs to Global Tech Organizations'],
          useCases: ['Developer automation', 'Build pipelines', 'Microservice utilities'],
          workflows: ['Pre-commit hooks', 'Pull request verification', 'Release deployment'],
          industries: ['Software & Technology', 'Internet Infrastructure'],
          technicalLevel: 'Pro-Code'
        },
        otherSupportingFeatures: [
          'Detailed Markdown README and documentation badges',
          'Automated security vulnerability alerts via Dependabot',
          'Community discussion forums and issue templates'
        ]
      },
      relevantRoles: ['Software Engineering', 'DevOps & Cloud'],
      relatedSkills: [
        { name: 'Git Workflow & Version Control', category: 'Software Engineering', proficiency: 'Expert' },
        { name: 'Open Source Maintenance & Tooling', category: 'DevOps', proficiency: 'Practitioner' }
      ],
      relatedWorkPathways: ['Repository Setup & Branching Strategy', 'Feature Delivery & Production Engineering Lifecycle']
    };
  }

  if (hostname.includes('vercel.com')) {
    return {
      name: 'Vercel',
      companyProvider: 'Vercel, Inc.',
      tagline: 'Frontend cloud platform combining developer experience with global edge delivery.',
      category: 'Cloud Infrastructure',
      subcategory: 'Frontend Cloud & Edge Serverless Hosting',
      primaryDomain: 'Cloud Infrastructure & Web Engineering',
      targetUsers: 'Frontend developers, Next.js engineers, design systems leads, and digital teams.',
      officialWebsite: 'https://vercel.com',
      productUrl: 'https://vercel.com/products/frontend-cloud',
      sourceUrl: cleanedUrl,
      sourceName: 'Vercel Platform Specifications',
      sourceType: 'Official Documentation',
      version: 'Vercel Platform 2026',
      releaseDate: '2020-04-21',
      observedDate: currentDate,
      lastVerified: currentDate,
      dataSourceDate: currentDate,
      status: 'Current',
      sourceState: 'AI Suggested',
      capabilitiesSummary: {
        keyCapacities: [
          'Zero-configuration Git push to production deployments with preview URLs',
          'Global Edge Network with incremental static regeneration (ISR) and smart caching',
          'Vercel AI SDK integration with streaming UI components and multi-model routing',
          'Serverless & Edge Functions executing sub-millisecond dynamic compute globally'
        ],
        howItWorks: 'Connects directly to your Git repository. On push, build systems compile frontend assets, distribute static files to hundreds of Anycast edge locations, and deploy serverless functions.',
        productPhilosophy: 'Develop, preview, ship. Make the web faster by eliminating infrastructure setup for frontend engineering teams.',
        usageAndStorage: {
          usageModel: 'Hobby free tier; Pro per-seat subscription with usage-based bandwidth and compute pooling.',
          storageModel: 'Edge KV, Edge Config, Edge Blob, and Vercel Postgres.',
          dataModel: 'Edge key-value stores, JSON configuration tokens, and binary blob files.',
          limits: 'Tens of millions of daily serverless requests with 99.99% uptime SLA.',
          hosting: 'Cloud SaaS',
          dataRetention: 'Immutable deployment previews preserved indefinitely.',
          environment: 'Cloud',
          consumptionModel: 'Per-seat fee + Edge compute executions + egress gigabytes'
        },
        integrations: {
          apis: ['Vercel REST API for deployment, DNS, and project management'],
          sdks: ['Vercel CLI', 'Vercel AI SDK (TypeScript & Python)'],
          connectors: ['GitHub, GitLab, Bitbucket, Supabase, Neon, Contentful'],
          nativeIntegrations: ['Next.js, SvelteKit, Nuxt, Astro, Remix, Vite'],
          mcpSupport: 'Vercel MCP integration allowing AI IDEs to check deployment status and build logs',
          webhooks: 'Deployment state change webhooks (READY, ERROR, CANCELED)',
          importExport: 'Environment variable sync via CLI and .env export',
          automationIntegrations: ['GitHub PR comments, Slack notifications, Datadog log drains']
        },
        userExperiences: {
          primaryInteractions: ['Web App', 'CLI', 'API', 'Dashboard'],
          details: 'Visual dashboard with live build stream telemetry, real-time analytics, and visual preview comments.'
        },
        bestSuitedFor: {
          userTypes: ['Frontend Engineers', 'Full-Stack Developers', 'Product Designers'],
          teams: ['Web Experience Squads', 'Growth Teams', 'Startup Founders'],
          companySizes: ['Indie developers to Global E-Commerce Brands'],
          useCases: ['Next.js web apps', 'Marketing landing pages', 'AI streaming chat interfaces'],
          workflows: ['Git commit preview reviews', 'A/B testing via Edge Middleware'],
          industries: ['E-Commerce', 'SaaS', 'Media & Publishing', 'Digital Agencies'],
          technicalLevel: 'All Levels'
        },
        otherSupportingFeatures: [
          'Speed Insights: real user Web Vitals monitoring and performance scores',
          'Firewall & DDoS mitigation at the edge with custom WAF rules',
          'Preview deployment password protection and SSO gatekeeper'
        ]
      },
      relevantRoles: ['Software Engineering', 'DevOps & Cloud', 'Product & Technical Operations'],
      relatedSkills: [
        { name: 'Serverless Edge Deployment & ISR', category: 'Cloud Architecture', proficiency: 'Expert' },
        { name: 'Frontend Web Performance & Core Web Vitals', category: 'Web Engineering', proficiency: 'Expert' }
      ],
      relatedWorkPathways: ['Feature Delivery & Production Engineering Lifecycle', 'CI/CD Pipeline & Automated Deployment']
    };
  }

  // Generic heuristic analysis for any other website or URL
  const nameParts = hostname.split('.');
  const rawBrand = nameParts[0] === 'docs' || nameParts[0] === 'app' || nameParts[0] === 'api' 
    ? (nameParts[1] || nameParts[0]) 
    : nameParts[0];
  const brandName = rawBrand.charAt(0).toUpperCase() + rawBrand.slice(1);

  // Determine category based on common keywords in URL
  let detectedCategory: ToolCategory = 'Developer Tools';
  let detectedSubcategory = 'Technology Platform & Cloud Service';
  let primaryDomain = 'Software Engineering & Cloud Systems';

  if (cleanedUrl.includes('ai') || cleanedUrl.includes('ml') || cleanedUrl.includes('model') || cleanedUrl.includes('neural')) {
    detectedCategory = 'AI & Machine Learning';
    detectedSubcategory = 'Artificial Intelligence & Neural Compute';
    primaryDomain = 'Artificial Intelligence & Data Science';
  } else if (cleanedUrl.includes('data') || cleanedUrl.includes('analytics') || cleanedUrl.includes('query')) {
    detectedCategory = 'Analytics & Data';
    detectedSubcategory = 'Data Intelligence & Analytics Processing';
    primaryDomain = 'Data Engineering & Analytics';
  } else if (cleanedUrl.includes('security') || cleanedUrl.includes('auth') || cleanedUrl.includes('identity')) {
    detectedCategory = 'Security';
    detectedSubcategory = 'Cybersecurity & Identity Infrastructure';
    primaryDomain = 'Cybersecurity & Systems Governance';
  } else if (cleanedUrl.includes('design') || cleanedUrl.includes('creative') || cleanedUrl.includes('figma') || cleanedUrl.includes('vector')) {
    detectedCategory = 'Design & Creative';
    detectedSubcategory = 'Design Systems & Creative Productivity';
    primaryDomain = 'UI/UX & Product Design';
  } else if (cleanedUrl.includes('finance') || cleanedUrl.includes('pay') || cleanedUrl.includes('billing') || cleanedUrl.includes('money')) {
    detectedCategory = 'Finance';
    detectedSubcategory = 'Financial Technology & Transaction Infrastructure';
    primaryDomain = 'Fintech & Financial Operations';
  } else if (cleanedUrl.includes('workflow') || cleanedUrl.includes('automate') || cleanedUrl.includes('pipeline')) {
    detectedCategory = 'Workflow Platforms';
    detectedSubcategory = 'Process Orchestration & Workflow Pipelines';
    primaryDomain = 'Technical Operations & Systems Automation';
  } else if (cleanedUrl.includes('api') || cleanedUrl.includes('swagger') || cleanedUrl.includes('endpoint')) {
    detectedCategory = 'API Platforms';
    detectedSubcategory = 'API Development, Gateway & Contract Management';
    primaryDomain = 'API Platforms & Microservice Architecture';
  } else if (cleanedUrl.includes('db') || cleanedUrl.includes('sql') || cleanedUrl.includes('postgres') || cleanedUrl.includes('mongo')) {
    detectedCategory = 'Databases';
    detectedSubcategory = 'Database Engine & Distributed Storage';
    primaryDomain = 'Database Engineering & Cloud Storage';
  }

  return {
    name: brandName,
    companyProvider: `${brandName} Platform, Inc.`,
    tagline: `Modern platform designed to streamline ${detectedSubcategory.toLowerCase()} with high reliability.`,
    category: detectedCategory,
    subcategory: detectedSubcategory,
    primaryDomain,
    targetUsers: 'Software engineers, technical operators, system architects, and digital product teams.',
    officialWebsite: `https://${hostname}`,
    productUrl: cleanedUrl,
    sourceUrl: cleanedUrl,
    sourceName: `${brandName} Technical Overview`,
    sourceType: 'Online Product URL',
    version: '2026.1 (Current Release)',
    releaseDate: currentDate,
    observedDate: currentDate,
    lastVerified: currentDate,
    dataSourceDate: currentDate,
    status: 'Current',
    sourceState: 'Imported',
    capabilitiesSummary: {
      keyCapacities: [
        `Automated platform capabilities for ${brandName}`,
        'High-availability cloud architecture with enterprise scalability',
        'Developer-friendly APIs and programmatic configuration controls',
        'Centralized dashboard for tracking performance and operational metrics'
      ],
      howItWorks: `Operates via modern cloud infrastructure with optimized data ingestion, event processing pipelines, and standardized client SDK access points.`,
      productPhilosophy: `Focus on developer velocity, operational reliability, composable architecture, and intuitive user experiences.`,
      usageAndStorage: {
        usageModel: 'Freemium or subscription-based usage model with tiered quotas',
        storageModel: 'Managed cloud relational and document persistence with automated backups',
        dataModel: 'Structured JSON configurations and entity relationship models',
        limits: 'Scalable from individual workloads to high-volume enterprise traffic',
        hosting: 'Cloud SaaS',
        dataRetention: 'Standardized data retention with customer export tools',
        environment: 'Cloud',
        consumptionModel: 'Tiered monthly subscription + usage metrics'
      },
      integrations: {
        apis: ['REST API', 'GraphQL API'],
        sdks: ['JavaScript / TypeScript SDK', 'Python SDK'],
        connectors: ['GitHub, Slack, Webhooks, Major Cloud Providers'],
        nativeIntegrations: ['Standard Cloud Ecosystems'],
        mcpSupport: 'Model Context Protocol (MCP) compatible connector for agent tool use',
        webhooks: 'Configurable event notification webhooks',
        importExport: 'JSON and CSV export capabilities',
        automationIntegrations: ['Zapier, Make, n8n, GitHub Actions']
      },
      userExperiences: {
        primaryInteractions: ['Web App', 'API', 'Dashboard', 'CLI'],
        details: 'Modern clean web dashboard supplemented by programmable API endpoints and CLI utilities.'
      },
      bestSuitedFor: {
        userTypes: ['Technical Leads', 'Software Engineers', 'Product Managers', 'DevOps Specialists'],
        teams: ['Engineering Squads', 'Product Operations', 'Growth Teams'],
        companySizes: ['Startups to Mid-Market & Enterprise'],
        useCases: ['System modernization', 'Workflow acceleration', 'Operational governance'],
        workflows: ['Continuous delivery', 'System monitoring', 'Data integration'],
        industries: ['Technology & SaaS', 'E-Commerce', 'Financial Services'],
        technicalLevel: 'All Levels'
      },
      otherSupportingFeatures: [
        'Role-based access control (RBAC)',
        'Audit logs and security compliance settings',
        'Comprehensive documentation with interactive code snippets'
      ]
    },
    relevantRoles: ['Software Engineering', 'DevOps & Cloud', 'Product & Technical Operations'],
    relatedSkills: [
      { name: 'Cloud Integration & Architecture', category: 'Cloud Infrastructure', proficiency: 'Practitioner' },
      { name: 'API Design & Consumption', category: 'Backend Engineering', proficiency: 'Practitioner' }
    ],
    relatedWorkPathways: ['Feature Delivery & Production Engineering Lifecycle', 'API Development & Microservices']
  };
}
