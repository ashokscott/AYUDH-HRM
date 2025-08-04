import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, FileText, TrendingUp, Users, Calendar, Filter } from 'lucide-react';

const monthlyData = [
  { month: 'Jan', employees: 45, attendance: 92, performance: 88 },
  { month: 'Feb', employees: 48, attendance: 94, performance: 90 },
  { month: 'Mar', employees: 52, attendance: 91, performance: 87 },
  { month: 'Apr', employees: 55, attendance: 93, performance: 92 },
  { month: 'May', employees: 58, attendance: 95, performance: 89 },
  { month: 'Jun', employees: 61, attendance: 96, performance: 91 }
];

const departmentData = [
  { name: 'Engineering', value: 35, color: '#3b82f6' },
  { name: 'Marketing', value: 25, color: '#10b981' },
  { name: 'Sales', value: 20, color: '#f59e0b' },
  { name: 'HR', value: 12, color: '#8b5cf6' },
  { name: 'Finance', value: 8, color: '#ef4444' }
];

const reportsData = [
  {
    id: 1,
    title: 'Monthly Attendance Report',
    description: 'Detailed attendance analysis for the current month',
    type: 'Attendance',
    lastGenerated: '2024-01-23',
    status: 'Ready'
  },
  {
    id: 2,
    title: 'Payroll Summary Report',
    description: 'Complete payroll breakdown and analysis',
    type: 'Payroll',
    lastGenerated: '2024-01-20',
    status: 'Ready'
  },
  {
    id: 3,
    title: 'Performance Analytics',
    description: 'Employee performance metrics and trends',
    type: 'Performance',
    lastGenerated: '2024-01-18',
    status: 'Processing'
  },
  {
    id: 4,
    title: 'Department Insights',
    description: 'Cross-departmental comparison and analysis',
    type: 'Analytics',
    lastGenerated: '2024-01-15',
    status: 'Ready'
  }
];

export default function Reports() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights and data analytics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">24</div>
            <p className="text-xs text-blue-600">+4 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Data Points</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">1,247</div>
            <p className="text-xs text-green-600">+12% growth</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">61</div>
            <p className="text-xs text-purple-600">All departments</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Last Updated</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">Today</div>
            <p className="text-xs text-orange-600">Real-time sync</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Employee Growth Trends</CardTitle>
            <CardDescription>Monthly employee count and performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="employees" stroke="#3b82f6" strokeWidth={2} />
                <Line type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="performance" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and download comprehensive reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportsData.map((report) => (
              <Card key={report.id} className="border-2 hover:border-primary/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{report.title}</CardTitle>
                      <CardDescription className="mt-1">{report.description}</CardDescription>
                    </div>
                    <Badge variant={report.status === 'Ready' ? 'default' : 'secondary'}>
                      {report.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Type: {report.type}</p>
                      <p className="text-sm text-muted-foreground">Last: {report.lastGenerated}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      <Button size="sm">Generate</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}