import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Plus } from 'lucide-react';

function DepartmentCard({ dept, onView, onEdit }: any) {
  return (
    <Card className="p-6 flex flex-col gap-4 shadow-md border border-orange-200 bg-[#fff8f3]">
      <div className="flex justify-between items-center">
        <div className="font-bold text-lg">{dept.name}</div>
        <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full">Active</span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{dept.description}</div>
      <div className="flex items-center gap-2 mb-2">
        {dept.head_image && <img src={dept.head_image} alt={dept.head_name} className="w-8 h-8 rounded-full" />}
        <div>
          <div className="font-medium text-sm">{dept.head_name || '—'}</div>
          <div className="text-xs text-gray-500">Department Head</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div>
          <div className="font-bold text-xl">{dept.employee_count}</div>
          <div className="text-xs text-gray-500">Employees</div>
        </div>
        <div className="text-green-600 font-semibold text-sm">+{dept.growth}%<span className="text-xs ml-1">Growth</span></div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={() => onView(dept)}>View Details</Button>
        <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={() => onEdit(dept)}>Manage</Button>
      </div>
    </Card>
  );
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<any>({});
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<any | null>(null);
  const [manageDept, setManageDept] = useState<any | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: emps } = await supabase.from('employee_master').select('id, name, image');
      setEmployees(emps || []);

      const { data: depts } = await supabase.from('departments').select('id, name, description, head_user_id');
      
      let heads: Record<string, any> = {};
      if (depts && depts.length > 0) {
        const headIds = depts.map((d: any) => d.head_user_id).filter(Boolean);
        if (headIds.length > 0) {
          const { data: headData } = await supabase.from('employee_master').select('id, name, image').in('id', headIds);
          (headData || []).forEach((h: any) => { heads[h.id] = h; });
        }
      }
      
      let empCounts: Record<string, number> = {};
      if (depts && depts.length > 0) {
        const deptIds = depts.map((d: any) => d.id);
        const { data: empData } = await supabase.from('employee_master').select('department_id');
        (empData || []).forEach((e: any) => {
          if (e.department_id) empCounts[e.department_id] = (empCounts[e.department_id] || 0) + 1;
        });
      }
      
      const departmentsWithStats = (depts || []).map((d: any) => ({
        ...d,
        head_name: heads[d.head_user_id]?.name || '',
        head_image: heads[d.head_user_id]?.image || '',
        employee_count: empCounts[d.id] || 0,
        growth: 0
      }));
      setDepartments(departmentsWithStats);
    }
    fetchData();
  }, []);

  async function handleAdd() {
    if (!form.name) return;
    await supabase.from('departments').insert({
      name: form.name,
      description: form.description,
      head_user_id: form.department_head_id
    });
    setShowForm(false);
    setForm({});
    
    // Refresh departments
    const { data: depts } = await supabase.from('departments').select('id, name, description, head_user_id');
    let heads: Record<string, any> = {};
    if (depts && depts.length > 0) {
      const headIds = depts.map((d: any) => d.head_user_id).filter(Boolean);
      if (headIds.length > 0) {
        const { data: headData } = await supabase.from('employee_master').select('id, name, image').in('id', headIds);
        (headData || []).forEach((h: any) => { heads[h.id] = h; });
      }
    }
    
    let empCounts: Record<string, number> = {};
    if (depts && depts.length > 0) {
      const deptIds = depts.map((d: any) => d.id);
      const { data: empData } = await supabase.from('employee_master').select('department_id');
      (empData || []).forEach((e: any) => {
        if (e.department_id) empCounts[e.department_id] = (empCounts[e.department_id] || 0) + 1;
      });
    }
    
    const departmentsWithStats = (depts || []).map((d: any) => ({
      ...d,
      head_name: heads[d.head_user_id]?.name || '',
      head_image: heads[d.head_user_id]?.image || '',
      employee_count: empCounts[d.id] || 0,
      growth: 0
    }));
    setDepartments(departmentsWithStats);
  }

  async function handleManageSave() {
    if (!manageDept) return;
    await supabase.from('departments').update({
      name: manageDept.name,
      description: manageDept.description,
      head_user_id: manageDept.head_user_id
    }).eq('id', manageDept.id);
    setManageDept(null);
    
    // Refresh departments
    const { data: depts } = await supabase.from('departments').select('id, name, description, head_user_id');
    let heads: Record<string, any> = {};
    if (depts && depts.length > 0) {
      const headIds = depts.map((d: any) => d.head_user_id).filter(Boolean);
      if (headIds.length > 0) {
        const { data: headData } = await supabase.from('employee_master').select('id, name, image').in('id', headIds);
        (headData || []).forEach((h: any) => { heads[h.id] = h; });
      }
    }
    
    let empCounts: Record<string, number> = {};
    if (depts && depts.length > 0) {
      const deptIds = depts.map((d: any) => d.id);
      const { data: empData } = await supabase.from('employee_master').select('department_id');
      (empData || []).forEach((e: any) => {
        if (e.department_id) empCounts[e.department_id] = (empCounts[e.department_id] || 0) + 1;
      });
    }
    
    const departmentsWithStats = (depts || []).map((d: any) => ({
      ...d,
      head_name: heads[d.head_user_id]?.name || '',
      head_image: heads[d.head_user_id]?.image || '',
      employee_count: empCounts[d.id] || 0,
      growth: 0
    }));
    setDepartments(departmentsWithStats);
  }

  return (
    <div className="p-8 bg-[#fff8f3] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-3xl font-bold">Departments</div>
          <div className="text-gray-600">Organize and manage your company departments</div>
        </div>
        <Button 
          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded flex items-center gap-2" 
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4" /> Add Department
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="text-xs text-gray-500 mb-1">Total Departments</div>
          <div className="text-3xl font-bold">{departments.length}</div>
        </Card>
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="text-xs text-gray-500 mb-1">Total Employees</div>
          <div className="text-3xl font-bold">{departments.reduce((a, d) => a + (d.employee_count || 0), 0)}</div>
        </Card>
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="text-xs text-gray-500 mb-1">Average Growth</div>
          <div className="text-3xl font-bold">+{departments.length ? (departments.reduce((a, d) => a + (d.growth || 0), 0) / departments.length).toFixed(1) : 0}%</div>
        </Card>
      </div>

      {/* Department cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departments.map(dept => (
          <DepartmentCard 
            key={dept.id} 
            dept={dept} 
            onView={d => setSelectedDept(d)} 
            onEdit={d => setManageDept(d)} 
          />
        ))}
      </div>

      {/* Add Department Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="p-8 w-full max-w-md">
            <div className="text-xl font-bold mb-4">Add Department</div>
            <Input 
              className="mb-3" 
              placeholder="Department Name" 
              value={form.name || ''} 
              onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))} 
            />
            <Input 
              className="mb-3" 
              placeholder="Description" 
              value={form.description || ''} 
              onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} 
            />
            <Select 
              value={form.department_head_id || ''} 
              onValueChange={val => setForm((f: any) => ({ ...f, department_head_id: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department Head" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleAdd}>Add</Button>
            </div>
          </Card>
        </div>
      )}

      {/* Department Details Modal */}
      {selectedDept && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="p-8 w-full max-w-md">
            <div className="text-xl font-bold mb-4">Department Details</div>
            <div className="mb-2"><b>Name:</b> {selectedDept.name}</div>
            <div className="mb-2"><b>Description:</b> {selectedDept.description}</div>
            <div className="mb-2"><b>Department Head:</b> {selectedDept.head_name || '—'}</div>
            <div className="mb-2"><b>Employees:</b> {selectedDept.employee_count}</div>
            <Button className="mt-4 w-full" onClick={() => setSelectedDept(null)}>Close</Button>
          </Card>
        </div>
      )}

      {/* Manage Department Modal */}
      {manageDept && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="p-8 w-full max-w-md">
            <div className="text-xl font-bold mb-4">Manage Department</div>
            <Input 
              className="mb-3" 
              placeholder="Department Name" 
              value={manageDept.name || ''} 
              onChange={e => setManageDept((d: any) => ({ ...d, name: e.target.value }))} 
            />
            <Input 
              className="mb-3" 
              placeholder="Description" 
              value={manageDept.description || ''} 
              onChange={e => setManageDept((d: any) => ({ ...d, description: e.target.value }))} 
            />
            <Select 
              value={manageDept.head_user_id || ''} 
              onValueChange={val => setManageDept((d: any) => ({ ...d, head_user_id: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Department Head" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setManageDept(null)}>Cancel</Button>
              <Button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" onClick={handleManageSave}>Save</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}