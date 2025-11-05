import { useParams } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { Badge } from '@/components/ui/badge';
import { coursesData } from '@/data/courses';

// --- PAGE COMPONENT ---

const CourseList = () => {
  const { group, subcategory } = useParams<{ group: string; subcategory: string }>();

  const filteredCourses = coursesData.filter(
    (course) => course.group === group && course.subcategory === subcategory
  );

  const formatTitle = (str: string) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const pageTitle = formatTitle(subcategory || '');

  return (
    <main className="flex-1 bg-background">
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tighter">{pageTitle} Courses</h1>
          <p className="mt-2 text-muted-foreground">
            Discover the best deals on courses in the {pageTitle} category.
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
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CourseList;