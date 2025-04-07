import { Link } from "react-router";
export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col p-4 text-center">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <nav className="flex flex-col space-y-2">
        <Link to="/employees" className="hover:bg-gray-700 p-2 rounded">
          Employees
        </Link>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">
          Attendance
        </a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded">
          Payroll
        </a>
      </nav>
    </div>
  );
}
