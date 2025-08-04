import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Star, Award, Plus } from 'lucide-react';

const performanceData = [
  {
    id: 1,
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    department: 'Engineering',
    overallScore: 92,
    goals: {
      completed: 8,
      total: 10
    },
    kpiScore: 95,
    rating: 'Excellent',
    lastReview: '2024-01-15'
  },
  {
    id: 2,
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    department: 'Marketing',
    overallScore: 88,
    goals: {
      completed: 7,
      total: 9
    },
    kpiScore: 90,
    rating: 'Very Good',
    lastReview: '2024-01-10'
  },
  {
    id: 3,
    name: 'Carol Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    department: 'HR',
    overallScore: 85,
    goals: {
      completed: 6,
      total: 8
    },
    kpiScore: 87,
    rating: 'Good',
    lastReview: '2024-01-20'
  }
];

const getRatingColor = (rating: string) => {
  switch (rating) {
    case 'Excellent':
      return 'bg-green-500';
    case 'Very Good':
      return 'bg-blue-500';
    case 'Good':
      return 'bg-yellow-500';
    case 'Average':
      return 'bg-orange-500';
    default:
      return 'bg-gray-500';
  }
};

export default function Performance() {
  const avgScore = performanceData.reduce((sum, emp) => sum + emp.overallScore, 0) / performanceData.length;
  const totalGoals = performanceData.reduce((sum, emp) => sum + emp.goals.total, 0);
  const completedGoals = performanceData.reduce((sum, emp) => sum + emp.goals.completed, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Performance Management</h1>
          <p className="text-muted-foreground">Track and manage employee performance metrics</p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{avgScore.toFixed(1)}%</div>
            <p className="text-xs text-blue-600">
              +3% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Goals Completed</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">
              {completedGoals}/{totalGoals}
            </div>
            <p className="text-xs text-green-600">
              {((completedGoals / totalGoals) * 100).toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Top Performers</CardTitle>
            <Star className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
              {performanceData.filter(emp => emp.overallScore >= 90).length}
            </div>
            <p className="text-xs text-purple-600">
              Excellence rating
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Reviews Due</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">5</div>
            <p className="text-xs text-orange-600">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {performanceData.map((employee) => (
          <Card key={employee.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employee.avatar} />
                    <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{employee.name}</CardTitle>
                    <CardDescription>{employee.department}</CardDescription>
                  </div>
                </div>
                <Badge className={getRatingColor(employee.rating)}>
                  {employee.rating}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Overall Performance</span>
                  <span className="font-medium">{employee.overallScore}%</span>
                </div>
                <Progress value={employee.overallScore} className="h-2" />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>KPI Score</span>
                  <span className="font-medium">{employee.kpiScore}%</span>
                </div>
                <Progress value={employee.kpiScore} className="h-2" />
              </div>

              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">Goals Progress</p>
                  <p className="font-medium">{employee.goals.completed}/{employee.goals.total} completed</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Last Review</p>
                  <p className="font-medium">{employee.lastReview}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                <Button size="sm" className="flex-1">Schedule Review</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}