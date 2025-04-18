import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employees from "./components/Employee";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./contexts/AuthContext";
import AdminAttendance from "./components/AdminAttendance";
import AdminAttendanceToday from "./components/AdminAttendanceToday";
import HolidayList from "./components/HolidayList";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          >
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
            <Route
              path="attendance-sheet"
              element={
                <PrivateRoute>
                  <AdminAttendance />
                </PrivateRoute>
              }
            />
            <Route
              path="attendance-today"
              element={
                <PrivateRoute>
                  <AdminAttendanceToday />
                </PrivateRoute>
              }
            />
            <Route
              path="holiday-list"
              element={
                <PrivateRoute>
                  <HolidayList />
                </PrivateRoute>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
