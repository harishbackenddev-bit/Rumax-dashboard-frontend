// components/website/applyjob/Step4.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Upload, FileText, X, Sparkles, Check } from 'lucide-react';

interface Reference {
  id: string;
  fullName: string;
  company: string;
  jobTitle: string;
  phone: string;
  email: string;
  relationship: string;
  yearsKnown: string;
  type: string;
  _aiFilled?: boolean;
  _confidence?: 'high' | 'medium' | 'low';
}

interface Step4Props {
  references: Reference[];
  dbsValid: boolean | null;
  disciplinaryAction: boolean | null;
  unspentConvictions: boolean | null;
  documents: File[];
  jobDetails?: any;
  drivingLicenceFile: File | null;
  drivingLicenceUrl: string;
  dbsCertificateFile: File | null;
  dbsCertificateUrl: string;
  referencesFile: File | null;
  referencesUrl: string;
  isUploading: boolean;
  onAddReference: () => void;
  onRemoveReference: (id: string) => void;
  onReferenceChange: (id: string, field: keyof Reference, value: string) => void;
  onRadioChange: (name: string, value: boolean) => void;
  onDocumentUpload: (files: FileList) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onFileRemove: (type: string) => void;
  aiFilledReferences?: Reference[];
  autoFillSuccess?: boolean;
  onClearAIData?: () => void;
  onApplyAIData?: (referencesData: Reference[]) => void;  // ← Add this
}

