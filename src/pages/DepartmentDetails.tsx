import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

function HierarchyChart({ head, employees }: any) {
  // Simple vertical chart for now
  return (
    <div className="flex flex-col items-center gap-8 mt-8">
      <div className="flex flex-col items-center">
        <img src={head.image} alt={head.name} className="w-24 h-24 rounded-full border-4 border-orange-200 shadow" />
        <div className="font-bold text-lg mt-2">{head.name}</div>
        <div className="text-sm text-gray-500">{head.designation}</div>
      </div>
      <div className="flex flex-wrap gap-8 justify-center">
        {employees.map((emp: any) => (
          <div key={emp.id} className="flex flex-col items-center">
            <img src={emp.image} alt={emp.name} className="w-16 h-16 rounded-full border-2 border-orange-100" />
            <div className="font-medium mt-1">{emp.name}</div>
            <div className="text-xs text-gray-500">{emp.designation}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const [dept, setDept] = useState<any>(null);
  const [head, setHead] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDetails() {
      const { data: d } = await supabase.from('departments').select('*').eq('id', id).single();
      setDept(d);
      if (d) {
        const { data: headData } = await supabase
          .from('employee_master')
          .select('id, name, image, designation_id')
          .eq('id', d.department_head_id)
          .single();
        setHead(headData);
        const { data: emps } = await supabase
          .from('employee_master')
          .select('id, name, image, designation_id')
          .eq('department_id', d.id)
          .neq('id', d.department_head_id);
        setEmployees(emps || []);
      }
    }
    fetchDetails();
  }, [id]);

  if (!dept || !head) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 bg-[#fff8f3] min-h-screen">
      <Card className="p-8 max-w-2xl mx-auto">
        <div className="text-2xl font-bold mb-2">{dept.name}</div>
        <div className="text-gray-600 mb-4">{dept.description}</div>
        <HierarchyChart head={head} employees={employees} />
        <div className="flex gap-2 mt-8">
          <Button variant="outline">Back</Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Edit</Button>
        </div>
      </Card>
    </div>
  );
}
