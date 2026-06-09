/**
 * lib/questionnaire/family_petition.ts
 *
 * Family-Based Immigration intake questionnaire.
 *
 * Who fills this:
 *   The US CITIZEN or PERMANENT RESIDENT petitioner fills on behalf of themselves
 *   and the family member they are sponsoring. No employer involved.
 *
 *   ATTORNEY determines:
 *     - Which family preference category applies (Immediate Relative vs F-1/F-2/F-3/F-4)
 *     - Whether concurrent filing (I-130 + I-485) is possible based on visa bulletin
 *     - Whether Affidavit of Support meets the 125% poverty threshold
 *
 * USCIS forms:
 *   - I-130 (Petition for Alien Relative) — filed by US citizen or LPR petitioner
 *   - I-485 (Adjustment of Status) — filed by beneficiary if in the US
 *   - I-864 (Affidavit of Support) — financial sponsor's obligation
 *   - DS-260 (Immigrant Visa Application) — filed by beneficiary if abroad (consular processing)
 *
 * No employer EIN, NAICS, employee counts, or income figures needed from beneficiary.
 * Petitioner's income is relevant for I-864 but only approximate at intake — attorney
 * will verify with actual tax returns.
 *
 * 4 Sections:
 *   1. Petitioner (US citizen or LPR)     — personal info, relationship to beneficiary, income
 *   2. Beneficiary (family member)        — personal, passport, current location
 *   3. Relationship & History             — how you are related, prior immigration
 *   4. Documents Checklist
 */
import type { VisaQuestionnaire } from './types'

