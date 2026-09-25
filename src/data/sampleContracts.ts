import { SampleContract } from '../types/legal';

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'freelance-msa',
    title: 'Technology Freelancer Master Services Agreement',
    category: 'Freelance & Consulting',
    description: 'A standard-looking client agreement containing severe unlimited indemnification, delayed 90-day payments, and overreaching IP assignment.',
    defaultPerspective: 'Freelancer / Service Provider',
    content: `MASTER SERVICES AGREEMENT (MSA)

This Master Services Agreement ("Agreement") is entered into as of October 1, 2026, by and between Apex Global Solutions LLC ("Client"), with its principal place of business at 500 Enterprise Way, Suite 400, Wilmington, DE, and Contractor ("Consultant").

RECITALS
WHEREAS, Client wishes to engage Consultant to perform specialized software engineering, design, and technical consulting services; and
WHEREAS, Consultant represents that it possesses the requisite expertise and agrees to provide such services pursuant to the terms herein;

NOW, THEREFORE, the parties agree as follows:

1. STATEMENT OF WORK & SCOPE OF SERVICES
Consultant shall deliver services and deliverables as detailed in individual Statements of Work ("SOW"). Any timeline or milestone dates specified in an SOW shall be considered strict time-is-of-the-essence deadlines. Consultant shall not subcontract or assign any part of the services without prior written approval from Client.

2. PAYMENT TERMS & AUDIT RIGHTS
Client shall compensate Consultant within ninety (90) days following receipt and formal technical verification of an undisputed invoice ("Net-90"). Client reserves the right to withhold any invoice without penalty if Client, in its sole subjective discretion, deems the deliverables unsatisfactory. Client may audit Consultant’s personal computers, repositories, and financial records upon twenty-four (24) hours notice to verify billing hours. No interest or late fees shall accrue on any withheld or delayed payments.

3. INTELLECTUAL PROPERTY & ASSIGNMENT OF ALL INVENTIONS
(a) Work for Hire: Consultant agrees that all work product, source code, designs, algorithms, formulas, documentation, and discoveries developed, conceived, or reduced to practice during the term of this Agreement shall be deemed "work made for hire" and shall immediately vest solely and exclusively with Client.
(b) Comprehensive Assignment: Consultant hereby irrevocably assigns, transfers, and conveys to Client all right, title, and interest worldwide in and to all such work product, including all patents, copyrights, trade secrets, and moral rights therein. Consultant warrants that no pre-existing tools, open-source libraries, or proprietary developer scripts will be utilized without prior express written license granted to Client free of charge in perpetuity.

4. UNLIMITED INDEMNIFICATION & DEFENSE OBLIGATIONS
Consultant shall defend, indemnify, and hold harmless Client, its parent companies, affiliates, officers, directors, employees, agents, and successors from and against any and all claims, demands, liabilities, suits, losses, judgments, damages, fines, penalties, costs, and expenses (including all outside attorneys' fees and expert witness costs) arising out of or related to:
(i) any alleged or actual infringement of any patent, trademark, copyright, or trade secret;
(ii) any breach or alleged breach of any representation, warranty, or covenant under this Agreement;
(iii) any negligent act, omission, or willful misconduct of Consultant; and
(iv) any third-party claim arising out of Client's commercial use of the Deliverables.
Consultant’s defense and indemnification obligations under this Section are uncapped, unlimited in duration, and shall survive termination indefinitely.

5. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY LAW, CLIENT SHALL NOT BE LIABLE UNDER ANY CIRCUMSTANCES FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, NOR FOR ANY LOSS OF PROFIT OR DATA. IN NO EVENT SHALL CLIENT'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED ONE HUNDRED DOLLARS ($100.00 USD).

6. NON-SOLICITATION AND RESTRICTIVE COVENANTS
During the term of this Agreement and for a period of twenty-four (24) months following its termination for any reason, Consultant shall not directly or indirectly:
(a) Solicit, recruit, or attempt to hire any employee, vendor, or independent contractor of Client; or
(b) Solicit, engage, or perform services for any client or prospective customer of Client with whom Consultant had contact during the term.

7. TERMINATION & CANCELLATION
Client may terminate this Agreement or any active SOW at any time, with or without cause, immediately upon written notice, without incurring any cancellation fees or payment obligations for uncompleted milestones. Consultant may only terminate this Agreement for material breach upon sixty (60) days prior written notice, during which Consultant must continue full performance.

8. GOVERNING LAW & MANDATORY ARBITRATION
This Agreement shall be governed by the laws of the State of Delaware without regard to choice of law principles. Any dispute arising under this Agreement shall be settled exclusively through binding arbitration administered by the American Arbitration Association in New Castle County, Delaware. Consultant expressly waives all rights to a jury trial or class action proceedings.

IN WITNESS WHEREOF, the parties hereto have executed this Master Services Agreement as of the Effective Date.`,
    precomputedAnalysis: {
      contractTitle: 'Apex Global Solutions - Freelancer Master Services Agreement',
      documentType: 'Independent Contractor / Master Services Agreement',
      overallSummary: 'This contract is heavily one-sided in favor of the Client. It exposes the freelancer to uncapped personal indemnification, imposes harsh Net-90 payment terms with arbitrary withholding rights, limits client liability to $100, and binds the freelancer to a 2-year non-solicitation restriction.',
      fairnessScore: 38,
      riskRating: 'Severe',
      biasAssessment: 'Extremely One-Sided',
      topDealbreakers: [
        'Section 4: Unilateral uncapped indemnification for third-party claims with no liability limit.',
        'Section 5: Client total liability is artificially capped at $100 while your liability is completely unlimited.',
        'Section 2: Net-90 payment terms allowing arbitrary client withholding without late interest fees.',
        'Section 3: Broad IP transfer claiming pre-existing tooling without protective carve-outs.'
      ],
      categoryBreakdown: [
        { category: 'Liability & Indemnity', score: 20, verdict: 'Extreme hazard. You assume 100% uncapped defense costs for client commercial use.' },
        { category: 'Payment Terms & Rights', score: 35, verdict: 'Net-90 days is unacceptable for freelancers; unilateral withholding right is abusive.' },
        { category: 'Intellectual Property', score: 45, verdict: 'Lacks standard background IP carve-out; risks forfeiting your private code library.' },
        { category: 'Termination Asymmetry', score: 40, verdict: 'Client can cancel immediately without paying; you are trapped into 60 days mandatory notice.' },
        { category: 'Restrictive Covenants', score: 50, verdict: '24-month non-solicitation of clients is overly broad and stifles career mobility.' }
      ],
      clauses: [
        {
          id: 'clause-indemnity',
          title: 'Uncapped Unilateral Indemnification',
          sectionNumber: 'Section 4',
          originalExcerpt: 'Consultant shall defend, indemnify, and hold harmless Client... from and against any and all claims, damages, costs, and expenses (including attorneys fees)... Consultant’s obligations are uncapped, unlimited in duration, and shall survive indefinitely.',
          plainEnglish: 'If anyone sues the client over the software you built or how the client uses it, you must pay all of the client’s legal defense bills and any damages awarded, out of your own pocket without any dollar ceiling.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Covers client commercial use and has no monetary cap. A single third-party patent troll claim could bankrupt your consulting business.',
          suggestedRedline: 'Each party shall defend and indemnify the other against third-party claims solely to the extent arising directly from gross negligence or willful infringement, capped at the total fees paid under the applicable SOW.'
        },
        {
          id: 'clause-liability-cap',
          title: 'Asymmetric $100 Liability Cap',
          sectionNumber: 'Section 5',
          originalExcerpt: 'IN NO EVENT SHALL CLIENT\'S TOTAL CUMULATIVE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT EXCEED ONE HUNDRED DOLLARS ($100.00 USD).',
          plainEnglish: 'Even if the client breaches the agreement, fails to pay, or destroys your data, the most you can ever win in a legal dispute is $100.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'The client protects itself with a near-zero $100 cap while leaving your liability completely uncapped.',
          suggestedRedline: 'Except for gross negligence or willful misconduct, each party’s aggregate liability under this Agreement shall be limited to the total fees paid by Client to Consultant in the 12 months preceding the claim.'
        },
        {
          id: 'clause-payment',
          title: 'Net-90 Payment Terms with Discretionary Withholding',
          sectionNumber: 'Section 2',
          originalExcerpt: 'Client shall compensate Consultant within ninety (90) days following receipt... Client reserves the right to withhold any invoice without penalty if Client, in its sole subjective discretion, deems the deliverables unsatisfactory.',
          plainEnglish: 'You may have to wait 3 full months to get paid after submitting an invoice, and the client can unilaterally refuse to pay if they subjectively decide they don’t like the work.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Net-90 forces you to act as an interest-free bank for the client, and "sole subjective discretion" creates an easy loophole to avoid paying.',
          suggestedRedline: 'Invoices shall be payable Net-30 days. Invoices may only be disputed in good faith with written notice within 10 business days detailing objective technical deficiencies.'
        },
        {
          id: 'clause-ip',
          title: 'All Inventions Assignment & No Pre-Existing IP Carve-Out',
          sectionNumber: 'Section 3',
          originalExcerpt: 'Consultant warrants that no pre-existing tools, open-source libraries, or proprietary developer scripts will be utilized without prior express written license granted to Client free of charge in perpetuity.',
          plainEnglish: 'You cannot use your own standard starter kits, frameworks, or past templates unless you give the client a permanent, free license to them.',
          riskLevel: 'medium',
          favors: 'Counterparty',
          hiddenTrap: 'Consultants rely on re-usable frameworks. This clause either blocks you from using your toolkit or takes away your proprietary rights.',
          suggestedRedline: 'Consultant retains all rights, title, and ownership in its Pre-Existing Intellectual Property and general reusable developer tools, granting Client a non-exclusive license to use them solely as part of the finished Deliverable.'
        },
        {
          id: 'clause-termination',
          title: 'Immediate Client Cancellation vs 60-Day Contractor Lock-in',
          sectionNumber: 'Section 7',
          originalExcerpt: 'Client may terminate this Agreement... immediately upon written notice, without incurring any cancellation fees... Consultant may only terminate upon sixty (60) days prior written notice.',
          plainEnglish: 'The client can fire you with zero notice and zero kill fee, but you cannot quit or take on competing projects without waiting 60 days.',
          riskLevel: 'medium',
          favors: 'Counterparty',
          hiddenTrap: 'Leaves you vulnerable to sudden income loss after turning down other lucrative contracts.',
          suggestedRedline: 'Either party may terminate this Agreement or any SOW for convenience upon thirty (30) days prior written notice, with Client paying for all work completed through the termination date.'
        }
      ],
      missingProtections: [
        'Mutual aggregate liability cap tied to 12 months of billings.',
        'Late payment interest penalty (standard 1.5% per month).',
        'Right to suspend services if invoices remain unpaid past 15 days.',
        'Payment-contingent IP transfer: copyright only transfers once invoice is paid in full.'
      ],
      actionChecklist: [
        { action: 'Require mutual aggregate liability cap equal to total project fee.', priority: 'Must Negotiate' },
        { action: 'Change payment terms from Net-90 to Net-30 with 1.5% late fee.', priority: 'Must Negotiate' },
        { action: 'Insert explicit carve-out for Pre-Existing Intellectual Property.', priority: 'Must Negotiate' },
        { action: 'Shorten non-solicitation from 24 months to 6 months post-termination.', priority: 'Clarify' },
        { action: 'Ensure client covers travel expenses and approved software licenses.', priority: 'Acceptable' }
      ]
    }
  },
  {
    id: 'residential-lease',
    title: 'Standard Residential Apartment Lease Agreement',
    category: 'Real Estate & Housing',
    description: 'A multi-page lease agreement with automatic 10% annual rent escalations, intrusive landlord entry rules, and total tenant repair liability.',
    defaultPerspective: 'Tenant / Renter',
    content: `RESIDENTIAL APARTMENT LEASE AGREEMENT

PARTIES:
This Lease Agreement is entered into by Highline Properties Management ("Landlord") and Resident ("Tenant") for the premises located at Unit 4B, 820 Oak Street ("Premises").

1. TERM & AUTOMATIC RENEWAL
The initial term shall begin August 1, 2026, and end July 31, 2027. Unless Tenant provides written notice of non-renewal via certified mail at least ninety (90) days prior to expiration, this Lease shall automatically renew for another one-year term. Upon any renewal, Landlord reserves the absolute right to escalate the monthly rent by ten percent (10%) without requirement of prior tenant consent.

2. SECURITY DEPOSIT FORFEITURE & CHARGES
Tenant shall deposit the sum of $3,500 as a security deposit. Landlord may deduct from the security deposit for any paint blemishes, minor picture-hanging nail holes, regular carpet cleaning, and a mandatory non-negotiable $450 "administrative move-out re-keying fee." Any remaining deposit shall be returned within sixty (60) days after vacancy.

3. MAINTENANCE, REPAIRS, AND HVAC EXPENSES
Tenant shall be strictly responsible for the maintenance and repair of all fixtures, plumbing stoppages, window glass, and heating/air conditioning (HVAC) systems. Tenant shall bear the full cost of all repairs up to $500 per incident, regardless of whether the malfunction was caused by ordinary wear and tear or pre-existing equipment age.

4. LANDLORD RIGHT OF ENTRY
Landlord and its designated contractors, agents, and prospective buyers shall have the unrestricted right to enter the Premises at any time between 7:00 AM and 10:00 PM upon two (2) hours electronic notification, or immediately without notice in any event deemed an urgent administrative inspection by Landlord.

5. GUESTS AND EXTENDED VISITATION RESTRICTIONS
No overnight guest may remain on the Premises for more than two (2) consecutive nights or more than five (5) total nights in any calendar month without prior written approval and payment of a $50 per-night unauthorized guest surcharge. Violation of this provision shall constitute an incurable material breach entitling Landlord to immediate eviction.

6. WAIVER OF JURY TRIAL & SUBROGATION
Tenant waives all rights to a trial by jury in any action arising out of this Lease. Landlord shall not be liable for any water leaks, mold infestation, electrical fires, or burglary occurring within the Premises, and Tenant’s renter's insurance shall hold Landlord harmless.`,
    precomputedAnalysis: {
      contractTitle: 'Highline Properties - Residential Apartment Lease',
      documentType: 'Residential Lease Agreement',
      overallSummary: 'This lease contains aggressive landlord-protective terms including an automatic 10% rent hike upon renewal, an unreasonably long 90-day non-renewal notice window, tenant liability for HVAC repairs, and unrestricted 2-hour entry rights.',
      fairnessScore: 42,
      riskRating: 'High',
      biasAssessment: 'Favors Counterparty',
      topDealbreakers: [
        'Section 3: Tenant must pay up to $500 for HVAC repairs caused by ordinary wear and tear.',
        'Section 1: Automatic 10% rent escalation with 90-day certified mail notice requirement.',
        'Section 4: Landlord entry with only 2 hours notice, infringing on quiet enjoyment.',
        'Section 5: Strict guest limit of 2 consecutive nights with $50/night fines.'
      ],
      categoryBreakdown: [
        { category: 'Maintenance & Repairs', score: 30, verdict: 'Shifting HVAC and wear-and-tear repairs to the tenant violates standard residential norms.' },
        { category: 'Renewal & Rent Hikes', score: 40, verdict: '90-day certified notice is a trap; automatic 10% hike exceeds typical local rent caps.' },
        { category: 'Privacy & Entry Rights', score: 35, verdict: '2-hour notice is intrusive; standard law requires 24 to 48 hours notice.' },
        { category: 'Deposit Return & Fees', score: 50, verdict: '$450 re-key fee and wear-and-tear deductions are predatory.' },
        { category: 'Guest Restrictions', score: 55, verdict: 'Overnight guest monitoring is overly intrusive for adult tenants.' }
      ],
      clauses: [
        {
          id: 'lease-hvac',
          title: 'Tenant Pays for HVAC and Wear-and-Tear Repairs',
          sectionNumber: 'Section 3',
          originalExcerpt: 'Tenant shall bear the full cost of all repairs up to $500 per incident, regardless of whether the malfunction was caused by ordinary wear and tear or pre-existing equipment age.',
          plainEnglish: 'If the heating or AC unit breaks down due to old age or normal usage, you have to pay the first $500 of the repair bill every single time.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Landlords are legally responsible for maintaining habitability (heating, plumbing). Shifting this to you makes you pay for their property depreciation.',
          suggestedRedline: 'Landlord shall be solely responsible for all repairs to major systems (HVAC, plumbing, electrical) and repairs resulting from ordinary wear and tear. Tenant shall only be responsible for damage caused by Tenant’s negligence.'
        },
        {
          id: 'lease-entry',
          title: '2-Hour Notice for Landlord Entry',
          sectionNumber: 'Section 4',
          originalExcerpt: 'Landlord... shall have the unrestricted right to enter the Premises... upon two (2) hours electronic notification...',
          plainEnglish: 'The landlord can send you a text and enter your apartment just 2 hours later, disrupting your privacy and quiet enjoyment.',
          riskLevel: 'medium',
          favors: 'Counterparty',
          hiddenTrap: '2 hours does not give you time to prepare or be present during inspections.',
          suggestedRedline: 'Landlord shall provide at least twenty-four (24) hours written notice prior to entering the Premises for non-emergency inspections, scheduled during normal business hours.'
        },
        {
          id: 'lease-renewal',
          title: 'Auto-Renewal with 10% Rent Escalation',
          sectionNumber: 'Section 1',
          originalExcerpt: 'Unless Tenant provides written notice... at least ninety (90) days prior... this Lease shall automatically renew... Landlord reserves the absolute right to escalate the monthly rent by ten percent (10%).',
          plainEnglish: 'If you do not send a certified letter 3 months before your lease ends, you are locked in for another full year with an automatic 10% rent increase.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Missing the 90-day window by even one day locks you in for 12 months at hundreds of dollars more per month.',
          suggestedRedline: 'Lease shall transition to a month-to-month tenancy upon expiration with thirty (30) days written notice of termination. Any rent increase shall be communicated in writing at least 60 days prior.'
        }
      ],
      missingProtections: [
        'Clear itemized receipt requirement for security deposit deductions within 21 days.',
        'Warranty of habitability guarantee (landlord must fix water/heat within 48 hours).',
        'Right to sublet or assign lease with reasonable landlord consent.',
        'Standard 24-hour advance notice for landlord entry.'
      ],
      actionChecklist: [
        { action: 'Delete $500 tenant HVAC repair deductible for ordinary wear and tear.', priority: 'Must Negotiate' },
        { action: 'Increase landlord entry notice requirement from 2 hours to 24 hours.', priority: 'Must Negotiate' },
        { action: 'Change 90-day non-renewal notice to 30 or 60 days.', priority: 'Clarify' },
        { action: 'Remove the mandatory $450 administrative re-keying fee.', priority: 'Clarify' }
      ]
    }
  },
  {
    id: 'saas-tos',
    title: 'B2B Cloud SaaS Terms of Service & Privacy Policy',
    category: 'Software & Technology',
    description: 'Enterprise cloud terms with mandatory AI training on customer private data, unilateral price modifications, and full class-action arbitration waivers.',
    defaultPerspective: 'Customer / Business User',
    content: `ENTERPRISE CLOUD PLATFORM TERMS OF SERVICE (ToS)

1. ACCESS AND LICENSE GRANT
CloudCorp ("Provider") grants Subscriber ("Customer") a revocable, non-exclusive license to access the SaaS Platform during the Subscription Term. Provider reserves the right to modify, degrade, or deprecate any feature or functionality of the platform at any time without prior notice.

2. CUSTOMER DATA, TELEMETRY, AND AI MODEL TRAINING
Customer retains ownership of raw Customer Data uploaded to the platform. However, Customer grants Provider a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, process, aggregate, and train proprietary artificial intelligence, machine learning models, and automated algorithmic systems on all Customer Data, workflows, and prompts.

3. UNILATERAL PRICE INCREASES AND AUTO-RENEWAL
Subscriptions renew automatically for successive 12-month periods unless canceled in writing at least sixty (60) days prior to the expiration of the current term. Provider may increase subscription fees for any renewal term by up to fifteen percent (15%) upon thirty (30) days notice.

4. SERVICE LEVEL AGREEMENT & COMPLETE WARRANTY DISCLAIMER
THE PLATFORM IS PROVIDED STRICTLY "AS IS" AND "AS AVAILABLE." PROVIDER DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. PROVIDER DOES NOT GUARANTEE 99.9% UPTIME. IN THE EVENT OF SYSTEM OUTAGES, CUSTOMER’S SOLE AND EXCLUSIVE REMEDY SHALL BE A SERVICE CREDIT NOT EXCEEDING 5% OF THE MONTHLY FEE.

5. LIMITATION OF LIABILITY
PROVIDER’S AGGREGATE LIABILITY FOR ALL CLAIMS OF ANY KIND SHALL BE CAPPED AT THE FEES PAID BY CUSTOMER IN THE ONE (1) MONTH PRECEDING THE CLAIM. PROVIDER SHALL NOT BE LIABLE FOR ANY DATA LOSS, RANSOMWARE DAMAGE, OR BUSINESS INTERRUPTION.

6. MANDATORY ARBITRATION AND CLASS ACTION WAIVER
Customer agrees that all disputes shall be resolved by private binding arbitration in Santa Clara, California, and waives any right to participate in a class action lawsuit or representative proceeding.`,
    precomputedAnalysis: {
      contractTitle: 'CloudCorp Enterprise SaaS Terms of Service',
      documentType: 'B2B SaaS Terms of Service',
      overallSummary: 'These SaaS terms allow the provider to train AI models on your proprietary company data, increase fees by 15% annually on auto-renew, limit outage credits to 5%, and caps all vendor liability to just 1 month of subscription fees.',
      fairnessScore: 48,
      riskRating: 'High',
      biasAssessment: 'Favors Counterparty',
      topDealbreakers: [
        'Section 2: Irrevocable license allowing provider to train AI models on confidential customer data.',
        'Section 5: Provider liability capped at 1 month of fees, offering virtually zero recovery for data breaches.',
        'Section 3: Auto-renewal with 60-day cancellation window and unilateral 15% price increases.'
      ],
      categoryBreakdown: [
        { category: 'Data Privacy & AI Rights', score: 30, verdict: 'Severe risk: grants provider unrestricted rights to ingest your confidential data into AI models.' },
        { category: 'Liability & Outages', score: 40, verdict: '1-month fee cap is grossly inadequate for enterprise data loss or prolonged downtime.' },
        { category: 'Pricing & Renewal', score: 55, verdict: 'Auto-renew with 60-day notice and 15% annual price escalation.' },
        { category: 'Warranties & SLAs', score: 60, verdict: 'Weak uptime guarantees with negligible 5% service credit.' }
      ],
      clauses: [
        {
          id: 'saas-ai-training',
          title: 'Perpetual License to Train AI on Customer Data',
          sectionNumber: 'Section 2',
          originalExcerpt: 'Customer grants Provider a perpetual, irrevocable, worldwide, royalty-free license to use, reproduce, process, aggregate, and train proprietary artificial intelligence, machine learning models... on all Customer Data.',
          plainEnglish: 'The software company can take your private business documents, trade secrets, and customer info and use them to train their AI models forever.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Once proprietary data is ingested into an LLM or neural network weights, it cannot be deleted or untangled.',
          suggestedRedline: 'Provider shall not access, process, or utilize Customer Data to train, fine-tune, or develop any machine learning or artificial intelligence models without Customer’s explicit prior written consent.'
        },
        {
          id: 'saas-liability',
          title: 'Liability Capped at 1 Month of Fees',
          sectionNumber: 'Section 5',
          originalExcerpt: 'PROVIDER’S AGGREGATE LIABILITY... SHALL BE CAPPED AT THE FEES PAID BY CUSTOMER IN THE ONE (1) MONTH PRECEDING THE CLAIM.',
          plainEnglish: 'If the software leaks your entire customer database or causes catastrophic business disruption, you can only recover the price of one single month’s subscription.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Enterprise data breaches cost hundreds of thousands of dollars, making a 1-month cap practically worthless.',
          suggestedRedline: 'Provider’s total liability shall be capped at 12 months of fees paid, with a separate super-cap of $1,000,000 for breaches of confidentiality, data security, or privacy laws.'
        }
      ],
      missingProtections: [
        'Explicit Enterprise Data Processing Addendum (DPA) under GDPR/CCPA.',
        'Data deletion upon termination within 30 days and exportable backup.',
        'Standard 99.9% uptime SLA with escalating credits up to 50% for extended outages.',
        'Notification of security incidents within 48 hours.'
      ],
      actionChecklist: [
        { action: 'Strike out AI/ML training license on Customer Data.', priority: 'Must Negotiate' },
        { action: 'Increase liability cap from 1 month to 12 months of fees.', priority: 'Must Negotiate' },
        { action: 'Require 60-day advance notice for price increases with right to terminate.', priority: 'Clarify' }
      ]
    }
  },
  {
    id: 'startup-employment',
    title: 'Tech Startup Employment & Inventions Assignment Agreement',
    category: 'Employment & HR',
    description: 'An employment offer agreement with an overly broad moonlighting ban, worldwide 18-month non-compete, and claiming off-hours personal projects.',
    defaultPerspective: 'Employee / Candidate',
    content: `EMPLOYMENT, CONFIDENTIALITY, AND INVENTIONS AGREEMENT

This Agreement is made by Nexus Innovations Inc. ("Company") and Employee ("Employee").

1. DUTIES AND DEVOTION OF FULL TIME
Employee agrees to devote their entire productive time, attention, and energies exclusively to the business of the Company. Employee shall not, during employment, engage in any other business activities, consulting, open-source programming, advisory roles, or freelance work ("moonlighting"), whether or not pursued for profit or outside normal working hours, without prior written approval.

2. ASSIGNMENT OF ALL INVENTIONS & OFF-HOURS WORK
Employee agrees that any and all ideas, inventions, applications, code, software, algorithms, and designs authored, created, or conceived by Employee during the period of employment—whether created on Company equipment or Employee’s own personal devices, whether during working hours or during evenings and weekends—shall be the sole property of Company.

3. 18-MONTH WORLDWIDE NON-COMPETE COVENANT
For eighteen (18) months following the termination of employment for any reason (voluntary or involuntary), Employee shall not directly or indirectly, anywhere in the world, participate in, advise, invest in, or work for any company, startup, or entity that operates in a line of business similar to or competitive with any product developed or planned by Company.

4. NON-DISPARAGEMENT
Employee agrees never to make any negative, critical, or disparaging statements regarding Company, its founders, products, or management, publicly or privately, in perpetuity.

5. AT-WILL EMPLOYMENT & INVENTIONS DISCLOSURE
Employment is strictly at-will. Company may terminate Employee at any time for any reason without severance.`,
    precomputedAnalysis: {
      contractTitle: 'Nexus Innovations - Employment & Inventions Agreement',
      documentType: 'Full-Time Employment Agreement',
      overallSummary: 'This employment agreement is extremely restrictive: it claims full ownership of all side projects made on your own personal time/laptops, imposes a worldwide 18-month non-compete, and strictly bans any outside consulting or open source contributions.',
      fairnessScore: 35,
      riskRating: 'Severe',
      biasAssessment: 'Extremely One-Sided',
      topDealbreakers: [
        'Section 2: Company claims ownership of personal side projects built on your own time and devices.',
        'Section 3: Worldwide 18-month non-compete prevents you from working in your tech domain.',
        'Section 1: Complete ban on moonlighting, freelance, or open-source software contributions.'
      ],
      categoryBreakdown: [
        { category: 'Intellectual Property & Side Projects', score: 25, verdict: 'Overreaches statutory limits by claiming weekend personal projects.' },
        { category: 'Non-Compete Restrictions', score: 30, verdict: '18-month worldwide non-compete is legally suspect and career-limiting.' },
        { category: 'Outside Activities & Moonlighting', score: 45, verdict: 'Total prohibition on open source or non-conflicting hobby projects.' },
        { category: 'Post-Employment Covenants', score: 50, verdict: 'Perpetual one-sided non-disparagement restricts basic honest feedback.' }
      ],
      clauses: [
        {
          id: 'emp-inventions',
          title: 'Ownership of Personal Off-Hours Inventions',
          sectionNumber: 'Section 2',
          originalExcerpt: 'Employee agrees that all ideas, inventions, applications, code... whether created on Company equipment or Employee’s own personal devices, whether during working hours or during evenings and weekends—shall be the sole property of Company.',
          plainEnglish: 'The company claims ownership of your weekend hobbies, indie apps, or personal side code, even if built on your own personal laptop without company resources.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Most states (e.g., California Labor Code § 2870) protect personal inventions developed on your own time that do not relate to company business. This clause ignores those protections.',
          suggestedRedline: 'Inventions developed entirely on Employee’s own time, without using Company equipment or confidential information, and which do not relate directly to the Company’s actual business, shall remain Employee’s sole property.'
        },
        {
          id: 'emp-non-compete',
          title: '18-Month Worldwide Non-Compete',
          sectionNumber: 'Section 3',
          originalExcerpt: 'For eighteen (18) months following... termination... Employee shall not directly or indirectly, anywhere in the world, participate in, advise, invest in, or work for any company... similar to or competitive with Company.',
          plainEnglish: 'If you leave or are laid off, you cannot work in your field of expertise for 1.5 years anywhere in the world without violating the agreement.',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'In many jurisdictions (e.g. CA, NY, FTC guidelines), broad non-competes are unenforceable or heavily curtailed, but this can still be used to intimidate you or threaten new employers.',
          suggestedRedline: 'Strike out Section 3 in its entirety, or replace with standard non-solicitation of direct co-workers for 6 months.'
        }
      ],
      missingProtections: [
        'Prior Inventions Schedule (Exhibit A) to register your existing apps/patents so the company cannot claim them.',
        'Statutory exclusion clause for personal off-duty inventions.',
        'Mutual non-disparagement (company management also agrees not to badmouth you to future employers).',
        'Severance protection in event of termination without cause.'
      ],
      actionChecklist: [
        { action: 'Insert California-standard Labor Code carve-out for personal off-duty inventions.', priority: 'Must Negotiate' },
        { action: 'Delete or severely narrow the 18-month worldwide non-compete.', priority: 'Must Negotiate' },
        { action: 'Attach Exhibit of Prior Inventions listing all your existing repositories and websites.', priority: 'Must Negotiate' },
        { action: 'Make non-disparagement mutual.', priority: 'Clarify' }
      ]
    }
  },
  {
    id: 'mutual-nda',
    title: 'Mutual Non-Disclosure Agreement (with Unilateral Traps)',
    category: 'Confidentiality & Partnerships',
    description: 'A mutual NDA that conceals asymmetric survival terms, vague definition of exclusions, and a broad residual knowledge clause.',
    defaultPerspective: 'Disclosing Party / Partner',
    content: `MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is dated September 15, 2026, by and between Horizon Ventures LLC ("Horizon") and Collaborator ("Partner").

1. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" shall mean all non-public technical, commercial, financial, and strategic information disclosed by either party, whether orally or in writing. Any oral disclosure must be marked as confidential in writing within thirty (30) days to qualify for protection.

2. OBLIGATIONS OF NON-USE AND NON-DISCLOSURE
Each party agrees to hold the other’s Confidential Information in strict confidence and use it solely for evaluating a potential commercial partnership ("Purpose").

3. RESIDUALS CLAUSE (UNILATERAL EXCLUSION)
Notwithstanding anything to the contrary herein, Horizon’s employees, directors, and contractors shall be free to use any ideas, concepts, know-how, or techniques retained in their unaided mental memories ("Residuals") for any purpose, including the independent development of competing products, without obligation or royalty to Partner.

4. TERM AND INDEFINITE SURVIVAL OF TRADE SECRETS
This Agreement shall expire one (1) year from the date hereof. However, the obligations of confidentiality with respect to any information deemed a trade secret or technical algorithm shall survive perpetually for eternity.

5. REMEDIES AND INJUNCTIVE RELIEF
The parties acknowledge that unauthorized disclosure causes irreparable harm for which monetary damages are inadequate, entitling the disclosing party to immediate injunctive relief. Partner shall reimburse Horizon for all legal fees incurred in enforcing this Agreement.`,
    precomputedAnalysis: {
      contractTitle: 'Horizon Ventures - Mutual Non-Disclosure Agreement',
      documentType: 'Non-Disclosure Agreement (NDA)',
      overallSummary: 'While labeled "Mutual", this NDA contains a dangerous unilateral Residuals Clause that allows the counterparty to use concepts memorized by their staff to build competing products without paying you.',
      fairnessScore: 54,
      riskRating: 'Moderate',
      biasAssessment: 'Favors Counterparty',
      topDealbreakers: [
        'Section 3: Residuals Clause allows Horizon to use memorized trade secrets to develop competing products.',
        'Section 5: One-sided attorney fee reimbursement clause that only forces Partner to pay Horizon’s legal fees.'
      ],
      categoryBreakdown: [
        { category: 'Residuals & Memory Loopholes', score: 35, verdict: 'Residuals clause essentially legalizes intellectual property copying.' },
        { category: 'Confidentiality Duration', score: 65, verdict: 'Perpetual trade secret survival is standard but needs clear definition.' },
        { category: 'Enforcement & Legal Fees', score: 50, verdict: 'One-sided legal fee reimbursement favors Horizon.' }
      ],
      clauses: [
        {
          id: 'nda-residuals',
          title: 'Unilateral Residuals Clause',
          sectionNumber: 'Section 3',
          originalExcerpt: 'Horizon’s employees... shall be free to use any ideas, concepts, know-how, or techniques retained in their unaided mental memories ("Residuals") for any purpose, including the independent development of competing products...',
          plainEnglish: 'The other company can listen to your pitch, memorize your architecture and ideas, and then legally build a copycat product because it was in their staff\'s "mental memory".',
          riskLevel: 'high',
          favors: 'Counterparty',
          hiddenTrap: 'Residuals clauses are the #1 way venture funds and large enterprises absorb startup ideas without IP infringement claims.',
          suggestedRedline: 'Strike Section 3 in its entirety, or make the residual rights strictly mutual and subject to valid patent and copyright protections.'
        },
        {
          id: 'nda-fees',
          title: 'Unilateral Legal Fee Reimbursement',
          sectionNumber: 'Section 5',
          originalExcerpt: 'Partner shall reimburse Horizon for all legal fees incurred in enforcing this Agreement.',
          plainEnglish: 'If Horizon takes you to court, you have to pay their attorney fees, but they do not have to pay yours if you win.',
          riskLevel: 'medium',
          favors: 'Counterparty',
          hiddenTrap: 'One-sided fee shifting gives the counterparty leverage to bully you with legal threats.',
          suggestedRedline: 'In the event of litigation arising under this Agreement, the prevailing party shall be entitled to recover reasonable attorneys’ fees and costs from the non-prevailing party.'
        }
      ],
      missingProtections: [
        'Mutual prevailing party attorney fee recovery.',
        'Exclusion for information independently developed without reference to confidential disclosure.',
        'Written marking requirement should apply symmetrically to both parties.'
      ],
      actionChecklist: [
        { action: 'Remove the unilateral Residuals clause completely.', priority: 'Must Negotiate' },
        { action: 'Make the legal fees clause mutual for the prevailing party.', priority: 'Must Negotiate' },
        { action: 'Set a definitive 3-year or 5-year expiration for non-trade secret confidentiality.', priority: 'Acceptable' }
      ]
    }
  }
];
