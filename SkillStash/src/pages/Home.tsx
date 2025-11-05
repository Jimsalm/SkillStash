import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Trash2, Users, Lightbulb, Gift, Star } from 'lucide-react';

const Home = () => {
  const stats = [
    {
      title: 'Used Coupons',
      value: '12,543',
      description: 'Coupons successfully redeemed by our users.',
      icon: <CheckCircle className="h-6 w-6 text-green-600" />,
    },
    {
      title: 'Active Coupons',
      value: '847',
      description: 'Fresh deals available right now.',
      icon: <Zap className="h-6 w-6 text-blue-600" />,
    },
    {
      title: 'Removed Coupons',
      value: '3,210',
      description: 'Expired or invalid deals we\'ve cleaned up.',
      icon: <Trash2 className="h-6 w-6 text-red-600" />,
    },
    {
      title: 'Happy Learners',
      value: '5,000+',
      description: 'People who have saved money with SkillStash.',
      icon: <Users className="h-6 w-6 text-purple-600" />,
    },
  ];

  const features = [
    {
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
      title: 'Discover Deals',
      description: 'We constantly search the web for the best and most valid Udemy coupons.',
    },
    {
      icon: <Gift className="h-8 w-8 text-primary" />,
      title: 'Click & Apply',
      description: 'Found a course you like? One click copies the coupon and takes you to the course page.',
    },
    {
      icon: <Star className="h-8 w-8 text-primary" />,
      title: 'Learn & Grow',
      description: 'Enroll in your desired course for a fraction of the price and boost your skills.',
    },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-24 md:py-32">
        {/* This div is now responsible for centering */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to <span className="text-primary">SkillStash</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Stop searching for deals. Start learning. We find the best discounted Udemy courses so you can focus on what matters most: your growth.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="animate-pulse">
              <Link to="/courses">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        {/* This div is now responsible for centering */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">SkillStash by the Numbers</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        {/* This div is now responsible for centering */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-4">How SkillStash Works</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-[600px] mx-auto">
            Getting your dream course at an unbeatable price is as easy as 1-2-3.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="text-center p-6 border-0 shadow-none">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  {feature.icon}
                </div>
                <CardTitle className="mb-2">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;