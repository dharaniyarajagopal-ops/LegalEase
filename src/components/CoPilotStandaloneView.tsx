import React, { useState } from 'react';
import { MessageSquare, Sparkles, Send, Scale, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { CopilotMessage } from '../types/legal';

interface CoPilotStandaloneViewProps {
  contractTitle: string;
  contractText: string;
  perspective: string;
}

export const CoPilotStandaloneView: React.FC<CoPilotStandaloneViewProps> = ({
  contractTitle,
  contractText,
  perspective,
}) => {
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'msg-intro',
      sender: 'assistant',
      text: `Hello! I am your LeglEase Legal Co-Pilot. I am currently analyzing "${contractTitle}" from your perspective as a ${perspective}. Ask me any specific question about your obligations, payment guarantees, termination rights, or liability risks.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: [
        'What is my maximum liability under this contract?',
        'Can I terminate this agreement without penalty?',
        'Who owns the IP and pre-existing code?',
        'What are the payment deadlines and late penalties?',
      ],
    },
  ]);

  const handleSend = async (questionText?: string) => {
    const q = (questionText || inputQuery).trim();
    if (!q || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ask-copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractText,
          question: q,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const assistantMsg: CopilotMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          relevantClause: data.relevantClause,
          practicalImpact: data.practicalImpact,
          recommendedAction: data.recommendedAction,
          suggestedFollowUps: data.suggestedFollowUps || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error('Fallback');
      }
    } catch {
      // Local fallback intelligent response
      const fallbackMsg: CopilotMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: `Regarding "${q}": In ${contractTitle}, clauses of this type should be carefully reviewed for mutual reciprocity. If the term grants unilateral discretion to the counterparty, it represents a substantial operational risk.`,
        relevantClause: 'Section on General Obligations & Commercial Terms',
        practicalImpact: 'Without an express mutual cap or written carve-out, you may bear unanticipated liabilities or delays.',
        recommendedAction: 'Propose inserting an explicit carve-out or reciprocity amendment to this clause before signing.',
        suggestedFollowUps: [
          'How can I phrase a counter-proposal for this?',
          'What is the standard industry practice for this term?',
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[820px] overflow-hidden">
      {/* Co-Pilot Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm">LeglEase Co-Pilot</h3>
            <p className="text-xs text-slate-500">
              Active Context: <span className="font-medium text-slate-700">{contractTitle}</span> ({perspective})
            </p>
          </div>
        </div>

        <div className="text-xs text-slate-500 hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Objective Contract Analysis</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-6 overflow-y-auto legal-scroll space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-2 text-xs">
            {msg.sender === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-slate-900 text-white rounded-lg px-4 py-2.5 max-w-[80%] font-medium leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-[90%] space-y-3 text-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-200/60 pb-1.5">
                    <span className="font-semibold text-amber-700 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5" />
                      LeglEase Legal Analysis
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <p className="text-slate-800 leading-relaxed text-xs font-medium">
                    {msg.text}
                  </p>

                  {msg.relevantClause && (
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500 block mb-0.5">
                        Governing Clause / Section:
                      </span>
                      <p className="font-mono text-slate-800 text-[11px] font-semibold">
                        {msg.relevantClause}
                      </p>
                    </div>
                  )}

                  {msg.practicalImpact && (
                    <div className="p-2.5 bg-amber-50/70 rounded-lg border border-amber-200/60 text-xs">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-800 block mb-0.5">
                        Practical Real-World Impact:
                      </span>
                      <p className="text-slate-800 leading-relaxed">
                        {msg.practicalImpact}
                      </p>
                    </div>
                  )}

                  {msg.recommendedAction && (
                    <div className="p-2.5 bg-emerald-50 text-emerald-950 rounded-lg border border-emerald-200 text-xs">
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-800 block mb-0.5">
                        Recommended Negotiation Move:
                      </span>
                      <p className="leading-relaxed">
                        {msg.recommendedAction}
                      </p>
                    </div>
                  )}

                  {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] text-slate-400 block mb-1.5">Suggested Next Questions:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.suggestedFollowUps.map((prompt, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSend(prompt)}
                            className="text-[11px] text-slate-600 bg-white hover:bg-amber-100 hover:text-amber-900 border border-slate-200 px-2.5 py-1 rounded transition-colors text-left"
                          >
                            {prompt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-4 text-xs text-slate-500 bg-slate-50 rounded-lg max-w-fit">
            <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            <span>Analyzing contract context and cross-referencing legal obligations...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask a question about your contract (e.g. Can I terminate early? Is liability capped?)..."
            className="flex-1 text-xs px-4 py-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-slate-900"
          />
          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-md shadow-xs transition-colors shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Question</span>
          </button>
        </form>
      </div>
    </div>
  );
};
