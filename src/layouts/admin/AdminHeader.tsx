// layouts/admin/AdminHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Settings, 
  HelpCircle,
  ChevronDown,
  Clock,
  Users,
  FileText,
  CreditCard,
  Settings2,
  LogOut as LogOutIcon,
  Command
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

interface AdminHeaderProps {
  onMenuClick?: () => void;
  isSidebarOpen?: boolean;
  adminName?: string;
  adminEmail?: string;
  adminInitials?: string;
  adminRole?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  initials?: string;
}

const AdminHeader = ({ 
  onMenuClick, 
  isSidebarOpen = true,
  adminName = "Admin Tino",
  adminEmail = "admin@email.com",
  adminInitials = "AT",
  adminRole = "Administrator"
}: AdminHeaderProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // User state
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: adminName,
    email: adminEmail,
    role: adminRole,
    initials: adminInitials
  });
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success && response.data.data) {
          const data = response.data.data;
          
          // Generate initials from name
          const nameParts = data.name?.split(' ') || ['A'];
          const initials = nameParts
            .map((part: string) => part.charAt(0).toUpperCase())
            .join('')
            .slice(0, 2);

          setUserData({
            id: data.id || data._id,
            name: data.name || adminName,
            email: data.email || adminEmail,
            role: data.role || adminRole,
            avatar: data.avatar || data.profileImage,
            initials: initials || adminInitials
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const notifications = [
    {
      id: 1,
      title: "New user registered",
      description: "John Doe just created a new account",
      time: "5 min ago",
      icon: Users,
      color: "text-[#C85A32]",
      bgColor: "bg-[#C85A32]/10",
      read: false,
    },
    {
      id: 2,
      title: "Project submission",
      description: "New project 'Q2 Research Output' submitted for review",
      time: "1 hour ago",
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      read: false,
    },
    {
      id: 3,
      title: "Payment received",
      description: "Invoice #INV-2026-004 has been paid",
      time: "3 hours ago",
      icon: CreditCard,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      read: true,
    },
    {
      id: 4,
      title: "System update",
      description: "New version 2.4.0 is ready for deployment",
      time: "5 hours ago",
      icon: Settings,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      read: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const adminNavItems = [
    { title: "Settings", path: "/admin/settings", icon: Settings2 },
  ];

  return (
    <>
      <header 
        className="flex items-center gap-4 px-7 shrink-0 fixed top-0 right-0 z-30 transition-all duration-300"
        style={{ 
          height: '64px', 
          background: 'rgb(255, 255, 255)', 
          borderBottom: '1px solid rgb(238, 241, 251)', 
          boxShadow: 'rgb(238, 241, 251) 0px 1px 0px',
          left: isSidebarOpen ? '232px' : '0px',
        }}
      >
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar */}
        <div 
          className="hidden md:flex items-center gap-2.5 rounded-xl px-3.5 transition-all"
          style={{ 
            background: 'rgb(244, 246, 252)', 
            border: '1.5px solid rgb(228, 233, 244)', 
            height: '40px', 
            width: '340px', 
            flexShrink: 0 
          }}
        >
          <Search size={14} stroke="#A0AABF" strokeWidth={2.2} />
          <input 
            placeholder="Search anything..." 
            style={{ 
              flex: '1 1 0%', 
              borderWidth: 'medium', 
              borderStyle: 'none', 
              borderColor: 'currentcolor', 
              borderImage: 'none', 
              outline: 'none', 
              background: 'transparent', 
              fontSize: '13px', 
              color: 'rgb(55, 65, 81)', 
              fontFamily: 'Manrope, sans-serif', 
              fontWeight: 500 
            }}
          />
          <div 
            className="flex items-center gap-0.5 rounded-lg px-1.5 py-0.5"
            style={{ 
              background: 'rgb(228, 233, 244)', 
              color: 'rgb(160, 170, 191)', 
              fontSize: '10px', 
              fontWeight: 700, 
              whiteSpace: 'nowrap' 
            }}
          >
            <Command size={9} strokeWidth={2.5} />
            K
          </div>
        </div>

        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Notifications */}
        <div style={{ position: 'relative', flexShrink: 0 }} ref={notificationRef}>
          <button 
            className="relative flex items-center justify-center rounded-xl transition-colors"
            style={{ 
              width: '40px', 
              height: '40px', 
              background: 'rgb(244, 246, 252)', 
              border: '1.5px solid rgb(228, 233, 244)', 
              cursor: 'pointer' 
            }}
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell size={16} stroke="#4B5563" strokeWidth={2} />
            {unreadCount > 0 && (
              <span 
                className="absolute flex items-center justify-center rounded-full"
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: 'rgb(239, 68, 68)', 
                  top: '-4px', 
                  right: '-4px', 
                  border: '2px solid rgb(255, 255, 255)', 
                  fontSize: '9px', 
                  color: 'rgb(255, 255, 255)', 
                  fontWeight: 800 
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">Notifications</h3>
                {unreadCount > 0 && (
                  <button className="text-xs text-[#C85A32] hover:underline font-medium">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-[#C85A32]/5" : ""
                    }`}
                  >
                    <div className={`${notification.bgColor} rounded-lg p-2 shrink-0`}>
                      <notification.icon className={`w-4 h-4 ${notification.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {notification.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {notification.time}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#C85A32] rounded-full shrink-0 mt-2"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 px-4 py-2 text-center">
                <button className="text-xs text-[#C85A32] font-medium hover:underline">
                  View all
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '28px', background: 'rgb(238, 241, 251)' }}></div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <div 
            className="flex items-center gap-2.5 rounded-xl px-3 py-1.5 cursor-pointer select-none transition-colors"
            style={{ 
              background: 'rgb(244, 246, 252)', 
              border: '1.5px solid rgb(228, 233, 244)' 
            }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {userData.avatar ? (
              <img 
                src={userData.avatar} 
                alt={userData.name} 
                className="rounded-xl shrink-0"
                style={{ width: '32px', height: '32px', objectFit: 'cover' }}
              />
            ) : (
              <div 
                className="flex items-center justify-center rounded-xl shrink-0"
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  background: 'rgb(96, 27, 128)',
                  color: 'rgb(255, 255, 255)', 
                  fontSize: '12px', 
                  fontWeight: 800,
                  boxShadow: 'rgba(91, 63, 216, 0.3) 0px 2px 8px'
                }}
              >
                {loading ? '...' : userData.initials}
              </div>
            )}
            <div>
              <p style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(13, 17, 23)', lineHeight: 1.2 }}>
                {loading ? 'Loading...' : userData.name}
              </p>
              <p style={{ fontSize: '10.5px', color: 'rgb(160, 170, 191)', lineHeight: 1.2, fontWeight: 500 }}>
                {userData.role}
              </p>
            </div>
            <ChevronDown 
              size={13} 
              stroke="#A0AABF" 
              strokeWidth={2}
              className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">
                  {userData.name}
                </p>
                <p className="text-xs text-gray-500">
                  {userData.email}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {userData.role}
                </p>
              </div>
              <div className="py-1">
                {adminNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#C85A32]"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-100 py-1">
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOutIcon className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search */}
      {isMobileSearchOpen && (
        <div className="md:hidden fixed top-16 left-0 right-0 bg-white border-b border-gray-200 p-3 shadow-lg z-30">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 w-full"
              autoFocus
            />
            <button onClick={() => setIsMobileSearchOpen(false)} className="text-gray-400">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-xl">
            <h3 className="font-semibold text-gray-800 text-lg mb-2">
              Sign out?
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              You'll need to sign in again to access your workspace.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setShowLogoutModal(false);
                  await handleLogout();
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;