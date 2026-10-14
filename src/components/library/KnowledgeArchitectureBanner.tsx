import React from 'react';
import { Workflow, Landmark, Lightbulb, Wrench, ArrowRight, Layers, Share2 } from 'lucide-react';
import { LibraryPillar } from './LibraryHub';

interface KnowledgeArchitectureBannerProps {
  currentPillar: LibraryPillar;
  onSelectPillar: (pillar: LibraryPillar) => void;
  workCount?: number;
  systemsCount?: number;
  futureCount?: number;
  techCount?: number;
}

export const KnowledgeArchitectureBanner: React.FC<KnowledgeArchitectureBannerProps> = ({
  currentPillar,
  onSelectPillar,
  workCount = 0,
  systemsCount = 0,
  futureCount = 0,
  techCount = 0
}) => {
  const layers = [
    {
      layer: 'Work',
      layerVi: 'Lớp Thực Thi',
      pillarId: 'work_relevant_pathways' as LibraryPillar,
      title: 'Work-relevant Pathways',
      question: 'What do professionals in this role actually execute day-to-day?',
      questionVi: 'Người trong role này thực sự làm những gì?',
      icon: Workflow,
      count: workCount,
      color: 'border-blue-200 bg-blue-50/40 text-blue-900',
      activeColor: 'ring-2 ring-blue-600 bg-blue-50 border-blue-400',
      iconColor: 'text-blue-600 bg-blue-100',
      graphPath: 'Role → Work Pathway → Skill → Tool → Project'
    },
    {
      layer: 'Systems',
      layerVi: 'Lớp Vận Hành Vĩ Mô',
      pillarId: 'public_sector_civic_systems' as LibraryPillar,
      title: 'Public Sector & Civic Systems',
      question: 'How do public institutions & civic systems operate at scale?',
      questionVi: 'Các tổ chức/hệ thống xã hội & public sector vận hành thế nào?',
      icon: Landmark,
      count: systemsCount,
      color: 'border-emerald-200 bg-emerald-50/40 text-emerald-900',
      activeColor: 'ring-2 ring-emerald-600 bg-emerald-50 border-emerald-400',
      iconColor: 'text-emerald-600 bg-emerald-100',
      graphPath: 'Domain → System → Organization → Public Program'
    },
    {
      layer: 'Future',
      layerVi: 'Lớp Đổi Mới & Tương Lai',
      pillarId: 'innovation_transformative_systems' as LibraryPillar,
      title: 'Innovation & Transformative Systems',
      question: 'What emerging paradigms, products & systemic models are rising?',
      questionVi: 'Những cách làm/sản phẩm/hệ thống mới đang xuất hiện là gì?',
      icon: Lightbulb,
      count: futureCount,
      color: 'border-purple-200 bg-purple-50/40 text-purple-900',
      activeColor: 'ring-2 ring-purple-600 bg-purple-50 border-purple-400',
      iconColor: 'text-purple-600 bg-purple-100',
      graphPath: 'Paradigm Shift → Innovation → Architecture → Impact'
    },
    {
      layer: 'Technology',
      layerVi: 'Lớp Công Cụ & Nền Tảng',
      pillarId: 'tools_platforms' as LibraryPillar,
      title: 'Tools & Platforms',
      question: 'What platforms, storage engines & APIs execute the work?',
      questionVi: 'Có những công cụ/công nghệ nào để thực hiện công việc đó?',
      icon: Wrench,
      count: techCount,
      color: 'border-cyan-200 bg-cyan-50/40 text-cyan-900',
      activeColor: 'ring-2 ring-cyan-600 bg-cyan-50 border-cyan-400',
      iconColor: 'text-cyan-600 bg-cyan-100',
      graphPath: 'Tool → Capabilities → Integrations → Work Execution'
    }
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs p-4 sm:p-5 space-y-3.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider">
              Career Intelligence Infrastructure • 4-Layer Architecture
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Transforming raw resources into structured execution graphs: <span className="font-semibold text-slate-700">Role → Work Pathway → Skill → Tool → Project → Evidence</span>
            </p>
          </div>
        </div>

        <div className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg shrink-0 self-start sm:self-center">
          Ontology Connected
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {layers.map((l) => {
          const Icon = l.icon;
          const isSelected = currentPillar === l.pillarId;

          return (
            <div
              key={l.pillarId}
              onClick={() => onSelectPillar(l.pillarId)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 hover:shadow-xs group ${
                isSelected ? l.activeColor : `${l.color} hover:border-slate-300`
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200/80 shadow-2xs">
                    Layer: {l.layer}
                  </span>
                  <span className="text-xs font-black px-1.5 py-0.5 rounded-md bg-white/80 font-mono text-slate-700">
                    {l.count}
                  </span>
                </div>

                <div className="flex items-start gap-2 pt-0.5">
                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${l.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                      {l.title}
                    </h4>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 italic leading-snug">
                  "{l.questionVi}"
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/50 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-mono line-clamp-1">{l.graphPath}</span>
                <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1 text-blue-600' : 'text-slate-400 group-hover:translate-x-0.5'}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
