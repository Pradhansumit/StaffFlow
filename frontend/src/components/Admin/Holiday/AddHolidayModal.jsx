import { useRef } from "react";
import api from "../../../config/api";
import URLS from "../../../utils/urls";

export default function AddHolidayModal({ getHolidays, setToast }) {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const res = await api.post(URLS.holidayAdd, formData);
      if (res.status === 201 || res.status === "201") {
        formRef.current.reset();
        document.getElementById("my_modal_5").close();
        getHolidays();
        setToast("Holiday added successfully.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-2xl">
          <h3 className="font-bold text-xl mb-4">Add New Holiday</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* First Name */}
            <div>
              <label className="label">Holiday Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                name="name"
                required
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                name="date"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                name="description"
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="modal-action md:col-span-2 flex justify-end mt-4 gap-2">
              <button type="submit" className="btn btn-primary">
                Save
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => document.getElementById("my_modal_5").close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
