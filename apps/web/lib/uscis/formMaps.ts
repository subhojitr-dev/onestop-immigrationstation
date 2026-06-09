/**
 * lib/uscis/formMaps.ts
 *
 * Maps questionnaire answer field IDs → USCIS form parts and item numbers
 * for each supported visa type.
 *
 * Each FormField can either:
 *   - Pull directly from answers via `sourceField`
 *   - Compute a value from multiple answers via `compute(answers)`
 *   - Be flagged as `attorneyCompletes: true` (shown as blank, highlighted in yellow)
 *
 * Part/item numbering matches the official USCIS form exactly so lawyers
 * can transfer values field-by-field without hunting for where things go.
 */

export interface FormField {
  item: string                               // e.g. "1a", "2", "3"
  label: string                              // official USCIS form label
  sourceField?: string                       // questionnaire answer key
  compute?: (a: Record<string, any>) => string // transform / combine fields
  attorneyCompletes?: boolean                // no client data — attorney fills
  note?: string                              // shown below the value in grey
}

export interface FormPart {
  number: number
  title: string
  fields: FormField[]
}

export interface FormDefinition {
  formNumber: string    // e.g. "I-129"
  supplement?: string   // e.g. "H Classification Supplement"
  title: string
  visaType: string
  disclaimer: string
  parts: FormPart[]
}

// ─── Helper ──────────────────────────────────────────────────────────────────

function addr(street: string, city: string, state: string, zip: string, country?: string) {
  return (a: Record<string, any>) => {
    const parts = [a[street], a[city], a[state] ? `${a[state]} ${a[zip] || ''}`.trim() : a[zip]].filter(Boolean)
    if (country && a[country] && a[country] !== 'United States') parts.push(a[country])
    return parts.join(', ')
  }
}

function fullName(last: string, first: string, middle?: string) {
  return (a: Record<string, any>) => [a[first], middle ? a[middle] : undefined, a[last]].filter(Boolean).join(' ')
}

function yesNo(field: string) {
  return (a: Record<string, any>) => {
    const v = a[field]
    if (v === 'yes' || v === true) return 'Yes'
    if (v === 'no' || v === false) return 'No'
    return v ?? ''
  }
}

// ─── I-129 (H-1B Specialty Occupation) ────────────────────────────────────

