import { Link } from "react-router";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { useState } from "react";
import { SIDEBAR_LINKS } from "../../utils/sidebarLinks.js";

// Icons
import { FaUsers, FaCalendarCheck, FaMoneyBill, FaBars } from "react-icons/fa";

export default function Sidebar() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const roleKey = user.role === 1 ? "admin" : "employee";
  const links = SIDEBAR_LINKS[roleKey];

  return (
    <div
      className={`bg-gray-900 text-white h-screen transition-all duration-300 flex flex-col ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Toggle Button */}
      <div
        className={`flex items-center px-4 py-4 border-b border-gray-800 ${
          isOpen ? "justify-start" : "justify-center"
        }`}
      >
        <button
          onClick={toggleSidebar}
          className="flex items-center gap-4 text-white text-xl focus:outline-none cursor-pointer"
        >
          <FaBars />
          {isOpen && (
            <span className="text-base">
              {user.role === 1 ? "Admin" : "Employee"}
            </span>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="mt-4 flex flex-col gap-1">
        {links.map((link) => {
          const Icon = link.icon;
          const linkContent = (
            <Link
              key={link.label}
              to={link.to}
              className={`flex items-center p-3 hover:bg-gray-700 transition-colors duration-200 ${
                isOpen ? "justify-start gap-4 px-4" : "justify-center"
              }`}
            >
              <Icon className="text-xl" />
              {isOpen && <span className="text-base">{link.label}</span>}
            </Link>
          );

          return !isOpen ? (
            <div
              key={link.label}
              className="tooltip tooltip-right"
              data-tip={link.label}
            >
              {linkContent}
            </div>
          ) : (
            <div key={link.label}>{linkContent}</div>
          );
        })}
      </nav>
    </div>
  );
}
