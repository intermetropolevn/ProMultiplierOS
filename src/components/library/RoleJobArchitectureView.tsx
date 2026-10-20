import React, { useState } from 'react';
import { 
  Layers, 
  Award, 
  Search, 
  BookOpen, 
  Compass, 
  ShieldCheck, 
  ArrowRight, 
  Sliders, 
  ExternalLink,
  Target,
  Sparkles
} from 'lucide-react';
import { FRAMEWORK_METADATA_LIST } from '../../features/roleIntelligence/data/rolesIntelligenceData';

export type RoleJobArchSubcategory = 
  | 'all'
  | 'job_evaluation'
  | 'job_leveling'
  | 'career_architecture'
  | 'skills_frameworks'
  | 'competency_models'
  | 'occupational_frameworks'
  | 'industry_role_frameworks';

interface RoleJobArchitectureViewProps {
  onNavigateToRoleIntelligence?: () => void;
}

export const RoleJobArchitectureView: React.FC<RoleJobArchitectureViewProps> = ({
  onNavigateToRoleIntelligence
}) => {
  const [activeSubcategory, setActiveSubcategory] = useState<RoleJobArchSubcategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const subcategories: { id: RoleJobArchSubcategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Role Frameworks', count: 8 },
    { id: 'job_evaluation', label: 'Job Evaluation', count: 3 },
    { id: 'job_leveling', label: 'Job Leveling', count: 2 },
    { id: 'career_architecture', label: 'Career Architecture', count: 2 },
    { id: 'skills_frameworks', label: 'Skills Frameworks', count: 2 },
    { id: 'competency_models', label: 'Competency Models', count: 1 },
    { id: 'occupational_frameworks', label: 'Occupational Frameworks', count: 2 },
    { id: 'industry_role_frameworks', label: 'Industry Role Frameworks', count: 2 }
  ];

  const frameworksCorpus = [
    {
      id: 'mercer_ipe',
      name: 'Mercer IPE (International Position Evaluation)',
      creator: 'Mercer Consulting',
      subcategories: ['job_evaluation', 'career_architecture'],
      type: 'Job Evaluation Methodology',
      description: 'Global standard for sizing organizational impact, communication complexity, innovation scope, and decision risk across multinational enterprises.',
      keyFactors: ['Impact & Organization Size', 'Communication & Negotiation', 'Conceptual Innovation', 'Knowledge Breadth', 'Risk Environment'],
      practicalUse: 'Corporate role harmonization, international job grading, and organizational sizing.',
      careerosNote: 'Authoritative reference for matrixed communication and innovation complexity in Product & BizOps roles.'
    },
    {
      id: 'korn_ferry_hay',
      name: 'Korn Ferry Hay Guide Chart-Profile Method',
      creator: 'Edward N. Hay / Korn Ferry',
      subcategories: ['job_evaluation'],
      type: 'Point-Factor Job Evaluation',
      description: 'The world’s most widely used job evaluation method, calculating relative internal job size through Know-How, Problem Solving, and Accountability.',
      keyFactors: ['Know-How (Practical, Managerial, Human Relations)', 'Problem Solving (Thinking Challenge)', 'Accountability (Freedom to Act, Impact Magnitude)'],
      practicalUse: 'Executive role sizing, enterprise equity, and board-level job grading.',
      careerosNote: 'Exemplary benchmark for accountability magnitude and autonomy boundaries.'
    },
    {
      id: 'wtw_ggs',
      name: 'WTW Global Grading System (GGS)',
      creator: 'Willis Towers Watson',
      subcategories: ['job_grading', 'job_leveling', 'career_architecture'],
      type: 'Global Job Grading & Dual-Track Ladder',
      description: 'Dual-axis job grading matrix separating Individual Contributor technical mastery from Management track responsibility across Grades 1-25.',
      keyFactors: ['Business Size Filter', 'Functional Expertise', 'Problem-Solving Ambiguity', 'Nature of Impact', 'Interpersonal Influence'],
      practicalUse: 'Global grading harmonization and dual-track technical career path design.',
      careerosNote: 'Directly informs CareerOS dual-ladder progression for Staff/Principal ICs.'
    },
    {
      id: 'aon_radford',
      name: 'Aon Radford Global Leveling Architecture',
      creator: 'Aon Hewitt / Radford',
      subcategories: ['job_leveling', 'industry_role_frameworks'],
      type: 'Technology Job Leveling Standard',
      description: 'The technology industry standard for job families, levels (P1-P6, M1-M6), and role architectures across software, cloud, and product.',
      keyFactors: ['Standardized Level Codes (P1-P6)', 'Autonomy & Supervision', 'Technical Complexity', 'Market Benchmark Clustering'],
      practicalUse: 'High-growth tech leveling, equity band setting, and venture hiring standards.',
      careerosNote: 'Universal currency of Silicon Valley and global technology leveling.'
    },
    {
      id: 'patterson',
      name: 'Patterson Decision Band Method (DBM)',
      creator: 'Dr. T.T. Paterson',
      subcategories: ['job_evaluation', 'career_architecture'],
      type: 'Decision Authority Evaluation',
      description: 'Ranks positions strictly by the complexity and scope of decision-making authority: from Defined (Band A) to Policy-Making (Band F).',
      keyFactors: ['Band F: Policy Making', 'Band E: Programming / Strategy', 'Band D: Interpretive Execution', 'Band C: Routine Process'],
      practicalUse: 'Flattening management overhead and clarifying organizational decision rights.',
      careerosNote: 'Purest intellectual match for Product Managers whose actual leverage is decision velocity.'
    },
    {
      id: 'sfia',
      name: 'SFIA (Skills Framework for the Information Age)',
      creator: 'SFIA Foundation',
      subcategories: ['skills_frameworks', 'occupational_frameworks'],
      type: 'Digital & IT Skills Framework',
      description: 'Global common language for skills and competencies in the digital world, defining 120+ professional skills across 7 levels of responsibility.',
      keyFactors: ['Autonomy', 'Influence', 'Complexity', 'Business Skills', 'Knowledge Application'],
      practicalUse: 'Digital workforce development, technology role profiling, and IT capability assessments.',
      careerosNote: 'Used by CareerOS to cross-reference technical skills against Levels 1 to 7.'
    },
    {
      id: 'onet',
      name: 'O*NET (Occupational Information Network)',
      creator: 'U.S. Department of Labor',
      subcategories: ['occupational_frameworks', 'skills_frameworks'],
      type: 'Occupational Intelligence Taxonomy',
      description: 'Comprehensive occupational database classifying thousands of standardized occupations, required abilities, generalized work activities, and skills.',
      keyFactors: ['Standard Occupational Classification (SOC)', 'Generalized Work Activities (GWAs)', 'Skills & Knowledge Sets', 'Contextual Work Styles'],
      practicalUse: 'Workforce analytics, national job matching, and occupational standardization.',
      careerosNote: 'Provides canonical baseline descriptors for tech and product roles.'
    },
    {
      id: 'esco',
      name: 'ESCO (European Skills, Competences, Qualifications and Occupations)',
      creator: 'European Commission',
      subcategories: ['occupational_frameworks', 'competency_models'],
      type: 'Multilingual European Skills & Occupations Taxonomy',
      description: 'Identifies and categorizes skills, competences, and occupations relevant for the EU labor market and international education.',
      keyFactors: ['Occupational Pillars', 'Transversal Skills', 'Knowledge Groups', 'Qualification Transcripts'],
      practicalUse: 'Cross-border mobility, credential transparency, and labor market matching.',
      careerosNote: 'Harmonizes skills terminology across international markets.'
    }
  ];

  const filteredFrameworks = frameworksCorpus.filter(fw => {
    if (activeSubcategory !== 'all' && !fw.subcategories.includes(activeSubcategory)) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = fw.name.toLowerCase().includes(q) || fw.creator.toLowerCase().includes(q);
      const matchDesc = fw.description.toLowerCase().includes(q) || fw.keyFactors.some(k => k.toLowerCase().includes(q));
      if (!matchName && !matchDesc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. Category Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>Knowledge System</span>
              <span aria-hidden="true">/</span>
              <span>Global Knowledge Library</span>
              <span aria-hidden="true">/</span>
              <strong className="text-blue-700">Role &amp; Job Architecture</strong>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Role &amp; Job Architecture Knowledge Base
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
              Authoritative occupational frameworks, job evaluation systems, leveling methodologies, and competency taxonomies. These are reference sources and architectural methodologies, NOT consumer certifications or exams.
            </p>
          </div>

          {onNavigateToRoleIntelligence && (
            <button
              type="button"
              onClick={onNavigateToRoleIntelligence}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open Role Intelligence Workspace</span>
            </button>
          )}
        </div>

        {/* Subcategories Filter Strip */}
        <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {subcategories.map(sub => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveSubcategory(sub.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeSubcategory === sub.id
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{sub.label}</span>
                <span className="ml-1 opacity-70 text-[10px]">({sub.count})</span>
              </button>
            ))}
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference frameworks..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 2. Framework Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredFrameworks.map((fw) => (
          <div
            key={fw.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 block">
                    {fw.creator}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                    {fw.name}
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                  {fw.type}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {fw.description}
              </p>

              {/* Key Factors */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 space-y-1.5 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Core Evaluation Dimensions / Factors
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {fw.keyFactors.map((f, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-white border border-slate-200 text-slate-800 text-[11px] rounded font-medium">
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* CareerOS Relevance Note */}
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-200/60 text-xs text-slate-700 space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                  CareerOS Role Intelligence Application
                </span>
                <p className="leading-relaxed">{fw.careerosNote}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="italic">{fw.practicalUse}</span>
              {onNavigateToRoleIntelligence && (
                <button
                  type="button"
                  onClick={onNavigateToRoleIntelligence}
                  className="font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>Evaluate in Role Intelligence</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
