import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { isStaffRole, UserRole } from '@/types';

type AllowRole = UserRole | 'admin';

const expand = (roles: AllowRole[]): UserRole[] =>
  roles.flatMap((role) =>
    role === 'admin' ? (['content_manager', 'system_admin'] as UserRole[]) : [role],
  );

const ProtectedRoute = ({
  children,
  allowRoles,
}: {
  children: React.ReactNode;
  allowRoles?: AllowRole[];
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowRoles && user && !expand(allowRoles).includes(user.role)) {
    return <Navigate to={isStaffRole(user.role) ? '/admin' : '/home'} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
