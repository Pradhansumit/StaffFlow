import { Navigate } from "react-router";

export default function PrivateRoute({ children }) {
  let token = localStorage.getItem("access_token");
  if (!token) {
    token = sessionStorage.getItem("access_token");
  }
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
