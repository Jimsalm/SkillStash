import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, ArrowLeft, Users, Clock, Tag, Loader2, AlertCircle } from 'lucide-react';
import { courseService } from '@/services/courseService';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return;
      try {
        const fetchedCourse = await courseService.getCourseById(id);
        setCourse(fetchedCourse);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <main className="flex-1 bg-background flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading course details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-background flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Error Loading Course</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button asChild>
            <Link to="/courses/categories">Back to Categories</Link>
          </Button>
        </div>
      </main>
    );
  }

  if (!course) {
    return (
      <main className="flex-1 bg-background flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Course Not Found</h1>
          <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the course you're looking for.</p>
          <Button asChild className="mt-6">
            <Link to="/courses/categories">Back to Categories</Link>
          </Button>
        </div>
      </main>
    );
  }

  const savings = course.originalPrice > 0 && course.discountedPrice > 0 
    ? Math.round(((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100)
    : 0;

  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/courses/categories">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Categories
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full rounded-lg shadow-lg"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/800x450?text=No+Image+Available'; }}
            />
            
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-lg text-muted-foreground mt-2">by {course.instructor}</p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline">{course.category}</Badge>
                <Badge variant="outline">{course.subcategory}</Badge>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">What you'll learn</h2>
              <p className="text-muted-foreground mb-4">
                This course covers popular tools and technologies that will help you master {course.subcategory}.
              </p>
              <div className="flex flex-wrap gap-2">
                {course.software.map((tech: string) => (
                  <Badge key={tech} variant="outline" className="text-base py-1 px-3">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>

            {course.couponCode && (
              <div className="bg-accent/50 p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Coupon Code</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Use this code at checkout: <code className="bg-background px-2 py-1 rounded font-mono">{course.couponCode}</code>
                </p>
                {course.expiresAt && (
                  <p className="text-xs text-muted-foreground">
                    Expires: {new Date(course.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-card rounded-lg shadow-lg border">
              <div className="mb-4">
                <span className="text-4xl font-bold text-primary">${course.discountedPrice}</span>
                <span className="ml-2 text-lg text-muted-foreground line-through">
                  ${course.originalPrice}
                </span>
              </div>
              
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 px-3 py-2 rounded-md text-sm font-medium mb-4">
                Save ${(course.originalPrice - course.discountedPrice).toFixed(2)} ({savings}% off)
              </div>
              
              <Separator className="my-4" />

              <div className="space-y-2 text-sm text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{course.claimedCount.toLocaleString()} students claimed</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Limited time offer</span>
                </div>
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  <span className={course.isActive ? "text-green-600" : "text-red-600"}>
                    {course.isActive ? "Deal Active" : "Deal Expired"}
                  </span>
                </div>
              </div>

              <Button 
                asChild 
                className="w-full text-lg py-3 mb-3"
                disabled={!course.isActive}
              >
                <a href={course.udemyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Get Deal on Udemy
                </a>
              </Button>
              
              {!course.isActive && (
                <p className="text-xs text-red-600 text-center mb-2">
                  This deal has expired
                </p>
              )}
              
              <p className="text-xs text-muted-foreground text-center">
                Coupon applied automatically. This is an affiliate link.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;