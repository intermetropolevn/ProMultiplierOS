import { 
  SourceFamily, 
  SourceFamilyConfig, 
  SourceTypeConfig,
  EvidenceStrengthDefinition, 
  EvidenceStrengthLevel,
  SourceStatus
} from './types';

export const EVIDENCE_STRENGTH_LEVELS: EvidenceStrengthDefinition[] = [
  {
    level: 0,
    name: 'Consumption',
    shortLabel: 'L0 Consumed',
    description: 'Passive viewing or browsing without verified retention or active work.',
    example: 'Watched a conference talk, video recording, or podcast.',
    colorClass: 'text-slate-500 border-slate-300 bg-slate-50',
    badgeBg: 'bg-slate-100 text-slate-700'
  },
  {
    level: 1,
    name: 'Exposure',
    shortLabel: 'L1 Exposed',
    description: 'Active reading or conceptual review of literature, books, or documentation.',
    example: 'Read an authoritative industry book, academic paper, or standard.',
    colorClass: 'text-sky-600 border-sky-300 bg-sky-50',
    badgeBg: 'bg-sky-100 text-sky-800'
  },
  {
    level: 2,
    name: 'Learning',
    shortLabel: 'L2 Learned',
    description: 'Structured course progression, syllabus completion, or workshop participation.',
    example: 'Completed a university curriculum, bootcamp track, or online course.',
    colorClass: 'text-blue-600 border-blue-300 bg-blue-50',
    badgeBg: 'bg-blue-100 text-blue-800'
  },
  {
    level: 3,
    name: 'Credentialed',
    shortLabel: 'L3 Credential',
    description: 'Verified professional certification, digital badge, or accredited qualification.',
    example: 'Earned AWS Certified Solutions Architect, PMP, or University Micro-credential.',
    colorClass: 'text-indigo-600 border-indigo-300 bg-indigo-50',
    badgeBg: 'bg-indigo-100 text-indigo-800'
  },
  {
    level: 4,
    name: 'Applied',
    shortLabel: 'L4 Applied',
    description: 'Put knowledge into practice within a project, workflow, or workplace initiative.',
    example: 'Integrated Redis caching into a client project or built a working hackathon MVP.',
    colorClass: 'text-teal-600 border-teal-300 bg-teal-50',
    badgeBg: 'bg-teal-100 text-teal-800'
  },
  {
    level: 5,
    name: 'Demonstrated',
    shortLabel: 'L5 Demonstrated',
    description: 'Produced an authoritative concrete artifact, solved a case, or delivered measurable work.',
    example: 'Authored an enterprise PRD, created a UX flow, or delivered a live company dashboard.',
    colorClass: 'text-purple-600 border-purple-300 bg-purple-50',
    badgeBg: 'bg-purple-100 text-purple-800'
  },
  {
    level: 6,
    name: 'Validated',
    shortLabel: 'L6 Validated',
    description: 'External evaluation, competitive ranking, employer assessment, or client sign-off.',
    example: 'Passed a company technical interview case, won hackathon 1st place, or top client rating.',
    colorClass: 'text-emerald-700 border-emerald-300 bg-emerald-50',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  }
];

export const GENERIC_STATUSES: { id: SourceStatus; label: string; color: string }[] = [
  { id: 'saved', label: 'Saved', color: 'bg-slate-100 text-slate-700' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'applied', label: 'Applied', color: 'bg-purple-100 text-purple-800' },
  { id: 'archived', label: 'Archived', color: 'bg-slate-100 text-slate-500' }
];

export const CREDENTIAL_STATUSES: { id: SourceStatus; label: string; color: string }[] = [
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
  { id: 'earned', label: 'Earned', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'expired', label: 'Expired', color: 'bg-rose-100 text-rose-800' },
  { id: 'renewed', label: 'Renewed', color: 'bg-teal-100 text-teal-800' }
];

