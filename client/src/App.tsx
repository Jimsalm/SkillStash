import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Layouts ---
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "@/components/admin/AdminLayout";

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
import AuthLayout from "./components/AuthLayout";
import Login from "./pages/Auth/Login";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route
          path="/courses/:category/:subcategory"
          element={<CourseList />}
        />
        <Route path="/courses/categories" element={<CourseCategory />} />
        <Route path="about" element={<About />} />
        <Route path="/courses/details/:id" element={<CourseDetails />} />
      </Route>

      {/* Para sa login at Register*/}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Route>

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="courses" element={<AdminCoursesPage />} />
        <Route path="courses/add" element={<AddEditCoursePage />} />
        <Route path="courses/edit/:id" element={<AddEditCoursePage />} />
        <Route path="courses/archived" element={<AdminArchivedCoursesPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <h1 className="text-center mt-8 text-2xl">404 - Page Not Found</h1>
        }
      />
    </Routes>
  );
}

export default App;
