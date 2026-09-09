import { createContext, useContext, useState, useEffect } from 'react';
import { getAdminMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('yc_admin_token');
    if (token) {
      getAdminMe()
        .then(res => setAdmin(res.data.admin))
        .catch(() => { localStorage.removeItem('yc_admin_token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token, adminData) => {
    localStorage.setItem('yc_admin_token', token);
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem('yc_admin_token');
    localStorage.removeItem('yc_admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
