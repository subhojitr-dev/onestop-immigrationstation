/**
 * lib/questionnaire/green_card.ts
 *
 * Employment-Based Green Card (Permanent Residence) intake questionnaire.
 *
 * Who fills this:
 *   BENEFICIARY fills:
 *     - Personal / passport / family info
 *     - Immigration history
 *     - Education and work history
 *     - Documents they have
 *
 *   SPONSOR/EMPLOYER fills (collected separately or by attorney):
 *     - EIN, gross income, employee count, ability to pay evidence
 *     - NAICS code — REMOVED (attorney determines this)
 *
 *   ATTORNEY determines:
 *     - EB category (EB-1, EB-2, EB-3) — depends on credentials + job
 *     - Priority date strategy
 *     - NAICS / SOC codes for PERM labor cert
 *     - Whether NIW (National Interest Waiver) applies
 *
 * USCIS forms:
 *   - I-140 (Immigrant Petition for Alien Workers) — employer files
 *   - I-485 (Application to Register Permanent Residence) — beneficiary files if in US
 *   - I-864 (Affidavit of Support) — sponsor/employer files
 *   - ETA-9089 (PERM Labor Certification) — most EB-2/EB-3 cases, filed with DOL first
 *
 * 5 Sections:
 *   1. Sponsorship & Employer Info  — who is sponsoring and basic company name/address
 *   2. Your Personal Information    — passport, current status, family
 *   3. Education & Work History     — supports EB category determination
 *   4. Immigration History          — prior petitions, prior green card attempts
 *   5. Documents Checklist
 */
import type { VisaQuestionnaire } from './types'

