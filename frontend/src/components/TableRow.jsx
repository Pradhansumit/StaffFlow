import { FcPhone } from "react-icons/fc";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

function TableRow({ employee, handleDelete, onEdit }) {
  return (
    <>
      <tr>
        <th>
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
          <div
            className={`badge ${
              employee.gender === 1 ? "badge-primary" : "badge-secondary"
            }`}
          >
            {employee.gender === 1 ? "Female" : "Male"}
          </div>
        </td>
        <td>{employee.address}</td>
        <td>
          <div className="flex items-center gap-2 text-xl cursor-pointer">
            <FaTrash color="red" onClick={() => handleDelete(employee.id)} />
            <FaEdit color="green" onClick={() => onEdit(employee)} />
          </div>
        </td>
      </tr>
    </>
  );
}

export default TableRow;
