import React, { useState } from 'react';
import { PenLine, Copy, Check, Download, Printer, Sparkles, RefreshCw, ShieldCheck, ChevronRight } from 'lucide-react';

interface DrafterOptions {
  partyA: string;
  partyB: string;
  scopeOfWork: string;
  paymentTerms: string;
  lateFee: string;
  liabilityCap: string;
  terminationNotice: string;
  jurisdiction: string;
}

export const ContractDrafterView: React.FC = () => {
  const [templateType, setTemplateType] = useState<string>('Independent Contractor Services Agreement');
  const [options, setOptions] = useState<DrafterOptions>({
    partyA: 'Acme Enterprises Inc.',
    partyB: 'Alex Rivera Consulting LLC',
    scopeOfWork: 'Full-stack web application development, cloud deployment, and system maintenance.',
    paymentTerms: 'Net-30 days from invoice date',
    lateFee: '1.5% per month on unpaid balances',
    liabilityCap: 'Total fees paid under this Agreement in preceding 12 months',
    terminationNotice: '30 days prior written notice',
    jurisdiction: 'State of California',
  });

  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [generatedTitle, setGeneratedTitle] = useState<string>('');
  const [isDrafting, setIsDrafting] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const generateDraft = async (type = templateType, customOpts = options) => {
    setIsDrafting(true);
    try {
      const res = await fetch('/api/draft-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateType: type,
          options: customOpts,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setGeneratedTitle(data.title || `Balanced ${type}`);
        setGeneratedContract(data.contractText || '');
      } else {
        throw new Error('Fallback draft');
      }
    } catch {
      // Smart local fallback draft
      setGeneratedTitle(`Balanced ${type}`);
      setGeneratedContract(`BALANCED ${type.toUpperCase()}

This Agreement is entered into by and between ${customOpts.partyA} ("Client") and ${customOpts.partyB} ("Contractor").

1. SCOPE OF SERVICES
Contractor agrees to perform the professional services detailed herein:
${customOpts.scopeOfWork}

2. COMPENSATION & FAIR PAYMENT GUARANTEES
Client shall pay Contractor according to agreed milestone rates. Invoices shall be payable ${customOpts.paymentTerms}. Overdue amounts shall accrue interest at ${customOpts.lateFee}. If invoice remains delinquent beyond 15 days, Contractor may suspend services without penalty upon 5 days written notice.

3. INTELLECTUAL PROPERTY & PRE-EXISTING IP CARVE-OUT
(a) Work Product: Upon full and final receipt of payment, Contractor assigns to Client all right, title, and interest in deliverables created specifically for Client.
(b) Pre-Existing IP: Contractor retains full exclusive ownership of all pre-existing tools, libraries, templates, and general know-how. Client receives a non-exclusive license to use such materials solely as part of the finished deliverable.

4. MUTUAL CONFIDENTIALITY
Each party agrees to hold all proprietary trade secrets in strict confidence for two (2) years following completion.

5. RECIPROCAL LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY SHALL BE LIABLE FOR CONSEQUENTIAL OR PUNITIVE DAMAGES. EACH PARTY’S MAXIMUM AGGREGATE LIABILITY SHALL BE MUTUALLY CAPPED AT ${customOpts.liabilityCap.toUpperCase()}.

6. TERMINATION FOR CONVENIENCE
Either party may terminate this Agreement without penalty upon ${customOpts.terminationNotice}. Client shall compensate Contractor for all work completed up to the effective termination date.

7. GOVERNING LAW & JURISDICTION
This Agreement shall be governed by the laws of the ${customOpts.jurisdiction}.

IN WITNESS WHEREOF, the parties execute this Agreement.

CLIENT: ${customOpts.partyA}
By: ___________________________ Date: _________

CONTRACTOR: ${customOpts.partyB}
By: ___________________________ Date: _________`);
    } finally {
      setIsDrafting(false);
    }
  };

  // Generate initial draft on mount if empty
  React.useEffect(() => {
    if (!generatedContract) {
      generateDraft();
    }
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContract], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedTitle.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
              Interactive Legal Generator
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Plain-English Contract Drafter
          </h2>
          <p className="text-xs text-slate-600 max-w-2xl mt-1 leading-relaxed">
            Generate balanced, modern contracts designed to protect both parties without predatory one-sided loopholes or archaic legal clutter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => generateDraft()}
            disabled={isDrafting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-md shadow-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isDrafting ? 'animate-spin' : ''}`} />
            <span>{isDrafting ? 'Drafting...' : 'Regenerate Agreement'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Drafter Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Settings (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <h3 className="font-semibold text-slate-900 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
            <PenLine className="w-4 h-4 text-amber-600" />
            <span>Contract Configuration</span>
          </h3>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Agreement Type</label>
            <select
              value={templateType}
              onChange={(e) => {
                setTemplateType(e.target.value);
                generateDraft(e.target.value, options);
              }}
              className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium text-slate-900 text-xs"
            >
              <option value="Independent Contractor Services Agreement">Independent Contractor Services Agreement</option>
              <option value="Mutual Non-Disclosure Agreement (NDA)">Mutual Non-Disclosure Agreement (NDA)</option>
              <option value="Subcontractor Agreement Addendum">Subcontractor Agreement Addendum</option>
              <option value="Payment Demand & Late Notice Letter">Payment Demand &amp; Late Notice Letter</option>
              <option value="Intellectual Property Assignment with Carve-Out">Intellectual Property Assignment with Carve-Out</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Party A (Client/Company)</label>
              <input
                type="text"
                value={options.partyA}
                onChange={(e) => setOptions({ ...options, partyA: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Party B (Contractor/You)</label>
              <input
                type="text"
                value={options.partyB}
                onChange={(e) => setOptions({ ...options, partyB: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Scope of Work</label>
            <textarea
              rows={3}
              value={options.scopeOfWork}
              onChange={(e) => setOptions({ ...options, scopeOfWork: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Payment Schedule</label>
              <select
                value={options.paymentTerms}
                onChange={(e) => setOptions({ ...options, paymentTerms: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Net-15 days from invoice date">Net-15 Days</option>
                <option value="Net-30 days from invoice date">Net-30 Days</option>
                <option value="50% deposit upfront, 50% on delivery">50% Deposit / 50% Delivery</option>
                <option value="Due upon receipt of invoice">Due Upon Receipt</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Late Fee Penalty</label>
              <input
                type="text"
                value={options.lateFee}
                onChange={(e) => setOptions({ ...options, lateFee: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Liability Cap</label>
              <select
                value={options.liabilityCap}
                onChange={(e) => setOptions({ ...options, liabilityCap: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Total fees paid under this Agreement in preceding 12 months">12 Months Fees</option>
                <option value="Total project fee payable under Statement of Work">Total Project Fee</option>
                <option value="Fixed amount of $25,000 USD">$25,000 USD Cap</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">Notice for Termination</label>
              <select
                value={options.terminationNotice}
                onChange={(e) => setOptions({ ...options, terminationNotice: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="14 days prior written notice">14 Days Notice</option>
                <option value="30 days prior written notice">30 Days Notice</option>
                <option value="60 days prior written notice">60 Days Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Governing State / Jurisdiction</label>
            <input
              type="text"
              value={options.jurisdiction}
              onChange={(e) => setOptions({ ...options, jurisdiction: e.target.value })}
              className="w-full p-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => generateDraft(templateType, options)}
              disabled={isDrafting}
              className="w-full py-2.5 px-4 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 rounded-md shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Update Generated Agreement</span>
            </button>
          </div>
        </div>

        {/* Right Generated Document Preview (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col h-[780px] overflow-hidden">
          {/* Action Bar */}
          <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-slate-900 truncate">{generatedTitle}</span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save .txt</span>
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Document Content View */}
          <div className="flex-1 p-6 overflow-y-auto legal-scroll bg-[#FAF9F5] text-slate-800 font-serif-legal text-xs leading-relaxed">
            <pre className="whitespace-pre-wrap font-serif-legal text-xs leading-relaxed max-w-prose">
              {generatedContract}
            </pre>
          </div>

          {/* Bottom Callout */}
          <div className="px-5 py-3 border-t border-slate-200 bg-emerald-50 text-[11px] text-emerald-950 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              This agreement uses reciprocal protections: capped liabilities, payment-contingent IP assignment, and mutual termination rights.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
