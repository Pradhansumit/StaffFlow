import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { MdFileDownload } from "react-icons/md";
import api from "../config/api";
import URLS from "../utils/urls";
import AddHolidayModal from "./AddHolidayModal";
import exportToCSV from "../utils/exportToCSV";
import EditHolidayModal from "./EditHolidayModal";

const formatDate = (date) => {
  let dt = new Date(date);
  return `${dt.getDate()}-${
    dt.getMonth() < 10 ? "0" + dt.getMonth() : dt.getMonth()
  }-${dt.getFullYear()}`;
};

function HolidayList() {
  const [holidays, setHolidays] = useState([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState([]);

  const getHolidays = async () => {
    try {
      const res = await api.get(URLS.holidayList, {});
      if (res.status === 200) {
        setHolidays(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.post(URLS.holidayDelete, { id: id });
      console.log(res.status, typeof res.status);
      if (res.status === "200" || res.status === 200) {
        setToast("Holiday deleted successfully.");
        getHolidays();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHolidays();
  }, []);

  useEffect(() => {
    if (toast !== "") {
      const timer = setTimeout(() => {
        setToast("");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  return loading ? (
    <span className="loading loading-spinner loading-xl"></span>
  ) : (
    <>
      <div className="overflow-x-auto">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="/holiday-list">Holiday List</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between bg-blue-50 p-3 mb-3 rounded-xl shadow">
        <div className="flex items-center gap-3">
          <p className="text-lg font-semibold">Holidays</p>
          <label className="input">
            <FaSearch className="text-lg" color="gray" />
            <input
              type="search"
              className="grow"
              placeholder="Search"
              // onChange={(e) => setSearch(e.target.value)}
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
          <AddHolidayModal getHolidays={getHolidays} setToast={setToast} />

          <button
            className="btn btn-sm btn-circle btn-secondary text-blue-500"
            title="Download"
            onClick={() => exportToCSV(holidays)}
          >
            <MdFileDownload className="text-2xl" color="white" />
          </button>
        </div>
      </div>

      <div className="overflow-auto max-w-full">
        <table className="table bg-white min-w-md">
          <thead>
            <tr>
              <th>
                <label>
                  <input type="checkbox" className="checkbox" />
                </label>
              </th>
              <th>Holiday Name</th>
              <th>Description</th>
              <th>Date</th>
              <th>Creation Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday) => (
              <tr key={holiday.id}>
                <th>
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </th>
                <td className="font-semibold">{holiday.name}</td>
                <td>{holiday.description}</td>
                <td>{formatDate(holiday.date)}</td>
                <td>{formatDate(holiday.creation_date)}</td>
                <td className="flex items-center gap-3 text-xl cursor-pointer">
                  <FaTrash
                    color="red"
                    onClick={() => handleDelete(holiday.id)}
                  />
                  <FaEdit
                    color="green"
                    onClick={() => {
                      document.getElementById("edit_modal").showModal();
                      setEditData(holiday);
                    }}
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

      {
        <EditHolidayModal
          getHolidays={getHolidays}
          editData={editData}
          setToast={setToast}
        />
      }
    </>
  );
}

export default HolidayList;
