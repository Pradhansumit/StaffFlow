import { useRef } from "react";
import api from "../../../config/api";
import URLS from "../../../utils/urls";

export default function EditHolidayModal({ editData, getHolidays, setToast }) {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    formData.append("id", editData.id); // Add ID to update the specific user

    try {
      const res = await api.post(URLS.holidayUpdate, formData);
      if (res.status === 200) {
        formRef.current.reset();
        document.getElementById("edit_modal").close();
        getHolidays();
        setToast("Holiday updated successfully.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {console.log(editData)}
      <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box w-full max-w-2xl">
          <h3 className="font-bold text-xl mb-4">Edit Holiday</h3>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* holiday Name */}
            <div>
              <label className="label">Holiday Name</label>
              <input
                type="text"
                className="input input-bordered w-full"
                name="name"
                defaultValue={editData?.name}
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                className="input input-bordered w-full"
                name="date"
                defaultValue={editData?.date}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <textarea
                className="textarea textarea-bordered w-full"
                defaultValue={editData?.description}
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
                onClick={() => document.getElementById("edit_modal").close()}
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
