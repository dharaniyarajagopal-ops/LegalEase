import React, { useState } from 'react';
import { Search, BookOpen, AlertTriangle, Scale, Shield, HelpCircle, ChevronRight } from 'lucide-react';
import { LEGAL_GLOSSARY } from '../data/legalGlossary';
import { GlossaryItem } from '../types/legal';

export const LegalGlossaryView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedItem, setSelectedItem] = useState<GlossaryItem | null>(null);

  const categories = ['All', 'Liability', 'Intellectual Property', 'Termination', 'Dispute', 'Financial', 'General'];

  const filteredItems = LEGAL_GLOSSARY.filter((item) => {
    const matchesSearch =
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plainEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.howToNegotiate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              Interactive Legal Dictionary
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Jargon Buster: Plain-English Legal Lexicon
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
            Translate confusing legalese, archaic terms, and trap phrases into everyday language with tactical advice on how to negotiate each one.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search terms, traps, phrases..."
            className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 text-slate-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </div>
      </div>

      {/* Category Filter Pills (Button tabs) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === cat
                ? 'bg-white text-slate-950 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-amber-300 hover:shadow-md transition-all group"
          >
            <div>
              {/* Category & Pronunciation */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
                <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50">
                  {item.category}
                </span>
                {item.pronunciation && (
                  <span className="font-mono italic text-slate-400">{item.pronunciation}</span>
                )}
              </div>

              {/* Term Title */}
              <h3 className="font-bold text-slate-900 text-sm mb-2 group-hover:text-amber-700 transition-colors">
                {item.term}
              </h3>

              {/* Plain English Translation */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/70 mb-3 text-xs leading-relaxed text-slate-800">
                <span className="font-semibold text-slate-900 block text-[11px] uppercase tracking-wider mb-0.5">
                  Plain English:
                </span>
                {item.plainEnglish}
              </div>

              {/* The Danger */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-semibold text-rose-800 text-[11px] uppercase tracking-wider block">
                    The Danger / Trapdoor:
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.theDanger}
                  </p>
                </div>

                {/* How to Negotiate */}
                <div>
                  <span className="font-semibold text-emerald-800 text-[11px] uppercase tracking-wider block">
                    How to Negotiate It:
                  </span>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {item.howToNegotiate}
                  </p>
                </div>
              </div>
            </div>

            {/* Example in Contract */}
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px]">
              <span className="text-slate-400 block mb-0.5 font-medium">Common Contract Phrasing:</span>
              <p className="font-serif-legal italic text-slate-700 bg-amber-50/40 p-2 rounded border border-amber-100/60">
                "{item.exampleSentence}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <BookOpen className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h4 className="font-semibold text-slate-800 text-sm">No legal terms matched "{searchTerm}"</h4>
          <p className="text-xs text-slate-500 mt-1">Try searching for liability, indemnity, IP, or arbitration.</p>
        </div>
      )}
    </div>
  );
};
