import { useEffect, useState } from "react";
import api from "../config/api";
import URLS from "../utils/urls";
import { FaPlus } from "react-icons/fa6";
import { MdFileDownload } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import TableRow from "../components/TableRow.jsx";
import AddEmployeeModal from "../components/AddEmployeeModal.jsx";
import exportToCSV from "../utils/exportToCSV.js";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");

  async function getEmployee() {
    const res = await api.post(URLS.listUsers, { user: 0 });
    setEmployees(res.data);
  }

  useEffect(() => {
    getEmployee();
  }, []);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-center justify-between bg-blue-50 p-3 mb-3 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold">Employees</p>
          <label className="input">
            <FaSearch className="text-lg" color="gray" />
            <input
              type="search"
              className="grow"
              placeholder="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="btn btn-sm btn-circle btn-success text-white"
            title="Add"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            <FaPlus className="text-2xl" />
          </button>
          <AddEmployeeModal getEmployee={getEmployee} />
          <button
            className="btn btn-sm btn-circle btn-secondary text-blue-500"
            title="Download"
            onClick={() => exportToCSV(employees)}
          >
            <MdFileDownload className="text-2xl" color="white" />
          </button>
        </div>
      </div>
      <table className="table bg-white">
        {/* head */}
        <thead>
          <tr>
            <th>
              <label>
                <input type="checkbox" className="checkbox" />
              </label>
            </th>
            <th>Name</th>
            <th>Role</th>
            <th>Department</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          {employees
            .filter(
              (employee) =>
                employee.first_name.toLowerCase().includes(search) ||
                employee.last_name.toLowerCase().includes(search) ||
                employee.email.toLowerCase().includes(search),
            )
            .map((employee) => (
              <TableRow employee={employee} key={employee.id} />
            ))}
        </tbody>
      </table>
    </div>
  );
}
