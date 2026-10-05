import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ew_user') || 'null'); }
    catch { return null; }
  });

  const login = (email) => {
    const u = { email, name: email.split('@')[0] };
    localStorage.setItem('ew_user', JSON.stringify(u));
    setUser(u);
  };
  const logout = () => { localStorage.removeItem('ew_user'); setUser(null); };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);