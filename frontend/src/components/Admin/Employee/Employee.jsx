import { useEffect, useState } from "react";
import api from "../../../config/api.js";
import URLS from "../../../utils/urls.js";
import { FaPlus } from "react-icons/fa6";
import { MdFileDownload } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import TableRow from "./TableRow.jsx";
import AddEmployeeModal from "./AddEmployeeModal.jsx";
import exportToCSV from "../../../utils/exportToCSV.js";
import EditEmployeeModal from "./EditEmployeeModal.jsx";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [editData, setEditData] = useState(null);

  async function getEmployee() {
    const res = await api.post(URLS.listUsers, { user: 0 });
    setEmployees(res.data);
  }

  useEffect(() => {
    getEmployee();
  }, []);

  useEffect(() => {
    if (toast !== "") {
      const timer = setTimeout(() => {
        setToast("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (editData !== null) {
      const modal = document.getElementById("edit_modal");
      if (modal) {
        modal.showModal();
      }
    }
  }, [editData]);

  const handleDelete = async (id) => {
    try {
      const res = await api.post(URLS.deleteEmployee, { id: id });
      console.log(res.status, typeof res.status);
      if (res.status === "200" || res.status === 200) {
        setToast("User deleted successfully.");
        getEmployee();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/employee">Employees</a>
            </li>
          </ul>
        </div>

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
            <AddEmployeeModal getEmployee={getEmployee} setToast={setToast} />
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
              <th>Action</th>
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
                <TableRow
                  employee={employee}
                  key={employee.id}
                  getEmployee={getEmployee}
                  handleDelete={handleDelete}
                  onEdit={(emp) => {
                    setEditData(emp);
                  }}
                />
              ))}
          </tbody>
        </table>
      </div>
      {toast !== "" ? (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>{toast}</span>
          </div>
        </div>
      ) : null}

      {editData && (
        <EditEmployeeModal
          editData={editData}
          onClose={() => setEditData(null)}
          getEmployee={getEmployee}
          setToast={setToast}
        />
      )}
    </>
  );
}
