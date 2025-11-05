import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// --- Layouts ---
import PublicLayout from './components/PublicLayout';
import AdminLayout from '@/components/admin/AdminLayout';

// --- Public Pages ---
import Home from './pages/Home';
import About from './pages/About';
import CourseCategory from './pages/CourseCategory';
import CourseList from './pages/CourseList';
import CourseDetails from './pages/CourseDetails';

// --- Admin Pages ---
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import AddNewCoursePage from './pages/admin/AddNewCoursePage';

function App() {
  return (
    // NO Header, Footer, or wrapper div here. The layouts handle everything.
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="courses/:group/:subcategory" element={<CourseList />} />
        <Route path="courses" element={<CourseCategory />} />
        <Route path="about" element={<About />} />
        <Route path="course/:id" element={<CourseDetails />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="add-course" element={<AddNewCoursePage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<h1 className="text-center mt-8 text-2xl">404 - Page Not Found</h1>} />
    </Routes>
  );
}

export default App;