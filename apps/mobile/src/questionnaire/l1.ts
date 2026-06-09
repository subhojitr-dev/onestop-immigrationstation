/**
 * lib/questionnaire/l1.ts
 *
 * L-1 Intracompany Transferee visa intake questionnaire.
 *
 * Who fills this:
 *   BENEFICIARY (the employee being transferred) fills:
 *     - Their personal/passport info
 *     - Their job role and what they actually do
 *     - Immigration history
 *     - Documents they have ready
 *
 *   SPONSOR/EMPLOYER fills (collected separately or by attorney):
 *     - EIN, gross annual income, employee count
 *     - Relationship between foreign and US entities
 *
 *   ATTORNEY determines:
 *     - NAICS code (removed — lawyer looks this up)
 *     - Whether L-1A (executive/manager) vs L-1B (specialized knowledge)
 *       is the stronger classification
 *
 * USCIS forms this feeds into:
 *   - I-129 (Petition for Nonimmigrant Worker)
 *   - L Classification Supplement to Form I-129
 *
 * 5 Sections:
 *   1. Your Employer Details      — company names + relationship between entities
 *   2. Your Personal Information  — passport, current status
 *   3. Your Role                  — job title, duties, manager/executive vs specialist
 *   4. Immigration History        — prior US stays, prior L-1, denials
 *   5. Documents Checklist
 */
import type { VisaQuestionnaire } from './types'

