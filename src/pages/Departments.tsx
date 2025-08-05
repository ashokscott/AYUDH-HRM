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
        {dept.head_image ? (
          <img 
            src={dept.head_image} 
            alt={dept.head_name} 
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-500">No photo</span>
          </div>
        )}
        <div>
          <div className="font-medium text-sm">
            {dept.head_name || 'Not assigned'}
          </div>
          <div className="text-xs text-gray-500">Department Head</div>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div>
          <div className="font-bold text-xl">{dept.employee_count}</div>
          <div className="text-xs text-gray-500">Employees</div>
        </div>
        <div className="text-green-600 font-semibold text-sm">
          +{dept.growth}%<span className="text-xs ml-1">Growth</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button variant="outline" className="flex-1" onClick={() => onView(dept)}>
          View Details
        </Button>
        <Button 
          className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" 
          onClick={() => onEdit(dept)}
        >
          Manage
        </Button>
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch employees for department head selection
      const { data: emps, error: empError } = await supabase
        .from('employee_master')
        .select('id, name, image');
      
      if (empError) throw empError;
      setEmployees(emps || []);

      // Fetch departments with head information using a join
      const { data: depts, error: deptError } = await supabase
        .from('departments')
        .select(`
          id, 
          name, 
          description, 
          head_user_id,
          employee_master:head_user_id (name, image)
        `);
      
      if (deptError) throw deptError;

      // Fetch employee counts per department
      let empCounts: Record<string, number> = {};
      if (depts && depts.length > 0) {
        const deptIds = depts.map((d: any) => d.id);
        const { data: empData, error: countError } = await supabase
          .from('employee_master')
          .select('department_id');
        
        if (countError) throw countError;
        
        (empData || []).forEach((e: any) => {
          if (e.department_id) empCounts[e.department_id] = (empCounts[e.department_id] || 0) + 1;
        });
      }

      const departmentsWithStats = (depts || []).map((d: any) => ({
        ...d,
        head_name: d.employee_master?.name || '',
        head_image: d.employee_master?.image || '',
        employee_count: empCounts[d.id] || 0,
        growth: 0
      }));

      setDepartments(departmentsWithStats);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!form.name) return;
    setLoading(true);
    
    try {
      const { error } = await supabase.from('departments').insert({
        name: form.name,
        description: form.description,
        head_user_id: form.department_head_id
      });
      
      if (error) throw error;
      
      setShowForm(false);
      setForm({});
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error adding department:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleManageSave() {
    if (!manageDept) return;
    setLoading(true);
    
    try {
      const { error } = await supabase.from('departments')
        .update({
          name: manageDept.name,
          description: manageDept.description,
          head_user_id: manageDept.head_user_id
        })
        .eq('id', manageDept.id);
      
      if (error) throw error;
      
      setManageDept(null);
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error('Error updating department:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 bg-[#fff8f3] min-h-screen">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg">Loading...</div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="text-3xl font-bold">Departments</div>
          <div className="text-gray-600">Organize and manage your company departments</div>
        </div>
        <Button 
          className="bg-orange-400 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded flex items-center gap-2" 
          onClick={() => setShowForm(true)}
          disabled={loading}
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
          <div className="text-3xl font-bold">
            {departments.reduce((a, d) => a + (d.employee_count || 0), 0)}
          </div>
        </Card>
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="text-xs text-gray-500 mb-1">Average Growth</div>
          <div className="text-3xl font-bold">
            +{departments.length ? (departments.reduce((a, d) => a + (d.growth || 0), 0) / departments.length).toFixed(1) : 0}%
          </div>
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
              onChange={e => setForm({ ...form, name: e.target.value })} 
            />
            <Input 
              className="mb-3" 
              placeholder="Description" 
              value={form.description || ''} 
              onChange={e => setForm({ ...form, description: e.target.value })} 
            />
            <Select 
              value={form.department_head_id || ''} 
              onValueChange={val => setForm({ ...form, department_head_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department Head" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      {emp.image ? (
                        <img 
                          src={emp.image} 
                          alt={emp.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">NA</span>
                        </div>
                      )}
                      {emp.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" 
                onClick={handleAdd}
                disabled={loading}
              >
                Add
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Department Details Modal */}
      {selectedDept && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <Card className="p-8 w-full max-w-md">
            <div className="text-xl font-bold mb-4">Department Details</div>
            <div className="mb-4">
              <div className="font-semibold text-gray-600 mb-1">Name</div>
              <div>{selectedDept.name}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-600 mb-1">Description</div>
              <div>{selectedDept.description || '—'}</div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-600 mb-1">Department Head</div>
              <div className="flex items-center gap-2">
                {selectedDept.head_image ? (
                  <img 
                    src={selectedDept.head_image} 
                    alt={selectedDept.head_name} 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs">NA</span>
                  </div>
                )}
                <div>{selectedDept.head_name || 'Not assigned'}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-semibold text-gray-600 mb-1">Employees</div>
              <div>{selectedDept.employee_count}</div>
            </div>
            <Button className="mt-4 w-full" onClick={() => setSelectedDept(null)}>
              Close
            </Button>
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
              onChange={e => setManageDept({ ...manageDept, name: e.target.value })} 
            />
            <Input 
              className="mb-3" 
              placeholder="Description" 
              value={manageDept.description || ''} 
              onChange={e => setManageDept({ ...manageDept, description: e.target.value })} 
            />
            <Select 
              value={manageDept.head_user_id || ''} 
              onValueChange={val => setManageDept({ ...manageDept, head_user_id: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Department Head" />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    <div className="flex items-center gap-2">
                      {emp.image ? (
                        <img 
                          src={emp.image} 
                          alt={emp.name} 
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-xs">NA</span>
                        </div>
                      )}
                      {emp.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setManageDept(null)}>
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white" 
                onClick={handleManageSave}
                disabled={loading}
              >
                Save
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}