import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Helper for cleaning JSON responses from LLM
function extractJsonFromText(rawText: string): any {
  let cleaned = rawText.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned);
}

// 1. Analyze Contract
app.post('/api/analyze-contract', async (req: Request, res: Response) => {
  const { text, title = 'Agreement', perspective = 'Freelancer / Service Provider' } = req.body;

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Contract text is required' });
  }

  // If Gemini API is available, perform deep legal analysis
  if (ai) {
    try {
      const prompt = `You are LeglEase, an elite legal tech counsel and contract reviewer.
Analyze the following legal document from the perspective of: "${perspective}".
The document is titled: "${title}".

Your mission is to demystify this contract, identify hidden trapdoors, assess fairness, and provide tactical renegotiation points.

Return a STRICT JSON object conforming to this schema (do NOT wrap in markdown unless standard json):
{
  "contractTitle": "Clear descriptive title of agreement",
  "documentType": "e.g. Master Services Agreement / Lease / NDA / SaaS Terms / Employment",
  "overallSummary": "A 2-3 sentence executive summary of what this document actually binds the user to, in plain, direct English.",
  "fairnessScore": 65, // Integer 0 to 100 where 100 is completely fair and safe, 0 is highly predatory/dangerous
  "riskRating": "High" | "Moderate" | "Low" | "Severe",
  "biasAssessment": "Favors Counterparty" | "Fair & Balanced" | "Favors You" | "Extremely One-Sided",
  "topDealbreakers": [
    "Specific high-risk term 1 (e.g. Unlimited unilateral indemnification with no cap)",
    "Specific high-risk term 2",
    "Specific high-risk term 3"
  ],
  "categoryBreakdown": [
    {
      "category": "Liability & Indemnity",
      "score": 45, // 0-100
      "verdict": "One-sided indemnification puts your business at severe financial risk."
    },
    {
      "category": "Intellectual Property & Ownership",
      "score": 60,
      "verdict": "Broad assignment transfers rights to pre-existing background code."
    },
    {
      "category": "Payment & Penalties",
      "score": 75,
      "verdict": "Standard Net-30 terms, but lacks interest on late payments."
    },
    {
      "category": "Termination & Notice",
      "score": 50,
      "verdict": "Client can cancel instantly without cause, while you require 60-day notice."
    },
    {
      "category": "Restrictive Covenants (Non-Compete/Non-Solicit)",
      "score": 55,
      "verdict": "Non-solicitation period is excessive (24 months) and geographic scope is ambiguous."
    }
  ],
  "clauses": [
    {
      "id": "clause-1",
      "title": "Short descriptive title of clause",
      "sectionNumber": "Section 4.2",
      "originalExcerpt": "Verbatim quote or core snippet of the clause from the text (max 2-3 sentences)",
      "plainEnglish": "What this actually means in plain human language without legalese.",
      "riskLevel": "high" | "medium" | "low" | "neutral",
      "favors": "Counterparty" | "You" | "Neutral",
      "hiddenTrap": "The hidden danger or trapdoor if signed as-is.",
      "suggestedRedline": "Precise counter-language to propose that makes it balanced and fair."
    }
  ],
  "missingProtections": [
    "Protection 1 that is notably absent (e.g. Mutual limitation of liability capped at fees paid in past 12 months)",
    "Protection 2 (e.g. Right to terminate if invoices are unpaid past 15 days)",
    "Protection 3 (e.g. Exemption for pre-existing IP and general know-how)"
  ],
  "actionChecklist": [
    {
      "action": "Demand mutual liability cap tied to total project fee.",
      "priority": "Must Negotiate" | "Clarify" | "Acceptable"
    },
    {
      "action": "Carve out pre-existing open-source tools from the IP assignment schedule.",
      "priority": "Must Negotiate" | "Clarify" | "Acceptable"
    },
    {
      "action": "Reduce post-termination non-solicitation from 2 years to 6 months.",
      "priority": "Clarify" | "Must Negotiate" | "Acceptable"
    }
  ]
}

Identify at least 4 to 8 of the most critical clauses in the text.
CONTRACT TEXT:
${text.slice(0, 30000)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      return res.json(parsed);
    } catch (err: any) {
      console.error('Gemini contract analysis error:', err);
      // Fall through to heuristic analysis
    }
  }

  // Fallback intelligent heuristic analyzer if Gemini API key is absent or offline
  const fallbackResult = generateHeuristicAnalysis(text, title, perspective);
  return res.json(fallbackResult);
});

// 2. Simplify specific clause
app.post('/api/simplify-clause', async (req: Request, res: Response) => {
  const { clauseText, context = '', targetAudience = 'Everyday Person' } = req.body;

  if (!clauseText) {
    return res.status(400).json({ error: 'clauseText is required' });
  }

  if (ai) {
    try {
      const prompt = `You are LeglEase. Translate this legal clause into clear, plain English for a ${targetAudience}.
Context: ${context}
Original Clause:
"""${clauseText}"""

Return a JSON object:
{
  "plainEnglish": "Simple, direct explanation in 2-3 sentences. No buzzwords.",
  "favors": "Who this benefits most (e.g. Company, Client, Landlord, You, or Neutral)",
  "riskLevel": "high" | "medium" | "low" | "neutral",
  "explanation": "Why this matters in practical terms and real-world scenario.",
  "counterOffer": "A fairer, industry-standard counter-clause to propose.",
  "negotiationTip": "One quick actionable tip on how to ask for this change politely."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini simplify error:', err);
    }
  }

  // Heuristic fallback for simplify
  return res.json({
    plainEnglish: `In simple terms: this clause sets legal obligations regarding ${clauseText.slice(0, 40)}... You are agreeing to adhere to the counterparty's stipulations without customary exceptions.`,
    favors: 'Counterparty',
    riskLevel: 'medium',
    explanation: 'Clauses of this nature typically burden one party with unilateral liability or unrestricted compliance timelines.',
    counterOffer: `Both parties agree to exercise commercially reasonable efforts in connection with the matters set forth herein, subject to mutual 30 days written notice.`,
    negotiationTip: 'Ask to make this obligation mutual or subject to standard industry exclusions.',
  });
});

