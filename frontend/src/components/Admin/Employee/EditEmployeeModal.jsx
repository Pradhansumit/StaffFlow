import { useRef } from "react";
import URLS from "../../../utils/urls";
import api from "../../../config/api";

export default function EditEmployeeModal({
  editData,
  onClose,
  getEmployee,
  setToast,
}) {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    formData.append("id", editData.id); // Add ID to update the specific user

    try {
      const res = await api.post(URLS.updateUser, formData);
      if (res.status === 200) {
        document.getElementById("edit_modal").close();
        getEmployee();
        onClose();
        setToast("User data updated successfully.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <dialog id="edit_modal" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-2xl">
        <h3 className="font-bold text-xl mb-4">Edit Employee</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <label className="label">First Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="first_name"
              defaultValue={editData?.first_name}
              required
            />
          </div>

          <div>
            <label className="label">Last Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="last_name"
              defaultValue={editData?.last_name}
              required
            />
          </div>

          <div>
            <label className="label">Gender</label>
            <select
              className="select select-bordered w-full"
              name="gender"
              defaultValue={editData?.gender}
            >
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

          <div>
            <label className="label">Role</label>
            <select
              className="select select-bordered w-full"
              name="role"
              defaultValue={editData?.role}
              required
            >
              <option value="0">Employee</option>
              <option value="1">Admin</option>
            </select>
          </div>

          <div>
            <label className="label">Mobile</label>
            <input
              type="tel"
              className="input input-bordered w-full"
              name="mobile"
              pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
              defaultValue={editData?.mobile}
              required
            />
          </div>

          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              name="email"
              defaultValue={editData?.email}
              required
            />
          </div>

          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              className="input input-bordered w-full"
              name="date_of_birth"
              defaultValue={editData?.date_of_birth}
            />
          </div>

          <div>
            <label className="label">Designation</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="designation"
              defaultValue={editData?.designation}
            />
          </div>

          <div>
            <label className="label">Department</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="department"
              defaultValue={editData?.department}
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Education</label>
            <textarea
              className="textarea textarea-bordered w-full"
              name="education"
              defaultValue={editData?.education}
            ></textarea>
          </div>

          <div className="md:col-span-2">
            <label className="label">Address</label>
            <textarea
              className="textarea textarea-bordered w-full"
              name="address"
              defaultValue={editData?.address}
            ></textarea>
          </div>

          {/* Profile Pic (optional) */}
          {/* <div className="md:col-span-2">
            <label className="label">Profile Picture</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              name="profile_pic"
              accept="image/*"
            />
          </div> */}

          <div className="modal-action md:col-span-2 flex justify-end mt-4 gap-2">
            <button type="submit" className="btn btn-primary">
              Update
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
  );
}
