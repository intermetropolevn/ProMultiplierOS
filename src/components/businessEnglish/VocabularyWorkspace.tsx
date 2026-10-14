import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  Volume2, 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Bookmark, 
  Filter, 
  Layers, 
  ArrowRight, 
  Copy, 
  Save, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { VocabularyItem, UserVocabularySet } from '../../features/businessEnglish/types';
import { BusinessEnglishService } from '../../features/businessEnglish/services/businessEnglishService';

interface VocabularyWorkspaceProps {
  onStartRolePlayWithTerm?: (term: string) => void;
  onSyncToProfile?: (vocabSet: UserVocabularySet) => void;
  className?: string;
}

export const VocabularyWorkspace: React.FC<VocabularyWorkspaceProps> = ({
  onStartRolePlayWithTerm,
  onSyncToProfile,
  className = ''
}) => {
  const curatedVocabulary = BusinessEnglishService.getVocabularyItems();
  const [userSets, setUserSets] = useState<UserVocabularySet[]>(() => 
    BusinessEnglishService.getUserVocabularySets()
  );

  // Active view: 'curated_bank' | 'my_sets'
  const [activeSubTab, setActiveSubTab] = useState<'curated_bank' | 'my_sets'>('curated_bank');

  // Curated Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  // Create New Set State
  const [isCreatingSet, setIsCreatingSet] = useState(false);
  const [newSetTitle, setNewSetTitle] = useState('');
  const [newSetDescription, setNewSetDescription] = useState('');
  const [newSetDomain, setNewSetDomain] = useState('Product & Engineering');
  const [newSetTermsInput, setNewSetTermsInput] = useState('');
  const [isGeneratingSet, setIsGeneratingSet] = useState(false);

  // Selected User Set for Detail View
  const [selectedSet, setSelectedSet] = useState<UserVocabularySet | null>(null);

  useEffect(() => {
    if (userSets.length > 0 && !selectedSet) {
      setSelectedSet(userSets[0]);
    }
  }, [userSets]);

  const categories = [
    'All',
    'Meetings',
    'Presentations',
    'Stakeholder Management',
    'Project Management',
    'Product',
    'Engineering',
    'Finance',
    'Strategy',
    'Workplace Communication'
  ];

  const filteredCurated = curatedVocabulary.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.contextCategory === selectedCategory;
    const matchesSearch = !searchQuery || 
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id: string) => {
    setBookmarkedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Create and Generate Set Content
  const handleCreateSetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSetTitle.trim() || !newSetTermsInput.trim()) return;

    setIsGeneratingSet(true);

    const termArray = newSetTermsInput
      .split(/,|\n/)
      .map(t => t.trim())
      .filter(Boolean);

    // AI sample generation
    setTimeout(() => {
      const { exampleSentences, generatedDialogue } = BusinessEnglishService.generateContextAwareSetContent(
        newSetTitle,
        termArray,
        newSetDomain
      );

      const newSet: UserVocabularySet = {
        id: `set-custom-${Date.now()}`,
        title: newSetTitle.trim(),
        description: newSetDescription.trim() || 'Custom workplace vocabulary practice collection.',
        domainTag: newSetDomain,
        terms: termArray,
        exampleSentences,
        generatedDialogue,
        createdAt: new Date().toISOString(),
        isSyncedToProfile: true
      };

      const updated = BusinessEnglishService.saveUserVocabularySet(newSet);
      setUserSets(updated);
      setSelectedSet(newSet);
      setIsGeneratingSet(false);
      setIsCreatingSet(false);
      setActiveSubTab('my_sets');

      // Reset form
      setNewSetTitle('');
      setNewSetDescription('');
      setNewSetTermsInput('');

      if (onSyncToProfile) {
        onSyncToProfile(newSet);
      }
    }, 700);
  };

  const handleDeleteSet = (setId: string) => {
    const updated = BusinessEnglishService.deleteUserVocabularySet(setId);
    setUserSets(updated);
    if (selectedSet?.id === setId) {
      setSelectedSet(updated[0] || null);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Navigation Switcher: Curated Bank vs User-Created Sets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveSubTab('curated_bank')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'curated_bank'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Curated Vocabulary Bank</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20">
              {curatedVocabulary.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('my_sets')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeSubTab === 'my_sets'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>My Vocabulary Sets</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 font-black">
              {userSets.length}
            </span>
          </button>
        </div>

        {activeSubTab === 'my_sets' && (
          <button
            type="button"
            onClick={() => setIsCreatingSet(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Set</span>
          </button>
        )}
      </div>

      {/* -----------------------------------------------------------------
          VIEW 1: CURATED VOCABULARY BANK
          ----------------------------------------------------------------- */}
      {activeSubTab === 'curated_bank' && (
        <div className="space-y-5 animate-in fade-in duration-150">
          
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search vocabulary by term, meaning, or domain (e.g., trade-off, stakeholder, unit economics)..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-600 font-sans"
              />
            </div>

            {/* Context Categories */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Vocabulary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCurated.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-300 hover:shadow-xs transition-all space-y-3.5"
              >
                {/* Header: Term, Audio, Difficulty, Bookmark */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-900 tracking-tight">
                        {item.term}
                      </h3>
                      <button
                        type="button"
                        onClick={() => BusinessEnglishService.speak(item.term)}
                        className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Listen to native pronunciation"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400">
                      {item.domain} • <span className="text-blue-600 font-semibold">{item.contextCategory}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.difficulty === 'Foundational' ? 'bg-emerald-50 text-emerald-700' :
                      item.difficulty === 'Intermediate' ? 'bg-blue-50 text-blue-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {item.difficulty}
                    </span>

                    <button
                      type="button"
                      onClick={() => toggleBookmark(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        bookmarkedIds.includes(item.id) 
                          ? 'text-amber-500 bg-amber-50' 
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title="Bookmark term"
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Plain English Meaning */}
                <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="font-bold text-slate-900">Definition: </span>
                  {item.meaning}
                </div>

                {/* Business Context & Natural Usage */}
                <div className="space-y-1 text-xs">
                  <p className="text-slate-600">
                    <strong className="text-slate-800">Business Context: </strong>
                    {item.businessContext}
                  </p>
                </div>

                {/* Example Sentences */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Workplace Sentence Samples:
                  </div>
                  {item.exampleSentences.map((ex, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-800 italic">
                      <span className="text-blue-500 font-bold">•</span>
                      <span className="flex-1">"{ex}"</span>
                      <button
                        type="button"
                        onClick={() => BusinessEnglishService.speak(ex)}
                        className="text-slate-400 hover:text-blue-600 cursor-pointer"
                        title="Listen"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Related Phrases Chips */}
                {item.relatedPhrases && item.relatedPhrases.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="text-[10px] text-slate-400 font-medium">Related:</span>
                    {item.relatedPhrases.map((rp, rIdx) => (
                      <span
                        key={rIdx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                      >
                        {rp}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* -----------------------------------------------------------------
          VIEW 2: USER-CREATED VOCABULARY SETS
          ----------------------------------------------------------------- */}
      {activeSubTab === 'my_sets' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          
          {/* Sets Selection Horizontal Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSets.map((set) => (
              <div
                key={set.id}
                onClick={() => setSelectedSet(set)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedSet?.id === set.id
                    ? 'bg-purple-50/70 border-purple-400 shadow-xs'
                    : 'bg-white border-slate-200 hover:border-purple-300'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                      {set.domainTag}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {set.terms.length} terms
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug">
                    {set.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {set.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {set.terms.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {t}
                      </span>
                    ))}
                    {set.terms.length > 2 && (
                      <span className="text-[10px] text-slate-400">+{set.terms.length - 2}</span>
                    )}
                  </div>

                  <ArrowRight className={`w-4 h-4 ${selectedSet?.id === set.id ? 'text-purple-600' : 'text-slate-300'}`} />
                </div>
              </div>
            ))}
          </div>

          {/* Active Set Detail View: Terms, AI Samples, Dialogue */}
          {selectedSet && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">
                      {selectedSet.title}
                    </h3>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                      {selectedSet.domainTag}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedSet.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteSet(selectedSet.id)}
                    className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete Set"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Terms Pills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Target Words & Phrases in This Set:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSet.terms.map((term, idx) => (
                    <div
                      key={idx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-900 border border-purple-200/80 font-bold text-xs"
                    >
                      <span>{term}</span>
                      <button
                        type="button"
                        onClick={() => BusinessEnglishService.speak(term)}
                        className="text-purple-500 hover:text-purple-800 cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Generated Contextual Sentences */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h4 className="text-sm font-black text-slate-900">
                    AI-Generated Contextual Sentence Samples
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedSet.exampleSentences.map((sample, sIdx) => (
                    <div
                      key={sIdx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-purple-700 uppercase">
                          {sample.term}
                        </span>
                        <span className="text-slate-400">
                          {sample.context}
                        </span>
                      </div>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        "{sample.sentence}"
                      </p>
                      <div className="pt-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => BusinessEnglishService.speak(sample.sentence)}
                          className="text-slate-400 hover:text-purple-600 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Generated Workplace Dialogue */}
              {selectedSet.generatedDialogue && (
                <div className="space-y-3 bg-slate-900 text-white p-6 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-purple-400" />
                      <h4 className="text-sm font-black text-white">
                        AI Workplace Practice Dialogue
                      </h4>
                    </div>
                    <span className="text-[10px] text-purple-300 font-medium">
                      Terms highlighted in context
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {selectedSet.generatedDialogue.map((d, dIdx) => (
                      <div
                        key={dIdx}
                        className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                          d.role === 'You'
                            ? 'bg-purple-950/80 border border-purple-800 text-purple-100 ml-4'
                            : 'bg-slate-800/90 border border-slate-700 text-slate-200 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between pb-1 text-[11px] font-bold">
                          <span className={d.role === 'You' ? 'text-purple-300' : 'text-slate-400'}>
                            {d.speaker}
                          </span>
                          <button
                            type="button"
                            onClick={() => BusinessEnglishService.speak(d.text)}
                            className="text-slate-400 hover:text-white cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="font-medium">
                          {d.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* -----------------------------------------------------------------
          MODAL: CREATE NEW VOCABULARY SET
          ----------------------------------------------------------------- */}
      {isCreatingSet && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Create Vocabulary Set
                  </h3>
                  <p className="text-xs text-slate-500">
                    AI will generate context-aware sentences and dialogue
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreatingSet(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSetSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Collection Title
                </label>
                <input
                  type="text"
                  required
                  value={newSetTitle}
                  onChange={(e) => setNewSetTitle(e.target.value)}
                  placeholder="e.g. Stakeholder Alignment & Pushback"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Domain / Workplace Context
                </label>
                <select
                  value={newSetDomain}
                  onChange={(e) => setNewSetDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white focus:outline-hidden focus:border-purple-600"
                >
                  <option value="Product & Engineering">Product & Engineering</option>
                  <option value="Strategy & Executive Alignment">Strategy & Executive Alignment</option>
                  <option value="Meetings & Project Delivery">Meetings & Project Delivery</option>
                  <option value="Finance & Commercial Levers">Finance & Commercial Levers</option>
                  <option value="Client & Stakeholder Management">Client & Stakeholder Management</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Target Words / Phrases (comma or newline separated)
                </label>
                <textarea
                  required
                  rows={4}
                  value={newSetTermsInput}
                  onChange={(e) => setNewSetTermsInput(e.target.value)}
                  placeholder="e.g. stakeholder alignment, scope creep, trade-off, push back"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 font-sans"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newSetDescription}
                  onChange={(e) => setNewSetDescription(e.target.value)}
                  placeholder="e.g. Phrases for managing roadmap pressure"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-purple-600 font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingSet(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingSet}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingSet ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Generating with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Create & Generate</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
