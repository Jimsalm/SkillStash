import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PlusCircle, LogOut, BookMarked, Sun, Moon, Archive, Flag } from 'lucide-react';
import { useAuth } from './AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/components/theme-provider';
import { useReports } from '@/hooks/useReports';

const AdminSidebar = () => {
  const { logout } = useAuth();
  const { setTheme, theme } = useTheme();

  const { data: reports } = useReports({ status: 'pending'})
  const pendingCount = reports?.length || 0;

  const navItems = [
    { to: '/admin/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/courses', label: 'All Courses', icon: BookOpen },
    { to: '/admin/courses/add', label: 'Add New Course', icon: PlusCircle },
    { to: '/admin/courses/archived', label: 'Archived Courses', icon: Archive },
    { to: '/admin/reports', label: 'Course Reports', icon: Flag, badge: pendingCount}
  ];

  return (
    <aside className="w-64 bg-background border-r flex-shrink-0 flex flex-col">
      
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex items-center gap-2">
          <BookMarked className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-lg font-bold">SkillStash</h2>
            <p className="text-xs text-muted-foreground">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:text-foreground hover:bg-secondary'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className='flex-1'>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <Badge
                variant="destructive"
                className='h-5 min-w-5 flex items-center justify-center text-xs px-1.5'>
                  {item.badge}
                </Badge>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-foreground hover:text-foreground hover:bg-secondary"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 ml-4" />
          <span className="ml-8">Toggle Theme</span>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-foreground hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Button>
      </div>
    </aside>
  );
};

export { AdminSidebar };