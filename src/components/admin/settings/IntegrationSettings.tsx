// components/settings/IntegrationSettings.tsx
import React from 'react';
import { Mail, MessageSquare, Calendar, Search, Smartphone } from 'lucide-react';

const IntegrationSettings = () => {
  const integrations = [
    { 
      id: 'outlook', 
      name: 'Outlook', 
      description: 'Sync calendar and emails',
      icon: Mail,
      color: '#0078D4',
      connected: true
    },
    { 
      id: 'teams', 
      name: 'Microsoft Teams', 
      description: 'Send notifications and schedule meetings',
      icon: MessageSquare,
      color: '#5B5EA6',
      connected: true
    },
    { 
      id: 'calendly', 
      name: 'Calendly', 
      description: 'Interview scheduling automation',
      icon: Calendar,
      color: '#006BFF',
      connected: false
    },
    { 
      id: 'dbs', 
      name: 'DBS Provider', 
      description: 'Automated DBS check requests',
      icon: Search,
      color: '#374151',
      connected: false
    },
    { 
      id: 'twilio', 
      name: 'Twilio', 
      description: 'SMS notifications to candidates',
      icon: Smartphone,
      color: '#F22F46',
      connected: false
    }
  ];

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-[#0D1117] mb-0.5 text-lg sm:text-[20px] font-bold">
          Integrations
        </h2>
        <p className="text-[13px] text-[#7B8299] font-medium">
          Connect third-party tools to your HR portal
        </p>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div key={integration.id} className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4" style={{ 
              background: 'rgb(255, 255, 255)', 
              border: '1px solid rgb(228, 233, 244)', 
              boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
            }}>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <div className="flex items-center justify-center rounded-xl shrink-0 w-[40px] h-[40px] sm:w-[44px] sm:h-[44px]" style={{ 
                  background: integration.connected ? 'rgb(240, 253, 244)' : 'rgb(248, 249, 254)',
                  border: integration.connected ? '1px solid rgb(187, 247, 208)' : '1px solid rgb(228, 233, 244)'
                }}>
                  <Icon size={18} stroke={integration.color} strokeWidth={1.8} className="sm:w-[20px] sm:h-[20px]" />
                </div>
                <div className="flex-1 sm:hidden">
                  <p className="text-[13px] font-bold text-[#0D1117]">{integration.name}</p>
                  <p className="text-[11px] text-[#7B8299] font-medium mt-0.5">
                    {integration.description}
                  </p>
                </div>
              </div>
              <div className="flex-1 hidden sm:block">
                <p className="text-[13.5px] font-bold text-[#0D1117]">{integration.name}</p>
                <p className="text-[12px] text-[#7B8299] font-medium mt-0.5">
                  {integration.description}
                </p>
              </div>
              <button 
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shrink-0 w-full sm:w-auto text-[11px] sm:text-[12px] font-bold"
                style={{ 
                  background: integration.connected ? 'rgb(240, 253, 244)' : 'rgb(96, 27, 128)',
                  color: integration.connected ? 'rgb(22, 163, 74)' : 'rgb(255, 255, 255)',
                  cursor: 'pointer', 
                  border: integration.connected ? '1.5px solid rgb(187, 247, 208)' : 'none',
                  borderRadius: '8px'
                }}
              >
                {integration.connected ? '✓ Connected' : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationSettings;