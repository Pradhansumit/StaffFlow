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
        name: decoded.first_name + " " + decoded.last_name,
        designation: decoded.designation,
        department: decoded.department,
        email: decoded.email,
        profile_pic: decoded.profile_pic,
        isAuthenticated: true,
      };
    }
    return {
      role: null,
      name: null,
      designation: null,
      department: null,
      email: null,
      profile_pic: null,
      isAuthenticated: false,
    };
  });

  const login = (token, rtoken, remember) => {
    const decoded = jwtDecode(token);
    console.log("Decoded token", decoded);
    if (remember) {
      localStorage.setItem("access_token", token);
      localStorage.setItem("refresh_token", rtoken);
    } else {
      sessionStorage.setItem("access_token", token);
      sessionStorage.setItem("refresh_token", rtoken);
    }

    setUser({
      role: decoded.role,
      name: decoded.first_name + " " + decoded.last_name,
      designation: decoded.designation,
      department: decoded.department,
      email: decoded.email,
      profile_pic: decoded.profile_pic,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    let token = localStorage.getItem("access_token");
    if (token) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    } else {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
    }
    setUser({
      role: null,
      name: null,
      designation: null,
      department: null,
      email: null,
      profile_pic: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
