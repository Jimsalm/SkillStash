import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentActivity, fetchTopCourses, fetchPublicStats } from '@/api/dashboardApi';
import type { DashboardStats, ActivityItem, TopCourse, PublicStats } from '@/api/dashboardApi';
import { useAuth } from '@/components/admin/AuthContext';

// Hook for Stats
export const useDashboardStats = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<DashboardStats[], Error>({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, 
    refetchInterval: 1000 * 60, 
  });
};

// Hook for Recent Activity
export const useRecentActivity = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<ActivityItem[], Error>({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: fetchRecentActivity,
    enabled: isAuthenticated,
    staleTime: 1000 * 30, 
    refetchInterval: 1000 * 30,
  });
};

// Hook for Top Courses
export const useTopCourses = () => {
  const { isAuthenticated } = useAuth();
  return useQuery<TopCourse[], Error>({
    queryKey: ['dashboard', 'top-courses'],
    queryFn: fetchTopCourses,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10, 
    refetchInterval: 1000 * 60 * 2,
  });
};

export const usePublicStats = () => {
  return useQuery<PublicStats, Error>({
    queryKey: ['public', 'stats'],
    queryFn: fetchPublicStats,
    staleTime: 1000 * 60 * 10, 
    refetchInterval: 1000 * 60 * 2,
  });
}