import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { spotifyService } from '../services/spotify/api';
import { isTokenValid, logout } from '../services/spotify/auth';

// Create context
const AuthContext = createContext(null);

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      if (!isTokenValid()) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await spotifyService.getCurrentUser();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If there's an error, log the user out
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/login');
  };

  // Value to provide in context
  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};