import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employees from "./components/Employee";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/" element={<Home />}>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="employees"
            element={
              <PrivateRoute>
                <Employees />
              </PrivateRoute>
            }
          />
          {/* <Route path="attendance" element={<Attendance />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
