'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  bypassMode: boolean;
  toggleBypassMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [bypassMode, setBypassMode] = useState(false);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('oceanwatch_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Check for bypass mode
    const storedBypass = localStorage.getItem('oceanwatch_bypass');
    if (storedBypass === 'true') {
      setBypassMode(true);
    }
  }, []);

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        city: userData.city,
        state: userData.state,
      };

      // Store user credentials (in a real app, this would be handled by backend)
      const users = JSON.parse(localStorage.getItem('oceanwatch_users') || '[]');
      users.push({ ...newUser, password: userData.password });
      localStorage.setItem('oceanwatch_users', JSON.stringify(users));

      // Set current user
      setUser(newUser);
      localStorage.setItem('oceanwatch_user', JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const users = JSON.parse(localStorage.getItem('oceanwatch_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('oceanwatch_user', JSON.stringify(userWithoutPassword));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('oceanwatch_user');
  };

  const toggleBypassMode = () => {
    const newBypassMode = !bypassMode;
    setBypassMode(newBypassMode);
    localStorage.setItem('oceanwatch_bypass', newBypassMode.toString());
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user || bypassMode,
      bypassMode,
      toggleBypassMode
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
