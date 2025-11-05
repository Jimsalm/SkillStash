import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/admin/AuthContext'
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAdmin } = useAuth();
  const location = useLocation();

  console.log(`ProtectedRoute: Checking auth for path ${location.pathname}. isAdmin is:`, isAdmin); // <-- DEBUG LOG

  if (!isAdmin) {
    console.log('ProtectedRoute: Not admin, redirecting to login.'); // <-- DEBUG LOG
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: User is admin, rendering children.'); // <-- DEBUG LOG
  return children;
};

export default ProtectedRoute;