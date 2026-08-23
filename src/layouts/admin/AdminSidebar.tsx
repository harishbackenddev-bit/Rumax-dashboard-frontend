// layouts/admin/AdminSidebar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard,
  Users,
  Briefcase,
  ChartColumn,
  UserCog,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  X
} from "lucide-react";
import Logo from "@/assets/home/logo.png";

interface AdminSidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  onClose?: () => void;
  adminName?: string;
  adminEmail?: string;
  adminInitials?: string;
  isMobile?: boolean;
}

const AdminSidebar = ({ 
  isOpen = true,
  onToggle,
  onClose,
  adminName = "Admin Tino",
  adminEmail = "admin@email.com",
  adminInitials = "AT",
  isMobile = false
}: AdminSidebarProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(isOpen);

  // Handle window resize for mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && isSidebarOpen) {
        setIsSidebarOpen(false);
        if (onClose) onClose();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isSidebarOpen, onClose]);

const isActive = (path: string) => {
    // Dashboard (/user) should only be active when exactly on /user
    if (path === "/admin") {
      return location.pathname === "/admin";
    }
    // For other paths, check exact match or children
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };
 

  const sidebarItems = [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "All Candidates", path: "/admin/candidates", icon: Users },
    { title: "Post Job", path: "/admin/jobs", icon: Briefcase },
    { title: "Standby Applicants", path: "/admin/standby", icon: Users },
    { title: "Reports & Analytics", path: "/admin/analytics", icon: ChartColumn },
    { title: "User Management", path: "/admin/user-management", icon: UserCog },
    { title: "Settings", path: "/admin/settings", icon: Settings },
  ];

  const getItemStyle = (active: boolean) => {
    return {
      padding: '9px 11px',
      background: active ? 'rgb(96, 27, 128)' : 'transparent',
      color: active ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
      fontSize: '13px',
      fontWeight: active ? 700 : 500,
      cursor: 'pointer',
      borderWidth: 'medium',
      borderStyle: 'none',
      borderColor: 'currentcolor',
      borderImage: 'none',
      textAlign: 'left' as const,
      boxShadow: 'none',
      transition: '0.18s',
    };
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex lg:flex-col fixed left-0 top-0 bottom-0 z-30 transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{ 
          width: isOpen ? '241px' : '72px',
          background: 'rgb(255, 255, 255)',
          borderRight: '1px solid rgb(238, 241, 251)',
        }}
      >
        {/* Logo */}
        <div 
          className="flex items-center justify-center px-4 py-4"
          style={{ borderBottom: '1px solid rgb(238, 241, 251)' }}
        >
          <Link to="/admin" className="flex items-center justify-center">
            {isOpen ? (
              <img 
                src={Logo} 
                alt="Rumax" 
                style={{ height: '52px', width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <div className="flex items-center justify-center" style={{ width: '40px', height: '40px' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgb(96, 27, 128)' }}>
                  <span className="text-white font-bold text-sm">R</span>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pt-4 pb-2 overflow-y-auto space-y-0.5">
          {sidebarItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 w-full rounded-xl transition-all group"
                style={getItemStyle(active)}
                onClick={() => {
                  if (window.innerWidth < 1024 && onClose) {
                    onClose();
                  }
                }}
              >
                <span 
                  className="flex items-center justify-center rounded-lg shrink-0"
                  style={{ 
                    width: '30px', 
                    height: '30px', 
                    background: active ? 'rgba(255, 255, 255, 0.15)' : 'rgb(244, 246, 252)',
                    transition: 'background 0.18s'
                  }}
                >
                  {Icon && (
                    <Icon 
                      size={15} 
                      stroke={active ? '#FFFFFF' : '#7B8299'}
                      strokeWidth={active ? 2.2 : 1.8}
                    />
                  )}
                </span>
                
                {isOpen && (
                  <span className="flex-1">
                    {item.title}
                  </span>
                )}

                {isOpen && active && (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="13" 
                    height="13" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.5)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="m9 18 6-6-6-6"></path>
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Help Center */}
        {isOpen && (
          <div className="mx-3 mb-3 rounded-2xl p-4 relative overflow-hidden" style={{ background: 'rgb(96, 27, 128)' }}>
            <div style={{ 
              position: 'absolute', 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.06)', 
              top: '-20px', 
              right: '-20px' 
            }}></div>
            <div style={{ 
              position: 'absolute', 
              width: '50px', 
              height: '50px', 
              borderRadius: '50%', 
              background: 'rgba(255, 255, 255, 0.05)', 
              bottom: '-10px', 
              left: '10px' 
            }}></div>
            <div className="relative">
              <div 
                className="flex items-center justify-center rounded-xl mb-3"
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  background: 'rgba(255, 255, 255, 0.18)', 
                  backdropFilter: 'blur(4px)' 
                }}
              >
                <HelpCircle size={17} stroke="#fff" strokeWidth={2} />
              </div>
              <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'rgb(255, 255, 255)', marginBottom: '3px' }}>
                Need Help?
              </p>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '12px', fontWeight: 400, lineHeight: 1.5 }}>
                Contact our support team
              </p>
              <Link to="/admin/help">
                <button 
                  className="w-full py-2 rounded-xl"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)', 
                    color: 'rgb(255, 255, 255)', 
                    fontSize: '12px', 
                    fontWeight: 700, 
                    cursor: 'pointer', 
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(4px)'
                  }}
                >
                  Support
                </button>
              </Link>
            </div>
          </div>
        )}

        {/* Sign Out Button */}
        <button 
          className={`flex items-center gap-2.5 mx-3 mb-5 px-3 py-2.5 rounded-xl transition-colors ${!isOpen && 'justify-center'}`}
          style={{ 
            background: 'rgb(255, 241, 241)', 
            borderWidth: 'medium', 
            borderStyle: 'none', 
            borderColor: 'currentcolor', 
            borderImage: 'none', 
            cursor: 'pointer', 
            color: 'rgb(239, 68, 68)', 
            fontSize: isOpen ? '13px' : '0', 
            fontWeight: 600 
          }}
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('candidateId');
            window.location.href = '/login';
          }}
        >
          <LogOut size={15} stroke="currentColor" strokeWidth={2} />
          {isOpen && <span>Sign Out</span>}
        </button>

        {/* Toggle Button */}
        <button 
          onClick={onToggle}
          className="top15 hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all z-40"
          style={{ 
            background: 'rgb(96, 27, 128)',
            border: '2px solid white',
          }}
        >
          {isOpen ? (
            <ChevronLeft className="w-3.5 h-3.5 text-white" />
          ) : (
            <ChevronRight className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        {/* Sidebar Content */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl transition-transform duration-300 flex flex-col ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 flex-shrink-0">
            <img 
              src={Logo} 
              alt="Rumax" 
              style={{ height: '40px', width: 'auto', objectFit: 'contain' }}
            />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Mobile Navigation - Fixed with flex-1 and overflow-y-auto */}
          <nav className="flex-1 px-3 pt-4 pb-2 overflow-y-auto space-y-0.5">
            {sidebarItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 w-full rounded-xl transition-all group px-3 py-3"
                  style={{
                    background: active ? 'rgb(96, 27, 128)' : 'transparent',
                    color: active ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
                  }}
                  onClick={onClose}
                >
                  <span 
                    className="flex items-center justify-center rounded-lg shrink-0"
                    style={{ 
                      width: '36px', 
                      height: '36px', 
                      background: active ? 'rgba(255, 255, 255, 0.15)' : 'rgb(244, 246, 252)',
                    }}
                  >
                    {Icon && (
                      <Icon 
                        size={18} 
                        stroke={active ? '#FFFFFF' : '#7B8299'}
                        strokeWidth={active ? 2.2 : 1.8}
                      />
                    )}
                  </span>
                  <span className="flex-1 text-sm font-medium">{item.title}</span>
                  {active && (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="13" 
                      height="13" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.5)" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Footer */}
          <div className="border-t border-gray-200 p-4 flex-shrink-0">
            <button 
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('candidateId');
                window.location.href = '/login';
              }}
            >
              <LogOut size={18} stroke="currentColor" strokeWidth={2} />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;