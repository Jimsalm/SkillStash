import mongoose, { Schema, Document } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  description: string;
  image: string;
  instructor: string;
  software: string[];
  claimedCount: number;
  originalPrice: number;
  discountedPrice: number;
  category: string;
  subcategory: string;
  udemyUrl: string;
  couponCode: string;
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  archivedAt?: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    instructor: {
      type: String,
      required: [true, 'Please add an instructor name'],
    },
    software: {
      type: [String],
      required: [true, 'Please add at least one technology'],
    },
    claimedCount: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please add original price'],
      min: 0,
    },
    discountedPrice: {
      type: Number,
      required: [true, 'Please add discounted price'],
      min: 0,
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: ['Development', 'Graphic Design', 'Network & System', 'Business', 'Others'],
    },
    subcategory: {
      type: String,
      required: [true, 'Please add a subcategory'],
    },
    udemyUrl: {
      type: String,
      required: [true, 'Please add Udemy URL'],
    },
    couponCode: {
      type: String,
      default: '',
    },
    expiresAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
CourseSchema.index({ category: 1, subcategory: 1 });
CourseSchema.index({ isActive: 1 });
CourseSchema.index({ createdAt: -1 });

export default mongoose.model<ICourse>('Course', CourseSchema);