export const ASSESSMENT_STATUSES: { id: SourceStatus; label: string; color: string }[] = [
  { id: 'planned', label: 'Planned', color: 'bg-slate-100 text-slate-700' },
  { id: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-800' },
  { id: 'passed', label: 'Passed', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'failed', label: 'Failed', color: 'bg-rose-100 text-rose-800' },
  { id: 'reviewed', label: 'Reviewed', color: 'bg-purple-100 text-purple-800' }
];

export const PROJECT_STATUSES: { id: SourceStatus; label: string; color: string }[] = [
  { id: 'planned', label: 'Planned', color: 'bg-slate-100 text-slate-700' },
  { id: 'active', label: 'Active', color: 'bg-blue-100 text-blue-800' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'archived', label: 'Archived', color: 'bg-slate-100 text-slate-500' }
];

export const SOURCE_TAXONOMY: SourceFamilyConfig[] = [
  {
    id: 'learn',
    label: 'Learn',
    shortDescription: 'Books, structured courses, bootcamps, and curriculum tracks',
    iconName: 'BookOpen',
    defaultStrength: 2,
    types: [
      {
        id: 'book',
        label: 'Book',
        family: 'learn',
        defaultEvidenceStrength: 1,
        description: 'Hardcover, paperback, or digital published book/monograph.',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied'],
        metadataFields: [
          { key: 'author', label: 'Author(s)', type: 'text', placeholder: 'e.g. Martin Kleppmann', required: true },
          { key: 'publisher', label: 'Publisher', type: 'text', placeholder: "e.g. O'Reilly Media" },
          { key: 'isbn', label: 'ISBN', type: 'text', placeholder: 'e.g. 978-1449373320' },
          { key: 'pages', label: 'Total Pages', type: 'number', placeholder: 'e.g. 614' },
          { key: 'readingStatus', label: 'Reading Progress', type: 'select', options: ['Want to Read', 'Reading', 'Completed', 'Annotated'] },
          { key: 'rating', label: 'Personal Rating (1-5)', type: 'select', options: ['5 - Critical Masterpiece', '4 - Strong Reference', '3 - Useful', '2 - Basic', '1 - Skip'] }
        ]
      },
      {
        id: 'course',
        label: 'Course',
        family: 'learn',
        defaultEvidenceStrength: 2,
        description: 'Comprehensive online or classroom course with lessons and exercises.',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied'],
        metadataFields: [
          { key: 'provider', label: 'Provider / Platform', type: 'text', placeholder: 'e.g. Coursera, edX, Reforge', required: true },
          { key: 'instructor', label: 'Instructor / Faculty', type: 'text', placeholder: 'e.g. Andrew Ng' },
          { key: 'duration', label: 'Duration / Hours', type: 'text', placeholder: 'e.g. 40 hours (8 weeks)' },
          { key: 'completionStatus', label: 'Completion Certificate', type: 'select', options: ['With Certificate', 'Audited', 'In Progress'] }
        ]
      },
      {
        id: 'mooc',
        label: 'MOOC',
        family: 'learn',
        defaultEvidenceStrength: 2,
        description: 'Massive Open Online Course with modular video lectures and assignments.',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied'],
        metadataFields: [
          { key: 'provider', label: 'Platform', type: 'text', placeholder: 'e.g. MIT OpenCourseWare' },
          { key: 'courseCode', label: 'Course Code', type: 'text', placeholder: 'e.g. CS61A, 6.004' }
        ]
      },
      {
        id: 'university_course',
        label: 'University Course',
        family: 'learn',
        defaultEvidenceStrength: 2,
        description: 'Credit-bearing higher education course or syllabus module.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'university', label: 'University / College', type: 'text', placeholder: 'e.g. Stanford University' },
          { key: 'grade', label: 'Grade / Evaluation', type: 'text', placeholder: 'e.g. 4.0 / A+' }
        ]
      },
      {
        id: 'professional_program',
        label: 'Professional Program',
        family: 'learn',
        defaultEvidenceStrength: 2,
        description: 'Industry-accredited executive or professional development track.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'institution', label: 'Institution', type: 'text', placeholder: 'e.g. INSEAD, Harvard Extension' }
        ]
      },
      {
        id: 'bootcamp',
        label: 'Bootcamp',
        family: 'learn',
        defaultEvidenceStrength: 3,
        description: 'Intensive practical immersion program with project drills.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'bootcampName', label: 'Bootcamp Name', type: 'text', placeholder: 'e.g. Flatiron, General Assembly' },
          { key: 'capstoneTitle', label: 'Capstone Project', type: 'text' }
        ]
      },
      {
        id: 'workshop',
        label: 'Workshop',
        family: 'learn',
        defaultEvidenceStrength: 1,
        description: 'Hands-on interactive 1-2 day tactical skill session.',
        allowedStatuses: ['completed', 'saved'],
        metadataFields: [
          { key: 'host', label: 'Host / Organizer', type: 'text' },
          { key: 'format', label: 'Format', type: 'select', options: ['Live Hands-On', 'Virtual Lab', 'In-Person'] }
        ]
      },
      {
        id: 'cohort_program',
        label: 'Cohort Program',
        family: 'learn',
        defaultEvidenceStrength: 2,
        description: 'Community-driven cohort learning with peer feedback and case discussions.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'cohortNumber', label: 'Cohort Batch', type: 'text', placeholder: 'e.g. Cohort 12' }
        ]
      },
      {
        id: 'masterclass',
        label: 'Masterclass',
        family: 'learn',
        defaultEvidenceStrength: 1,
        description: 'Deep-dive session hosted by a recognized industry master practitioner.',
        allowedStatuses: ['completed', 'saved'],
        metadataFields: [
          { key: 'instructor', label: 'Master Practitioner', type: 'text' }
        ]
      },
      {
        id: 'lecture',
        label: 'Lecture',
        family: 'learn',
        defaultEvidenceStrength: 1,
        description: 'Single guest lecture, seminar, or academic presentation.',
        allowedStatuses: ['completed', 'saved'],
        metadataFields: [
          { key: 'speaker', label: 'Speaker', type: 'text' },
          { key: 'venue', label: 'Venue / Event', type: 'text' }
        ]
      },
      {
        id: 'learning_path',
        label: 'Learning Path',
        family: 'learn',
        defaultEvidenceStrength: 2,
        description: 'Curated multi-module roadmap advancing through foundational to advanced competencies.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'milestones', label: 'Milestones Count', type: 'number' }
        ]
      },
      {
        id: 'reading_list',
        label: 'Reading List',
        family: 'learn',
        defaultEvidenceStrength: 1,
        description: 'Thematic syllabus of books and seminal papers for a domain.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'theme', label: 'Curated Theme', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'credential',
    label: 'Credential',
    shortDescription: 'Certificates, professional certifications, digital badges, and verified licenses',
    iconName: 'Award',
    defaultStrength: 3,
    types: [
      {
        id: 'certificate',
        label: 'Certificate',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Certificate of completion or training credential (e.g. Coursera, Udemy, Google Certificate).',
        allowedStatuses: ['in_progress', 'earned', 'expired', 'renewed'],
        metadataFields: [
          { key: 'issuer', label: 'Issuing Organization / Platform', type: 'text', placeholder: 'e.g. Coursera, DeepLearning.AI, Udemy', required: true },
          { key: 'credentialId', label: 'Credential ID', type: 'text', placeholder: 'e.g. CERT-839219' },
          { key: 'credentialUrl', label: 'Credential Verification URL', type: 'url', placeholder: 'https://...' },
          { key: 'issueDate', label: 'Issue Date', type: 'date' },
          { key: 'expirationDate', label: 'Expiration Date', type: 'date' }
        ]
      },
      {
        id: 'professional_certification',
        label: 'Professional Certification',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Competency-validating professional credential through examination (e.g. AWS, PSPO, PMP, CISSP).',
        allowedStatuses: ['in_progress', 'earned', 'expired', 'renewed'],
        metadataFields: [
          { key: 'examBoard', label: 'Exam Board / Body', type: 'text', required: true },
          { key: 'licenseNumber', label: 'License / Cert Number', type: 'text' },
          { key: 'scorePercentile', label: 'Score / Percentile', type: 'text' },
          { key: 'credentialLevel', label: 'Credential Level', type: 'select', options: ['Entry', 'Foundation', 'Professional', 'Advanced', 'Expert'] }
        ]
      },
      {
        id: 'diploma',
        label: 'Diploma',
        family: 'credential',
        defaultEvidenceStrength: 4,
        description: 'Formal educational qualification awarded after completing a structured academic or professional program.',
        allowedStatuses: ['in_progress', 'earned'],
        metadataFields: [
          { key: 'institution', label: 'Institution / College', type: 'text', placeholder: 'e.g. Chartered Institute of Marketing (CIM)', required: true },
          { key: 'fieldOfStudy', label: 'Field of Study', type: 'text', placeholder: 'e.g. Business Administration, Data Science' },
          { key: 'credentialLevel', label: 'Credential Level', type: 'select', options: ['Postgraduate', 'Graduate', 'Professional', 'Advanced'] },
          { key: 'duration', label: 'Program Duration', type: 'text', placeholder: 'e.g. 1 year full-time' }
        ]
      },
      {
        id: 'degree',
        label: 'Degree',
        family: 'credential',
        defaultEvidenceStrength: 4,
        description: 'Formal academic qualification (Associate, Bachelor, Master, Doctorate).',
        allowedStatuses: ['in_progress', 'earned'],
        metadataFields: [
          { key: 'university', label: 'University / Accredited Institution', type: 'text', placeholder: 'e.g. University of Illinois, Stanford University', required: true },
          { key: 'qualificationType', label: 'Degree Qualification', type: 'select', options: ["Associate Degree", "Bachelor's Degree", "Master's Degree", "Doctorate"] },
          { key: 'fieldOfStudy', label: 'Major / Field of Study', type: 'text', placeholder: 'e.g. Computer Science & Distributed Systems' },
          { key: 'credentialLevel', label: 'Credential Level', type: 'select', options: ['Graduate', 'Postgraduate', 'Professional'] },
          { key: 'accreditation', label: 'Accreditation Body', type: 'text', placeholder: 'e.g. ABET, AACSB, Regional Accreditor' }
        ]
      },
      {
        id: 'digital_badge',
        label: 'Digital Badge',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Verifiable cryptographic or OpenBadge digital achievement.',
        allowedStatuses: ['earned'],
        metadataFields: [
          { key: 'badgePlatform', label: 'Badge Platform', type: 'text', placeholder: 'e.g. Credly, Accredible' },
          { key: 'badgeUrl', label: 'Badge Verification Link', type: 'url' }
        ]
      },
      {
        id: 'micro_credential',
        label: 'Micro-credential',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Targeted proof of discrete technical or business competency.',
        allowedStatuses: ['in_progress', 'earned'],
        metadataFields: [
          { key: 'competencyEvaluated', label: 'Target Competency', type: 'text' }
        ]
      },
      {
        id: 'course_completion',
        label: 'Course Completion',
        family: 'credential',
        defaultEvidenceStrength: 2,
        description: 'Official acknowledgement of finishing all course units.',
        allowedStatuses: ['earned'],
        metadataFields: [
          { key: 'courseTitle', label: 'Completed Course', type: 'text' }
        ]
      },
      {
        id: 'license',
        label: 'License',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Official legal or regulatory professional practice license.',
        allowedStatuses: ['earned', 'expired', 'renewed'],
        metadataFields: [
          { key: 'jurisdiction', label: 'State / Jurisdiction', type: 'text' }
        ]
      },
      {
        id: 'accreditation',
        label: 'Accreditation',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Formal recognition by an authorized oversight body.',
        allowedStatuses: ['earned'],
        metadataFields: [
          { key: 'accreditingBody', label: 'Accrediting Body', type: 'text' }
        ]
      },
      {
        id: 'award',
        label: 'Award',
        family: 'credential',
        defaultEvidenceStrength: 5,
        description: 'Competitive honor, company recognition, or excellence prize.',
        allowedStatuses: ['earned'],
        metadataFields: [
          { key: 'awardingOrganization', label: 'Awarding Organization', type: 'text' },
          { key: 'competitionScope', label: 'Scope', type: 'text', placeholder: 'e.g. National, Company-wide' }
        ]
      },
      {
        id: 'scholarship',
        label: 'Scholarship',
        family: 'credential',
        defaultEvidenceStrength: 3,
        description: 'Merit-based grant or academic funding award.',
        allowedStatuses: ['earned'],
        metadataFields: [
          { key: 'grantor', label: 'Grantor', type: 'text' }
        ]
      },
      {
        id: 'fellowship',
        label: 'Fellowship',
        family: 'credential',
        defaultEvidenceStrength: 4,
        description: 'Selective program granting research status or executive residency.',
        allowedStatuses: ['in_progress', 'earned'],
        metadataFields: [
          { key: 'fellowshipTitle', label: 'Fellowship Program', type: 'text' }
        ]
      },
      {
        id: 'membership',
        label: 'Membership',
        family: 'credential',
        defaultEvidenceStrength: 1,
        description: 'Peer-reviewed or professional society membership (e.g. IEEE, ACM).',
        allowedStatuses: ['earned', 'expired', 'renewed'],
        metadataFields: [
          { key: 'societyName', label: 'Professional Society', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'knowledge',
    label: 'Knowledge',
    shortDescription: 'Research papers, industry benchmarks, playbooks, frameworks, and official guides',
    iconName: 'FileText',
    defaultStrength: 1,
    types: [
      {
        id: 'academic_paper',
        label: 'Academic Paper',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Peer-reviewed scholarly article with research methodologies and empirical results.',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'authors', label: 'Authors', type: 'text' },
          { key: 'journalConference', label: 'Journal / Conference', type: 'text', placeholder: 'e.g. NeurIPS, OSDI' },
          { key: 'doi', label: 'DOI / ArXiv ID', type: 'text' }
        ]
      },
      {
        id: 'research_paper',
        label: 'Research Paper',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Empirical or theoretical research report from labs or industry think-tanks.',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'lab', label: 'Research Lab / Firm', type: 'text', placeholder: 'e.g. DeepMind, OpenAI' }
        ]
      },
      {
        id: 'whitepaper',
        label: 'Whitepaper',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Authoritative technical or strategic report outlining a philosophy or technology.',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'organization', label: 'Publishing Body', type: 'text' }
        ]
      },
      {
        id: 'industry_report',
        label: 'Industry Report',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Market dynamics, sector economics, and competitive benchmarking data.',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'publisher', label: 'Publisher', type: 'text', placeholder: 'e.g. McKinsey, Gartner, Bain' }
        ]
      },
      {
        id: 'benchmark',
        label: 'Benchmark',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Standardized empirical metric dataset (e.g. SaaS CAC/LTV, latency SLAs).',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'metricsTracked', label: 'Metrics Benchmarked', type: 'text' }
        ]
      },
      {
        id: 'survey',
        label: 'Survey',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Sampled practitioner empirical responses across engineering or product stacks.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'sampleSize', label: 'Sample Size (N)', type: 'number' }
        ]
      },
      {
        id: 'documentation',
        label: 'Documentation',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Official API reference, architecture docs, or platform system manuals.',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'techStack', label: 'Technology / Tool', type: 'text' }
        ]
      },
      {
        id: 'official_guide',
        label: 'Official Guide',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Canonical manual produced by standard creators (e.g. The Scrum Guide).',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'creator', label: 'Governing Body', type: 'text' }
        ]
      },
      {
        id: 'handbook',
        label: 'Handbook',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Exhaustive operational or departmental guidelines manual.',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'department', label: 'Function / Department', type: 'text' }
        ]
      },
      {
        id: 'playbook',
        label: 'Playbook',
        family: 'knowledge',
        defaultEvidenceStrength: 2,
        description: 'Actionable step-by-step procedural play for incident, growth, or delivery.',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'triggerEvent', label: 'Trigger / Use Case', type: 'text' }
        ]
      },
      {
        id: 'framework',
        label: 'Framework',
        family: 'knowledge',
        defaultEvidenceStrength: 2,
        description: 'Cognitive or analytical model (e.g. MECE, CIRCLES, RICE, 4 Pillars).',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'frameworkCategory', label: 'Category', type: 'select', options: ['Prioritization', 'Diagnostic', 'Architecture', 'Strategy'] }
        ]
      },
      {
        id: 'methodology',
        label: 'Methodology',
        family: 'knowledge',
        defaultEvidenceStrength: 2,
        description: 'System of methods, principles, and rules applied in a discipline.',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'paradigm', label: 'Paradigm', type: 'text' }
        ]
      },
      {
        id: 'standard',
        label: 'Standard',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Consensus specification codified by formal standards bodies (ISO, IETF, W3C).',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'standardCode', label: 'Code (e.g. RFC 7519)', type: 'text' }
        ]
      },
      {
        id: 'specification',
        label: 'Specification',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Exact technical requirements document detailing interfaces and behaviors.',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'systemName', label: 'Target System', type: 'text' }
        ]
      },
      {
        id: 'best_practice',
        label: 'Best Practice',
        family: 'knowledge',
        defaultEvidenceStrength: 1,
        description: 'Proven design pattern or behavioral standard across top engineering teams.',
        allowedStatuses: ['saved', 'applied'],
        metadataFields: [
          { key: 'contextOfUse', label: 'Operational Context', type: 'text' }
        ]
      },
      {
        id: 'case_study',
        label: 'Case Study',
        family: 'knowledge',
        defaultEvidenceStrength: 2,
        description: 'In-depth retrospective of a company’s real business or engineering turnaround.',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'subjectCompany', label: 'Target Company', type: 'text' },
          { key: 'strategicProblem', label: 'Core Problem', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'experience',
    label: 'Experience',
    shortDescription: 'Full-time jobs, consulting engagements, freelance clients, and leadership tenures',
    iconName: 'Briefcase',
    defaultStrength: 4,
    types: [
      {
        id: 'job',
        label: 'Job',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Direct employment role with core responsibilities and deliverables.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'company', label: 'Company / Employer', type: 'text', required: true },
          { key: 'jobTitle', label: 'Role Title', type: 'text', required: true },
          { key: 'employmentType', label: 'Employment Type', type: 'select', options: ['Full-time', 'Part-time', 'Contract'] },
          { key: 'teamSize', label: 'Team Size / Department', type: 'text' }
        ]
      },
      {
        id: 'role',
        label: 'Role',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Specific functional mandate or internal promotion within an enterprise.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'function', label: 'Core Function', type: 'text' }
        ]
      },
      {
        id: 'freelance_engagement',
        label: 'Freelance Engagement',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Independent client contract delivering focused technical or product solutions.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'client', label: 'Client / Business', type: 'text' },
          { key: 'scopeDeliverable', label: 'Key Deliverable', type: 'text' }
        ]
      },
      {
        id: 'client_project',
        label: 'Client Project',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'High-stakes client project executed inside an agency, firm, or studio.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'clientIndustry', label: 'Client Industry', type: 'text' }
        ]
      },
      {
        id: 'internship',
        label: 'Internship',
        family: 'experience',
        defaultEvidenceStrength: 3,
        description: 'Supervised early-career work placement with mentored projects.',
        allowedStatuses: ['completed', 'in_progress'],
        metadataFields: [
          { key: 'mentor', label: 'Mentor / Manager', type: 'text' }
        ]
      },
      {
        id: 'volunteer_work',
        label: 'Volunteer Work',
        family: 'experience',
        defaultEvidenceStrength: 3,
        description: 'Pro-bono contributions to non-profits, open communities, or educational orgs.',
        allowedStatuses: ['completed', 'in_progress'],
        metadataFields: [
          { key: 'cause', label: 'Community / Cause', type: 'text' }
        ]
      },
      {
        id: 'consulting',
        label: 'Consulting',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Advisory engagement diagnosing business bottlenecks and framing recommendations.',
        allowedStatuses: ['completed', 'in_progress'],
        metadataFields: [
          { key: 'problemDiagnosed', label: 'Problem Diagnosed', type: 'text' }
        ]
      },
      {
        id: 'advisory',
        label: 'Advisory',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Board advisory, startup mentorship, or technical guidance council.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'focusArea', label: 'Strategic Focus', type: 'text' }
        ]
      },
      {
        id: 'mentoring',
        label: 'Mentoring',
        family: 'experience',
        defaultEvidenceStrength: 3,
        description: 'One-on-one coaching and developing junior or mid-level team members.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'menteesCount', label: 'Mentees Count', type: 'number' }
        ]
      },
      {
        id: 'leadership_experience',
        label: 'Leadership Experience',
        family: 'experience',
        defaultEvidenceStrength: 5,
        description: 'People management, org restructuring, and headcount scaling.',
        allowedStatuses: ['in_progress', 'completed'],
        metadataFields: [
          { key: 'reportsManaged', label: 'Direct Reports Managed', type: 'number' }
        ]
      },
      {
        id: 'partnership',
        label: 'Partnership',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Joint enterprise venture, co-marketing alliance, or platform integration.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'partnerOrg', label: 'Partner Entity', type: 'text' }
        ]
      },
      {
        id: 'collaboration',
        label: 'Collaboration',
        family: 'experience',
        defaultEvidenceStrength: 4,
        description: 'Cross-company or cross-functional multidisciplinary joint initiative.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'collaborators', label: 'Key Teams', type: 'text' }
        ]
      },
      {
        id: 'event_organization',
        label: 'Event Organization',
        family: 'experience',
        defaultEvidenceStrength: 3,
        description: 'Organizing a conference, hackathon, tech meetup, or symposium.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'attendeesCount', label: 'Attendees Count', type: 'number' }
        ]
      }
    ]
  },
  {
    id: 'project',
    label: 'Project',
    shortDescription: 'Side projects, work initiatives, open source repos, capstones, and hackathons',
    iconName: 'FolderGit2',
    defaultStrength: 4,
    types: [
      {
        id: 'personal_project',
        label: 'Personal Project',
        family: 'project',
        defaultEvidenceStrength: 4,
        description: 'Self-directed software application, tool, or product experiment.',
        allowedStatuses: ['planned', 'active', 'completed', 'archived'],
        metadataFields: [
          { key: 'role', label: 'Your Role', type: 'text', placeholder: 'e.g. Full-Stack Developer & Creator' },
          { key: 'technologies', label: 'Technologies Used', type: 'tags', placeholder: 'React, TypeScript, Postgres' },
          { key: 'projectUrl', label: 'Live Demo URL', type: 'url' },
          { key: 'repository', label: 'GitHub / Repo Link', type: 'url' },
          { key: 'outcomes', label: 'Key Outcomes / Users', type: 'textarea' }
        ]
      },
      {
        id: 'side_project',
        label: 'Side Project',
        family: 'project',
        defaultEvidenceStrength: 4,
        description: 'Extracurricular product built alongside primary employment.',
        allowedStatuses: ['planned', 'active', 'completed', 'archived'],
        metadataFields: [
          { key: 'monetization', label: 'Status / Revenue', type: 'text' }
        ]
      },
      {
        id: 'work_project',
        label: 'Work Project',
        family: 'project',
        defaultEvidenceStrength: 5,
        description: 'High-impact enterprise initiative or system migration shipped at work.',
        allowedStatuses: ['active', 'completed'],
        metadataFields: [
          { key: 'businessImpact', label: 'Measurable Business Impact', type: 'textarea', placeholder: 'e.g. Reduced latency 60%, saved $40k/yr' },
          { key: 'teamSize', label: 'Team Size', type: 'number' }
        ]
      },
      {
        id: 'academic_project',
        label: 'Academic Project',
        family: 'project',
        defaultEvidenceStrength: 3,
        description: 'Thesis, lab experiment, or university engineering coursework project.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'supervisor', label: 'Faculty Advisor', type: 'text' }
        ]
      },
      {
        id: 'capstone_project',
        label: 'Capstone Project',
        family: 'project',
        defaultEvidenceStrength: 4,
        description: 'Culminating comprehensive design and implementation project.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'sponsor', label: 'Industry Sponsor', type: 'text' }
        ]
      },
      {
        id: 'open_source_project',
        label: 'Open Source Project',
        family: 'project',
        defaultEvidenceStrength: 4,
        description: 'Public codebase contribution, library maintenance, or RFC authoring.',
        allowedStatuses: ['active', 'completed'],
        metadataFields: [
          { key: 'stars', label: 'GitHub Stars / Forks', type: 'text' },
          { key: 'pullRequests', label: 'PRs Merged', type: 'number' }
        ]
      },
      {
        id: 'hackathon_project',
        label: 'Hackathon Project',
        family: 'project',
        defaultEvidenceStrength: 4,
        description: 'Rapid sprint MVP created under time constraints during a competition.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'hackathonName', label: 'Hackathon Name', type: 'text' },
          { key: 'placement', label: 'Prize / Placement', type: 'text', placeholder: 'e.g. 1st Place Track Winner' }
        ]
      },
      {
        id: 'research_project',
        label: 'Research Project',
        family: 'project',
        defaultEvidenceStrength: 4,
        description: 'Scientific investigation, benchmark suite, or algorithmic experimentation.',
        allowedStatuses: ['active', 'completed'],
        metadataFields: [
          { key: 'hypothesis', label: 'Falsifiable Hypothesis', type: 'textarea' }
        ]
      },
      {
        id: 'startup_project',
        label: 'Startup Project',
        family: 'project',
        defaultEvidenceStrength: 5,
        description: 'Commercial venture launched to acquire initial paying customers.',
        allowedStatuses: ['active', 'completed', 'archived'],
        metadataFields: [
          { key: 'traction', label: 'Traction / Revenue / Users', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'artifact',
    label: 'Artifact',
    shortDescription: 'PRDs, UX flows, architectures, strategy decks, campaigns, and dashboards',
    iconName: 'Layout',
    defaultStrength: 5,
    types: [
      {
        id: 'case_study_artifact',
        label: 'Case Study',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'Documented problem-solving breakdown detailing options, trade-offs, and outcomes.',
        allowedStatuses: ['completed', 'applied'],
        metadataFields: [
          { key: 'clientContext', label: 'Context', type: 'text' },
          { key: 'tradeoffsMade', label: 'Trade-offs Evaluated', type: 'textarea' }
        ]
      },
      {
        id: 'prd',
        label: 'PRD / Product Spec',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'Product Requirements Document specifying problem statement, personas, and acceptance criteria.',
        allowedStatuses: ['completed', 'applied'],
        metadataFields: [
          { key: 'targetUsers', label: 'Target Persona', type: 'text' },
          { key: 'successMetrics', label: 'North Star Metric', type: 'text' },
          { key: 'specUrl', label: 'Doc / Notion Link', type: 'url' }
        ]
      },
      {
        id: 'ux_research',
        label: 'UX Research',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'User interview synthesis, thematic affinity mapping, and usability findings.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'interviewsConducted', label: 'User Interviews Count', type: 'number' }
        ]
      },
      {
        id: 'user_flow',
        label: 'User Flow',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'End-to-end journey diagram showing decision branches and edge cases.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'figmaLink', label: 'Figma / FigJam Link', type: 'url' }
        ]
      },
      {
        id: 'wireframe',
        label: 'Wireframe',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Low-fidelity layout blueprints and screen information architecture.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'tool', label: 'Design Tool Used', type: 'text' }
        ]
      },
      {
        id: 'ui_design',
        label: 'UI Design',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'High-fidelity visual design system, component states, and responsive views.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'designSystem', label: 'Design System Name', type: 'text' }
        ]
      },
      {
        id: 'prototype',
        label: 'Prototype',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'Interactive clickable mockup or code sandbox proving viability.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'prototypeUrl', label: 'Interactive Link', type: 'url' }
        ]
      },
      {
        id: 'campaign',
        label: 'Campaign',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Growth, product marketing, or acquisition campaign with conversion tracking.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'channels', label: 'Channels', type: 'text' }
        ]
      },
      {
        id: 'seo_audit',
        label: 'SEO Audit',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Technical crawl analysis, Core Web Vitals audit, and content gap roadmap.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'auditedDomain', label: 'Audited Domain', type: 'text' }
        ]
      },
      {
        id: 'gtm_plan',
        label: 'GTM Plan',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'Go-To-Market execution blueprint aligning positioning, pricing, and distribution.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'targetMarket', label: 'Target Geography / ICP', type: 'text' }
        ]
      },
      {
        id: 'marketing_plan',
        label: 'Marketing Plan',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Strategic customer acquisition, retention, and lifecycle communications plan.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'budget', label: 'Managed Budget', type: 'text' }
        ]
      },
      {
        id: 'research_report',
        label: 'Research Report',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Deep-dive qualitative or quantitative findings report with citations.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'executiveSummary', label: 'Core Insight', type: 'textarea' }
        ]
      },
      {
        id: 'business_analysis',
        label: 'Business Analysis',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Financial model, unit economic breakdown, or addressable market estimation.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'tamSamSom', label: 'Market Sizing Figure', type: 'text' }
        ]
      },
      {
        id: 'strategy',
        label: 'Strategy',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'Strategic memo defining where to play, how to win, and trade-offs made.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'strategicHorizons', label: 'Planning Horizon', type: 'text' }
        ]
      },
      {
        id: 'sop',
        label: 'SOP',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Standard Operating Procedure establishing reliable operational execution.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'frequency', label: 'Execution Frequency', type: 'text' }
        ]
      },
      {
        id: 'workflow_artifact',
        label: 'Workflow',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Documented multi-stage technical or product release pipeline.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'stages', label: 'Process Stages', type: 'text' }
        ]
      },
      {
        id: 'dashboard',
        label: 'Dashboard',
        family: 'artifact',
        defaultEvidenceStrength: 5,
        description: 'Live analytical telemetry tracking key operational or conversion KPIs.',
        allowedStatuses: ['completed', 'applied'],
        metadataFields: [
          { key: 'biPlatform', label: 'BI Platform / Stack', type: 'text', placeholder: 'e.g. Looker, Tableau, Grafana' }
        ]
      },
      {
        id: 'presentation',
        label: 'Presentation',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Executive briefing deck, keynote slide set, or stakeholder pitch.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'deckUrl', label: 'Deck Link', type: 'url' }
        ]
      },
      {
        id: 'proposal',
        label: 'Proposal',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'Client RFP response, enterprise sales proposal, or internal grant pitch.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'targetStakeholder', label: 'Target Decision Maker', type: 'text' }
        ]
      },
      {
        id: 'technical_documentation',
        label: 'Technical Documentation',
        family: 'artifact',
        defaultEvidenceStrength: 4,
        description: 'RFC, system architectural diagram, or internal developer wiki guide.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'serviceArchitecture', label: 'Target Microservice / System', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'content',
    label: 'Content',
    shortDescription: 'Articles, newsletters, podcasts, videos, talks, and community threads',
    iconName: 'Tv',
    defaultStrength: 0,
    types: [
      {
        id: 'article',
        label: 'Article',
        family: 'content',
        defaultEvidenceStrength: 1,
        description: 'Long-form editorial post or technical essay.',
        allowedStatuses: ['saved', 'completed', 'applied'],
        metadataFields: [
          { key: 'author', label: 'Author', type: 'text' },
          { key: 'publication', label: 'Publication', type: 'text' }
        ]
      },
      {
        id: 'blog_post',
        label: 'Blog Post',
        family: 'content',
        defaultEvidenceStrength: 1,
        description: 'Practitioner blog entry detailing tips, tutorials, or learnings.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'blogName', label: 'Blog', type: 'text' }
        ]
      },
      {
        id: 'newsletter',
        label: 'Newsletter',
        family: 'content',
        defaultEvidenceStrength: 1,
        description: 'Curated industry digest or Substack issue.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'newsletterName', label: 'Newsletter Title', type: 'text', placeholder: 'e.g. Lenny’s Newsletter' }
        ]
      },
      {
        id: 'podcast',
        label: 'Podcast',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Audio podcast series covering career, engineering, or strategy.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'host', label: 'Host', type: 'text' }
        ]
      },
      {
        id: 'podcast_episode',
        label: 'Podcast Episode',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Single interview episode focusing on a specific leader or topic.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'guest', label: 'Guest', type: 'text' }
        ]
      },
      {
        id: 'youtube_video',
        label: 'YouTube Video',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Online video tutorial, system teardown, or technical walk-through.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'channel', label: 'Channel Name', type: 'text' }
        ]
      },
      {
        id: 'lecture_recording',
        label: 'Lecture Recording',
        family: 'content',
        defaultEvidenceStrength: 1,
        description: 'Recorded university seminar or university course video.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'institution', label: 'Institution', type: 'text' }
        ]
      },
      {
        id: 'conference_talk',
        label: 'Conference Talk',
        family: 'content',
        defaultEvidenceStrength: 1,
        description: 'Keynote or technical breakout session delivered at a major conference.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'conference', label: 'Conference Name', type: 'text', placeholder: 'e.g. QCon, AWS re:Invent' },
          { key: 'speaker', label: 'Speaker', type: 'text' }
        ]
      },
      {
        id: 'interview',
        label: 'Interview',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Transcript or recording of an industry executive or founder interview.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'interviewee', label: 'Interviewee', type: 'text' }
        ]
      },
      {
        id: 'documentary',
        label: 'Documentary',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Film or long-form production on tech history or startup founding.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'director', label: 'Director / Studio', type: 'text' }
        ]
      },
      {
        id: 'thread_post',
        label: 'Thread / Post',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Social micro-essay, X/Twitter thread, or LinkedIn analysis.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'authorHandle', label: 'Author Handle', type: 'text' }
        ]
      },
      {
        id: 'community_discussion',
        label: 'Community Discussion',
        family: 'content',
        defaultEvidenceStrength: 0,
        description: 'Hacker News thread, Reddit technical debate, or Discord forum exchange.',
        allowedStatuses: ['saved', 'completed'],
        metadataFields: [
          { key: 'forum', label: 'Platform / Forum', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'assessment',
    label: 'Assessment',
    shortDescription: 'Job take-home cases, coding assessments, design challenges, and benchmark tests',
    iconName: 'CheckCircle',
    defaultStrength: 6,
    types: [
      {
        id: 'skill_assessment',
        label: 'Skill Assessment',
        family: 'assessment',
        defaultEvidenceStrength: 5,
        description: 'Standardized evaluation testing proficiency across a domain or tool.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'testingOrg', label: 'Platform / Evaluator', type: 'text', placeholder: 'e.g. HackerRank, TestGorilla' },
          { key: 'score', label: 'Score / Percentile', type: 'text' }
        ]
      },
      {
        id: 'coding_assessment',
        label: 'Coding Assessment',
        family: 'assessment',
        defaultEvidenceStrength: 5,
        description: 'Algorithmic or backend systems challenge evaluated with automated unit tests.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'testCasesPassed', label: 'Pass Rate (e.g. 15/15)', type: 'text' }
        ]
      },
      {
        id: 'language_test',
        label: 'Language Test',
        family: 'assessment',
        defaultEvidenceStrength: 5,
        description: 'Formal language proficiency test (e.g. IELTS 8.0, JLPT N1, CEFR C1).',
        allowedStatuses: ['passed', 'reviewed'],
        metadataFields: [
          { key: 'testType', label: 'Test Standard', type: 'text' },
          { key: 'bandScore', label: 'Band / Level Achieved', type: 'text' }
        ]
      },
      {
        id: 'aptitude_test',
        label: 'Aptitude Test',
        family: 'assessment',
        defaultEvidenceStrength: 4,
        description: 'Cognitive reasoning, numerical, or logic evaluation.',
        allowedStatuses: ['passed', 'reviewed'],
        metadataFields: [
          { key: 'percentile', label: 'Percentile', type: 'text' }
        ]
      },
      {
        id: 'product_case',
        label: 'Assessment / Product Case',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Company-specific interview case analyzing growth, metrics, or new product MVP.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'hiringCompany', label: 'Hiring Company', type: 'text', placeholder: 'e.g. Stripe, Grab, VNG' },
          { key: 'targetRole', label: 'Target Position', type: 'text', placeholder: 'e.g. Product Manager' },
          { key: 'score', label: 'Score / Tier', type: 'text' },
          { key: 'reviewerFeedback', label: 'Reviewer Feedback', type: 'textarea' }
        ]
      },
      {
        id: 'design_challenge',
        label: 'Design Challenge',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Take-home app redesign or design system exercise for a hiring team.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'designBrief', label: 'Challenge Brief', type: 'text' }
        ]
      },
      {
        id: 'business_case',
        label: 'Business Case',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Management consulting or financial diligence case interview submission.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'consultingFirm', label: 'Target Firm', type: 'text', placeholder: 'e.g. McKinsey, BCG, Bain' },
          { key: 'casePrompt', label: 'Case Prompt Question', type: 'textarea' }
        ]
      },
      {
        id: 'gtm_challenge',
        label: 'GTM Challenge',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Commercial go-to-market strategy, channel partnership, and revenue model assessment for hiring.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'hiringCompany', label: 'Company', type: 'text' },
          { key: 'targetRole', label: 'Role', type: 'text' },
          { key: 'score', label: 'Evaluation Score', type: 'text' }
        ]
      },
      {
        id: 'prototype_submission',
        label: 'Prototype Submission',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Interactive functional prototype or design system deliverable evaluated by a design hiring team.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'prototypeUrl', label: 'Prototype URL', type: 'url' },
          { key: 'hiringCompany', label: 'Hiring Studio / Company', type: 'text' }
        ]
      },
      {
        id: 'seo_audit_case',
        label: 'SEO Audit Case',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Comprehensive technical crawl, canonical indexing, and search architecture audit evaluated for hiring.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'auditedDomain', label: 'Audited Domain / Stack', type: 'text' },
          { key: 'score', label: 'Audit Score', type: 'text' }
        ]
      },
      {
        id: 'audit_report',
        label: 'Audit Report',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Formal technical audit report detailing vulnerabilities, crawl depth, or optimization roadmap.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'score', label: 'Evaluation Score', type: 'text' }
        ]
      },
      {
        id: 'growth_case',
        label: 'Growth Case',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'PLG acquisition funnel, CAC payback, and expansion loop case evaluated by a growth marketing team.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'hiringCompany', label: 'Company', type: 'text' },
          { key: 'score', label: 'Score', type: 'text' }
        ]
      },
      {
        id: 'strategy_deck_case',
        label: 'Strategy Deck Case',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Executive strategy deck presentation submitted and defended during hiring rounds.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'deckUrl', label: 'Presentation URL', type: 'url' },
          { key: 'hiringCompany', label: 'Company', type: 'text' }
        ]
      },
      {
        id: 'take_home_assignment',
        label: 'Take-home Assignment',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Multi-day practical assignment submitted during job interview rounds.',
        allowedStatuses: ['planned', 'submitted', 'passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'relatedJob', label: 'Related Job / Company', type: 'text', required: true },
          { key: 'submissionUrl', label: 'Submission Link / Repo', type: 'url' },
          { key: 'feedback', label: 'Hiring Team Feedback', type: 'textarea' }
        ]
      },
      {
        id: 'interview_case',
        label: 'Interview Case',
        family: 'assessment',
        defaultEvidenceStrength: 6,
        description: 'Live case solved verbally or on whiteboard during a live interview.',
        allowedStatuses: ['passed', 'failed', 'reviewed'],
        metadataFields: [
          { key: 'round', label: 'Interview Round', type: 'text', placeholder: 'e.g. Final Partner Round' }
        ]
      },
      {
        id: 'peer_assessment',
        label: 'Peer Assessment',
        family: 'assessment',
        defaultEvidenceStrength: 4,
        description: 'Structured 360 review or peer calibration score.',
        allowedStatuses: ['reviewed'],
        metadataFields: [
          { key: 'reviewCycle', label: 'Performance Cycle', type: 'text' }
        ]
      },
      {
        id: 'self_assessment',
        label: 'Self Assessment',
        family: 'assessment',
        defaultEvidenceStrength: 1,
        description: 'Personal calibration against role competency blueprints.',
        allowedStatuses: ['completed'],
        metadataFields: [
          { key: 'rubricUsed', label: 'Rubric Blueprint', type: 'text' }
        ]
      },
      {
        id: 'benchmark_result',
        label: 'Benchmark Result',
        family: 'assessment',
        defaultEvidenceStrength: 5,
        description: 'Competitive ranking on a national platform or professional coding benchmark.',
        allowedStatuses: ['passed', 'reviewed'],
        metadataFields: [
          { key: 'rank', label: 'Leaderboard Rank', type: 'text', placeholder: 'e.g. Top 2% Global' }
        ]
      }
    ]
  },
  {
    id: 'playbook',
    label: 'Playbooks & Frameworks',
    shortDescription: 'Mental models, professional playbooks, operational frameworks, and standardized methodologies.',
    iconName: 'Compass',
    defaultStrength: 3,
    types: [
      {
        id: 'operational_playbook',
        label: 'Operational Playbook',
        family: 'playbook',
        defaultEvidenceStrength: 3,
        description: 'Structured execution guide for engineering, product, or organizational workflows.',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied', 'archived'],
        metadataFields: [
          { key: 'methodology', label: 'Core Methodology', type: 'text' },
          { key: 'version', label: 'Framework Version', type: 'text' }
        ]
      },
      {
        id: 'industry_framework',
        label: 'Industry Framework',
        family: 'playbook',
        defaultEvidenceStrength: 2,
        description: 'Standardized reference model (e.g. AWS Well-Architected, Shape Up, Scrum 2020, Double Diamond).',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied', 'archived'],
        metadataFields: [
          { key: 'standardsBody', label: 'Standards Body / Author', type: 'text' }
        ]
      }
    ]
  },
  {
    id: 'publication',
    label: 'Global Voices & Publications',
    shortDescription: 'Authoritative external essays, engineering blogs, research newsletters, and thought leadership.',
    iconName: 'Bookmark',
    defaultStrength: 1,
    types: [
      {
        id: 'expert_newsletter',
        label: 'Expert Newsletter / Substack',
        family: 'publication',
        defaultEvidenceStrength: 1,
        description: 'Analytical newsletters from industry leaders (e.g. Lenny Rachitsky, Gergely Orosz, Ben Thompson).',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied', 'archived'],
        metadataFields: [
          { key: 'publicationPlatform', label: 'Platform (Substack / Medium / LinkedIn / Blog)', type: 'text' }
        ]
      },
      {
        id: 'engineering_techblog',
        label: 'Engineering TechBlog',
        family: 'publication',
        defaultEvidenceStrength: 1,
        description: 'In-depth architecture articles published by tier-1 tech companies (Netflix, Uber, Stripe).',
        allowedStatuses: ['saved', 'in_progress', 'completed', 'applied', 'archived'],
        metadataFields: [
          { key: 'companyBlog', label: 'Company Tech Blog', type: 'text' }
        ]
      }
    ]
  }
];

export function getFamilyConfig(familyId: SourceFamily): SourceFamilyConfig | undefined {
  return SOURCE_TAXONOMY.find(f => f.id === familyId);
}

export function getTypeConfig(typeId: string): { type: SourceTypeConfig; family: SourceFamilyConfig } | undefined {
  for (const family of SOURCE_TAXONOMY) {
    const found = family.types.find(t => t.id === typeId);
    if (found) {
      return { type: found, family };
    }
  }
  return undefined;
}

export function getEvidenceStrengthDefinition(level: EvidenceStrengthLevel): EvidenceStrengthDefinition {
  return EVIDENCE_STRENGTH_LEVELS.find(l => l.level === level) || EVIDENCE_STRENGTH_LEVELS[1];
}
