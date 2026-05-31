import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

const ProtectedRoute = ({
  children,
  allowRoles,
}: {
  children: React.ReactNode;
  allowRoles?: User["role"][];
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && user && !allowRoles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/home"} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
