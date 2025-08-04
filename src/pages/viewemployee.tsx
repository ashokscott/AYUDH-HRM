import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, User, Building, Briefcase } from 'lucide-react';

export default function ViewEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const { data, error } = await supabase
          .from('employee_master')
          .select(`
            *,
            designations(name),
            departments(name),
            employee_type(name, image_url),
            reporting_manager:reporting_manager_id(id, name, image, employee_id)
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchEmployee();
  }, [id]);

  if (loading) return (
    <div className="p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading employee details...</p>
      </div>
    </div>
  );

  if (!employee) return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Employee not found</h1>
      <Button onClick={() => navigate('/employees')}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Employees
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Employees
        </Button>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
          <Edit className="h-4 w-4 mr-2" />
          Edit Employee
        </Button>
      </div>

      {/* Main Profile Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary to-secondary h-32"></div>
        <CardContent className="relative pt-0 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
            {/* Profile Image */}
            <div className="relative">
              {employee.image ? (
                <img 
                  src={employee.image} 
                  alt={employee.name} 
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" 
                />
              ) : (
                <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                  <AvatarFallback className="text-4xl bg-muted">
                    {employee.name?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              )}
              {employee.employee_type?.image_url && (
                <div className="absolute -bottom-2 -right-2">
                  <img 
                    src={employee.employee_type.image_url} 
                    alt={employee.employee_type.name}
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md"
                  />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">{employee.name}</h1>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <Badge variant="default" className="text-sm">
                  {employee.designations?.name || 'No Designation'}
                </Badge>
                <Badge variant="secondary" className="text-sm">
                  {employee.departments?.name || 'No Department'}
                </Badge>
                {employee.employee_type?.name && (
                  <Badge variant="outline" className="text-sm">
                    {employee.employee_type.name}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>ID: {employee.employee_id}</span>
                </div>
                {employee.date_of_joining && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Joined: {new Date(employee.date_of_joining).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {employee.mobile_number && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Mobile</p>
                  <p className="font-medium">{employee.mobile_number}</p>
                </div>
              </div>
            )}
            {employee.personal_mail_id && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Personal Email</p>
                  <p className="font-medium">{employee.personal_mail_id}</p>
                </div>
              </div>
            )}
            {employee.official_mail_id && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Official Email</p>
                  <p className="font-medium">{employee.official_mail_id}</p>
                </div>
              </div>
            )}
            {employee.current_address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p className="text-sm text-muted-foreground">Current Address</p>
                  <p className="font-medium">{employee.current_address}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Work Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Work Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Building className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{employee.departments?.name || 'Not assigned'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium">{employee.designations?.name || 'Not assigned'}</p>
              </div>
            </div>
            {employee.shift_from && employee.shift_to && (
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Shift Timing</p>
                  <p className="font-medium">{employee.shift_from} - {employee.shift_to}</p>
                </div>
              </div>
            )}
            {employee.branch_name && (
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Branch</p>
                  <p className="font-medium">{employee.branch_name}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reporting Manager */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Reporting Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            {employee.reporting_manager ? (
              <div 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                onClick={() => navigate(`/employees/view/${employee.reporting_manager.id}`)}
              >
                {employee.reporting_manager.image ? (
                  <img 
                    src={employee.reporting_manager.image} 
                    alt={employee.reporting_manager.name} 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                  />
                ) : (
                  <Avatar className="w-12 h-12 border-2 border-gray-200">
                    <AvatarFallback>
                      {employee.reporting_manager.name?.[0]?.toUpperCase() || 'M'}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="font-medium">{employee.reporting_manager.name}</p>
                  <p className="text-sm text-muted-foreground">ID: {employee.reporting_manager.employee_id}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No reporting manager assigned</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employee.date_of_birth && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Date of Birth</p>
                <p className="font-medium">{new Date(employee.date_of_birth).toLocaleDateString()}</p>
              </div>
            )}
            {employee.gender && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Gender</p>
                <p className="font-medium">{employee.gender}</p>
              </div>
            )}
            {employee.blood_group && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Blood Group</p>
                <p className="font-medium">{employee.blood_group}</p>
              </div>
            )}
            {employee.highest_education && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Education</p>
                <p className="font-medium">{employee.highest_education}</p>
              </div>
            )}
            {employee.emergency_contact_name && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Emergency Contact</p>
                <p className="font-medium">{employee.emergency_contact_name}</p>
                {employee.emergency_contact_number && (
                  <p className="text-sm text-muted-foreground">{employee.emergency_contact_number}</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      {(employee.bank_name || employee.account_number) && (
        <Card>
          <CardHeader>
            <CardTitle>Bank Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {employee.account_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Account Name</p>
                  <p className="font-medium">{employee.account_name}</p>
                </div>
              )}
              {employee.account_number && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Account Number</p>
                  <p className="font-medium">{employee.account_number}</p>
                </div>
              )}
              {employee.bank_name && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Bank Name</p>
                  <p className="font-medium">{employee.bank_name}</p>
                </div>
              )}
              {employee.ifsc_code && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">IFSC Code</p>
                  <p className="font-medium">{employee.ifsc_code}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}