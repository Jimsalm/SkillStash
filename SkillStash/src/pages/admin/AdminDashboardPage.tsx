import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, Tag } from 'lucide-react';

// Mock data - in a real app, you'd fetch this from your API
const stats = [
  {
    title: 'Total Courses',
    value: '1,245',
    change: '+12% from last month',
    icon: <BookOpen className="h-6 w-6 text-blue-600" />,
  },
  {
    title: 'Active Coupons',
    value: '847',
    change: '+5% from last week',
    icon: <Tag className="h-6 w-6 text-green-600" />,
  },
  {
    title: 'Total Users',
    value: '5,432',
    change: '+20% from last month',
    icon: <Users className="h-6 w-6 text-purple-600" />,
  },
  {
    title: 'Claimed Today',
    value: '123',
    change: 'Same as yesterday',
    icon: <TrendingUp className="h-6 w-6 text-orange-600" />,
  },
];

const AdminDashboardPage = () => {
  console.log('AdminDashboardPage is rendering!');
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">A list of recent course additions or updates would go here.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Top Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">A list of the most claimed courses would go here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;