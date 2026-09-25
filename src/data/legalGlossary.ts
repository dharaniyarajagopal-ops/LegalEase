import { GlossaryItem } from '../types/legal';

export const LEGAL_GLOSSARY: GlossaryItem[] = [
  {
    id: 'indemnification',
    term: 'Indemnification (Hold Harmless)',
    category: 'Liability',
    pronunciation: 'in-dem-nuh-fuh-KAY-shun',
    plainEnglish: 'A promise to pay for someone else’s legal costs, defense lawyers, and court damages if a third party sues them over your work.',
    whyLawyersUseIt: 'To shift financial risk from a company onto the smaller contractor or partner so the company never has to pay legal fees.',
    theDanger: 'Without a dollar cap, you could be on the hook for millions of dollars in legal fees even if you only made $5,000 on the project.',
    howToNegotiate: 'Always demand that indemnification be mutual, limited to third-party claims arising from gross negligence, and capped at the total amount paid under the contract.',
    exampleSentence: 'Contractor agrees to indemnify and hold Client harmless from any claims or attorneys\' fees.'
  },
  {
    id: 'limitation-of-liability',
    term: 'Limitation of Liability (LoL)',
    category: 'Liability',
    plainEnglish: 'The maximum total dollar amount either party can ever be forced to pay in damages under the contract.',
    whyLawyersUseIt: 'To prevent unexpected catastrophic lawsuits that could bankrupt the company.',
    theDanger: 'If a client caps their liability to $100 but leaves your liability uncapped, they have virtually zero downside if they break the contract or lose your data.',
    howToNegotiate: 'Insist on a reciprocal 12-month fee cap (aggregate liability equal to fees paid in the past 12 months) for both sides.',
    exampleSentence: 'In no event shall either party’s total aggregate liability exceed the total fees paid under this Agreement in the preceding 12 months.'
  },
  {
    id: 'force-majeure',
    term: 'Force Majeure',
    category: 'Termination',
    pronunciation: 'forss ma-ZHUR',
    plainEnglish: 'An "Act of God" clause that excuses parties from missing deadlines due to unavoidable catastrophes (earthquakes, wars, government shutdowns, pandemics).',
    whyLawyersUseIt: 'To prevent breach-of-contract lawsuits when an event truly out of anyone\'s control halts operations.',
    theDanger: 'If drafted too broadly, a client could claim economic downturns or budget shortages as "force majeure" to freeze your payments.',
    howToNegotiate: 'Explicitly state that financial hardship, labor strikes of the party’s own workforce, or inability to pay money does not qualify as force majeure.',
    exampleSentence: 'Neither party shall be liable for delays caused by fires, floods, acts of war, or other events of force majeure.'
  },
  {
    id: 'work-made-for-hire',
    term: 'Work Made for Hire',
    category: 'Intellectual Property',
    plainEnglish: 'A statutory doctrine where the client is legally considered the original "author" and owner of the copyright from the split second it is created.',
    whyLawyersUseIt: 'Ensures the buyer holds full copyright immediately without having to ask the creator to sign separate transfer deeds later.',
    theDanger: 'If you use your own pre-existing code, design templates, or fonts, the client could claim they now own your entire toolkit.',
    howToNegotiate: 'Add a "Pre-Existing IP" carve-out: deliverables created specifically for the client are work-made-for-hire only upon full payment, but past tools remain yours.',
    exampleSentence: 'All deliverables created under this SOW shall be deemed work made for hire.'
  },
  {
    id: 'liquidated-damages',
    term: 'Liquidated Damages',
    category: 'Financial',
    plainEnglish: 'A pre-agreed fixed penalty amount that one party pays if they breach a specific rule (e.g., $500 per day of late delivery).',
    whyLawyersUseIt: 'Avoids having to prove exact financial losses in court by setting a fixed number in advance.',
    theDanger: 'If project delays are caused by the client taking forever to give feedback, you might still get penalized $500/day.',
    howToNegotiate: 'Make sure liquidated damages are the exclusive remedy (no additional lawsuits), and toll the clock whenever waiting on client approvals.',
    exampleSentence: 'Contractor shall pay $250 as liquidated damages for each calendar day completion is delayed.'
  },
  {
    id: 'severability',
    term: 'Severability',
    category: 'General',
    plainEnglish: 'If a judge declares one single sentence in the contract illegal or invalid, the rest of the contract remains in full effect.',
    whyLawyersUseIt: 'Prevents the entire contract from being thrown out of court over a single unlawful clause.',
    theDanger: 'Low danger. This is generally a standard boilerplate clause that protects both parties.',
    howToNegotiate: 'Standard clause. Generally safe to accept as drafted.',
    exampleSentence: 'If any provision of this Agreement is held invalid, the remaining provisions shall continue in full force.'
  },
  {
    id: 'merger-clause',
    term: 'Merger Clause (Entire Agreement)',
    category: 'General',
    plainEnglish: 'Declares that this written document is the entire agreement and supersedes all previous emails, phone calls, verbal promises, or pitch decks.',
    whyLawyersUseIt: 'To prevent one party from claiming: "Wait, you promised me a bonus on the phone last week!"',
    theDanger: 'Any oral guarantees or email promises made by the sales team are legally dead once you sign.',
    howToNegotiate: 'Ensure every oral promise or special concession discussed over email is explicitly typed into the final agreement or Statement of Work.',
    exampleSentence: 'This Agreement constitutes the entire understanding between the parties and supersedes all prior discussions.'
  },
  {
    id: 'joint-and-several',
    term: 'Joint and Several Liability',
    category: 'Liability',
    plainEnglish: 'If multiple people or partners sign together, the client can pursue ANY SINGLE ONE of you for 100% of the entire debt or damages.',
    whyLawyersUseIt: 'Creditors and landlords love this because they can simply sue the richest partner for the whole sum.',
    theDanger: 'If your co-founder or roommate skips town, the landlord can legally force you to pay 100% of their missing share.',
    howToNegotiate: 'Replace with "several liability" proportionate to each individual’s specific ownership percentage or defined share.',
    exampleSentence: 'Co-signers shall be jointly and severally liable for all lease obligations.'
  },
  {
    id: 'non-solicitation',
    term: 'Non-Solicitation Clause',
    category: 'Termination',
    plainEnglish: 'A rule banning you from hiring your client’s employees, or poaching their customers, for a set period (usually 1 to 2 years).',
    whyLawyersUseIt: 'Prevents contractors or employees from walking away with the company’s team or customer base.',
    theDanger: 'Broad clauses can prevent you from doing general public job postings or accepting work from clients who independently reach out to you.',
    howToNegotiate: 'Limit to 6–12 months, narrow it to people you directly worked with, and carve out general public advertisements and unsolicited inquiries.',
    exampleSentence: 'Consultant shall not solicit any employee of Company for 24 months post-termination.'
  },
  {
    id: 'governing-law',
    term: 'Governing Law & Forum Selection',
    category: 'Dispute',
    plainEnglish: 'Designates which state’s laws apply and which specific city’s courthouse you must travel to if a lawsuit happens.',
    whyLawyersUseIt: 'Gives the drafter "home-field advantage" so you have to hire out-of-state lawyers and fly across the country.',
    theDanger: 'If you are in Texas and the contract says "exclusive jurisdiction in New Castle County, Delaware", defending yourself will cost thousands just in travel.',
    howToNegotiate: 'Negotiate for mutual jurisdiction (where the defendant resides), or your home state/city.',
    exampleSentence: 'This Agreement shall be governed by the laws of the State of Delaware, with venue in Wilmington.'
  },
  {
    id: 'subrogation',
    term: 'Waiver of Subrogation',
    category: 'Liability',
    plainEnglish: 'Prevents your insurance company from suing the other party to recover money paid out for a claim.',
    whyLawyersUseIt: 'Common in commercial leases and building contracts so insurers cannot drag both parties into court after an accident.',
    theDanger: 'Some insurance policies void your coverage if you waive subrogation without telling them first.',
    howToNegotiate: 'Check with your business liability insurer to verify whether your policy allows standard mutual waivers of subrogation.',
    exampleSentence: 'Each party hereby waives all rights of subrogation against the other for insured property losses.'
  },
  {
    id: 'cure-period',
    term: 'Cure Period (Notice to Cure)',
    category: 'Termination',
    plainEnglish: 'A grace period (usually 10 to 30 days) after receiving written notice of a breach to fix the problem before the contract can be canceled.',
    whyLawyersUseIt: 'Ensures parties don’t get instantly terminated or sued over an inadvertent mistake or temporary glitch.',
    theDanger: 'Agreements without a cure period allow the counterparty to terminate immediately on a technicality without warning.',
    howToNegotiate: 'Always add a 30-day written notice and cure period for any non-payment or alleged breach of contract.',
    exampleSentence: 'Either party may terminate if the material breach remains uncured thirty (30) days after written notice.'
  }
];
