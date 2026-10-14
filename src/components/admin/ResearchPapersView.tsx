import React, { useState } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  Award, 
  BookOpen, 
  HelpCircle,
  Tag,
  Star,
  Quote,
  ShieldCheck,
  Building2,
  Calendar
} from 'lucide-react';
import { ResearchPaper, ArticleSource } from '../../features/knowledge/types';
import { knowledgeStore } from '../../features/knowledge/services/knowledgeStore';

export const ResearchPapersView: React.FC = () => {
  const [papers] = useState<ResearchPaper[]>(knowledgeStore.getResearchPapers());
  const [articles] = useState<ArticleSource[]>(knowledgeStore.getArticles());
  const [activeSubtab, setActiveSubtab] = useState<'papers' | 'articles'>('papers');
  const [selectedPaper, setSelectedPaper] = useState<ResearchPaper | null>(papers[0] || null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleSource | null>(articles[0] || null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
    p.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.publication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded text-[10px] font-extrabold uppercase">
              Academic & Industry Research
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Peer-Reviewed Publications & Benchmark Essays
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Research Papers & Landmark Thought Leadership
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-3xl leading-relaxed">
            Rigorous extraction of system architectures, empirical findings, theoretical claims, and limitations from landmark computer science and product management papers.
          </p>
        </div>

        {/* Subtab selector */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveSubtab('papers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubtab === 'papers'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic Papers ({papers.length})
          </button>
          <button
            onClick={() => setActiveSubtab('articles')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubtab === 'articles'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Key Articles & Essays ({articles.length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeSubtab === 'papers' ? "Search research papers by author, title, topic..." : "Search articles and essays..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>
      </div>

      {/* PAPERS TAB */}
      {activeSubtab === 'papers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredPapers.map(paper => {
              const isSelected = selectedPaper?.id === paper.id;
              return (
                <div
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {paper.year} • {paper.conference || paper.journal || paper.publisher}
                      </span>
                      {paper.citationCount && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded">
                          {paper.citationCount.toLocaleString()} citations
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {paper.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      by {paper.authors.join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                    {paper.topics.slice(0, 3).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Paper Inspector */}
          <div className="lg:col-span-7">
            {selectedPaper ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 sticky top-6">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">
                        {selectedPaper.conference || 'Research Paper'}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-bold">
                        Open Access PDF
                      </span>
                    </div>

                    <a
                      href={selectedPaper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Read Original Paper</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {selectedPaper.title}
                  </h2>

                  <div className="text-xs text-slate-500 font-medium space-y-0.5">
                    <div><strong>Authors:</strong> {selectedPaper.authors.join(', ')}</div>
                    <div><strong>Venue:</strong> {selectedPaper.conference || selectedPaper.journal || selectedPaper.publisher} ({selectedPaper.year})</div>
                    {selectedPaper.doi && <div><strong>DOI:</strong> {selectedPaper.doi}</div>}
                  </div>
                </div>

                {/* Abstract */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Abstract
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                    "{selectedPaper.abstract}"
                  </p>
                </div>

                {/* Methodology */}
                {selectedPaper.methodology && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Methodology & Experimental Design
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {selectedPaper.methodology}
                    </p>
                  </div>
                )}

                {/* Findings vs Limitations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedPaper.findings && (
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Key Findings
                      </span>
                      <ul className="space-y-1.5 text-xs text-emerald-950">
                        {selectedPaper.findings.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedPaper.limitations && (
                    <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                      <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                        Architectural Limitations
                      </span>
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {selectedPaper.limitations.map((l, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-amber-500 font-bold">•</span>
                            <span>{l}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Practical Implications for Candidates */}
                {selectedPaper.implications && (
                  <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-xl space-y-2">
                    <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-indigo-600" />
                      Interview Implications & Industry Context
                    </span>
                    <ul className="space-y-1 text-xs text-indigo-950">
                      {selectedPaper.implications.map((imp, i) => (
                        <li key={i}>• {imp}</li>
                      ))}
                    </ul>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                Select a paper to inspect its structured breakdown
              </div>
            )}
          </div>

        </div>
      )}

      {/* ARTICLES TAB */}
      {activeSubtab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5 space-y-3">
            {filteredArticles.map(article => {
              const isSelected = selectedArticle?.id === article.id;
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {article.publication} • {article.date}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600">by {article.author}</p>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                    {article.summary}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-7">
            {selectedArticle ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 sticky top-6">
                
                <div className="border-b border-slate-100 pb-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-bold uppercase">
                      {selectedArticle.classification.replace(/_/g, ' ')}
                    </span>
                    <a
                      href={selectedArticle.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
                    >
                      <span>Canonical Article</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h2>
                  <div className="text-xs text-slate-500 font-medium">
                    By {selectedArticle.author} • Published in {selectedArticle.publication} ({selectedArticle.date})
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Summary & Core Thesis
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedArticle.summary}
                  </p>
                </div>

                {/* Claims & Examples */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Key Claims & Leadership Assertions
                  </h4>
                  <div className="space-y-2">
                    {selectedArticle.claims.map((c, i) => (
                      <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 italic">
                        "{c}"
                      </div>
                    ))}
                  </div>
                </div>

                {selectedArticle.examples && selectedArticle.examples.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Concrete Examples in the Wild
                    </h4>
                    <div className="space-y-1.5">
                      {selectedArticle.examples.map((ex, i) => (
                        <div key={i} className="p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-950">
                          {ex}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
                Select an article to view details
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
