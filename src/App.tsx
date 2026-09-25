/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ContractAuditView } from './components/ContractAuditView';
import { ContractDrafterView } from './components/ContractDrafterView';
import { LegalGlossaryView } from './components/LegalGlossaryView';
import { CoPilotStandaloneView } from './components/CoPilotStandaloneView';
import { UploadModal } from './components/UploadModal';
import { NegotiationEmailModal } from './components/NegotiationEmailModal';
import { ClauseDetailModal } from './components/ClauseDetailModal';
import { SAMPLE_CONTRACTS } from './data/sampleContracts';
import { ContractAnalysisResult, ClauseAnalysis } from './types/legal';

export default function App() {
  const [activeTab, setActiveTab] = useState<'audit' | 'drafter' | 'copilot' | 'glossary'>('audit');
  const [selectedSampleId, setSelectedSampleId] = useState<string>('freelance-msa');
  const [perspective, setPerspective] = useState<string>('Freelancer / Service Provider');
  const [currentRawText, setCurrentRawText] = useState<string>(SAMPLE_CONTRACTS[0].content);
  const [currentAnalysis, setCurrentAnalysis] = useState<ContractAnalysisResult>(
    SAMPLE_CONTRACTS[0].precomputedAnalysis
  );

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);
  const [selectedClauseForModal, setSelectedClauseForModal] = useState<ClauseAnalysis | null>(null);

  // Handle sample selection
  const handleSelectSample = (id: string) => {
    const sample = SAMPLE_CONTRACTS.find((s) => s.id === id);
    if (!sample) return;

    setSelectedSampleId(id);
    setCurrentRawText(sample.content);
    setCurrentAnalysis(sample.precomputedAnalysis);
    setPerspective(sample.defaultPerspective);
    setActiveTab('audit');
  };

  // Handle uploading and analyzing custom contract text
  const handleAnalyzeText = async (text: string, title: string) => {
    setIsAnalyzing(true);
    setCurrentRawText(text);

    try {
      const res = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          title,
          perspective,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCurrentAnalysis(data);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (err) {
      console.error('Error analyzing contract:', err);
    } finally {
      setIsAnalyzing(false);
      setActiveTab('audit');
    }
  };

  // Handle perspective change and optionally re-analyze
  const handlePerspectiveChange = async (newPerspective: string) => {
    setPerspective(newPerspective);
    // If not a sample contract, re-analyze with new perspective
    const isPrecomputedSample = SAMPLE_CONTRACTS.some(
      (s) => s.id === selectedSampleId && s.content === currentRawText
    );
    if (!isPrecomputedSample) {
      handleAnalyzeText(currentRawText, currentAnalysis.contractTitle);
    }
  };

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans-body">
      {/* Top App Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedSampleId={selectedSampleId}
        onSelectSample={handleSelectSample}
        perspective={perspective}
        onPerspectiveChange={handlePerspectiveChange}
        onTriggerPrint={handleTriggerPrint}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'audit' && (
          <ContractAuditView
            analysis={currentAnalysis}
            rawText={currentRawText}
            perspective={perspective}
            onOpenEmailModal={() => setIsEmailModalOpen(true)}
            onSelectClauseForModal={(c) => setSelectedClauseForModal(c)}
            onAskCopilotQuestion={(q) => setActiveTab('copilot')}
          />
        )}

        {activeTab === 'drafter' && <ContractDrafterView />}

        {activeTab === 'copilot' && (
          <CoPilotStandaloneView
            contractTitle={currentAnalysis.contractTitle}
            contractText={currentRawText}
            perspective={perspective}
          />
        )}

        {activeTab === 'glossary' && <LegalGlossaryView />}
      </main>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onAnalyzeText={handleAnalyzeText}
        isLoading={isAnalyzing}
      />

      <NegotiationEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        contractTitle={currentAnalysis.contractTitle}
        clauses={currentAnalysis.clauses}
      />

      <ClauseDetailModal
        clause={selectedClauseForModal}
        onClose={() => setSelectedClauseForModal(null)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-heading-brand font-bold text-slate-800 tracking-wider">LeglEase</span>
            <span aria-hidden="true">·</span>
            <span>Plain-English Legal &amp; Contract Intelligence</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>For informational &amp; educational purposes · Not formal legal counsel</span>
            <span aria-hidden="true">·</span>
            <span>Powered by Gemini 3.8 Flash</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
