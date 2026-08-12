// pages/admin/Settings.tsx
import React, { useState } from 'react';
import {
  User,
  Shield,
  Bell,
  Building2,
  Link2,
  Lock,
  Menu,
  X
} from 'lucide-react';
import ProfileSettings from '@/components/admin/settings/ProfileSettings';
import SecuritySettings from '@/components/admin/settings/SecuritySettings';
import NotificationSettings from '@/components/admin/settings/NotificationSettings';
import CompanySettings from '@/components/admin/settings/CompanySettings';
import IntegrationSettings from '@/components/admin/settings/IntegrationSettings';
import RolesPermissions from '@/components/admin/settings/RolesPermissions';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tabs configuration
  const tabs: SettingsTab[] = [
    { id: 'profile', label: 'Profile Settings', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'company', label: 'Company Settings', icon: Building2 },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'permissions', label: 'Roles & Permissions', icon: Lock }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'company':
        return <CompanySettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'permissions':
        return <RolesPermissions />;
      default:
        return null;
    }
  };

  const getTabLabel = (id: string) => {
    const tab = tabs.find(t => t.id === id);
    return tab ? tab.label : id;
  };

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b" style={{ borderColor: 'rgb(238, 241, 251)' }}>
        <h2 className="text-[#0D1117] text-lg font-bold">
          {getTabLabel(activeTab)}
        </h2>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg"
          style={{ background: 'rgb(244, 246, 252)' }}
        >
          {mobileMenuOpen ? (
            <X size={20} stroke="#7B8299" />
          ) : (
            <Menu size={20} stroke="#7B8299" />
          )}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div 
        className={`
          ${mobileMenuOpen ? 'flex' : 'hidden'} 
          md:flex 
          flex-col 
          py-4 sm:py-6 
          px-2 sm:px-3 
          shrink-0 
          w-full 
          md:w-[200px] 
          lg:w-[220px]
          absolute 
          md:relative 
          top-[57px] 
          md:top-0 
          left-0 
          z-50 
          md:z-auto
          h-[calc(100%-57px)] 
          md:h-full
          overflow-y-auto
        `}
        style={{ 
          borderRight: '1px solid rgb(238, 241, 251)', 
          background: 'rgb(255, 255, 255)' 
        }}
      >
        <p className="hidden md:block text-[10.5px] font-bold text-[#A0AABF] tracking-wider uppercase mb-3 pl-3">
          Settings
        </p>
        
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 sm:gap-3 w-full px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl mb-0.5 transition-all text-[12px] sm:text-[13px]"
              style={{ 
                background: isActive ? 'rgb(96, 27, 128)' : 'transparent',
                color: isActive ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
                fontWeight: isActive ? 700 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                border: 'none',
                boxShadow: 'none'
              }}
            >
              <span 
                className="flex items-center justify-center rounded-lg shrink-0"
                style={{ 
                  width: '26px', 
                  height: '26px', 
                  background: isActive ? 'rgba(255, 255, 255, 0.15)' : 'rgb(244, 246, 252)',
                }}
              >
                <Icon 
                  size={13} 
                  stroke={isActive ? '#fff' : '#7B8299'} 
                  strokeWidth={2} 
                  className="sm:w-[14px] sm:h-[14px]"
                />
              </span>
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-7">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;