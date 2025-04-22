import { useRef } from "react";
import api from "../../../config/api";
import URLS from "../../../utils/urls";
// import { toast } from "react-hot-toast";

export default function AddEmployeeModal({ getEmployee, setToast }) {
  const formRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);

    try {
      const res = await api.post(URLS.addEmployee, formData);
      if (res.status === 201 || res.status === "201") {
        document.getElementById("my_modal_5").close();
        getEmployee();
        setToast("User added successfully.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box w-full max-w-2xl">
        <h3 className="font-bold text-xl mb-4">Add New Employee</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* First Name */}
          <div>
            <label className="label">First Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="first_name"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="label">Last Name</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="last_name"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label className="label">Gender</label>
            <select
              className="select select-bordered w-full"
              name="gender"
              defaultValue="0"
            >
              <option value="0">Male</option>
              <option value="1">Female</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="label">Role</label>
            <select
              className="select select-bordered w-full"
              name="role"
              defaultValue="0"
              required
            >
              <option value="0">Employee</option>
              <option value="1">Admin</option>
            </select>
          </div>

          {/* Mobile */}
          <div>
            <label className="label">Mobile</label>
            <input
              type="tel"
              className="input input-bordered w-full"
              name="mobile"
              pattern="^(\+91[\-\s]?)?[6-9]\d{9}$"
              title="Enter a valid Indian mobile number. Example: +91 9876543210 or 9876543210"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input input-bordered w-full"
              name="email"
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="label">Date of Birth</label>
            <input
              type="date"
              className="input input-bordered w-full"
              name="date_of_birth"
            />
          </div>

          {/* Designation */}
          <div>
            <label className="label">Designation</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="designation"
            />
          </div>

          {/* Department */}
          <div>
            <label className="label">Department</label>
            <input
              type="text"
              className="input input-bordered w-full"
              name="department"
            />
          </div>

          {/* Education */}
          <div className="md:col-span-2">
            <label className="label">Education</label>
            <textarea
              className="textarea textarea-bordered w-full"
              name="education"
            ></textarea>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="label">Address</label>
            <textarea
              className="textarea textarea-bordered w-full"
              name="address"
            ></textarea>
          </div>

          {/* Profile Picture
          <div className="md:col-span-2">
            <label className="label">Profile Picture</label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              name="profile_pic"
              accept="image/*"
            />
          </div> */}

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
  );
}