export const familyPetitionQuestionnaire: VisaQuestionnaire = {
  visaType: 'family_petition',
  label: 'Family-Based Immigration',
  description: 'For US citizens or permanent residents sponsoring a spouse, child, parent, or sibling.',
  estimatedMinutes: 10,
  uscisforms: ['I-130', 'I-485 (if in US)', 'I-864', 'DS-260 (if abroad)'],
  sections: [

    // ── SECTION 1: PETITIONER ────────────────────────────────
    {
      id: 1,
      title: 'About You (The Petitioner)',
      subtitle: 'You are the US citizen or permanent resident sponsoring a family member',
      icon: '🇺🇸',
      fields: [
        { type: 'info', id: 'info_petitioner', text: 'You are the petitioner — the US citizen or green card holder sponsoring your family member. Your attorney will handle exact income calculations for the I-864; just give us your basic information here.' } as any,

        { id: 'pet_last_name', type: 'text', label: 'Last Name', required: true, placeholder: 'Rodriguez', uscisRef: 'I-130 Part 1, Item 1' },
        { id: 'pet_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Carlos' },
        { id: 'pet_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Miguel' },
        { id: 'pet_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'pet_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'Mexico' },
        { id: 'pet_nationality', type: 'text', label: 'Current Citizenship', required: true, placeholder: 'United States' },
        { id: 'pet_ssn', type: 'text', label: 'US Social Security Number', required: true, placeholder: 'XXX-XX-XXXX' },

        { type: 'heading', id: 'h_pet_status', text: 'Your US Status' } as any,
        { id: 'pet_us_status', type: 'radio', label: 'What is your current status in the US?', required: true,
          options: [
            { value: 'citizen_birth', label: 'US Citizen (by birth)' },
            { value: 'citizen_naturalized', label: 'US Citizen (naturalized)' },
            { value: 'lpr', label: 'Lawful Permanent Resident (green card holder)' },
          ]
        },
        { id: 'pet_naturalization_number', type: 'text', label: 'Naturalization Certificate Number (optional)',
          showIf: { field: 'pet_us_status', value: 'citizen_naturalized' },
          placeholder: 'AXXXXXXXX'
        },
        { id: 'pet_green_card_number', type: 'text', label: 'Alien Registration Number (A-Number) from Green Card',
          showIf: { field: 'pet_us_status', value: 'lpr' },
          placeholder: 'AXXXXXXXXX'
        },

        { type: 'heading', id: 'h_pet_address', text: 'Your US Address' } as any,
        { id: 'pet_street', type: 'text', label: 'Street Address', required: true, placeholder: '789 Palm Avenue, Unit 2' },
        { id: 'pet_city', type: 'text', label: 'City', required: true, placeholder: 'Miami' },
        { id: 'pet_state', type: 'select', label: 'State', required: true, options: [
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
        { id: 'pet_zip', type: 'text', label: 'ZIP Code', required: true, placeholder: '33101' },

        { type: 'heading', id: 'h_pet_finances', text: 'Your Finances (for Affidavit of Support)' } as any,
        { type: 'info', id: 'info_finances', text: 'The I-864 Affidavit of Support requires your income to be at least 125% of the federal poverty guideline. Your attorney will verify this with your tax returns — just give us the approximate figure.' } as any,
        { id: 'pet_annual_income', type: 'text', label: 'Approximate Annual Income (USD)', required: true, placeholder: '55,000' },
        { id: 'pet_household_size', type: 'number', label: 'Household size (including yourself and the beneficiary you are sponsoring)', required: true, placeholder: '3' },
        // Employer name is optional context — not required for I-864 at intake
        { id: 'pet_employer', type: 'text', label: 'Employer Name (optional)', placeholder: 'Acme Corp or Self-employed' },

        { type: 'heading', id: 'h_pet_prior', text: 'Prior Marriages' } as any,
        { id: 'pet_prior_marriages', type: 'radio', label: 'Have you been previously married?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'pet_prior_marriage_end', type: 'select', label: 'How did your most recent prior marriage end?',
          showIf: { field: 'pet_prior_marriages', value: 'yes' },
          options: [
            { value: 'divorce', label: 'Divorce' },
            { value: 'annulment', label: 'Annulment' },
            { value: 'death', label: 'Death of spouse' },
          ]
        },
      ],
    },

    // ── SECTION 2: BENEFICIARY (FAMILY MEMBER) ──────────────
    {
      id: 2,
      title: 'About Your Family Member',
      subtitle: 'The person you are sponsoring for immigration',
      icon: '👨‍👩‍👧',
      fields: [
        { id: 'ben_last_name', type: 'text', label: 'Last Name', required: true, placeholder: 'Rodriguez', uscisRef: 'I-130 Part 3, Item 1' },
        { id: 'ben_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Maria' },
        { id: 'ben_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Elena' },
        { id: 'ben_other_names', type: 'text', label: 'Other names (maiden name, aliases)', placeholder: 'Maria Lopez' },
        { id: 'ben_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'ben_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Mexico City' },
        { id: 'ben_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'Mexico' },
        { id: 'ben_nationality', type: 'text', label: 'Country of Citizenship', required: true, placeholder: 'Mexico' },
        { id: 'ben_gender', type: 'radio', label: 'Gender', required: true,
          options: [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other / Prefer not to say' }]
        },

        { type: 'heading', id: 'h_ben_passport', text: 'Passport' } as any,
        { id: 'ben_passport_number', type: 'text', label: 'Passport Number', required: true, placeholder: 'G12345678' },
        { id: 'ben_passport_country', type: 'text', label: 'Passport Issuing Country', required: true, placeholder: 'Mexico' },
        { id: 'ben_passport_expiry', type: 'date', label: 'Passport Expiry Date', required: true },

        { type: 'heading', id: 'h_ben_location', text: 'Current Location' } as any,
        { id: 'ben_in_us', type: 'radio', label: 'Is your family member currently in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes — currently in the US' }, { value: 'no', label: 'No — currently abroad' }]
        },
        // Consular vs adjustment of status — determines which form (I-485 vs DS-260) is filed
        { type: 'info', id: 'info_location', text: 'If your family member is in the US, they may be able to Adjust Status (file I-485). If abroad, they will go through Consular Processing at a US embassy. Your attorney will advise on which is better in your situation.' } as any,
        { id: 'ben_current_address', type: 'text', label: 'Current Street Address', required: true, placeholder: '123 Reforma Ave' },
        { id: 'ben_current_city', type: 'text', label: 'City', required: true, placeholder: 'Mexico City' },
        { id: 'ben_current_country', type: 'text', label: 'Country', required: true, placeholder: 'Mexico' },
        { id: 'ben_current_status', type: 'select', label: 'Current US immigration status (if in the US)',
          showIf: { field: 'ben_in_us', value: 'yes' },
          options: [
            { value: 'b1b2', label: 'B-1/B-2 (visitor)' },
            { value: 'f1', label: 'F-1 (student)' },
            { value: 'h1b', label: 'H-1B' },
            { value: 'l1', label: 'L-1' },
            { value: 'ead', label: 'EAD / Work permit' },
            { value: 'pending', label: 'Pending some other application' },
            { value: 'other', label: 'Other' },
          ]
        },

        { type: 'heading', id: 'h_ben_family', text: 'Beneficiary\'s Family' } as any,
        { id: 'ben_married', type: 'radio', label: 'Is your family member married?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'ben_spouse_name', type: 'text', label: 'Spouse\'s full name',
          showIf: { field: 'ben_married', value: 'yes' }, placeholder: 'Jose Rodriguez'
        },
        { id: 'ben_children', type: 'radio', label: 'Does your family member have children under 21?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'ben_children_details', type: 'textarea', label: 'List children\'s names and dates of birth',
          showIf: { field: 'ben_children', value: 'yes' },
          placeholder: 'Sofia Rodriguez — Jan 5, 2015\nLuis Rodriguez — Mar 12, 2018'
        },
      ],
    },

    // ── SECTION 3: RELATIONSHIP & HISTORY ───────────────────
    {
      id: 3,
      title: 'Relationship & History',
      subtitle: 'Your relationship to the family member and their immigration history',
      icon: '📋',
      fields: [
        { id: 'rel_type', type: 'select', label: 'What is your relationship to the person you are sponsoring?', required: true, options: [
          { value: 'spouse', label: 'Spouse (husband/wife)' },
          { value: 'child_under_21', label: 'Unmarried child under 21' },
          { value: 'child_over_21', label: 'Unmarried son/daughter 21 or older' },
          { value: 'married_child', label: 'Married son/daughter (any age)' },
          { value: 'parent', label: 'Parent (US citizen only)' },
          { value: 'sibling', label: 'Brother/Sister (US citizen only)' },
        ]},

        // Spouse-specific
        { id: 'rel_marriage_date', type: 'date', label: 'Date of marriage',
          showIf: { field: 'rel_type', value: 'spouse' }, required: false
        },
        { id: 'rel_marriage_country', type: 'text', label: 'Country where married',
          showIf: { field: 'rel_type', value: 'spouse' }, placeholder: 'Mexico'
        },
        { id: 'rel_cohabitation', type: 'radio', label: 'Are you currently living together?',
          showIf: { field: 'rel_type', value: 'spouse' },
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — living apart' }]
        },
        { id: 'rel_how_met', type: 'textarea', label: 'How did you meet? (for spouse petitions)',
          showIf: { field: 'rel_type', value: 'spouse' },
          placeholder: 'e.g. Met in college in Mexico City in 2015, married in 2018...'
        },

        { type: 'heading', id: 'h_history', text: 'Beneficiary\'s Immigration History' } as any,
        { id: 'hist_prev_us', type: 'radio', label: 'Has your family member previously lived or worked in the United States?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prev_details', type: 'textarea', label: 'Describe previous US stays',
          showIf: { field: 'hist_prev_us', value: 'yes' },
          placeholder: 'e.g. B-2 visitor visa 2019, TN status 2021–2023...'
        },
        { id: 'hist_prior_petition', type: 'radio', label: 'Has an I-130 petition ever been filed for this person before?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_prior_petition_details', type: 'textarea', label: 'What happened with the prior petition?',
          showIf: { field: 'hist_prior_petition', value: 'yes' },
          placeholder: 'e.g. I-130 approved in 2020, never proceeded to visa application...'
        },
        { id: 'hist_denial', type: 'radio', label: 'Has any immigration application ever been denied for this person?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_denial_details', type: 'textarea', label: 'What was denied and why?',
          showIf: { field: 'hist_denial', value: 'yes' }
        },
        { id: 'hist_violation', type: 'radio', label: 'Has your family member ever overstayed a visa or been in the US without status?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_violation_details', type: 'textarea', label: 'Please explain',
          showIf: { field: 'hist_violation', value: 'yes' },
          hint: 'Unlawful presence bars can affect eligibility — your attorney will advise on waivers'
        },
        { id: 'hist_criminal', type: 'radio', label: 'Does your family member have any criminal history in any country?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'hist_criminal_details', type: 'textarea', label: 'Please explain',
          showIf: { field: 'hist_criminal', value: 'yes' }
        },
      ],
    },

    // ── SECTION 4: DOCUMENTS CHECKLIST ──────────────────────
    {
      id: 4,
      title: 'Documents You Have Ready',
      subtitle: 'Check what you currently have — your attorney will tell you what else is needed',
      icon: '📁',
      fields: [
        { type: 'info', id: 'info_docs', text: 'Check everything you currently have. Your attorney will give you a complete document list for your specific relationship type.' } as any,

        { type: 'heading', id: 'h_pet_docs', text: 'Petitioner (Your) Documents' } as any,
        { id: 'doc_pet_citizenship', type: 'checkbox', label: 'Proof of US citizenship or green card (passport, naturalization cert, or I-551)' },
        { id: 'doc_pet_birth', type: 'checkbox', label: 'Your birth certificate' },
        { id: 'doc_pet_marriage', type: 'checkbox', label: 'Marriage certificate (if sponsoring spouse)' },
        { id: 'doc_pet_divorce', type: 'checkbox', label: 'Divorce decree(s) from prior marriages (if applicable)' },
        { id: 'doc_pet_tax', type: 'checkbox', label: 'Most recent federal tax return (for I-864)' },
        { id: 'doc_pet_pay_stubs', type: 'checkbox', label: 'Pay stubs from last 3 months' },
        { id: 'doc_pet_employer_letter', type: 'checkbox', label: 'Employer letter stating title and salary' },

        { type: 'heading', id: 'h_ben_docs', text: 'Beneficiary (Family Member) Documents' } as any,
        { id: 'doc_ben_passport', type: 'checkbox', label: 'Valid passport' },
        { id: 'doc_ben_birth', type: 'checkbox', label: 'Birth certificate (with certified translation if not in English)' },
        { id: 'doc_ben_marriage', type: 'checkbox', label: 'Marriage certificate (if applicable)' },
        { id: 'doc_ben_divorce', type: 'checkbox', label: 'Divorce decree(s) from prior marriages (if applicable)' },
        { id: 'doc_ben_police', type: 'checkbox', label: 'Police clearance certificate from home country' },
        { id: 'doc_ben_photos', type: 'checkbox', label: 'Passport-style photos' },

        { type: 'heading', id: 'h_relationship_docs', text: 'Relationship Evidence (for spouse petitions)' } as any,
        { id: 'doc_photos_together', type: 'checkbox', label: 'Photos of you together (various dates and places)' },
        { id: 'doc_communication', type: 'checkbox', label: 'Communication records (messages, calls — select samples)' },
        { id: 'doc_joint_finances', type: 'checkbox', label: 'Joint financial accounts, joint lease, or shared bills' },
        { id: 'doc_travel_records', type: 'checkbox', label: 'Travel records showing visits to each other' },

        { type: 'heading', id: 'h_notes', text: 'Anything else?' } as any,
        { id: 'additional_notes', type: 'textarea', label: 'Additional notes for your attorney (optional)',
          placeholder: 'Unlawful presence concerns, prior bars, children\'s travel plans, consular post preferences, timing needs...'
        },
      ],
    },
  ],
}
