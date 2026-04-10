import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, getCurrentUser } from '../api/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = getCurrentUser();
    if (savedUser) setUser(savedUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await loginUser({ email, password });
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const response = await registerUser(formData);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user, loading, error,
      login, register, logout,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;