import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Users } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <CardHeader className="p-0">
        <img
          src={course.image}
          alt={course.title}
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
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
        <Button size="sm">
          <ExternalLink className="mr-2 h-4 w-4" />
          Get Deal
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;