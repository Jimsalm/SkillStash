import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, BookMarked, Sun, Moon } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const location = useLocation();
  const { setTheme, theme } = useTheme();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Course Category', href: '/courses/categories' },
    { name: 'About Us', href: '/about' },
    
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-background">
      <nav className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
        
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <BookMarked className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block text-lg">
              SkillStash
            </span>
          </Link>
        </div>

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

        <div className="flex items-center">
        
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
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
                
                {/* Mobile Navigation Links (Standard links) */}
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
                
                {/* Mobile Theme Toggle */}
                <div className="mt-8 flex flex-col gap-4 border-t border-border/40 pt-6">
                  <div className="flex justify-center pt-4">
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

          <div className="hidden md:block">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
          
          <div>
            <Button >
              <Link to={'/register'}>
              
                        Register
              </Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;