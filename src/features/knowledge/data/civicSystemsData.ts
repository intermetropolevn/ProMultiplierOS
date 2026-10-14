import { CivicSystemEntry } from '../types/civicSystems';

export const CIVIC_SYSTEMS_DATA: CivicSystemEntry[] = [
  {
    id: 'civic-upi-npci',
    name: 'Unified Payments Interface (UPI) & NPCI Digital Public Infrastructure',
    entityType: 'Digital Public Infrastructure',
    countryRegion: 'India (Scaled Internationally: Singapore, UAE, France, Nepal)',
    domain: 'Public Payment Infrastructure & Financial Inclusion',
    missionPurpose: 'Democratize instant real-time retail payments through an open, interoperable, non-proprietary public API switch connecting all commercial banks, fintechs, and citizens.',
    problemAddressed: 'High friction and interchange fees in proprietary card networks, low banking penetration in rural areas, and heavy reliance on cash causing leakages in welfare subsidies.',
    targetPopulation: '1.4 Billion Indian citizens, 350 Million+ active digital payment users, and 50 Million+ micro-merchants.',
    operatingModel: 'Public-utility not-for-profit retail payments infrastructure operated by NPCI under Reserve Bank of India (RBI) oversight. 4-party federation (Remitter Bank, Beneficiary Bank, Remitter App / Third-Party Application Provider like PhonePe/GooglePay, and NPCI Switch) with zero Merchant Discount Rate (MDR) for peer-to-peer and small retail merchants.',
    keyPrograms: [
      'UPI 2.0 (Overdraft accounts, one-time mandates, invoice verification)',
      'UPI 123PAY (Feature-phone payment protocol without internet for rural inclusion)',
      'UPI Lite (On-device wallet for high-volume micropayments under ₹500 without core banking load)',
      'UPI International & Cross-Border Linkage (PayNow Singapore / Liquid Group integration)'
    ],
    services: [
      {
        name: 'Peer-to-Peer (P2P) Instant Transfer',
        description: 'Instant 24x7x365 fund transfer using Virtual Payment Addresses (VPA) / mobile numbers without exposing bank account details.',
        deliveryChannel: 'Mobile Banking Apps & Certified 3rd Party UPI Apps',
        targetGroup: 'General citizens and mobile banking users'
      },
      {
        name: 'Merchant QR Payments (P2M)',
        description: 'Interoperable dynamic and static BharatQR codes enabling instant merchant payments with instant settlement notification.',
        deliveryChannel: 'Soundboxes, POS displays, printed QR stickers',
        targetGroup: 'Retailers, street vendors, e-commerce checkouts'
      },
      {
        name: 'Autopay & Recurring Subscriptions',
        description: 'E-mandate engine allowing citizens to authorize recurring utility bills, mutual fund SIPs, and digital subscriptions.',
        deliveryChannel: 'In-app mandate verification via 2-factor MPIN',
        targetGroup: 'Consumers, utility companies, subscription services'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'NPCI Central Switch',
        role: 'Ultra-low latency message broker & settlement clearing house handling over 500M daily API transactions.',
        architecture: 'High-availability distributed active-active clusters with ISO 8583 and ISO 20022 financial messaging.'
      },
      {
        name: 'Immediate Payment Service (IMPS) Engine',
        role: 'Core backbone clearing layer connecting directly to core banking systems (CBS) of 500+ member banks.',
        architecture: 'Synchronous sub-second interbank clearing rails.'
      },
      {
        name: 'Public Open UPI API Specification',
        role: 'Standardized RESTful / RPC APIs and SDKs allowing licensed third-party apps (TPAPs) to plug into the ecosystem.',
        architecture: 'Tokenized Virtual Payment Address (VPA) resolution layer with PKI asymmetric signing.'
      }
    ],
    digitalCapabilities: [
      'Sub-second interbank settlement latency',
      'Virtual Payment Address (VPA) pseudonymization (no raw bank account exposure)',
      'Interoperable 2-Factor MPIN mobile hardware authentication',
      'Federated multi-bank transaction routing with automated failover retry queues',
      'Dynamic fraud detection scoring across 13+ billion monthly transactions'
    ],
    fundingProcurementModel: 'Owned by a consortium of major banks and regulated by the Reserve Bank of India as a System-Wide Important Payment System. Subsidized by Ministry of Electronics and Information Technology (MeitY) for zero-MDR promotion.',
    stakeholders: [
      { group: 'Central Bank & Regulators', role: 'Reserve Bank of India (RBI) setting systemic liquidity rules, capital adequacy, and data localization mandates.' },
      { group: 'Infrastructure Operator', role: 'National Payments Corporation of India (NPCI) building, maintaining, and certifying switches and APIs.' },
      { group: 'Banking Institutions', role: 'Public and private banks hosting user accounts and honoring debit/credit settlements.' },
      { group: 'Fintech TPAPs', role: 'Google Pay, PhonePe, Paytm, CRED delivering user-friendly UX and acquiring merchants.' },
      { group: 'Citizens & Merchants', role: 'Transacting end-users benefiting from zero fee transactions.' }
    ],
    partners: [
      { name: 'Monetary Authority of Singapore (MAS)', type: 'Central Bank', role: 'Cross-border UPI-PayNow bilateral linkage for low-cost remittance' },
      { name: 'World Bank ID4D', type: 'Multilateral Institution', role: 'Showcasing UPI as global reference DPI model for Global South countries' },
      { name: 'Indian Software Products Industry Round Table (iSPIRT)', type: 'Civic Think Tank', role: 'Architectural conception of India Stack modular layers' }
    ],
    impactAreas: [
      'Financial Inclusion: 350M+ underbanked citizens transacting digitally',
      'Digital Economy: Over $2.2 Trillion annualized transaction value (~50% of Indian GDP)',
      'Cashless Commerce: Reduced currency circulation logistics costs by ~1.5% of GDP',
      'Micro-merchant credit access via transaction ledger proof'
    ],
    relevantRoles: [
      'Software Engineering',
      'Product Management',
      'Security & Systems',
      'DevOps & Cloud',
      'Product & Technical Operations'
    ],
    relatedSkills: [
      { name: 'High-Throughput Distributed Systems', category: 'Backend Engineering', proficiency: 'Expert' },
      { name: 'ISO 20022 Financial Messaging', category: 'Fintech Protocols', proficiency: 'Practitioner' },
      { name: 'Public API Design & Governance', category: 'Platform Engineering', proficiency: 'Expert' },
      { name: 'Zero-Trust PKI & Hardware Cryptography', category: 'Cybersecurity', proficiency: 'Expert' },
      { name: 'Digital Public Infrastructure (DPI) Strategy', category: 'Product Strategy', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'Apache Kafka',
      'Redis Distributed Clusters',
      'Oracle / PostgreSql Core Banking Connectors',
      'HSM Hardware Security Modules (Thales/SafeNet)',
      'Prometheus & OpenTelemetry System Metrics'
    ],
    relatedInnovation: [
      'Decoupled identity from account rails via VPA abstraction',
      'Soundbox IoT devices delivering audio transaction confirmations to illiterate street vendors',
      'Feature-phone payment routing using offline DTMF & IVR telecommunication rails'
    ],
    knowledgeSources: [
      { title: 'NPCI UPI Procedural Guidelines & API Architecture Specs v2.4', type: 'Architecture Spec', publicationDate: '2024-03-15' },
      { title: 'Reserve Bank of India: Payment Vision 2025 Document', type: 'Legislation', publicationDate: '2023-06-10' },
      { title: 'Bank for International Settlements (BIS): The Design of Digital Public Infrastructure - The Case of India Stack', type: 'Whitepaper', publicationDate: '2023-04-18' }
    ],
    officialWebsite: 'https://www.npci.org.in/what-we-do/upi/product-overview',
    sourceUrl: 'https://github.com/iSPIRT/IndiaStack-Docs',
    dateTime: '2026-03-15',
    status: 'Nationwide Scaled',
    versionEdition: 'UPI 2.0 / UPI Lite v2',
    systemRelationships: {
      modelType: 'dpi_ecosystem',
      flowTitle: 'Digital Public Infrastructure (DPI) Federated Payment Delivery Chain',
      nodes: [
        {
          stageLabel: 'National Policy Mandate',
          title: 'RBI & MeitY Financial Inclusion Charter',
          description: 'Legal authorization of unified mobile payment rails and interoperable zero-MDR guidelines.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service Layer',
          title: 'Interoperable Real-Time Settlement Service',
          description: 'Standardized protocol guaranteeing instant fund movement between any two bank accounts.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'NPCI Central Switch & Open UPI APIs',
          description: 'Sub-second routing engine with 99.999% uptime, cryptography verification, and settlement ledger.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Vendors & Licensed Fintechs',
          title: 'Certified TPAPs, Banks & Hardware OEMs',
          description: 'PhonePe, GooglePay, HDFC, SBI, Paytm building client consumer apps and soundbox IoT hardware.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users & Citizens',
          title: '350M+ Consumers & 50M+ Merchants',
          description: 'Street vendors, formal shops, and citizens executing payments without card reader hardware.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Measurable Outcomes',
          title: '$2.2T Annualized Volume & Cash Displacement',
          description: 'Unprecedented financial inclusion and digital credit access for formerly unbanked micro-entrepreneurs.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'A user initiates a payment in any certified app by scanning a QR code or entering a mobile number. The app packages the request with a PKI-signed token to NPCI switch. NPCI maps the recipient VPA to bank IFSC/Account details, queries the remitter bank for MPIN biometric verification, moves ledger balance, and sends sub-second push confirmations to both parties.',
      governanceAndCompliance: 'Operated under Payment and Settlement Systems Act, 2007. Strict data localization mandates; TPAPs cannot store raw banking passwords or unencrypted card numbers; market cap regulations prevent any single private entity from exceeding 30% aggregate transaction volume.',
      citizenJourney: 'Citizen opens any smartphone app, verifies SIM card via SMS OTP once to link bank accounts, sets a 4 or 6-digit MPIN, and can immediately pay any merchant or contact anywhere in the country in under 3 seconds without transaction fees.'
    }
  },
  {
    id: 'civic-singpass-govtech',
    name: 'Singpass & National Digital Identity (GovTech Singapore)',
    entityType: 'Government Agency',
    countryRegion: 'Singapore',
    domain: 'Digital Identity & Citizen Data Exchange (DPI)',
    missionPurpose: 'Provide every citizen and resident of Singapore with a secure, sovereign cryptographic digital identity enabling effortless access to over 2,700 government and private sector services.',
    problemAddressed: 'Fragmented login credentials across government agencies, high risk of phishing, cumbersome physical documentation for banking/insurance onboarding, and identity fraud.',
    targetPopulation: '4.5 Million Singapore citizens, permanent residents, and employment pass holders.',
    operatingModel: 'Built and managed in-house by the Government Technology Agency of Singapore (GovTech) under the Prime Minister’s Office Smart Nation Group. Acts as an OpenID Connect (OIDC) identity provider with zero-trust cryptographic key pairs on user mobile security enclaves.',
    keyPrograms: [
      'Singpass App (Biometric multi-factor authentication, digital IC, driving license)',
      'Myinfo & Myinfo business (Citizen-consented automated profile population for banks & services)',
      'Singpass Face Verification (Cloud biometric facial matching against sovereign passport database)',
      'Sign with Singpass (Legally binding digital cryptographic document signing)'
    ],
    services: [
      {
        name: 'Single Sign-On (SSO) Authentication',
        description: 'FIDO2 / WebAuthn and QR-code mobile authentication for citizen portal logins without static passwords.',
        deliveryChannel: 'Singpass Mobile App (iOS / Android / Huawei)',
        targetGroup: 'All residents interacting with government ministries & banks'
      },
      {
        name: 'Myinfo Data Exchange Service',
        description: 'Government-verified personal data sharing API (income tax, CPF, housing status) with user consent.',
        deliveryChannel: 'REST APIs & OIDC Consent Modals',
        targetGroup: 'Commercial banks, telcos, insurance providers, housing board'
      },
      {
        name: 'Face Verification as a Service',
        description: 'Enables private and public organizations to verify physical presence against the national biometric database.',
        deliveryChannel: 'GovTech Biometric Verification API',
        targetGroup: 'High-security kiosk check-in, banking KYC, polyclinic registration'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'Sovereign Cryptographic HSM Enclave',
        role: 'Hardware Security Modules executing PKI digital signing and sovereign key generation.',
        architecture: 'FIPS 140-2 Level 3 certified hardware.'
      },
      {
        name: 'OpenID Connect (OIDC) Federated Auth Core',
        role: 'RFC-standard authentication gateway exposing scoped identity claims to authorized relying parties.',
        architecture: 'Decoupled OAuth 2.0 / OIDC microservices on Government Commercial Cloud (GCC).'
      },
      {
        name: 'Myinfo Encrypted Vault & Distributed Ledger',
        role: 'Secure aggregation engine pulling verified attributes in real time from CPF, IRAS, and ICA databases.',
        architecture: 'Zero-storage stateless data transit pipeline.'
      }
    ],
    digitalCapabilities: [
      'Passwordless mobile biometric authentication (Touch ID, Face ID)',
      'Stateless data exchange ensuring GovTech does not maintain a centralized honeypot of citizen profile updates',
      'Hardware-backed cryptographic document signatures with non-repudiation',
      'Liveness-detection cloud facial matching preventing spoof attacks'
    ],
    fundingProcurementModel: 'Direct annual budgetary appropriation via Singapore Ministry of Finance; nominal API transaction fee billed to private sector relying parties (banks, telcos) for Myinfo queries, generating cost recovery.',
    stakeholders: [
      { group: 'Lead Agency', role: 'GovTech Singapore designing system architecture, SDKs, and mobile applications.' },
      { group: 'Parent Ministry', role: 'Smart Nation and Digital Government Office (SNDGO) setting digital policy priorities.' },
      { group: 'Public Agencies', role: 'IRAS (Taxes), CPF (Pensions), MOH (Healthcare), HDB (Housing) integrating services.' },
      { group: 'Private Relying Parties', role: 'DBS, OCBC, UOB, Singtel using Singpass APIs for instant credit card / loan approvals.' },
      { group: 'Residents', role: 'Benefiting from 1-click passwordless logins and zero paperwork.' }
    ],
    partners: [
      { name: 'National University of Singapore (NUS) Cyber Security Lab', type: 'Academic', role: 'Post-quantum cryptography resilience research' },
      { name: 'W3C Verifiable Credentials Working Group', type: 'Standards Body', role: 'Alignment with international digital credential standards' }
    ],
    impactAreas: [
      '99% digital identity coverage across the entire adult population',
      'Over 400 Million annual transactions processed',
      'Bank account opening times reduced from 3 days to under 3 minutes via Myinfo',
      'Elimination of physical paper forms across 97% of citizen government services'
    ],
    relevantRoles: [
      'Software Engineering',
      'Security & Systems',
      'Product Management',
      'UI/UX & Product Design',
      'DevOps & Cloud'
    ],
    relatedSkills: [
      { name: 'OAuth 2.0 / OpenID Connect (OIDC)', category: 'Identity Protocols', proficiency: 'Expert' },
      { name: 'Public Key Infrastructure (PKI) & Asymmetric Cryptography', category: 'Security', proficiency: 'Expert' },
      { name: 'Mobile Security Enclave & Biometrics', category: 'Mobile Engineering', proficiency: 'Practitioner' },
      { name: 'Stateless Microservices Architecture', category: 'Cloud Architecture', proficiency: 'Expert' },
      { name: 'Citizen-Centric UX Design', category: 'Product Design', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'AWS / Azure Government Commercial Cloud (GCC)',
      'Kubernetes (OpenShift)',
      'Thales HSMs',
      'HashiCorp Vault',
      'Kong API Gateway'
    ],
    relatedInnovation: [
      'Sign with Singpass eliminating in-person notary signatures during COVID-19',
      'Stateless Myinfo data broker preventing centralized data hoarding',
      'Digital Identity Card with randomized security watermark preventing screenshot counterfeiting'
    ],
    knowledgeSources: [
      { title: 'GovTech Singapore: National Digital Identity (NDI) Technical Whitepaper', type: 'Architecture Spec', publicationDate: '2023-01-20' },
      { title: 'Singapore Public Sector (Governance) Act', type: 'Legislation', publicationDate: '2018-05-15' },
      { title: 'OECD Case Study: Building High Trust in Government Digital Services - Singapore', type: 'Case Study', publicationDate: '2022-11-04' }
    ],
    officialWebsite: 'https://www.singpass.gov.sg',
    sourceUrl: 'https://developer.singpass.gov.sg',
    dateTime: '2026-02-10',
    status: 'Nationwide Scaled',
    versionEdition: 'Singpass NDI v3.2',
    systemRelationships: {
      modelType: 'government_service_delivery',
      flowTitle: 'National Identity Sovereign Service Delivery Pipeline',
      nodes: [
        {
          stageLabel: 'Government Program',
          title: 'Smart Nation Digital Identity Initiative',
          description: 'Cabinet mandate to eliminate usernames and passwords across all public and commercial services.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service',
          title: 'Singpass Authentication & Myinfo Data Exchange',
          description: 'Single sovereign identity credential verifying citizen status, age, income, and legal consent.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'GovTech Sovereign Cloud & Cryptographic HSM Platform',
          description: 'Stateless OIDC broker, biometric facial liveness matching, and hardware-backed signing enclaves.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Vendors & Private Integrators',
          title: '2,700+ Relying Parties (Banks, Insurers, Telcos, Hospitals)',
          description: 'Commercial entities connecting via standard OIDC APIs to automate KYC and logins.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users / Citizens',
          title: '4.5M+ Citizens & Residents',
          description: 'Accessing taxes, healthcare, grants, banking, and real-estate contracts in one tap.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Measurable Impact',
          title: 'Zero Paperwork & Instant Commercial Onboarding',
          description: 'Bank KYC reduced to 3 minutes; 80% reduction in identity fraud cases.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'When logging into a government or banking portal, the user selects "Log in with Singpass". The portal redirects via OIDC to GovTech auth servers, generating a unique cryptographic QR code. The user scans the QR with the Singpass App, authenticates via TouchID/FaceID on their local device enclave, and GovTech returns a short-lived signed JWT assertion token back to the relying portal.',
      governanceAndCompliance: 'Regulated under the Singapore Public Sector (Governance) Act and Personal Data Protection Act (PDPA). Data sharing via Myinfo requires explicit opt-in confirmation with itemized attribute checklists.',
      citizenJourney: 'Citizen taps "Log in with Singpass", glides their finger over phone biometric sensor, immediately views customized dashboard with pre-populated tax filings, grants, and pension balances.'
    }
  },
  {
    id: 'civic-govuk-gds',
    name: 'GOV.UK & Government Digital Service (GDS - UK Cabinet Office)',
    entityType: 'Public Platform',
    countryRegion: 'United Kingdom',
    domain: 'Digital Government & Public Service Portals',
    missionPurpose: 'Deliver simpler, clearer, faster government services unified under a single accessible web domain, guided by open-source design systems and strict user research standards.',
    problemAddressed: 'Over 750 separate government websites with confusing bureaucratic language, siloed branding, duplicated infrastructure, and high maintenance costs.',
    targetPopulation: '67 Million UK citizens, residents, and businesses interacting with central government departments.',
    operatingModel: 'Centralized digital transformation team inside the UK Cabinet Office setting digital, data, and technology standards (Service Standard). Operates shared cross-government platforms (GOV.UK Pay, GOV.UK Notify, GOV.UK One Login) available to all civil service departments.',
    keyPrograms: [
      'GOV.UK One Login (Single sign-on and identity verification for all of UK government)',
      'GOV.UK Notify (Free/low-cost multichannel notification engine for text messages, emails, letters)',
      'GOV.UK Pay (Secure payment processing platform for government fees, fines, and permits)',
      'GOV.UK Design System (Open-source accessible WCAG AAA component library and interaction patterns)'
    ],
    services: [
      {
        name: 'Single Domain Publishing (GOV.UK)',
        description: 'Unified content platform providing plain-English guidance on government benefits, taxation, visas, and legal duties.',
        deliveryChannel: 'Web (Responsive HTML, zero client-heavy scripts)',
        targetGroup: 'General public and UK businesses'
      },
      {
        name: 'Shared Notification Rails (GOV.UK Notify)',
        description: 'Enables any civil service department or NHS trust to send transaction notifications via simple REST API.',
        deliveryChannel: 'SMS, Email, Automated Letter Postal Printing',
        targetGroup: 'Over 5,000 public service teams across the UK'
      },
      {
        name: 'Government Payment Gateway (GOV.UK Pay)',
        description: 'Standardized checkout experience for passport fees, vehicle tax, court fees, and local council permits.',
        deliveryChannel: 'Hosted payment pages integrating Stripe / Barclaycard',
        targetGroup: 'Public sector service managers and paying citizens'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'GOV.UK Open Source Publishing Platform',
        role: 'Static site generation and dynamic publishing CMS built with Ruby on Rails, PostgreSQL, and ElasticSearch.',
        architecture: 'Cloud-native multi-AZ Kubernetes deployment with Fastly CDN edge caching.'
      },
      {
        name: 'GOV.UK Design System Core',
        role: 'Component system guaranteeing WCAG 2.1 AA/AAA accessibility and progressive enhancement without mandatory JavaScript.',
        architecture: 'Nunjucks templates, Sass, and vanilla JavaScript.'
      },
      {
        name: 'GOV.UK Notify Distributed Message Queues',
        role: 'High-volume reliable message delivery pipeline with automated telco provider fallback.',
        architecture: 'Python, Celery, AWS SQS, Redis, and multi-vendor SMS aggregators.'
      }
    ],
    digitalCapabilities: [
      'Progressive enhancement (services work seamlessly even if JavaScript fails to load or is disabled)',
      'Plain English reading level enforcement (grade 5 readability rules)',
      'WCAG 2.1 AAA accessibility testing built directly into CI/CD pipelines',
      'Shared cloud platforms (Notify, Pay, One Login) eliminating duplicate department spending'
    ],
    fundingProcurementModel: 'Centrally funded through UK Cabinet Office parliamentary spending reviews. Public procurement executed through the Crown Commercial Service Digital Marketplace (G-Cloud) favoring agile SME vendors over multi-year legacy IT contracts.',
    stakeholders: [
      { group: 'Cabinet Office & GDS', role: 'Platform maintainers, technical architects, and Service Standard assessors.' },
      { group: 'Departmental Delivery Teams', role: 'HMRC (Revenue), DWP (Work & Pensions), Home Office, DVLA building user-facing services.' },
      { group: 'SME Tech Contractors', role: 'Agile digital suppliers winning contracts on the G-Cloud framework.' },
      { group: 'Citizens & Residents', role: 'Navigating government services without needing to understand civil service hierarchy.' }
    ],
    partners: [
      { name: 'Crown Commercial Service (CCS)', type: 'Procurement Agency', role: 'Operating G-Cloud frameworks for transparent IT procurement' },
      { name: 'NHS England', type: 'Public Institution', role: 'Adopting the open-source GOV.UK Design System for the NHS digital frontend' }
    ],
    impactAreas: [
      '£1.2+ Billion saved annually by deprecating hundreds of redundant websites',
      'Over 4.5 Billion emails and text messages sent via GOV.UK Notify at fraction of commercial cost',
      'Global gold standard for digital government imitated by 40+ nations worldwide',
      'Universal accessibility for visually impaired and neurodiverse citizens'
    ],
    relevantRoles: [
      'Product Management',
      'UI/UX & Product Design',
      'Software Engineering',
      'Program & Project Management',
      'Business Analysis & Strategy'
    ],
    relatedSkills: [
      { name: 'User Research & Citizen-Centered Design', category: 'Product Strategy', proficiency: 'Expert' },
      { name: 'WCAG AAA Accessibility Standards', category: 'Frontend Engineering', proficiency: 'Expert' },
      { name: 'Open Standards & Agile Service Assessments', category: 'Governance', proficiency: 'Practitioner' },
      { name: 'Progressive Enhancement Web Engineering', category: 'Frontend', proficiency: 'Expert' },
      { name: 'Shared Platform Architecture', category: 'Cloud Infrastructure', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'Ruby on Rails & Python',
      'Fastly Edge CDN',
      'AWS GovCloud',
      'Terraform & GitHub Actions',
      'ElasticSearch & PostgreSQL'
    ],
    relatedInnovation: [
      'The GDS Design Principles ("Make things open: it makes things better")',
      'GOV.UK Prototype Kit enabling rapid citizen testing with mock services in hours',
      'Automated letter printing API integration for digitally excluded seniors'
    ],
    knowledgeSources: [
      { title: 'The GDS Service Standard: 14 Principles for Public Digital Services', type: 'Open Standard', publicationDate: '2023-09-01' },
      { title: 'National Audit Office: Digital Transformation in Government Evaluation', type: 'Impact Evaluation', publicationDate: '2021-03-10' },
      { title: 'Cabinet Office: Government Functional Standard GovS 005 - Digital, Data and Technology', type: 'Legislation', publicationDate: '2022-04-12' }
    ],
    officialWebsite: 'https://www.gov.uk',
    sourceUrl: 'https://github.com/alphagov',
    dateTime: '2026-01-14',
    status: 'Global Standard',
    versionEdition: 'GOV.UK Platform Release v4.8',
    systemRelationships: {
      modelType: 'government_service_delivery',
      flowTitle: 'Civil Service Reform to Citizen Impact Delivery Model',
      nodes: [
        {
          stageLabel: 'Government Program',
          title: 'Cabinet Office Civil Service Reform',
          description: 'Abolished 750 siloed departmental websites into single domain GOV.UK.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service',
          title: 'GOV.UK Shared Platform Portfolio',
          description: 'Publishing engine, Notify messaging, Pay checkout, and One Login identity verification.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'Open Source Cloud Microservices Stack',
          description: 'Fastly edge CDN, WCAG AAA Design System, Rails & Python pipelines with zero vendor lock-in.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Vendors & SME Suppliers',
          title: 'G-Cloud Agile Procurement Framework',
          description: 'Short sprint contracts awarded to competitive tech consultancies and open-source contributors.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users / Citizens',
          title: '67M UK Citizens & Businesses',
          description: 'Renewing passports, paying council taxes, and claiming child benefits in plain English.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Impact & Outcomes',
          title: '£1.2B Annual Savings & Accessible Civic Delivery',
          description: 'Eliminated redundant servers, halved transaction times, and raised trust in public institutions.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'A citizen searches Google for a life event (e.g., "apply for maternity allowance"). They land on a plain-English GOV.UK step-by-step guide. The form uses the accessible GOV.UK Design System, validates eligibility in real-time, authenticates via GOV.UK One Login, processes the application fee via GOV.UK Pay, and immediately dispatches a tracking SMS via GOV.UK Notify.',
      governanceAndCompliance: 'All public digital services must pass a rigorous 14-point GDS Service Assessment (covering user needs, accessibility, data privacy, and open source code) before moving from Alpha to Beta and Live production.',
      citizenJourney: 'Citizen completes complex government filings in minutes on their mobile phone, with assistive screen-reader compatibility and zero bureaucratic jargon.'
    }
  },
  {
    id: 'civic-givedirectly-cash',
    name: 'GiveDirectly - End-to-End Algorithmic Direct Cash Transfer System',
    entityType: 'NGO',
    countryRegion: 'Global / East Africa (Kenya, Rwanda, Malawi, Liberia, Mozambique)',
    domain: 'Social Innovation & Humanitarian Cash Transfers',
    missionPurpose: 'Reshape international aid by delivering unconditional cash transfers directly into the mobile money wallets of people living in extreme poverty, maximizing recipient agency and minimizing administrative overhead.',
    problemAddressed: 'Paternalistic foreign aid models with high intermediary overheads, misallocated in-kind goods, and lack of dignified recipient autonomy in choosing how to rebuild their livelihoods.',
    targetPopulation: 'Over 1.5 Million individuals and extreme-poverty households living under $2.15/day in remote rural communities and climate-shock zones.',
    operatingModel: 'Direct-to-consumer non-profit delivery pipeline. Replaces traditional logistics with satellite remote sensing, machine learning poverty targeting, biometric deduplication, and automated batch mobile money transfers (M-Pesa / MTN Mobile Money). Over 88% of every donated dollar reaches the recipient directly.',
    keyPrograms: [
      'Universal Basic Income (UBI) 12-Year Longitudinal Experiment (Kenya)',
      'Climate Resilience & Anticipatory Cash (Disbursing cash before predicted cyclones and droughts)',
      'Refugee & Internally Displaced Persons Support (Kiryandongo Camp, Uganda)',
      'Urban Youth Employment Cash Grants (Rwanda & Nigeria)'
    ],
    services: [
      {
        name: 'Unconditional Mobile Cash Transfers',
        description: 'Large lump-sum ($1,000) or monthly recurring transfers delivered directly via mobile money accounts with zero conditional spending rules.',
        deliveryChannel: 'M-Pesa, Airtel Money, MTN Mobile Money GSM wallets',
        targetGroup: 'Extreme poverty households verified by satellite & ground audits'
      },
      {
        name: 'Algorithmic Poverty Verification & Enrolment',
        description: 'Household poverty scoring combining high-resolution satellite imagery (roof types, agricultural assets) and census data.',
        deliveryChannel: 'Offline Field Android App with GPS & biometric capture',
        targetGroup: 'Rural villages and marginalized settlements'
      },
      {
        name: 'Recipient Helpline & Post-Disbursement Auditing',
        description: 'Independent follow-up calling center verifying receipt of funds, investigating extortion or local corruption.',
        deliveryChannel: 'Automated IVR calling, SMS feedback loops, field audit visits',
        targetGroup: 'Enrolled recipients and community elders'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'Satellite Remote Sensing & ML Poverty Model',
        role: 'Computer vision model analyzing Sentinel-2 / Maxar imagery to detect thatched roofs vs metal roofs and livestock assets.',
        architecture: 'PyTorch deep convolutional networks running on cloud GPU instances.'
      },
      {
        name: 'GiveDirectly Core Transfer Ledger & Payment Gateway',
        role: 'Automated batch disbursement pipeline scheduling inter-telco mobile money API payouts.',
        architecture: 'PostgreSQL, Python Django, and direct integrations with Safaricom M-Pesa B2C APIs.'
      },
      {
        name: 'Offline-First Field Android Client',
        role: 'Enables ground enumerators to register citizens in remote areas with zero cellular connectivity.',
        architecture: 'React Native / SQLite client with encrypted store-and-forward synchronization.'
      }
    ],
    digitalCapabilities: [
      'High-throughput B2C mobile money API disbursement handling thousands of payouts in minutes',
      'Satellite-based algorithmic geographic targeting eliminating political favoritism in aid allocation',
      'Biometric SIM card and national ID deduplication preventing phantom beneficiary fraud',
      'Near real-time public financial dashboard showing disbursement velocity and operating costs'
    ],
    fundingProcurementModel: 'Funded via philanthropic endowments, major donor institutions (MacKenzie Scott, Google.org), multilateral grants (USAID, FCDO), and individual donors. Low procurement footprint: capital is directly transferred rather than purchasing grain or tractors.',
    stakeholders: [
      { group: 'NGO Leadership & Data Engineers', role: 'Designing transfer protocols, algorithmic models, and fraud monitoring.' },
      { group: 'Field Enumerators', role: 'Local community members hired to assist elders with SIM registration and phone activation.' },
      { group: 'Telco Mobile Operators', role: 'Safaricom, MTN, Airtel providing mobile money liquidity and cash-out merchant networks.' },
      { group: 'Academic Researchers', role: 'Princeton, MIT JPAL, UC Berkeley conducting independent Randomized Controlled Trials (RCTs).' },
      { group: 'Recipients & Families', role: 'Choosing whether to invest in tin roofs, livestock, school fees, or solar home systems.' }
    ],
    partners: [
      { name: 'MIT Abdul Latif Jameel Poverty Action Lab (J-PAL)', type: 'Academic', role: 'Rigorous randomized evaluation of cash transfer welfare impacts' },
      { name: 'Safaricom (M-Pesa)', type: 'Telco Partner', role: 'Enterprise mobile money infrastructure and merchant agent liquidity' },
      { name: 'Center for Effective Global Action (CEGA)', type: 'Research Institute', role: 'Machine learning poverty mapping methodology co-design' }
    ],
    impactAreas: [
      'Over $700 Million transferred directly to 1.5M+ individuals in poverty',
      '88%+ transfer efficiency: low administrative overhead vs typical 30-50% in legacy aid',
      'Statistically verified increases in child nutrition, female asset ownership, and school completion',
      'Pioneered unconditional cash as the global empirical benchmark for humanitarian aid effectiveness'
    ],
    relevantRoles: [
      'Data Analytics & BI',
      'Product Management',
      'Software Engineering',
      'Program & Project Management',
      'Product & Technical Operations'
    ],
    relatedSkills: [
      { name: 'Mobile Money Rails & B2C Telecom APIs', category: 'Fintech Protocols', proficiency: 'Expert' },
      { name: 'Satellite Imagery & Geospatial Machine Learning', category: 'Data Science', proficiency: 'Practitioner' },
      { name: 'Randomized Controlled Trial (RCT) Metrics', category: 'Impact Evaluation', proficiency: 'Expert' },
      { name: 'Offline-First Mobile Architecture', category: 'Mobile Engineering', proficiency: 'Practitioner' },
      { name: 'Anti-Fraud & Beneficiary Deduplication', category: 'Security & Ops', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'Python & PyTorch',
      'Safaricom Daraja M-Pesa API',
      'QGIS & Google Earth Engine',
      'PostgreSQL & Metabase',
      'Twilio IVR & SMS Engine'
    ],
    relatedInnovation: [
      'Anticipatory cash transfers triggered automatically by satellite weather forecasts before floods hit',
      'Open-source poverty mapping using satellite imagery and cellphone call detail records (CDR)',
      'Complete transparency ledger allowing donors to track money flows down to village level'
    ],
    knowledgeSources: [
      { title: 'The Long-Term Impact of Unconditional Cash Transfers: Evidence from an 8-Year RCT (Haushofer & Shapiro)', type: 'Impact Evaluation', publicationDate: '2023-05-12' },
      { title: 'GiveDirectly Operating Model Whitepaper: Algorithmic Targeting and Cash Efficiency', type: 'Whitepaper', publicationDate: '2022-09-18' },
      { title: 'World Bank: Managing Social Protection Payments Through Mobile Money Networks', type: 'Case Study', publicationDate: '2023-11-20' }
    ],
    officialWebsite: 'https://www.givedirectly.org',
    sourceUrl: 'https://github.com/GiveDirectly',
    dateTime: '2026-02-28',
    status: 'Operational',
    versionEdition: 'GiveDirectly Operating Model 2026',
    systemRelationships: {
      modelType: 'ngo_social_delivery',
      flowTitle: 'Direct-to-Recipient Algorithmic Cash Transfer Pipeline',
      nodes: [
        {
          stageLabel: 'NGO Mission & Initiative',
          title: 'Extreme Poverty Direct Cash Program',
          description: 'Deploy donor capital directly to the extreme poor with sub-10% administrative overhead.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Target Population',
          title: 'Vulnerable Rural Communities & Shock Zones',
          description: 'Villages identified via satellite poverty mapping living under $2.15/day.',
          colorClass: 'bg-teal-600 text-white'
        },
        {
          stageLabel: 'Delivery Model',
          title: 'Algorithmic Targeting & Offline Enrolment',
          description: 'Ground teams verify identities, distribute SIM cards, and perform biometric deduplication.',
          colorClass: 'bg-cyan-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'Automated Payout Engine & Telecom Gateway',
          description: 'Direct API batch integration with Safaricom M-Pesa and MTN Mobile Money networks.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Partners & Agents',
          title: 'Local Cash-Out Agents & Telecom Operators',
          description: 'Rural mobile money agents providing physical currency liquidity when recipients choose to withdraw.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Measurable Outcomes',
          title: '88% Aid Efficiency & Sustainable Asset Growth',
          description: 'Recipients invest in durable tin roofs, clean water, education, and livestock with dignified autonomy.',
          colorClass: 'bg-blue-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'Satellite algorithms identify geographic poverty clusters. Field enumerators visit villages with offline-first tablets to register households. The system verifies beneficiary phone numbers against sovereign ID databases. A scheduled batch job invokes Safaricom M-Pesa B2C APIs to deposit funds directly into recipient SIM wallets. Follow-up automated calls audit receipt of funds and screen for coercive extraction.',
      governanceAndCompliance: 'Subject to 501(c)(3) regulatory reporting and AML/KYC checks under central bank mobile money regulations in each host country. Governed by independent RCT monitoring with results published unconditionally.',
      citizenJourney: 'A rural woman receives an SMS notification on her phone that $1,000 has arrived. She walks to the local village shop, cashes out what she needs without fee, buys iron roof sheets and goats, and enrolls her children in secondary school.'
    }
  },
  {
    id: 'civic-xroad-estonia',
    name: 'X-Road & e-Estonia Sovereign Data Exchange Ecosystem',
    entityType: 'Digital Public Infrastructure',
    countryRegion: 'Estonia (Standardized across Finland, Iceland, Japan through NIIS)',
    domain: 'Data Interoperability & Digital Government Architecture',
    missionPurpose: 'Enable secure, distributed, legally binding data exchange between disparate public registries and private institutions based on the "Once-Only" principle.',
    problemAddressed: 'Siloed government databases requiring citizens to repeatedly submit identical data to different departments, high vulnerability of centralized databases to cyberattacks, and lack of citizen auditability over who views their confidential records.',
    targetPopulation: '1.3 Million Estonian citizens and over 100,000 global e-Residents.',
    operatingModel: 'Distributed, decentralized data exchange layer maintained by the Estonian Information System Authority (RIA) and the Nordic Institute for Interoperability Solutions (NIIS). No single central database; each agency retains full sovereignty over its data registry while exposing standard X-Road Security Servers.',
    keyPrograms: [
      'The "Once-Only" Principle (Prohibits government agencies from asking citizens for data already held by another state registry)',
      'e-Residency (Digital identity and EU company establishment for global entrepreneurs)',
      'Data Embassy (Sovereign Estonian data backup and state continuity hosting in Luxembourg data centers)',
      'KSI Blockchain Timestamping (Mathematical proof of ledger integrity for all state records)'
    ],
    services: [
      {
        name: 'Distributed Cross-Agency Data Querying',
        description: 'Secure machine-to-machine querying allowing police, tax, and healthcare authorities to access needed records in real time.',
        deliveryChannel: 'Encrypted Security Server TLS endpoints',
        targetGroup: 'Over 1,000 connected organizations and public registries'
      },
      {
        name: 'Citizen Data Access Tracking (Data Tracker)',
        description: 'Enables citizens to see every single instance when a public official or doctor viewed their personal data.',
        deliveryChannel: 'e-Estonia State Citizen Portal (eesti.ee)',
        targetGroup: 'All Estonian residents and ID card holders'
      },
      {
        name: 'i-Voting (Internet Voting System)',
        description: 'Remote parliamentary and municipal elections voting using cryptographic digital ID cards and mobile ID.',
        deliveryChannel: 'Secure downloadable voting client',
        targetGroup: 'Estonian electorate worldwide'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'X-Road Security Server Nodes',
        role: 'Gateway software installed at each organization ensuring mutual TLS, digital signing, and message logging.',
        architecture: 'Open-source Java/Spring Boot daemon with cryptographic timestamping.'
      },
      {
        name: 'Central Server Registry & Trust Federation',
        role: 'Maintains list of certified members, CRL revocation lists, and trusted Certification Authorities (CAs).',
        architecture: 'PKI-based trust anchor server with high-availability replication.'
      },
      {
        name: 'Keyless Signature Infrastructure (KSI) Blockchain',
        role: 'Guarantees unalterable audit trails of state registry operations without relying on asymmetric keys that could be broken.',
        architecture: 'Hash-tree calendar blockchain developed by Guardtime.'
      }
    ],
    digitalCapabilities: [
      'Decentralized architecture (no single point of failure or centralized state honey-pot to hack)',
      'Cryptographically signed and timestamped non-repudiable audit logs',
      'Strict citizen sovereignty: illegitimate viewing of citizen records by civil servants triggers automated internal affairs alarms',
      'Seamless cross-border interoperability (Estonian and Finnish X-Road systems exchange data directly)'
    ],
    fundingProcurementModel: 'Centrally funded through Estonian state digital budget and European Union structural funds (NextGenerationEU). Managed multilaterally via NIIS (jointly funded by Estonia, Finland, and Iceland).',
    stakeholders: [
      { group: 'RIA (Information System Authority)', role: 'Estonian national coordinator managing central trust servers and incident response (CERT-EE).' },
      { group: 'NIIS (Nordic Institute)', role: 'Core open-source software development and international standard governance.' },
      { group: 'State Registries', role: 'Tax & Customs Board, Population Register, Health Insurance Fund, Police Board maintaining data.' },
      { group: 'Private Enterprises', role: 'Banks, telecom operators, private clinics participating as trusted X-Road nodes.' },
      { group: 'Estonian Citizens & e-Residents', role: 'Accessing 99% of state services online (only marriage/divorce require physical presence).' }
    ],
    partners: [
      { name: 'Digital and Population Data Services Agency (DVV Finland)', type: 'Government Agency', role: 'Cross-border Suomi.fi data exchange integration' },
      { name: 'Guardtime', type: 'Cybersecurity Firm', role: 'KSI Blockchain integration for digital continuity and registry integrity' },
      { name: 'Tallinn University of Technology (TalTech)', type: 'Academic', role: 'e-Governance research and civic technology curriculum' }
    ],
    impactAreas: [
      'Saves an estimated 820+ years of working time (over 2% of annual GDP) every year through automated data exchange',
      'Over 2.8 Billion queries processed annually across X-Road ecosystem',
      '99% of public services available online 24/7/365',
      'Unbroken state continuity during geopolitical cyber crisis'
    ],
    relevantRoles: [
      'Software Engineering',
      'Security & Systems',
      'DevOps & Cloud',
      'Product & Technical Operations',
      'Product Management'
    ],
    relatedSkills: [
      { name: 'Distributed Systems & PKI Mutual TLS', category: 'Security Engineering', proficiency: 'Expert' },
      { name: 'REST / SOAP Security Gateway Design', category: 'Backend Architecture', proficiency: 'Practitioner' },
      { name: 'Decentralized Data Governance & Legal Informatics', category: 'Data Governance', proficiency: 'Expert' },
      { name: 'Cryptographic Timestamping & Audit Chains', category: 'Cybersecurity', proficiency: 'Expert' },
      { name: 'Once-Only Citizen Architecture', category: 'Public Sector Strategy', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'X-Road Core (Java / PostgreSQL)',
      'Guardtime KSI Blockchain',
      'OpenSSL & Hardware Security Modules',
      'Docker & Ansible',
      'Prometheus & Grafana Network Monitoring'
    ],
    relatedInnovation: [
      'The "Once-Only" Principle legally barring ministries from re-requesting existing citizen data',
      'Data Embassy concept extending sovereign immunity to cloud servers hosted in foreign diplomatic territory',
      'Direct cross-border public health data exchange between Estonia and Finland'
    ],
    knowledgeSources: [
      { title: 'X-Road Architecture Whitepaper & Protocol Specification v7', type: 'Architecture Spec', publicationDate: '2023-04-10' },
      { title: 'Republic of Estonia: Public Information Act (Data Interoperability Framework)', type: 'Legislation', publicationDate: '2021-02-15' },
      { title: 'World Bank: Lessons from Estonia’s e-Governance Architecture for Developing Nations', type: 'Case Study', publicationDate: '2022-08-30' }
    ],
    officialWebsite: 'https://e-estonia.com',
    sourceUrl: 'https://github.com/nordic-institute/X-Road',
    dateTime: '2026-03-01',
    status: 'Global Standard',
    versionEdition: 'X-Road v7.4 (NIIS Release)',
    systemRelationships: {
      modelType: 'dpi_ecosystem',
      flowTitle: 'Decentralized Sovereign Data Exchange Federation',
      nodes: [
        {
          stageLabel: 'Public Policy Framework',
          title: 'Public Information Act & Once-Only Rule',
          description: 'Legal statute establishing that citizen data belongs to the citizen, not the state agency.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service Layer',
          title: 'X-Road Federated Messaging Backbone',
          description: 'Secure inter-institutional data pipelines linking police, healthcare, education, and banking.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'Distributed Security Server Nodes & KSI Blockchain',
          description: 'Peer-to-peer mTLS encryption with mathematical time-stamping proof of every single query.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Vendors & Private Providers',
          title: 'Commercial Banks, Telecoms & Healthcare Clinics',
          description: 'Private organizations plugged into X-Road to verify income, medical history, and prescriptions.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users / Citizens',
          title: '1.3M Citizens & 100k e-Residents',
          description: 'Filing taxes in under 3 minutes, voting from home, and reviewing who audited their records.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Impact & Outcomes',
          title: '2% Annual GDP Savings & Zero Paper Bureaucracy',
          description: 'Over 820 working years saved per year; world benchmark for digital resilience and transparency.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'Agency A (e.g. Police) needs data from Agency B (e.g. Driver Registry). Agency A’s system makes an internal API call to its local X-Road Security Server. The server validates Agency A’s certificate, establishes a secure mTLS tunnel directly to Agency B’s Security Server, signs the request with its national cryptographic key, logs the transaction to the immutable audit log, and receives the data in sub-second time without passing through any central honeypot.',
      governanceAndCompliance: 'Governed under European eIDAS regulation and the Estonian Public Information Act. Strict auditability: any civil servant who looks up an unauthorized citizen record is automatically flagged for criminal prosecution.',
      citizenJourney: 'A citizen logs into the state portal, sees an itemized log: "Dr. Tamm accessed your allergy record on Tuesday at 14:15". If unauthorized, the citizen clicks "Report Violation" to summon internal affairs oversight.'
    }
  },
  {
    id: 'civic-decidim-barcelona',
    name: 'Decidim & Barcelona Digital City - Civic Participation Platform',
    entityType: 'Civic Tech Organization',
    countryRegion: 'Spain (Adopted across 30+ countries including France, Mexico, Japan, European Commission)',
    domain: 'Civic Participation & Open Source Democracy Platforms',
    missionPurpose: 'Build free, open-source, cryptographic digital infrastructure for citizen participation, participatory budgeting, public consultation, and collaborative municipal policy-making.',
    problemAddressed: 'Growing citizen cynicism in democratic institutions, opaque municipal decision-making, captured lobbying processes, and reliance on proprietary Big Tech social platforms for public discourse.',
    targetPopulation: 'Municipal residents, civic organizations, neighborhood collectives, and local governments worldwide.',
    operatingModel: 'Open-source civic technology platform governed by a democratic community association (Decidim Association) and supported by municipal partnerships. Designed with privacy-by-design, algorithmic transparency, and verifiable public voting.',
    keyPrograms: [
      'Participatory Budgeting (Direct citizen allocation of municipal investment budgets)',
      'Citizen Assemblies & Deliberative Polling',
      'Collaborative Legislative Drafting (Citizens co-writing city regulations)',
      'Decidim Open Source Software Association (Community-led governance of the code repository)'
    ],
    services: [
      {
        name: 'Participatory Budgeting Engine',
        description: 'End-to-end framework allowing citizens to propose capital projects, debate feasibility, and vote via ballot.',
        deliveryChannel: 'Responsive Web Portal & In-person municipal kiosks',
        targetGroup: 'All registered city residents over 16'
      },
      {
        name: 'Collaborative Policy Drafting (Normativas)',
        description: 'Enables citizens to comment line-by-line on proposed municipal ordinances and vote on specific amendments.',
        deliveryChannel: 'Interactive inline text annotation module',
        targetGroup: 'Civil society organizations, lawyers, residents'
      },
      {
        name: 'Civic Initiative Petitions',
        description: 'Platform for collecting cryptographically verified digital signatures to force debate in city council.',
        deliveryChannel: 'Decidim Census-verified petition gateway',
        targetGroup: 'Grassroots campaigns and neighborhood associations'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'Decidim Modular Core',
        role: 'Extensible open-source civic participation framework with pluggable spaces and participatory components.',
        architecture: 'Ruby on Rails 7, PostgreSQL, Redis, and React components.'
      },
      {
        name: 'Municipal Census Verification Gateway',
        role: 'Verifies resident voter eligibility against municipal registries without storing identifiable voter attributes.',
        architecture: 'Zero-knowledge hashed verification proxy.'
      },
      {
        name: 'Cryptographic End-to-End Verifiable Voting',
        role: 'Election voting module ensuring that votes cannot be modified or linked back to the voter identity.',
        architecture: 'Mixnet and homomorphic encryption ballot box integration.'
      }
    ],
    digitalCapabilities: [
      '100% Free and Open Source Software (AGPLv3) guaranteeing full civic sovereignty',
      'Pluggable modular components (Debates, Proposals, Meetings, Voting, Accountability Metrics)',
      'Census-verified eligibility without surveillance data retention',
      'Multi-tenant federation allowing regional governments to host dozens of municipalities on one cluster'
    ],
    fundingProcurementModel: 'Funded through Barcelona City Council digital rights budget, European Commission grants (Horizon 2020), and membership dues from member cities (Helsinki, Zurich, Lyon, Mexico City).',
    stakeholders: [
      { group: 'Decidim Association', role: 'Community governance overseeing roadmap, ethics social contract, and code review.' },
      { group: 'City Councils & Mayors', role: 'Adopting the platform and committing legally to implement winning citizen proposals.' },
      { group: 'Civic Tech Cooperatives', role: 'Codegram, Platoniq, and agile tech coops developing plugins and maintaining instances.' },
      { group: 'Citizens & Activists', role: 'Proposing urban projects, voting on school funding, and debating climate transition plans.' }
    ],
    partners: [
      { name: 'Barcelona City Council (Ajuntament de Barcelona)', type: 'Municipal Government', role: 'Foundational incubator and sponsor' },
      { name: 'European Commission (Conference on the Future of Europe)', type: 'International Body', role: 'Used Decidim as official pan-European participation platform' },
      { name: 'Universitat Oberta de Catalunya (UOC)', type: 'Academic', role: 'Democratic quality and deliberative discourse research' }
    ],
    impactAreas: [
      'Over €30 Million in municipal budgets directly allocated by citizen vote in Barcelona alone',
      'Over 500 cities and organizations in 30+ countries running Decidim instances',
      'Passed landmark citizen ordinances on urban greening, cycling infrastructure, and housing regulations',
      'Pioneered the "Social Contract for Democratic Technology" enforcing data sovereignty'
    ],
    relevantRoles: [
      'Product Management',
      'UI/UX & Product Design',
      'Software Engineering',
      'Program & Project Management',
      'Business Analysis & Strategy'
    ],
    relatedSkills: [
      { name: 'Participatory Governance & Deliberation Architecture', category: 'Civic Strategy', proficiency: 'Expert' },
      { name: 'Open-Source Community Management', category: 'Ecosystem Leadership', proficiency: 'Practitioner' },
      { name: 'Ruby on Rails & Modular Architecture', category: 'Software Engineering', proficiency: 'Expert' },
      { name: 'Verifiable Electronic Voting Protocols', category: 'Cryptography', proficiency: 'Practitioner' },
      { name: 'Accessibility & Civic Inclusive Design', category: 'UI/UX Design', proficiency: 'Expert' }
    ],
    relatedToolsPlatforms: [
      'Ruby on Rails & Sidekiq',
      'PostgreSQL with PostGIS for geographic proposals',
      'Docker & Kubernetes Helm Charts',
      'GitLab / GitHub Open Source Pipelines',
      'Discourse & Mastodon Civic Integrations'
    ],
    relatedInnovation: [
      'Decidim Social Contract: legally binding tech manifesto rejecting surveillance capitalism in public tech',
      'Accountability execution tracker showing exact percentage progress of approved citizen projects',
      'Hybrid participatory design merging physical neighborhood assemblies with digital voting'
    ],
    knowledgeSources: [
      { title: 'Decidim Architecture and Philosophy: Technology for Democratic Autonomy', type: 'Whitepaper', publicationDate: '2023-02-14' },
      { title: 'The Decidim Social Contract: Code of Conduct and Democratic Governance', type: 'Open Standard', publicationDate: '2021-06-20' },
      { title: 'European Commission: Assessing Digital Deliberation in the Conference on the Future of Europe', type: 'Impact Evaluation', publicationDate: '2022-10-18' }
    ],
    officialWebsite: 'https://decidim.org',
    sourceUrl: 'https://github.com/decidim/decidim',
    dateTime: '2026-01-28',
    status: 'Global Standard',
    versionEdition: 'Decidim Core v0.28',
    systemRelationships: {
      modelType: 'civic_participation',
      flowTitle: 'Civic Deliberation & Democratic Policy Execution Flow',
      nodes: [
        {
          stageLabel: 'Democratic Mandate',
          title: 'Municipal Citizen Participation Ordinance',
          description: 'City statute committing a fixed percentage of capital expenditure to direct citizen decision.',
          colorClass: 'bg-amber-600 text-white'
        },
        {
          stageLabel: 'Civic Tech Platform',
          title: 'Decidim Open Source Software Suite',
          description: 'Proposals, debates, meeting coordinates, and census-verified voter registration portal.',
          colorClass: 'bg-orange-600 text-white'
        },
        {
          stageLabel: 'Cooperative Tech Partners',
          title: 'Civic Tech Worker Cooperatives & Integrators',
          description: 'Agile open-source developers deploying instances, tuning accessibility, and safeguarding security.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Citizens & Civil Society',
          title: 'Neighborhood Collectives & Residents',
          description: 'Debating urban interventions, voting on bicycle lanes, and authoring climate resolutions.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Municipal Execution',
          title: 'City Council Procurement & Public Works',
          description: 'Municipal engineering teams executing the top-ranked citizen projects with publicly tracked budgets.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Civic Outcomes',
          title: 'Participatory Urban Transformation & Trust',
          description: 'Dramatically reduced public protests; high citizen ownership of neighborhood public spaces.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'A city launches a participatory budget cycle on Decidim. Residents submit project proposals with photo attachments and geolocations. During the deliberation phase, citizens comment and merge similar proposals. Municipal engineers review technical feasibility and publish cost estimates. During the voting phase, residents verify via census integration and distribute their budget points. Winning projects are tracked on an open accountability dashboard until construction is complete.',
      governanceAndCompliance: 'Governed by the Decidim Social Contract: all code must remain AGPLv3 open source, instances must respect data privacy (no commercial analytics or tracking cookies), and content must remain open data under Creative Commons.',
      citizenJourney: 'A teenager proposes a youth skate park on an abandoned lot. Her neighbors upvote it, the municipal budget approves €80,000, and she follows the contractor procurement timeline on Decidim until the ribbon cutting.'
    }
  },
  {
    id: 'civic-prozorro-ukraine',
    name: 'ProZorro - Open Electronic Public Procurement System of Ukraine',
    entityType: 'Public Platform',
    countryRegion: 'Ukraine (World benchmark for open government procurement)',
    domain: 'Public Procurement & Anti-Corruption Transparency',
    missionPurpose: 'Enforce the principle that "Everyone sees everything" in government purchasing, replacing paper-based tender corruption with transparent digital reverse auctions and open data monitoring.',
    problemAddressed: 'Billions of dollars lost annually to backroom procurement corruption, kickbacks, rigged tenders, and monopoly vendor capture in state contracting.',
    targetPopulation: 'Over 40,000 Ukrainian contracting authorities (hospitals, schools, defense, municipalities) and hundreds of thousands of commercial suppliers.',
    operatingModel: 'Hybrid public-private procurement architecture. The state owns the Central Database and transaction engine (SE Medical & Public Procurement / Ministry of Economy), while private commercial marketplaces compete to provide the best user interface and customer support for buyers and suppliers. All data is synchronized instantly and published in Open Contracting Data Standard (OCDS) format.',
    keyPrograms: [
      'ProZorro.Sale (Electronic auction system for privatization of state assets and bankrupt bank assets)',
      'DoZorro (Civic monitoring network empowering NGOs and citizens to audit tenders for fraud)',
      'ProZorro Market (E-commerce style catalog for rapid public procurement of standardized goods)',
      'Defense & Emergency Fast-Track Tenders (War resilience public procurement rails)'
    ],
    services: [
      {
        name: 'Electronic Public Tenders & Reverse Auctions',
        description: 'Mandatory online auctions where suppliers submit bids and undergo anonymous live descending price rounds.',
        deliveryChannel: 'Commercial authorized broker portals connected to Central DB',
        targetGroup: 'Government contracting authorities and private businesses'
      },
      {
        name: 'DoZorro Civic Feedback & Red Flag Analytics',
        description: 'Machine learning risk scoring that flags suspicious tender requirements designed to favor specific bidders.',
        deliveryChannel: 'DoZorro.org Open Civic Audit Portal',
        targetGroup: 'Anti-corruption NGOs, journalists, state auditors'
      },
      {
        name: 'Open Contracting Data Standard (OCDS) API',
        description: 'Real-time open API publishing every bid, contract document, payment, and complaint.',
        deliveryChannel: 'Public RESTful JSON APIs',
        targetGroup: 'Data journalists, international donors, researchers'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'ProZorro Central Database & Auction Core',
        role: 'Central engine maintaining immutable state of all tenders, bids, and reverse auction algorithms.',
        architecture: 'Python, Flask, CouchDB distributed document store, and Redis.'
      },
      {
        name: 'Hybrid Commercial Exchange Sync Layer',
        role: 'Bi-directional synchronization protocol connecting 12+ private licensed brokerage platforms to Central DB.',
        architecture: 'Event-driven streaming replication architecture.'
      },
      {
        name: 'Open Contracting Data Standard (OCDS) Serializer',
        role: 'Transforms tender life cycles into internationally standardized OCDS schemas.',
        architecture: 'JSON-Schema validation pipeline with automated archiving.'
      }
    ],
    digitalCapabilities: [
      'Hybrid Public-Private architecture preventing state IT monopoly and driving commercial marketplace UX innovation',
      'Automated descending price reverse auction completed in three anonymous 3-minute rounds',
      'Fully public tender dossiers: bid prices and technical submissions become public immediately upon auction close',
      'Electronic complaints appeals board integrated directly with the Anti-Monopoly Committee of Ukraine'
    ],
    fundingProcurementModel: 'Self-sustaining funding model: private commercial platforms pay a small micro-fee to the state enterprise for each tender transaction to fund infrastructure maintenance, while charging suppliers standard subscription fees.',
    stakeholders: [
      { group: 'Ministry of Economy', role: 'Public policy and legislative procurement framework stewardship.' },
      { group: 'SE ProZorro', role: 'State enterprise maintaining central database, auction engine, and API standards.' },
      { group: 'Commercial Marketplaces', role: 'SmartTender, Zakupki.Prom, E-Tender competing for supplier onboarding.' },
      { group: 'DoZorro NGO Coalition', role: 'Transparency International Ukraine and civic watchdog networks reviewing tenders.' },
      { group: 'State Audit Service & NABU', role: 'Enforcing legal penalties on corrupt procurement officials caught by open data.' }
    ],
    partners: [
      { name: 'Transparency International Ukraine', type: 'Civil Society NGO', role: 'Co-created the prototype and leads the DoZorro monitoring community' },
      { name: 'Open Contracting Partnership (OCP)', type: 'International NGO', role: 'Global standard stewardship and technical advisory' },
      { name: 'USAID & UK FCDO (TAPAS Project)', type: 'Donor Agency', role: 'Financial and technical assistance for anti-corruption digital tools' }
    ],
    impactAreas: [
      'Over $6 Billion in estimated taxpayer budget savings through competitive tender bidding',
      'Over 80% reduction in procurement fraud cases reported by businesses',
      'Tens of thousands of small businesses successfully won public contracts for the first time',
      'Winner of the World Procurement Award and Open Government Partnership Global Award'
    ],
    relevantRoles: [
      'Software Engineering',
      'Data Analytics & BI',
      'Product Management',
      'Security & Systems',
      'Business Analysis & Strategy'
    ],
    relatedSkills: [
      { name: 'Open Contracting Data Standard (OCDS)', category: 'Data Standards', proficiency: 'Expert' },
      { name: 'Auction Algorithms & Game Theory', category: 'Algorithm Design', proficiency: 'Practitioner' },
      { name: 'Hybrid Public-Private System Architecture', category: 'Enterprise Architecture', proficiency: 'Expert' },
      { name: 'Anti-Corruption Anomaly Detection & ML Risk Scoring', category: 'Data Science', proficiency: 'Practitioner' },
      { name: 'Public Procurement Law & Compliance', category: 'Governance', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'Python & Flask',
      'CouchDB & MongoDB',
      'Redis & RabbitMQ',
      'ElasticSearch for full-text tender discovery',
      'Kibana & Apache Superset for public dashboards'
    ],
    relatedInnovation: [
      'Hybrid Public-Private marketplace model eliminating slow government software development cycles',
      '"Everyone sees everything" open architecture removing all confidential bid secrecy after auction close',
      'DoZorro citizen watchdog machine learning algorithms flagging suspicious sole-source tenders'
    ],
    knowledgeSources: [
      { title: 'Open Contracting Partnership: How Ukraine Built One of the World’s Most Transparent Procurement Systems', type: 'Case Study', publicationDate: '2022-05-10' },
      { title: 'Law of Ukraine "On Public Procurement" No. 922-VIII', type: 'Legislation', publicationDate: '2020-04-19' },
      { title: 'OECD Integrity Review of Ukraine: Modernizing Public Procurement and Governance', type: 'Impact Evaluation', publicationDate: '2021-11-15' }
    ],
    officialWebsite: 'https://prozorro.gov.ua/en',
    sourceUrl: 'https://github.com/ProzorroUKR',
    dateTime: '2026-02-14',
    status: 'Global Standard',
    versionEdition: 'ProZorro Core Engine v2.6',
    systemRelationships: {
      modelType: 'government_service_delivery',
      flowTitle: 'Hybrid Public-Private Procurement & Civic Audit Flow',
      nodes: [
        {
          stageLabel: 'Anti-Corruption Reform',
          title: 'Law on Public Procurement & Open Mandate',
          description: 'Strict legal requirement that all government purchases above threshold must occur on ProZorro.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service Layer',
          title: 'Electronic Tender & Reverse Auction Engine',
          description: 'Standardized procurement workflow ensuring fair anonymous bidding across 40,000 public entities.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'ProZorro Central DB & Open OCDS API',
          description: 'State-owned central transaction core streaming every contract document and bid to the public.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Commercial Marketplaces',
          title: 'Private Brokerage Platforms & Vendors',
          description: 'SmartTender, Zakupki.Prom, E-Tender providing UX, onboarding, and customer support to bidders.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Civic Watchdogs & Auditors',
          title: 'DoZorro Community & Investigative Journalists',
          description: 'Citizens and NGOs monitoring tenders in real time, filing official appeals against bid-rigging.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Impact & Outcomes',
          title: '$6B+ Savings & Fair Market Competition',
          description: 'Dismantled legacy procurement cartels; enabled thousands of SMEs to win fair government contracts.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'A public hospital creates a tender for medical equipment on an authorized private portal. The portal pushes the structured announcement to the ProZorro Central DB. The announcement instantly appears on all 12 commercial portals. Suppliers submit sealed cryptographic bids. At auction time, an automated 3-round reverse auction begins where suppliers can lower their bids. When the auction closes, all bid documents, vendor names, and price progressions become instantly public for citizens and competitors to review.',
      governanceAndCompliance: 'Governed by the Law of Ukraine "On Public Procurement". Violations can be appealed directly to the Anti-Monopoly Committee via a non-paper digital claim pipeline with strict 10-day statutory response deadlines.',
      citizenJourney: 'An investigative journalist notices a hospital paying 3x market rate for generators on the open portal, files a DoZorro complaint with 1 click, triggers an audit review, and the contract is cancelled before state funds are disbursed.'
    }
  },
  {
    id: 'civic-msf-supply-chain',
    name: 'Doctors Without Borders / MSF Humanitarian Logistics & Supply Chain',
    entityType: 'International Organization',
    countryRegion: 'Global / Crisis Zones (Gaza, DRC, South Sudan, Yemen, Ukraine)',
    domain: 'Humanitarian Systems & Emergency Medical Supply',
    missionPurpose: 'Operate an independent, rapid-response medical and humanitarian logistics pipeline capable of deploying specialized field hospitals and cold-chain medical supplies anywhere in the world within 48 hours of catastrophe.',
    problemAddressed: 'Catastrophic delays in medical aid during sudden conflict outbreak, epidemic collapse, or natural disasters due to fragmented commercial shipping, broken local infrastructure, and cold-chain breakdowns.',
    targetPopulation: 'Over 10 Million conflict-affected, displaced, and epidemic-hit patients in fragile states and humanitarian crises.',
    operatingModel: 'Independent humanitarian operating model funded 97%+ by private individual donors to preserve political neutrality and rapid action. Operates autonomous supply centers (MSF Logistique in Bordeaux, MSF Supply in Brussels, APUMED in Nairobi) managing pre-packaged medical emergency kits and charter airlifts directly into disaster zones.',
    keyPrograms: [
      'Emergency Preparedness Kits (Pre-packed standardized kits: surgical, cholera, malnutrition, water/sanitation)',
      'Solar-Powered Mobile Cold Chain (Ensuring temperature-sensitive vaccines and insulin survive in +45°C off-grid zones)',
      'Field ERP & Autonomous Inventory Tracking (Tracking medicine batches in active conflict zones)',
      'Telemedicine & Remote Surgical Mentorship (Satellite uplink connecting field nurses to global specialists)'
    ],
    services: [
      {
        name: '48-Hour Emergency Response Deployment',
        description: 'Rapid dispatch of chartered cargo planes loaded with pre-configured mobile inflatable hospitals and medicines.',
        deliveryChannel: 'Air charters, 4x4 convoys, and off-road transport',
        targetGroup: 'Populations struck by earthquakes, war, or epidemic outbreaks'
      },
      {
        name: 'Autonomous Water & Sanitation (WASH) Systems',
        description: 'Mobile water purification units producing clean drinking water from contaminated floodwaters.',
        deliveryChannel: 'Field engineering logistics teams',
        targetGroup: 'Displaced refugee settlements'
      },
      {
        name: 'Mobile Surgical & Epidemic Treatment Centers',
        description: 'Complete containerized surgical theaters with autonomous power generation and anesthesia stations.',
        deliveryChannel: 'Modular container hospital kits',
        targetGroup: 'Mass casualty trauma patients'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'Field Logistics ERP & Batch Tracking System',
        role: 'Specialized offline-capable ERP tracking medical lot numbers, expiration dates, and customs clearances.',
        architecture: 'Decentralized ERP instance with satellite sync.'
      },
      {
        name: 'IoT Active Cold-Chain Telemetry',
        role: 'Sensor network monitoring real-time temperatures inside vaccine coolers via LoRaWAN and satellite tags.',
        architecture: 'Low-power telemetry transmitting alerts upon temperature breaches.'
      },
      {
        name: 'OpenStreetMap Humanitarian Mapping (HOT-OSM)',
        role: 'Collaborative satellite mapping of unmapped conflict roads, refugee settlements, and river crossings.',
        architecture: 'Crowdsourced geospatial vector database.'
      }
    ],
    digitalCapabilities: [
      'Autonomous offline logistics software operating in total telecommunication blackouts',
      'Standardized kit coding system allowing non-specialized local staff to assemble complex surgical wards',
      'Real-time satellite GPS tracking of aid convoys through active frontlines',
      'Satellite broadband telemedicine terminals connecting field surgical stations to global experts'
    ],
    fundingProcurementModel: '97% funded by individual private donors worldwide, freeing MSF from donor-country political conditions or sanctions. Direct global volume procurement of generic pharmaceuticals bypassing patent markups.',
    stakeholders: [
      { group: 'MSF Supply Centers', role: 'Bordeaux and Brussels logistics hubs preparing and certifying emergency stock.' },
      { group: 'Field Logisticians ("Loggies")', role: 'Engineers, mechanics, and procurement specialists managing generators, fuel, water, and transport in the field.' },
      { group: 'Medical Teams', role: 'Surgeons, nurses, and epidemiologists delivering direct clinical care.' },
      { group: 'Customs & Civil Aviation', role: 'Negotiating emergency humanitarian flight corridors and drug import exemptions.' },
      { group: 'Affected Communities', role: 'Receiving life-saving trauma care and clean water without fees.' }
    ],
    partners: [
      { name: 'Humanitarian OpenStreetMap Team (HOT)', type: 'Civic Tech Org', role: 'Mapping unmapped rural zones for emergency epidemiologists' },
      { name: 'World Health Organization (WHO) Emergency Medical Teams', type: 'Multilateral', role: 'Standards coordination for field hospitals' },
      { name: 'Local Ministry of Health Agencies', type: 'Public Institution', role: 'Coordinating epidemic response and hospital handovers' }
    ],
    impactAreas: [
      'Over 16 Million medical consultations and hundreds of thousands of emergency surgeries performed annually',
      'Response capability proven: inflatable 100-bed hospitals fully operational within 72 hours of major earthquakes',
      'Vaccination of millions of children against measles, cholera, and meningitis in active conflict areas',
      'Global advocacy for affordable access to essential medicines and generic production'
    ],
    relevantRoles: [
      'Product & Technical Operations',
      'Program & Project Management',
      'DevOps & Cloud',
      'Software Engineering',
      'Security & Systems'
    ],
    relatedSkills: [
      { name: 'Emergency Supply Chain & Humanitarian Logistics', category: 'Operations Engineering', proficiency: 'Expert' },
      { name: 'IoT Cold-Chain Telemetry & Satellite Comms', category: 'Hardware / IoT', proficiency: 'Practitioner' },
      { name: 'Offline-First Field Inventory Systems', category: 'Software Engineering', proficiency: 'Practitioner' },
      { name: 'Crisis Risk Management & Neutrality Protocols', category: 'Humanitarian Operations', proficiency: 'Expert' },
      { name: 'Standardized Modular Kit Engineering', category: 'Systems Engineering', proficiency: 'Expert' }
    ],
    relatedToolsPlatforms: [
      'Unifield / Field ERP Systems',
      'Starlink & Iridium Satellite Terminals',
      'QGIS & Humanitarian OpenStreetMap',
      'LoRaWAN Sensor Gateways',
      'PostgreSQL & PowerBI Logistics Dashboards'
    ],
    relatedInnovation: [
      'Standardized "Kits" concept invented by MSF: turning complex hospital construction into modular numbered crates',
      'Vaccine transport coolers operating on solar-direct electricity without lithium batteries in desert heat',
      '3D-printed custom surgical retractors and prosthetic parts fabricated on-site in refugee camps'
    ],
    knowledgeSources: [
      { title: 'MSF Logistics Manual & Emergency Kit Catalogue v12', type: 'Architecture Spec', publicationDate: '2023-08-10' },
      { title: 'The Sphere Handbook: Humanitarian Charter and Minimum Standards in Disaster Response', type: 'Open Standard', publicationDate: '2022-01-15' },
      { title: 'The Lancet: Evaluating Emergency Surgical Deployments in Conflict Settings', type: 'Impact Evaluation', publicationDate: '2023-03-22' }
    ],
    officialWebsite: 'https://www.msf.org',
    sourceUrl: 'https://www.msf.org/logistics',
    dateTime: '2026-03-05',
    status: 'Operational',
    versionEdition: 'MSF Emergency Standard Kit 2026',
    systemRelationships: {
      modelType: 'ngo_social_delivery',
      flowTitle: 'Humanitarian Emergency Medical Supply Chain Model',
      nodes: [
        {
          stageLabel: 'Humanitarian Emergency Mandate',
          title: 'Conflict & Catastrophe Rapid Response Protocol',
          description: 'Activation of emergency status upon outbreak of war, cholera epidemic, or natural disaster.',
          colorClass: 'bg-rose-600 text-white'
        },
        {
          stageLabel: 'Target Population',
          title: 'Displaced Civilians & Trauma Casualties',
          description: 'Vulnerable populations in conflict zones cut off from sovereign public health infrastructure.',
          colorClass: 'bg-red-600 text-white'
        },
        {
          stageLabel: 'Delivery Model',
          title: 'Modular Emergency Kits & Air Charter Pipeline',
          description: 'Pre-assembled, color-coded medical kits dispatched from Bordeaux and Brussels logistics hubs.',
          colorClass: 'bg-orange-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'Autonomous Field ERP & Satellite IoT Cold-Chain',
          description: 'Offline-first batch tracking, solar-powered vaccine coolers, and satellite telemedicine stations.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Local Partners & Field Teams',
          title: 'Local Health Workers & Field Logisticians',
          description: 'Assembling inflatable wards, running water purification, and performing triage surgeries.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Life-Saving Outcomes',
          title: '48-Hour Field Hospital Triage & Epidemic Containment',
          description: 'Halting cholera transmission, saving trauma victims, and preserving dignity in active conflict.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'An earthquake hits a fragile region. MSF emergency coordinators in Geneva issue an immediate Alert Level 3. Within 12 hours, pre-packaged "Kit Earthquake" containers containing surgical suites, anesthesia, generators, and solar water treatment plants are loaded onto chartered cargo aircraft. On the ground, field logisticians secure airfield access, deploy Starlink communications, erect inflatable tents, and perform surgeries within 48 hours of the event.',
      governanceAndCompliance: 'Governed by the MSF International Charter: strict independence, neutrality, and medical confidentiality. Operates without political strings from donor governments.',
      citizenJourney: 'A mother wounded in a building collapse is carried to an MSF inflatable field clinic, receives emergency surgery by a trauma team, free antibiotics, clean water, and is discharged safely.'
    }
  },
  {
    id: 'civic-usds-18f',
    name: 'U.S. Digital Service (USDS) & 18F - Agile Public Technology Modernization',
    entityType: 'Government Agency',
    countryRegion: 'United States (Executive Office of the President & General Services Administration)',
    domain: 'Government Technology Transformation & Human-Centered Design',
    missionPurpose: 'Transform how the federal government builds and buys digital services by bringing elite private-sector engineers, product managers, and designers into government tours of civic duty.',
    problemAddressed: 'Catastrophic failures of multi-billion dollar government IT procurements (e.g. Healthcare.gov launch failure, Veterans Affairs claims backlogs), waterfall contracting, legacy mainframes, and clunky citizen portals.',
    targetPopulation: '330 Million Americans, including veterans, Medicare recipients, student loan borrowers, and immigrant families.',
    operatingModel: 'Cross-functional agile strike teams embedded directly inside cabinet agencies (VA, HHS, DHS, SSA, SBA). Replaces massive 500-page RFP requirements with iterative sprints, user research with real citizens, cloud microservices, and modern open-source software practices.',
    keyPrograms: [
      'VA.gov Modernization (Consolidating 1,000+ fragmented military veteran websites into one modern portal)',
      'U.S. Web Design System (USWDS - Open-source design system for federal web applications)',
      'Cloud.gov (FedRAMP-authorized platform-as-a-service allowing federal teams to deploy apps quickly)',
      'Digital Services Playbook (13 key principles for building successful digital services in government)'
    ],
    services: [
      {
        name: 'High-Impact Agency Modernization Consultations',
        description: 'Direct sprint intervention in troubled high-stakes federal technology initiatives to rescue failing rollouts.',
        deliveryChannel: 'Embedded agile teams within client agencies',
        targetGroup: 'Federal agency leadership and program managers'
      },
      {
        name: 'U.S. Web Design System (USWDS)',
        description: 'Component library delivering WCAG 2.1 AA compliant, responsive user interfaces across 200+ federal agencies.',
        deliveryChannel: 'Open source NPM packages and design guidelines',
        targetGroup: 'Federal digital designers and front-end engineers'
      },
      {
        name: 'Login.gov (Federal Single Sign-On)',
        description: 'Secure, privacy-preserving shared identity service for the public to access federal benefits.',
        deliveryChannel: 'FIDO2 / OIDC cloud authentication service',
        targetGroup: 'All American citizens accessing federal benefits'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'Cloud.gov PaaS',
        role: 'FedRAMP JAB High authorized platform-as-a-service built on Cloud Foundry and AWS GovCloud.',
        architecture: 'Isolated container orchestration with automated compliance inheritance.'
      },
      {
        name: 'USWDS Accessible Frontend Core',
        role: 'HTML, Sass, and JavaScript component architecture enforcing federal 508 compliance.',
        architecture: 'Modular design token system.'
      },
      {
        name: 'Federal Data Standardization APIs',
        role: 'Modern RESTful and GraphQL APIs replacing legacy COBOL mainframe batch jobs at VA and SSA.',
        architecture: 'Cloud-native microservices with OpenTelemetry tracing.'
      }
    ],
    digitalCapabilities: [
      'Human-centered design with real citizen interviews informing feature roadmaps',
      'Agile modular contracting (splitting $500M mega-contracts into small, low-risk $5M milestone sprints)',
      'Modern automated CI/CD pipelines deploying to FedRAMP cloud environments',
      'FedRAMP compliance automation reducing system authorization (ATO) from 18 months to 3 weeks'
    ],
    fundingProcurementModel: 'USDS funded directly through White House Executive Office of the President budget; 18F operates as a cost-recoverable fee-for-service consulting unit inside GSA using the Acquisition Services Fund.',
    stakeholders: [
      { group: 'Executive Office of the President', role: 'Providing top-level political cover and authority to break bureaucratic inertia.' },
      { group: 'USDS & 18F Civic Technologists', role: 'Product managers, designers, and software engineers on 2-4 year tours of civic service.' },
      { group: 'Federal Agency Partners', role: 'Veterans Affairs, Centers for Medicare & Medicaid Services, Social Security Administration.' },
      { group: 'Small Business Tech Contractors', role: 'Bidding on modern agile procurement vehicles.' },
      { group: 'American Public', role: 'Experiencing human-centered federal services that respect their time.' }
    ],
    partners: [
      { name: 'U.S. Department of Veterans Affairs (VA)', type: 'Government Agency', role: 'Flagship partner: complete transformation of VA.gov claims portal' },
      { name: 'General Services Administration (GSA)', type: 'Government Agency', role: 'Parent agency of 18F and Technology Transformation Services (TTS)' },
      { name: 'Code for America', type: 'Civic Tech NGO', role: 'Talent pipeline and civic technology research partner' }
    ],
    impactAreas: [
      'Veterans disability claims processing time reduced by over 50% on redesigned VA.gov',
      'COVID-19 Rapid Test kit distribution portal built and scaled to 60 Million orders on day one without crashing',
      'Eliminated multi-billion dollar waste on failed waterfall software contracts',
      'Transformed civil service hiring pathways for software engineers and product managers'
    ],
    relevantRoles: [
      'Product Management',
      'Software Engineering',
      'UI/UX & Product Design',
      'DevOps & Cloud',
      'Business Analysis & Strategy'
    ],
    relatedSkills: [
      { name: 'Agile Government Procurement & Modular Contracting', category: 'Procurement Strategy', proficiency: 'Expert' },
      { name: 'Human-Centered Design (HCD) for Public Services', category: 'UX Research', proficiency: 'Expert' },
      { name: 'Legacy Mainframe Modernization & Strangler Fig Pattern', category: 'Software Architecture', proficiency: 'Expert' },
      { name: 'FedRAMP & NIST 800-53 Cloud Security Compliance', category: 'Cybersecurity', proficiency: 'Practitioner' },
      { name: 'Civic Technology Product Management', category: 'Product Management', proficiency: 'Expert' }
    ],
    relatedToolsPlatforms: [
      'AWS GovCloud',
      'Cloud.gov & Cloud Foundry',
      'U.S. Web Design System (USWDS)',
      'Terraform & GitHub Actions',
      'React & Node.js'
    ],
    relatedInnovation: [
      'The "Tour of Duty" civil service model: recruiting silicon valley engineers for 2-year public service rotations',
      'Strangler Fig migration pattern safely peeling microservices off 40-year-old COBOL mainframe databases',
      'The Digital Services Playbook: 13 core commandments adopted across state and national governments'
    ],
    knowledgeSources: [
      { title: 'The Digital Services Playbook: Checklist for Federal Digital Services', type: 'Open Standard', publicationDate: '2023-01-10' },
      { title: 'GSA: USWDS Design System Principles and Accessibility Guidelines v3', type: 'Architecture Spec', publicationDate: '2023-05-15' },
      { title: 'Harvard Kennedy School Case Study: The Rescue of Healthcare.gov and Birth of USDS', type: 'Case Study', publicationDate: '2021-09-12' }
    ],
    officialWebsite: 'https://www.usds.gov',
    sourceUrl: 'https://github.com/usds',
    dateTime: '2026-02-18',
    status: 'Operational',
    versionEdition: 'Digital Services Playbook v2.2',
    systemRelationships: {
      modelType: 'government_service_delivery',
      flowTitle: 'Agile Federal Service Modernization Pipeline',
      nodes: [
        {
          stageLabel: 'White House Executive Mandate',
          title: 'Presidential Executive Order on Customer Experience',
          description: 'Directive mandating federal agencies to eliminate bureaucratic burden and modernize core digital services.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Civic Strike Team Deployment',
          title: 'USDS & 18F Cross-Functional Squads',
          description: 'Product managers, designers, and engineers embedding with career civil servants.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Modern Technology Platform',
          title: 'Cloud.gov, USWDS & Agile Microservices',
          description: 'Open source design system, cloud pipelines, and automated security authorization (ATO).',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Agile Procurement Vendors',
          title: 'Modular SME Software Contractors',
          description: 'Replacing bloated mega-contracts with rapid, iterative 6-month deliverables.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users / Citizens',
          title: 'Veterans, Beneficiaries & Families',
          description: 'Accessing disability compensation, student debt relief, and tax credits on mobile devices.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Impact & Outcomes',
          title: 'Halved Processing Backlogs & Restored Trust',
          description: 'Veterans apply for benefits in 10 minutes instead of 6 weeks; billions saved in cancelled IT failures.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'When an agency faces a critical digital breakdown, White House leadership requests a USDS "Discovery Sprint". A team of 4 engineers and designers spends 2 weeks interviewing frontline case workers and citizens, auditing code repositories, and benchmarking performance. Rather than writing a 300-page report, they build a functional working prototype, draft a modular agile contract, and guide civil servant teams through iterative sprint releases.',
      governanceAndCompliance: 'Operates within federal statutory requirements including the Paperwork Reduction Act, Rehabilitation Act Section 508 (accessibility), and FedRAMP security mandates, transforming compliance into automated code checks.',
      citizenJourney: 'A military veteran visits VA.gov on her phone, signs in with Login.gov, and uploads medical records for a disability claim in 8 minutes with immediate confirmation and zero printer/fax machine requirements.'
    }
  },
  {
    id: 'civic-mosip-id',
    name: 'MOSIP - Modular Open Source Identity Platform',
    entityType: 'Digital Public Infrastructure',
    countryRegion: 'Global (Adopted by Philippines, Morocco, Ethiopia, Togo, Sri Lanka, Guinea)',
    domain: 'Digital Identity & Sovereign DPI Platforms',
    missionPurpose: 'Provide sovereign governments with a free, open-source, vendor-neutral foundational digital identity platform that eliminates multi-billion dollar vendor lock-in and protects citizen biometric sovereignty.',
    problemAddressed: 'Developing nations forced into proprietary commercial identity contracts costing hundreds of millions of dollars with encrypted proprietary formats, inability to alter software, and risk of biometric data export by foreign defense contractors.',
    targetPopulation: 'Over 100 Million registered citizens across 6+ countries and expanding globally.',
    operatingModel: 'Global Digital Public Good (DPG) incubated at the International Institute of Information Technology Bangalore (IIIT-B) with philanthropic funding (Gates Foundation, Norad, Omidyar). Open-source architecture (MPL 2.0) with a modular API specification allowing countries to choose any commercial biometric matching algorithm without lock-in.',
    keyPrograms: [
      'PhilSys (National ID of the Philippines powered by MOSIP: 85M+ citizens enrolled)',
      'Fayda National ID (Ethiopia national identity system: 15M+ citizens enrolled)',
      'Inji Mobile Wallet (Open-source verifiable credential smartphone wallet for MOSIP identities)',
      'Biometric Device Specification & Certification Lab (Standardizing fingerprint, iris, face sensors)'
    ],
    services: [
      {
        name: 'Foundational ID Registration & Deduplication',
        description: 'Enrolls citizens with demographic and biometric data, executing 1:N deduplication to ensure unique legal identity.',
        deliveryChannel: 'Mobile registration kits & fixed enrollment centers',
        targetGroup: 'Unregistered populations and children'
      },
      {
        name: 'e-KYC & Authentication Verification API',
        description: 'Provides 1:1 biometric or OTP authentication for social protection grants, SIM cards, and banking.',
        deliveryChannel: 'REST APIs & Inji Wallet Verifiable Credentials',
        targetGroup: 'Financial institutions, telecoms, social welfare ministries'
      },
      {
        name: 'Credential Issuance & Digital ID Printing',
        description: 'Issues secure physical QR-coded ID cards and W3C-compliant digital verifiable credentials.',
        deliveryChannel: 'Postal card printing & Mobile Inji Wallet',
        targetGroup: 'National citizenry'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'MOSIP Microservices Kernel',
        role: 'Spring Boot microservices managing registration, identity repository, credential issuance, and audit logs.',
        architecture: 'Cloud-native Java, Vert.x, PostgreSQL, and RabbitMQ.'
      },
      {
        name: 'Biometric Abstraction Layer (ABIS / Bio-API)',
        role: 'Vendor-neutral API interface allowing governments to hot-swap commercial biometric matchers (Idemia, Neurotechnology, Tech5).',
        architecture: 'ISO/IEC 19794 standardized biometric data interchange format.'
      },
      {
        name: 'Zero-Trust Secure Biometric Device Enclave',
        role: 'Hardware encryption ensuring raw biometric images are cryptographically signed at the sensor before reaching the laptop OS.',
        architecture: 'Public Key Cryptography Standard (PKCS#11) HSM integration.'
      }
    ],
    digitalCapabilities: [
      'Modular architecture: agencies can replace or customize any module without touching the core kernel',
      'No proprietary vendor lock-in for biometric algorithms or hardware capture devices',
      'W3C Verifiable Credentials and OpenID for Verifiable Presentations (OID4VP) compliance',
      'Privacy-by-design: biometric templates stored encrypted with asymmetric keys; raw biometrics never exposed in e-KYC'
    ],
    fundingProcurementModel: 'Funded as a global digital public good by philanthropic donors (Bill & Melinda Gates Foundation, Norad, Omidyar Network). Governments pay zero software license fees; public procurement focuses solely on local system integrators and commodity hardware.',
    stakeholders: [
      { group: 'IIIT-Bangalore & MOSIP Foundation', role: 'Core open-source software engineering, security audits, and certification.' },
      { group: 'National Identity Authorities', role: 'Philippine Statistics Authority (PSA), National ID Program Ethiopia (NIDP) owning the data.' },
      { group: 'Local System Integrators', role: 'Domestic IT enterprises hired to deploy, configure, and maintain national server clusters.' },
      { group: 'Hardware Vendors', role: 'Fingerprint and iris sensor manufacturers achieving MOSIP compliance certification.' },
      { group: 'Citizens', role: 'Obtaining free, verifiable legal identity to open bank accounts and claim welfare.' }
    ],
    partners: [
      { name: 'World Bank ID4D (Identification for Development)', type: 'Multilateral Institution', role: 'Global technical standard setting and country advisory' },
      { name: 'United Nations Development Programme (UNDP)', type: 'International Body', role: 'Assisting developing nations in deploying MOSIP digital infrastructure' },
      { name: 'Digital Public Goods Alliance (DPGA)', type: 'Open Source Alliance', role: 'Recognized MOSIP as certified Global Digital Public Good' }
    ],
    impactAreas: [
      'Over 100 Million people successfully enrolled in sovereign national identities across 6 countries',
      'Saved developing nation governments an estimated $500M+ in commercial licensing and extortionate change orders',
      'Provided millions of formerly unbanked women with their first official legal proof of identity',
      'Created thriving local IT ecosystem of domestic software engineers managing national DPI'
    ],
    relevantRoles: [
      'Software Engineering',
      'Security & Systems',
      'DevOps & Cloud',
      'Product Management',
      'Product & Technical Operations'
    ],
    relatedSkills: [
      { name: 'Open-Source Digital Public Goods (DPG) Architecture', category: 'Software Architecture', proficiency: 'Expert' },
      { name: 'Biometric Standards (ISO 19794 & CBEFF)', category: 'Biometrics', proficiency: 'Expert' },
      { name: 'Hardware Security Modules & Cryptographic Signing', category: 'Cybersecurity', proficiency: 'Expert' },
      { name: 'W3C Verifiable Credentials & Decentralized Identity', category: 'Identity Architecture', proficiency: 'Practitioner' },
      { name: 'Microservices with Spring Boot & Docker', category: 'Backend Engineering', proficiency: 'Expert' }
    ],
    relatedToolsPlatforms: [
      'Java & Spring Boot',
      'PostgreSQL & MinIO Object Storage',
      'RabbitMQ & Apache Kafka',
      'Thales & SafeNet HSMs',
      'Kubernetes & Helm'
    ],
    relatedInnovation: [
      'Biometric Abstraction Layer (Bio-API) breaking the monopoly of proprietary biometric algorithms',
      'Hardware-level biometric signing preventing malicious Windows malware from injecting fake fingerprint files',
      'Inji open-source digital wallet allowing offline cryptographic credential verification on cheap Android phones'
    ],
    knowledgeSources: [
      { title: 'MOSIP Architectural Specification and Security Architecture v1.2', type: 'Architecture Spec', publicationDate: '2023-06-15' },
      { title: 'World Bank ID4D Practitioner’s Guide to Digital Identification', type: 'Whitepaper', publicationDate: '2022-04-10' },
      { title: 'Philippines Statistics Authority: PhilSys Implementation and Impact Assessment', type: 'Impact Evaluation', publicationDate: '2023-10-25' }
    ],
    officialWebsite: 'https://mosip.io',
    sourceUrl: 'https://github.com/mosip',
    dateTime: '2026-03-08',
    status: 'Global Standard',
    versionEdition: 'MOSIP 1.2.0 LTS',
    systemRelationships: {
      modelType: 'dpi_ecosystem',
      flowTitle: 'Sovereign Open Source Identity Infrastructure Chain',
      nodes: [
        {
          stageLabel: 'International SDG Mandate',
          title: 'UN SDG 16.9 Legal Identity For All',
          description: 'Global compact ensuring every human has free, recognized legal identity by 2030.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service Layer',
          title: 'Sovereign Foundational Identity Issuance',
          description: 'Biometric deduplication, unique ID generation, and electronic KYC services.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'MOSIP Open Modular Kernel & Bio-API',
          description: 'Zero vendor lock-in open source microservices running on domestic sovereign data centers.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Domestic Integrators & OEMs',
          title: 'Local IT Consultancies & Hardware Vendors',
          description: 'Domestic engineers deploying server clusters and operating regional biometric enrollment kits.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users / Citizens',
          title: '100M+ Formerly Unregistered Citizens',
          description: 'Rural farmers and urban workers receiving their first official verifiable national identity card.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Impact & Outcomes',
          title: 'Universal Banking Access & Social Protection',
          description: 'Instant bank account opening, targeted emergency flood relief, and elimination of ghost beneficiaries.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'An unregistered citizen visits a mobile enrollment kit in a rural village. The MOSIP client software captures demographic data and scans fingerprints, irises, and a facial photo. The biometric hardware signs the data in a secure enclave before transmitting it to the sovereign server. The MOSIP kernel distributes the biometric templates to the country’s chosen Automated Biometric Identification System (ABIS) to verify uniqueness. If unique, an encrypted national ID number is generated and a verifiable credential is issued.',
      governanceAndCompliance: 'Licensed under Mozilla Public License 2.0. Complies with international privacy frameworks (EU GDPR principles, UN Privacy guidelines). Sovereign host nations retain 100% control over all data keys; neither MOSIP nor donors have backdoors.',
      citizenJourney: 'A rural woman in Mindanao with no prior birth certificate registers at a local schoolhouse, receives her PhilSys ID card in 3 weeks, and successfully opens her first formal savings account at a commercial bank branch.'
    }
  },
  {
    id: 'civic-bolsa-familia-cadunico',
    name: 'Bolsa Família & CadÚnico - Unified Social Registry & Cash Safety Net',
    entityType: 'Public Program',
    countryRegion: 'Brazil (Ministry of Social Development & Caixa Econômica Federal)',
    domain: 'Social Protection Systems & Targeted Welfare Delivery',
    missionPurpose: 'Eradicate extreme poverty and break intergenerational poverty cycles through targeted conditional cash transfers linked directly to child education, maternal healthcare, and child vaccination.',
    problemAddressed: 'Severe childhood malnutrition, high school dropout rates among rural and favela youth, and fragmented overlapping municipal welfare programs causing administrative waste and political patronage.',
    targetPopulation: '21 Million low-income Brazilian families (covering over 55 Million individuals, approximately 25% of Brazil’s population).',
    operatingModel: 'Integrated federal-municipal operating framework. 5,570 municipal Social Assistance Reference Centers (CRAS) conduct in-person interviews to update the Cadastro Único (CadÚnico) national database. The federal Ministry of Social Development calculates monthly entitlements based on income and family composition, and Caixa Econômica Federal executes direct electronic payments into digital savings accounts (Caixa Tem).',
    keyPrograms: [
      'Conditional Cash Transfer (Monthly base benefit + top-ups for infants, children, and pregnant mothers)',
      'CadÚnico Unified Social Registry (Single source of truth used for 30+ federal and state social programs)',
      'Caixa Tem Digital Social Accounts (Free digital banking app distributed to informal sector workers)',
      'Cross-Ministerial Health & Education Conditionalities Monitoring'
    ],
    services: [
      {
        name: 'Monthly Conditional Cash Transfer Payment',
        description: 'Electronic monthly welfare payment deposited directly into the head-of-household’s account (90%+ women).',
        deliveryChannel: 'Caixa Tem Mobile App & Bolsa Família Debit Card',
        targetGroup: 'Families living below official poverty thresholds'
      },
      {
        name: 'Cadastro Único Registration & Socioeconomic Profiling',
        description: 'Comprehensive household survey recording housing material, electricity access, schooling, and income.',
        deliveryChannel: 'Municipal CRAS centers and mobile registration boats in the Amazon',
        targetGroup: 'Low-income households earning up to half a minimum wage per capita'
      },
      {
        name: 'Social Program Gateway & Automated Tariffs',
        description: 'Automatic discounts on electricity tariffs, free federal university exam waivers, and cistern construction grants.',
        deliveryChannel: 'Inter-ministerial data exchange query API',
        targetGroup: 'Registered CadÚnico beneficiaries'
      }
    ],
    technologyInfrastructure: [
      {
        name: 'CadÚnico Central Registry Database',
        role: 'National database tracking 90M+ citizen records with automated cross-checks against tax, social security, and labor records.',
        architecture: 'High-volume relational enterprise database with batch deduplication.'
      },
      {
        name: 'Caixa Tem Digital Banking Infrastructure',
        role: 'Mass-scale mobile banking platform handling instant Pix transfers, debit card purchases, and ATM cash withdrawals.',
        architecture: 'Cloud-native mobile banking core capable of processing 100M active mobile accounts.'
      },
      {
        name: 'Ministry of Health & Education Conditionality Tracker',
        role: 'Data integration pipeline checking that children maintain 85% school attendance and up-to-date vaccine cards.',
        architecture: 'Automated inter-agency monthly batch reconciliation pipeline.'
      }
    ],
    digitalCapabilities: [
      'Massive digital financial inclusion: onboarded 40M+ unbanked adults into Caixa Tem digital bank accounts',
      'Automated administrative cross-referencing: algorithmically detects undeclared formal jobs via tax databases',
      'Prioritization of female heads of household (90%+ of payment cards issued directly in the mother’s name)',
      'Integrated conditionality tracking preventing benefit suspension through early social worker outreach'
    ],
    fundingProcurementModel: 'Direct federal budget allocation via Brazilian National Treasury (~0.5% of Brazil’s GDP). Delivery executed by state-owned bank Caixa Econômica Federal under service contract.',
    stakeholders: [
      { group: 'Ministry of Social Development (MDS)', role: 'Policy design, poverty line definitions, and overall budget allocation.' },
      { group: 'Municipal CRAS Centers', role: 'Frontline social workers conducting household home visits and interviews.' },
      { group: 'Caixa Econômica Federal', role: 'Payment processing, mobile app maintenance, and nationwide branch/lottery shop cash delivery.' },
      { group: 'Ministries of Health & Education', role: 'Reporting school attendance logs and maternal clinic visits.' },
      { group: 'Beneficiary Mothers & Families', role: 'Managing household food budgets, ensuring children attend school.' }
    ],
    partners: [
      { name: 'World Bank', type: 'Multilateral Institution', role: 'Longitudinal impact evaluation and knowledge transfer to other Latin American nations' },
      { name: 'UNICEF Brazil', type: 'International Body', role: 'Monitoring child nutrition and early childhood education interventions' },
      { name: 'DataPrev (Social Security Information Technology Enterprise)', type: 'Public Institution', role: 'Data processing and big-data cross-matching' }
    ],
    impactAreas: [
      'Lifted over 30 Million Brazilians out of extreme poverty over two decades',
      'Halved child mortality related to malnutrition in high-poverty northeast regions',
      'Increased female school completion rates and lowered teenage pregnancy rates',
      'Global reference model for social safety nets imitated across 40+ countries'
    ],
    relevantRoles: [
      'Data Analytics & BI',
      'Program & Project Management',
      'Software Engineering',
      'Product & Technical Operations',
      'Business Analysis & Strategy'
    ],
    relatedSkills: [
      { name: 'Social Registry Architecture (CadÚnico)', category: 'Public Sector Data', proficiency: 'Expert' },
      { name: 'Cross-Agency Batch Data Reconciliation', category: 'Data Engineering', proficiency: 'Practitioner' },
      { name: 'Mass-Scale Digital Banking Rails (Pix & Mobile)', category: 'Fintech Systems', proficiency: 'Expert' },
      { name: 'Conditionality Monitoring & Social Impact Metrics', category: 'Impact Evaluation', proficiency: 'Expert' },
      { name: 'Human-Centered Public Welfare Operations', category: 'Operations Strategy', proficiency: 'Practitioner' }
    ],
    relatedToolsPlatforms: [
      'Caixa Tem Mobile Banking Platform',
      'Oracle & DB2 Enterprise Relational Databases',
      'DataPrev Big Data Processing Hub',
      'Brazil Pix Central Bank Payment Network',
      'QGIS for territorial social vulnerability mapping'
    ],
    relatedInnovation: [
      'Direct card issuance to female heads of household, dramatically improving children’s nutritional outcomes',
      'Caixa Tem mobile banking rollout converting 40M unbanked adults into digital banking consumers in months',
      'Single Unified Social Registry (CadÚnico) enabling 30 different government ministries to share one poverty database'
    ],
    knowledgeSources: [
      { title: 'World Bank: Brazil’s Bolsa Família - 20 Years of Social Protection Innovation', type: 'Impact Evaluation', publicationDate: '2023-11-10' },
      { title: 'Ministry of Social Development: Operational Guidelines for CadÚnico and Benefit Calculation', type: 'Legislation', publicationDate: '2023-03-01' },
      { title: 'International Policy Centre for Inclusive Growth (IPC-IG): Lessons from Conditional Cash Transfers', type: 'Whitepaper', publicationDate: '2022-07-15' }
    ],
    officialWebsite: 'https://www.gov.br/mds/pt-br/acoes-e-programas/bolsa-familia',
    sourceUrl: 'https://cadunico.dataprev.gov.br',
    dateTime: '2026-03-01',
    status: 'Nationwide Scaled',
    versionEdition: 'Bolsa Família 2026 Framework',
    systemRelationships: {
      modelType: 'government_service_delivery',
      flowTitle: 'National Social Safety Net & Human Development Delivery Chain',
      nodes: [
        {
          stageLabel: 'National Constitutional Mandate',
          title: 'Federal Zero Hunger & Social Safety Statute',
          description: 'Legal right to basic income and social protection for families in extreme vulnerability.',
          colorClass: 'bg-blue-600 text-white'
        },
        {
          stageLabel: 'Public Service Delivery',
          title: 'Conditional Cash Transfers & Maternal Top-Ups',
          description: 'Monthly direct monetary aid delivered on condition of child school attendance and vaccination.',
          colorClass: 'bg-indigo-600 text-white'
        },
        {
          stageLabel: 'Technology Platform',
          title: 'CadÚnico Registry & Caixa Tem Digital Banking',
          description: 'Single national socioeconomic database linked directly to 40M+ zero-fee mobile bank accounts.',
          colorClass: 'bg-violet-600 text-white'
        },
        {
          stageLabel: 'Municipal Frontline Centers',
          title: '5,570 Municipalities & Social Workers (CRAS)',
          description: 'Field social workers registering families, verifying living conditions, and providing counseling.',
          colorClass: 'bg-purple-600 text-white'
        },
        {
          stageLabel: 'Users / Beneficiaries',
          title: '21 Million Families (90%+ Female Cardholders)',
          description: 'Mothers managing food budgets, buying medicine, and sending children to school regularly.',
          colorClass: 'bg-emerald-600 text-white'
        },
        {
          stageLabel: 'Measurable Outcomes',
          title: 'Eradicated Severe Hunger & Broken Poverty Cycle',
          description: 'Dramatic drop in child mortality; historic rise in secondary school graduation among favela youth.',
          colorClass: 'bg-teal-600 text-white'
        }
      ]
    },
    systemWorkflowSummary: {
      howItWorks: 'A mother visits her local municipal CRAS center. A social worker conducts an in-depth CadÚnico interview. The data synchronizes with DataPrev servers to verify income against tax and pension databases. The federal ministry calculates the monthly entitlement. On the designated day of the month, funds are credited to her Caixa Tem digital account. Simultaneously, public schools log her children’s monthly attendance in the education ministry portal; if attendance exceeds 85%, benefits continue uninterrupted.',
      governanceAndCompliance: 'Governed by Federal Law No. 14,601/2023. Periodic algorithmic registry hygiene audits cross-reference municipal voter rolls, vehicle registrations, and formal payrolls to prevent ineligible claimants.',
      citizenJourney: 'A mother opens the Caixa Tem app on her mobile phone on the 18th of the month, sees R$ 680 credited, pays her neighborhood grocery store via instant Pix QR code, and checks that her daughter’s vaccination card is stamped for next month.'
    }
  }
];