export const i129: FormDefinition = {
  formNumber: 'I-129',
  supplement: 'H Classification Supplement (H-1B)',
  title: 'Petition for a Nonimmigrant Worker — H-1B Specialty Occupation',
  visaType: 'h1b',
  disclaimer: 'This pre-fill data sheet is prepared from client intake data. Attorney must review all values, complete attorney-only fields, and sign the official USCIS I-129 form before filing.',
  parts: [
    {
      number: 1,
      title: 'Petitioner Information (Employer)',
      fields: [
        { item: '1a', label: 'Legal Name of Organization (Employer)', sourceField: 'employer_legal_name' },
        { item: '1b', label: 'Trade Name / DBA (if different)', sourceField: 'employer_trade_name' },
        { item: '2',  label: 'Federal Employer Identification Number (EIN)', sourceField: 'employer_ein', note: 'If blank, obtain from HR before filing' },
        { item: '3',  label: 'Type of Petitioner', sourceField: 'employer_business_type' },
        { item: '4',  label: 'Year Established', attorneyCompletes: true },
        { item: '5',  label: 'Current Number of Employees in the US', attorneyCompletes: true, note: 'Obtain from HR' },
        { item: '6',  label: 'Gross Annual Income', attorneyCompletes: true, note: 'Obtain from HR' },
        { item: '7',  label: 'Net Annual Income', attorneyCompletes: true, note: 'Obtain from HR' },
        { item: '8',  label: 'NAICS Code', attorneyCompletes: true },
        { item: '9a', label: 'Street Address', sourceField: 'employer_street' },
        { item: '9b', label: 'City', sourceField: 'employer_city' },
        { item: '9c', label: 'State', sourceField: 'employer_state' },
        { item: '9d', label: 'ZIP Code', sourceField: 'employer_zip' },
        { item: '10', label: 'Authorized Representative (Signing Attorney)', attorneyCompletes: true },
        { item: '11', label: 'Title / Role', attorneyCompletes: true },
        { item: '12', label: 'Phone Number (Main Office)', compute: a => a['contact_phone'] || '', note: 'HR contact number' },
        { item: '13', label: 'Email Address', sourceField: 'contact_email' },
        { item: '14', label: 'HR Contact Name', compute: a => [a['contact_name'], a['contact_title']].filter(Boolean).join(', ') },
      ],
    },
    {
      number: 2,
      title: 'Basis for Classification',
      fields: [
        { item: '1',  label: 'Classification Sought', compute: () => 'H-1B — Specialty Occupation Worker' },
        { item: '2',  label: 'Basis', attorneyCompletes: true, note: 'New petition / Extension / Change of employer / Concurrent / Change of status' },
        { item: '3',  label: 'First H-1B petition for this employer?', attorneyCompletes: true },
        { item: '4',  label: 'H-1B Cap Subject?', compute: a => a['is_cap_exempt'] === 'yes' ? 'No — cap exempt (university/nonprofit/government)' : a['is_cap_exempt'] === 'no' ? 'Yes — cap subject' : 'Verify with employer' },
        { item: '5',  label: 'Lottery Selected / Cap Exempt Basis', attorneyCompletes: true },
      ],
    },
    {
      number: 3,
      title: 'Alien Information (Beneficiary / Employee)',
      fields: [
        { item: '1a', label: 'Family Name (Last Name)', sourceField: 'ben_last_name' },
        { item: '1b', label: 'Given Name (First Name)', sourceField: 'ben_first_name' },
        { item: '1c', label: 'Middle Name', sourceField: 'ben_middle_name' },
        { item: '2',  label: 'All Other Names Used (including maiden name, aliases)', sourceField: 'ben_other_names' },
        { item: '3',  label: 'Date of Birth (MM/DD/YYYY)', sourceField: 'ben_dob' },
        { item: '4',  label: 'City / Town of Birth', sourceField: 'ben_city_of_birth' },
        { item: '5',  label: 'Country of Birth', sourceField: 'ben_country_of_birth' },
        { item: '6',  label: 'Country of Citizenship / Nationality', sourceField: 'ben_nationality' },
        { item: '7',  label: 'Gender', sourceField: 'ben_gender' },
        { item: '8',  label: 'US Social Security Number', sourceField: 'ben_ssn', note: 'Leave blank if none — attorney will note on form' },
        { item: '9',  label: 'Alien Registration Number (A-Number)', attorneyCompletes: true },
        { item: '10a',label: 'Passport / Travel Document Number', sourceField: 'ben_passport_number' },
        { item: '10b',label: 'Country of Issuance', sourceField: 'ben_passport_country' },
        { item: '10c',label: 'Passport Expiry Date', sourceField: 'ben_passport_expiry' },
        { item: '11', label: 'Date of Last Arrival into the US', attorneyCompletes: true, note: 'Check I-94 record at cbp.gov/i94' },
        { item: '12', label: 'I-94 Arrival / Departure Record Number', sourceField: 'ben_i94' },
        { item: '13', label: 'Current Nonimmigrant Status', sourceField: 'ben_current_status' },
        { item: '14', label: 'Status Valid Until (Authorized Stay Expires)', sourceField: 'ben_status_expiry' },
        { item: '15', label: 'Currently in the US?', compute: yesNo('ben_in_us') },
        { item: '16a',label: 'Current Address — Street', sourceField: 'ben_current_address' },
        { item: '16b',label: 'City', sourceField: 'ben_current_city' },
        { item: '16c',label: 'State', sourceField: 'ben_current_state' },
        { item: '16d',label: 'ZIP Code', sourceField: 'ben_current_zip' },
        { item: '16e',label: 'Country', sourceField: 'ben_current_country' },
      ],
    },
    {
      number: 4,
      title: 'Processing Information',
      fields: [
        { item: '1', label: 'If approved, notify US consulate at', attorneyCompletes: true, note: 'If beneficiary is outside the US' },
        { item: '2', label: 'Change of status or adjustment in US?', compute: a => a['ben_in_us'] === 'yes' ? 'Yes — beneficiary is in the US' : 'No — consular processing' },
        { item: '3', label: 'Is beneficiary in removal proceedings?', attorneyCompletes: true },
        { item: '4', label: 'Previously filed petition for this alien?', compute: a => a['hist_prev_h1b'] === 'yes' ? 'Yes — see Part 5 notes' : 'No' },
      ],
    },
    {
      number: 5,
      title: 'Basic Information About the Proposed Employment',
      fields: [
        { item: '1',  label: 'Job Title', sourceField: 'pos_job_title' },
        { item: '2',  label: 'SOC / O*NET Code', sourceField: 'pos_soc_code', note: 'Attorney determines this for LCA filing' },
        { item: '3',  label: 'LCA Case Number', attorneyCompletes: true, note: 'Obtain from DOL after LCA is certified' },
        { item: '4',  label: 'Full-Time Position?', compute: yesNo('pos_full_time') },
        { item: '5',  label: 'Hours per Week', sourceField: 'pos_hours' },
        { item: '6a', label: 'Wage Offered (Annual)', sourceField: 'pos_wage_rate' },
        { item: '6b', label: 'Prevailing Wage', attorneyCompletes: true, note: 'From certified LCA (DOL wage determination)' },
        { item: '6c', label: 'Wage Per', compute: () => 'Year' },
        { item: '7a', label: 'From (Start Date)', sourceField: 'pos_start_date' },
        { item: '7b', label: 'To (End Date)', attorneyCompletes: true, note: 'Typically 3 years; 6 years if extension' },
        { item: '8',  label: 'Work Location — Street', compute: a => a['pos_same_address'] === 'yes' ? a['employer_street'] || '' : a['pos_work_street'] || '' },
        { item: '8b', label: 'City', compute: a => a['pos_same_address'] === 'yes' ? a['employer_city'] || '' : a['pos_work_city'] || '' },
        { item: '8c', label: 'State', compute: a => a['pos_same_address'] === 'yes' ? a['employer_state'] || '' : a['pos_work_state'] || '' },
        { item: '9',  label: 'Description of Duties', sourceField: 'pos_duties' },
      ],
    },
    {
      number: 6,
      title: 'H Classification Supplement — Beneficiary Education',
      fields: [
        { item: '1',  label: 'Highest Degree Earned', sourceField: 'edu_highest_degree' },
        { item: '2',  label: 'Field / Major of Study', sourceField: 'edu_field_of_study' },
        { item: '3',  label: 'Name of Institution', sourceField: 'edu_institution' },
        { item: '4',  label: 'Country of Institution', sourceField: 'edu_institution_country' },
        { item: '5',  label: 'Graduation Date', sourceField: 'edu_graduation_date' },
        { item: '6',  label: 'Additional Degrees / Certifications', sourceField: 'edu_additional' },
        { item: '7',  label: 'Foreign Degree? Credential Evaluation Required?', compute: yesNo('edu_evaluation_needed') },
        { item: '8',  label: 'Evaluation Agency (if completed)', sourceField: 'edu_evaluator' },
      ],
    },
    {
      number: 7,
      title: 'Immigration History (Beneficiary)',
      fields: [
        { item: '1', label: 'Prior US Stays or Employment?', compute: yesNo('hist_prev_us') },
        { item: '2', label: 'Details of Prior US Stays', sourceField: 'hist_prev_details' },
        { item: '3', label: 'Prior H-1B Status?', compute: yesNo('hist_prev_h1b') },
        { item: '4', label: 'Prior H-1B Employer & Dates', sourceField: 'hist_prev_h1b_details' },
        { item: '5', label: 'Any Prior Petition / Application Denied?', compute: yesNo('hist_denial') },
        { item: '6', label: 'Denial Details', sourceField: 'hist_denial_details' },
        { item: '7', label: 'Immigration Violations / Overstay?', compute: yesNo('hist_violation') },
        { item: '8', label: 'Violation Details', sourceField: 'hist_violation_details' },
        { item: '9', label: 'Criminal History?', compute: yesNo('hist_criminal') },
        { item: '10',label: 'Criminal History Details', sourceField: 'hist_criminal_details' },
      ],
    },
  ],
}

