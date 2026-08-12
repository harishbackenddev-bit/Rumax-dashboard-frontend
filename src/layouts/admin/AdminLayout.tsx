// layouts/admin/AdminLayout.tsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Get user initials
  const getInitials = (name: string) => {
    if (!name) return "A";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  // Apply admin theme if needed
  useEffect(() => {
    // Any admin-specific initialization
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{
      background: 'rgb(240, 242, 249)'
    }}>
      <AdminSidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        onClose={closeSidebar}
        adminName={user?.name || "Admin Tino"}
        adminEmail={user?.email || "admin@email.com"}
        adminInitials={getInitials(user?.name || "Admin Tino")}
      />
      
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminHeader
          onMenuClick={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
          adminName={user?.name || "Admin Tino"}
          adminEmail={user?.email || "admin@email.com"}
          adminInitials={getInitials(user?.name || "Admin Tino")}
          adminRole={user?.role || "Administrator"}
        />

        <main 
          className={`flex-1 overflow-y-auto transition-all duration-300 pt-16`}
          style={{
            marginLeft: isSidebarOpen ? '232px' : '0px',
            background: 'rgb(240, 242, 249)'
          }}
        >
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;