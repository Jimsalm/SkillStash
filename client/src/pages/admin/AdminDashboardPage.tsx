import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, TrendingUp, Tag, Clock, Award, Activity, ArrowUpRight, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query'; // Import useQuery
import { getDashboardStats, getRecentActivity, getTopCourses } from '@/api/dashboardApi';
import type { DashboardStats, ActivityItem, TopCourse } from '@/api/dashboardApi';
import { Alert, AlertDescription } from '@/components/ui/alert'; 
import { AlertCircle } from 'lucide-react';


const AdminDashboardPage = () => {

  //Dashboard Stats
  const { data: stats, isLoading: statsLoading, error: statsError} = useQuery<DashboardStats[], Error>({
    queryKey: ['dashboard', 'stats'],
    queryFn: getDashboardStats,
  });

  //Recent Activity
  const { data: recentActivity, isLoading: activityLoading, error: activityError} = useQuery<ActivityItem[], Error>({
    queryKey: ['dashboard', 'recent-activity', ],
    queryFn: getRecentActivity,
  });

  //Top Courses
  const { data: topCourses, isLoading: coursesLoading, error: coursesError} = useQuery<TopCourse[], Error>({
    queryKey: ['dashboard', 'top-courses'],
    queryFn: getTopCourses,
  });

  const isLoading = statsLoading || activityLoading || coursesLoading;
  const error = statsError || activityError || coursesError;

  if(isLoading){
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
        <div className="flex items-center justify-center h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Failed to load dashboard</p>
              <p className="text-sm">{error.message}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
                  </AlertDescription>
              </Alert>
          </div>
      );
  }

  return (
    <div className="space-y-6 p-12 overflow-y-auto">
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
        {stats?.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`h-5 w-5 ${stat.iconColor}`} />
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
          );
        })}
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
              {recentActivity?.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <Badge variant={activity.type as any} className="text-xs">
                        {activity.type === 'default' ? 'new' : activity.type}
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
              {topCourses?.map((course, index) => (
                <div key={course.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{course.title}</p>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/add-course">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-secondary">
                <div className="flex items-center gap-2 w-full">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">Add Course</p>
                  <p className="text-xs text-muted-foreground">Create new course</p>
                </div>
              </Button>
            </Link>

            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-secondary">
              <div className="flex items-center gap-2 w-full">
                <Tag className="h-5 w-5 text-primary" />
                <Plus className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">New Coupon</p>
                <p className="text-xs text-muted-foreground">Generate coupon</p>
              </div>
            </Button>

            <Link to="/admin/courses">
              <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-secondary">
                <div className="flex items-center gap-2 w-full">
                  <Users className="h-5 w-5 text-primary" />
                  <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium">All Courses</p>
                  <p className="text-xs text-muted-foreground">Manage courses</p>
                </div>
              </Button>
            </Link>

            <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-secondary">
              <div className="flex items-center gap-2 w-full">
                <Activity className="h-5 w-5 text-primary" />
                <TrendingUp className="h-4 w-4 ml-auto text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Analytics</p>
                <p className="text-xs text-muted-foreground">View reports</p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;