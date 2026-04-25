import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { name, phone, email }
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('andhra_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {}
    setIsLoaded(true);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('andhra_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('andhra_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoaded, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
