import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Filter, Grid, List } from 'lucide-react';

interface Employee {
  id: string;
  employee_id: string;
  name: string;
  mobile_number: string;
  designation: string;
  department: string;
  image?: string;
  reporting_manager_id?: string;
  reporting_manager_name?: string;
  reporting_manager_image?: string;
}

export default function Employees() {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEmployees() {
      try {
        // First fetch all employees to build complete manager data
        const { data: allEmployees, error: allError } = await supabase
          .from('employee_master')
          .select('id, employee_id, name, image');
        
        if (allError) throw allError;

        const managerMap = new Map(
          allEmployees.map(emp => [emp.id, emp])
        );

        // Then fetch current employees with their full details
        const { data: emps, error } = await supabase
          .from('employee_master')
          .select(`
            *,
            designations(name),
            departments(name)
          `);
        
        if (error) throw error;

        const enriched = emps.map(emp => {
          const manager = emp.reporting_manager_id ? managerMap.get(emp.reporting_manager_id) : null;
          
          return {
            id: emp.id,
            employee_id: emp.employee_id,
            name: emp.name,
            mobile_number: emp.mobile_number,
            designation: emp.designations?.name || '',
            department: emp.departments?.name || '',
            image: emp.image,
            reporting_manager_id: emp.reporting_manager_id,
            reporting_manager_name: manager?.name || 'Not assigned',
            reporting_manager_image: manager?.image || null
          };
        });

        setEmployees(enriched);
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const searchFields = [
      employee.employee_id,
      employee.name,
      employee.mobile_number,
      employee.designation,
      employee.department,
      employee.reporting_manager_name
    ];
    
    return searchFields.some(field => 
      field?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleEmployeeClick = (employeeId: string) => {
    navigate(`/employees/view/${employeeId}`);
  };

  const handleManagerClick = (e: React.MouseEvent, managerId: string) => {
    e.stopPropagation();
    navigate(`/employees/view/${managerId}`);
  };

  if (loading) return <div className="p-4">Loading...</div>;

  const renderTableView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Image</TableHead>
              <TableHead>Emp ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Reporting Manager</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow 
                key={employee.id} 
                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => handleEmployeeClick(employee.id)}
              >
                <TableCell>
                  <div className="flex items-center">
                    {employee.image ? (
                      <img 
                        src={employee.image} 
                        alt={employee.name} 
                        className="w-14 h-14 rounded-full object-cover border-2 border-gray-200" 
                      />
                    ) : (
                      <Avatar className="w-14 h-14 border-2 border-gray-200">
                        <AvatarFallback className="text-xl">
                          {employee.name?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{employee.employee_id}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.mobile_number}</TableCell>
                <TableCell>{employee.designation}</TableCell>
                <TableCell>{employee.department}</TableCell>
                <TableCell>
                  {employee.reporting_manager_id ? (
                    <div 
                      className="flex items-center gap-3 hover:underline cursor-pointer"
                      onClick={(e) => handleManagerClick(e, employee.reporting_manager_id!)}
                    >
                      {employee.reporting_manager_image ? (
                        <img 
                          src={employee.reporting_manager_image} 
                          alt={employee.reporting_manager_name} 
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200" 
                        />
                      ) : (
                        <Avatar className="w-10 h-10 border-2 border-gray-200">
                          <AvatarFallback className="text-sm">
                            {employee.reporting_manager_name?.[0]?.toUpperCase() || 'M'}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <span className="font-medium">{employee.reporting_manager_name}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">Not assigned</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (confirm('Are you sure you want to delete this employee?')) {
                        await supabase.from('employee_master').delete().eq('id', employee.id);
                        setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
                      }
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredEmployees.map((employee) => (
        <Card 
          key={employee.id} 
          className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleEmployeeClick(employee.id)}
        >
          <CardHeader className="text-center pb-2">
            {employee.image ? (
              <img 
                src={employee.image} 
                alt={employee.name} 
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 mx-auto mb-2" 
              />
            ) : (
              <Avatar className="w-20 h-20 border-2 border-gray-200 mx-auto mb-2">
                <AvatarFallback className="text-2xl">
                  {employee.name?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
            )}
            <CardTitle className="text-lg">{employee.name}</CardTitle>
            <CardDescription>{employee.designation}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-medium">{employee.employee_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Department:</span>
              <span className="font-medium">{employee.department}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Mobile:</span>
              <span className="font-medium">{employee.mobile_number}</span>
            </div>
            {employee.reporting_manager_id && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-1">Reporting Manager</div>
                <div 
                  className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded cursor-pointer"
                  onClick={(e) => handleManagerClick(e, employee.reporting_manager_id!)}
                >
                  {employee.reporting_manager_image ? (
                    <img 
                      src={employee.reporting_manager_image} 
                      alt={employee.reporting_manager_name} 
                      className="w-8 h-8 rounded-full object-cover border border-gray-200" 
                    />
                  ) : (
                    <Avatar className="w-8 h-8 border border-gray-200">
                      <AvatarFallback className="text-xs">
                        {employee.reporting_manager_name?.[0]?.toUpperCase() || 'M'}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <span className="text-sm font-medium">{employee.reporting_manager_name}</span>
                </div>
              </div>
            )}
            <div className="pt-2">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full"
                onClick={async (e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this employee?')) {
                    await supabase.from('employee_master').delete().eq('id', employee.id);
                    setEmployees(prev => prev.filter(emp => emp.id !== employee.id));
                  }
                }}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Employee Directory</h1>
          <p className="text-muted-foreground">A complete list of all employees in your organization</p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90" 
          onClick={() => navigate('/employees/add')}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="h-8 px-3"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="h-8 px-3"
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing {filteredEmployees.length} of {employees.length} employees</span>
        <Badge variant="outline">
          {viewMode === 'table' ? 'Table View' : 'Card View'}
        </Badge>
      </div>

      {viewMode === 'table' ? renderTableView() : renderCardView()}
    </div>
  );
}