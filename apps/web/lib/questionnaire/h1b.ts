import type { VisaQuestionnaire } from './types'

export const h1bQuestionnaire: VisaQuestionnaire = {
  visaType: 'h1b',
  label: 'H-1B Specialty Occupation',
  description: 'For foreign nationals working in specialty occupations requiring at least a bachelor\'s degree.',
  estimatedMinutes: 25,
  uscisforms: ['I-129', 'H Classification Supplement', 'LCA (ETA-9035)'],
  sections: [
    // ── SECTION 1: PETITIONER (EMPLOYER) ────────────────────
    {
      id: 1,
      title: 'Employer Information',
      subtitle: 'Details about the company sponsoring this H-1B petition',
      icon: '🏢',
      fields: [
        { id: 'employer_legal_name', type: 'text', label: 'Company Legal Name', required: true, placeholder: 'Acme Corporation Inc.', uscisRef: 'I-129 Part 1, Item 1' },
        { id: 'employer_trade_name', type: 'text', label: 'Trade Name / DBA (if different)', placeholder: 'Acme Corp' },
        { id: 'employer_ein', type: 'text', label: 'Federal Employer ID Number (EIN)', required: true, placeholder: '12-3456789', hint: 'Found on your IRS correspondence or W-2 forms', uscisRef: 'I-129 Part 1, Item 3' },
        { id: 'employer_year_established', type: 'number', label: 'Year Established', required: true, placeholder: '2005' },
        { id: 'employer_business_type', type: 'select', label: 'Type of Business', required: true, options: [
          { value: 'corporation', label: 'Corporation' },
          { value: 'llc', label: 'LLC' },
          { value: 'partnership', label: 'Partnership' },
          { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
          { value: 'nonprofit', label: 'Nonprofit Organization' },
          { value: 'government', label: 'Government Entity' },
          { value: 'university', label: 'University / College' },
          { value: 'other', label: 'Other' },
        ]},
        { id: 'employer_naics', type: 'text', label: 'NAICS Code / Industry', placeholder: 'e.g. 541511 — Custom Computer Programming', hint: 'Find yours at census.gov/naics' },
        { id: 'employer_total_employees', type: 'number', label: 'Total Number of Employees (US)', required: true, placeholder: '150', uscisRef: 'I-129 Part 1, Item 8' },
        { id: 'employer_gross_income', type: 'text', label: 'Gross Annual Income (USD)', required: true, placeholder: '$5,000,000' },
        { id: 'employer_net_income', type: 'text', label: 'Net Annual Income (USD)', required: true, placeholder: '$800,000' },
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
        { type: 'heading', id: 'h_contact', text: 'Primary Contact Person' } as any,
        { id: 'contact_name', type: 'text', label: 'Contact Full Name', required: true, placeholder: 'Jennifer Smith' },
        { id: 'contact_title', type: 'text', label: 'Contact Title / Role', required: true, placeholder: 'HR Manager' },
        { id: 'contact_phone', type: 'tel', label: 'Contact Phone', required: true, placeholder: '(555) 123-4567' },
        { id: 'contact_email', type: 'email', label: 'Contact Email', required: true, placeholder: 'hr@company.com' },
        { id: 'is_cap_exempt', type: 'radio', label: 'Is this employer cap-exempt?', required: true,
          hint: 'Universities, nonprofits affiliated with universities, and certain research institutions are cap-exempt',
          options: [{ value: 'yes', label: 'Yes — university, nonprofit, or research institution' }, { value: 'no', label: 'No — subject to the annual H-1B cap' }]
        },
      ],
    },

    // ── SECTION 2: BENEFICIARY (EMPLOYEE) ───────────────────
    {
      id: 2,
      title: 'Employee Information',
      subtitle: 'Personal details of the foreign national being sponsored',
      icon: '👤',
      fields: [
        { id: 'ben_last_name', type: 'text', label: 'Last Name (Family Name)', required: true, placeholder: 'Garcia', uscisRef: 'I-129 Part 2, Item 1' },
        { id: 'ben_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Maria' },
        { id: 'ben_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Elena' },
        { id: 'ben_other_names', type: 'text', label: 'Other Names Used (maiden name, aliases)', placeholder: 'Maria Lopez' },
        { id: 'ben_dob', type: 'date', label: 'Date of Birth', required: true, uscisRef: 'I-129 Part 2, Item 5' },
        { id: 'ben_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Mexico City' },
        { id: 'ben_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'Mexico' },
        { id: 'ben_nationality', type: 'text', label: 'Country of Citizenship / Nationality', required: true, placeholder: 'Mexico' },
        { id: 'ben_gender', type: 'radio', label: 'Gender', required: true, options: [
          { value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other / Prefer not to say' }
        ]},
        { id: 'ben_ssn', type: 'text', label: 'US Social Security Number (if any)', placeholder: 'XXX-XX-XXXX', hint: 'Leave blank if the employee does not have a SSN yet' },
        { type: 'heading', id: 'h_passport', text: 'Passport Details' } as any,
        { id: 'ben_passport_number', type: 'text', label: 'Passport Number', required: true, placeholder: 'G12345678', uscisRef: 'I-129 Part 2, Item 12' },
        { id: 'ben_passport_country', type: 'text', label: 'Country that Issued Passport', required: true, placeholder: 'Mexico' },
        { id: 'ben_passport_issued', type: 'date', label: 'Passport Issue Date', required: true },
        { id: 'ben_passport_expiry', type: 'date', label: 'Passport Expiry Date', required: true },
        { type: 'heading', id: 'h_address', text: 'Current Address' } as any,
        { id: 'ben_current_address', type: 'text', label: 'Street Address', required: true, placeholder: '456 Oak Avenue, Apt 2B' },
        { id: 'ben_current_city', type: 'text', label: 'City', required: true, placeholder: 'Chicago' },
        { id: 'ben_current_state', type: 'text', label: 'State / Province', required: true, placeholder: 'IL' },
        { id: 'ben_current_zip', type: 'text', label: 'ZIP / Postal Code', required: true, placeholder: '60601' },
        { id: 'ben_current_country', type: 'text', label: 'Country', required: true, placeholder: 'United States' },
        { type: 'heading', id: 'h_current_status', text: 'Current Immigration Status in the US' } as any,
        { id: 'ben_in_us', type: 'radio', label: 'Is the employee currently in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — currently outside the US' }]
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
        { id: 'ben_i94', type: 'text', label: 'I-94 Arrival/Departure Record Number', placeholder: '12345678901',
          showIf: { field: 'ben_in_us', value: 'yes' },
          hint: 'Find your I-94 at cbp.gov/i94'
        },
        { id: 'ben_status_expiry', type: 'date', label: 'Current Status Expiry Date (on I-94 or visa)',
          showIf: { field: 'ben_in_us', value: 'yes' }
        },
      ],
    },

    // ── SECTION 3: EDUCATION & QUALIFICATIONS ───────────────
    {
      id: 3,
      title: 'Education & Qualifications',
      subtitle: 'H-1B requires at least a US bachelor\'s degree or equivalent',
      icon: '🎓',
      fields: [
        { type: 'info', id: 'info_education', text: 'H-1B specialty occupation requires a minimum of a US bachelor\'s degree (or equivalent) in a field directly related to the job. List the highest degree first.' } as any,
        { id: 'edu_highest_degree', type: 'select', label: 'Highest Degree Earned', required: true, options: [
          { value: 'bachelors', label: "Bachelor's Degree (B.S., B.A., B.E., etc.)" },
          { value: 'masters', label: "Master's Degree (M.S., M.A., M.B.A., etc.)" },
          { value: 'doctorate', label: 'Doctorate (Ph.D., M.D., J.D., etc.)' },
          { value: 'associates', label: "Associate's Degree" },
          { value: 'diploma', label: 'Diploma / Certificate' },
          { value: 'equivalent', label: 'Foreign Equivalent (evaluated by NACES member)' },
        ], uscisRef: 'I-129 H Supplement, Part 2' },
        { id: 'edu_field_of_study', type: 'text', label: 'Field / Major of Study', required: true, placeholder: 'Computer Science', hint: 'Must be directly related to the job position' },
        { id: 'edu_institution', type: 'text', label: 'Name of University / College', required: true, placeholder: 'University of Texas at Austin' },
        { id: 'edu_institution_country', type: 'text', label: 'Country where Institution is Located', required: true, placeholder: 'United States' },
        { id: 'edu_graduation_date', type: 'date', label: 'Graduation Date', required: true },
        { id: 'edu_additional', type: 'textarea', label: 'Additional Degrees or Certifications (optional)', placeholder: 'List any other relevant degrees, licenses, or professional certifications...' },
        { id: 'edu_evaluation_needed', type: 'radio', label: 'Is a foreign credential evaluation needed?', required: true,
          hint: 'Required if degree is from outside the US',
          options: [{ value: 'yes', label: 'Yes — degree is from a foreign institution' }, { value: 'no', label: 'No — degree is from a US institution' }]
        },
        { id: 'edu_evaluator', type: 'text', label: 'Credential Evaluation Agency (if applicable)', placeholder: 'e.g. WES, ECE, NACES member',
          showIf: { field: 'edu_evaluation_needed', value: 'yes' }
        },
      ],
    },

    // ── SECTION 4: POSITION DETAILS ─────────────────────────
    {
      id: 4,
      title: 'Position Details',
      subtitle: 'Describe the specialty occupation role being offered',
      icon: '💼',
      fields: [
        { id: 'pos_job_title', type: 'text', label: 'Job Title', required: true, placeholder: 'Senior Software Engineer', uscisRef: 'I-129 Part 2, Item 3' },
        { id: 'pos_soc_code', type: 'text', label: 'SOC Code (Standard Occupational Classification)', required: true, placeholder: '15-1252', hint: 'Find the right code at bls.gov/soc' },
        { id: 'pos_soc_title', type: 'text', label: 'SOC Occupation Title', required: true, placeholder: 'Software Developers' },
        { id: 'pos_duties', type: 'textarea', label: 'Job Duties (detailed description)', required: true,
          placeholder: 'Describe the specific duties, responsibilities, and tasks. Be specific — this is critical for the LCA and I-129...',
          hint: 'Minimum 150 words. Be specific about technical duties, tools, and responsibilities.'
        },
        { id: 'pos_full_time', type: 'radio', label: 'Is this a full-time position?', required: true,
          options: [{ value: 'yes', label: 'Yes — full time (35+ hours/week)' }, { value: 'no', label: 'No — part time' }]
        },
        { id: 'pos_hours', type: 'number', label: 'Hours per Week', required: true, placeholder: '40' },
        { id: 'pos_wage_rate', type: 'text', label: 'Offered Wage / Salary', required: true, placeholder: '120,000', hint: 'Must meet or exceed the prevailing wage for this occupation in this location' },
        { id: 'pos_wage_unit', type: 'select', label: 'Wage Period', required: true, options: [
          { value: 'yearly', label: 'Per Year (Annual)' },
          { value: 'monthly', label: 'Per Month' },
          { value: 'biweekly', label: 'Bi-Weekly' },
          { value: 'weekly', label: 'Per Week' },
          { value: 'hourly', label: 'Per Hour' },
        ]},
        { id: 'pos_start_date', type: 'date', label: 'Requested Start Date', required: true, hint: 'H-1B cap cases start October 1. Cap-exempt can start sooner.' },
        { id: 'pos_end_date', type: 'date', label: 'Requested End Date', required: true, hint: 'Standard H-1B is 3 years, extendable to 6 years.' },
        { type: 'heading', id: 'h_work_location', text: 'Primary Work Location' } as any,
        { id: 'pos_same_address', type: 'radio', label: 'Is the work location the same as the company address?', required: true,
          options: [{ value: 'yes', label: 'Yes — same address' }, { value: 'no', label: 'No — different location' }]
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
        { id: 'pos_work_zip', type: 'text', label: 'ZIP Code', placeholder: '78701',
          showIf: { field: 'pos_same_address', value: 'no' }
        },
        { id: 'pos_remote', type: 'radio', label: 'Will the employee work remotely?', required: true,
          options: [
            { value: 'no', label: 'No — fully on-site' },
            { value: 'hybrid', label: 'Hybrid — mix of remote and on-site' },
            { value: 'yes', label: 'Yes — fully remote' },
          ]
        },
      ],
    },

    // ── SECTION 5: IMMIGRATION HISTORY ──────────────────────
    {
      id: 5,
      title: 'Immigration History',
      subtitle: 'Prior US immigration history of the employee',
      icon: '📋',
      fields: [
        { id: 'hist_prev_us', type: 'radio', label: 'Has the employee previously lived or worked in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_details', type: 'textarea', label: 'Previous US Stays (visa type, dates, employer)',
          placeholder: 'e.g. F-1 student visa Aug 2018 – May 2022, University of Michigan. OPT May 2022 – May 2023, Google Inc.',
          showIf: { field: 'hist_prev_us', value: 'yes' }
        },
        { id: 'hist_prev_h1b', type: 'radio', label: 'Has the employee previously held H-1B status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_h1b_details', type: 'textarea', label: 'Previous H-1B Details (employer, dates, cap-subject or cap-exempt)',
          placeholder: 'e.g. Amazon.com Inc., Oct 2020 – Sep 2023, cap-subject...',
          showIf: { field: 'hist_prev_h1b', value: 'yes' }
        },
        { id: 'hist_h1b_time_remaining', type: 'radio', label: 'Does the employee have remaining H-1B time (cap exemption for transfers)?',
          showIf: { field: 'hist_prev_h1b', value: 'yes' },
          options: [{ value: 'yes', label: 'Yes — they have H-1B time remaining (portability)' }, { value: 'no', label: 'No — 6-year limit reached or recaptured time' }]
        },
        { id: 'hist_denial', type: 'radio', label: 'Has any immigration petition or application ever been denied?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_denial_details', type: 'textarea', label: 'Denial Details (what was denied, when, and reason if known)',
          showIf: { field: 'hist_denial', value: 'yes' }
        },
        { id: 'hist_violation', type: 'radio', label: 'Has the employee ever overstayed a visa or violated immigration status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_violation_details', type: 'textarea', label: 'Violation Details',
          showIf: { field: 'hist_violation', value: 'yes' }
        },
        { id: 'hist_criminal', type: 'radio', label: 'Does the employee have any criminal history (arrests, charges, convictions) in any country?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_criminal_details', type: 'textarea', label: 'Criminal History Details',
          hint: 'Include minor offenses — your attorney will advise on what is relevant',
          showIf: { field: 'hist_criminal', value: 'yes' }
        },
        { id: 'hist_deportation', type: 'radio', label: 'Has the employee ever been deported or removed from any country?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_deportation_details', type: 'textarea', label: 'Deportation Details',
          showIf: { field: 'hist_deportation', value: 'yes' }
        },
      ],
    },

    // ── SECTION 6: DOCUMENTS CHECKLIST ──────────────────────
    {
      id: 6,
      title: 'Documents Checklist',
      subtitle: 'Confirm which documents you have ready to upload',
      icon: '📁',
      fields: [
        { type: 'info', id: 'info_docs', text: 'Check all documents you currently have available. You can still upload missing documents later through your Documents page, but having these ready speeds up processing.' } as any,
        { type: 'heading', id: 'h_employer_docs', text: 'Employer Documents' } as any,
        { id: 'doc_support_letter', type: 'checkbox', label: 'Support Letter from Employer (on company letterhead, describing the position)' },
        { id: 'doc_org_chart', type: 'checkbox', label: 'Organizational Chart showing the position' },
        { id: 'doc_financial_statements', type: 'checkbox', label: 'Company Financial Statements (most recent year)' },
        { id: 'doc_ein_letter', type: 'checkbox', label: 'IRS EIN Confirmation Letter' },
        { id: 'doc_state_license', type: 'checkbox', label: 'Business License / State Registration' },
        { type: 'heading', id: 'h_employee_docs', text: 'Employee Documents' } as any,
        { id: 'doc_passport', type: 'checkbox', label: 'Valid Passport (all pages, expiry at least 6 months beyond stay)' },
        { id: 'doc_i94', type: 'checkbox', label: 'I-94 Arrival Record (print from cbp.gov/i94)' },
        { id: 'doc_current_visa', type: 'checkbox', label: 'Copy of Current Visa Stamp' },
        { id: 'doc_degree', type: 'checkbox', label: 'Degree Certificate(s) and Transcripts' },
        { id: 'doc_evaluation', type: 'checkbox', label: 'Foreign Credential Evaluation (if degree is from outside the US)' },
        { id: 'doc_resume', type: 'checkbox', label: 'Current Resume / CV' },
        { id: 'doc_prev_paystubs', type: 'checkbox', label: 'Previous Pay Stubs (last 3 months, if employed in US)' },
        { id: 'doc_prev_w2', type: 'checkbox', label: 'Previous W-2 / Tax Returns (if employed in US)' },
        { id: 'doc_prev_h1b', type: 'checkbox', label: 'Previous H-1B Approval Notices (I-797) if applicable' },
        { type: 'heading', id: 'h_additional', text: 'Additional Notes' } as any,
        { id: 'additional_notes', type: 'textarea', label: 'Anything else the attorney should know about this case?', placeholder: 'Any special circumstances, timing requirements, family members, or other relevant information...' },
      ],
    },
  ],
}
