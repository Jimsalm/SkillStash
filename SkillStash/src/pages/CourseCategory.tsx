import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Code, Palette, Server, MoreHorizontal } from 'lucide-react';

// Define the structure for our categories
const categoriesData = [
  {
    groupTitle: 'Development',
    icon: <Code className="h-8 w-8 text-blue-600" />,
    description: 'Build websites, apps, and software.',
    subcategories: [
      { name: 'Web Development', count: 150 },
      { name: 'Data Science', count: 85 },
      { name: 'Mobile Development', count: 92 },
      { name: 'Game Development', count: 45 },
      { name: 'Programming Languages', count: 210 },
      { name: 'Software Testing', count: 30 },
    ],
  },
  {
    groupTitle: 'Graphic Design',
    icon: <Palette className="h-8 w-8 text-pink-600" />,
    description: 'Create stunning visuals and designs.',
    subcategories: [
      { name: 'Graphic Design Tools', count: 75 },
      { name: 'User Experience (UX) Design', count: 60 },
      { name: 'User Interface (UI) Design', count: 55 },
      { name: '3D & Animation', count: 40 },
      { name: 'Fashion Design', count: 25 },
    ],
  },
  {
    groupTitle: 'Network & System',
    icon: <Server className="h-8 w-8 text-green-600" />,
    description: 'Manage and secure IT infrastructure.',
    subcategories: [
      { name: 'Network Administration', count: 50 },
      { name: 'Cloud Computing', count: 110 },
      { name: 'Cybersecurity', count: 95 },
      { name: 'Operating Systems', count: 35 },
      { name: 'IT Certification', count: 80 },
    ],
  },
  {
    groupTitle: 'Others',
    icon: <MoreHorizontal className="h-8 w-8 text-purple-600" />,
    description: 'Explore a variety of other fields.',
    subcategories: [
      { name: 'Business', count: 180 },
      { name: 'Finance & Accounting', count: 120 },
      { name: 'Marketing', count: 95 },
      { name: 'Photography & Video', count: 70 },
      { name: 'Health & Fitness', count: 60 },
      { name: 'Music', count: 45 },
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
                        to={`/courses/${category.groupTitle.toLowerCase().replace(' & ', '-').replace(' ', '-')}/${sub.name.toLowerCase().replace(' ', '-')}`}
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