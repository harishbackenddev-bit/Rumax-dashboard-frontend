// components/auth/ProfileTypeStep.tsx
import React from 'react';

interface ProfileTypeStepProps {
  selectedProfileType: string | null;
  setSelectedProfileType: (type: string) => void;
}

const profileTypes = [
  {
    id: "senior-academic",
    title: "Senior Academic",
    description: "Experienced researchers and professors",
  },
  {
    id: "early-career",
    title: "Early Career Researcher",
    description: "PhD candidates, postdocs, and junior faculty",
  },
  {
    id: "executive-leader",
    title: "Executive Leader",
    description: "Directors, VPs, and C-suite professionals",
  },
];

const ProfileTypeStep: React.FC<ProfileTypeStepProps> = ({ 
  selectedProfileType, 
  setSelectedProfileType 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Profile Type
        </h1>
        <p className="text-gray-500 text-sm">
          Choose the profile that best describes you
        </p>
      </div>

      <div className="space-y-3">
        {profileTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedProfileType(type.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedProfileType === type.id
                ? "border-[#C85A32] bg-[#FFF8F5]"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <p className={`font-semibold text-sm ${
              selectedProfileType === type.id ? "text-[#C85A32]" : "text-[#1C1C1C]"
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

export default ProfileTypeStep;