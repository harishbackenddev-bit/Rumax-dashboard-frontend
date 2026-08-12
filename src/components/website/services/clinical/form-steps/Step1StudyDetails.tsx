// components/website/services/clinical/form-steps/Step1StudyDetails.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step1StudyDetails: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Tell Us About Your Study</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Study Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('studyName')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter study name"
          />
          {errors.studyName && (
            <p className="mt-1 text-sm text-red-600">{errors.studyName.message as string}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Consultant Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register('consultantName')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter consultant name"
          />
          {errors.consultantName && (
            <p className="mt-1 text-sm text-red-600">{errors.consultantName.message as string}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step1StudyDetails;