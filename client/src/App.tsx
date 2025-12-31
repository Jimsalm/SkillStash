import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Layouts ---
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "@/components/admin/AdminLayout";

// --- Hooks ---
import usePageTitle from "./hooks/usePageTitle";

// --- Public Pages ---
import Home from "./pages/User/Home";
import About from "./pages/User/About";
import CourseCategory from "./pages/User/CourseCategory";
import CourseList from "./pages/User/CourseList";
import CourseDetails from "./pages/User/CourseDetails";
import Register from "./pages/Auth/Register";

// --- Admin Pages ---
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";
import AddEditCoursePage from "./pages/admin/AddEditCoursePage";
import AdminArchivedCoursesPage from "./pages/admin/AdminArchivedCoursesPage";
import AdminReportsPage from "./pages/admin/AdminReportsPage";
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Auth/Login";
import NotFoundPage from "./pages/Error/NotFoundPage";

// Wrapper component to set page title
const Page = ({ title, children }: { title: string; children: React.ReactNode }) => {
  usePageTitle(title);
  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Page title="Home"><Home /></Page>} />
        <Route
          path="/courses/:category/:subcategory"
          element={<Page title="Courses"><CourseList /></Page>}
        />
        <Route 
          path="/courses/categories" 
          element={<Page title="Course Categories"><CourseCategory /></Page>} 
        />
        <Route 
          path="about" 
          element={<Page title="About Us"><About /></Page>} 
        />
        <Route 
          path="/courses/details/:id" 
          element={<Page title="Course Details"><CourseDetails /></Page>} 
        />
      </Route>

      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route 
          path="register" 
          element={<Page title="Create Account"><Register /></Page>} 
        />
        <Route 
          path="login" 
          element={<Page title="Login"><Login /></Page>} 
        />
      </Route>

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Page title="Admin Dashboard"><AdminDashboardPage /></Page>} />
        <Route path="courses" element={<Page title="Manage Courses"><AdminCoursesPage /></Page>} />
        <Route path="courses/add" element={<Page title="Add New Course"><AddEditCoursePage /></Page>} />
        <Route path="courses/edit/:id" element={<Page title="Edit Course"><AddEditCoursePage /></Page>} />
        <Route path="courses/archived" element={<Page title="Archived Courses"><AdminArchivedCoursesPage /></Page>} />
        <Route path="reports" element={<Page title="Reports"><AdminReportsPage /></Page>} />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
            <Page title="Page Not Found">
              <NotFoundPage />
            </Page>
        }
      />
    </Routes>
  );
}

export default App;
