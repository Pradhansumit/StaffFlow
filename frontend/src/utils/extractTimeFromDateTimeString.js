export default function extractTimeFromDateTimeString(datetime) {
  if (!datetime) {
    return;
  }
  let dt = new Date(datetime);
  return dt.toLocaleTimeString(undefined, { timeZone: "Asia/Kolkata" });
}
