export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  instructor: string;
  software: string[];
  claimedCount: number;
  originalPrice: number;
  discountedPrice: number;
  group: string;
  subcategory: string;
  udemyUrl: string;
}

export const coursesData: Course[] = [
  {
    id: 'react-complete-guide',
    title: 'React - The Complete Guide (incl. Hooks, Redux, Next.js)',
    description: 'Dive in and learn React.js from scratch! Learn Reactjs, Hooks, Redux, React Routing, Animations, Next.js and way more! This course is fully up-to-date with the latest version of React (React 18) and includes brand new sections on Next.js, the most popular React framework.',
    image: 'https://img-c.udemycdn.com/course/480x270/5806946_7fdc.jpg',
    instructor: 'Maximilian Schwarzmüller',
    software: ['React', 'Redux', 'Next.js'],
    claimedCount: 15234,
    originalPrice: 89.99,
    discountedPrice: 14.99,
    group: 'development',
    subcategory: 'web-development',
    udemyUrl: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/?couponCode=SKILLSTASH24', // Sample link
  },
  {
    id: 'python-bootcamp',
    title: '100 Days of Code: The Complete Python Pro Bootcamp',
    description: 'Master Python by building 100 projects in 100 days. Learn to build websites, games, apps, plus scraping and data science. Become a Python programmer and get hired.',
    image: 'https://img-c.udemycdn.com/course/480x270/5806946_7fdc.jpg',
    instructor: 'Dr. Angela Yu',
    software: ['Python', 'Django', 'Flask'],
    claimedCount: 22150,
    originalPrice: 89.99,
    discountedPrice: 18.99,
    group: 'development',
    subcategory: 'web-development',
    udemyUrl: 'https://www.udemy.com/course/complete-c-plus-programming-course-from-basic-to-expert/?couponCode=6306412EB72D5443C38C', // Sample link
  },
  {
    id: 'data-science-bootcamp',
    title: 'Complete Data Science Bootcamp 2024',
    description: 'Learn Data Science, Deep Learning, & Machine Learning with Python, R, & Tensorflow. Build real-world projects and a professional portfolio.',
    image: 'https://img-c.udemycdn.com/course/480x270/5806946_7fdc.jpg',
    instructor: '365 Careers',
    software: ['Python', 'TensorFlow', 'R'],
    claimedCount: 18500,
    originalPrice: 199.99,
    discountedPrice: 19.99,
    group: 'development',
    subcategory: 'data-science',
    udemyUrl: 'https://www.udemy.com/course/complete-data-science-bootcamp/?couponCode=SKILLSTASH24', // Sample link
  },
  // Graphic Design -> UI Design
  {
    id: 'ui-ux-design-bootcamp',
    title: 'UI/UX Design Bootcamp: From Zero to a Job-Ready Portfolio',
    description: 'Become a UI/UX Designer. Learn Figma, user research, design thinking, and build a stunning portfolio.',
    image: 'https://img-c.udemycdn.com/course/480x270/5806946_7fdc.jpg',
    instructor: 'Daniel Scott',
    software: ['Figma', 'Adobe XD'],
    claimedCount: 9870,
    originalPrice: 84.99,
    discountedPrice: 16.99,
    group: 'graphic-design',
    subcategory: 'user-interface-ui-design',
    udemyUrl: 'https://www.udemy.com/course/complete-data-science-bootcamp/?couponCode=SKILLSTASH24', 
  },
  // Network & System -> Cloud Computing
  {
    id: 'aws-certified-solutions-architect',
    title: 'Ultimate AWS Certified Solutions Architect Associate 2024',
    description: 'Pass the AWS Certified Solutions Architect Associate SAA-C03 Exam. Includes hands-on labs, practice exams, and a final exam.',
    image: 'https://img-c.udemycdn.com/course/480x270/5806946_7fdc.jpg',
    instructor: 'Stephane Maarek',
    software: ['AWS', 'Terraform'],
    claimedCount: 31000,
    originalPrice: 94.99,
    discountedPrice: 19.99,
    group: 'network-&-system',
    subcategory: 'cloud-computing',
    udemyUrl: 'https://www.udemy.com/course/complete-data-science-bootcamp/?couponCode=SKILLSTASH24', 
  },
  // Others -> Business
  {
    id: 'mba-in-one',
    title: 'An Entire MBA in 1 Course: Award Winning Business School Prof',
    description: 'Everything you need to know about business, from starting a company to taking it public. Learn business strategy.',
    image: 'https://img-c.udemycdn.com/course/480x270/5806946_7fdc.jpg',
    instructor: 'Chris Haroun',
    software: ['Business Strategy'],
    claimedCount: 45000,
    originalPrice: 199.99,
    discountedPrice: 24.99,
    group: 'others',
    subcategory: 'business',
    udemyUrl: 'https://www.udemy.com/course/complete-data-science-bootcamp/?couponCode=SKILLSTASH24', 
  },
];