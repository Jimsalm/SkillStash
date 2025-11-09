import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Code, Palette, Server, MoreHorizontal } from 'lucide-react';
import { coursesData } from '@/data/courses';

const toSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[()]/g, '')
    .replace(/&/g, 'and');
};

// Calculate course counts dynamically from coursesData
const getCourseCount = (category: string, subcategory: string): number => {
  return coursesData.filter(
    (course) => course.category === category && course.subcategory === subcategory
  ).length;
};

// Define the structure for our categories
const categoriesData = [
  {
    groupTitle: 'Development',
    icon: <Code className="h-8 w-8 text-blue-600" />,
    description: 'Build websites, apps, and software.',
    subcategories: [
      { name: 'Web Development', count: getCourseCount('Development', 'Web Development') },
      { name: 'Data Science', count: getCourseCount('Development', 'Data Science') },
      { name: 'Mobile Development', count: getCourseCount('Development', 'Mobile Development') },
      { name: 'Game Development', count: getCourseCount('Development', 'Game Development') },
      { name: 'Programming Languages', count: getCourseCount('Development', 'Programming Languages') },
      { name: 'Software Testing', count: getCourseCount('Development', 'Software Testing') },
    ],
  },
  {
    groupTitle: 'Graphic Design',
    icon: <Palette className="h-8 w-8 text-pink-600" />,
    description: 'Create stunning visuals and designs.',
    subcategories: [
      { name: 'Graphic Design Tools', count: getCourseCount('Graphic Design', 'Graphic Design Tools') },
      { name: 'User Experience (UX) Design', count: getCourseCount('Graphic Design', 'User Experience (UX) Design') },
      { name: 'User Interface (UI) Design', count: getCourseCount('Graphic Design', 'User Interface (UI) Design') },
      { name: '3D & Animation', count: getCourseCount('Graphic Design', '3D & Animation') },
      { name: 'Fashion Design', count: getCourseCount('Graphic Design', 'Fashion Design') },
    ],
  },
  {
    groupTitle: 'Network & System',
    icon: <Server className="h-8 w-8 text-green-600" />,
    description: 'Manage and secure IT infrastructure.',
    subcategories: [
      { name: 'Network Administration', count: getCourseCount('Network & System', 'Network Administration') },
      { name: 'Cloud Computing', count: getCourseCount('Network & System', 'Cloud Computing') },
      { name: 'Cybersecurity', count: getCourseCount('Network & System', 'Cybersecurity') },
      { name: 'Operating Systems', count: getCourseCount('Network & System', 'Operating Systems') },
      { name: 'IT Certification', count: getCourseCount('Network & System', 'IT Certification') },
    ],
  },
  {
    groupTitle: 'Others',
    icon: <MoreHorizontal className="h-8 w-8 text-purple-600" />,
    description: 'Explore a variety of other fields.',
    subcategories: [
      { name: 'Business', count: getCourseCount('Others', 'Business') },
      { name: 'Finance & Accounting', count: getCourseCount('Others', 'Finance & Accounting') },
      { name: 'Marketing', count: getCourseCount('Others', 'Marketing') },
      { name: 'Photography & Video', count: getCourseCount('Others', 'Photography & Video') },
      { name: 'Health & Fitness', count: getCourseCount('Others', 'Health & Fitness') },
      { name: 'Music', count: getCourseCount('Others', 'Music') },
    ],
  },
];

const CourseCategory = () => {
  return (
    <main className="flex-1 bg-background">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Course Categories
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect course from our wide range of categories.
          </p>
          {/* Search Bar */}
          <div className="mt-8 relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for a category..."
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {categoriesData.map((category, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {category.icon}
                    <div>
                      <CardTitle className="text-xl">{category.groupTitle}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={`/courses/${toSlug(category.groupTitle)}/${toSlug(sub.name)}`}
                        className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
                      >
                        <span className="text-sm font-medium">{sub.name}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                          {sub.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CourseCategory;