// ─── I-130 (Family-Based Immigration) ─────────────────────────────────────

export const i130: FormDefinition = {
  formNumber: 'I-130',
  title: 'Petition for Alien Relative — Family-Based Immigration',
  visaType: 'family_petition',
  disclaimer: 'This pre-fill data sheet is prepared from client intake data. Attorney must review all values, determine the applicable family preference category, and sign the official USCIS I-130 before filing.',
  parts: [
    {
      number: 1,
      title: 'Information About You (The Petitioner)',
      fields: [
        { item: '1a', label: 'Family Name (Last Name)', sourceField: 'pet_last_name' },
        { item: '1b', label: 'Given Name (First Name)', sourceField: 'pet_first_name' },
        { item: '1c', label: 'Middle Name', sourceField: 'pet_middle_name' },
        { item: '2',  label: 'Date of Birth (MM/DD/YYYY)', sourceField: 'pet_dob' },
        { item: '3',  label: 'Country of Birth', sourceField: 'pet_country_of_birth' },
        { item: '4',  label: 'Country of Citizenship', sourceField: 'pet_nationality' },
        { item: '5',  label: 'Social Security Number', sourceField: 'pet_ssn' },
        { item: '6',  label: 'Alien Registration Number (A-Number)', attorneyCompletes: true },
        { item: '7',  label: 'US Status', sourceField: 'pet_us_status' },
        { item: '8a', label: 'Street Address', sourceField: 'pet_street' },
        { item: '8b', label: 'City', sourceField: 'pet_city' },
        { item: '8c', label: 'State', sourceField: 'pet_state' },
        { item: '8d', label: 'ZIP Code', sourceField: 'pet_zip' },
        { item: '9',  label: 'Marital Status', sourceField: 'pet_marital_status' },
        { item: '10', label: 'Prior Marriages', sourceField: 'pet_prior_marriages' },
        { item: '11', label: 'Employer Name', sourceField: 'pet_employer' },
        { item: '12', label: 'Annual Income (approximate)', sourceField: 'pet_income', note: 'Attorney verifies with tax returns for I-864' },
      ],
    },
    {
      number: 2,
      title: 'Relationship to Beneficiary',
      fields: [
        { item: '1', label: 'Relationship Type', sourceField: 'rel_type' },
        { item: '2', label: 'Family Preference Category', attorneyCompletes: true, note: 'Attorney determines: Immediate Relative vs F1/F2A/F2B/F3/F4' },
        { item: '3', label: 'Date of Relationship / Marriage', sourceField: 'rel_date' },
        { item: '4', label: 'Place of Marriage / Relationship Established', sourceField: 'rel_place' },
        { item: '5', label: 'Prior Marriage of Petitioner?', compute: yesNo('pet_prev_married') },
        { item: '6', label: 'Prior Marriage Details', sourceField: 'pet_prev_marriage_details' },
      ],
    },
    {
      number: 3,
      title: 'Information About Your Relative (Beneficiary)',
      fields: [
        { item: '1a', label: 'Family Name (Last Name)', sourceField: 'ben_last_name' },
        { item: '1b', label: 'Given Name (First Name)', sourceField: 'ben_first_name' },
        { item: '1c', label: 'Middle Name', sourceField: 'ben_middle_name' },
        { item: '2',  label: 'Date of Birth', sourceField: 'ben_dob' },
        { item: '3',  label: 'Country of Birth', sourceField: 'ben_country_of_birth' },
        { item: '4',  label: 'Country of Citizenship', sourceField: 'ben_nationality' },
        { item: '5',  label: 'Alien Registration Number (A-Number)', attorneyCompletes: true },
        { item: '6',  label: 'Social Security Number', sourceField: 'ben_ssn' },
        { item: '7a', label: 'Passport Number', sourceField: 'ben_passport_number' },
        { item: '7b', label: 'Country of Issuance', sourceField: 'ben_passport_country' },
        { item: '7c', label: 'Expiry Date', sourceField: 'ben_passport_expiry' },
        { item: '8',  label: 'Current Address (Country / City)', compute: a => [a['ben_current_city'], a['ben_current_country']].filter(Boolean).join(', ') },
        { item: '9',  label: 'Currently in the US?', compute: yesNo('ben_in_us') },
        { item: '10', label: 'Current Immigration Status', sourceField: 'ben_current_status' },
        { item: '11', label: 'Marital Status', sourceField: 'ben_marital_status' },
        { item: '12', label: 'Prior Marriages of Beneficiary', sourceField: 'ben_prior_marriages' },
      ],
    },
    {
      number: 4,
      title: 'Additional Information',
      fields: [
        { item: '1', label: 'Has beneficiary ever been in the US?', compute: yesNo('ben_in_us') },
        { item: '2', label: 'Immigration History', sourceField: 'ben_immigration_history' },
        { item: '3', label: 'Criminal History?', compute: yesNo('hist_criminal') },
        { item: '4', label: 'Criminal History Details', sourceField: 'hist_criminal_details' },
        { item: '5', label: 'Processing Location', sourceField: 'processing_location', note: 'US consulate city/country or USCIS office for AOS' },
      ],
    },
  ],
}

