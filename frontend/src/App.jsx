import LoginPage from "./pages/LoginPage";
import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employees from "./components/Admin/Employee/Employee";
import PrivateRoute from "./components/Base/PrivateRoute";
import {AuthProvider} from "./contexts/AuthContext";
import AdminAttendanceSheet from "./components/Admin/Attendance/AdminAttendanceSheet.jsx";
import AdminAttendanceToday from "./components/Admin/Attendance/AdminAttendanceToday";
import HolidayList from "./components/Admin/Holiday/HolidayList";
import LeaveRequests from "./components/Admin/Leave/LeaveRequests";
import AddSalary from "./components/Admin/Payment/AddSalary";

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage/>}></Route>
                    <Route
                        path="/"
                        element={
                            <PrivateRoute>
                                <Home/>
                            </PrivateRoute>
                        }
                    >
                        <Route
                            path="/dashboard"
                            element={
                                <PrivateRoute>
                                    <Dashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="employees"
                            element={
                                <PrivateRoute>
                                    <Employees/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="attendance-sheet"
                            element={
                                <PrivateRoute>
                                    <AdminAttendanceSheet/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="attendance-today"
                            element={
                                <PrivateRoute>
                                    <AdminAttendanceToday/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="holiday-list"
                            element={
                                <PrivateRoute>
                                    <HolidayList/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="leave-requests"
                            element={
                                <PrivateRoute>
                                    <LeaveRequests/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="add-salary"
                            element={
                                <PrivateRoute>
                                    <AddSalary/>
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
