import React, { useState } from 'react';
import { X, Upload, FileText, Sparkles, AlertCircle } from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalyzeText: (text: string, title: string) => void;
  isLoading: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onAnalyzeText,
  isLoading,
}) => {
  const [contractTitle, setContractTitle] = useState('');
  const [contractText, setContractText] = useState('');
  const [fileName, setFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (!contractTitle) {
      setContractTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setContractText(content);
        setErrorMsg('');
      }
    };
    reader.onerror = () => {
      setErrorMsg('Failed to read file. Please paste the text directly.');
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractText.trim()) {
      setErrorMsg('Please paste or upload the contract text to analyze.');
      return;
    }
    const title = contractTitle.trim() || fileName || 'Uploaded Agreement';
    onAnalyzeText(contractText, title);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center text-amber-700">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm">Upload or Paste Legal Document</h3>
              <p className="text-xs text-slate-500">Analyze any contract, agreement, NDA, lease, or terms of service</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Document Name / Title (Optional)
            </label>
            <input
              type="text"
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              placeholder="e.g. Master Consulting Agreement, Apartment Lease, Employment Letter"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-slate-700">
                Contract Text
              </label>
              <label className="text-xs text-amber-700 hover:text-amber-800 font-medium cursor-pointer flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload .txt/.md file</span>
                <input
                  type="file"
                  accept=".txt,.md,.text,.rtf,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
            <textarea
              rows={9}
              value={contractText}
              onChange={(e) => {
                setContractText(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Paste the full contract or agreement text here (terms, clauses, covenants, signatures)..."
              className="w-full text-xs font-mono p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-slate-50/50 leading-relaxed"
            />
            {fileName && (
              <p className="mt-1 text-[11px] text-slate-500">
                Loaded file: <span className="font-semibold text-slate-700">{fileName}</span> ({contractText.length} characters)
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !contractText.trim()}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-sm transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isLoading ? 'Analyzing Document...' : 'Run LeglEase Audit'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