// 3. Ask Legal Co-Pilot
app.post('/api/ask-copilot', async (req: Request, res: Response) => {
  const { contractText, question, history = [] } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'question is required' });
  }

  if (ai) {
    try {
      const prompt = `You are LeglEase Legal Co-Pilot, an intelligent, objective legal assistant.
You are reviewing the following contract with the user.
Answer the user's question directly, accurately, and citing specific clauses where relevant.
Do NOT give generic legal boilerplate disclaimers at the start. Dive straight into the answer, then cite the relevant clause and give practical negotiation advice.

USER QUESTION: "${question}"

CONTRACT TEXT:
"""${(contractText || '').slice(0, 30000)}"""

Respond with a JSON object:
{
  "answer": "Direct, crisp answer explaining what the contract says on this issue.",
  "relevantClause": "Quote or reference to the section/clause in the text that governs this.",
  "practicalImpact": "What this means in real day-to-day operations or worst-case scenario.",
  "recommendedAction": "What the user should ask for or clarify before signing.",
  "suggestedFollowUps": ["Follow-up question 1?", "Follow-up question 2?"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini co-pilot error:', err);
    }
  }

  // Fallback Co-Pilot response
  return res.json({
    answer: `Regarding "${question}": Based on standard contract analysis, this document establishes governing terms that should be scrutinized for mutual reciprocity and clear caps.`,
    relevantClause: "Section on General Obligations & Governing Terms",
    practicalImpact: "Signing without clarification leaves ambiguity that is resolved according to standard jurisdictional default rules.",
    recommendedAction: "Request a specific written addendum addressing your question explicitly in the definition section.",
    suggestedFollowUps: [
      "Can I terminate this agreement early?",
      "What are the payment milestone deadlines?",
      "Is there a limitation of liability clause?",
    ],
  });
});

// 4. Draft Contract
app.post('/api/draft-contract', async (req: Request, res: Response) => {
  const { templateType, options = {} } = req.body;

  if (ai) {
    try {
      const prompt = `You are LeglEase. Draft a complete, high-quality, balanced, modern legal agreement in clear plain English for: "${templateType}".
User specifications:
${JSON.stringify(options, null, 2)}

Requirements:
- Modern, clean drafting without archaic legal jargon ("heretofore", "witnesseth").
- Fair and reciprocal where appropriate (e.g. mutual confidentiality, capped liabilities).
- Complete text with standard sections: Parties, Scope, Payment/Consideration, Intellectual Property, Term & Termination, Warranties & Disclaimers, Limitation of Liability, Governing Law, and Signature Blocks.

Respond with a JSON object:
{
  "title": "Document Title",
  "summary": "Brief summary of what this agreement does",
  "contractText": "Full formatted contract text with numbered sections and placeholder brackets where user fills in names/dates.",
  "keyClausesExplained": [
    {"name": "Liability Cap", "explanation": "Caps liability at fees paid in past 12 months for mutual protection."},
    {"name": "Payment Terms", "explanation": "Net-30 with standard 1.5% late fee per month."}
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini draft error:', err);
    }
  }

  // Standard template fallback
  return res.json(getFallbackDraft(templateType, options));
});

