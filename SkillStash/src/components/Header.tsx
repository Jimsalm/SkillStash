import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react'; // Hamburger menu icon
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';
import { cn } from '@/lib/utils'; // shadcn's utility for combining class names

const Header = () => {
  // State to control the mobile menu sheet
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Course Category', href: '/courses' },
    { name: 'About Us', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/100">
      <nav className="container mx-auto flex h-14 max-w-screen-2xl items-center">
        {/* Logo / Brand Name */}
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">
              Udemy Deals
            </span>
          </Link>
        </div>
        
        {/* Mobile Logo - centered */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="mx-auto block w-fit md:hidden">
              <span className="font-bold text-xl">Udemy Deals</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center">
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                asChild
                className="text-foreground/80"
              >
                <Link
                  to={item.href}
                  className={cn(
                    "transition-colors hover:text-foreground"
                  )}
                >
                  {item.name}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Mobile Navigation (Sheet) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the site.
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-6">
                {navItems.map((item) => (
                  <Button
                    key={item.name}
                    variant="ghost"
                    asChild
                    onClick={() => setIsOpen(false)} // Close sheet on link click
                    className="justify-start"
                  >
                    <Link to={item.href}>{item.name}</Link>
                  </Button>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Header;