// Import icons
import {
  FaUsers,
  FaCalendarCheck,
  FaMoneyBill,
  FaTools,
  FaFileInvoiceDollar,
  FaEnvelopeOpenText,
} from "react-icons/fa";

export const SIDEBAR_LINKS = {
  admin: [
    { label: "Employees", to: "/employees", icon: FaUsers },
    { label: "Attendance", to: "/attendance", icon: FaCalendarCheck },
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
