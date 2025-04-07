import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Employees from "./components/Employee";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/" element={<Home />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          {/* <Route path="attendance" element={<Attendance />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
