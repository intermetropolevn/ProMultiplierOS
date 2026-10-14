import React, { useState } from 'react';
import { 
  Globe, 
  MessageSquare, 
  BookOpen, 
  GitCommit, 
  Compass, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  CheckCircle2, 
  ShieldCheck, 
  Layers, 
  Sliders 
} from 'lucide-react';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';
import { BusinessEnglishScenario, VocabularyItem, CommunicationPattern } from '../../features/businessEnglish/types';

export const AdminBusinessEnglishView: React.FC = () => {
  const [adminTab, setAdminTab] = useState<'scenarios' | 'vocabulary' | 'patterns' | 'topics'>('scenarios');
  const [searchQuery, setSearchQuery] = useState('');

  const scenarios = BusinessEnglishService.getScenarios();
  const vocabulary = BusinessEnglishService.getVocabularyItems();
  const patterns = BusinessEnglishService.getCommunicationPatterns();
  const topics = BusinessEnglishService.getTopics();

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-black text-white">
              Business English Content & Taxonomy Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Platform Admin management for workplace scenarios, vocabulary bank, communication ladders, and contextual topics.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Canonical Taxonomy Synced</span>
        </div>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setAdminTab('scenarios')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'scenarios' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Scenarios ({scenarios.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('vocabulary')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'vocabulary' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Vocabulary ({vocabulary.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('patterns')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'patterns' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Patterns ({patterns.length})
        </button>

        <button
          type="button"
          onClick={() => setAdminTab('topics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            adminTab === 'topics' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Topics ({topics.length})
        </button>
      </div>

      {/* 1. SCENARIOS TABLE */}
      {adminTab === 'scenarios' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">
              Active Scenarios Registry ({scenarios.length})
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Title & Situation</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Partner Persona</th>
                  <th className="p-3">Seniority & Difficulty</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scenarios.map((sc) => (
                  <tr key={sc.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-semibold text-slate-900 max-w-xs">
                      <div>{sc.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{sc.situation}</div>
                    </td>
                    <td className="p-3 text-slate-600">{sc.category}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-800">{sc.partnerName}</div>
                      <div className="text-[10px] text-slate-400">{sc.partnerRole}</div>
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-slate-700">{sc.seniority}</span>
                      <div className="text-[10px] text-indigo-600 font-bold">{sc.difficulty}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                        Published
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. VOCABULARY TABLE */}
      {adminTab === 'vocabulary' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">
              Curated Vocabulary Bank ({vocabulary.length})
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Term</th>
                  <th className="p-3">Meaning</th>
                  <th className="p-3">Context Category</th>
                  <th className="p-3">Domain</th>
                  <th className="p-3">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {vocabulary.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-bold text-indigo-600 whitespace-nowrap">{v.term}</td>
                    <td className="p-3 text-slate-700 max-w-sm">{v.meaning}</td>
                    <td className="p-3 text-slate-600">{v.contextCategory}</td>
                    <td className="p-3 text-slate-600">{v.domain}</td>
                    <td className="p-3 font-bold text-slate-700">{v.difficulty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PATTERNS TABLE */}
      {adminTab === 'patterns' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-sm font-black text-slate-900">
              Communication Progression Ladders ({patterns.length})
            </h4>
          </div>

          <div className="p-4 space-y-4">
            {patterns.map((p) => (
              <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-slate-900">{p.situation}</h5>
                  <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {p.category}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                    <span className="font-bold text-slate-500">Tier 1 (Basic):</span> {p.basic.text}
                  </div>
                  <div className="p-2.5 bg-indigo-950 text-indigo-100 rounded-lg border border-indigo-800">
                    <span className="font-bold text-amber-400">Tier 4 (Executive):</span> {p.executive.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TOPICS TABLE */}
      {adminTab === 'topics' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-4 space-y-3">
          <h4 className="text-sm font-black text-slate-900">
            Workplace Topics Registry ({topics.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {topics.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase">
                  <span>{t.category}</span>
                  <span>{t.relatedDomain}</span>
                </div>
                <h5 className="font-bold text-slate-900">{t.title}</h5>
                <p className="text-xs text-slate-600 line-clamp-2">{t.shortContext}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
