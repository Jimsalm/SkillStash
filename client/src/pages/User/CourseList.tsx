import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, AlertCircle, ExternalLink, Eye } from 'lucide-react';
import { useActiveCourses } from '@/hooks/useCourses';
import type { Course } from '@/api/courseApi';

const fromSlug = (slug?: string): string => {
  if (!slug) return '';
  
  if (slug.includes('user-experience-ux')) return 'User Experience (UX) Design';
  if (slug.includes('user-interface-ui')) return 'User Interface (UI) Design';
  if (slug.includes('3d-and-animation')) return '3D & Animation';
  
  return slug
    .split('-')
    .map(word => word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const CourseCard = ({ course }: { course: Course }) => {
  const savings = course.originalPrice > 0 && course.discountedPrice > 0
    ? Math.round(((course.originalPrice - course.discountedPrice) / course.originalPrice) * 100)
    : 0;

  return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
        <div className="relative h-48 bg-muted">
           <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://placehold.co/400x225?text=No+Image';
            }}
          />
        </div>
        <CardHeader className="flex-grow">
          <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
          <CardDescription className="line-clamp-2">{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {course.software.slice(0, 3).map((tech: string) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              {course.discountedPrice === 0 ? (
                <span className="text-2xl font-bold text-primary">FREE</span>
              ) : (
                <>
                  <span className="text-2xl font-bold text-primary">${course.discountedPrice}</span>
                  <span className="ml-2 text-sm text-muted-foreground line-through">
                    ${course.originalPrice}
                  </span>
                </>
              )}
            </div>
            {course.discountedPrice > 0 && savings > 0 && (
              <Badge variant="destructive">
                {savings}% OFF
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link to={`/courses/details/${course._id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <a href={course.udemyUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
  );
};

const CourseList = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();
  
  //Fetch all active courses
  const { data: allCourses, isLoading, error } = useActiveCourses();

  //Filter client-side based on slugs
  const courses = useMemo(() => {
    if (!allCourses) return [];
    const catName = fromSlug(category);
    const subCatName = fromSlug(subcategory);
    
    return allCourses.filter(
      (course) => course.category === catName && course.subcategory === subCatName
    );
  }, [allCourses, category, subcategory]);

  const subcategoryName = fromSlug(subcategory);

  if (isLoading) {
    return (
      <main className="flex-1 bg-background flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 bg-background flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600">{error.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-background">
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/courses/categories">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Categories
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tighter">{subcategoryName} Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Discover the best deals on courses in the {subcategoryName} category.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course: Course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold">No courses found.</h2>
              <p className="text-muted-foreground mt-2">
                It looks like there are no courses available in this category yet. Check back later!
              </p>
              <Button asChild className="mt-6">
                <Link to="/courses/categories">
                  Browse All Categories
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CourseList;