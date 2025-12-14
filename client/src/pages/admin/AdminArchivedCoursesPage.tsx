import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchArchivedCourses, archiveCourse, deleteCourse, type Course } from '@/api/courseApi';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Edit, 
  Trash2, 
  ExternalLink, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Plus,
  X,
  Loader2,
  AlertCircle,
  Archive,
  ArchiveRestore,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const AdminArchivedCoursesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  //get all archived courses for filters
  const { data: allArchivedCoursesForFilters } = useQuery<Course[], Error>({
    queryKey: ['courses', 'archived', 'for-filters'],
    queryFn: () => fetchArchivedCourses(),
  });

  //get archived courses
  const { data: courses, isLoading, error, refetch } = useQuery<Course[], Error>({
    queryKey: ['courses', 'archived', { searchQuery, statusFilter, categoryFilter, instructorFilter }],
    queryFn: () => fetchArchivedCourses(),
    select: (data) => {
      return data.filter((course) => {
        const matchesSearch = 
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.couponCode?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesStatus = 
          statusFilter === 'all' ||
          (statusFilter === 'active' && course.isActive) ||
          (statusFilter === 'inactive' && !course.isActive);

        const matchesCategory = 
          categoryFilter === 'all' || course.category === categoryFilter;

        const matchesInstructor = 
          instructorFilter === 'all' || course.instructor === instructorFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesInstructor;
      });
    }
  });

  //unarchive course mutation
  const unarchiveCourse = useMutation<Course, Error, string>({
    mutationFn: archiveCourse,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course unarchived successfully');
    },
    onError: (error) => {
      console.error('Failed to unarchive course:', error);
      toast.error('Failed to unarchive course');
    }
  });

  //delete course mutation
  const deleteMutation = useMutation<void, Error, string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ['courses', 'archived'] });
      toast.success('Course deleted permanently');
    },
    onError: (error) => {
      console.error('Failed to delete course:', error);
      toast.error('Failed to delete course');
    }
  });

  //filter options
  const categoryOptions = useMemo(() => {
    if (!allArchivedCoursesForFilters || allArchivedCoursesForFilters.length === 0) return ['all'];
    const categories = [...new Set(allArchivedCoursesForFilters.map(c => c.category))];
    return ['all', ...categories.sort()];
  }, [allArchivedCoursesForFilters]);

  const instructorOptions = useMemo(() => {
    if (!allArchivedCoursesForFilters || allArchivedCoursesForFilters.length === 0) return ['all'];
    const instructors = [...new Set(allArchivedCoursesForFilters.map(c => c.instructor))];
    return ['all', ...instructors.sort()];
  }, [allArchivedCoursesForFilters]);

  //pagination
  const totalPages = Math.ceil((courses?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = courses?.slice(startIndex, endIndex) || [];

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setInstructorFilter('all');
    setCurrentPage(1);
  };

  const handleUnarchive = async (courseId: string) => {
    if (!confirm('Are you sure you want to unarchive this course?')) {
      return;
    }

    unarchiveCourse.mutate(courseId);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course permanently?')) {
      return;
    }

    deleteMutation.mutate(courseId);
  };

  const handleNavigate = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || instructorFilter !== 'all';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading archived courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <p className="font-semibold mb-2">Failed to load archived courses</p>
            <p className="text-sm">{error.message}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-12">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Archived Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage archived courses • {courses?.length || 0} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button asChild>
            <a href="/admin/courses">
              View Active Courses
            </a>
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search archived courses..." 
                    className="pl-8" 
                    value={searchQuery} 
                    onChange={(e) => handleSearchChange(e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); handleFilterChange(); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); handleFilterChange(); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Instructor</label>
                <Select value={instructorFilter} onValueChange={(value) => { setInstructorFilter(value); handleFilterChange(); }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select instructor" />
                  </SelectTrigger>
                  <SelectContent>
                    {instructorOptions.map(instructor => (
                      <SelectItem key={instructor} value={instructor}>
                        {instructor === 'all' ? 'All Instructors' : instructor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {hasActiveFilters && (
              <div className="mt-4">
                <Button variant="outline" onClick={handleResetFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Reset Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Instructor</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Archived Date</TableHead>
              <TableHead>Claimed</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCourses.length > 0 ? (
              paginatedCourses.map((course, index) => (
                <TableRow key={course._id}>
                  <TableCell className="text-muted-foreground">
                    {startIndex + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img 
                        src={course.image} 
                        alt={course.title} 
                        className="h-10 w-10 rounded object-cover" 
                      />
                      <div className="max-w-[300px]">
                        <p className="font-medium truncate">{course.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {course.subcategory}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {course.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {course.archivedAt ? new Date(course.archivedAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{course.claimedCount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">claims</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleUnarchive(course._id)}>
                          <ArchiveRestore className="h-4 w-4 mr-2" />
                          Unarchive
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNavigate(course.udemyUrl)}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Navigate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(course._id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Archive className="h-10 w-10 text-muted-foreground" />
                    <p className="text-muted-foreground">No archived courses found</p>
                    {hasActiveFilters && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={handleResetFilters}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {courses && courses?.length > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
            <span className="font-medium">{Math.min(endIndex, courses.length)}</span> of{' '}
            <span className="font-medium">{courses.length}</span> courses
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${pageSize}`}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[5, 10, 20, 30, 40, 50].map((size) => (
                    <SelectItem key={size} value={`${size}`}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">Go to first page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Go to previous page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Go to next page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Go to last page</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArchivedCoursesPage;