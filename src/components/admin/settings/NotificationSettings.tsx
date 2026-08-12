// components/settings/NotificationSettings.tsx
import React, { useState } from 'react';

const NotificationSettings = () => {
  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    interviewReminders: true,
    newApplications: true,
    documentExpiry: true,
    offerUpdates: false
  });

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) => (
    <button 
      onClick={() => onChange(!value)}
      className="relative rounded-full transition-colors shrink-0"
      style={{ 
        width: '44px', 
        height: '24px', 
        background: value ? 'rgb(96, 27, 128)' : 'rgb(228, 233, 244)',
        cursor: 'pointer',
        border: 'none',
        transition: 'background 0.2s'
      }}
    >
      <div 
        className="absolute rounded-full transition-all"
        style={{ 
          width: '18px', 
          height: '18px', 
          background: 'rgb(255, 255, 255)',
          top: '3px',
          left: value ? '23px' : '3px',
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px',
          transition: 'left 0.2s'
        }}
      />
    </button>
  );

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-[#0D1117] mb-0.5 text-lg sm:text-[20px] font-bold">
          Notification Preferences
        </h2>
        <p className="text-[13px] text-[#7B8299] font-medium">
          Configure how you receive alerts and updates
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-6" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        {[
          { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive updates and summaries by email' },
          { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive urgent alerts via SMS (Twilio)' },
          { key: 'interviewReminders', label: 'Interview Reminders', desc: 'Get reminded 24h before scheduled interviews' },
          { key: 'newApplications', label: 'New Application Alerts', desc: 'Notify when new candidates apply to a role' },
          { key: 'documentExpiry', label: 'Document Expiry Alerts', desc: 'Notify when DBS or right-to-work is expiring' },
          { key: 'offerUpdates', label: 'Offer Updates', desc: 'Notify when a candidate accepts or declines an offer' }
        ].map((item, index) => (
          <div 
            key={item.key}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 py-3 sm:py-4"
            style={{ borderBottom: index === 5 ? 'none' : '1px solid rgb(238, 241, 251)' }}
          >
            <div className="flex-1">
              <p className="text-[13px] font-bold text-[#0D1117]">{item.label}</p>
              <p className="text-[11px] sm:text-[11.5px] text-[#7B8299] mt-0.5 font-medium">
                {item.desc}
              </p>
            </div>
            <div className="flex justify-end sm:justify-start">
              <ToggleSwitch 
                value={notificationData[item.key as keyof typeof notificationData]}
                onChange={(val) => setNotificationData({...notificationData, [item.key]: val})}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;