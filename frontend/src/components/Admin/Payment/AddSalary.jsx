import React, {useEffect, useState} from "react";
import api from "../../../config/api";
import {FaRupeeSign, FaSearch} from "react-icons/fa";
import {FaPlus} from "react-icons/fa6";
import {MdFileDownload} from "react-icons/md";
import exportToCSV from "../../../utils/exportToCSV";
import AddSalaryModal from "./AddSalaryModal";
import URLS from "../../../utils/urls";
import Breadcrumb from "../../UI/Breadcrumb.jsx";

export default function AddSalary() {
    const [isLoading, setIsLoading] = useState(true);
    const [apiData, setApiData] = useState([]);
    const [search, setSearch] = useState("");
    const [employees, setEmployees] = useState([]);

    const fetchData = async () => {
        try {
            const salaryRes = await api.get(URLS.baseSalaryList);
            const userRes = await api.post(URLS.listUsers, {user: 0});

            if (salaryRes.status === 200 && userRes.status === 200) {
                const salaryData = salaryRes.data;
                console.log("Salary Data:", salaryData);
                setApiData(salaryData);

                const paidEmails = new Set(
                    salaryData.map((item) => item.email),
                );
                const unpaidUsers = userRes.data
                    .filter((user) => !paidEmails.has(user.email))
                    .map((user) => ({
                        name: `${user.first_name} ${user.last_name}`,
                        uuid: user.id,
                    }));
                console.log("Unpaid Users:", unpaidUsers);
                setEmployees(unpaidUsers);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);
    return isLoading ? (
        <span className="loading loading-spinner loading-xl"></span>
    ) : (
        <>
            <div className="overflow-x-auto">
                <Breadcrumb title={"Add Salary"} link={"add-salary"}/>

                <div className="flex items-center justify-between bg-blue-50 p-3 mb-3 rounded-xl shadow">
                    <div className="flex items-center gap-3">
                        <p className="text-lg font-semibold">Employees</p>
                        <label className="input">
                            <FaSearch className="text-lg" color="gray"/>
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
                            onClick={() =>
                                document
                                    .getElementById("my_modal_5")
                                    .showModal()
                            }
                        >
                            <FaPlus className="text-2xl"/>
                        </button>
                        <button
                            className="btn btn-sm btn-circle btn-secondary text-blue-500"
                            title="Download"
                            onClick={() => exportToCSV(apiData)}
                        >
                            <MdFileDownload
                                className="text-2xl"
                                color="white"
                            />
                        </button>
                    </div>
                </div>
                <table className="table bg-white">
                    {/* head */}
                    <thead>
                    <tr>
                        <th>
                            <label>
                                <input
                                    type="checkbox"
                                    className="checkbox"
                                />
                            </label>
                        </th>
                        <th>name</th>
                        <th>email</th>
                        <th>department</th>
                        <th>amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {apiData
                        .filter(
                            (data) =>
                                data.name?.toLowerCase().includes(search) ||
                                data.email?.toLowerCase().includes(search),
                        )
                        .map((data) => (
                            <tr key={data.id}>
                                <th>
                                    <label>
                                        <input
                                            type="checkbox"
                                            className="checkbox"
                                        />
                                    </label>
                                </th>
                                <th className="flex items-center gap-2">
                                    {
                                        <div className="avatar">
                                            <div className="w-12 rounded-full">
                                                <img
                                                    src={`${
                                                        import.meta.env
                                                            .VITE_API_URL
                                                    }${data.profile_pic}`}
                                                />
                                            </div>
                                        </div>
                                    }
                                    {data.name}
                                </th>
                                <td>{data.email}</td>
                                <td>{data.department}</td>
                                <td className="">
                                    <FaRupeeSign
                                        color="green"
                                        className="text-lg inline"
                                    />
                                    {data.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AddSalaryModal getEmployee={employees} refreshData={fetchData()}/>
        </>
    );
}
