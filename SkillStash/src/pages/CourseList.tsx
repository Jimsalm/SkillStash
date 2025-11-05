import { useParams } from 'react-router-dom';
import CourseCard from '@/components/CourseCard';
import { Badge } from '@/components/ui/badge';

// --- DATA IS NOW HERE ---

// Define the structure for our courses
interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  software: string[];
  claimedCount: number;
  originalPrice: number;
  discountedPrice: number;
  group: string;
  subcategory: string;
}

const coursesData: Course[] = [
  // Development -> Web Development
  {
    id: 'react-complete-guide',
    title: 'React - The Complete Guide (incl. Hooks, Redux, Next.js)',
    description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more!',
    image: 'https://img-c.udemycdn.com/course/480x270/3954280_8a91_3.jpg',
    instructor: 'Maximilian Schwarzmüller',
    software: ['React', 'Redux', 'Next.js'],
    claimedCount: 15234,
    originalPrice: 89.99,
    discountedPrice: 14.99,
    group: 'development',
    subcategory: 'web-development',
  },
  {
    id: 'python-bootcamp',
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    description: 'Master Python by building 100 projects in 100 days. Learn to build websites, games, apps, plus scraping and data science.',
    image: 'https://img-c.udemycdn.com/course/480x270/2852688_3e64_5.jpg',
    instructor: 'Dr. Angela Yu',
    software: ['Python', 'Django', 'Flask'],
    claimedCount: 22150,
    originalPrice: 89.99,
    discountedPrice: 18.99,
    group: 'development',
    subcategory: 'web-development',
  },
  // Development -> Data Science
  {
    id: 'data-science-bootcamp',
    title: 'Complete Data Science Bootcamp 2024',
    description: 'Learn Data Science, Deep Learning, & Machine Learning with Python, R, & Tensorflow. Build real-world projects!',
    image: 'https://img-c.udemycdn.com/course/480x270/1082012_8367_4.jpg',
    instructor: '365 Careers',
    software: ['Python', 'TensorFlow', 'R'],
    claimedCount: 18500,
    originalPrice: 199.99,
    discountedPrice: 19.99,
    group: 'development',
    subcategory: 'data-science',
  },
  // Graphic Design -> UI Design
  {
    id: 'ui-ux-design-bootcamp',
    title: 'UI/UX Design Bootcamp: From Zero to a Job-Ready Portfolio',
    description: 'Become a UI/UX Designer. Learn Figma, user research, design thinking, and build a stunning portfolio.',
    image: 'https://img-c.udemycdn.com/course/480x270/2987110_0f51_4.jpg',
    instructor: 'Daniel Scott',
    software: ['Figma', 'Adobe XD'],
    claimedCount: 9870,
    originalPrice: 84.99,
    discountedPrice: 16.99,
    group: 'graphic-design',
    subcategory: 'user-interface-ui-design',
  },
  // Network & System -> Cloud Computing
  {
    id: 'aws-certified-solutions-architect',
    title: 'Ultimate AWS Certified Solutions Architect Associate 2024',
    description: 'Pass the AWS Certified Solutions Architect Associate SAA-C03 Exam. Includes hands-on labs, practice exams, and a final exam.',
    image: 'https://img-c.udemycdn.com/course/480x270/3873100_6f2d_3.jpg',
    instructor: 'Stephane Maarek',
    software: ['AWS', 'Terraform'],
    claimedCount: 31000,
    originalPrice: 94.99,
    discountedPrice: 19.99,
    group: 'network-&-system',
    subcategory: 'cloud-computing',
  },
  // Others -> Business
  {
    id: 'mba-in-one',
    title: 'An Entire MBA in 1 Course: Award Winning Business School Prof',
    description: 'Everything you need to know about business, from starting a company to taking it public. Learn business strategy.',
    image: 'https://img-c.udemycdn.com/course/480x270/4983000_5f0c_3.jpg',
    instructor: 'Chris Haroun',
    software: ['Business Strategy'],
    claimedCount: 45000,
    originalPrice: 199.99,
    discountedPrice: 24.99,
    group: 'others',
    subcategory: 'business',
  },
];

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