// It contains all the urls required for frontend to call the backend.

const URLS = {
  authLogin: "auth/login/",
  authLogout: "auth/ll/",
  authRefresh: "auth/refresh/",
  listUsers: "auth/user/all",
  addEmployee: "auth/employee/add",
  deleteEmployee: "auth/user/delete",
  updateUser: "auth/user/update",

  // for attendance
  todayAttendance: "attendance/admin/view-today-report/",

  // for holidays
  holidayList: "holiday/view/",
  holidayDelete: "holiday/delete/",
  holidayAdd: "holiday/add/",
};
export default URLS;
