-- Add missing columns to employee_master table for app compatibility
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES departments(id);
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS designation_id uuid REFERENCES designations(id);
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS employee_type_id uuid REFERENCES employee_type(id);
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS reporting_manager_id uuid REFERENCES employee_master(id);
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS account_name text NOT NULL DEFAULT '';
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS shift_from time;
ALTER TABLE employee_master ADD COLUMN IF NOT EXISTS shift_to time;
