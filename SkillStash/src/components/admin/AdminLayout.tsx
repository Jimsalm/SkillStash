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
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
    </div>
  );
};

export default AdminLayout;