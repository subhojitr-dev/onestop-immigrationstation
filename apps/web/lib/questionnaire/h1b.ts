/**
 * lib/questionnaire/h1b.ts
 *
 * H-1B Specialty Occupation visa intake questionnaire.
 *
 * This file defines all questions the client must answer before the lawyer
 * can prepare the H-1B petition package. Answers are stored in Supabase
 * applications.data (JSONB) keyed by field ID.
 *
 * USCIS forms this questionnaire feeds into:
 *   - I-129 (Petition for Nonimmigrant Worker) — main petition form
 *   - H Classification Supplement — H-1B-specific addendum to I-129
 *   - LCA / ETA-9035 (Labor Condition Application) — filed with Dept. of Labor first
 *
 * 6 Sections:
 *   1. Employer Info     — company details the lawyer needs to complete I-129 Part 1
 *   2. Personal Info     — beneficiary details for I-129 Part 2 + passport + current status
 *   3. Education         — degree verification (H-1B requires bachelor's in related field)
 *   4. Position Details  — job title, duties, salary, work location for LCA + I-129 Part 5
 *   5. Immigration History — prior stays, prior H-1B, denials, violations, criminal history
 *   6. Documents Checklist — which documents the client currently has (guides upload)
 *
 * Field ID naming convention:
 *   employer_*  → Section 1
 *   ben_*       → Section 2 (beneficiary = the employee applying)
 *   edu_*       → Section 3
 *   pos_*       → Section 4
 *   hist_*      → Section 5
 *   doc_*       → Section 6
 *
 * To add questions to an existing section, append fields to the section's `fields` array.
 * To add a new section, append to the `sections` array — the engine handles it automatically.
 */
import type { VisaQuestionnaire } from './types'

