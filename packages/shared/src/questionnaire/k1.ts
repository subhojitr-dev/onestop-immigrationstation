/**
 * lib/questionnaire/k1.ts
 *
 * K-1 Fiancé(e) Visa intake questionnaire.
 *
 * Who fills this:
 *   The US CITIZEN petitioner (sponsor) fills this on behalf of themselves and
 *   their foreign-national fiancé(e). There is no employer sponsor — this is
 *   a personal relationship petition.
 *
 *   ATTORNEY determines:
 *     - Whether income meets the poverty guideline threshold (I-864A if needed)
 *     - Whether any waivers are required for prior violations
 *
 * USCIS forms:
 *   - I-129F (Petition for Alien Fiancé(e)) — filed by US citizen
 *   - DS-160 (Online Nonimmigrant Visa Application) — filed by fiancé(e) at US consulate
 *   - I-134 (Declaration of Financial Support) — filed by US citizen petitioner
 *
 * 4 Sections:
 *   1. US Petitioner (the US citizen)        — personal info, address, income
 *   2. Fiancé(e) Information                 — personal, passport, address
 *   3. Relationship History                  — how you met, prior marriages
 *   4. Documents Checklist
 *
 * Note: No employer EIN, NAICS, or employee count — this is not an employment visa.
 */
import type { VisaQuestionnaire } from './types'

