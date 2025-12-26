import express, { Request, Response } from 'express';
import CourseReport from '../models/CourseReport';
import Course from '../models/Course';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

//POST /api/reports - Report a course
router.post('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { courseId, courseTitle, reason, reportedBy } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false,
                message: 'Course not found' 
            });
        }

        const existingReport = await CourseReport.findOne({ 
            courseId,
            status: 'pending'
        });

        if (existingReport) {
            return res.status(400).json({ 
                success: false,
                message: 'Course already reported' 
            });
        }

        const report = await CourseReport.create({
            courseId,
            courseTitle,
            reason,
            reportedBy,
        });

        res.status(201).json({ 
            success: true,
            message: 'Course reported successfully',
            data: report 
        });
    } catch (error) {
        console.error('Error reporting course:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//GET /api/reports - Get all reports
router.get('/', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { status } = req.query;
        const query: any = {};

        if (status) {
            query.status = status;
        }

        const reports = await CourseReport.find(query)
            .sort({ createdAt: -1 })
            .populate('courseId');

        res.json({
            success: true,
            message: 'Reports fetched successfully',
            data: reports,
            count: reports.length
        });
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//PATCH /api/reports/:id/status - Update a report status
router.patch('/:id/status', authMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const report = await CourseReport.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!report) {
            return res.status(404).json({ 
                success: false,
                message: 'Report not found' 
            });
        }

        res.json({
            success: true,
            message: 'Report status updated successfully',
            data: report
        });
    } catch (error) {
        console.error('Error updating report status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
