export default function Header() {
  const handleLogout = () => {
    localStorage.clear(); // or just remove tokens
    window.location.href = "/login"; // or use react-router's navigate
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold">Welcome, Admin</h2>

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
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
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