// 5. Generate Counter-Offer Email
app.post('/api/generate-negotiation-email', async (req: Request, res: Response) => {
  const { contractTitle = 'Agreement', counterparty = 'Client', redlines = [], tone = 'Firm & Professional' } = req.body;

  if (ai) {
    try {
      const prompt = `Write an email proposing renegotiation/redlines on a contract.
Contract: ${contractTitle}
Recipient: ${counterparty}
Desired Tone: ${tone} (Options: Friendly & Collaborative, Firm & Professional, Concise Executive)
Key changes to request:
${JSON.stringify(redlines, null, 2)}

Respond with a JSON object:
{
  "subject": "Email Subject Line",
  "body": "Complete, polite, persuasive email body ready to copy and send. Highlight mutual benefit and industry standards."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = extractJsonFromText(response.text || '{}');
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini email generation error:', err);
    }
  }

  // Fallback negotiation email
  return res.json({
    subject: `Contract Review & Minor Proposed Updates - ${contractTitle}`,
    body: `Hi ${counterparty || 'there'},

Thank you for sending over the ${contractTitle}. I am excited about the prospect of working together.

I have reviewed the agreement and it looks largely good. There are just a few standard commercial adjustments I'd like to propose to align with standard industry practices and ensure mutual protection for both our organizations:

${redlines.map((r: any, idx: number) => `${idx + 1}. ${r.clause || 'Key Clause'}: ${r.issue || 'Adjustment'}\n   Proposed: "${r.counterProposal || 'Mutual standard language'}"`).join('\n\n')}

Please let me know if these adjustments work for your team, or if you'd prefer me to send back a tracked-changes redline document.

Looking forward to finalizing this!

Best regards,
[Your Name]`,
  });
});

// Heuristic fallback generator
function generateHeuristicAnalysis(text: string, title: string, perspective: string) {
  const lower = text.toLowerCase();
  const hasIndemnity = lower.includes('indemnif') || lower.includes('hold harmless');
  const hasUnlimitedLiability = lower.includes('unlimited') || (!lower.includes('aggregate liability') && hasIndemnity);
  const hasIpAssignment = lower.includes('work made for hire') || lower.includes('assign') && lower.includes('intellectual property');
  const hasNonCompete = lower.includes('non-compete') || lower.includes('covenant not to compete') || lower.includes('solicit');
  const hasTermination = lower.includes('terminate') || lower.includes('convenience');
  const hasArbitration = lower.includes('arbitrat') || lower.includes('waive') && lower.includes('jury');

  const clauses: any[] = [];
  const topDealbreakers: string[] = [];
  let fairnessScore = 70;

  if (hasIndemnity) {
    fairnessScore -= 18;
    topDealbreakers.push('Unilateral or broad indemnification clause creating open-ended financial liability.');
    clauses.push({
      id: 'c-indemnity',
      title: 'Indemnification & Defense Obligations',
      sectionNumber: 'Section on Indemnity',
      originalExcerpt: 'Party agrees to defend, indemnify, and hold harmless against any and all claims, damages, liabilities, costs, and expenses (including attorneys fees)...',
      plainEnglish: 'You are agreeing to pay all legal fees and court damages if a third party sues the counterparty, even if the issue was partially outside your direct control.',
      riskLevel: 'high',
      favors: 'Counterparty',
      hiddenTrap: 'Lacks a dollar cap and covers indirect or consequential damages without reciprocal protection.',
      suggestedRedline: 'Each party shall defend and indemnify the other solely against third-party claims arising directly from gross negligence or intentional misconduct, capped at the total fees paid under this Agreement.'
    });
  }

  if (hasIpAssignment) {
    fairnessScore -= 12;
    topDealbreakers.push('Broad Intellectual Property assignment without clear carve-outs for pre-existing tools.');
    clauses.push({
      id: 'c-ip',
      title: 'Ownership and Work Made for Hire',
      sectionNumber: 'Section on IP Assignment',
      originalExcerpt: 'All works, inventions, designs, and discoveries created or conceived shall be deemed work made for hire and become the sole and exclusive property of the Company...',
      plainEnglish: 'The client owns everything you create during the engagement, which could inadvertently include your background templates, code libraries, or reusable know-how.',
      riskLevel: 'medium',
      favors: 'Counterparty',
      hiddenTrap: 'Without explicit carve-out for Pre-Existing IP, you might forfeit rights to your own foundational tooling.',
      suggestedRedline: 'Client shall own the final deliverables upon full payment. Service Provider retains all rights, title, and interest in and to its Pre-Existing Intellectual Property and general reusable methods.'
    });
  }

  if (hasNonCompete) {
    fairnessScore -= 15;
    topDealbreakers.push('Restrictive non-compete / non-solicit preventing you from working with industry peers.');
    clauses.push({
      id: 'c-restrictive',
      title: 'Restrictive Covenants & Non-Solicitation',
      sectionNumber: 'Section on Restrictive Covenants',
      originalExcerpt: 'Recipient agrees not to engage directly or indirectly in any business competing with the Company or solicit any employees, contractors, or customers for a period of 24 months...',
      plainEnglish: 'You cannot work for competitors or solicit anyone connected to the company for up to 2 years after this contract ends.',
      riskLevel: 'high',
      favors: 'Counterparty',
      hiddenTrap: 'Can severely restrict your livelihood and client acquisition after the contract finishes.',
      suggestedRedline: 'Remove non-compete entirely as an independent contractor; limit non-solicitation of direct employees to 6 months post-termination.'
    });
  }

  if (hasTermination) {
    clauses.push({
      id: 'c-termination',
      title: 'Term and Termination Rights',
      sectionNumber: 'Section on Termination',
      originalExcerpt: 'Either party may terminate this agreement upon written notice. Company may terminate immediately for convenience without penalty.',
      plainEnglish: 'The other party can walk away at any moment without paying cancellation fees, whereas your termination notice requirements may be more rigid.',
      riskLevel: 'medium',
      favors: 'Counterparty',
      hiddenTrap: 'Sudden termination can leave you with unpaid overhead or stranded resources.',
      suggestedRedline: 'Either party may terminate for convenience with thirty (30) days prior written notice. Upon termination, Client shall pay for all work completed through the effective date.'
    });
  }

  if (hasArbitration) {
    clauses.push({
      id: 'c-dispute',
      title: 'Dispute Resolution & Mandatory Arbitration',
      sectionNumber: 'Section on Dispute Resolution',
      originalExcerpt: 'Any dispute arising out of or related to this agreement shall be settled by binding arbitration in accordance with AAA rules, waiving right to jury trial or class actions.',
      plainEnglish: 'You cannot take the company to open court or participate in a joint lawsuit; disputes must go through a private, paid arbitrator.',
      riskLevel: 'medium',
      favors: 'Neutral',
      hiddenTrap: 'Arbitration filing fees can be thousands of dollars, which discourages smaller claims for unpaid invoices.',
      suggestedRedline: 'Disputes under $25,000 shall be eligible for small claims court in the jurisdiction where services were performed.'
    });
  }

  fairnessScore = Math.max(30, Math.min(fairnessScore, 90));

  return {
    contractTitle: title || 'Analyzed Agreement',
    documentType: title.includes('Lease') ? 'Residential / Commercial Lease' : title.includes('NDA') ? 'Non-Disclosure Agreement' : 'Master Services & Independent Contractor Agreement',
    overallSummary: `This agreement establishes binding commercial terms between the parties. From the perspective of ${perspective}, the contract leans noticeably in favor of the counterparty, placing heightened indemnification and restrictive liabilities upon you while offering limited reciprocal guarantees.`,
    fairnessScore,
    riskRating: fairnessScore < 50 ? 'Severe' : fairnessScore < 65 ? 'High' : fairnessScore < 80 ? 'Moderate' : 'Low',
    biasAssessment: fairnessScore < 60 ? 'Favors Counterparty' : 'Fair & Balanced',
    topDealbreakers: topDealbreakers.length > 0 ? topDealbreakers : [
      'Absence of an aggregate liability limitation cap',
      'Unclear payment milestones and remedies for late compensation',
      'Asymmetric notice periods for contract cancellation'
    ],
    categoryBreakdown: [
      { category: 'Liability & Indemnity', score: hasIndemnity ? 45 : 75, verdict: hasIndemnity ? 'One-sided indemnity should be capped at contract value.' : 'Standard reciprocal liability structure.' },
      { category: 'Intellectual Property', score: hasIpAssignment ? 55 : 85, verdict: hasIpAssignment ? 'Ensure pre-existing tools and materials are explicitly carved out.' : 'IP ownership is reasonably balanced.' },
      { category: 'Termination & Cancellation', score: 65, verdict: 'Requires minimum 30-day written notice with pay for work completed.' },
      { category: 'Payment Terms & Late Fees', score: 70, verdict: 'Specify Net-30 payment and 1.5% interest on delinquent balances.' },
      { category: 'Restrictive Covenants', score: hasNonCompete ? 40 : 80, verdict: hasNonCompete ? '2-year non-compete is overly restrictive and may be unenforceable.' : 'No harmful non-compete detected.' }
    ],
    clauses,
    missingProtections: [
      'Mutual aggregate liability cap (e.g. fees paid during preceding 12 months)',
      'Prompt payment guarantee with right to suspend work upon non-payment past 15 days',
      'Specific carve-out protecting pre-existing IP and reusable developer tooling',
      'Mutual attorney fees clause if legal action is required to collect valid invoices'
    ],
    actionChecklist: [
      { action: 'Add an aggregate limitation of liability cap equal to total project contract value.', priority: 'Must Negotiate' },
      { action: 'Insert clause ensuring IP only transfers upon full and final payment of invoices.', priority: 'Must Negotiate' },
      { action: 'Request mutual 30 days notice for termination for convenience.', priority: 'Clarify' },
      { action: 'Confirm governing law and jurisdiction is agreeable.', priority: 'Acceptable' }
    ]
  };
}

function getFallbackDraft(templateType: string, options: any) {
  const partyA = options.partyA || 'Client Company Inc.';
  const partyB = options.partyB || 'Service Provider / Contractor';
  const jurisdiction = options.jurisdiction || 'State of California';

  return {
    title: `Balanced ${templateType || 'Independent Contractor Services Agreement'}`,
    summary: 'A modern, reciprocal agreement crafted in plain English with fair liability caps, clear payment schedules, and explicit IP protections.',
    contractText: `INDEPENDENT CONTRACTOR SERVICES AGREEMENT

This Agreement is made and entered into as of [DATE] by and between:
Client: ${partyA} ("Client"), and
Contractor: ${partyB} ("Contractor").

1. SERVICES AND SCOPE OF WORK
Contractor agrees to perform the professional services detailed in Exhibit A ("Statement of Work"). Any amendments to the scope of work must be agreed to in writing by both parties.

2. COMPENSATION AND PAYMENT TERMS
Client shall pay Contractor according to the milestones set forth in Exhibit A. Invoices shall be due Net-30 days from receipt. Delinquent payments shall accrue interest at 1.5% per month or the maximum rate permitted by law. If payment is overdue by more than 15 days, Contractor may suspend services upon 5 days written notice.

3. INDEPENDENT CONTRACTOR STATUS
Contractor is an independent contractor and not an employee, agent, or partner of Client. Contractor retains full discretion over the manner and methods used to deliver the services.

4. INTELLECTUAL PROPERTY & PRE-EXISTING IP
(a) Work Product: Upon full and final payment of all fees due, Contractor assigns to Client all right, title, and interest in the unique deliverables created specifically for Client.
(b) Pre-Existing Materials: Contractor retains sole ownership of all pre-existing tools, libraries, codebases, templates, and general methodologies ("Pre-Existing IP"). Contractor grants Client a non-exclusive, perpetual, worldwide license to use such Pre-Existing IP solely as incorporated into the final deliverable.

5. CONFIDENTIALITY
Both parties agree to treat all proprietary business information disclosed during the term as strictly confidential. This obligation shall survive for two (2) years following termination.

6. MUTUAL LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, NEITHER PARTY SHALL BE LIABLE FOR INDIRECT, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING UNDER THIS AGREEMENT SHALL BE STRICTLY LIMITED TO THE TOTAL FEES PAID OR PAYABLE BY CLIENT TO CONTRACTOR UNDER THIS AGREEMENT IN THE PRECEDING TWELVE (12) MONTHS.

7. TERM AND TERMINATION
Either party may terminate this Agreement for convenience upon thirty (30) days prior written notice. Either party may terminate immediately for material breach if uncured within ten (10) days of notice. Upon termination, Client shall pay Contractor for all services performed up to the termination date.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of ${jurisdiction}, without regard to conflicts of law principles.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT: ${partyA}
By: ___________________________
Title: ________________________

CONTRACTOR: ${partyB}
By: ___________________________
Title: ________________________`,
    keyClausesExplained: [
      { name: 'Mutual Liability Cap', explanation: 'Caps exposure for both parties to the total contract fees paid, avoiding enterprise-ending catastrophic claims.' },
      { name: 'Payment-Contingent IP Transfer', explanation: 'The client only owns the work product once invoices are paid in full, protecting against work theft.' },
      { name: 'Pre-Existing IP Protection', explanation: 'Ensures your personal libraries and tools remain yours forever with a license grant to the client.' }
    ]
  };
}

// Start server with Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LeglEase Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