// ─── I-129F (K-1 Fiancé(e) Visa) ──────────────────────────────────────────

export const i129f: FormDefinition = {
  formNumber: 'I-129F',
  title: 'Petition for Alien Fiancé(e) — K-1 Visa',
  visaType: 'k1',
  disclaimer: 'This pre-fill data sheet is prepared from client intake data. Attorney must review all values and sign the official USCIS I-129F before filing. The fiancé(e) will also complete DS-160 separately.',
  parts: [
    {
      number: 1,
      title: 'Information About You (The US Citizen Petitioner)',
      fields: [
        { item: '1a', label: 'Family Name (Last Name)', sourceField: 'pet_last_name' },
        { item: '1b', label: 'Given Name (First Name)', sourceField: 'pet_first_name' },
        { item: '1c', label: 'Middle Name', sourceField: 'pet_middle_name' },
        { item: '2',  label: 'Date of Birth', sourceField: 'pet_dob' },
        { item: '3',  label: 'City of Birth', sourceField: 'pet_city_of_birth' },
        { item: '4',  label: 'Country of Birth', sourceField: 'pet_country_of_birth' },
        { item: '5',  label: 'Social Security Number', sourceField: 'pet_ssn' },
        { item: '6',  label: 'Alien Registration Number', attorneyCompletes: true },
        { item: '7a', label: 'Current Street Address', sourceField: 'pet_street' },
        { item: '7b', label: 'City', sourceField: 'pet_city' },
        { item: '7c', label: 'State', sourceField: 'pet_state' },
        { item: '7d', label: 'ZIP Code', sourceField: 'pet_zip' },
        { item: '8',  label: 'Marital Status', sourceField: 'pet_marital_status' },
        { item: '9',  label: 'Number of Prior Marriages', sourceField: 'pet_prior_marriages' },
        { item: '10', label: 'Prior Marriage Details (dates ended)', sourceField: 'pet_prior_marriage_details' },
        { item: '11', label: 'Have you previously filed for a K-1 or K-3?', compute: yesNo('pet_prev_k_petition') },
        { item: '12', label: 'Income (for I-134 Support Declaration)', sourceField: 'pet_income', note: 'Must meet 100% of federal poverty guideline' },
      ],
    },
    {
      number: 2,
      title: 'Information About Your Fiancé(e) (Beneficiary)',
      fields: [
        { item: '1a', label: 'Family Name (Last Name)', sourceField: 'fiance_last_name' },
        { item: '1b', label: 'Given Name (First Name)', sourceField: 'fiance_first_name' },
        { item: '1c', label: 'Middle Name', sourceField: 'fiance_middle_name' },
        { item: '2',  label: 'Other Names Used', sourceField: 'fiance_other_names' },
        { item: '3',  label: 'Date of Birth', sourceField: 'fiance_dob' },
        { item: '4',  label: 'City of Birth', sourceField: 'fiance_city_of_birth' },
        { item: '5',  label: 'Country of Birth', sourceField: 'fiance_country_of_birth' },
        { item: '6',  label: 'Country of Citizenship', sourceField: 'fiance_nationality' },
        { item: '7a', label: 'Passport Number', sourceField: 'fiance_passport_number' },
        { item: '7b', label: 'Country of Issuance', sourceField: 'fiance_passport_country' },
        { item: '7c', label: 'Expiry Date', sourceField: 'fiance_passport_expiry' },
        { item: '8',  label: 'Current Address (City, Country)', compute: a => [a['fiance_city'], a['fiance_country']].filter(Boolean).join(', ') },
        { item: '9',  label: 'Marital Status', sourceField: 'fiance_marital_status' },
        { item: '10', label: 'Prior Marriages of Fiancé(e)', sourceField: 'fiance_prior_marriages' },
      ],
    },
    {
      number: 3,
      title: 'Relationship History',
      fields: [
        { item: '1', label: 'How did you meet?', sourceField: 'rel_how_met' },
        { item: '2', label: 'Date you first met in person', sourceField: 'rel_first_met_date' },
        { item: '3', label: 'Place you first met', sourceField: 'rel_first_met_place' },
        { item: '4', label: 'Intent to marry within 90 days of fiancé(e) entering US?', compute: () => 'Yes' },
        { item: '5', label: 'Have you met in person in the last 2 years?', compute: yesNo('rel_met_in_person') },
        { item: '6', label: 'Exemption from in-person meeting requirement?', attorneyCompletes: true, note: 'If no, attorney must document extreme hardship or cultural/religious custom' },
        { item: '7', label: 'Criminal convictions or waivers required?', compute: yesNo('pet_criminal_history') },
      ],
    },
  ],
}

