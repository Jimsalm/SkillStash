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

export default router;