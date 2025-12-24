import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, BookMarked, Sun, Moon, LogOut, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
// Import the Auth Hook to check user status
import { useAuth } from '@/components/admin/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { setTheme, theme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Course Category', href: '/courses/categories' },
    { name: 'About Us', href: '/about' },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <nav className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">
              SkillStash
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center me-20">
          <ToggleGroup
            type="single"
            value={location.pathname} 
            className="flex items-center space-x-1"
          >
            {navItems.map((item) => (
              <ToggleGroupItem
                key={item.name}
                value={item.href}
                asChild
              >
                <Link to={item.href} className="text-sm font-medium">
                  {item.name}
                </Link>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Right Side Actions (Theme + Auth) */}
        <div className="flex items-center gap-2">
        
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] flex flex-col">
                <SheetHeader className="mb-4">
                  <SheetTitle>
                    <Link 
                      to="/" 
                      onClick={() => setIsOpen(false)} 
                      className="flex items-center space-x-2"
                    >
                      <BookMarked className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg">SkillStash</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                
                {/* Mobile Navigation Links */}
                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === item.href
                          ? "text-primary"
                          : "text-foreground/70"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Bottom Section (Auth + Theme) */}
                <div className="mt-auto flex flex-col gap-4 border-t border-border/40 pt-6">
                  
                  {/* Mobile Auth Section */}
                  {isAuthenticated ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 px-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="" />
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {user?.name ? getInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm">{user?.name}</span>
                          <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-2 justify-start" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <Button variant="ghost" className="w-full justify-start" onClick={() => { setIsOpen(false); navigate('/auth/login'); }}>
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                      <Button className="w-full" onClick={() => { setIsOpen(false); navigate('/auth/register'); }}>
                        Register
                      </Button>
                    </div>
                  )}

                  {/* Mobile Theme Toggle */}
                  <div className="flex justify-center pt-2">
                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </div>
                </div>


              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          
          {/* Desktop Auth Logic */}
          <div className="hidden md:block">
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground font-medium">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild>
                <Link to="/auth/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;