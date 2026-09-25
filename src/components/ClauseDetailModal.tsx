import React, { useState } from 'react';
import { X, Copy, Check, ShieldAlert, AlertTriangle, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';
import { ClauseAnalysis } from '../types/legal';

interface ClauseDetailModalProps {
  clause: ClauseAnalysis | null;
  onClose: () => void;
}

export const ClauseDetailModal: React.FC<ClauseDetailModalProps> = ({ clause, onClose }) => {
  const [copiedRedline, setCopiedRedline] = useState(false);

  if (!clause) return null;

  const handleCopyRedline = () => {
    navigator.clipboard.writeText(clause.suggestedRedline);
    setCopiedRedline(true);
    setTimeout(() => setCopiedRedline(false), 2000);
  };

  const getRiskBadge = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
      case 'severe':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <ShieldAlert className="w-3.5 h-3.5" /> High Hazard Trap
          </span>
        );
      case 'medium':
      case 'moderate':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5" /> Requires Caution
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Balanced / Standard
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-slate-200 bg-slate-50/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {getRiskBadge(clause.riskLevel)}
              {clause.sectionNumber && (
                <span className="text-xs text-slate-500 font-mono">{clause.sectionNumber}</span>
              )}
            </div>
            <h3 className="font-semibold text-slate-900 text-base">{clause.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Plain English Translation */}
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-lg">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold mb-1.5 text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Plain English Translation</span>
            </div>
            <p className="text-slate-800 text-sm leading-relaxed font-medium">
              {clause.plainEnglish}
            </p>
            <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1.5">
              <span className="font-semibold">Favors:</span>
              <span className="bg-amber-100/90 text-amber-900 px-1.5 py-0.5 rounded font-medium">
                {clause.favors}
              </span>
            </div>
          </div>

          {/* Original Excerpt */}
          <div>
            <span className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Original Contract Text
            </span>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md font-serif-legal text-slate-800 text-xs italic leading-relaxed">
              "{clause.originalExcerpt}"
            </div>
          </div>

          {/* Hidden Trapdoor */}
          {clause.hiddenTrap && (
            <div>
              <span className="block text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
                The Hidden Trap &amp; Exposure
              </span>
              <p className="text-slate-700 leading-relaxed bg-rose-50/40 p-3 rounded-md border border-rose-100 text-xs">
                {clause.hiddenTrap}
              </p>
            </div>
          )}

          {/* Suggested Redline */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Recommended Balanced Counter-Clause (Redline)
              </span>
              <button
                onClick={handleCopyRedline}
                className="flex items-center gap-1 text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                {copiedRedline ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedRedline ? 'Copied' : 'Copy Counter-Clause'}</span>
              </button>
            </div>
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-md text-slate-800 font-serif-legal text-xs leading-relaxed">
              "{clause.suggestedRedline}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-slate-200 bg-slate-50/60">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
