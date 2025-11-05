import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';

const AdminSidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/admin/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/courses', label: 'All Courses', icon: BookOpen },
    { to: '/admin/add-course', label: 'Add New Course', icon: PlusCircle },
  ];

  return (
    <aside className="w-64 bg-slate-800 text-white flex-shrink-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold">SkillStash</h2>
        <p className="text-xs text-slate-400 mt-1">Admin Panel</p>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-900 border-r-4 border-primary'
                  : 'text-slate-300 hover:bg-slate-700 hover:text-white'
              }`
            }
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="absolute bottom-0 w-full p-6">
        <Button
          variant="ghost"
          className="w-40 justify-start text-slate-300 hover:bg-slate-700 hover:text-white"
          onClick={logout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export { AdminSidebar };