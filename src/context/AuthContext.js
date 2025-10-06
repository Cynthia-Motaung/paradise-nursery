import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  const [userProfile, setUserProfile] = useState(null);
  const [userPreferences, setUserPreferences] = useState({});

  // Load user profile and preferences
  useEffect(() => {
    if (isAuthenticated && user) {
      // Load user data from localStorage or API
      const savedProfile = localStorage.getItem(`user_profile_${user.sub}`);
      const savedPreferences = localStorage.getItem(`user_prefs_${user.sub}`);
      
      setUserProfile(savedProfile ? JSON.parse(savedProfile) : {
        id: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
        createdAt: new Date().toISOString()
      });

      setUserPreferences(savedPreferences ? JSON.parse(savedPreferences) : {
        newsletter: true,
        notifications: true,
        theme: 'light'
      });
    }
  }, [isAuthenticated, user]);

  const updateProfile = async (updates) => {
    if (!user) return;
    
    const updatedProfile = { ...userProfile, ...updates };
    setUserProfile(updatedProfile);
    localStorage.setItem(`user_profile_${user.sub}`, JSON.stringify(updatedProfile));
  };

  const updatePreferences = (updates) => {
    if (!user) return;
    
    const updatedPreferences = { ...userPreferences, ...updates };
    setUserPreferences(updatedPreferences);
    localStorage.setItem(`user_prefs_${user.sub}`, JSON.stringify(updatedPreferences));
  };

  const getAuthToken = async () => {
    try {
      return await getAccessTokenSilently();
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  };

  const handleLogout = () => {
  localStorage.clear();
  
  // REPLACE THIS WITH YOUR ACTUAL VERCEL URL
  const vercelUrl = 'https://paradise-nursery-six-topaz.vercel.app/';
  
  logout({
    logoutParams: {
      returnTo: vercelUrl
    }
  });
};

  const value = {
    user,
    userProfile,
    userPreferences,
    isAuthenticated,
    isLoading,
    login: loginWithRedirect,
    logout: () => logout({ returnTo: window.location.origin }),
    updateProfile,
    updatePreferences,
    getAuthToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};