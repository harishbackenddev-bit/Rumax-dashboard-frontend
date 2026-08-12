// components/website/services/clinical/form-steps/Step2ConsultantInfo.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step2ConsultantInfo: React.FC = () => {
  const { register } = useFormContext();
  
  // Create array for 10 phone fields
  const phoneFields = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Consultant Contact Information</h3>
      <p className="text-sm text-gray-500">Add up to 10 phone numbers for the consultant</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {phoneFields.map((index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone {index + 1}
            </label>
            <input
              {...register(`phoneNumbers.${index}`)}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`Enter phone ${index + 1}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step2ConsultantInfo;