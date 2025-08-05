import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export default function DepartmentDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<any>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        // Fetch department details with head info
        const { data: dept, error: deptError } = await supabase
          .from('departments')
          .select(`
            *,
            employee_master:head_user_id (name, image)
          `)
          .eq('id', id)
          .single();
        if (deptError) throw deptError;
        setDepartment(dept);

        // Fetch employees in this department
        // Ensure department_id is compared as string (uuid) for Supabase
        console.log('Fetching employees for department_id:', id);
        const { data: emps, error: empError } = await supabase
          .from('employee_master')
          .select(`
            id, name, image, employee_id, mobile_number, designation_id, reporting_manager_id, department_id,
            designations(name),
            departments:departments!employee_master_department_id_fkey(name),
            reporting_manager:reporting_manager_id (name, image)
          `)
          .eq('department_id', String(id));
        if (empError) {
          console.error('Supabase employee fetch error:', empError);
          throw empError;
        }
        console.log('Employees fetched:', emps);
        setEmployees(emps || []);
      } catch (error) {
        console.error('Error fetching department details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!department) return <div className="p-8">Department not found.</div>;

  return (
    <div className="p-8 min-h-screen bg-[#fff8f3]">
      <Card className="p-12 max-w-3xl mx-auto mb-12 shadow-lg border-2 border-orange-200">
        <div className="text-3xl font-bold mb-4">{department.name}</div>
        <div className="mb-4 text-lg text-gray-700">{department.description || '—'}</div>
        <div className="flex items-center gap-6 mb-4">
          {department.employee_master?.image ? (
            <img src={department.employee_master.image} alt={department.employee_master.name} className="w-20 h-20 rounded-full object-cover border-2 border-orange-300" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-orange-300">
              <span className="text-lg">NA</span>
            </div>
          )}
          <div>
            <div className="font-semibold text-xl">{department.employee_master?.name || 'Not assigned'}</div>
            <div className="text-base text-gray-500">Department Head</div>
          </div>
        </div>
        <div className="text-base text-gray-500 mb-4">Department ID: {department.id}</div>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </Card>
      <Card className="p-10 max-w-3xl mx-auto">
        <div className="text-2xl font-bold mb-8">Employees in this Department</div>
        {employees.length === 0 ? (
          <div className="text-gray-500">No employees found.</div>
        ) : (
          <div className="space-y-6">
            {employees.map(emp => (
              <div
                key={emp.id}
                className="flex items-center gap-8 p-6 border-b last:border-b-0 rounded-xl bg-orange-50 hover:bg-orange-100 cursor-pointer transition-all shadow-md"
                onClick={() => navigate(`/employees/view/${emp.id}`)}
              >
                {emp.image ? (
                  <img src={emp.image} alt={emp.name} className="w-20 h-20 rounded-full object-cover border-2 border-orange-300" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-orange-300">
                    <span className="text-lg">NA</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="font-bold text-xl mb-1">{emp.name}</div>
                  <div className="text-base text-gray-700 mb-1">Emp ID: <span className="font-mono">{emp.employee_id}</span></div>
                  <div className="text-base text-gray-700 mb-1">Mobile: {emp.mobile_number || '—'}</div>
                  <div className="text-base text-gray-700 mb-1">Designation: {emp.designations?.name || '—'}</div>
                  <div className="text-base text-gray-700 mb-1">Department: {emp.departments?.name || '—'}</div>
                  <div className="text-base text-gray-700 mb-1">Reporting Manager: {emp.reporting_manager?.name || '—'}</div>
                </div>
                {emp.reporting_manager?.image ? (
                  <img src={emp.reporting_manager.image} alt={emp.reporting_manager.name} className="w-14 h-14 rounded-full object-cover border border-gray-300" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                    <span className="text-base">NA</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
