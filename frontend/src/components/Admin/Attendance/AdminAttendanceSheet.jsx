import {useEffect, useState} from "react";
import {FaCheckCircle, FaMinusCircle, FaStar} from "react-icons/fa";
import {RxCrossCircled} from "react-icons/rx";
import api from "../../../config/api";
import Breadcrumb from "../../UI/Breadcrumb.jsx";

function AdminAttendanceSheet() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const time = new Date();
    const current_month = time.getMonth() + 1;
    const current_year = time.getFullYear();

    const [month, setMonth] = useState(current_month);
    const [year, setYear] = useState(current_year);

    const getMonthAttendance = async () => {
        try {
            const res = await api.post("attendance/admin/view-month-report/", {
                month: month,
                year: year,
            });
            if (res.status === 200) {
                setData(res.data);
            }
        } catch (error) {
            console.log("Error", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMonthAttendance();
    }, []);

    return loading ? (
        <span className="loading loading-spinner loading-xl"></span>
    ) : (
        <>
            <Breadcrumb title={"Attendance"} link={"attendance-sheet"}/>

            <div className="bg-white p-3 my-3 rounded-xl shadow w-full">
                <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold mb-4">Attendance Sheet</p>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1">
                            <FaCheckCircle className="text-lg" color="green"/>
                            <span>Present</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <RxCrossCircled className="text-lg" color="red"/>
                            <span>Absent</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaStar className="text-lg" color="#ffc508"/>
                            <span>Holiday</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <FaMinusCircle className="text-lg" color="gray"/>
                            <span>Weekend</span>
                        </div>
                    </div>
                </div>
                <div className="flex justify-start gap-4">
                    <div className="flex items-center">
                        <label className="label">Select Month</label>
                        <select
                            className="select select-bordered w-full"
                            name="gender"
                            defaultValue={current_month}
                            onChange={(e) => {
                                setMonth(parseInt(e.target.value));
                            }}
                        >
                            {months.map((month) => (
                                <option key={month} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
                        <label className="label">Select Year</label>
                        <select
                            className="select select-bordered w-full"
                            name="gender"
                            defaultValue={current_year}
                            onChange={(e) => {
                                setYear(parseInt(e.target.value));
                            }}
                        >
                            <option value={time.getFullYear()}>{time.getFullYear()}</option>
                        </select>
                    </div>
                    <button className="btn" onClick={getMonthAttendance}>
                        Search
                    </button>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="table table-compact w-full">
                        <thead>
                        <tr>
                            <th>Employee</th>
                            {data[0]?.daily_attendance?.map((date) => {
                                let dt = new Date(date.date);
                                return <th key={dt.getDate()} className="text-center px-2">{dt.getDate()}</th>;
                            })}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((employee) => (
                            <tr key={employee.id}>
                                <td className="font-semibold">{employee.name}</td>
                                {employee.daily_attendance.map((att, index) => (
                                    <td key={index} className="text-center px-2">
                                        {att.status.toLowerCase() === "present" ? (
                                            <FaCheckCircle color="green"/>
                                        ) : att.status.toLowerCase() === "weekend" ? (
                                            <FaMinusCircle color="gray"/>
                                        ) : att.status.toLowerCase() === "holiday" ? (
                                            <FaStar color="#ffc508"/>
                                        ) : (
                                            <RxCrossCircled color="red"/>
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default AdminAttendanceSheet;