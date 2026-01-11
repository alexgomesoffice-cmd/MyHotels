import React from "react";
import { Outlet } from "react-router-dom";
import ManagerNavbar from "./ManagerNavbar";
import ManagerSidebar from "./ManagerSidebar";

const ManagerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ManagerSidebar />
      <div className="flex-1 flex flex-col">
        <ManagerNavbar />
        <main className="p-5 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;
