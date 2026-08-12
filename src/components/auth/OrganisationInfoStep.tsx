// components/auth/OrganisationInfoStep.tsx
import React from 'react';

interface OrganisationInfoStepProps {
  formData: {
    organisationName: string;
    contactName: string;
    businessEmail: string;
    orgPassword: string;
    orgConfirmPassword: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}

const OrganisationInfoStep: React.FC<OrganisationInfoStepProps> = ({ 
  formData, 
  handleInputChange,
  error 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Organisation Information
        </h1>
        <p className="text-gray-500 text-sm">
          Start with your basic institutional details
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Organisation Name
          </label>
          <input
            id="organisationName"
            value={formData.organisationName}
            onChange={handleInputChange}
            placeholder="University of Cape Town"
            className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Primary Contact Name
          </label>
          <input
            id="contactName"
            value={formData.contactName}
            onChange={handleInputChange}
            placeholder="Dr. Sarah Thompson"
            className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Business Email
          </label>
          <input
            type="email"
            id="businessEmail"
            value={formData.businessEmail}
            onChange={handleInputChange}
            placeholder="contact@institution.edu"
            className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Password
          </label>
          <input
            type="password"
            id="orgPassword"
            value={formData.orgPassword}
            onChange={handleInputChange}
            placeholder="Minimum 8 characters"
            className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
            required
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Must be at least 8 characters with letters and numbers
          </p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Confirm Password
          </label>
          <input
            type="password"
            id="orgConfirmPassword"
            value={formData.orgConfirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm your password"
            className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default OrganisationInfoStep;