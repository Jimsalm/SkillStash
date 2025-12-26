import mongoose, { Document, Schema } from "mongoose";

interface CourseReport extends Document {
    courseId: mongoose.Schema.Types.ObjectId;
    courseTitle: string;
    reason: string;
    reportedBy?: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: Date;
}

const CourseReportSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true,
        enum: ['invalid_link', 'expired', 'fake_course', 'other']
    },
    reportedBy: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'resolved'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default mongoose.model<CourseReport>('CourseReport', CourseReportSchema);