import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  fetchCourses,
  fetchArchivedCourses,
  fetchCourseById,
  createCourse,
  updateCourse,
  archiveCourse,
  deleteCourse,
  type Course,
  type CourseFilters,
} from '@/api/courseApi';
import type { CourseFormValues } from '@/lib/schemas/courseFormSchema';

// --- Queries ---

// 1. Fetch Active Courses List
export const useCourses = (params?: CourseFilters, instructorFilter?: string) => {
  return useQuery<Course[], Error>({
    queryKey: ['courses', 'active', params, instructorFilter],
    queryFn: () => fetchCourses(params),
    select: (data) => {
      if (instructorFilter && instructorFilter !== 'all') {
        return data.filter((c) => c.instructor === instructorFilter);
      }
      return data;
    },
  });
};

// 2. Fetch All Active Courses (For Filter Dropdowns)
export const useCoursesForFilters = () => {
  return useQuery<Course[], Error>({
    queryKey: ['courses', 'filters'],
    queryFn: () => fetchCourses(), 
  });
};

// 3. Fetch Archived Courses List
export const useArchivedCourses = (filters?: {
  search?: string;
  statusFilter?: string;
  categoryFilter?: string;
  instructorFilter?: string;
}) => {
  return useQuery<Course[], Error>({
    queryKey: ['courses', 'archived', filters],
    queryFn: fetchArchivedCourses,
    select: (data) => {
      return data.filter((course) => {
        const matchesSearch =
          !filters?.search ||
          course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          course.instructor.toLowerCase().includes(filters.search.toLowerCase());

        const matchesStatus =
          filters?.statusFilter === 'all' ||
          (filters?.statusFilter === 'active' && course.isActive) ||
          (filters?.statusFilter === 'inactive' && !course.isActive);

        const matchesCategory =
          filters?.categoryFilter === 'all' || course.category === filters?.categoryFilter;

        const matchesInstructor =
          filters?.instructorFilter === 'all' || course.instructor === filters?.instructorFilter;

        return matchesSearch && matchesStatus && matchesCategory && matchesInstructor;
      });
    },
  });
};

// 4. Fetch All Archived Courses (For Filter Dropdowns)
export const useArchivedCoursesForFilters = () => {
  return useQuery<Course[], Error>({
    queryKey: ['courses', 'archived', 'filters'],
    queryFn: fetchArchivedCourses,
  });
};

// 5. Fetch Single Course
export const useCourse = (id?: string) => {
  return useQuery<Course, Error>({
    queryKey: ['course', id],
    queryFn: () => fetchCourseById(id!),
    enabled: !!id,
  });
};

// --- Mutations ---

// Create or Update
export const useUpsertCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, { isEdit: boolean; id?: string; values: CourseFormValues }>({
    mutationFn: async ({ isEdit, id, values }) => {
      const softwareArray = values.software.split(',').map((s) => s.trim()).filter(Boolean);
      const payload = {
        title: values.title,
        description: values.description,
        image: values.image,
        instructor: values.instructor,
        software: softwareArray,
        claimedCount: values.claimedCount,
        originalPrice: values.originalPrice,
        discountedPrice: values.discountedPrice,
        category: values.category,
        subcategory: values.subcategory,
        udemyUrl: values.udemyUrl,
        couponCode: values.couponCode || '',
        expiresAt: values.expiresAt || undefined,
        isActive: values.isActive,
        isArchived: false,
        archivedAt: undefined,
      };

      if (isEdit && id) {
        return updateCourse(id, payload);
      } else {
        return createCourse(payload);
      }
    },
    onSuccess: () => {
      toast.success('Course saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
    onError: (error) => {
      toast.error('Failed to save course: ' + error.message);
    },
  });
};

// Archive / Unarchive
export const useArchiveCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, string>({
    mutationFn: archiveCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Course status updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update course status');
      console.error('Failed to archive/unarchive course:', error);
    },
  });
};

// Delete
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', 'archived'] });
      toast.success('Course deleted permanently');
    },
    onError: (error) => {
      toast.error('Failed to delete course');
      console.error('Failed to delete course:', error);
    },
  });
};