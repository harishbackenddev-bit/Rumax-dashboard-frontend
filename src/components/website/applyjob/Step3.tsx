// components/website/applyjob/Step3.tsx
import React from 'react';
import { Plus, Trash2, Upload } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface Experience {
  id: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
}

interface Training {
  id: string;
  name: string;
  provider: string;
  dateCompleted: string;
  expiryDate: string;
  certificate: string; // URL string, not File
  certificateFile?: File | null; // Optional for upload
}

interface Registration {
  id: string;
  body: string;
  number: string;
  expiryDate: string;
}

interface Step3Props {
  education: Education[];
  experience: Experience[];
  training: Training[];
  registrations: Registration[];
  jobDetails?: any;
  onAddEducation: () => void;
  onAddExperience: () => void;
  onAddTraining: () => void;
  onAddRegistration: () => void;
  onRemoveEducation: (id: string) => void;
  onRemoveExperience: (id: string) => void;
  onRemoveTraining: (id: string) => void;
  onRemoveRegistration: (id: string) => void;
  onEducationChange: (id: string, field: keyof Education, value: string) => void;
  onExperienceChange: (id: string, field: keyof Experience, value: string | boolean) => void;
  onTrainingChange: (id: string, field: keyof Training | 'certificateFile', value: string | File | null) => void;
  onTrainingCertificateUpload: (id: string, file: File) => void;
  onRegistrationChange: (id: string, field: keyof Registration, value: string) => void;
}

const Step3: React.FC<Step3Props> = ({
  education,
  experience,
  training,
  registrations,
  jobDetails,
  onAddEducation,
  onAddExperience,
  onAddTraining,
  onAddRegistration,
  onRemoveEducation,
  onRemoveExperience,
  onRemoveTraining,
  onRemoveRegistration,
  onEducationChange,
  onExperienceChange,
  onTrainingChange,
  onTrainingCertificateUpload,
  onRegistrationChange
}) => {
  return (
    <div className="space-y-10">
      {/* Education History */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Education History</h2>
          <button
            type="button"
            onClick={onAddEducation}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0d3d66] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Education
          </button>
        </div>
        <div className="space-y-4">
          {education.map((edu) => (
            <div key={edu.id} className="border border-gray-300 rounded-xl p-6 relative">
              <button
                type="button"
                onClick={() => onRemoveEducation(edu.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => onEducationChange(edu.id, 'institution', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    placeholder="University/College name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={edu.qualification}
                    onChange={(e) => onEducationChange(edu.id, 'qualification', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    placeholder="Degree/Diploma"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => onEducationChange(edu.id, 'startDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => onEducationChange(edu.id, 'endDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
                  <input
                    type="text"
                    value={edu.grade}
                    onChange={(e) => onEducationChange(edu.id, 'grade', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    placeholder="e.g., 2:1, Merit, Pass"
                  />
                </div>
              </div>
            </div>
          ))}
          {education.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p>No education entries added yet</p>
              <button
                type="button"
                onClick={onAddEducation}
                className="mt-2 text-[#0F4C81] hover:underline font-medium"
              >
                Add your first education entry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Professional Experience */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Professional Experience</h2>
          <button
            type="button"
            onClick={onAddExperience}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0d3d66] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Experience
          </button>
        </div>
        <div className="space-y-4">
          {experience.map((exp) => (
            <div key={exp.id} className="border border-gray-300 rounded-xl p-6 relative">
              <button
                type="button"
                onClick={() => onRemoveExperience(exp.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                    <input
                      type="text"
                      value={exp.employer}
                      onChange={(e) => onExperienceChange(exp.id, 'employer', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => onExperienceChange(exp.id, 'position', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                      placeholder="Job title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exp.startDate}
                      onChange={(e) => onExperienceChange(exp.id, 'startDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={exp.endDate}
                      onChange={(e) => onExperienceChange(exp.id, 'endDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none disabled:bg-gray-100"
                      disabled={exp.current}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => onExperienceChange(exp.id, 'current', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                  />
                  <span className="text-sm text-gray-700">I currently work here</span>
                </label>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) => onExperienceChange(exp.id, 'responsibilities', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none resize-none"
                    placeholder="Describe your key responsibilities..."
                  />
                </div>
              </div>
            </div>
          ))}
          {experience.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p>No experience entries added yet</p>
              <button
                type="button"
                onClick={onAddExperience}
                className="mt-2 text-[#0F4C81] hover:underline font-medium"
              >
                Add your first experience
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Healthcare Training */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Healthcare Training</h2>
          <button
            type="button"
            onClick={onAddTraining}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0d3d66] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Training
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Examples: Medication Administration, Moving & Handling, Safeguarding Adults, First Aid, Infection Control
        </p>
        <div className="space-y-4">
          {training.map((train) => (
            <div key={train.id} className="border border-gray-300 rounded-xl p-6 relative">
              <button
                type="button"
                onClick={() => onRemoveTraining(train.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Training Name</label>
                    <input
                      type="text"
                      value={train.name}
                      onChange={(e) => onTrainingChange(train.id, 'name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                      placeholder="e.g., First Aid"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input
                      type="text"
                      value={train.provider}
                      onChange={(e) => onTrainingChange(train.id, 'provider', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                      placeholder="Training provider"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Completed</label>
                    <input
                      type="date"
                      value={train.dateCompleted}
                      onChange={(e) => onTrainingChange(train.id, 'dateCompleted', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={train.expiryDate}
                      onChange={(e) => onTrainingChange(train.id, 'expiryDate', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Upload</label>
                  <div className="relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all border-gray-300 hover:border-[#0F4C81]">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          onTrainingCertificateUpload(train.id, file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center justify-center gap-2">
                      <Upload className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {train.certificate ? train.certificate : 'Upload certificate (PDF, JPG, PNG)'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {training.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p>No training entries added yet</p>
              <button
                type="button"
                onClick={onAddTraining}
                className="mt-2 text-[#0F4C81] hover:underline font-medium"
              >
                Add your first training
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Professional Registrations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Professional Registrations</h2>
          <button
            type="button"
            onClick={onAddRegistration}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0d3d66] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Registration
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">Examples: NMC, HCPC, GMC</p>
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div key={reg.id} className="border border-gray-300 rounded-xl p-6 relative">
              <button
                type="button"
                onClick={() => onRemoveRegistration(reg.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Body</label>
                  <input
                    type="text"
                    value={reg.body}
                    onChange={(e) => onRegistrationChange(reg.id, 'body', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    placeholder="e.g., NMC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={reg.number}
                    onChange={(e) => onRegistrationChange(reg.id, 'number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                    placeholder="Registration number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={reg.expiryDate}
                    onChange={(e) => onRegistrationChange(reg.id, 'expiryDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
          {registrations.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p>No registrations added yet</p>
              <button
                type="button"
                onClick={onAddRegistration}
                className="mt-2 text-[#0F4C81] hover:underline font-medium"
              >
                Add your first registration
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step3;