export const k1Questionnaire: VisaQuestionnaire = {
  visaType: 'k1',
  label: 'K-1 Fiancé(e) Visa',
  description: 'For US citizens bringing their foreign-national fiancé(e) to the US to marry within 90 days.',
  estimatedMinutes: 10,
  uscisforms: ['I-129F', 'DS-160', 'I-134'],
  sections: [

    // ── SECTION 1: US PETITIONER ─────────────────────────────
    {
      id: 1,
      title: 'US Petitioner (The US Citizen)',
      subtitle: 'Information about the US citizen filing this petition',
      icon: '🇺🇸',
      fields: [
        { type: 'info', id: 'info_petitioner', text: 'This section is about you — the US citizen sponsoring the visa. Your attorney handles the income verification details; just provide your basic information here.' } as any,

        { id: 'pet_last_name', type: 'text', label: 'Last Name', required: true, placeholder: 'Johnson', uscisRef: 'I-129F Part 2, Item 1' },
        { id: 'pet_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Michael' },
        { id: 'pet_middle_name', type: 'text', label: 'Middle Name', placeholder: 'James' },
        { id: 'pet_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'pet_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Chicago' },
        { id: 'pet_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'United States' },
        { id: 'pet_ssn', type: 'text', label: 'US Social Security Number', required: true, placeholder: 'XXX-XX-XXXX' },

        { type: 'heading', id: 'h_pet_address', text: 'Your US Address' } as any,
        { id: 'pet_street', type: 'text', label: 'Street Address', required: true, placeholder: '123 Maple Street, Apt 4' },
        { id: 'pet_city', type: 'text', label: 'City', required: true, placeholder: 'Chicago' },
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
        { id: 'pet_zip', type: 'text', label: 'ZIP Code', required: true, placeholder: '60601' },

        { type: 'heading', id: 'h_pet_employment', text: 'Employment & Income' } as any,
        { type: 'info', id: 'info_income', text: 'You must show income at least 100% of the federal poverty guideline for your household size. Your attorney will calculate the exact amount needed. Just provide your income and employment info.' } as any,
        { id: 'pet_employed', type: 'radio', label: 'Are you currently employed?', required: true,
          options: [
            { value: 'yes_employee', label: 'Yes — employed (W-2 employee)' },
            { value: 'yes_self', label: 'Yes — self-employed or business owner' },
            { value: 'no', label: 'No — retired, student, or unemployed' },
          ]
        },
        { id: 'pet_employer_name', type: 'text', label: 'Employer Name',
          showIf: { field: 'pet_employed', value: 'yes_employee' },
          placeholder: 'Acme Corp'
        },
        { id: 'pet_job_title', type: 'text', label: 'Job Title',
          showIf: { field: 'pet_employed', value: ['yes_employee', 'yes_self'] },
          placeholder: 'Marketing Manager'
        },
        // Gross income shown on tax return — petitioner knows this from their own finances
        { id: 'pet_annual_income', type: 'text', label: 'Annual Income (USD)', required: true, placeholder: '65,000',
          hint: 'Your gross annual income. If retired, include pension/Social Security. If unemployed, enter 0.'
        },
        { id: 'pet_household_size', type: 'number', label: 'Household size (including yourself and your fiancé(e))', required: true,
          placeholder: '2', hint: 'Count yourself, your fiancé(e), and any dependents already living with you'
        },

        { type: 'heading', id: 'h_pet_prior_marriage', text: 'Prior Marriages' } as any,
        { id: 'pet_prior_marriages', type: 'radio', label: 'Have you been previously married?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'pet_prior_marriage_count', type: 'number', label: 'How many times?',
          showIf: { field: 'pet_prior_marriages', value: 'yes' }, placeholder: '1'
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

    // ── SECTION 2: FIANCÉ(E) INFORMATION ────────────────────
    {
      id: 2,
      title: 'Your Fiancé(e)',
      subtitle: 'Information about your foreign-national fiancé(e)',
      icon: '💍',
      fields: [
        { id: 'ben_last_name', type: 'text', label: 'Last Name', required: true, placeholder: 'Nguyen', uscisRef: 'I-129F Part 3, Item 1' },
        { id: 'ben_first_name', type: 'text', label: 'First Name', required: true, placeholder: 'Linh' },
        { id: 'ben_middle_name', type: 'text', label: 'Middle Name', placeholder: 'Thu' },
        { id: 'ben_other_names', type: 'text', label: 'Other names used', placeholder: 'Maiden name or aliases' },
        { id: 'ben_dob', type: 'date', label: 'Date of Birth', required: true },
        { id: 'ben_city_of_birth', type: 'text', label: 'City of Birth', required: true, placeholder: 'Ho Chi Minh City' },
        { id: 'ben_country_of_birth', type: 'text', label: 'Country of Birth', required: true, placeholder: 'Vietnam' },
        { id: 'ben_nationality', type: 'text', label: 'Country of Citizenship', required: true, placeholder: 'Vietnam' },

        { type: 'heading', id: 'h_ben_passport', text: 'Fiancé(e) Passport' } as any,
        { id: 'ben_passport_number', type: 'text', label: 'Passport Number', required: true, placeholder: 'B12345678' },
        { id: 'ben_passport_country', type: 'text', label: 'Passport Issuing Country', required: true, placeholder: 'Vietnam' },
        { id: 'ben_passport_expiry', type: 'date', label: 'Passport Expiry Date', required: true },

        { type: 'heading', id: 'h_ben_address', text: 'Fiancé(e) Current Address' } as any,
        { id: 'ben_current_address', type: 'text', label: 'Street Address', required: true, placeholder: '45 Nguyen Hue Street' },
        { id: 'ben_current_city', type: 'text', label: 'City', required: true, placeholder: 'Ho Chi Minh City' },
        { id: 'ben_current_country', type: 'text', label: 'Country', required: true, placeholder: 'Vietnam' },

        { type: 'heading', id: 'h_ben_prior_marriage', text: 'Fiancé(e) Prior Marriages' } as any,
        { id: 'ben_prior_marriages', type: 'radio', label: 'Has your fiancé(e) been previously married?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'ben_prior_marriage_end', type: 'select', label: 'How did the most recent prior marriage end?',
          showIf: { field: 'ben_prior_marriages', value: 'yes' },
          options: [
            { value: 'divorce', label: 'Divorce' },
            { value: 'annulment', label: 'Annulment' },
            { value: 'death', label: 'Death of spouse' },
          ]
        },

        { id: 'ben_children', type: 'radio', label: 'Does your fiancé(e) have children under 21?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
        },
        { id: 'ben_children_count', type: 'number', label: 'How many children?',
          showIf: { field: 'ben_children', value: 'yes' }, placeholder: '1'
        },
        { id: 'ben_children_travel', type: 'radio', label: 'Will any children travel to the US with your fiancé(e)?',
          showIf: { field: 'ben_children', value: 'yes' },
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'some', label: 'Some of them' }]
        },
      ],
    },

    // ── SECTION 3: RELATIONSHIP HISTORY ─────────────────────
    {
      id: 3,
      title: 'Your Relationship',
      subtitle: 'How you met and your history together — USCIS will review this',
      icon: '❤️',
      fields: [
        { type: 'info', id: 'info_relationship', text: 'USCIS requires that the relationship is bona fide. They will review how you met, how often you\'ve been in contact, and whether you have met in person. Be honest and specific.' } as any,

        { id: 'rel_how_met', type: 'textarea', label: 'How did you meet?', required: true,
          placeholder: 'e.g. We met on an international dating app in March 2022, began video calling weekly, and met in person in Vietnam in July 2022...',
          hint: 'Include when and where you first met, how you stayed in contact'
        },
        { id: 'rel_met_in_person', type: 'radio', label: 'Have you met each other in person within the last 2 years?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No — we have not met in person' }]
        },
        { type: 'info', id: 'info_met', text: 'K-1 requires that the petitioner and fiancé(e) have met in person within 2 years of filing. If you have not met, a waiver may be requested on the basis of extreme hardship or custom/religious exemption — discuss with your attorney.' } as any,
        { id: 'rel_in_person_date', type: 'date', label: 'Date of most recent in-person meeting',
          showIf: { field: 'rel_met_in_person', value: 'yes' }
        },
        { id: 'rel_in_person_country', type: 'text', label: 'Country where you last met in person',
          showIf: { field: 'rel_met_in_person', value: 'yes' },
          placeholder: 'Vietnam'
        },
        { id: 'rel_engaged_date', type: 'date', label: 'Date of engagement', required: true },
        { id: 'rel_engaged_where', type: 'text', label: 'Country where engagement took place', required: true, placeholder: 'Vietnam' },
        { id: 'rel_communication', type: 'textarea', label: 'How do you stay in contact?', required: true,
          placeholder: 'e.g. Daily video calls on WhatsApp, visited 3 times in 2023...',
          hint: 'Evidence of ongoing communication is important for the USCIS interview'
        },
        { id: 'rel_intent_to_marry', type: 'radio', label: 'Do you intend to marry within 90 days of your fiancé(e) entering the US?', required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }, { value: 'unsure', label: 'Not sure on timing' }]
        },
        { id: 'rel_cohabitation', type: 'radio', label: 'Have you ever lived together?',
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }]
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
        { type: 'info', id: 'info_docs', text: 'Check everything you currently have. Missing items can be gathered later.' } as any,

        { type: 'heading', id: 'h_pet_docs', text: 'US Petitioner Documents' } as any,
        { id: 'doc_pet_passport', type: 'checkbox', label: 'US passport or proof of US citizenship (birth certificate, naturalization certificate)' },
        { id: 'doc_pet_birth', type: 'checkbox', label: 'US birth certificate' },
        { id: 'doc_pet_divorce', type: 'checkbox', label: 'Divorce decree(s) from prior marriages (if applicable)' },
        { id: 'doc_pet_tax', type: 'checkbox', label: 'Most recent federal tax return (for I-134 financial support)' },
        { id: 'doc_pet_pay_stubs', type: 'checkbox', label: 'Recent pay stubs (3 months)' },
        { id: 'doc_pet_employer_letter', type: 'checkbox', label: 'Employer verification letter stating job title and salary' },

        { type: 'heading', id: 'h_ben_docs', text: 'Fiancé(e) Documents' } as any,
        { id: 'doc_ben_passport', type: 'checkbox', label: 'Fiancé(e)\'s valid passport' },
        { id: 'doc_ben_birth', type: 'checkbox', label: 'Fiancé(e)\'s birth certificate (with certified translation if not in English)' },
        { id: 'doc_ben_divorce', type: 'checkbox', label: 'Fiancé(e)\'s divorce decree(s) from prior marriages (if applicable)' },
        { id: 'doc_ben_police', type: 'checkbox', label: 'Police clearance certificate from fiancé(e)\'s country' },
        { id: 'doc_ben_medical', type: 'checkbox', label: 'Medical exam results (done at a USCIS-approved physician)' },

        { type: 'heading', id: 'h_relationship_docs', text: 'Relationship Evidence' } as any,
        { id: 'doc_photos', type: 'checkbox', label: 'Photos of you together (at least 3–5, various dates)' },
        { id: 'doc_messages', type: 'checkbox', label: 'Communication records (chat screenshots, call logs — select samples)' },
        { id: 'doc_travel', type: 'checkbox', label: 'Proof of trips to visit each other (flight itineraries, hotel bookings, stamps)' },

        { type: 'heading', id: 'h_notes', text: 'Anything else?' } as any,
        { id: 'additional_notes', type: 'textarea', label: 'Additional notes for your attorney (optional)',
          placeholder: 'Cultural/religious objections to in-person meeting, language barriers at interview, timeline concerns, children\'s travel...'
        },
      ],
    },
  ],
}
