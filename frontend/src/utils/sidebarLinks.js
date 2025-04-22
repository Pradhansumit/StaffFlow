// Import icons
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBill,
  FaTools,
  FaFileInvoiceDollar,
  FaEnvelopeOpenText,
  FaCalendarAlt,
  FaPlane,
} from "react-icons/fa";

import { FaCodePullRequest } from "react-icons/fa6";

export const SIDEBAR_LINKS = {
  admin: [
    { label: "Employees", to: "/employees", icon: FaUsers },
    {
      label: "Attendance Sheet",
      to: "/attendance-sheet",
      icon: FaCalendarAlt,
    },
    {
      label: "Attendance Today",
      to: "/attendance-today",
      icon: FaCalendarCheck,
    },
    { label: "Holiday List", to: "/holiday-list", icon: FaPlane },
    { label: "Leave Requests", to: "/leave-requests", icon: FaCodePullRequest },
    { label: "Payroll", to: "/payroll", icon: FaMoneyBill },
    { label: "Admin Panel", to: "/admin-panel", icon: FaTools },
  ],
  employee: [
    { label: "My Attendance", to: "/attendance", icon: FaCalendarCheck },
    { label: "My Payslips", to: "/payslips", icon: FaFileInvoiceDollar },
    {
      label: "Leave Requests",
      to: "/leave-requests",
      icon: FaEnvelopeOpenText,
    },
  ],
};
