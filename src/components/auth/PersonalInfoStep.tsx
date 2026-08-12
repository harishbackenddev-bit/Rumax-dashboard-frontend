// components/auth/PersonalInfoStep.tsx
import React from 'react';

interface PersonalInfoStepProps {
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string | null;
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({ 
  formData, 
  handleInputChange, 
  error 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Personal Information
        </h1>
        <p className="text-gray-500 text-sm">
          Tell us about yourself
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
            Full Name
          </label>
          <input
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Dr. Jane Smith"
            className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C85A32] focus:ring-offset-2 transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="jane@institution.edu"
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
            id="password"
            value={formData.password}
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
            id="confirmPassword"
            value={formData.confirmPassword}
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

export default PersonalInfoStep;