import { useParams, Link } from 'react-router-dom';
import { coursesData } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator'; // You may need to add this: npx shadcn-ui@latest add separator
import { ExternalLink, ArrowLeft, Users, Clock } from 'lucide-react';

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  
  // Find the course with the matching ID
  const course = coursesData.find((c) => c.id === id);

  // Handle case where course is not found
  if (!course) {
    return (
      <main className="flex-1 bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Course Not Found</h1>
          <p className="mt-4 text-muted-foreground">Sorry, we couldn't find the course you're looking for.</p>
          <Button asChild className="mt-6">
            <Link to="/courses">Back to Courses</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <img src={course.image} alt={course.title} className="w-full rounded-lg shadow-lg" />
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-lg text-muted-foreground mt-2">by {course.instructor}</p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-2">What you'll learn</h2>
              <p className="text-muted-foreground">This course covers popular tools and technologies.</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {course.software.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-base py-1 px-3">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
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
              </div>

              <Button asChild className="w-full text-lg py-3">
                <a href={course.udemyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Get Deal on Udemy
                </a>
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
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