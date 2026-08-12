// components/application/steps/Step2.tsx
import React from 'react';
import {Check} from 'lucide-react';
interface Step2Props {
  formData: {
    positionAppliedFor: string;
    workPreference: string;
    preferredLocations: string[];
    availability: {
      monday: string[];
      tuesday: string[];
      wednesday: string[];
      thursday: string[];
      friday: string[];
      saturday: string[];
      sunday: string[];
    };
    drivingLicense: boolean;
    ownVehicle: boolean;
    shiftConfirmation: boolean;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onLocationToggle: (location: string) => void;
  onAvailabilityToggle: (day: string, shift: string) => void;
  onRadioChange: (name: string, value: string | boolean) => void;
}

const Step2: React.FC<Step2Props> = ({
  formData,
  onChange,
  onLocationToggle,
  onAvailabilityToggle,
  onRadioChange
}) => {
  const locations = ['Basildon', 'Essex', 'London', 'Manchester', 'Birmingham'];
  const shifts = ['Morning', 'Afternoon', 'Evening'];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const shiftTimes = {
    Morning: '6am-2pm',
    Afternoon: '2pm-10pm',
    Evening: '10pm-6am'
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2.5">
          Position Applied For <span className="text-red-500">*</span>
        </label>
        <select
          name="positionAppliedFor"
          value={formData.positionAppliedFor}
          onChange={onChange}
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-bold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
        >
          <option value="">Select a position...</option>
          <option value="Support Worker">Support Worker</option>
          <option value="Senior Care Assistant">Senior Care Assistant</option>
          <option value="Registered Nurse">Registered Nurse</option>
          <option value="Mobile Research Nurse">Mobile Research Nurse</option>
          <option value="Clinical Trial Coordinator">Clinical Trial Coordinator</option>
          <option value="Care Coordinator">Care Coordinator</option>
          <option value="Registered Manager">Registered Manager</option>
          <option value="Healthcare Assistant">Healthcare Assistant</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Work Preference <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {['Full Time', 'Part Time', 'Bank Hours', 'Contract'].map((pref) => (
            <label
              key={pref}
              className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                formData.workPreference === pref
                  ? 'border-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md scale-[1.02]'
                  : 'border-gray-300 hover:border-[#0F4C81] hover:shadow-sm bg-white'
              }`}
            >
              <input
                type="radio"
                name="workPreference"
                value={pref}
                checked={formData.workPreference === pref}
                onChange={() => onRadioChange('workPreference', pref)}
                className="sr-only"
              />
              <span className={`text-sm font-bold ${formData.workPreference === pref ? 'text-[#0F4C81]' : 'text-gray-700'}`}>
                {pref}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Preferred Locations <span className="text-gray-500 font-normal">(Select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {locations.map((location) => (
            <button
              key={location}
              type="button"
              onClick={() => onLocationToggle(location)}
              className={`px-5 py-3 rounded-xl border-2 transition-all font-semibold ${
                formData.preferredLocations.includes(location)
                  ? 'border-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 text-[#0F4C81] shadow-md scale-[1.02]'
                  : 'border-gray-300 hover:border-[#0F4C81] text-gray-700 bg-white hover:shadow-sm'
              }`}
            >
              {location}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-3">Availability Schedule</label>
        <p className="text-sm text-gray-600 mb-4 font-medium">
          Select your available shifts and specify your working hours
        </p>
        <div className="space-y-4">
          {days.map((day) => (
            <div key={day} className="border-2 border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-base font-bold text-gray-900 mb-4 capitalize">{day}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shifts.map((shift) => {
                  const isSelected = formData.availability[day as keyof typeof formData.availability]?.includes(shift);
                  return (
                    <div
                      key={shift}
                      className={`border-2 rounded-xl p-4 transition-all ${
                        isSelected
                          ? 'border-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
                          : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <button
                          type="button"
                          onClick={() => onAvailabilityToggle(day, shift)}
                          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-gradient-to-br from-[#0F4C81] to-[#1565a8] border-[#0F4C81]'
                              : 'bg-white border-gray-300 hover:border-[#0F4C81]'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                        </button>
                        <div>
                          <div className={`font-bold text-sm ${isSelected ? 'text-[#0F4C81]' : 'text-gray-700'}`}>
                            {shift}
                          </div>
                          <div className="text-xs text-gray-500 font-medium">{shiftTimes[shift as keyof typeof shiftTimes]}</div>
                        </div>
                      </label>
                      {isSelected && (
                        <div className="space-y-3 mt-3 pt-3 border-t border-[#0F4C81]/20">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Start Time</label>
                            <input
                              type="time"
                              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none bg-white hover:border-gray-400 transition-all"
                              defaultValue={shift === 'Morning' ? '06:00' : shift === 'Afternoon' ? '14:00' : '22:00'}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5">End Time</label>
                            <input
                              type="time"
                              className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg text-sm font-bold focus:ring-2 focus:ring-[#0F4C81]/20 focus:border-[#0F4C81] outline-none bg-white hover:border-gray-400 transition-all"
                              defaultValue={shift === 'Morning' ? '14:00' : shift === 'Afternoon' ? '22:00' : '06:00'}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">Do you have a driving license?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map((option) => (
              <label
                key={option}
                className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.drivingLicense === (option === 'Yes')
                    ? 'border-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
                    : 'border-gray-300 hover:border-[#0F4C81] bg-white hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="drivingLicense"
                  checked={formData.drivingLicense === (option === 'Yes')}
                  onChange={() => onRadioChange('drivingLicense', option === 'Yes')}
                  className="sr-only"
                />
                <span className={`text-sm font-bold ${formData.drivingLicense === (option === 'Yes') ? 'text-[#0F4C81]' : 'text-gray-700'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">Do you own a vehicle?</label>
          <div className="flex gap-4">
            {['Yes', 'No'].map((option) => (
              <label
                key={option}
                className={`flex-1 flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.ownVehicle === (option === 'Yes')
                    ? 'border-[#0F4C81] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md'
                    : 'border-gray-300 hover:border-[#0F4C81] bg-white hover:shadow-sm'
                }`}
              >
                <input
                  type="radio"
                  name="ownVehicle"
                  checked={formData.ownVehicle === (option === 'Yes')}
                  onChange={() => onRadioChange('ownVehicle', option === 'Yes')}
                  className="sr-only"
                />
                <span className={`text-sm font-bold ${formData.ownVehicle === (option === 'Yes') ? 'text-[#0F4C81]' : 'text-gray-700'}`}>
                  {option}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-[#0F4C81]/20 rounded-2xl p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => onRadioChange('shiftConfirmation', !formData.shiftConfirmation)}
            className={`w-6 h-6 border-2 rounded-lg flex items-center justify-center transition-all mt-1 shrink-0 hover:shadow-md ${
              formData.shiftConfirmation
                ? 'bg-gradient-to-br from-[#0F4C81] to-[#1565a8] border-[#0F4C81]'
                : 'bg-white border-gray-300'
            }`}
          >
            {formData.shiftConfirmation && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
          </button>
          <div className="flex-1">
            <p className="font-bold text-gray-900 mb-3 text-base">I understand this role may require:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2 font-medium">
                <span className="text-[#0F4C81] font-bold">✓</span> Shift work
              </li>
              <li className="flex items-center gap-2 font-medium">
                <span className="text-[#0F4C81] font-bold">✓</span> Weekend work
              </li>
              <li className="flex items-center gap-2 font-medium">
                <span className="text-[#0F4C81] font-bold">✓</span> Lone working
              </li>
              <li className="flex items-center gap-2 font-medium">
                <span className="text-[#0F4C81] font-bold">✓</span> Travel between service users
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2;