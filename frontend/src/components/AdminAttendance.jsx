import { FaCheckCircle } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";

function AdminAttendance() {
  const time = new Date();
  const dates = [];
  for (let i = 1; i < 31; i++) {
    dates.push(i);
  }

  return (
    <>
      <div className="overflow-x-auto max-w-fit">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/attendance">Attendance</a>
            </li>
          </ul>
        </div>
      </div>

      <div className=" bg-white p-3 my-3 rounded-xl shadow ">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold mb-4">Attendance Sheet</p>
          <div className="flex justify-end items-end gap-2 text-xl">
            <FaCheckCircle color="green" />
            <FaStar color="#ffc508" />
            <FaMinusCircle color="gray" />
            <RxCrossCircled color="red" />
          </div>
        </div>
        <div className="flex justify-start gap-4">
          <div className="flex items-center">
            <label className="label">Select Month</label>
            <select
              className="select select-bordered w-full"
              name="gender"
              defaultValue="0"
            >
              <option value="0">{time.getMonth() - 2}</option>
              <option value="1">{time.getMonth() - 1}</option>
              <option value="2">{time.getMonth()}</option>
              <option value="3">{time.getMonth() + 1}</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="label">Select Year</label>
            <select
              className="select select-bordered w-full"
              name="gender"
              defaultValue="0"
            >
              <option value="0">{time.getFullYear()}</option>
            </select>
          </div>
          <button className="btn">Search</button>
        </div>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Employee</th>
                {dates.map((date) => (
                  <th key={date}>{date}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Sumit Pradhan</td>
                <td className="text-lg">
                  <FaCheckCircle color="green" />
                </td>
                <td className="text-lg">
                  <FaStar color="#ffc508" />
                </td>
                <td className="text-lg">
                  <FaMinusCircle color="gray" />
                </td>
                <td className="text-lg">
                  <RxCrossCircled color="red" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default AdminAttendance;