// ─── I-140 (Employment-Based Green Card) ──────────────────────────────────

export const i140: FormDefinition = {
  formNumber: 'I-140',
  title: 'Immigrant Petition for Alien Workers — Employment-Based Green Card',
  visaType: 'green_card',
  disclaimer: 'This pre-fill data sheet is prepared from client intake data. Attorney must review all values, confirm EB category, and sign the official USCIS I-140 before filing. PERM (ETA-9089) must be filed with DOL first for most EB-2/EB-3 cases.',
  parts: [
    {
      number: 1,
      title: 'Petition Type',
      fields: [
        { item: '1', label: 'Classification Sought', attorneyCompletes: true, note: 'EB-1A / EB-1B / EB-1C / EB-2 PERM / EB-2 NIW / EB-3 / EB-3 Other' },
        { item: '2', label: 'Sponsorship Type', compute: a => {
          if (a['sponsor_type'] === 'employer') return 'Employer sponsored'
          if (a['sponsor_type'] === 'niw') return 'Self-petition — National Interest Waiver (NIW)'
          return a['sponsor_type'] || ''
        }},
        { item: '3', label: 'EB Category', compute: a => a['eb_category'] || '' },
        { item: '4', label: 'PERM Case Number', attorneyCompletes: true, note: 'From DOL — obtain after PERM certification' },
        { item: '5', label: 'Priority Date', sourceField: 'gc_priority_date', note: 'If transferring a priority date from prior petition' },
      ],
    },
    {
      number: 2,
      title: 'Petitioner / Sponsor Information (Employer)',
      fields: [
        { item: '1a', label: 'Legal Name of Organization (Employer)', sourceField: 'sponsor_legal_name' },
        { item: '1b', label: 'Trade Name / DBA', sourceField: 'sponsor_trade_name' },
        { item: '2',  label: 'Federal EIN', sourceField: 'sponsor_ein', note: 'If blank, obtain from HR before filing' },
        { item: '3',  label: 'Type of Business', sourceField: 'sponsor_business_type' },
        { item: '4a', label: 'Street Address', sourceField: 'sponsor_street' },
        { item: '4b', label: 'City', sourceField: 'sponsor_city' },
        { item: '4c', label: 'State', sourceField: 'sponsor_state' },
        { item: '4d', label: 'ZIP Code', sourceField: 'sponsor_zip' },
        { item: '5',  label: 'Gross Annual Income', attorneyCompletes: true, note: 'Obtain from HR — required to show ability to pay' },
        { item: '6',  label: 'Net Annual Income', attorneyCompletes: true },
        { item: '7',  label: 'Number of US Employees', attorneyCompletes: true },
      ],
    },
    {
      number: 3,
      title: 'Information About the Alien (Beneficiary)',
      fields: [
        { item: '1a', label: 'Family Name (Last Name)', sourceField: 'ben_last_name' },
        { item: '1b', label: 'Given Name (First Name)', sourceField: 'ben_first_name' },
        { item: '1c', label: 'Middle Name', sourceField: 'ben_middle_name' },
        { item: '2',  label: 'Other Names Used', sourceField: 'ben_other_names' },
        { item: '3',  label: 'Date of Birth', sourceField: 'ben_dob' },
        { item: '4',  label: 'City / Town of Birth', sourceField: 'ben_city_of_birth' },
        { item: '5',  label: 'Country of Birth', sourceField: 'ben_country_of_birth' },
        { item: '6',  label: 'Country of Citizenship', sourceField: 'ben_nationality' },
        { item: '7',  label: 'US Social Security Number', sourceField: 'ben_ssn' },
        { item: '8',  label: 'Alien Registration Number (A-Number)', attorneyCompletes: true },
        { item: '9a', label: 'Passport Number', sourceField: 'ben_passport_number' },
        { item: '9b', label: 'Country of Issuance', sourceField: 'ben_passport_country' },
        { item: '9c', label: 'Expiry Date', sourceField: 'ben_passport_expiry' },
        { item: '10', label: 'Currently in the US?', compute: yesNo('ben_in_us') },
        { item: '11', label: 'Current Status', sourceField: 'ben_current_status' },
        { item: '12', label: 'Current Address', compute: addr('ben_current_address', 'ben_current_city', 'ben_current_state', 'ben_current_zip', 'ben_current_country') },
      ],
    },
    {
      number: 4,
      title: 'Employment-Based Qualifications',
      fields: [
        { item: '1', label: 'Job Title (as filed on PERM)', sourceField: 'pos_job_title' },
        { item: '2', label: 'Offered Annual Salary', sourceField: 'pos_wage_rate' },
        { item: '3', label: 'Prevailing Wage', attorneyCompletes: true, note: 'From PERM / DOL wage determination' },
        { item: '4', label: 'Description of Duties', sourceField: 'pos_duties' },
        { item: '5', label: 'Highest Degree Earned', sourceField: 'edu_highest_degree' },
        { item: '6', label: 'Field of Study', sourceField: 'edu_field_of_study' },
        { item: '7', label: 'Institution', sourceField: 'edu_institution' },
        { item: '8', label: 'Graduation Date', sourceField: 'edu_graduation_date' },
        { item: '9', label: 'Years of Progressive Work Experience', sourceField: 'work_experience_years' },
        { item: '10',label: 'Summary of Qualifications', sourceField: 'qualifications_summary' },
        { item: '11',label: 'Extraordinary Ability / NIW Evidence', sourceField: 'niw_evidence', note: 'For EB-1A, EB-1B, or EB-2 NIW only' },
      ],
    },
    {
      number: 5,
      title: 'Immigration History',
      fields: [
        { item: '1', label: 'Prior Green Card Petition Filed?', compute: yesNo('hist_prev_gc') },
        { item: '2', label: 'Prior Petition Details', sourceField: 'hist_prev_gc_details' },
        { item: '3', label: 'Prior Petition Denied?', compute: yesNo('hist_denial') },
        { item: '4', label: 'Denial Details', sourceField: 'hist_denial_details' },
        { item: '5', label: 'Immigration Violations?', compute: yesNo('hist_violation') },
        { item: '6', label: 'Violation Details', sourceField: 'hist_violation_details' },
        { item: '7', label: 'Criminal History?', compute: yesNo('hist_criminal') },
        { item: '8', label: 'Criminal History Details', sourceField: 'hist_criminal_details' },
      ],
    },
  ],
}

// ─── Form index ────────────────────────────────────────────────────────────

export const formsByVisaType: Record<string, FormDefinition> = {
  h1b:              i129,
  family_petition:  i130,
  k1:               i129f,
  green_card:       i140,
}
