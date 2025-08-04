-- Migration: Create employee_type table and add employee_type_id to employee_master

CREATE TABLE IF NOT EXISTS public.employee_type (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  image_url TEXT -- link to type image
);

ALTER TABLE public.employee_master
ADD COLUMN IF NOT EXISTS employee_type_id UUID REFERENCES public.employee_type(id);
