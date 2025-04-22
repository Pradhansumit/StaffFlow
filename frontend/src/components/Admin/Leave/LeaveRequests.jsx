import { useState, useEffect } from "react";
import exportToCSV from "../../../utils/exportToCSV";
import { FaSearch } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import api from "../../../config/api";
import URLS from "../../../utils/urls";
import LeaveModal from "./LeaveModal";

function LeaveRequests() {
  const [search, setSearch] = useState("");
  const [apiData, setApiData] = useState([]);
  const [toast, setToast] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get(URLS.leaveRequestList);
      setApiData(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (toast !== "") {
      const timer = setTimeout(() => {
        setToast("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return isLoading ? (
    <span className="loading loading-spinner loading-xl"></span>
  ) : (
    <>
      {apiData && console.log(apiData)}
      <div className="overflow-x-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/attendance-today">Leave Requests</a>
            </li>
          </ul>
        </div>

        <div className="flex items-center justify-between bg-blue-50 p-3 mb-3 rounded-xl shadow">
          <div className="flex items-center gap-3">
            <p className="text-lg font-semibold w-full">Leave Requests</p>
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
              <th>Employee Name</th>
              <th>Department</th>
              <th>Leave Type</th>
              <th>Leave From</th>
              <th>Leave To</th>
              <th>Duration</th>
              <th>Duration Types</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {apiData
              .filter((data) => data.employee.toLowerCase().includes(search))
              .map((data) => (
                <tr key={data.id}>
                  <th>
                    <label>
                      <input type="checkbox" className="checkbox" />
                    </label>
                  </th>
                  <td className="font-semibold">{data.employee}</td>
                  <td>{data.department}</td>
                  <td>{data.leave_type}</td>
                  <td>{new Date(data.from_date).toDateString()}</td>
                  <td>{new Date(data.to_date).toDateString()}</td>
                  <td>{data.duration}</td>
                  <td>
                    {data.unit === 1
                      ? `${data.duration > 1 ? "days" : "day"}`
                      : `${data.duration > 1 ? "hours" : "hour"}`}
                  </td>

                  <td className="flex items-center">
                    <button
                      className={`badge font-semibold text-white ${
                        data.status === 0
                          ? "badge-success"
                          : data.status === 1
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                      onClick={() => {
                        document.getElementById("my_modal_1").showModal();
                      }}
                    >
                      {data.status === 0
                        ? "Approved"
                        : data.status === 1
                        ? "Pending"
                        : "Rejected"}
                    </button>
                    <LeaveModal
                      leave={data}
                      fetchData={fetchData}
                      setToast={setToast}
                    />
                  </td>
                </tr>
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
    </>
  );
}

export default LeaveRequests;
