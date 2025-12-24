import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Zap, Trash2, Users, Lightbulb, Gift, Star } from 'lucide-react';
import { usePublicStats } from '@/hooks/useDashboard';

const Home = () => {
  
  const {data: stats, isLoading} = usePublicStats();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num)
  }

  const displayStats = stats || {
    usedCoupons: 0,
    activeCoupons: 0,
    removedCoupons: 0,
  }

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
    <main className="flex-1 bg-background">
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
              <Link to="/courses/categories">Browse All Courses</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8">SkillStash by the Numbers</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Used Coupons */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Used Coupons</CardTitle>
                <CheckCircle className="h-6 w-6 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(displayStats.usedCoupons)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Coupons successfully redeemed by our users.
                </p>
              </CardContent>
            </Card>

            {/* Active Coupons */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
                <Zap className="h-6 w-6 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(displayStats.activeCoupons)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Fresh deals available right now.
                </p>
              </CardContent>
            </Card>

            {/* Removed Coupons */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Removed Coupons</CardTitle>
                <Trash2 className="h-6 w-6 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? '...' : formatNumber(displayStats.removedCoupons)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Expired or invalid deals we've cleaned up.
                </p>
              </CardContent>
            </Card>

            {/* Happy Learners */}
            <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Happy Learners</CardTitle>
                <Users className="h-6 w-6 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  5,000+
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  People who have saved money with SkillStash.
                </p>
              </CardContent>
            </Card>

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