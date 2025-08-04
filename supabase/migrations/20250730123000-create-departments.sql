-- Create departments table
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  department_head_id uuid REFERENCES employee_master(id),
  created_at timestamp with time zone DEFAULT timezone('utc', now())
);

-- Add department_id to employee_master
ALTER TABLE employee_master ADD COLUMN department_id uuid REFERENCES departments(id);

-- For growth tracking, create a department_headcount_history table
CREATE TABLE department_headcount_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid REFERENCES departments(id),
  employee_count integer NOT NULL,
  recorded_at date NOT NULL
);
