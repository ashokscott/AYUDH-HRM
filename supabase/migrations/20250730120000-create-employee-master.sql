-- Migration: Create employee_master table for employee form fields
CREATE TABLE public.employee_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT, -- avatar url or file reference
  employee_id TEXT UNIQUE,
  date_of_joining DATE,
  name TEXT,
  mobile_number TEXT,
  personal_mail_id TEXT,
  official_mail_id TEXT,
  designation TEXT,
  reporting_manager UUID REFERENCES public.employee_master(id),
  gender TEXT,
  date_of_birth DATE,
  blood_group TEXT,
  aadhar_number TEXT,
  aadhar_image TEXT, -- file url or reference
  pan_card TEXT,
  pan_image TEXT, -- file url or reference
  uan_number TEXT,
  pf_number TEXT,
  bank_name TEXT,
  branch_name TEXT,
  account_number TEXT,
  ifsc_code TEXT,
  shift TEXT,
  emergency_contact_name TEXT,
  emergency_contact_number TEXT,
  father_name TEXT,
  mother_name TEXT,
  any_phone_number TEXT,
  spouse_name TEXT,
  spouse_dob DATE,
  spouse_number TEXT,
  child_name TEXT,
  child_dob DATE,
  highest_education TEXT,
  current_address TEXT,
  permanent_address TEXT,
  linkedin_link TEXT,
  company_assets TEXT[], -- multiselect from assets table
  hr_id_card_issue BOOLEAN,
  hr_photo BOOLEAN,
  hr_offer_letter BOOLEAN,
  hr_background_verf BOOLEAN,
  hr_laptop BOOLEAN,
  hr_joining_kit BOOLEAN,
  hr_biomatrix BOOLEAN,
  hr_all_documents BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for search
CREATE INDEX idx_employee_master_employee_id ON public.employee_master(employee_id);
CREATE INDEX idx_employee_master_name ON public.employee_master(name);

-- Optionally, add foreign keys for designation, assets, etc. as needed.
