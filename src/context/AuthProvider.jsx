import { useEffect, useState } from 'react';
import { AuthContext } from './useAuth';
import { getMe } from '../api/auth';
import { getTokens, setTokens, clearTokens } from './tokenStore';

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if tokens came back from OAuth redirect
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    if (accessToken && refreshToken) {
      setTokens(accessToken, refreshToken);
      // Clean tokens from URL immediately
      window.history.replaceState({}, '', window.location.pathname);
    }

    getMe()
      .then((res) => setUser(res.data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const isAdmin = user?.role === 'admin';
  const isAnalyst = user?.role === 'analyst';
  const updateUser = (userData) => setUser(userData);
  const clearUser = () => {
    setUser(null);
    clearTokens();
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, isAdmin, isAnalyst, updateUser, clearUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}