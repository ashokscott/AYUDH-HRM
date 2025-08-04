import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, DollarSign, TrendingUp, CalendarDays, UserCheck } from 'lucide-react';

const Index = () => {
  const dashboardStats = [
    {
      title: 'Total Employees',
      value: '246',
      change: '+12%',
      icon: Users,
      color: 'bg-gradient-to-r from-blue-500 to-blue-600'
    },
    {
      title: 'Present Today',
      value: '234',
      change: '95.1%',
      icon: UserCheck,
      color: 'bg-gradient-to-r from-green-500 to-green-600'
    },
    {
      title: 'On Leave',
      value: '8',
      change: '3.2%',
      icon: CalendarDays,
      color: 'bg-gradient-to-r from-orange-500 to-orange-600'
    },
    {
      title: 'Monthly Payroll',
      value: '$124,500',
      change: '+8.2%',
      icon: DollarSign,
      color: 'bg-gradient-to-r from-purple-500 to-purple-600'
    }
  ];

  const quickActions = [
    { title: 'Add New Employee', description: 'Register a new team member', href: '/employees/add' },
    { title: 'Mark Attendance', description: 'Record daily attendance', href: '/attendance' },
    { title: 'Generate Payroll', description: 'Process monthly salaries', href: '/payroll' },
    { title: 'View Reports', description: 'Access analytics and insights', href: '/reports' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to HRM Portal</h1>
        <p className="text-white/90">Manage your workforce efficiently with our comprehensive HR solutions</p>
      </div>

      {/* Dashboard Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <Badge variant="secondary" className="mt-2">
                {stat.change} from last month
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Frequently used operations for better productivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="ghost"
                className="w-full justify-start h-auto p-4 text-left"
                asChild
              >
                <a href={action.href}>
                  <div>
                    <div className="font-medium">{action.title}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">John Doe marked attendance</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New employee Sarah Wilson added</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Leave request from Mike Johnson</p>
                  <p className="text-xs text-muted-foreground">3 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payroll processed for March</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
