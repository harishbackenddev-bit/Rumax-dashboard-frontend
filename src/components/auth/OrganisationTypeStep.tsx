// components/auth/OrganisationTypeStep.tsx
import React from 'react';

interface OrganisationTypeStepProps {
  selectedOrgType: string | null;
  setSelectedOrgType: (type: string) => void;
}

const orgTypes = [
  {
    id: "university-communications",
    title: "University Communications",
    description: "Communications departments and press offices",
  },
  {
    id: "higher-education",
    title: "Higher Education Network",
    description: "Research networks, consortiums, and associations",
  },
  {
    id: "global-development",
    title: "Global Development",
    description: "Development agencies, NGOs, and philanthropic organisations",
  },
  {
    id: "corporate-social-impact",
    title: "Corporate Social Impact",
    description: "Corporate sustainability, CSR, and social impact teams",
  },
];

const OrganisationTypeStep: React.FC<OrganisationTypeStepProps> = ({ 
  selectedOrgType, 
  setSelectedOrgType 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Organisation Type
        </h1>
        <p className="text-gray-500 text-sm">
          Select the category that best describes your organisation
        </p>
      </div>

      <div className="space-y-3">
        {orgTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedOrgType(type.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedOrgType === type.id
                ? "border-[#C85A32] bg-[#FFF8F5]"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <p className={`font-semibold text-sm ${
              selectedOrgType === type.id ? "text-[#C85A32]" : "text-[#1C1C1C]"
            }`}>
              {type.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {type.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrganisationTypeStep;