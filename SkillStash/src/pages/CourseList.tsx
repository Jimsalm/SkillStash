import { useParams, Link } from 'react-router-dom';
import { coursesData } from '@/data/courses';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

// Helper function to convert slug to readable text
const fromSlug = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/And/g, '&');
};

// Helper function to convert text to URL-friendly slug
const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, 'and');
};

// Course Card Component
const CourseCard = ({ course }: { course: any }) => {
  return (
    <Link to={`/courses/details/${course.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
        <img 
          src={course.image} 
          alt={course.title} 
          className="w-full h-48 object-cover"
        />
        <CardHeader>
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
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold text-primary">${course.discountedPrice}</span>
              <span className="ml-2 text-sm text-muted-foreground line-through">
                ${course.originalPrice}
              </span>
            </div>
            <Badge variant={course.isActive ? "default" : "secondary"}>
              {course.isActive ? "Active" : "Expired"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const CourseList = () => {
  const { category, subcategory } = useParams<{ category: string; subcategory: string }>();

  // Convert URL slugs back to original category names for filtering
  const categoryName = fromSlug(category || '');
  const subcategoryName = fromSlug(subcategory || '');

  // Filter courses based on category and subcategory
  const filteredCourses = coursesData.filter(
    (course) => 
      course.category === categoryName && 
      course.subcategory === subcategoryName
  );

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
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
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