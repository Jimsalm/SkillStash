import { TrendingUp, BookOpen, Tag, Users } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export interface DashboardStats {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  iconColor: string;
}

export interface ActivityItem {
  id: string;
  action: string;
  course: string;
  time: string;
  type: string;
}

export interface TopCourse {
  id: string;
  title: string;
  claims: number;
  rating: number;
  trend: string;
}

export const dashboardService = {
    // Get Dashboard Stats
    getDashboardStats: async (): Promise<DashboardStats[]> => {
        try {
            const response = await fetch(`${API_URL}/dashboard/stats`);
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Failed to fetch dashboard stats");
            }
            const stats = data.data;

            const todayResponse = await fetch(`${API_URL}/dashboard/stats/today`);
            const todayData = await todayResponse.json();
            const todayClaims = todayData.success ? todayData.data.totalClaims : 0;

            return [
                {
                    title: "Total Courses",
                    value: stats.totalCourses.toLocaleString(),
                    change: '+12%',
                    trend: 'up',
                    icon: BookOpen,
                    bgColor: 'bg-blue-50',
                    iconColor: 'text-blue-600 dark:text-blue-400'
                },
                {
                    title: "Active Courses",
                    value: stats.activeCourses.toLocaleString(),
                    change: '+12%',
                    trend: 'up',
                    icon: Tag,
                    bgColor: 'bg-blue-50',
                    iconColor: 'text-blue-600 dark:text-blue-400'
                },
                {
                    title: "Total Claims",
                    value: stats.totalClicks.toLocaleString(),
                    change: '+12%',
                    trend: 'up',
                    icon: Users,
                    bgColor: 'bg-blue-50',
                    iconColor: 'text-blue-600 dark:text-blue-400'
                },
                {
                    title: "Claimed Today",
                    value: todayClaims.toLocaleString(),
                    change: '+12%',
                    trend: 'neutral',
                    icon: TrendingUp,
                    bgColor: 'bg-blue-50',
                    iconColor: 'text-blue-600 dark:text-blue-400'
                }
            ];

        } catch (error) {
            console.error("Error fetching dashboard stats:", error);
            throw error;
        }
    },

    // Get Recent Activity Log
    getRecentActivity: async (): Promise<ActivityItem[]> => {
        try {
            const response = await fetch(`${API_URL}/dashboard/recent-activity?limit=5`);
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Failed to fetch activity log");
            }
            return data.data.map((course: any, index: number) => {
                const timeDiff = new Date().getTime() - new Date(course.updatedAt).getTime();
                let timeAgo = '';
                
                if (timeDiff < 60 * 60 * 1000) {
                    timeAgo = `${Math.floor(timeDiff / (60 * 1000))} min ago`;
                } else if (timeDiff < 24 * 60 * 60 * 1000) {
                    timeAgo = `${Math.floor(timeDiff / (60 * 60 * 1000))} hour${Math.floor(timeDiff / (60 * 60 * 1000)) > 1 ? 's' : ''} ago`;
                } else {
                    timeAgo = `${Math.floor(timeDiff / (24 * 60 * 60 * 1000))} day${Math.floor(timeDiff / (24 * 60 * 60 * 1000)) > 1 ? 's' : ''} ago`;
                }
                
                let action = 'Course updated';
                let type = 'secondary';
                
                const createdRecently = (new Date().getTime() - new Date(course.createdAt).getTime()) < 24 * 60 * 60 * 1000;
                if (createdRecently) {
                    action = 'New course added';
                    type = 'default';
                }
                
                if (!course.isActive && new Date(course.expiresAt) < new Date()) {
                    action = 'Coupon expired';
                    type = 'outline';
                }
                
                return {
                    id: course._id,
                    action,
                    course: course.title,
                    time: timeAgo,
                    type
                };
            });
            } catch (error) {
            console.error("Error fetching recent activity:", error);
            throw error;
            }
        },

    // Get Top Courses
    getTopCourses: async (): Promise<TopCourse[]> => {
        try {
            const response = await fetch(`${API_URL}/dashboard/top-courses?limit=5`);
            const data = await response.json();
            if (!data.success) {
                throw new Error(data.message || "Failed to fetch top courses");
            }
            return data.data.map((course: any) => ({
                id: course._id,
                title: course.title,
                claims: course.claimedCount,
                trend: course.claimedCount > course.claimedCount ? 'up' : 'down',
            }));
        } catch (error) {
            console.error("Error fetching top courses:", error);
            throw error;
        }
    },
}