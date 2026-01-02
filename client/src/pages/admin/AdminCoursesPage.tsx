import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActiveCourses, useCoursesForFilters, useArchiveCourse } from '@/hooks/useCourses';
import type { Course } from '@/api/courseApi';

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
  Edit, ExternalLink, MoreVertical, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Search, Filter, Plus, X, 
  Loader2, AlertCircle, Archive
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AdminCoursesPage = () => {
  const navigate = useNavigate();
  
  // Hooks
  const { data: allCoursesForFilters } = useCoursesForFilters();
  const { data: courses, isLoading, error, refetch } = useActiveCourses(
    {
      category: undefined,
      isActive: undefined, 
      search: undefined, 
    }, 
    undefined 
  );
  const archiveMutation = useArchiveCourse();

  // Local State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [instructorFilter, setInstructorFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  const filteredCourses = useMemo(() => {
    if (!courses) return [];
    return courses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && course.isActive) || 
        (statusFilter === 'inactive' && !course.isActive);
      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesInstructor = instructorFilter === 'all' || course.instructor === instructorFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesInstructor;
    });
  }, [courses, searchQuery, statusFilter, categoryFilter, instructorFilter]);

  // Options
  const categoryOptions = useMemo(() => {
    if (!allCoursesForFilters?.length) return ['all'];
    const categories = [...new Set(allCoursesForFilters.map(c => c.category))];
    return ['all', ...categories.sort()];
  }, [allCoursesForFilters]);

  const instructorOptions = useMemo(() => {
    if (!allCoursesForFilters?.length) return ['all'];
    const instructors = [...new Set(allCoursesForFilters.map(c => c.instructor))];
    return ['all', ...instructors.sort()];
  }, [allCoursesForFilters]);

  // Logic Helpers
  const isCourseActive = (course: Course) => {
    return course.isActive !== undefined ? course.isActive : Boolean(course.couponCode && course.couponCode.trim() !== '');
  };

  const totalPages = Math.ceil((filteredCourses?.length || 0) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCourses = filteredCourses.slice(startIndex, endIndex) || [];

  const handleFilterChange = () => setCurrentPage(1);
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
  const handleEdit = (courseId: string) => navigate(`/admin/courses/edit/${courseId}`);
  const handleArchive = async(courseId: string) => {
    if (!confirm('Are you sure you want to archive this course?')) return;
    archiveMutation.mutate(courseId);
  };
  const handleNavigate = (url: string) => window.open(url, '_blank', 'noopener,noreferrer');
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || categoryFilter !== 'all' || instructorFilter !== 'all';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
      return (
        <div className="flex items-center justify-center h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <p className="font-semibold mb-2">Failed to load dashboard</p>
              <p className="text-sm">{error.message}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => window.location.reload()}>
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
          <h1 className="text-3xl font-bold">All Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all courses • {filteredCourses.length || 0} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <Button asChild><a href="/admin/courses/add"><Plus className="h-4 w-4" /> Add New Course</a></Button>
        </div>
      </div>

      {/* Filters Card */}
      {showFilters && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Filters</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}><X className="h-4 w-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
               {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search courses..." className="pl-8" value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} />
                </div>
              </div>
              {/* Status Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); handleFilterChange(); }}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Category Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={categoryFilter} onValueChange={(value) => { setCategoryFilter(value); handleFilterChange(); }}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              {/* Instructor Select */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Instructor</label>
                <Select value={instructorFilter} onValueChange={(value) => { setInstructorFilter(value); handleFilterChange(); }}>
                  <SelectTrigger><SelectValue placeholder="Select instructor" /></SelectTrigger>
                  <SelectContent>
                    {instructorOptions.map(inst => <SelectItem key={inst} value={inst}>{inst === 'all' ? 'All Instructors' : inst}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasActiveFilters && (
              <div className="mt-4"><Button variant="outline" onClick={handleResetFilters}><X className="h-4 w-4 mr-2" /> Reset Filters</Button></div>
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
              <TableHead>Coupon Code</TableHead>
              <TableHead>Claimed</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedCourses.length > 0 ? (
              paginatedCourses.map((course, index) => (
                <TableRow key={course._id}>
                  <TableCell className="text-muted-foreground">{startIndex + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img src={course.image} alt={course.title} className="h-10 w-10 rounded object-cover" />
                      <div className="max-w-[300px]">
                        <p className="font-medium truncate">{course.title}</p>
                        <p className="text-sm text-muted-foreground truncate">{course.subcategory}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell><Badge variant="outline" className="text-xs">{course.category}</Badge></TableCell>
                  <TableCell>
                    {course.couponCode ? <code className="text-xs bg-secondary px-2 py-1 rounded font-mono">{course.couponCode}</code> : <span className="text-xs text-muted-foreground">No coupon</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{course.claimedCount.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground">claims</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={isCourseActive(course) ? "default" : "secondary"} className={isCourseActive(course) ? "bg-green-500 hover:bg-green-600" : ""}>
                      {isCourseActive(course) ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(course._id)}><Edit className="h-4 w-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleNavigate(course.udemyUrl)}><ExternalLink className="h-4 w-4 mr-2" /> Navigate</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleArchive(course._id)} className="text-destructive focus:text-destructive" disabled={archiveMutation.isPending}>
                          <Archive className="h-4 w-4 mr-2" /> Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-muted-foreground">No courses found</p>
                    {hasActiveFilters && <Button variant="link" size="sm" onClick={handleResetFilters}>Clear filters</Button>}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between px-2 py-4">
        <div className="flex items-center space-x-2">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </p>
          <p className="text-sm text-muted-foreground">•</p>
          <p className="text-sm text-muted-foreground">
            {filteredCourses.length} total items
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
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
              <SelectContent>
                {[5, 10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className="h-8 w-8 p-0"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage >= totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCoursesPage;