import { useState, useMemo, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Code, Palette, Server, MoreHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { useActiveCourses } from '@/hooks/useCourses';
import { categoriesData } from '@/lib/schemas/courseFormSchema';
import type { Course } from '@/api/courseApi';

interface SubcategoryWithCount {
  name: string;
  count: number;
}

interface CategoryWithCount {
  name: string; 
  subcategories: SubcategoryWithCount[];
}

export type CategoryKey = 'Development' | 'Graphic Design' | 'Network & System' | 'Others';

const categoryIcons: Record<string, JSX.Element> = {
  'Development': <Code className="h-8 w-8 text-blue-600" />,
  'Graphic Design': <Palette className="h-8 w-8 text-pink-600" />,
  'Network & System': <Server className="h-8 w-8 text-green-600" />,
  'Others': <MoreHorizontal className="h-8 w-8 text-purple-600" />
};

const categoryDescriptions: Record<CategoryKey, string> = {
  'Development': 'Build websites, apps, and software.',
  'Graphic Design': 'Create stunning visuals and designs.',
  'Network & System': 'Manage and secure IT infrastructure.',
  'Others': 'Explore a variety of other fields.'
};

const CourseCategory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Fetch all active courses once
  const { data: courses, isLoading, error } = useActiveCourses();

  // Calculate categories with counts
  const filteredCategories = useMemo(() => {
    if (!courses) return [];

    // Map categories and count courses
    const categoriesWithCounts = categoriesData.map(category => ({
      ...category,
      subcategories: category.subcategories.map(subName => {
        const count = courses.filter(
          (course: Course) => course.category === category.name && course.subcategory === subName
        ).length;
        return { name: subName, count };
      })
    }));

    // Filter by search term
    if (!searchTerm) return categoriesWithCounts;

    return categoriesWithCounts.map(category => ({
      ...category,
      subcategories: category.subcategories.filter(sub => 
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })).filter(category => category.subcategories.length > 0);
  }, [courses, searchTerm]);

  const toSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')
      .replace(/&/g, 'and');
  };

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
      {/* Header Section */}
      <section className="bg-gradient-to-r from-primary/10 via-primary/5 to-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Course Categories
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect course from our wide range of categories.
          </p>
          <div className="mt-8 relative mx-auto max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for a category..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {filteredCategories.map((category, index) => (
              <Card key={index} className="transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    {categoryIcons[category.name] || <MoreHorizontal className="h-8 w-8 text-gray-600" />}
                    <div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <CardDescription>{categoryDescriptions[category.name as CategoryKey] || 'Explore courses in this category.'}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {category.subcategories.map((sub) => (
                      <Link
                        key={sub.name}
                        to={`/courses/${toSlug(category.name)}/${toSlug(sub.name)}`}
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