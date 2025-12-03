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

//GET /api/courses/archived - Get archived courses
router.get('/archived', async (req: Request, res: Response) => {
    try {
        const courses = await Course.find({ isArchived: true }).sort({ createdAt: -1 });
        res.json({ 
            success: true, 
            data: courses,
            count: courses.length });
    } catch (error) {
        console.error('Error fetching archived courses:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
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

//PATCH /api/courses/:id/archive - Archive a course
router.patch('/:id/archive', async (req: Request, res: Response) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ 
                message: 'Course not found',
                success: false });
        }
        course.isArchived = !course.isArchived;

        if (course.isArchived) {
            course.archivedAt = new Date();
        } else {
            course.archivedAt = undefined;
        }
        await course.save();
        res.json({ 
            success: true, 
            data: course,
            message: `Course has been ${course.isArchived ? 'archived' : 'unarchived'} successfully` });
    } catch (error) {
        console.error('Error toggling course archived status:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            success: false });
    }
});

export default router;