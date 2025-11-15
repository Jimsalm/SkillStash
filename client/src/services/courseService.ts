const API_URL = 'http://localhost:5001/api';

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
    expiresAt: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export const courseService = {
    
    // Fetch all courses
    getAllCourses: async (): Promise<Course[]> => {
        try {
            const response = await fetch(`${API_URL}/courses`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    // Fetch a course by ID
    getCourseById: async (id: string): Promise<Course> => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`);
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch course');
            }

            return data.data;
        } catch (error) {
            console.error('Error fetching course:', error);
            throw error;
        }
    },

    // Create a new course
    createCourse: async (courseData: Partial<Course>): Promise<Course> => {
        try {
            const response = await fetch(`${API_URL}/courses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to create course');
            }

            return data.data;
        } catch (error) {
            console.error('Error creating course:', error);
            throw error;
        }
    },

    // Update an existing course
    updateCourse: async (id: string, courseData: Partial<Course>): Promise<Course> => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(courseData),
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to update course');
            }

            return data.data;
        } catch (error) {
            console.error('Error updating course:', error);
            throw error;
        }
    },

    // Delete a course
    deleteCourse: async (id: string): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to delete course');
            }
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    },

    // Increment Claimed Count
    incrementClaimedCount: async (id: string): Promise<Course> => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}/increment-claim`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to increment claimed count');
            }
            return data.data;
        } catch (error) {
            console.error('Error incrementing claimed count:', error);
            throw error;
        }
    },

    //Toggle Active Status
    toggleCourseActiveStatus: async (id: string): Promise<Course> => {
        try {
            const response = await fetch(`${API_URL}/courses/${id}/toggle-active`, {
                method: 'PATCH',
            });

            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || 'Failed to toggle course active status');
            }
            return data.data;
        } catch (error) {
            console.error('Error toggling course active status:', error);
            throw error;
        }
    },
};