export const h1bQuestionnaire: VisaQuestionnaire = {
  visaType: 'h1b',
  label: 'H-1B Specialty Occupation',
  description: 'For foreign nationals working in specialty occupations requiring at least a bachelor\'s degree.',
  estimatedMinutes: 15,
  uscisforms: ['I-129', 'H Classification Supplement', 'LCA (ETA-9035)'],
  sections: [
    // ── SECTION 1: PETITIONER (EMPLOYER) ────────────────────
    {
      id: 1,
      title: 'Employer Information',
      subtitle: 'Basic details about the company sponsoring this H-1B. Fill in what you know — your attorney will complete the rest.',
      icon: '🏢',
      fields: [
        { type: 'info', id: 'info_employer', text: 'Fill in what you know. Fields marked * are required. Your attorney will complete any missing employer details directly with HR.' } as any,
        { id: 'employer_legal_name', type: 'text', label: 'Company Legal Name', required: true, placeholder: 'Acme Corporation Inc.', uscisRef: 'I-129 Part 1, Item 1' },
        { id: 'employer_trade_name', type: 'text', label: 'Trade Name / DBA (if different)', placeholder: 'Acme Corp' },
        { id: 'employer_ein', type: 'text', label: 'Federal Employer ID Number (EIN)', placeholder: '12-3456789', hint: 'Found on your W-2 or offer letter. Leave blank if unknown — HR can provide this.' },
        { id: 'employer_business_type', type: 'select', label: 'Type of Business', options: [
          { value: 'corporation', label: 'Corporation' },
          { value: 'llc', label: 'LLC' },
          { value: 'partnership', label: 'Partnership' },
          { value: 'nonprofit', label: 'Nonprofit Organization' },
          { value: 'government', label: 'Government Entity' },
          { value: 'university', label: 'University / College' },
          { value: 'other', label: 'Other / Not sure' },
        ]},
        { type: 'heading', id: 'h_employer_address', text: 'Company Address' } as any,
        { id: 'employer_street', type: 'text', label: 'Street Address', required: true, placeholder: '123 Main Street, Suite 400' },
        { id: 'employer_city', type: 'text', label: 'City', required: true, placeholder: 'New York' },
        { id: 'employer_state', type: 'select', label: 'State', required: true, options: [
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
        ]},
        { id: 'employer_zip', type: 'text', label: 'ZIP Code', required: true, placeholder: '10001' },
        { type: 'heading', id: 'h_contact', text: 'HR Contact (if known)' } as any,
        { id: 'contact_name', type: 'text', label: 'HR Contact Name', placeholder: 'Jennifer Smith' },
        { id: 'contact_title', type: 'text', label: 'HR Contact Title', placeholder: 'HR Manager' },
        { id: 'contact_email', type: 'email', label: 'HR Contact Email', placeholder: 'hr@company.com' },
        { id: 'contact_phone', type: 'tel', label: 'HR Contact Phone', placeholder: '(555) 123-4567' },
        { id: 'is_cap_exempt', type: 'radio', label: 'Is your employer a university, nonprofit, or government research institution?',
          hint: 'These employers are exempt from the annual H-1B lottery cap',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Not sure' }]
        },
      ],
    },

    // ── SECTION 2: BENEFICIARY (EMPLOYEE) ───────────────────
    {
      id: 2,
      title: 'Your Personal Information',
      subtitle: 'Your personal details as they appear on your passport',
      icon: '👤',
      fields: [
        { id: 'ben_last_name', type: 'text', label: 'Last Name (Family Name)', required: true, placeholder: 'Garcia', uscisRef: 'I-129 Part 2, Item 1' },
        { id: 'ben_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Maria' },
        { id: 'ben_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Elena' },
        { id: 'ben_other_names', type: 'text', label: 'Other Names Used (maiden name, aliases)', placeholder: 'Maria Lopez' },
        { id: 'ben_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'ben_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Mexico City' },
        { id: 'ben_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'Mexico' },
        { id: 'ben_nationality', type: 'text', label: 'Country of Citizenship / Nationality', required: true, placeholder: 'Mexico' },
        { id: 'ben_gender', type: 'radio', label: 'Gender', required: true, options: [
          { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other / Prefer not to say' }
        ]},
        { id: 'ben_ssn', type: 'text', label: 'US Social Security Number (if you have one)', placeholder: 'XXX-XX-XXXX', hint: 'Leave blank if you do not have a SSN yet' },
        { type: 'heading', id: 'h_passport', text: 'Passport Details' } as any,
        { id: 'ben_passport_number', type: 'text', label: 'Passport Number', required: true, placeholder: 'G12345678' },
        { id: 'ben_passport_country', type: 'text', label: 'Country that Issued Passport', required: true, placeholder: 'Mexico' },
        { id: 'ben_passport_expiry', type: 'date', label: 'Passport Expiry Date', required: true, hint: 'Must be valid for at least 6 months beyond your intended stay' },
        { type: 'heading', id: 'h_address', text: 'Your Current Address' } as any,
        { id: 'ben_current_address', type: 'text', label: 'Street Address', required: true, placeholder: '456 Oak Avenue, Apt 2B' },
        { id: 'ben_current_city', type: 'text', label: 'City', required: true, placeholder: 'Chicago' },
        { id: 'ben_current_state', type: 'text', label: 'State / Province', required: true, placeholder: 'IL' },
        { id: 'ben_current_zip', type: 'text', label: 'ZIP / Postal Code', required: true, placeholder: '60601' },
        { id: 'ben_current_country', type: 'text', label: 'Country', required: true, placeholder: 'United States' },
        { type: 'heading', id: 'h_current_status', text: 'Current US Immigration Status' } as any,
        { id: 'ben_in_us', type: 'radio', label: 'Are you currently in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — I am outside the US' }]
        },
        { id: 'ben_current_status', type: 'select', label: 'Current Immigration Status', required: true,
          showIf: { field: 'ben_in_us', value: 'yes' },
          options: [
            { value: 'h1b', label: 'H-1B' }, { value: 'h4', label: 'H-4 (dependent)' },
            { value: 'f1', label: 'F-1 (student)' }, { value: 'opt', label: 'OPT / STEM OPT' },
            { value: 'l1', label: 'L-1' }, { value: 'o1', label: 'O-1' },
            { value: 'tn', label: 'TN' }, { value: 'j1', label: 'J-1' },
            { value: 'b1b2', label: 'B-1/B-2 (visitor)' }, { value: 'ead', label: 'EAD / Work Permit' },
            { value: 'other', label: 'Other' },
          ]
        },
        { id: 'ben_i94', type: 'text', label: 'I-94 Number (optional)', placeholder: '12345678901',
          showIf: { field: 'ben_in_us', value: 'yes' },
          hint: 'Find yours at cbp.gov/i94 — leave blank if unavailable'
        },
        { id: 'ben_status_expiry', type: 'date', label: 'Current Status Expiry Date',
          showIf: { field: 'ben_in_us', value: 'yes' },
          hint: 'The date shown on your I-94 or visa stamp'
        },
      ],
    },

    // ── SECTION 3: EDUCATION ────────────────────────────────
    {
      id: 3,
      title: 'Education & Qualifications',
      subtitle: 'H-1B requires at least a bachelor\'s degree in a field related to the job',
      icon: '🎓',
      fields: [
        { id: 'edu_highest_degree', type: 'select', label: 'Highest Degree Earned', required: true, options: [
          { value: 'bachelors', label: "Bachelor's Degree (B.S., B.A., B.E., etc.)" },
          { value: 'masters', label: "Master's Degree (M.S., M.A., M.B.A., etc.)" },
          { value: 'doctorate', label: 'Doctorate (Ph.D., M.D., J.D., etc.)' },
          { value: 'associates', label: "Associate's Degree" },
          { value: 'diploma', label: 'Diploma / Certificate' },
          { value: 'equivalent', label: 'Foreign Equivalent (credential evaluation)' },
        ]},
        { id: 'edu_field_of_study', type: 'text', label: 'Field / Major of Study', required: true, placeholder: 'Computer Science', hint: 'Should be directly related to your job role' },
        { id: 'edu_institution', type: 'text', label: 'Name of University / College', required: true, placeholder: 'University of Texas at Austin' },
        { id: 'edu_institution_country', type: 'text', label: 'Country where Institution is Located', required: true, placeholder: 'United States' },
        { id: 'edu_graduation_date', type: 'date', label: 'Graduation Date', required: true },
        { id: 'edu_additional', type: 'textarea', label: 'Additional Degrees or Certifications (optional)', placeholder: 'List any other relevant degrees, licenses, or professional certifications...' },
        { id: 'edu_evaluation_needed', type: 'radio', label: 'Is your degree from outside the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes — foreign degree' }, { value: 'no', label: 'No — US degree' }]
        },
        { id: 'edu_evaluator', type: 'text', label: 'Credential Evaluation Agency (if already evaluated)', placeholder: 'e.g. WES, ECE, Josef Silny',
          showIf: { field: 'edu_evaluation_needed', value: 'yes' },
          hint: 'Leave blank if not yet evaluated — your attorney will advise'
        },
      ],
    },

    // ── SECTION 4: POSITION ─────────────────────────────────
    {
      id: 4,
      title: 'Job Position Details',
      subtitle: 'Details about the role being offered',
      icon: '💼',
      fields: [
        { id: 'pos_job_title', type: 'text', label: 'Job Title', required: true, placeholder: 'Senior Software Engineer' },
        { id: 'pos_duties', type: 'textarea', label: 'Brief Job Description', required: true,
          placeholder: 'Describe your main responsibilities and tasks in this role. What will you do day-to-day?',
          hint: 'Be as specific as possible — this is used to determine if the role qualifies as a specialty occupation'
        },
        { id: 'pos_full_time', type: 'radio', label: 'Is this a full-time position?', required: true,
          options: [{ value: 'yes', label: 'Yes — full time (35+ hours/week)' }, { value: 'no', label: 'No — part time' }]
        },
        { id: 'pos_hours', type: 'number', label: 'Hours per Week', required: true, placeholder: '40' },
        { id: 'pos_wage_rate', type: 'text', label: 'Offered Annual Salary (USD)', required: true, placeholder: '120,000' },
        { id: 'pos_start_date', type: 'date', label: 'Expected Start Date', required: true, hint: 'H-1B cap cases typically start October 1st' },
        { type: 'heading', id: 'h_work_location', text: 'Work Location' } as any,
        { id: 'pos_same_address', type: 'radio', label: 'Will you work at the company\'s main office address?', required: true,
          options: [{ value: 'yes', label: 'Yes — same address as company' }, { value: 'no', label: 'No — different location' }]
        },
        { id: 'pos_work_street', type: 'text', label: 'Work Location Street Address', placeholder: '789 Tech Park Blvd',
          showIf: { field: 'pos_same_address', value: 'no' }
        },
        { id: 'pos_work_city', type: 'text', label: 'City', placeholder: 'Austin',
          showIf: { field: 'pos_same_address', value: 'no' }
        },
        { id: 'pos_work_state', type: 'text', label: 'State', placeholder: 'TX',
          showIf: { field: 'pos_same_address', value: 'no' }
        },
        { id: 'pos_remote', type: 'radio', label: 'Work arrangement', required: true,
          options: [
            { value: 'no', label: 'Fully on-site' },
            { value: 'hybrid', label: 'Hybrid (mix of remote and on-site)' },
            { value: 'yes', label: 'Fully remote' },
          ]
        },
      ],
    },

    // ── SECTION 5: IMMIGRATION HISTORY ──────────────────────
    {
      id: 5,
      title: 'Immigration History',
      subtitle: 'Your prior US immigration history — answer honestly, all information is confidential',
      icon: '📋',
      fields: [
        { id: 'hist_prev_us', type: 'radio', label: 'Have you previously lived or worked in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_details', type: 'textarea', label: 'Briefly describe your previous US stays',
          placeholder: 'e.g. F-1 student visa 2018–2022, University of Michigan. OPT 2022–2023, Google Inc.',
          showIf: { field: 'hist_prev_us', value: 'yes' }
        },
        { id: 'hist_prev_h1b', type: 'radio', label: 'Have you previously held H-1B status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_h1b_details', type: 'textarea', label: 'Previous H-1B employer and dates',
          placeholder: 'e.g. Amazon.com Inc., Oct 2020 – Sep 2023',
          showIf: { field: 'hist_prev_h1b', value: 'yes' }
        },
        { id: 'hist_denial', type: 'radio', label: 'Has any immigration petition or application ever been denied?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_denial_details', type: 'textarea', label: 'What was denied and why (if known)?',
          showIf: { field: 'hist_denial', value: 'yes' }
        },
        { id: 'hist_violation', type: 'radio', label: 'Have you ever overstayed a visa or violated immigration status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_violation_details', type: 'textarea', label: 'Please explain',
          showIf: { field: 'hist_violation', value: 'yes' }
        },
        { id: 'hist_criminal', type: 'radio', label: 'Do you have any criminal history (arrests, charges, or convictions) in any country?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_criminal_details', type: 'textarea', label: 'Please explain',
          hint: 'Include all offenses — your attorney will advise on what is relevant',
          showIf: { field: 'hist_criminal', value: 'yes' }
        },
      ],
    },

    // ── SECTION 6: DOCUMENTS CHECKLIST ──────────────────────
    {
      id: 6,
      title: 'Documents You Have Ready',
      subtitle: 'Check what you currently have — you can upload them in the Documents section',
      icon: '📁',
      fields: [
        { type: 'info', id: 'info_docs', text: 'Check everything you currently have. Missing documents can be uploaded later — your attorney will tell you exactly what is needed for your specific case.' } as any,
        { id: 'doc_passport', type: 'checkbox', label: 'Valid Passport (expiring in 6+ months)' },
        { id: 'doc_i94', type: 'checkbox', label: 'I-94 Arrival Record (if currently in US — print from cbp.gov/i94)' },
        { id: 'doc_current_visa', type: 'checkbox', label: 'Copy of Current Visa Stamp' },
        { id: 'doc_degree', type: 'checkbox', label: 'Degree Certificate and Transcripts' },
        { id: 'doc_evaluation', type: 'checkbox', label: 'Foreign Credential Evaluation (if degree is from outside the US)' },
        { id: 'doc_resume', type: 'checkbox', label: 'Current Resume / CV' },
        { id: 'doc_prev_paystubs', type: 'checkbox', label: 'Recent Pay Stubs (if currently employed in the US)' },
        { id: 'doc_prev_h1b', type: 'checkbox', label: 'Previous H-1B Approval Notices (I-797) if applicable' },
        { id: 'doc_support_letter', type: 'checkbox', label: 'Support / Offer Letter from Employer' },
        { type: 'heading', id: 'h_additional', text: 'Anything else?' } as any,
        { id: 'additional_notes', type: 'textarea', label: 'Additional notes for your attorney (optional)', placeholder: 'Any special circumstances, timing requirements, dependents traveling with you, or other information your attorney should know...' },
      ],
    },
  ],
}
