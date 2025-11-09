import React, { createContext, useState, useContext } from 'react';
import type { ReactNode } from 'react';

// Define the shape of the context value
interface AuthContextType {
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  console.log('AuthProvider: isAdmin state is:', isAdmin); // <-- DEBUG LOG

  const login = (email: string, password: string) => {
    console.log('AuthProvider: login attempt with', email); // <-- DEBUG LOG
    if (email === 'admin@skillstash.com' && password === 'password123') {
      setIsAdmin(true);
      localStorage.setItem('isAdmin', 'true');
      console.log('AuthProvider: login successful!'); // <-- DEBUG LOG
      return true;
    }
    console.log('AuthProvider: login failed!'); // <-- DEBUG LOG
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  React.useEffect(() => {
    const storedAuth = localStorage.getItem('isAdmin');
    console.log('AuthProvider: Checking localStorage. Found:', storedAuth); // <-- DEBUG LOG
    if (storedAuth === 'true') {
      setIsAdmin(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};