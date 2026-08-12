// components/website/services/clinical/form-steps/Step4Confirmation.tsx
import React from 'react';

interface Step4ConfirmationProps {
  isSubmitted?: boolean;
}

const Step4Confirmation: React.FC<Step4ConfirmationProps> = ({ isSubmitted = false }) => {
  if (isSubmitted) {
    return (
      <div className="text-center py-8 space-y-6">
        <div className="text-6xl mb-4">👩‍⚕️</div>
        <h3 className="text-2xl font-bold text-gray-800">You're All Set!</h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for your submission. Your consent is now being collected. We will contact you shortly.
        </p>
        <button
          onClick={() => window.location.href = '/book-consultation'}
          className="px-8 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
        >
          Book a Consultation
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4">
      <h3 className="text-lg font-semibold text-gray-800">Review Your Information</h3>
      <p className="text-sm text-gray-500">
        Please review your information before submitting. Click "Submit" below when ready.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
        <p className="text-sm text-blue-700">
          You'll receive a confirmation email shortly after submission.
        </p>
      </div>
    </div>
  );
};

export default Step4Confirmation;