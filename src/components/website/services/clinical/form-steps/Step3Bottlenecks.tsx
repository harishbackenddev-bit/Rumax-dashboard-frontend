// components/website/services/clinical/form-steps/Step3Bottlenecks.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';

const Step3Bottlenecks: React.FC = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Tell Us About Your Current Bottlenecks</h3>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Describe any challenges or bottlenecks in your clinical trial
        </label>
        <textarea
          {...register('bottlenecks')}
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Please describe any challenges you're facing with recruitment, retention, site management, or other aspects of your clinical trial..."
        />
        {errors.bottlenecks && (
          <p className="mt-1 text-sm text-red-600">{errors.bottlenecks.message as string}</p>
        )}
      </div>
    </div>
  );
};

export default Step3Bottlenecks;