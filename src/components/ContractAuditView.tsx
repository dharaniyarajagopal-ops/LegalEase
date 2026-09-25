import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Scale,
  Sparkles,
  Copy,
  Check,
  Search,
  Mail,
  MessageSquare,
  FileCheck,
  ChevronRight,
  ListFilter,
  Eye,
  ArrowUpRight,
  HelpCircle,
  Maximize2
} from 'lucide-react';
import { ContractAnalysisResult, ClauseAnalysis } from '../types/legal';

interface ContractAuditViewProps {
  analysis: ContractAnalysisResult;
  rawText: string;
  perspective: string;
  onOpenEmailModal: () => void;
  onSelectClauseForModal: (clause: ClauseAnalysis) => void;
  onAskCopilotQuestion: (question: string) => void;
}

export const ContractAuditView: React.FC<ContractAuditViewProps> = ({
  analysis,
  rawText,
  perspective,
  onOpenEmailModal,
  onSelectClauseForModal,
  onAskCopilotQuestion,
}) => {
  const [activeRightTab, setActiveRightTab] = useState<'clauses' | 'dealbreakers' | 'copilot'>('clauses');
  const [clauseRiskFilter, setClauseRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClauseId, setSelectedClauseId] = useState<string | null>(null);
  const [copiedClauseId, setCopiedClauseId] = useState<string | null>(null);

  // Copilot mini state
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [copilotHistory, setCopilotHistory] = useState<Array<{
    q: string;
    a: string;
    clause?: string;
    action?: string;
  }>>([
    {
      q: 'What is the biggest risk in this agreement for me?',
      a: analysis.topDealbreakers[0] || 'Uncapped liability and asymmetric obligations.',
      clause: analysis.clauses[0]?.sectionNumber,
      action: 'Demand a mutual liability cap and standard industry exclusions before signing.'
    }
  ]);

  const handleCopyRedline = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedClauseId(id);
    setTimeout(() => setCopiedClauseId(null), 2000);
  };

  const handleCopilotSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!copilotInput.trim() || copilotLoading) return;

    const userQuestion = copilotInput.trim();
    setCopilotInput('');
    setCopilotLoading(true);

    try {
      const res = await fetch('/api/ask-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText: rawText,
          question: userQuestion,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCopilotHistory((prev) => [
          ...prev,
          {
            q: userQuestion,
            a: data.answer,
            clause: data.relevantClause,
            action: data.recommendedAction,
          },
        ]);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      setCopilotHistory((prev) => [
        ...prev,
        {
          q: userQuestion,
          a: `Regarding "${userQuestion}": Based on our legal audit, review the sections governing obligations, liability caps, and termination notice carefully.`,
          clause: 'General Terms & Conditions',
          action: 'Ask the counterparty to explicitly clarify this term in writing or via an addendum.',
        },
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  const filteredClauses = analysis.clauses.filter((clause) => {
    if (clauseRiskFilter === 'all') return true;
    if (clauseRiskFilter === 'high') return clause.riskLevel === 'high';
    if (clauseRiskFilter === 'medium') return clause.riskLevel === 'medium';
    if (clauseRiskFilter === 'low') return clause.riskLevel === 'low' || clause.riskLevel === 'neutral';
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-600';
  };

  return (
    <div className="space-y-6">
      {/* Top Executive Balance & Health Summary */}
      <section className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Fairness Score & Risk Rating */}
          <div className="flex items-center gap-5">
            <div className="relative flex flex-col items-center justify-center w-24 h-24 rounded-full border-4 border-slate-100 shadow-inner shrink-0">
              <span className={`text-2xl font-bold font-mono ${getScoreColor(analysis.fairnessScore).split(' ')[0]}`}>
                {analysis.fairnessScore}
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
                / 100 Score
              </span>
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-slate-600">
                <span className="font-semibold text-slate-900">{analysis.contractTitle}</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-500">{analysis.documentType}</span>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                  Perspective: {perspective}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>{analysis.biasAssessment}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-semibold border ${getScoreColor(analysis.fairnessScore)}`}>
                  {analysis.riskRating} Risk Level
                </span>
              </h2>
              <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
                {analysis.overallSummary}
              </p>
            </div>
          </div>

          {/* Quick Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
            <button
              onClick={onOpenEmailModal}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Draft Counter-Offer Email</span>
            </button>
            <button
              onClick={() => setActiveRightTab('copilot')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-md transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
              <span>Ask Co-Pilot</span>
            </button>
          </div>
        </div>

        {/* Category Health Bars */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-5 mt-5 border-t border-slate-100">
          {analysis.categoryBreakdown.map((cat, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-slate-700 truncate">{cat.category}</span>
                <span className="font-mono text-slate-500 text-[11px] font-semibold">{cat.score}%</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-1">
                <div
                  className={`h-full rounded-full ${getScoreBarColor(cat.score)}`}
                  style={{ width: `${cat.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 truncate" title={cat.verdict}>
                {cat.verdict}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Contract Reader (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-[780px]">
          {/* Reader Header */}
          <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-800">Original Document</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in text..."
                className="text-xs pl-7 pr-2 py-1 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500 w-36 text-slate-800"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* Reader Body */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto legal-scroll font-serif-legal text-xs leading-relaxed text-slate-800 bg-[#FCFBF8]">
            <div className="max-w-prose space-y-4">
              {rawText.split('\n\n').map((paragraph, index) => {
                // Check if this paragraph contains a highlighted clause
                const matchingClause = analysis.clauses.find(
                  (c) =>
                    c.originalExcerpt &&
                    (paragraph.toLowerCase().includes(c.originalExcerpt.toLowerCase().slice(0, 30)) ||
                      (c.sectionNumber && paragraph.toLowerCase().includes(c.sectionNumber.toLowerCase())))
                );

                const isSelected = matchingClause && selectedClauseId === matchingClause.id;

                let highlightClass = '';
                if (matchingClause) {
                  if (matchingClause.riskLevel === 'high') {
                    highlightClass = 'bg-rose-100/70 border-l-2 border-rose-500 pl-3 py-1 cursor-pointer hover:bg-rose-100 transition-colors';
                  } else if (matchingClause.riskLevel === 'medium') {
                    highlightClass = 'bg-amber-100/70 border-l-2 border-amber-500 pl-3 py-1 cursor-pointer hover:bg-amber-100 transition-colors';
                  } else {
                    highlightClass = 'bg-emerald-100/70 border-l-2 border-emerald-500 pl-3 py-1 cursor-pointer hover:bg-emerald-100 transition-colors';
                  }
                }

                if (isSelected) {
                  highlightClass += ' ring-2 ring-amber-500 rounded';
                }

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (matchingClause) {
                        setSelectedClauseId(matchingClause.id);
                        setActiveRightTab('clauses');
                      }
                    }}
                    className={`transition-all ${highlightClass}`}
                  >
                    {paragraph}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reader Footer Info */}
          <div className="px-4 py-2 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Click any highlighted section to review plain-English translation</span>
            <span className="font-mono text-slate-400">{rawText.length} characters</span>
          </div>
        </div>

        {/* Right Column: Intelligence & Redlines Hub (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[780px]">
          {/* Tab Navigation */}
          <div className="px-4 pt-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveRightTab('clauses')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeRightTab === 'clauses'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Clauses &amp; Plain English ({analysis.clauses.length})</span>
              </button>
              <button
                onClick={() => setActiveRightTab('dealbreakers')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeRightTab === 'dealbreakers'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Red Flags &amp; Checklist</span>
              </button>
              <button
                onClick={() => setActiveRightTab('copilot')}
                className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors ${
                  activeRightTab === 'copilot'
                    ? 'border-amber-500 text-slate-950'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Ask Co-Pilot</span>
              </button>
            </div>

            {activeRightTab === 'clauses' && (
              <div className="flex items-center gap-1 text-[11px] pb-1">
                {(['all', 'high', 'medium', 'low'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setClauseRiskFilter(lvl)}
                    className={`px-2 py-0.5 rounded capitalize font-medium transition-colors ${
                      clauseRiskFilter === lvl
                        ? 'bg-slate-900 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {lvl === 'all' ? 'All' : lvl}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Pane Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 legal-scroll space-y-4">
            {/* TAB 1: Clauses Breakdown */}
            {activeRightTab === 'clauses' && (
              <div className="space-y-4">
                {filteredClauses.map((clause) => {
                  const isSelected = selectedClauseId === clause.id;
                  const isCopied = copiedClauseId === clause.id;

                  return (
                    <div
                      key={clause.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/20 ring-1 ring-amber-400'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                clause.riskLevel === 'high'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : clause.riskLevel === 'medium'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {clause.riskLevel} hazard
                            </span>
                            {clause.sectionNumber && (
                              <span className="text-xs text-slate-500 font-mono">
                                {clause.sectionNumber}
                              </span>
                            )}
                            <span className="text-xs text-slate-400">·</span>
                            <span className="text-xs text-slate-500">
                              Favors: <strong className="text-slate-700">{clause.favors}</strong>
                            </span>
                          </div>
                          <h4 className="font-semibold text-slate-900 text-sm">{clause.title}</h4>
                        </div>

                        <button
                          onClick={() => onSelectClauseForModal(clause)}
                          title="Open in full screen modal"
                          className="text-slate-400 hover:text-slate-700 p-1 hover:bg-slate-100 rounded"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Plain English Translation Box */}
                      <div className="p-3 bg-amber-50/60 rounded-md border border-amber-200/70 mb-3 text-xs">
                        <div className="flex items-center gap-1.5 text-amber-900 font-semibold mb-1 text-[11px] uppercase tracking-wider">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>In Plain English:</span>
                        </div>
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {clause.plainEnglish}
                        </p>
                      </div>

                      {/* Original Excerpt snippet */}
                      <div className="mb-2 text-xs">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                          Original Text
                        </span>
                        <p className="font-serif-legal text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-200/60 text-xs line-clamp-3">
                          "{clause.originalExcerpt}"
                        </p>
                      </div>

                      {/* Hidden Trap / Exposure */}
                      {clause.hiddenTrap && (
                        <div className="mb-3 text-xs">
                          <span className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider block mb-0.5">
                            Hidden Trapdoor
                          </span>
                          <p className="text-slate-700 text-xs">
                            {clause.hiddenTrap}
                          </p>
                        </div>
                      )}

                      {/* Suggested Counter-Clause (Redline) */}
                      {clause.suggestedRedline && (
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                              Fair Counter-Proposal (Redline)
                            </span>
                            <button
                              onClick={() => handleCopyRedline(clause.id, clause.suggestedRedline)}
                              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800"
                            >
                              {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              <span>{isCopied ? 'Copied' : 'Copy'}</span>
                            </button>
                          </div>
                          <p className="font-serif-legal text-xs text-slate-800 bg-emerald-50/50 p-2.5 rounded border border-emerald-200/70 leading-relaxed">
                            "{clause.suggestedRedline}"
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 2: Red Flags & Action Checklist */}
            {activeRightTab === 'dealbreakers' && (
              <div className="space-y-6 text-xs">
                {/* Critical Dealbreakers */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <span>Must-Negotiate Dealbreakers</span>
                  </h4>
                  <div className="space-y-2">
                    {analysis.topDealbreakers.map((dealbreaker, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-rose-50 border border-rose-200/80 flex items-start gap-2.5"
                      >
                        <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-rose-950 font-medium leading-relaxed">
                          {dealbreaker}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Protections (What is absent) */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Missing Protective Clauses (Dangerously Absent)</span>
                  </h4>
                  <p className="text-slate-500 mb-2">
                    The counterparty left out these standard protective clauses that normal contracts contain:
                  </p>
                  <ul className="space-y-2">
                    {analysis.missingProtections.map((missing, idx) => (
                      <li
                        key={idx}
                        className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/60 text-slate-800 flex items-start gap-2"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{missing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Checklist */}
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm mb-3 flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span>Prioritized Action Checklist</span>
                  </h4>
                  <div className="space-y-2">
                    {analysis.actionChecklist.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-3"
                      >
                        <span className="text-slate-800 font-medium">{item.action}</span>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded shrink-0 ${
                            item.priority === 'Must Negotiate'
                              ? 'bg-rose-100 text-rose-800'
                              : item.priority === 'Clarify'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.priority}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Embedded Legal Co-Pilot Chat */}
            {activeRightTab === 'copilot' && (
              <div className="flex flex-col h-full space-y-4">
                {/* Chat History */}
                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {copilotHistory.map((item, idx) => (
                    <div key={idx} className="space-y-2 text-xs">
                      {/* User Query */}
                      <div className="flex justify-end">
                        <div className="bg-slate-900 text-white rounded-lg px-3 py-2 max-w-[85%] font-medium">
                          {item.q}
                        </div>
                      </div>

                      {/* Co-Pilot Answer */}
                      <div className="flex justify-start">
                        <div className="bg-slate-100 border border-slate-200 rounded-lg p-3 max-w-[95%] space-y-2 text-slate-800">
                          <div className="flex items-center gap-1.5 text-amber-700 font-semibold text-[11px]">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>LeglEase Co-Pilot</span>
                          </div>
                          <p className="leading-relaxed">{item.a}</p>

                          {item.clause && (
                            <div className="p-2 bg-white rounded border border-slate-200 text-[11px]">
                              <span className="font-semibold text-slate-600">Governing Clause: </span>
                              <span className="font-mono text-slate-800">{item.clause}</span>
                            </div>
                          )}

                          {item.action && (
                            <div className="p-2 bg-emerald-50 text-emerald-950 rounded border border-emerald-200 text-[11px]">
                              <span className="font-semibold">Recommended Move: </span>
                              <span>{item.action}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {copilotLoading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500 italic p-3">
                      <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
                      <span>Reviewing contract clauses and drafting guidance...</span>
                    </div>
                  )}
                </div>

                {/* Suggested Questions */}
                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-400 w-full mb-1">Try asking:</span>
                  {[
                    'Can I terminate this agreement early?',
                    'Is the liability uncapped?',
                    'Can I work with competing clients?',
                    'What happens if payment is late?',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCopilotInput(preset);
                      }}
                      className="text-[11px] text-slate-600 bg-slate-100 hover:bg-amber-100 hover:text-amber-900 px-2 py-1 rounded transition-colors"
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleCopilotSubmit} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={copilotInput}
                    onChange={(e) => setCopilotInput(e.target.value)}
                    placeholder="Ask anything about this contract..."
                    className="flex-1 text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                  <button
                    type="submit"
                    disabled={copilotLoading || !copilotInput.trim()}
                    className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-md transition-colors"
                  >
                    Ask
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