const Step4: React.FC<Step4Props> = ({
  references,
  dbsValid,
  disciplinaryAction,
  unspentConvictions,
  documents,
  jobDetails,
  drivingLicenceFile,
  drivingLicenceUrl,
  dbsCertificateFile,
  dbsCertificateUrl,
  referencesFile,
  referencesUrl,
  isUploading,
  onAddReference,
  onRemoveReference,
  onReferenceChange,
  onRadioChange,
  onDocumentUpload,
  onFileUpload,
  onFileRemove,
  aiFilledReferences = [],
  autoFillSuccess = false,
  onClearAIData,
  onApplyAIData  // ← Add this
}) => {
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [appliedAIData, setAppliedAIData] = useState(false);

  useEffect(() => {
    if (aiFilledReferences && aiFilledReferences.length > 0 && autoFillSuccess && !appliedAIData) {
      setShowAISuggestions(true);
    }
  }, [aiFilledReferences, autoFillSuccess]);

  const radioOptions = ['Yes', 'No'];

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
    if (aiFilledReferences && aiFilledReferences.length > 0 && onApplyAIData) {
      onApplyAIData(aiFilledReferences);
      setShowAISuggestions(false);
      setAppliedAIData(true);
    }
  };

  const renderAISuggestionBanner = () => {
    if (!showAISuggestions || aiFilledReferences.length === 0) return null;

    return (
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-[#0F4C81]/20 rounded-xl p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="bg-[#0F4C81] p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                AI Found {aiFilledReferences.length} References from Your Resume
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Would you like to auto-fill these references? You can review and edit each entry.
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

        {/* Preview of AI found references */}
        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
          {aiFilledReferences.slice(0, 4).map((ref, idx) => (
            <div key={idx} className="bg-white rounded-lg p-2 border border-gray-200">
              <span className="text-xs font-semibold text-[#0F4C81]">{ref.fullName || 'Reference'}</span>
              <p className="text-xs text-gray-600">
                {ref.company} · {ref.jobTitle}
              </p>
            </div>
          ))}
          {aiFilledReferences.length > 4 && (
            <div className="bg-white rounded-lg p-2 border border-gray-200 flex items-center justify-center">
              <span className="text-xs text-gray-400">+{aiFilledReferences.length - 4} more</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* AI Suggestion Banner */}
      {renderAISuggestionBanner()}

      {/* Auto-fill success indicator */}
      {autoFillSuccess && appliedAIData && aiFilledReferences.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
          <Check className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            AI references applied! Please review and edit as needed.
          </span>
        </div>
      )}

      {/* References */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">References</h2>
            <p className="text-sm text-gray-600 mt-1">Minimum 2 references required</p>
          </div>
          <button
            type="button"
            onClick={onAddReference}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] text-white rounded-lg hover:bg-[#0d3d66] transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Reference
          </button>
        </div>
        <div className="space-y-4">
          {references.map((ref, index) => (
            <div 
              key={ref.id} 
              className={`border ${ref._aiFilled ? 'border-green-300 bg-green-50/30' : 'border-gray-300'} rounded-xl p-6 relative`}
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center">
                Reference {index + 1} <span className="text-red-500 ml-1">*</span>
                {ref._aiFilled && renderAIBadge(ref)}
                {ref._confidence && getConfidenceBadge(ref._confidence)}
              </h3>
              <button
                type="button"
                onClick={() => onRemoveReference(ref.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={ref.fullName}
                    onChange={(e) => onReferenceChange(ref.id, 'fullName', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="Referee's full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={ref.company}
                    onChange={(e) => onReferenceChange(ref.id, 'company', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="Company/Organization"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={ref.jobTitle}
                    onChange={(e) => onReferenceChange(ref.id, 'jobTitle', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="Their job title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={ref.phone}
                    onChange={(e) => onReferenceChange(ref.id, 'phone', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="Contact number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={ref.email}
                    onChange={(e) => onReferenceChange(ref.id, 'email', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={ref.relationship}
                    onChange={(e) => onReferenceChange(ref.id, 'relationship', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="e.g., Line Manager"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years Known</label>
                  <input
                    type="text"
                    value={ref.yearsKnown}
                    onChange={(e) => onReferenceChange(ref.id, 'yearsKnown', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                    placeholder="e.g., 3 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select
                    value={ref.type}
                    onChange={(e) => onReferenceChange(ref.id, 'type', e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0F4C81] focus:border-transparent outline-none ${ref._aiFilled ? 'border-green-300 bg-green-50/50' : 'border-gray-300'}`}
                  >
                    <option value="">Select type...</option>
                    <option value="Professional">Professional</option>
                    <option value="Manager">Manager</option>
                    <option value="Character Reference">Character Reference</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
          {references.length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p>No references added yet</p>
              <button
                type="button"
                onClick={onAddReference}
                className="mt-2 text-[#0F4C81] hover:underline font-medium"
              >
                Add your first reference
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Job-specific Required Documents */}
      {jobDetails?.requireDrivingLicence && (
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Driving Licence <span className="text-red-500">*</span>
          </label>
          {drivingLicenceFile || drivingLicenceUrl ? (
            <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-900 font-semibold block">
                    {drivingLicenceFile ? drivingLicenceFile.name : 'Driving licence uploaded'}
                  </span>
                  <span className="text-xs text-green-700 font-medium">Uploaded successfully</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFileRemove('drivingLicence')}
                className="bg-white p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-white border-gray-300 hover:border-[#0F4C81] hover:shadow-md">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload(e, 'drivingLicence')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="py-2">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-semibold mb-1">
                  Upload Driving Licence <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500 font-medium">PDF, JPG, PNG • Max 10MB</p>
                {isUploading && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-[#0F4C81]">
                    <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {jobDetails?.requireDBS && (
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            DBS Certificate <span className="text-red-500">*</span>
          </label>
          {dbsCertificateFile || dbsCertificateUrl ? (
            <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-900 font-semibold block">
                    {dbsCertificateFile ? dbsCertificateFile.name : 'DBS certificate uploaded'}
                  </span>
                  <span className="text-xs text-green-700 font-medium">Uploaded successfully</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFileRemove('dbsCertificate')}
                className="bg-white p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-white border-gray-300 hover:border-[#0F4C81] hover:shadow-md">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload(e, 'dbsCertificate')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="py-2">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-semibold mb-1">
                  Upload DBS Certificate <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500 font-medium">PDF, JPG, PNG • Max 10MB</p>
                {isUploading && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-[#0F4C81]">
                    <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {jobDetails?.requireReferences && (
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            References Document <span className="text-red-500">*</span>
          </label>
          {referencesFile || referencesUrl ? (
            <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <div>
                  <span className="text-sm text-gray-900 font-semibold block">
                    {referencesFile ? referencesFile.name : 'References document uploaded'}
                  </span>
                  <span className="text-xs text-green-700 font-medium">Uploaded successfully</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onFileRemove('referencesFile')}
                className="bg-white p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-white border-gray-300 hover:border-[#0F4C81] hover:shadow-md">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => onFileUpload(e, 'referencesFile')}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="py-2">
                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 font-semibold mb-1">
                  Upload References Document <span className="text-red-500">*</span>
                </p>
                <p className="text-xs text-gray-500 font-medium">PDF, DOC, DOCX • Max 10MB</p>
                {isUploading && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-[#0F4C81]">
                    <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm font-medium">Uploading...</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* DBS & Safeguarding */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">DBS & Safeguarding</h2>
        <div className="space-y-6">
          <div className="border border-gray-300 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Do you have a valid DBS? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {radioOptions.map((option) => (
                <label
                  key={option}
                  className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    dbsValid === (option === 'Yes')
                      ? 'border-[#0F4C81] bg-blue-50'
                      : 'border-gray-300 hover:border-[#0F4C81]'
                  }`}
                >
                  <input
                    type="radio"
                    name="dbsValid"
                    checked={dbsValid === (option === 'Yes')}
                    onChange={() => onRadioChange('dbsValid', option === 'Yes')}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${dbsValid === (option === 'Yes') ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Have you ever been subject to disciplinary action? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {radioOptions.map((option) => (
                <label
                  key={option}
                  className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    disciplinaryAction === (option === 'Yes')
                      ? 'border-[#0F4C81] bg-blue-50'
                      : 'border-gray-300 hover:border-[#0F4C81]'
                  }`}
                >
                  <input
                    type="radio"
                    name="disciplinaryAction"
                    checked={disciplinaryAction === (option === 'Yes')}
                    onChange={() => onRadioChange('disciplinaryAction', option === 'Yes')}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${disciplinaryAction === (option === 'Yes') ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="border border-gray-300 rounded-xl p-6">
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Do you have any unspent convictions? <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              {radioOptions.map((option) => (
                <label
                  key={option}
                  className={`flex-1 flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    unspentConvictions === (option === 'Yes')
                      ? 'border-[#0F4C81] bg-blue-50'
                      : 'border-gray-300 hover:border-[#0F4C81]'
                  }`}
                >
                  <input
                    type="radio"
                    name="unspentConvictions"
                    checked={unspentConvictions === (option === 'Yes')}
                    onChange={() => onRadioChange('unspentConvictions', option === 'Yes')}
                    className="sr-only"
                  />
                  <span className={`text-sm font-medium ${unspentConvictions === (option === 'Yes') ? 'text-gray-900' : 'text-gray-700'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Supporting Documents */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Supporting Documents</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload additional documents such as Passport, Right to Work Documents, etc.
        </p>
        <div className="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-gray-300 hover:border-[#0F4C81]">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                onDocumentUpload(e.target.files);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer"
            disabled={isUploading}
          />
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-1">Drag & drop files here, or click to browse</p>
          <p className="text-xs text-gray-500">PDF, DOC, JPG, PNG (Max 10MB per file)</p>
          {documents.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {documents.map((doc, index) => (
                <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {doc.name}
                </span>
              ))}
            </div>
          )}
          {isUploading && (
            <div className="mt-4 flex items-center justify-center gap-2 text-[#0F4C81]">
              <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Uploading documents...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step4;