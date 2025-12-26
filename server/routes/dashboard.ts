import express, { Request, Response } from 'express';
import Course from '../models/Course';
import User from '../models/User';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();


//GET /api/dashboard/stats - Get course statistics
router.get('/stats', authMiddleware, async (req: Request, res: Response) => {
    try {
        const totalCourses = await Course.countDocuments();
        
        const activeCourses = await Course.countDocuments({ isActive: true, isArchived: false });
        
        const archivedCourses = await Course.countDocuments({ isArchived: true });

        const totalClicks = await Course.aggregate([
            { $group: { _id: null, total: { $sum: "$claimedCount" } } }
        ]);
        
        const coursebyCategory = await Course.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        const totalUsers = await User.countDocuments();

        res.json({
            success: true,
            data: {
                totalCourses,
                activeCourses,
                archivedCourses,
                totalClicks: totalClicks[0]?.total || 0,
                coursebyCategory,
                totalUsers
            },
            message: 'Course statistics fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching course statistics:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
});

//GET /api/dashboard/stats/today - Get today stats
router.get('/stats/today', authMiddleware, async (req: Request, res: Response) =>{
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayClaims = await Course.aggregate([
            { $match: { updatedAt: { $gte: today, $lt: tomorrow } } },
            { $group: { _id: null, total: { $sum: "$claimedCount" } } }
        ]);

        res.json({
            success: true,
            data: {
                totalClaims: todayClaims[0]?.total || 0
            },
            message: 'Today stats fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching today stats:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
})

//GET /api/dashboard/top-courses - Get top courses claim
router.get('/top-courses', authMiddleware, async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 5;
        const topCourses = await Course.find({isActive: true}).sort({claimedCount: -1}).limit(limit).select('title claimedCount');
        res.json({
            success: true,
            data: topCourses,
            message: 'Top courses fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching top courses:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
})

//GET /api/dashboard/recent-activity - Get recent activity
router.get('/recent-activity', authMiddleware, async (req: Request, res: Response) => {
    try {
        const limit = parseInt(req.query.limit as string) || 5;
        const recentCourses = await Course.find({isActive: true}).sort({createdAt: -1}).limit(limit).select('title createdAt expiresAt updatedAt');
        res.json({
            success: true,
            data: recentCourses,
            message: 'Recent courses fetched successfully'
        });
    } catch (error) {
        console.error('Error fetching recent courses:', error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
})

export default router;