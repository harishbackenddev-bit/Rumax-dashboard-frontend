// components/auth/AccountTypeStep.tsx
import React from 'react';
import { User, Building2 } from 'lucide-react';

interface AccountTypeStepProps {
  selectedAccountType: string | null;
  setSelectedAccountType: (type: string) => void;
}

const accountTypes = [
  {
    id: "individual",
    title: "Individual Professional",
    description: "For academics, researchers, and executive leaders",
    icon: User,
  },
  {
    id: "institutional",
    title: "Institutional / Enterprise",
    description: "For universities, research organisations, and corporate teams",
    icon: Building2,
  },
];

const AccountTypeStep: React.FC<AccountTypeStepProps> = ({ 
  selectedAccountType, 
  setSelectedAccountType 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Choose Account Type
        </h1>
        <p className="text-gray-500 text-sm">
          Select the account type that fits your needs
        </p>
      </div>

      <div className="space-y-3 mb-7">
        {accountTypes.map((type) => {
          const IconComponent = type.icon;
          const isSelected = selectedAccountType === type.id;
          return (
            <button
              key={type.id}
              onClick={() => setSelectedAccountType(type.id)}
              className={`w-full flex items-start gap-4 p-5 rounded-xl border-2 transition-all text-left group ${
                isSelected
                  ? "border-[#C85A32] bg-[#FFF8F5]"
                  : "border-gray-100 hover:border-[#C85A32] hover:bg-[#FFF8F5]"
              }`}
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isSelected
                    ? "bg-[#C85A32]"
                    : "bg-[#F3EDE6] group-hover:bg-[#C85A32]"
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 transition-colors ${
                    isSelected
                      ? "text-white"
                      : "text-[#C85A32] group-hover:text-white"
                  }`}
                />
              </div>
              <div>
                <p className="font-semibold text-[#0F2D63] text-sm">
                  {type.title}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {type.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AccountTypeStep;