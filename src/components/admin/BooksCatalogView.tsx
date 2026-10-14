import React, { useState } from 'react';
import { 
  BookOpen, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown, 
  Tag, 
  FileText, 
  Info,
  AlertCircle,
  Award,
  Video,
  Bookmark
} from 'lucide-react';
import { Book, ContentAccessMode } from '../../features/knowledge/types';
import { knowledgeStore } from '../../features/knowledge/services/knowledgeStore';

interface BooksCatalogViewProps {
  onSelectConcept?: (conceptId: string) => void;
  onLaunchPipeline?: (bookTitle: string) => void;
}

export const BooksCatalogView: React.FC<BooksCatalogViewProps> = ({
  onSelectConcept,
  onLaunchPipeline
}) => {
  const [books] = useState<Book[]>(knowledgeStore.getBooks());
  const [selectedBook, setSelectedBook] = useState<Book | null>(books[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [expandedChapter, setExpandedChapter] = useState<number | null>(1);

  const domains = Array.from(new Set(books.map(b => b.domain)));

  const filteredBooks = books.filter(b => {
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDomain = selectedDomain === 'all' || b.domain === selectedDomain;
    return matchesSearch && matchesDomain;
  });

  const getAccessBadge = (mode: ContentAccessMode) => {
    switch (mode) {
      case 'public_full':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Public Full Text (Open Access)
          </span>
        );
      case 'concept_only':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldCheck className="w-3 h-3 text-amber-600" />
            Concept Only (Copyright Safe)
          </span>
        );
      case 'metadata_only':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Metadata Only
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
            {mode}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Concept Notice */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[11px] font-bold uppercase tracking-wider">
                Authoritative Books & Guides
              </span>
              <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[11px] font-bold">
                Copyright Safe
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Curated Books & Foundational Texts
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              Structured knowledge extracted from industry-defining literature. For copyrighted books, full text is never stored. Instead, core frameworks, mental models, and empirical principles are synthesized from author publications, public lectures, official essays, and university lecture notes.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onLaunchPipeline && (
              <button
                onClick={() => onLaunchPipeline(selectedBook ? selectedBook.title : 'New Book')}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Acquire New Book Concepts</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search books, authors, topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-500 shrink-0">Domain:</span>
          <button
            onClick={() => setSelectedDomain('all')}
            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors shrink-0 ${
              selectedDomain === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({books.length})
          </button>
          {domains.map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-colors shrink-0 ${
                selectedDomain === d
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Main Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Book Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredBooks.map((book) => {
            const isSelected = selectedBook?.id === book.id;
            return (
              <div
                key={book.id}
                onClick={() => setSelectedBook(book)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/50 border-blue-500 shadow-sm ring-1 ring-blue-500/20'
                    : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {book.publicationYear} • {book.domain}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-blue-600 leading-snug">
                      {book.title}
                    </h3>
                    {book.subtitle && (
                      <p className="text-xs text-slate-500 line-clamp-1">{book.subtitle}</p>
                    )}
                    <p className="text-xs font-semibold text-slate-700">
                      by {book.authors.join(', ')}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    {getAccessBadge(book.accessMode)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
                  {book.topics.slice(0, 3).map(t => (
                    <span key={t} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                      {t}
                    </span>
                  ))}
                  {book.topics.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-bold self-center">
                      +{book.topics.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Selected Book Detailed Inspector */}
        <div className="lg:col-span-7">
          {selectedBook ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-6 sticky top-6">
              
              {/* Header */}
              <div className="border-b border-slate-100 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">
                    {selectedBook.domain} {selectedBook.subdomain ? `• ${selectedBook.subdomain}` : ''}
                  </span>
                  {getAccessBadge(selectedBook.accessMode)}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {selectedBook.title}
                </h2>
                {selectedBook.subtitle && (
                  <p className="text-sm text-slate-600 font-medium">{selectedBook.subtitle}</p>
                )}

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 font-medium">
                  <span><strong>Authors:</strong> {selectedBook.authors.join(', ')}</span>
                  {selectedBook.publisher && <span><strong>Publisher:</strong> {selectedBook.publisher}</span>}
                  {selectedBook.publicationYear && <span><strong>Year:</strong> {selectedBook.publicationYear}</span>}
                  {selectedBook.isbn && <span><strong>ISBN:</strong> {selectedBook.isbn}</span>}
                </div>

                {/* External links */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedBook.officialUrl && (
                    <a
                      href={selectedBook.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Official Page</span>
                    </a>
                  )}
                  {selectedBook.publisherUrl && (
                    <a
                      href={selectedBook.publisherUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>Publisher Portal</span>
                    </a>
                  )}
                  {selectedBook.authorUrl && (
                    <a
                      href={selectedBook.authorUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Author Articles</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Legal & Provenance Shield Banner */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-black text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Legal Compliance & Provenance Policy</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  {selectedBook.provenance}
                </p>
              </div>

              {/* Summary */}
              {selectedBook.summary && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Executive Knowledge Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedBook.summary}
                  </p>
                </div>
              )}

              {/* Roles and Skills Mapping */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Roles
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBook.roles.map(r => (
                      <span key={r} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-lg text-xs font-bold">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Target Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBook.skills.map(s => (
                      <span key={s} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-bold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table of Contents / Concept Breakdown */}
              {selectedBook.tableOfContents && selectedBook.tableOfContents.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Concept Breakdown by Section / Chapter
                  </h4>
                  <div className="space-y-2">
                    {selectedBook.tableOfContents.map((chapter) => {
                      const isExpanded = expandedChapter === chapter.chapterNumber;
                      return (
                        <div key={chapter.chapterNumber} className="border border-slate-200/80 rounded-xl overflow-hidden">
                          <button
                            onClick={() => setExpandedChapter(isExpanded ? null : chapter.chapterNumber)}
                            className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors text-left cursor-pointer"
                          >
                            <span className="text-xs font-bold text-slate-800">
                              {chapter.chapterNumber}. {chapter.title}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-500" />
                            )}
                          </button>

                          {isExpanded && (
                            <div className="p-3 bg-white border-t border-slate-200/80 space-y-2">
                              <span className="text-[11px] font-semibold text-slate-500 block">
                                Conceptual Units:
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {chapter.concepts.map(c => (
                                  <span key={c} className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Verified Public Resources & Author Citations */}
              {selectedBook.publicResources && selectedBook.publicResources.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Public Authorized Sources & Author References ({selectedBook.publicResources.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedBook.publicResources.map((res, idx) => (
                      <a
                        key={idx}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">
                              {res.title}
                            </span>
                            <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded text-[10px] font-extrabold uppercase">
                              {res.type}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400 truncate block max-w-md">
                            {res.url}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 shrink-0 text-xs font-bold">
                          <span>Authority {res.authority}/5</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 ml-1" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">Select a book to inspect its conceptual breakdown</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
