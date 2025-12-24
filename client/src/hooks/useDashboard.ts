import { useQuery } from '@tanstack/react-query';
import { fetchDashboardStats, fetchRecentActivity, fetchTopCourses } from '@/api/dashboardApi';
import type { DashboardStats, ActivityItem, TopCourse } from '@/api/dashboardApi';

// Hook for Stats
export const useDashboardStats = () => {
  return useQuery<DashboardStats[], Error>({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 1000 * 60 * 5, 
    refetchInterval: 1000 * 60, 
  });
};

// Hook for Recent Activity
export const useRecentActivity = () => {
  return useQuery<ActivityItem[], Error>({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: fetchRecentActivity,
    staleTime: 1000 * 30, 
    refetchInterval: 1000 * 30,
  });
};

// Hook for Top Courses
export const useTopCourses = () => {
  return useQuery<TopCourse[], Error>({
    queryKey: ['dashboard', 'top-courses'],
    queryFn: fetchTopCourses,
    staleTime: 1000 * 60 * 10, 
    refetchInterval: 1000 * 60 * 2,
  });
};