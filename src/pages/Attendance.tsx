import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const attendanceData = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    checkIn: '09:00 AM',
    checkOut: '06:00 PM',
    status: 'Present',
    hoursWorked: '9h 0m',
    date: '2024-01-24'
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    checkIn: '09:15 AM',
    checkOut: '06:15 PM',
    status: 'Late',
    hoursWorked: '9h 0m',
    date: '2024-01-24'
  },
  {
    id: 3,
    name: 'Carol Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    checkIn: '08:45 AM',
    checkOut: '05:45 PM',
    status: 'Present',
    hoursWorked: '9h 0m',
    date: '2024-01-24'
  },
  {
    id: 4,
    name: 'David Brown',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    checkIn: '-',
    checkOut: '-',
    status: 'Absent',
    hoursWorked: '0h 0m',
    date: '2024-01-24'
  },
  {
    id: 5,
    name: 'Emma Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    checkIn: '10:30 AM',
    checkOut: '-',
    status: 'Half Day',
    hoursWorked: '4h 30m',
    date: '2024-01-24'
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Present':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'Late':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    case 'Absent':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'Half Day':
      return <Clock className="h-4 w-4 text-orange-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'Present':
      return 'default';
    case 'Late':
      return 'secondary';
    case 'Absent':
      return 'destructive';
    case 'Half Day':
      return 'outline';
    default:
      return 'secondary';
  }
};

export default function Attendance() {
  const presentCount = attendanceData.filter(emp => emp.status === 'Present').length;
  const lateCount = attendanceData.filter(emp => emp.status === 'Late').length;
  const absentCount = attendanceData.filter(emp => emp.status === 'Absent').length;
  const halfDayCount = attendanceData.filter(emp => emp.status === 'Half Day').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Select Date
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            Mark Attendance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Present</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">{presentCount}</div>
            <p className="text-xs text-green-600">
              {((presentCount / attendanceData.length) * 100).toFixed(1)}% attendance
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Late</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">{lateCount}</div>
            <p className="text-xs text-yellow-600">
              {((lateCount / attendanceData.length) * 100).toFixed(1)}% late arrivals
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300">Absent</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-800 dark:text-red-200">{absentCount}</div>
            <p className="text-xs text-red-600">
              {((absentCount / attendanceData.length) * 100).toFixed(1)}% absent today
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Half Day</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{halfDayCount}</div>
            <p className="text-xs text-orange-600">
              {((halfDayCount / attendanceData.length) * 100).toFixed(1)}% half day
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Attendance</CardTitle>
          <CardDescription>Real-time attendance tracking for January 24, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Hours Worked</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceData.map((employee) => (
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
                  <TableCell>{employee.checkIn}</TableCell>
                  <TableCell>{employee.checkOut}</TableCell>
                  <TableCell>{employee.hoursWorked}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(employee.status)}
                      <Badge variant={getStatusVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
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