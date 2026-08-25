// components/website/applyjob/Step3.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, Sparkles, Check } from 'lucide-react';

interface Education {
  id: string;
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  grade: string;
  _aiFilled?: boolean;
  _confidence?: 'high' | 'medium' | 'low';
}

interface Experience {
  id: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  _aiFilled?: boolean;
  _confidence?: 'high' | 'medium' | 'low';
}

interface Training {
  id: string;
  name: string;
  provider: string;
  dateCompleted: string;
  expiryDate: string;
  certificate: string;
  certificateFile: File | null;  // Change from optional to required
  _aiFilled?: boolean;
  _confidence?: 'high' | 'medium' | 'low';
}

interface Registration {
  id: string;
  body: string;
  number: string;
  expiryDate: string;
  _aiFilled?: boolean;
  _confidence?: 'high' | 'medium' | 'low';
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
  aiFilledData?: {
    education?: Education[];
    experience?: Experience[];
    training?: Training[];
    registrations?: Registration[];
  } | null;
  autoFillSuccess?: boolean;
  onClearAIData?: () => void;
  // NEW: Callback to actually apply the AI data
  onApplyAIData?: (data: {
    education?: Education[];
    experience?: Experience[];
    training?: Training[];
    registrations?: Registration[];
  }) => void;
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
  onRegistrationChange,
  aiFilledData,
  autoFillSuccess = false,
  onClearAIData,
  onApplyAIData
}) => {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [appliedAIData, setAppliedAIData] = useState(false);

  useEffect(() => {
    if (aiFilledData && autoFillSuccess && !appliedAIData) {
      const hasData = 
        (aiFilledData.education && aiFilledData.education.length > 0) ||
        (aiFilledData.experience && aiFilledData.experience.length > 0) ||
        (aiFilledData.training && aiFilledData.training.length > 0) ||
        (aiFilledData.registrations && aiFilledData.registrations.length > 0);
      
      if (hasData) {
        setShowAISuggestions(true);
      }
    }
  }, [aiFilledData, autoFillSuccess]);

  const getConfidenceBadge = (confidence?: 'high' | 'medium' | 'low') => {
    if (!confidence) return null;
    const styles = {
      high: { bg: 'bg-green-100', text: 'text-green-700', label: 'High' },
      medium: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Medium' },
      low: { bg: 'bg-red-100', text: 'text-red-700', label: 'Low' }
    };
    const style = styles[confidence];
    return (
      <span className={`text-[10px] px-2 py-0.5 rounded-full ${style.bg} ${style.text} font-medium ml-2`}>
        {style.label} confidence
      </span>
    );
  };

  const renderAIBadge = (item: any) => {
    if (!item._aiFilled) return null;
    return (
      <span className="inline-flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full ml-2">
        <Check className="w-3 h-3" />
        AI Filled
      </span>
    );
  };

  const handleApplyAIData = () => {
    if (aiFilledData && onApplyAIData) {
      onApplyAIData(aiFilledData);
      setShowAISuggestions(false);
      setAppliedAIData(true);
    }
  };

  const renderAISuggestionBanner = () => {
    if (!showAISuggestions || !aiFilledData) return null;

    const eduCount = aiFilledData.education?.length || 0;
    const expCount = aiFilledData.experience?.length || 0;
    const trainCount = aiFilledData.training?.length || 0;
    const regCount = aiFilledData.registrations?.length || 0;
    const total = eduCount + expCount + trainCount + regCount;

    if (total === 0) return null;

    return (
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#0F4C81]/20 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-[#0F4C81] p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                AI Found {total} Items from Your Resume
                <span className="text-xs font-normal text-gray-500">
                  (Education: {eduCount}, Experience: {expCount}, Training: {trainCount}, Registrations: {regCount})
                </span>
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Would you like to auto-fill these fields? You can review and edit each entry.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleApplyAIData}
              className="px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0d3d66] transition-colors text-sm font-medium"
            >
              Apply All
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAISuggestions(false);
                if (onClearAIData) onClearAIData();
              }}
              className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>

        {/* Preview of AI found data */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {aiFilledData.education && aiFilledData.education.length > 0 && (
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <span className="text-xs font-semibold text-[#0F4C81]">Education ({aiFilledData.education.length})</span>
              <ul className="text-xs text-gray-600 mt-1">
                {aiFilledData.education.slice(0, 2).map((edu, idx) => (
                  <li key={idx} className="truncate">• {edu.institution} - {edu.qualification}</li>
                ))}
                {aiFilledData.education.length > 2 && (
                  <li className="text-gray-400">+{aiFilledData.education.length - 2} more</li>
                )}
              </ul>
            </div>
          )}
          {aiFilledData.experience && aiFilledData.experience.length > 0 && (
            <div className="bg-white rounded-lg p-2 border border-gray-200">
              <span className="text-xs font-semibold text-[#0F4C81]">Experience ({aiFilledData.experience.length})</span>
              <ul className="text-xs text-gray-600 mt-1">
                {aiFilledData.experience.slice(0, 2).map((exp, idx) => (
                  <li key={idx} className="truncate">• {exp.position} at {exp.employer}</li>
                ))}
                {aiFilledData.experience.length > 2 && (
                  <li className="text-gray-400">+{aiFilledData.experience.length - 2} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {renderAISuggestionBanner()}

      {autoFillSuccess && appliedAIData && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            AI data applied! Please review and edit as needed.
          </span>
        </div>
      )}

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
            <div key={edu.id} className={`border ${edu._aiFilled ? 'border-green-300 bg-green-50/30' : 'border-gray-300'} rounded-xl p-6 relative`}>
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-900">Education Entry</h3>
                {edu._aiFilled && renderAIBadge(edu)}
                {edu._confidence && getConfidenceBadge(edu._confidence)}
              </div>
              <button
                type="button"
                onClick={() => onRemoveEducation(edu.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => onEducationChange(edu.id, 'institution', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${edu._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="University/College name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    value={edu.qualification}
                    onChange={(e) => onEducationChange(edu.id, 'qualification', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${edu._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
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
            <div key={exp.id} className={`border ${exp._aiFilled ? 'border-green-300 bg-green-50/30' : 'border-gray-300'} rounded-xl p-6 relative`}>
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-900">Experience Entry</h3>
                {exp._aiFilled && renderAIBadge(exp)}
                {exp._confidence && getConfidenceBadge(exp._confidence)}
              </div>
              <button
                type="button"
                onClick={() => onRemoveExperience(exp.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer</label>
                    <input
                      type="text"
                      value={exp.employer}
                      onChange={(e) => onExperienceChange(exp.id, 'employer', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${exp._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                      placeholder="Company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) => onExperienceChange(exp.id, 'position', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${exp._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
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
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none resize-none ${exp._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
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
            <div key={train.id} className={`border ${train._aiFilled ? 'border-green-300 bg-green-50/30' : 'border-gray-300'} rounded-xl p-6 relative`}>
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-900">Training Entry</h3>
                {train._aiFilled && renderAIBadge(train)}
                {train._confidence && getConfidenceBadge(train._confidence)}
              </div>
              <button
                type="button"
                onClick={() => onRemoveTraining(train.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="space-y-4 mt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Training Name</label>
                    <input
                      type="text"
                      value={train.name}
                      onChange={(e) => onTrainingChange(train.id, 'name', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${train._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                      placeholder="e.g., First Aid"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                    <input
                      type="text"
                      value={train.provider}
                      onChange={(e) => onTrainingChange(train.id, 'provider', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${train._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
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
                        {train.certificate ? 'Certificate uploaded' : 'Upload certificate (PDF, JPG, PNG)'}
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
            <div key={reg.id} className={`border ${reg._aiFilled ? 'border-green-300 bg-green-50/30' : 'border-gray-300'} rounded-xl p-6 relative`}>
              <div className="flex items-center">
                <h3 className="text-sm font-semibold text-gray-900">Registration Entry</h3>
                {reg._aiFilled && renderAIBadge(reg)}
                {reg._confidence && getConfidenceBadge(reg._confidence)}
              </div>
              <button
                type="button"
                onClick={() => onRemoveRegistration(reg.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Body</label>
                  <input
                    type="text"
                    value={reg.body}
                    onChange={(e) => onRegistrationChange(reg.id, 'body', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${reg._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="e.g., NMC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                  <input
                    type="text"
                    value={reg.number}
                    onChange={(e) => onRegistrationChange(reg.id, 'number', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${reg._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
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