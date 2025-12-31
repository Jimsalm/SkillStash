import { api } from "@/lib/axios";

export interface CourseReport {
    _id: string;
    courseId: string;
    courseTitle: string;
    reason: 'invalid_link' | 'expired' | 'fake_course' | 'other';
    reportedBy?: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: Date;
}

export interface CreateReportData {
    courseId: string;
    courseTitle: string;
    reason: 'invalid_link' | 'expired' | 'fake_course' | 'other';
    reportedBy?: string;
}

export interface ReportFilters {
    status?: 'pending' | 'reviewed' | 'resolved';
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
    count?: number;
}

// Create a report
export const createReport = async (reportData: CreateReportData): Promise<CourseReport> => {
    const response = await api.post<ApiResponse<CourseReport>>('/reports', reportData);
    if (!response.data.success || !response.data.data) {
        throw new Error('Failed to create report');
    }
    return response.data.data;
};

// Get all reports
export const fetchReports = async (params?: ReportFilters): Promise<CourseReport[]> => {
    const response = await api.get<ApiResponse<CourseReport[]>>('/reports', { params });
    if (!response.data.success || !response.data.data) {
        throw new Error('Failed to fetch reports');
    }
    return response.data.data;
};

// Update a report
export const updateReportStatus = async (id: string, status: 'pending' | 'reviewed' | 'resolved'  
): Promise<CourseReport> => {
    const response = await api.patch<ApiResponse<CourseReport>>(`/reports/${id}/status`, { status });
    if (!response.data.success || !response.data.data) {
        throw new Error('Failed to update report status');
    }
    return response.data.data;
};


// Deletes a report.
export const deleteReport = async (id: string): Promise<void> => {
  const response = await api.delete<ApiResponse<CourseReport>>(`/reports/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete report');
  }
};



