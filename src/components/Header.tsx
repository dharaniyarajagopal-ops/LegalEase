import React from 'react';
import { Scale, FileText, PenLine, MessageSquare, BookOpen, Printer, Sparkles, ChevronDown, Upload } from 'lucide-react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';

interface HeaderProps {
  activeTab: 'audit' | 'drafter' | 'copilot' | 'glossary';
  onTabChange: (tab: 'audit' | 'drafter' | 'copilot' | 'glossary') => void;
  selectedSampleId: string;
  onSelectSample: (id: string) => void;
  perspective: string;
  onPerspectiveChange: (p: string) => void;
  onTriggerPrint: () => void;
  onOpenUpload: () => void;
}

const PERSPECTIVES = [
  'Freelancer / Service Provider',
  'Tenant / Renter',
  'Employee / Job Candidate',
  'Customer / Business Buyer',
  'Small Business / Vendor',
  'Neutral Legal Counsel'
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  selectedSampleId,
  onSelectSample,
  perspective,
  onPerspectiveChange,
  onTriggerPrint,
  onOpenUpload,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading-brand text-lg font-bold tracking-wider text-white">
                  LeglEase
                </span>
                <span className="text-xs text-amber-400/90 font-mono font-medium px-1.5 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                  Plain-English AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Demystifying legal contracts · Spotting traps · Drafting fair terms
              </p>
            </div>
          </div>

          {/* Nav Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onTabChange('audit')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'audit'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Audit &amp; Review</span>
            </button>
            <button
              onClick={() => onTabChange('drafter')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'drafter'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Contract Drafter</span>
            </button>
            <button
              onClick={() => onTabChange('copilot')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'copilot'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Legal Co-Pilot</span>
            </button>
            <button
              onClick={() => onTabChange('glossary')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                activeTab === 'glossary'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Jargon Buster</span>
            </button>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Perspective Selector */}
            <div className="hidden lg:flex items-center text-xs">
              <span className="text-slate-400 mr-2 text-[11px]">Perspective:</span>
              <div className="relative">
                <select
                  value={perspective}
                  onChange={(e) => onPerspectiveChange(e.target.value)}
                  className="bg-slate-800 text-slate-200 border border-slate-700 rounded-md py-1.5 pl-2.5 pr-7 text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none appearance-none cursor-pointer"
                >
                  {PERSPECTIVES.map((p) => (
                    <option key={p} value={p} className="bg-slate-900 text-slate-200">
                      {p}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="relative">
              <select
                value={selectedSampleId}
                onChange={(e) => onSelectSample(e.target.value)}
                className="bg-slate-800 text-amber-300 border border-slate-700 rounded-md py-1.5 pl-2.5 pr-7 text-xs font-medium focus:ring-1 focus:ring-amber-400 focus:outline-none appearance-none cursor-pointer max-w-[150px] sm:max-w-[210px] truncate"
              >
                <option value="" disabled>Load Contract Template...</option>
                {SAMPLE_CONTRACTS.map((sample) => (
                  <option key={sample.id} value={sample.id} className="bg-slate-900 text-slate-200">
                    {sample.title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-amber-400 absolute right-2 top-2 pointer-events-none" />
            </div>

            {/* Upload Button */}
            <button
              onClick={onOpenUpload}
              title="Upload custom document or paste text"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-md transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            {/* Print / Export Button */}
            <button
              onClick={onTriggerPrint}
              title="Print or Save as PDF"
              className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => onTabChange('audit')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded ${
              activeTab === 'audit' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Audit</span>
          </button>
          <button
            onClick={() => onTabChange('drafter')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded ${
              activeTab === 'drafter' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Drafter</span>
          </button>
          <button
            onClick={() => onTabChange('copilot')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded ${
              activeTab === 'copilot' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Co-Pilot</span>
          </button>
          <button
            onClick={() => onTabChange('glossary')}
            className={`flex items-center gap-1.5 py-1 px-2 rounded ${
              activeTab === 'glossary' ? 'text-amber-400 font-semibold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Glossary</span>
          </button>
        </div>
      </div>
    </header>
  );
};
