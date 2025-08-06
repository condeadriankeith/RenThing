import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (in a real app, you would check with your backend)
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // In a real app, you would authenticate with your backend
    // For demo purposes, we'll just simulate a successful login
    const userData = {
      id: 1,
      name: 'John Doe',
      email: email,
      token: 'fake-jwt-token'
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    // In a real app, you would register with your backend
    // For demo purposes, we'll just simulate a successful registration
    const userData = {
      id: Date.now(),
      name: name,
      email: email,
      token: 'fake-jwt-token'
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
