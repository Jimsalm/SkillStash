import { Link } from 'react-router-dom'; // <-- Import Link
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Course } from '@/data/courses'; // <-- Import from central file
import { ExternalLink, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    // Wrap the entire card in a Link component
    <Link to={`/course/${course.id}`} className="block">
      <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl h-full flex flex-col">
        <CardHeader className="p-0">
          <img
            src={course.image}
            alt={course.title}
            className="h-48 w-full object-cover"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-lg line-clamp-2" title={course.title}>
            {course.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">by {course.instructor}</p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {course.software.map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{course.claimedCount.toLocaleString()} claimed</span>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-primary">${course.discountedPrice}</span>
            <span className="ml-2 text-sm text-muted-foreground line-through">
              ${course.originalPrice}
            </span>
          </div>
          {/* This button now links to Udemy */}
          <Button 
            size="sm" 
            asChild 
            onClick={(e) => e.stopPropagation()} // Prevents the Link's navigation
          >
            <a href={course.udemyUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Get Deal
            </a>
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;