// components/settings/CompanySettings.tsx
import React, { useState } from 'react';
import { CircleCheckBig } from 'lucide-react';

const CompanySettings = () => {
  const [companyData, setCompanyData] = useState({
    companyName: 'Ru-max Ltd',
    companyEmail: 'hr@rumax.com',
    phone: '+44 20 7946 0000',
    address: '123 Business Park, London, EC1A 1BB',
    tagline: 'Your Care, Our Commitment'
  });

  const handleSave = () => {
    console.log('Saving company settings:', companyData);
    alert('Company settings updated successfully!');
  };

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-[#0D1117] mb-0.5 text-lg sm:text-[20px] font-bold">
          Company Settings
        </h2>
        <p className="text-[13px] text-[#7B8299] font-medium">
          Manage your organisation's branding and details
        </p>
      </div>

      <div className="rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 mb-3 sm:mb-4" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        {/* Company Logo & Info */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-2">
          <div 
            className="flex items-center justify-center rounded-2xl w-[56px] h-[56px] sm:w-[64px] sm:h-[64px] text-[18px] sm:text-[20px] font-extrabold text-white shrink-0"
            style={{ background: 'rgb(96, 27, 128)', boxShadow: 'rgba(27, 43, 107, 0.35) 0px 4px 14px' }}
          >
            R
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[14px] font-extrabold text-[#0D1117]">{companyData.companyName}</p>
            <p className="text-[11px] sm:text-[12px] text-[#7B8299] font-medium mt-0.5">
              {companyData.tagline}
            </p>
            <button 
              className="mt-2 px-3 py-1.5 rounded-xl text-[11px] sm:text-[12px] font-bold text-white"
              style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
            >
              Upload Logo
            </button>
          </div>
        </div>

        {/* Form Fields */}
        {[
          { key: 'companyName', label: 'Company Name', value: companyData.companyName },
          { key: 'companyEmail', label: 'Company Email', value: companyData.companyEmail },
          { key: 'phone', label: 'Phone', value: companyData.phone },
          { key: 'address', label: 'Address', value: companyData.address }
        ].map((field) => (
          <div key={field.key}>
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              {field.label}
            </label>
            <input 
              type="text" 
              className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none"
              value={field.value}
              onChange={(e) => setCompanyData({...companyData, [field.key]: e.target.value})}
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
            />
          </div>
        ))}
      </div>

      <button 
        onClick={handleSave}
        className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl w-full sm:w-auto text-[13px] font-bold text-white"
        style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
      >
        <CircleCheckBig size={14} stroke="currentColor" strokeWidth={2} />
        Save Company Settings
      </button>
    </div>
  );
};

export default CompanySettings;