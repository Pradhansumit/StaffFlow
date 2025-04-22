import Header from "../components/Base/Header";
import Sidebar from "../components/Base/Sidebar";
import { Outlet } from "react-router";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-4 container">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
