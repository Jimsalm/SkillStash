import { api } from "./axios";

export interface Course {
  _id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  software: string[];
  claimedCount: number;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  subcategory: string;
  udemyUrl: string;
  couponCode: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  isArchived: boolean;
  archivedAt?: string;
}

interface ApiResponse<T>{
    success: boolean;
    data: T;
    message?: string;
    count?: number;
}

//Fetch all courses
export const fetchCourses = async (params?: {
    category?: string;
    subcategory?: string;
    isActive?: boolean;
    search?: string;
}): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses', { params });
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch courses');
    }
    return response.data.data.filter((c) => !c.isArchived);
}

//Fetch active courses
export const fetchActiveCourses = async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses/active');
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch active courses');
    }
    return response.data.data.filter((c) => !c.isArchived);
}

//Fetch single course by id
export const fetchCourseById = async (id: string): Promise<Course> => {
    const response = await api.get<ApiResponse<Course>>(`/courses/${id}`);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch course');
    }
    return response.data.data;
}

//Create course
export const createCourse = async (courseData: Omit<Course, '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> => {
    const response = await api.post<ApiResponse<Course>>('/courses', courseData);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to create course');
    }
    return response.data.data;
}

//Update course
export const updateCourse = async (id: string, courseData: Partial<Course>): Promise<Course> => {
    const response = await api.put<ApiResponse<Course>>(`/courses/${id}`, courseData);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update course');
    }
    return response.data.data;
}

//Delete course
export const deleteCourse = async (id: string): Promise<void> => {
    const response = await api.delete<ApiResponse<Course>>(`/courses/${id}`);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to delete course');
    }
}

// Mutation functions (PATCH requests)

// Toggle course active/inactive
export const toggleCourseActive = async (id: string): Promise<Course> => {
    const response = await api.patch<ApiResponse<Course>>(`/courses/${id}/active`);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to toggle course active/inactive');
    }
    return response.data.data;
}

// Archive course
export const archiveCourse = async (id: string): Promise<Course> => {
    const response = await api.patch<ApiResponse<Course>>(`/courses/${id}/archive`);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to archive course');
    }
    return response.data.data;
}

// Increment claimed count
export const incrementClaimedCount = async (id: string): Promise<Course> => {
    const response = await api.patch<ApiResponse<Course>>(`/courses/${id}/increment-claim`);
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to increment claimed count');
    }
    return response.data.data;
}

// Fetch all archived courses
export const fetchArchivedCourses = async (): Promise<Course[]> => {
    const response = await api.get<ApiResponse<Course[]>>('/courses/archived');
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch archived courses');
    }
    return response.data.data;
}

