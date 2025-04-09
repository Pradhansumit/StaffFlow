import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function Header() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>

      {/* Avatar Dropdown */}
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-12 rounded-full">
            <img
              alt="Profile"
              src={`${import.meta.env.VITE_API_URL}${user.profile_pic}`}
            />
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">Profile</a>
          </li>
          <li>
            <a onClick={handleLogout} className="text-red-500">
              Logout
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
