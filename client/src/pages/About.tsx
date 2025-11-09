import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Heart, Coffee, Target, Zap, Shield } from 'lucide-react';

const About = () => {
  return (
    <main className="flex-1 bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            About SkillStash
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Our mission is to make quality education accessible to everyone, one coupon at a time.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card className="text-center p-8 border-0 shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl">The Story Behind SkillStash</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base">
              <p>
                As lifelong learners ourselves, we were frustrated by the high cost of online courses and the endless hunt for valid coupons. We spent more time searching for deals than actually learning.
              </p>
              <p>
                That's why we created SkillStash. It's a passion project designed to solve a problem we faced every day. We aggregate the best, most up-to-date Udemy deals in one place, so you can stop searching and start learning. We believe that empowering your skills shouldn't break the bank.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Mission Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Accessibility</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Making education affordable and accessible for all, regardless of their financial situation.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Efficiency</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Saving you time and effort by providing a curated, reliable list of active deals.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Trust</h3>
              <p className="text-sm text-muted-foreground mt-2">
                We verify our coupons to ensure you get what you promise: a great deal on a great course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Creator & Support Section */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Meet the Creator Card */}
            <Card>
              <CardHeader>
                <CardTitle>Meet the Creator</CardTitle>
                <CardDescription>The person behind the code.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://github.com/shadcn.png" alt="Creator" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">
                    James Maglolona
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Passionate developer & lifelong learner
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Buy Me a Coffee Card */}
            <Card>
              <CardHeader>
                <CardTitle>Support SkillStash</CardTitle>
                <CardDescription>Keep the project running.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you find SkillStash useful, consider buying us a coffee. Your support helps cover server costs and keeps the deals coming!
                </p>
                <Button className="w-full">
                  <Coffee className="mr-2 h-4 w-4" />
                  <a 
                    href="https://www.buymeacoffee.com/your-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Buy Me a Coffee
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Us CTA */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <p className="text-muted-foreground mb-8">
            Have a question, feedback, or a course you'd like to see featured? We'd love to hear from you!
          </p>
          <Button size="lg" asChild>
            <a href="mailto:contact@skillstash.com">
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </a>
          </Button>
        </div>
      </section>
    </main>
  );
};

export default About;