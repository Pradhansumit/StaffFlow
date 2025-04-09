import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AdminDashboard from "../components/AdminDashboard";
import EmployeeDashboard from "../components/EmployeeDashboard";

export default function Dashboard() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token");
    try {
      const decoded = jwtDecode(access_token);
      console.log("From useEffect", decoded.role);
      setRole(decoded.role);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, []);

  if (role === null) {
    return <span className="loading loading-spinner loading-xl"></span>;
  }

  return role === 0 ? <EmployeeDashboard /> : <AdminDashboard />;
}
