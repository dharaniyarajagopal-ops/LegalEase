import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Mail, Send, SlidersHorizontal } from 'lucide-react';
import { ClauseAnalysis } from '../types/legal';

interface NegotiationEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  contractTitle: string;
  clauses: ClauseAnalysis[];
}

export const NegotiationEmailModal: React.FC<NegotiationEmailModalProps> = ({
  isOpen,
  onClose,
  contractTitle,
  clauses,
}) => {
  const [tone, setTone] = useState<'Collaborative' | 'Firm' | 'Executive'>('Firm');
  const [counterpartyName, setCounterpartyName] = useState('Client / Counterparty');
  const [userRole, setUserRole] = useState('Consultant / Contractor');
  const [copied, setCopied] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter high/medium risk clauses with suggested redlines
  const highRiskClauses = clauses.filter((c) => c.riskLevel === 'high' || c.riskLevel === 'medium');

  const generateEmail = async (selectedTone: string) => {
    setIsGenerating(true);
    try {
      const redlinesPayload = highRiskClauses.map((c) => ({
        clause: c.title,
        issue: c.hiddenTrap,
        counterProposal: c.suggestedRedline,
      }));

      const res = await fetch('/api/generate-negotiation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractTitle,
          counterparty: counterpartyName,
          redlines: redlinesPayload,
          tone: selectedTone,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setEmailSubject(data.subject || `Proposed Adjustments - ${contractTitle}`);
        setEmailBody(data.body || '');
      } else {
        throw new Error('Fallback');
      }
    } catch {
      // Local fallback template
      setEmailSubject(`Contract Review & Proposed Amendments: ${contractTitle}`);
      setEmailBody(`Hi ${counterpartyName},

Thank you very much for sending over the ${contractTitle}. I am excited about working together and looking forward to our collaboration.

I have completed an initial review of the terms. Overall it looks great, but there are a few standard commercial adjustments I would like to propose to align with standard industry practices and ensure mutual fairness:

${highRiskClauses
  .slice(0, 4)
  .map(
    (c, idx) =>
      `${idx + 1}. ${c.title} (${c.sectionNumber || 'Relevant Section'}):
   • Context: ${c.plainEnglish}
   • Proposed Revision: "${c.suggestedRedline}"`
  )
  .join('\n\n')}

Please let me know if these adjustments work for your team, or if you would like me to return a formal tracked-changes redline document.

Looking forward to finalizing the agreement!

Best regards,
[Your Name]
[Your Contact Information]`);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      generateEmail(tone);
    }
  }, [isOpen, tone]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${emailSubject}\n\n${emailBody}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Negotiation Counter-Offer Generator</h3>
              <p className="text-xs text-slate-500">
                Ready-to-send email outlining your requested redlines diplomatically
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Bar */}
        <div className="px-6 py-3 bg-slate-100/60 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Tone:</span>
            <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 rounded-md">
              {(['Collaborative', 'Firm', 'Executive'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    tone === t ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t === 'Collaborative' ? 'Friendly' : t === 'Firm' ? 'Firm & Balanced' : 'Executive'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Recipient:</span>
            <input
              type="text"
              value={counterpartyName}
              onChange={(e) => setCounterpartyName(e.target.value)}
              placeholder="Recipient name"
              className="bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-800 w-36 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Subject Line</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="w-full text-xs font-medium px-3 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-600">Email Body</label>
              <span className="text-[11px] text-slate-400">
                Incorporates {highRiskClauses.length} detected contract redlines
              </span>
            </div>
            <textarea
              rows={12}
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              className="w-full text-xs font-sans p-3 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50/80">
          <div className="text-[11px] text-slate-500">
            Tip: You can edit the text directly before copying.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-md transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-md shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Email'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
