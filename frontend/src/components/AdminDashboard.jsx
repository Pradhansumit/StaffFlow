function StatCard({ label, value }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h4 className="text-gray-600">{label}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Users" value="1320" />
        <StatCard label="Sales" value="$9,430" />
        <StatCard label="Orders" value="214" />
        <StatCard label="Revenue" value="$12,304" />
      </div>
    </>
  );
}
