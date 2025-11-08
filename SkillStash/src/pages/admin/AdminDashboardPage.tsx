import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Tag, Clock, Award, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, you'd fetch this from your API
const stats = [
  {
    title: 'Total Courses',
    value: '1,245',
    change: '+12%',
    trend: 'up',
    icon: BookOpen,
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    title: 'Active Coupons',
    value: '847',
    change: '+5%',
    trend: 'up',
    icon: Tag,
    bgColor: 'bg-green-500/10',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    title: 'Total Users',
    value: '5,432',
    change: '+20%',
    trend: 'up',
    icon: Users,
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    title: 'Claimed Today',
    value: '123',
    change: '0%',
    trend: 'neutral',
    icon: TrendingUp,
    bgColor: 'bg-orange-500/10',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
];

const recentActivity = [
  { id: 1, action: 'New course added', course: 'Advanced React Patterns', time: '5 min ago', type: 'success' },
  { id: 2, action: 'Course updated', course: 'Python for Beginners', time: '1 hour ago', type: 'info' },
  { id: 3, action: 'Coupon expired', course: 'Web Design Masterclass', time: '2 hours ago', type: 'warning' },
  { id: 4, action: 'New enrollment', course: 'JavaScript Essentials', time: '3 hours ago', type: 'success' },
  { id: 5, action: 'Course deleted', course: 'Old PHP Tutorial', time: '5 hours ago', type: 'destructive' },
];

const topCourses = [
  { id: 1, title: 'Complete Web Development Bootcamp', claims: 1234, rating: 4.8, trend: '+15%' },
  { id: 2, title: 'Machine Learning A-Z', claims: 987, rating: 4.9, trend: '+22%' },
  { id: 3, title: 'React - The Complete Guide', claims: 856, rating: 4.7, trend: '+8%' },
  { id: 4, title: 'Python Data Science', claims: 743, rating: 4.6, trend: '+12%' },
  { id: 5, title: 'UI/UX Design Fundamentals', claims: 621, rating: 4.8, trend: '+18%' },
];

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Badge variant="outline" className="gap-1">
          <Activity className="h-3 w-3" />
          Live
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 
                  stat.trend === 'down' ? 'text-red-600 dark:text-red-400' : 
                  'text-muted-foreground'
                }`}>
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <Badge variant="secondary" className="text-xs">Last 24h</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <Badge variant={activity.type as any} className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.course}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Top Courses
              </CardTitle>
              <Badge variant="secondary" className="text-xs">This Month</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCourses.map((course, index) => (
                <div key={course.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{course.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground">{course.claims} claims</span>
                      <span className="text-xs text-muted-foreground">★ {course.rating}</span>
                      <span className="text-xs text-green-600 dark:text-green-400">{course.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="p-4 rounded-lg border bg-card hover:bg-secondary transition-colors text-left">
              <BookOpen className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Add Course</p>
              <p className="text-xs text-muted-foreground mt-1">Create new course</p>
            </button>
            <button className="p-4 rounded-lg border bg-card hover:bg-secondary transition-colors text-left">
              <Tag className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">New Coupon</p>
              <p className="text-xs text-muted-foreground mt-1">Generate coupon</p>
            </button>
            <button className="p-4 rounded-lg border bg-card hover:bg-secondary transition-colors text-left">
              <Users className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">View Users</p>
              <p className="text-xs text-muted-foreground mt-1">Manage users</p>
            </button>
            <button className="p-4 rounded-lg border bg-card hover:bg-secondary transition-colors text-left">
              <Activity className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-medium">Analytics</p>
              <p className="text-xs text-muted-foreground mt-1">View reports</p>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;