export default function exportToCSV(data, filename = "export.csv") {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers.map((field) => JSON.stringify(row[field] ?? "")).join(","),
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
