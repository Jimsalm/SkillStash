import { api } from "@/lib/axios";
import { TrendingUp, BookOpen, Tag, Users } from "lucide-react";

// --- Types ---

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
    rating?: number;
    trend: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// --- API Functions ---

export const fetchDashboardStats = async (): Promise<DashboardStats[]> => {
    // 1. Get main stats
    const statResponse = await api.get<ApiResponse<{totalCourses: number, activeCourses: number, totalClicks: number}>>('/dashboard/stats');
    if (!statResponse.data.success) {
        throw new Error(statResponse.data.message || 'Failed to fetch dashboard stats');
    }
    const stats = statResponse.data.data;

    // 2. Get today's stats
    const todayResponse = await api.get<ApiResponse<{ totalClaims: number}>>('/dashboard/stats/today');
    const todayClaims = todayResponse.data.success ? todayResponse.data.data.totalClaims : 0;

    // 3. Map data to UI format
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
            bgColor: 'bg-green-50',
            iconColor: 'text-green-600 dark:text-green-400'
        },
        {
            title: "Total Claims",
            value: stats.totalClicks.toLocaleString(),
            change: '+12%',
            trend: 'up',
            icon: Users,
            bgColor: 'bg-purple-50',
            iconColor: 'text-purple-600 dark:text-purple-400'
        },
        {
            title: "Claimed Today",
            value: todayClaims.toLocaleString(),
            change: '+12%',
            trend: 'neutral',
            icon: TrendingUp,
            bgColor: 'bg-orange-50',
            iconColor: 'text-orange-600 dark:text-orange-400'
        }
    ];
};

export const fetchRecentActivity = async (): Promise<ActivityItem[]> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/recent-activity?limit=5');
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch recent activity');
    }

    return response.data.data.map((course: any) => {
        const timeDiff = new Date().getTime() - new Date(course.updatedAt).getTime();
        let timeAgo = '';

        if (timeDiff < 60 * 60 * 1000) {
            timeAgo = `${Math.floor(timeDiff / (60 * 1000))} min ago`;
        } else if (timeDiff < 24 * 60 * 60 * 1000) {
            const hours = Math.floor(timeDiff / (60 * 60 * 1000));
            timeAgo = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
            const days = Math.floor(timeDiff / (24 * 60 * 60 * 1000));
            timeAgo = `${days} day${days > 1 ? 's' : ''} ago`;
        }

        let action = 'Course updated';
        let type = 'secondary';

        const createdRecently = new Date().getTime() - new Date(course.createdAt).getTime() < 24 * 60 * 60 * 1000;
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
            type,
        };
    });
};

export const fetchTopCourses = async (): Promise<TopCourse[]> => {
    const response = await api.get<ApiResponse<any[]>>('/dashboard/top-courses?limit=5');
    if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to fetch top courses');
    }

    return response.data.data.map((course: any) => ({
        id: course._id,
        title: course.title,
        claims: course.claimedCount,
        trend: course.claimedCount > 50 ? 'up' : 'down',
    }));
};