import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type EmployeeField = {
  name: string;
  label: string;
  type: string;
};

export function useEmployeeFields() {
  const [fields, setFields] = useState<EmployeeField[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from Supabase meta table
    const fetchFields = async () => {
      const { data, error } = await supabase.from('employee_fields').select('*');
      if (!error && data) {
        setFields(data);
      }
      setLoading(false);
    };
    fetchFields();
  }, []);

  const addField = async (field: EmployeeField) => {
    // 1. Add to meta table
    const { error } = await supabase.from('employee_fields').insert([field]);
    if (error) throw error;
    // 2. Alter employee_master table
    let sql = '';
    if (field.type === 'text' || field.type === 'email') sql = `ALTER TABLE employee_master ADD COLUMN ${field.name} text;`;
    else if (field.type === 'date') sql = `ALTER TABLE employee_master ADD COLUMN ${field.name} date;`;
    else if (field.type === 'number') sql = `ALTER TABLE employee_master ADD COLUMN ${field.name} numeric;`;
    if (sql) {
      const { error: sqlError } = await supabase.rpc('execute_sql', { sql });
      if (sqlError) throw sqlError;
    }
    setFields(f => [...f, field]);
  };

  return { fields, loading, addField };
}
