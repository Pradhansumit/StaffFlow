import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
