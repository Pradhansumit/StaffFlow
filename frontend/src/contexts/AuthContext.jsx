import { createContext, useContext, useState } from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = jwtDecode(token);
      return {
        role: decoded.role,
        name: decoded.name,
        isAuthenticated: true,
      };
    }
    return { role: null, name: null, isAuthenticated: false };
  });

  const login = (token) => {
    const decoded = jwtDecode(token);
    localStorage.setItem("access_token", token);
    setUser({
      role: decoded.role,
      name: decoded.name,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser({ role: null, name: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
