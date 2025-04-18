import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import exportToCSV from "../utils/exportToCSV";
import api from "../config/api";
import URLS from "../utils/urls";
import extractTimeFromDateTimeString from "../utils/extractTimeFromDateTimeString";

function AdminAttendanceToday() {
  const [search, setSearch] = useState("");
  const [apiData, setApiData] = useState([]);
  const attendance = "Absent";

  useEffect(() => {
    const viewAttendance = async () => {
      try {
        const res = await api.post(URLS.todayAttendance);
        if (res.status === 200) {
          setApiData(res.data);
        }
        if (res.status !== 200) {
          console.log(res);
        }
      } catch (error) {
        console.error(error);
      }
    };

    viewAttendance();
  }, []);

  return (
    <>
      <div className="overflow-x-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/attendance-today">Attendance Today</a>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between bg-blue-50 p-3 mb-3 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold">Attendance</p>
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
              className="btn btn-sm btn-circle btn-secondary text-blue-500"
              title="Download"
              onClick={() => exportToCSV(apiData)}
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
              <th></th>
              <th>Employee</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Email</th>
              <th>Status</th>
              <th>Total Hours</th>
            </tr>
          </thead>
          <tbody>
            {apiData
              .filter(
                (data) =>
                  data.first_name.toLowerCase().includes(search) ||
                  data.last_name.toLowerCase().includes(search) ||
                  data.email.toLowerCase().includes(search),
              )
              .filter((data) => data.role == 0)
              .map((data) => (
                <tr key={data.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={`${import.meta.env.VITE_API_URL}${
                          data.profile_pic
                        }`}
                      />
                    </div>
                  </td>
                  <td className="font-semibold">
                    {data.first_name + " " + data.last_name}
                  </td>
                  <td>{extractTimeFromDateTimeString(data.check_in) ?? "-"}</td>
                  <td>
                    {extractTimeFromDateTimeString(data.check_out) ?? "-"}
                  </td>
                  <td>{data.email}</td>
                  <td
                    className={`badge badge-soft my-3 ${
                      attendance.toLowerCase() === "present"
                        ? " badge-primary"
                        : " badge-secondary"
                    }`}
                  >
                    {data.attendance_status}
                  </td>
                  <td>
                    {data.check_in
                      ? Math.trunc(
                          (new Date(data.check_out) - new Date(data.check_in)) /
                            1000 /
                            3600,
                        )
                      : "-"}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {/* {toast !== "" ? (
        <div className="toast toast-top toast-end">
          <div className="alert alert-success">
            <span>{toast}</span>
          </div>
        </div>
      ) : null} */}

      {/* {editData && (
        <EditEmployeeModal
          editData={editData}
          onClose={() => setEditData(null)}
          getEmployee={getEmployee}
          setToast={setToast}
        />
      )} */}
    </>
  );
}

export default AdminAttendanceToday;
