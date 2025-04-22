import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import api from "../../../config/api";
import URLS from "../../../utils/urls";

function LeaveModal({ leave, fetchData, setToast }) {
  const [status, setStatus] = useState(1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(URLS.leaveRequestApprove, {
        id: leave.id,
        status: status,
      });
      if (res.status === 200) {
        document.getElementById("my_modal_1").close();
        fetchData();
        setToast("Request Changed.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <dialog id="my_modal_1" className="modal">
      {console.log(leave.id)}
      <div className="modal-box">
        <div className="flex justify-between">
          <h5 className="font-bold">Leave Details</h5>
          <span
            className="cursor-pointer"
            onClick={() => document.getElementById("my_modal_1").close()}
          >
            <MdClose className="font-bold text-2xl" />
          </span>
        </div>
        <div className="divider mt-0"></div>
        <div className="">
          <p className="my-4">
            <span className="font-semibold">Reason:</span> {leave.leave_type}
          </p>

          <p className="my-1.5">Employee: {leave.employee}</p>
          <p className="my-1.5">Department: {leave.department}</p>
          <p className="my-1.5">
            Leave From: {new Date(leave.from_date).toDateString()}
          </p>
          <p className="my-1.5">
            Leave To: {new Date(leave.to_date).toDateString()}
          </p>
          <p className="my-1.5">Duration: {leave.duration}</p>
          <p className="my-1.5">
            Duration Type:{" "}
            {leave.unit === 1
              ? `${leave.duration > 1 ? "days" : "day"}`
              : `${leave.duration > 1 ? "hours" : "hour"}`}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="my-3.5 flex justify-start items-center gap-3">
              {leave.status === 0 ? (
                <>
                  <button
                    className="btn btn-error"
                    onClick={() => setStatus(2)}
                  >
                    Reject
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => setStatus(0)}
                  >
                    Accept
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={() => setStatus(2)}
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default LeaveModal;
