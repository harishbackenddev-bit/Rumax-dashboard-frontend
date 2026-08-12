// components/application/steps/Step5.tsx
import React from 'react';
import { GripVertical, Heart, Handshake, Shield, BookOpen, Star } from 'lucide-react';

interface Step5Props {
  formData: {
    heardFrom: string;
    supportingStatement: string;
    scenarioAnswers: {
      q1: string;
      q2: string;
      q3: string;
    };
    coreValues: string[];
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRadioChange: (name: string, value: string) => void;
  onValueReorder: (values: string[]) => void;
}

const Step5: React.FC<Step5Props> = ({
  formData,
  onChange,
  onRadioChange,
  onValueReorder
}) => {
  const valueIcons = {
    Compassion: Heart,
    Respect: Handshake,
    Integrity: Shield,
    'Continuous Learning': BookOpen,
    Excellence: Star
  };

  const valueColors = {
    Compassion: 'text-red-500',
    Respect: 'text-blue-500',
    Integrity: 'text-purple-500',
    'Continuous Learning': 'text-green-500',
    Excellence: 'text-yellow-500'
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Where did you hear about us? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {['Indeed', 'Total Jobs', 'Internal Referral', 'Company Website', 'Other'].map((source) => (
            <label
              key={source}
              className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.heardFrom === source
                  ? 'border-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md scale-[1.02]'
                  : 'border-gray-300 hover:border-[#0F4C81] hover:shadow-sm bg-white'
              }`}
            >
              <input
                type="radio"
                name="heardFrom"
                value={source}
                checked={formData.heardFrom === source}
                onChange={() => onRadioChange('heardFrom', source)}
                className="sr-only"
              />
              <span className={`text-sm font-bold text-center ${
                formData.heardFrom === source ? 'text-[#0F4C81]' : 'text-gray-700'
              }`}>
                {source}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Supporting Statement <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 mb-3 font-medium">
          Tell us why you would like to work for Rumax and what makes you a great fit for this role.
        </p>
        <textarea
          name="supportingStatement"
          value={formData.supportingStatement}
          onChange={onChange}
          rows={6}
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none resize-none bg-gray-50 hover:bg-white hover:border-gray-300 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
          placeholder="Share your motivation and what makes you a great fit..."
        />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-5">Scenario-Based Questions</h2>
        <div className="space-y-6">
          <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Question 1 <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-700 mb-4 font-medium">
              A service user is anxious about receiving care from a new caregiver. How would you approach the situation?
            </p>
            <textarea
              name="scenarioQ1"
              value={formData.scenarioAnswers.q1}
              onChange={onChange}
              rows={4}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none resize-none bg-white hover:border-gray-300 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Your answer..."
            />
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Question 2 <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-700 mb-4 font-medium">
              Describe a time when you worked as part of a team to solve a difficult problem.
            </p>
            <textarea
              name="scenarioQ2"
              value={formData.scenarioAnswers.q2}
              onChange={onChange}
              rows={4}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none resize-none bg-white hover:border-gray-300 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Your answer..."
            />
          </div>

          <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm">
            <label className="block text-sm font-bold text-gray-900 mb-3">
              Question 3 <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-700 mb-4 font-medium">
              What does person-centred care mean to you?
            </p>
            <textarea
              name="scenarioQ3"
              value={formData.scenarioAnswers.q3}
              onChange={onChange}
              rows={4}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none resize-none bg-white hover:border-gray-300 transition-all font-medium placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Your answer..."
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-[#0F4C81]/10">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Rumax Core Values</h2>
        <p className="text-sm text-gray-600 mb-6 font-medium">
          Drag and drop to rank these values from most important (1) to least important (5) based on what matters most to you.
        </p>
        <div className="space-y-3">
          {formData.coreValues.map((value, index) => {
            const Icon = valueIcons[value as keyof typeof valueIcons];
            const color = valueColors[value as keyof typeof valueColors];
            return (
              <div
                key={value}
                className="bg-white border-2 rounded-xl p-5 cursor-move transition-all shadow-sm hover:shadow-md border-gray-300 hover:border-[#0F4C81]"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', value);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const draggedValue = e.dataTransfer.getData('text/plain');
                  const currentIndex = formData.coreValues.indexOf(value);
                  const draggedIndex = formData.coreValues.indexOf(draggedValue);
                  const newValues = [...formData.coreValues];
                  newValues.splice(draggedIndex, 1);
                  newValues.splice(currentIndex, 0, draggedValue);
                  onValueReorder(newValues);
                }}
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-6 h-6 text-gray-400 hover:text-[#0F4C81] transition-colors" />
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl">
                    {Icon && <Icon className={`w-6 h-6 ${color}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold text-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 w-8 h-8 rounded-lg flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="font-bold text-gray-900 text-base">{value}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Step5;