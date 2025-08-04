-- Rename department_head_id to head_user_id in departments table
ALTER TABLE departments RENAME COLUMN department_head_id TO head_user_id;

-- Update any references in employee_master if needed (none expected)
-- No data migration needed if you haven't used the field yet
