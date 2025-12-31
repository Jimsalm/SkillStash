import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    fetchReports, 
    createReport, 
    updateReportStatus,
    deleteReport,
    type ReportFilters,
    type CourseReport,
    type CreateReportData,
} from "../api/reportApi";
import { useAuth } from "@/components/admin/AuthContext";
import { toast } from "sonner";

// Get all reports
export const useReports = (filters?: ReportFilters) => {
    const { isAuthenticated } = useAuth();
    return useQuery<CourseReport[]>({
        queryKey: ['reports', filters],
        queryFn: () => fetchReports(filters),
        enabled: isAuthenticated,
    })
};

// Create a report
export const useCreateReport = () => {
    const queryClient = useQueryClient();

    return useMutation<CourseReport, Error, CreateReportData>({
        mutationFn: createReport,
        onSuccess: () => {
            toast.success("Report created successfully");
            queryClient.invalidateQueries({ queryKey: ['reports'] });
        },
        onError: (error) => {
            if (error.message.includes("Course already reported")) {
                toast.error("Course already reported");
            } else {
                toast.error("Course already reported");
            }
        },
    })
};

// Update a report
export const useUpdateReportStatus = () => {
    const queryClient = useQueryClient();

    return useMutation<CourseReport, Error,
    { id: string; status: 'pending' | 'reviewed' | 'resolved' }>({
        mutationFn: ({ id, status }) => updateReportStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            toast.success("Report status updated successfully");
        },
        onError: () => {
            toast.error("Failed to update report status");
        },
    })
};

// Delete a report
export const useDeleteReport = () => {
    const queryClient = useQueryClient();

    return useMutation<void, Error, string>({
        mutationFn: deleteReport,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            toast.success('Report delete successfully')
        },
        onError: (error) => {
            toast.error('Failed to delete report');
            console.error('Failed to delete report', error);
        }
    })
}