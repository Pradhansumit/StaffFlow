import { useEffect, useState } from "react";
import api from "../config/api";
import URLS from "../utils/urls";
import { FcPhone } from "react-icons/fc";

export default function Employees() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function getEmployee() {
      const res = await api.post(URLS.listUsers, { user: 0 });
      console.log(res);
      setEmployees(res.data);
    }

    getEmployee();
  }, []);

  return (
    <div className="overflow-x-auto">
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
          {employees.map((employee) => (
            <tr key={employee.id}>
              <th>
                {console.log(employee)}
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img
                        src={`${import.meta.env.VITE_API_URL}/media/${
                          employee.profile_pic
                        }`}
                        alt="Avatar Tailwind CSS Component"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {employee.first_name + " " + employee.last_name}
                    </div>
                  </div>
                </div>
              </td>
              <td>{employee.designation}</td>
              <td>{employee.department}</td>
              <td>
                <div className="flex justify-start items-center">
                  <FcPhone className="text-xl" />
                  {employee.mobile}
                </div>
              </td>
              <td>{employee.email}</td>
              <td>
                <div className="badge badge-primary">
                  {employee.gender === 1 ? "Female" : "Male"}
                </div>
              </td>
              <td>{employee.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
