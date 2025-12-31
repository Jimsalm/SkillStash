import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[100vh] flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="text-8xl font-bold text-primary-600 dark:text-primary-400">404</div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Button asChild>
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
