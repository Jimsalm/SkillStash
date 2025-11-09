import * as z from 'zod';

// Zod schema for course form validation
export const courseFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  instructor: z.string().min(2, 'Instructor name is required.'),
  software: z.string().min(1, 'Please add at least one technology (comma-separated)'),
  originalPrice: z.number().positive('Original price must be a positive number.'),
  discountedPrice: z.number().positive('Discounted price must be a positive number.'),
  claimedCount: z.number().min(0, 'Claimed count cannot be negative.'),
  image: z.string().url('Please enter a valid image URL.'),
  udemyUrl: z.string().url('Please enter a valid Udemy URL.'),
  couponCode: z.string().optional(),
  expiresAt: z.string().optional(),
  category: z.string().min(1, 'Please select a category.'),
  subcategory: z.string().min(1, 'Please select a subcategory.'),
  isActive: z.boolean(),
}).refine((data) => data.discountedPrice < data.originalPrice, {
  message: "Discounted price must be less than original price",
  path: ["discountedPrice"],
});

// Export the inferred type
export type CourseFormValues = z.infer<typeof courseFormSchema>;

// Categories Data
export const categoriesData = [
  {
    name: 'Development',
    subcategories: [
      'Web Development',
      'Data Science',
      'Mobile Development',
      'Game Development',
      'Programming Languages',
      'Software Testing',
    ],
  },
  {
    name: 'Graphic Design',
    subcategories: [
      'Graphic Design Tools',
      'User Experience (UX) Design',
      'User Interface (UI) Design',
      '3D & Animation',
      'Fashion Design',
    ],
  },
  {
    name: 'Network & System',
    subcategories: [
      'Network Administration',
      'Cloud Computing',
      'Cybersecurity',
      'Operating Systems',
      'IT Certification',
    ],
  },
  {
    name: 'Others',
    subcategories: [
      'Business',
      'Finance & Accounting',
      'Marketing',
      'Photography & Video',
      'Health & Fitness',
      'Music',
    ],
  },
];