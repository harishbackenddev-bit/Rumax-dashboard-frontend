// components/auth/PrimaryGoalStep.tsx
import React from 'react';

interface PrimaryGoalStepProps {
  selectedGoal: string | null;
  setSelectedGoal: (goal: string) => void;
  error?: string | null;
}

const primaryGoals = [
  {
    id: "speechwriting",
    title: "Speechwriting",
    description: "Executive speeches, keynotes, and presentations",
  },
  {
    id: "coaching",
    title: "Coaching & Workshops",
    description: "1-on-1 communication coaching",
  },
  {
    id: "research-translation",
    title: "Research Translation",
    description: "Making academic work accessible and impactful",
  },
  {
    id: "personal-brand",
    title: "Personal Brand Support",
    description: "Building professional visibility and thought leadership",
  },
];

const PrimaryGoalStep: React.FC<PrimaryGoalStepProps> = ({ 
  selectedGoal, 
  setSelectedGoal,
  error 
}) => {
  return (
    <div>
      <div className="mb-7">
        <h1 className="text-2xl font-['Roboto'] font-bold text-[#0F2D63] mb-1">
          Primary Goal
        </h1>
        <p className="text-gray-500 text-sm">
          What do you need help with most?
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {primaryGoals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelectedGoal(goal.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              selectedGoal === goal.id
                ? "border-[#C85A32] bg-[#FFF8F5]"
                : "border-gray-100 hover:border-gray-200"
            }`}
          >
            <p className={`font-semibold text-sm ${
              selectedGoal === goal.id ? "text-[#C85A32]" : "text-[#1C1C1C]"
            }`}>
              {goal.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              {goal.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrimaryGoalStep;