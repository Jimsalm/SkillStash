import express, { Request, Response} from 'express'
import Course from '../models/Course'
import { count } from 'console';

const router = express.Router()

// GET /api/courses - Retrieve all courses
router.get('/', async (req: Request, res: Response) => {
    try {
        const { category, subcategory, isActive, search } = req.query;
        const query: any = {};

        if (category) { query.category = category; }
        if (subcategory) { query.subcategory = subcategory; }
        if (isActive !== undefined) { query.isActive = isActive === 'true'; }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }
        const courses = await Course.find(query).sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            data: courses,
            count: courses.length
         });
    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false});
    }
});

//GET /api/courses/active - Get active courses
router.get('/active', async (req: Request, res: Response) => {
    try {
        const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
        
        res.status(200).json({ 
            success: true, 
            data: courses,
            count: courses.length
        });
    } catch (error) {
        console.error('Detailed error fetching active courses:', error); 
        
        res.status(500).json({ 
            message: 'Internal server error',
            success: false 
        });
    }
});

// GET /api/courses/:id - Retrieve a single course by ID
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ 
                message: 'Course not found',
                success: false });
        }
        res.json({ 
            success: true, 
            data: course });
    } catch (error) {
        console.error('Error fetching course:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
    }
});

// POST /api/courses - Create a new course
router.post('/', async (req: Request, res: Response) => {
    try {
        const course = await Course.create(req.body);

        res.status(201).json({ 
            success: true, 
            data: course,
            message: 'Course created successfully' });
    }catch (error: any) {
        console.error('Error creating course:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return res.status(400).json({ 
                message: messages.join(', '),
                success: false });
        }

        res.status(500).json({ 
            message: 'Failed to create course',
            success: false });
    }
});

// PUT /api/courses/:id - Update an existing course
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!course) {
            return res.status(404).json({ 
                message: 'Course not found',
                success: false });
        }
        res.json({ 
            success: true, 
            data: course,
            message: 'Course updated successfully' });
    } catch (error: any) {
        console.error('Error updating course:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map((val: any) => val.message);
            return res.status(400).json({ 
                message: messages.join(', '),
                success: false });
        }

        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
    }
});

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course) {
            return res.status(404).json({ 
                message: 'Course not found',
                success: false });
        }
        res.json({ 
            success: true, 
            data: course,
            message: 'Course deleted successfully' });
    } catch (error: any) {
        console.error('Error deleting course:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
    }
});

//PATCH /api/courses/:id/activate - Activate or deactivate a course
router.patch('/:id/toggle-active', async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ 
                message: 'Course not found',
                success: false });
        }
        course.isActive = !course.isActive;
        await course.save();
        res.json({ 
            success: true, 
            data: course,
            message: `Course has been ${course.isActive ? 'activated' : 'deactivated'} successfully` });
    } catch (error) {
        console.error('Error toggling course active status:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
    }
});

//PATCH /api/courses/:id/increment-claim - Increment claimed count
router.patch('/:id/increment-claim', async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ 
                message: 'Course not found',
                success: false });
        }
        course.claimedCount += 1;
        await course.save();
        res.json({ 
            success: true, 
            data: course,
            message: 'Course claimed count incremented successfully' });
    } catch (error) {
        console.error('Error incrementing course claimed count:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
    }
});

//GET /api/courses/stats/summary - Get course statistics
router.get('/stats/summary', async (req: Request, res: Response) => {
    try {
        const totalCourses = await Course.countDocuments();
        const activeCourses = await Course.countDocuments({ isActive: true });
        const totalClicks = await Course.aggregate([
            { $group: { _id: null, total: { $sum: "$claimedCount" } } }
        ]);
        const coursebyCategory = await Course.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalCourses,
                activeCourses,
                totalClicks: totalClicks[0]?.total || 0,
                coursebyCategory
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

//GET /api/courses/stats/today - Get today stats
router.get('/stats/today', async (req: Request, res: Response) =>{
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayClaims = await Course.aggregate([
            { $match: { claimedAt: { $gte: today, $lt: tomorrow } } },
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

//GET /api/courses/top - Get top courses claim
router.get('/top', async (req: Request, res: Response) => {
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

//GET /api/courses/recent - Get recent courses
router.get('/recent', async (req: Request, res: Response) => {
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