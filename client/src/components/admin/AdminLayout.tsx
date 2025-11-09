import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from './AuthContext';

const AdminLayout = () => {
    console.log('AdminLayout is rendering!');
  const { logout } = useAuth();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <AdminSidebar />
      
        
        {/* Page Content */}
        <main className="flex-1 flex flex-col overflow-hidden min-h-0">
          <Outlet />
        </main>
    </div>
  );
};

export default AdminLayout;