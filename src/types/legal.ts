export type RiskLevel = 'high' | 'medium' | 'low' | 'neutral' | 'Severe' | 'High' | 'Moderate' | 'Low';
export type BiasType = 'Favors Counterparty' | 'Fair & Balanced' | 'Favors You' | 'Extremely One-Sided';

export interface ClauseAnalysis {
  id: string;
  title: string;
  sectionNumber?: string;
  originalExcerpt: string;
  plainEnglish: string;
  riskLevel: 'high' | 'medium' | 'low' | 'neutral';
  favors: 'Counterparty' | 'You' | 'Neutral' | string;
  hiddenTrap: string;
  suggestedRedline: string;
}

export interface CategoryBreakdown {
  category: string;
  score: number; // 0 to 100
  verdict: string;
}

export interface ActionChecklistItem {
  action: string;
  priority: 'Must Negotiate' | 'Clarify' | 'Acceptable';
}

export interface ContractAnalysisResult {
  contractTitle: string;
  documentType: string;
  overallSummary: string;
  fairnessScore: number; // 0 to 100
  riskRating: 'Severe' | 'High' | 'Moderate' | 'Low';
  biasAssessment: BiasType;
  topDealbreakers: string[];
  categoryBreakdown: CategoryBreakdown[];
  clauses: ClauseAnalysis[];
  missingProtections: string[];
  actionChecklist: ActionChecklistItem[];
}

export interface SampleContract {
  id: string;
  title: string;
  category: string;
  description: string;
  defaultPerspective: string;
  content: string;
  precomputedAnalysis: ContractAnalysisResult;
}

export interface GlossaryItem {
  id: string;
  term: string;
  category: 'Liability' | 'Intellectual Property' | 'Termination' | 'Dispute' | 'Financial' | 'General';
  pronunciation?: string;
  plainEnglish: string;
  whyLawyersUseIt: string;
  theDanger: string;
  howToNegotiate: string;
  exampleSentence: string;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  relevantClause?: string;
  practicalImpact?: string;
  recommendedAction?: string;
  suggestedFollowUps?: string[];
  timestamp: string;
}