export const l1Questionnaire: VisaQuestionnaire = {
  visaType: 'l1',
  label: 'L-1 Intracompany Transfer',
  description: 'For executives, managers, or specialized knowledge employees transferring from a foreign affiliate to a US office.',
  estimatedMinutes: 10,
  uscisforms: ['I-129', 'L Classification Supplement'],
  sections: [

    // ── SECTION 1: EMPLOYER / COMPANY INFO ──────────────────
    {
      id: 1,
      title: 'Company Information',
      subtitle: 'Details about your employer — the foreign company you work for and the US company you are transferring to',
      icon: '🏢',
      fields: [
        { type: 'info', id: 'info_employer', text: 'Only the company names are required. EIN, income, and employee counts do not need to be filled by you — your employer\'s HR or attorney will provide those.' } as any,

        { type: 'heading', id: 'h_foreign', text: 'Your Current Employer (Foreign Company)' } as any,
        { id: 'foreign_company_name', type: 'text', label: 'Foreign Company Name', required: true, placeholder: 'Acme Technologies Ltd.' },
        { id: 'foreign_company_country', type: 'text', label: 'Country where Foreign Company is Located', required: true, placeholder: 'India' },
        { id: 'foreign_company_city', type: 'text', label: 'City', required: true, placeholder: 'Bangalore' },
        // Attorney/HR fills — beneficiary often does not know these
        { id: 'foreign_company_ein', type: 'text', label: 'Foreign Company Tax/Registration Number (optional)', placeholder: 'Leave blank — HR will provide', hint: 'Your employer\'s HR or attorney will complete this.' },

        { type: 'heading', id: 'h_us', text: 'US Company You Are Transferring To' } as any,
        { id: 'us_company_name', type: 'text', label: 'US Company Name', required: true, placeholder: 'Acme Technologies Inc.' },
        { id: 'us_company_street', type: 'text', label: 'US Office Address', required: true, placeholder: '100 Innovation Drive, Suite 500' },
        { id: 'us_company_city', type: 'text', label: 'City', required: true, placeholder: 'San Jose' },
        { id: 'us_company_state', type: 'select', label: 'State', required: true, options: [
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
        { id: 'us_company_zip', type: 'text', label: 'ZIP Code', required: true, placeholder: '95110' },

        { type: 'heading', id: 'h_relationship', text: 'Relationship Between the Two Companies' } as any,
        { id: 'company_relationship', type: 'select', label: 'How are the two companies related?', required: true, options: [
          { value: 'parent_subsidiary', label: 'Parent company and subsidiary' },
          { value: 'affiliate', label: 'Affiliates (common ownership)' },
          { value: 'branch', label: 'Branch office' },
          { value: 'joint_venture', label: 'Joint venture' },
          { value: 'not_sure', label: 'Not sure — my attorney will confirm' },
        ]},

        // HR fills these — remove required from employee
        { id: 'us_ein', type: 'text', label: 'US Company EIN (optional)', placeholder: '12-3456789', hint: 'HR or your attorney will provide this.' },
      ],
    },

    // ── SECTION 2: BENEFICIARY PERSONAL INFO ────────────────
    {
      id: 2,
      title: 'Your Personal Information',
      subtitle: 'Your personal details as they appear on your passport',
      icon: '👤',
      fields: [
        { id: 'ben_last_name', type: 'text', label: 'Last Name (Family Name)', required: true, placeholder: 'Sharma', uscisRef: 'I-129 Part 2, Item 1' },
        { id: 'ben_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Priya' },
        { id: 'ben_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Raj' },
        { id: 'ben_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'ben_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Mumbai' },
        { id: 'ben_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'India' },
        { id: 'ben_nationality', type: 'text', label: 'Country of Citizenship', required: true, placeholder: 'India' },

        { type: 'heading', id: 'h_passport', text: 'Passport' } as any,
        { id: 'ben_passport_number', type: 'text', label: 'Passport Number', required: true, placeholder: 'P1234567' },
        { id: 'ben_passport_country', type: 'text', label: 'Passport Issuing Country', required: true, placeholder: 'India' },
        { id: 'ben_passport_expiry', type: 'date', label: 'Passport Expiry Date', required: true, hint: 'Must be valid at least 6 months beyond your planned stay' },

        { type: 'heading', id: 'h_address', text: 'Your Current Address' } as any,
        { id: 'ben_current_address', type: 'text', label: 'Street Address', required: true, placeholder: '42 MG Road, Apt 5' },
        { id: 'ben_current_city', type: 'text', label: 'City', required: true, placeholder: 'Bangalore' },
        { id: 'ben_current_state', type: 'text', label: 'State / Province', required: true, placeholder: 'Karnataka' },
        { id: 'ben_current_country', type: 'text', label: 'Country', required: true, placeholder: 'India' },

        { type: 'heading', id: 'h_status', text: 'Current US Status (if in the US)' } as any,
        { id: 'ben_in_us', type: 'radio', label: 'Are you currently in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — I am outside the US' }]
        },
        { id: 'ben_current_status', type: 'select', label: 'Current US Immigration Status (select closest)',
          showIf: { field: 'ben_in_us', value: 'yes' },
          options: [
            { value: 'l1', label: 'L-1' }, { value: 'l2', label: 'L-2 (dependent)' },
            { value: 'h1b', label: 'H-1B' }, { value: 'f1', label: 'F-1' },
            { value: 'b1b2', label: 'B-1/B-2 (visitor)' }, { value: 'other', label: 'Other' },
          ]
        },
        { id: 'ben_i94', type: 'text', label: 'I-94 Number (optional)', placeholder: '12345678901',
          showIf: { field: 'ben_in_us', value: 'yes' },
          hint: 'Find yours at cbp.gov/i94'
        },
      ],
    },

    // ── SECTION 3: ROLE & EMPLOYMENT ────────────────────────
    {
      id: 3,
      title: 'Your Role',
      subtitle: 'Describe your current position at the foreign company and your planned role in the US',
      icon: '💼',
      fields: [
        { type: 'info', id: 'info_role', text: 'L-1A is for executives and managers. L-1B is for employees with specialized knowledge that is not widely available outside the company. Your attorney will confirm the correct category.' } as any,

        { type: 'heading', id: 'h_current_role', text: 'Your Current Role at the Foreign Company' } as any,
        { id: 'pos_current_title', type: 'text', label: 'Current Job Title', required: true, placeholder: 'Senior Engineering Manager' },
        { id: 'pos_current_duties', type: 'textarea', label: 'Describe your current responsibilities', required: true,
          placeholder: 'e.g. Manage a team of 12 engineers, oversee product roadmap, report to VP of Engineering, approve hiring...',
          hint: 'Be specific — this is what establishes you qualify for L-1'
        },
        { id: 'pos_years_employed', type: 'number', label: 'How many years have you worked for this company?', required: true, placeholder: '3',
          hint: 'L-1 requires at least 1 continuous year of employment abroad in the past 3 years'
        },
        // Employee count is for HR/employer to provide — beneficiary may not know the exact number
        { id: 'pos_reports_to', type: 'text', label: 'Your Manager\'s Title (optional)', placeholder: 'VP of Engineering' },
        { id: 'pos_team_size', type: 'number', label: 'Number of people you directly manage (enter 0 if none)', placeholder: '0',
          hint: 'Relevant for L-1A (managerial) classification'
        },

        { type: 'heading', id: 'h_us_role', text: 'Your Planned Role in the US' } as any,
        { id: 'pos_us_title', type: 'text', label: 'Planned US Job Title', required: true, placeholder: 'Director of Engineering' },
        { id: 'pos_us_duties', type: 'textarea', label: 'Describe your planned US responsibilities', required: true,
          placeholder: 'e.g. Lead US engineering team, set technical direction, collaborate with global teams...'
        },

        { id: 'pos_l1_type', type: 'radio', label: 'Which best describes your planned US role?', required: true,
          options: [
            { value: 'l1a_executive', label: 'L-1A — Executive (CEO, President, Director or similar)' },
            { value: 'l1a_manager', label: 'L-1A — Manager (supervises staff or manages a function)' },
            { value: 'l1b', label: 'L-1B — Specialized Knowledge (unique expertise specific to the company)' },
            { value: 'not_sure', label: 'Not sure — my attorney will advise' },
          ]
        },

        { id: 'pos_salary_usd', type: 'text', label: 'Expected Annual US Salary (USD)', required: true, placeholder: '150,000' },
        { id: 'pos_start_date', type: 'date', label: 'Expected US Start Date (optional)', hint: 'Leave blank if not yet determined' },
      ],
    },

    // ── SECTION 4: IMMIGRATION HISTORY ──────────────────────
    {
      id: 4,
      title: 'Immigration History',
      subtitle: 'Your prior US immigration history — answer honestly, all information is confidential',
      icon: '📋',
      fields: [
        { id: 'hist_prev_us', type: 'radio', label: 'Have you previously lived or worked in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_details', type: 'textarea', label: 'Briefly describe your previous US stays',
          placeholder: 'e.g. L-1B at Microsoft, Jan 2019 – Dec 2021. B-2 visitor 2022.',
          showIf: { field: 'hist_prev_us', value: 'yes' }
        },
        { id: 'hist_prev_l1', type: 'radio', label: 'Have you previously held L-1 status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_l1_details', type: 'textarea', label: 'Previous L-1 employer and dates',
          placeholder: 'e.g. Google LLC, Mar 2018 – Feb 2021',
          showIf: { field: 'hist_prev_l1', value: 'yes' }
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
        { id: 'hist_criminal', type: 'radio', label: 'Do you have any criminal history in any country?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_criminal_details', type: 'textarea', label: 'Please explain',
          hint: 'Include all arrests, charges, or convictions — your attorney will advise on what is relevant',
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
        { type: 'info', id: 'info_docs', text: 'Check everything you currently have. Your attorney will tell you exactly what is needed for your specific case.' } as any,
        { id: 'doc_passport', type: 'checkbox', label: 'Valid passport (expiring in 6+ months)' },
        { id: 'doc_i94', type: 'checkbox', label: 'I-94 arrival record (if currently in US — print from cbp.gov/i94)' },
        { id: 'doc_current_visa', type: 'checkbox', label: 'Copy of current visa stamp' },
        { id: 'doc_employment_letter', type: 'checkbox', label: 'Employment verification letter from current employer (foreign company)' },
        { id: 'doc_org_chart', type: 'checkbox', label: 'Org chart showing your position' },
        { id: 'doc_payslips', type: 'checkbox', label: 'Last 3 months of payslips from current employer' },
        { id: 'doc_offer_letter', type: 'checkbox', label: 'Offer letter or transfer letter from US company' },
        { id: 'doc_prev_l1', type: 'checkbox', label: 'Previous L-1 approval notices (I-797) if applicable' },
        { id: 'doc_degree', type: 'checkbox', label: 'Degree certificate (if required for specialized knowledge claim)' },
        { type: 'heading', id: 'h_notes', text: 'Anything else?' } as any,
        { id: 'additional_notes', type: 'textarea', label: 'Additional notes for your attorney (optional)',
          placeholder: 'Special circumstances, timing requirements, dependents traveling with you, or anything else your attorney should know...'
        },
      ],
    },
  ],
}
