# SkillStash - Project Overview

## 🚀 Project Description
SkillStash is a full-stack web application designed to help users manage and track their learning progress across various skills and courses. The application features user authentication, course management, and admin functionalities.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Query (TanStack Query)
- **UI Components**: Radix UI Primitives with custom styling
- **Styling**: TailwindCSS with custom theming
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **API**: RESTful API architecture
- **Security**: bcryptjs for password hashing
- **Development**: TypeScript with ts-node-dev for hot-reloading

## 📁 Project Structure

### Client-Side (`/client`)
```
/src
  /api           # API service layer
  /assets        # Static assets (images, fonts, etc.)
  /components    # Reusable UI components
    /admin       # Admin-specific components
    /ui          # Base UI components
  /context       # React context providers
  /data          # Mock data and constants
  /hooks         # Custom React hooks
  /lib           # Utility functions and helpers
    /schemas     # Zod validation schemas
    /types       # TypeScript type definitions
  /pages         # Page components
    /Auth        # Authentication pages
    /User        # User-facing pages
    /admin       # Admin dashboard pages
  /services      # Business logic and API services
```

### Server-Side (`/server`)
```
/server
  /api           # Main API entry point
  /config        # Configuration files
  /middleware    # Express middleware
  /models        # MongoDB schema definitions
  /routes        # API route handlers
  /public        # Static files served by Express
```

## 🔑 Key Features

### User Features
- User registration and authentication
- Course browsing and enrollment
- User profile management
- Responsive design for all devices

### Admin Features
- User management
- Course management
- Reporting and analytics
- System configuration

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn
- MongoDB instance

### Installation

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd SkillStash
   ```

2. **Set up the backend**
   ```bash
   cd server
   npm install
   cp .env.example .env
   ```

3. **Set up the frontend**
   ```bash
   cd ../client
   npm install
   cp .env.example .env
   ```

4. **Start the development servers**
   - In the server directory: `npm run dev`
   - In the client directory: `npm run dev`

## 📚 API Documentation

The API follows RESTful conventions with the following endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create new course (admin)
- `PUT /api/courses/:id` - Update course (admin)
- `DELETE /api/courses/:id` - Delete course (admin)

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (admin)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
