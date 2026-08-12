// components/website/applyjob/Step1.tsx
import React from 'react';
import { Sparkles, Upload, FileText, X, Check } from 'lucide-react';

interface Step1Props {
  formData: any;
  resumeFile: File | null;
  resumeUrl: string;
  coverLetterFile: File | null;
  coverLetterUrl: string;
  isResumeUploading: boolean;
  isUploading: boolean;
  jobDetails: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
  onFileRemove: (type: string) => void;
}

const Step1: React.FC<Step1Props> = ({
  formData,
  resumeFile,
  resumeUrl,
  coverLetterFile,
  coverLetterUrl,
  isResumeUploading,
  isUploading,
  jobDetails,
  onChange,
  onFileUpload,
  onFileRemove
}) => {
  return (
    <div className="space-y-8">
      {/* Resume Upload Section */}
      <div className="relative bg-gradient-to-br from-[#0F4C81]/5 via-blue-50/50 to-indigo-50/30 rounded-2xl p-8 border-2 border-[#0F4C81]/10 shadow-sm">
        <div className="absolute top-4 right-4">
          <div className="bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold px-3 py-1.5 rounded-full">
            SMART FILL
          </div>
        </div>
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#0F4C81] to-[#1565a8] p-3 rounded-xl shadow-lg shadow-[#0F4C81]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our smart system will analyze your resume and automatically populate your information below
              {jobDetails?.requireResume && <span className="text-red-500 ml-1">*</span>}
            </p>
          </div>
        </div>
        
        {resumeFile || resumeUrl ? (
          <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2.5 rounded-xl">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="text-sm text-gray-900 font-semibold block">
                  {resumeFile ? resumeFile.name : 'Resume uploaded'}
                </span>
                <span className="text-xs text-green-700 font-medium">
                  {resumeUrl ? 'Uploaded successfully' : 'Ready to proceed'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onFileRemove('resume')}
              className="bg-white p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all bg-white shadow-sm border-gray-300 hover:border-[#0F4C81] hover:shadow-md">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFileUpload(e, 'resume')}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="py-4">
              <div className="bg-gradient-to-br from-[#0F4C81] to-[#1565a8] p-4 rounded-2xl w-fit mx-auto mb-4 shadow-lg shadow-[#0F4C81]/20">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <p className="text-base text-gray-900 font-bold mb-2">
                Drop your resume here, or click to browse
                {jobDetails?.requireResume && <span className="text-red-500 ml-1">*</span>}
              </p>
              <p className="text-sm text-gray-500 font-medium">
                PDF, DOC, or DOCX • Maximum 10MB
              </p>
              {isResumeUploading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#0F4C81]">
                  <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Processing resume...</span>
                </div>
              )}
              {isUploading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#0F4C81]">
                  <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-gray-200"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-6 py-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
            Personal Information
          </span>
        </div>
      </div>

      {/* ... rest of the personal info fields (same as before) ... */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="+44 7XXX XXXXXX"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2.5">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={onChange}
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium"
        />
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            name="addressLine1"
            type="text"
            value={formData.addressLine1}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Street address"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Address Line 2
          </label>
          <input
            name="addressLine2"
            type="text"
            value={formData.addressLine2}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Apartment, suite, etc. (optional)"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2.5">
              Town / City <span className="text-red-500">*</span>
            </label>
            <input
              name="city"
              type="text"
              value={formData.city}
              onChange={onChange}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
              placeholder="City"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2.5">
              County <span className="text-red-500">*</span>
            </label>
            <input
              name="county"
              type="text"
              value={formData.county}
              onChange={onChange}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
              placeholder="County"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2.5">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              name="postcode"
              type="text"
              value={formData.postcode}
              onChange={onChange}
              className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
              placeholder="Postcode"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Nationality <span className="text-red-500">*</span>
          </label>
          <input
            name="nationality"
            type="text"
            value={formData.nationality}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal"
            placeholder="Your nationality"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Right to Work in UK <span className="text-red-500">*</span>
          </label>
          <select
            name="rightToWork"
            value={formData.rightToWork}
            onChange={onChange}
            className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-bold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10"
          >
            <option value="">Select...</option>
            <option value="British Citizen">British Citizen</option>
            <option value="Indefinite Leave">Indefinite Leave</option>
            <option value="Skilled Worker Visa">Skilled Worker Visa</option>
            <option value="Student Visa">Student Visa</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      
      {/* Cover Letter */}
      <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-100">
        <label className="block text-sm font-bold text-gray-800 mb-3">
          Cover Letter 
          {jobDetails?.requireCoverLetter && <span className="text-red-500 ml-1">*</span>}
          <span className="text-gray-500 font-normal ml-1">(Optional)</span>
        </label>
        {coverLetterFile || coverLetterUrl ? (
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border-2 border-[#0F4C81]/20">
            <div className="flex items-center gap-3">
              <div className="bg-[#0F4C81] p-2 rounded-lg">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-gray-900 font-semibold">
                {coverLetterFile ? coverLetterFile.name : 'Cover letter uploaded'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onFileRemove('coverLetter')}
              className="bg-gray-100 p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all bg-white border-gray-300 hover:border-[#0F4C81] hover:shadow-md">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => onFileUpload(e, 'coverLetter')}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            <div className="py-2">
              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-700 font-semibold mb-1">
                Add your cover letter 
                {jobDetails?.requireCoverLetter && <span className="text-red-500 ml-1">*</span>}
              </p>
              <p className="text-xs text-gray-500 font-medium">PDF, DOC, or DOCX • Max 10MB</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1;