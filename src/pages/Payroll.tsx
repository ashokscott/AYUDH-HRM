import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DollarSign, TrendingUp, Users, FileText, Download } from 'lucide-react';

const payrollData = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    employeeId: 'EMP001',
    basicSalary: 75000,
    allowances: 15000,
    deductions: 8000,
    netSalary: 82000,
    status: 'Processed',
    payDate: '2024-01-31'
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    employeeId: 'EMP002',
    basicSalary: 65000,
    allowances: 12000,
    deductions: 7000,
    netSalary: 70000,
    status: 'Processed',
    payDate: '2024-01-31'
  },
  {
    id: 3,
    name: 'Carol Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    employeeId: 'EMP003',
    basicSalary: 60000,
    allowances: 10000,
    deductions: 6500,
    netSalary: 63500,
    status: 'Pending',
    payDate: '2024-01-31'
  },
  {
    id: 4,
    name: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    employeeId: 'EMP004',
    basicSalary: 70000,
    allowances: 14000,
    deductions: 7500,
    netSalary: 76500,
    status: 'Processing',
    payDate: '2024-01-31'
  },
  {
    id: 5,
    name: 'Emma Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    employeeId: 'EMP005',
    basicSalary: 68000,
    allowances: 13000,
    deductions: 7200,
    netSalary: 73800,
    status: 'Processed',
    payDate: '2024-01-31'
  }
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Processed':
      return 'default';
    case 'Processing':
      return 'secondary';
    case 'Pending':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function Payroll() {
  const totalPayroll = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
  const processedCount = payrollData.filter(emp => emp.status === 'Processed').length;
  const avgSalary = totalPayroll / payrollData.length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Dashboard</h1>
          <p className="text-muted-foreground">Manage employee compensation and payslips</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <FileText className="h-4 w-4 mr-2" />
            Generate Payslips
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Total Payroll</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {formatCurrency(totalPayroll)}
            </div>
            <p className="text-xs text-green-600">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Processed</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
              {processedCount}/{payrollData.length}
            </div>
            <p className="text-xs text-blue-600">
              {((processedCount / payrollData.length) * 100).toFixed(1)}% completion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Average Salary</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {formatCurrency(avgSalary)}
            </div>
            <p className="text-xs text-purple-600">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Pay Period</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">Jan 2024</div>
            <p className="text-xs text-orange-600">
              31 days period
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>January 2024 Payroll</CardTitle>
          <CardDescription>Monthly payroll summary for all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Employee ID</TableHead>
                <TableHead>Basic Salary</TableHead>
                <TableHead>Allowances</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead>Net Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={employee.avatar} />
                        <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span>{employee.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{employee.employeeId}</TableCell>
                  <TableCell>{formatCurrency(employee.basicSalary)}</TableCell>
                  <TableCell className="text-green-600">{formatCurrency(employee.allowances)}</TableCell>
                  <TableCell className="text-red-600">{formatCurrency(employee.deductions)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(employee.netSalary)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(employee.status)}>
                      {employee.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View Payslip
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}