export const greenCardQuestionnaire: VisaQuestionnaire = {
  visaType: 'green_card',
  label: 'Employment-Based Green Card',
  description: 'Permanent residence through employment (EB-1, EB-2, EB-3) or family sponsorship.',
  estimatedMinutes: 12,
  uscisforms: ['I-140', 'I-485', 'I-864', 'ETA-9089 (PERM)'],
  sections: [

    // ── SECTION 1: SPONSORSHIP ───────────────────────────────
    {
      id: 1,
      title: 'Sponsorship',
      subtitle: 'Who is sponsoring your green card, and basic company information',
      icon: '🏢',
      fields: [
        { type: 'info', id: 'info_sponsor', text: 'Only the company name and address are required from you. EIN, revenue, employee count, and other financial details will be provided by your employer\'s HR directly to your attorney.' } as any,

        { id: 'sponsor_type', type: 'radio', label: 'What type of green card are you applying for?', required: true,
          options: [
            { value: 'employer', label: 'Employment-based — my employer is sponsoring me' },
            { value: 'niw', label: 'National Interest Waiver (EB-2 NIW) — self-petitioned, no employer needed' },
            { value: 'not_sure', label: 'Not sure — my attorney will advise' },
          ]
        },

        { type: 'heading', id: 'h_employer', text: 'Sponsoring Employer (if employer-sponsored)' } as any,
        { id: 'employer_legal_name', type: 'text', label: 'Company Legal Name',
          showIf: { field: 'sponsor_type', value: 'employer' },
          placeholder: 'Acme Corporation Inc.'
        },
        { id: 'employer_street', type: 'text', label: 'Company Street Address',
          showIf: { field: 'sponsor_type', value: 'employer' },
          placeholder: '100 Main Street, Suite 200'
        },
        { id: 'employer_city', type: 'text', label: 'City',
          showIf: { field: 'sponsor_type', value: 'employer' },
          placeholder: 'New York'
        },
        { id: 'employer_state', type: 'select', label: 'State',
          showIf: { field: 'sponsor_type', value: 'employer' },
          options: [
            {value:'AL',label:'Alabama'},{value:'AK',label:'Alaska'},{value:'AZ',label:'Arizona'},
            {value:'AR',label:'Arkansas'},{value:'CA',label:'California'},{value:'CO',label:'Colorado'},
            {value:'CT',label:'Connecticut'},{value:'DE',label:'Delaware'},{value:'FL',label:'Florida'},
            {value:'GA',label:'Georgia'},{value:'HI',label:'Hawaii'},{value:'ID',label:'Idaho'},
            {value:'IL',label:'Illinois'},{value:'IN',label:'Indiana'},{value:'IA',label:'Iowa'},
            {value:'KS',label:'Kansas'},{value:'KY',label:'Kentucky'},{value:'LA',label:'Louisiana'},
            {value:'ME',label:'Maine'},{value:'MD',label:'Maryland'},{value:'MA',label:'Massachusetts'},
            {value:'MI',label:'Michigan'},{value:'MN',label:'Minnesota'},{value:'MS',label:'Mississippi'},
            {value:'MO',label:'Missouri'},{value:'MT',label:'Montana'},{value:'NE',label:'Nebraska'},
            {value:'NV',label:'Nevada'},{value:'NH',label:'New Hampshire'},{value:'NJ',label:'New Jersey'},
            {value:'NM',label:'New Mexico'},{value:'NY',label:'New York'},{value:'NC',label:'North Carolina'},
            {value:'ND',label:'North Dakota'},{value:'OH',label:'Ohio'},{value:'OK',label:'Oklahoma'},
            {value:'OR',label:'Oregon'},{value:'PA',label:'Pennsylvania'},{value:'RI',label:'Rhode Island'},
            {value:'SC',label:'South Carolina'},{value:'SD',label:'South Dakota'},{value:'TN',label:'Tennessee'},
            {value:'TX',label:'Texas'},{value:'UT',label:'Utah'},{value:'VT',label:'Vermont'},
            {value:'VA',label:'Virginia'},{value:'WA',label:'Washington'},{value:'WV',label:'West Virginia'},
            {value:'WI',label:'Wisconsin'},{value:'WY',label:'Wyoming'},{value:'DC',label:'Washington DC'},
          ]
        },
        { id: 'employer_zip', type: 'text', label: 'ZIP Code',
          showIf: { field: 'sponsor_type', value: 'employer' },
          placeholder: '10001'
        },
        // EIN and financial info are for HR/employer — not required from beneficiary
        { id: 'employer_ein', type: 'text', label: 'Employer EIN (optional)',
          showIf: { field: 'sponsor_type', value: 'employer' },
          placeholder: 'HR will provide this', hint: 'Your employer\'s HR will provide this to your attorney.'
        },

        { type: 'heading', id: 'h_job', text: 'The Job Being Offered' } as any,
        { id: 'pos_job_title', type: 'text', label: 'Job Title', required: true, placeholder: 'Software Engineer III' },
        { id: 'pos_duties', type: 'textarea', label: 'Job Duties', required: true,
          placeholder: 'Describe the main responsibilities of this permanent position...',
          hint: 'For PERM, the job duties must describe a specific role that genuinely requires your qualifications'
        },
        { id: 'pos_salary', type: 'text', label: 'Annual Salary for This Position (USD)', required: true, placeholder: '130,000' },
        // SOC code is for attorney/DOL — remove from beneficiary form
        { id: 'pos_eb_category', type: 'select', label: 'Do you know your EB category? (optional)', options: [
          { value: 'eb1a', label: 'EB-1A — Extraordinary ability (no employer needed)' },
          { value: 'eb1b', label: 'EB-1B — Outstanding professor or researcher' },
          { value: 'eb1c', label: 'EB-1C — Multinational executive/manager' },
          { value: 'eb2', label: 'EB-2 — Advanced degree or exceptional ability' },
          { value: 'eb2_niw', label: 'EB-2 NIW — National Interest Waiver' },
          { value: 'eb3', label: 'EB-3 — Skilled worker or professional' },
          { value: 'not_sure', label: 'Not sure — my attorney will advise' },
        ]},
      ],
    },

    // ── SECTION 2: PERSONAL INFORMATION ─────────────────────
    {
      id: 2,
      title: 'Your Personal Information',
      subtitle: 'Personal details as they appear on your passport, plus your family',
      icon: '👤',
      fields: [
        { id: 'ben_last_name', type: 'text', label: 'Last Name', required: true, placeholder: 'Chen', uscisRef: 'I-485 Part 1, Item 1' },
        { id: 'ben_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Wei' },
        { id: 'ben_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Lin' },
        { id: 'ben_other_names', type: 'text', label: 'Other names used', placeholder: 'Maiden name or aliases' },
        { id: 'ben_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'ben_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Shanghai' },
        { id: 'ben_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'China' },
        { id: 'ben_nationality', type: 'text', label: 'Country of Citizenship', required: true, placeholder: 'China' },
        { id: 'ben_ssn', type: 'text', label: 'US Social Security Number (if you have one)', placeholder: 'XXX-XX-XXXX' },

        { type: 'heading', id: 'h_passport', text: 'Passport' } as any,
        { id: 'ben_passport_number', type: 'text', label: 'Passport Number', required: true, placeholder: 'E12345678' },
        { id: 'ben_passport_country', type: 'text', label: 'Passport Issuing Country', required: true, placeholder: 'China' },
        { id: 'ben_passport_expiry', type: 'date', label: 'Passport Expiry Date', required: true },

        { type: 'heading', id: 'h_address', text: 'Current Address' } as any,
        { id: 'ben_current_address', type: 'text', label: 'Street Address', required: true, placeholder: '55 Oak Street, Apt 3' },
        { id: 'ben_current_city', type: 'text', label: 'City', required: true, placeholder: 'San Francisco' },
        { id: 'ben_current_state', type: 'text', label: 'State / Province', required: true, placeholder: 'CA' },
        { id: 'ben_current_zip', type: 'text', label: 'ZIP / Postal Code', placeholder: '94102' },
        { id: 'ben_current_country', type: 'text', label: 'Country', required: true, placeholder: 'United States' },

        { type: 'heading', id: 'h_status', text: 'Current US Immigration Status' } as any,
        { id: 'ben_in_us', type: 'radio', label: 'Are you currently in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — I am outside the US' }]
        },
        { id: 'ben_current_status', type: 'select', label: 'Current US visa/status (select closest)',
          showIf: { field: 'ben_in_us', value: 'yes' },
          options: [
            { value: 'h1b', label: 'H-1B' }, { value: 'l1', label: 'L-1' },
            { value: 'f1', label: 'F-1 / OPT' }, { value: 'o1', label: 'O-1' },
            { value: 'ead', label: 'EAD / Work Permit' }, { value: 'gc_pending', label: 'Green card pending (I-485 filed)' },
            { value: 'other', label: 'Other' },
          ]
        },
        { id: 'ben_i94', type: 'text', label: 'I-94 Number (optional)',
          showIf: { field: 'ben_in_us', value: 'yes' },
          hint: 'Find at cbp.gov/i94'
        },

        { type: 'heading', id: 'h_family', text: 'Family (Dependents)' } as any,
        { id: 'ben_married', type: 'radio', label: 'Are you married?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'ben_spouse_name', type: 'text', label: 'Spouse\'s Full Name',
          showIf: { field: 'ben_married', value: 'yes' },
          placeholder: 'Li Wei Chen'
        },
        { id: 'ben_spouse_nationality', type: 'text', label: 'Spouse\'s Country of Citizenship',
          showIf: { field: 'ben_married', value: 'yes' },
          placeholder: 'China'
        },
        { id: 'ben_children', type: 'radio', label: 'Do you have any unmarried children under age 21?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'ben_children_count', type: 'number', label: 'How many children?',
          showIf: { field: 'ben_children', value: 'yes' },
          placeholder: '2'
        },
      ],
    },

    // ── SECTION 3: EDUCATION & WORK HISTORY ─────────────────
    {
      id: 3,
      title: 'Education & Work History',
      subtitle: 'Your qualifications — used to determine your EB category eligibility',
      icon: '🎓',
      fields: [
        { type: 'info', id: 'info_edu', text: 'EB-2 requires a master\'s degree or higher (or a bachelor\'s plus 5 years progressive experience). EB-3 requires at least a bachelor\'s degree. EB-1 requires extraordinary ability or outstanding achievements.' } as any,

        { id: 'edu_highest_degree', type: 'select', label: 'Highest Degree Earned', required: true, options: [
          { value: 'phd', label: 'Doctorate (Ph.D., M.D., J.D., etc.)' },
          { value: 'masters', label: "Master's Degree (M.S., M.A., M.B.A., etc.)" },
          { value: 'bachelors', label: "Bachelor's Degree" },
          { value: 'associates', label: "Associate's Degree" },
          { value: 'diploma', label: 'Diploma / Certificate' },
          { value: 'none', label: 'No formal degree' },
        ]},
        { id: 'edu_field', type: 'text', label: 'Field of Study', required: true, placeholder: 'Computer Science' },
        { id: 'edu_institution', type: 'text', label: 'University / College Name', required: true, placeholder: 'Tsinghua University' },
        { id: 'edu_country', type: 'text', label: 'Country', required: true, placeholder: 'China' },
        { id: 'edu_graduation_year', type: 'number', label: 'Year of Graduation', required: true, placeholder: '2015' },
        { id: 'edu_foreign_degree', type: 'radio', label: 'Was your degree earned outside the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — US degree' }]
        },
        { id: 'edu_evaluator', type: 'text', label: 'Credential evaluation agency (if already evaluated)',
          showIf: { field: 'edu_foreign_degree', value: 'yes' },
          placeholder: 'e.g. WES, ECE', hint: 'Leave blank if not yet evaluated'
        },
        { id: 'edu_additional', type: 'textarea', label: 'Additional degrees, licenses, or certifications (optional)',
          placeholder: 'List any other relevant credentials...'
        },

        { type: 'heading', id: 'h_experience', text: 'Work Experience' } as any,
        { id: 'work_years_experience', type: 'number', label: 'Total years of professional experience in your field', required: true, placeholder: '8' },
        { id: 'work_current_employer', type: 'text', label: 'Current Employer Name', required: true, placeholder: 'Google LLC' },
        { id: 'work_current_title', type: 'text', label: 'Current Job Title', required: true, placeholder: 'Senior Software Engineer' },
        { id: 'work_history', type: 'textarea', label: 'List your last 3 employers (name, title, dates)', required: true,
          placeholder: 'Google LLC — Senior SWE — Jan 2020 to present\nMeta — SWE II — Jan 2018 – Dec 2019\nStartup Inc. — SWE — Jun 2015 – Dec 2017'
        },

        { type: 'heading', id: 'h_achievements', text: 'Notable Achievements (for EB-1/EB-2 NIW)' } as any,
        { type: 'info', id: 'info_achievements', text: 'Only fill this section if you are applying for EB-1 or EB-2 NIW. Skip if employer-sponsored EB-2/EB-3.' } as any,
        { id: 'achievements_publications', type: 'number', label: 'Number of published academic papers or articles (optional)', placeholder: '0' },
        { id: 'achievements_patents', type: 'number', label: 'Number of patents held or pending (optional)', placeholder: '0' },
        { id: 'achievements_awards', type: 'textarea', label: 'Major awards or recognition in your field (optional)', placeholder: 'e.g. NSF grant recipient, IEEE Fellow, Forbes 30 Under 30...' },
        { id: 'achievements_other', type: 'textarea', label: 'Other achievements supporting extraordinary ability or national interest (optional)',
          placeholder: 'Invited conference talks, media coverage, high salary vs peers, critical role at major company...'
        },
      ],
    },

    // ── SECTION 4: IMMIGRATION HISTORY ──────────────────────
    {
      id: 4,
      title: 'Immigration History',
      subtitle: 'Prior US immigration — answer honestly, all information is confidential',
      icon: '📋',
      fields: [
        { id: 'hist_prev_us', type: 'radio', label: 'Have you previously lived or worked in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_details', type: 'textarea', label: 'Describe your previous US stays',
          placeholder: 'e.g. F-1 student 2010–2014, H-1B at Google 2014–2022...',
          showIf: { field: 'hist_prev_us', value: 'yes' }
        },
        { id: 'hist_prior_gc', type: 'radio', label: 'Have you previously filed for a green card?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prior_gc_details', type: 'textarea', label: 'What happened with the prior filing?',
          placeholder: 'e.g. I-140 approved at Amazon, never filed I-485 because I changed jobs',
          showIf: { field: 'hist_prior_gc', value: 'yes' }
        },
        { id: 'hist_priority_date', type: 'text', label: 'Do you have an existing priority date? (optional)',
          placeholder: 'e.g. March 2018 (EB-2, India)',
          hint: 'Found on your previously approved I-140 notice. Leave blank if none.'
        },
        { id: 'hist_denial', type: 'radio', label: 'Has any immigration petition ever been denied?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_denial_details', type: 'textarea', label: 'What was denied and why?',
          showIf: { field: 'hist_denial', value: 'yes' }
        },
        { id: 'hist_violation', type: 'radio', label: 'Have you ever overstayed a visa or violated immigration status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_violation_details', type: 'textarea', label: 'Please explain',
          showIf: { field: 'hist_violation', value: 'yes' }
        },
        { id: 'hist_criminal', type: 'radio', label: 'Do you have any criminal history in any country?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_criminal_details', type: 'textarea', label: 'Please explain',
          hint: 'Include all arrests, charges, or convictions — your attorney will advise',
          showIf: { field: 'hist_criminal', value: 'yes' }
        },
      ],
    },

    // ── SECTION 5: DOCUMENTS CHECKLIST ──────────────────────
    {
      id: 5,
      title: 'Documents You Have Ready',
      subtitle: 'Check what you currently have — missing items can be gathered later',
      icon: '📁',
      fields: [
        { type: 'info', id: 'info_docs', text: 'Check everything you currently have. Your attorney will tell you exactly what is needed.' } as any,
        { id: 'doc_passport', type: 'checkbox', label: 'Valid passport' },
        { id: 'doc_i94', type: 'checkbox', label: 'I-94 arrival record (if in US — cbp.gov/i94)' },
        { id: 'doc_current_visa', type: 'checkbox', label: 'Current visa stamp' },
        { id: 'doc_degree', type: 'checkbox', label: 'Degree certificates and transcripts' },
        { id: 'doc_credential_eval', type: 'checkbox', label: 'Foreign credential evaluation (if degree from outside US)' },
        { id: 'doc_resume', type: 'checkbox', label: 'Resume / CV' },
        { id: 'doc_paystubs', type: 'checkbox', label: 'Recent pay stubs (last 3 months)' },
        { id: 'doc_prior_i140', type: 'checkbox', label: 'Prior I-140 approval notice (if applicable)' },
        { id: 'doc_publications', type: 'checkbox', label: 'Published papers / patents (if EB-1 or NIW)' },
        { id: 'doc_awards', type: 'checkbox', label: 'Award certificates or recognition letters (if EB-1 or NIW)' },
        { type: 'heading', id: 'h_notes', text: 'Anything else?' } as any,
        { id: 'additional_notes', type: 'textarea', label: 'Additional notes for your attorney (optional)',
          placeholder: 'Priority date portability, job change concerns, dependents, timing requirements...'
        },
      ],
    },
  ],
}
