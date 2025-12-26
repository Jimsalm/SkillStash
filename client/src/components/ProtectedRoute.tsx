import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/components/admin/AuthContext'
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user, isAdmin } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
};

export default ProtectedRoute;