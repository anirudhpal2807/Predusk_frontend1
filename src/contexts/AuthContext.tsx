import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

// Configure axios base URL
const baseURL = import.meta.env.VITE_API_URL || '';
axios.defaults.baseURL = baseURL;

interface User {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  // Set up axios default headers
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await axios.get('/api/auth/profile');
          const { user: userData, profile: profileData } = response.data.data;
          
          // Merge user and profile data
          const fullUserData = {
            ...userData,
            name: profileData.name
          };
          
          setUser(fullUserData);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token: newToken, user: userData } = response.data.data;
      
      setToken(newToken);
      
      // Set axios default header first
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Fetch profile data to get the name
      try {
        const profileResponse = await axios.get('/api/auth/profile');
        const profileData = profileResponse.data.data.profile;
        
        // Merge user and profile data
        const fullUserData = {
          ...userData,
          name: profileData.name
        };
        
        setUser(fullUserData);
      } catch (profileError) {
        // If profile fetch fails, just use user data without name
        console.warn('Failed to fetch profile data:', profileError);
        setUser(userData);
      }
      
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password });
      console.log('Registration response:', response.data); // Debug log
      
      if (!response.data.data) {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Invalid response structure from server');
      }
      
      const { token: newToken, user: userData, profile: profileData } = response.data.data;
      
      if (!profileData || !profileData.name) {
        console.error('Profile data missing or invalid:', profileData);
        throw new Error('Profile data is missing from server response');
      }
      
      // Merge user and profile data
      const fullUserData = {
        ...userData,
        name: profileData.name
      };
      
      console.log('Merged user data:', fullUserData); // Debug log
      
      setToken(newToken);
      setUser(fullUserData);
      localStorage.setItem('token', newToken);
      
      // Set axios default header
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
