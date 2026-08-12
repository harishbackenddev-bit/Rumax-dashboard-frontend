// components/auth/SecurityNDAStep.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface SecurityNDAStepProps {
  ndaAccepted: boolean;
  setNdaAccepted: (accepted: boolean) => void;
  error?: string | null;
}

const securityFeatures = [
  "Data Encryption — all files encrypted at rest and in transit",
  "IP Protection — your materials remain your property",
  "Access Controls — role-based permissions for your team",
  "Audit Logging — all activity logged for security",
];

const SecurityNDAStep: React.FC<SecurityNDAStepProps> = ({ 
  ndaAccepted, 
  setNdaAccepted,
  error 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Security & NDA
        </h1>
        <p className="text-gray-500 text-sm">
          Review and accept our confidentiality agreement
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <div className="bg-[#F9F7F4] rounded-xl p-5 space-y-3 border border-gray-100">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#C85A32] rounded-full flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-white" />
            </div>
            <p className="text-sm text-gray-600">{feature}</p>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 p-4 bg-[#FFF8F5] border-2 border-[#C85A32]/30 rounded-xl mt-4">
        <input
          type="checkbox"
          id="nda"
          checked={ndaAccepted}
          onChange={(e) => setNdaAccepted(e.target.checked)}
          className="h-4 w-4 shrink-0 rounded border-gray-300 focus:ring-2 focus:ring-[#C85A32] accent-[#C85A32] mt-0.5"
        />
        <label htmlFor="nda" className="text-sm text-gray-600 cursor-pointer leading-relaxed">
          I have read and agree to the NDA & Terms on behalf of my institution, and confirm I have authority to enter this agreement.
        </label>
      </div>
    </div>
  );
};

export default SecurityNDAStep;