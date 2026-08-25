// components/website/applyjob/Step1.tsx
import React, { useState } from 'react';
import { Sparkles, Upload, FileText, X, Check, Loader2, AlertCircle } from 'lucide-react';
import resumeParserService from '@/utils/resumeParser';

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
  setFormData?: (data: any) => void;
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
  onFileRemove,
  setFormData
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [autoFillSuccess, setAutoFillSuccess] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<any>(null);

  // For Vite - use import.meta.env
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  
  console.log("🔑 API Key configured:", !!apiKey);
  console.log("📝 API Key length:", apiKey.length);
  console.log("🌐 All Vite env vars:", import.meta.env);

  // Handle file upload with AI auto-fill
  const handleFileUploadWithAI = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📎 File selected:', file.name, file.type, file.size);

    // Call the original upload handler
    onFileUpload(e, type);

    if (type === 'resume' && setFormData) {
      setIsProcessing(true);
      setParseError(null);
      
      try {
        // Check if API key exists
        if (!apiKey) {
          console.error('❌ API Key is missing!');
          throw new Error(
            'OpenAI API key not configured. Please:\n' +
            '1. Create a .env file in your project root\n' +
            '2. Add VITE_OPENAI_API_KEY=your_api_key_here\n' +
            '3. Restart your development server'
          );
        }

        console.log('🔄 Calling resume parser with AI...');
        const parsedData = await resumeParserService.parseResumeWithAI(file, apiKey);
        console.log('✅ Parsed data received:', parsedData);
        
        setParsedData(parsedData);
        
        const updatedFormData = {
          ...formData,
          firstName: parsedData.firstName || formData.firstName || '',
          lastName: parsedData.lastName || formData.lastName || '',
          email: parsedData.email || formData.email || '',
          phone: parsedData.phone || formData.phone || '',
          dateOfBirth: parsedData.dateOfBirth || formData.dateOfBirth || '',
          addressLine1: parsedData.addressLine1 || formData.addressLine1 || '',
          addressLine2: parsedData.addressLine2 || formData.addressLine2 || '',
          city: parsedData.city || formData.city || '',
          county: parsedData.county || formData.county || '',
          postcode: parsedData.postcode || formData.postcode || '',
          nationality: parsedData.nationality || formData.nationality || '',
          rightToWork: parsedData.rightToWork || formData.rightToWork || '',
        };
        
        setFormData(updatedFormData);
        setAutoFillSuccess(true);
        setTimeout(() => setAutoFillSuccess(false), 10000);
      } catch (error: any) {
        console.error('❌ AI parsing failed:', error);
        setParseError(error.message || 'Failed to parse resume. Please fill in the details manually.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  // Helper function to get input className with auto-fill highlighting
  const getInputClassName = (fieldName: string) => {
    const baseClass = "w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-normal";
    const autoFilled = autoFillSuccess && formData[fieldName];
    return `${baseClass} ${autoFilled ? 'border-green-400 bg-green-50' : 'border-gray-200'}`;
  };

  return (
    <div className="space-y-8">
      {/* Resume Upload Section */}
      <div className="relative bg-gradient-to-br from-[#0F4C81]/5 via-blue-50/50 to-indigo-50/30 rounded-2xl p-8 border-2 border-[#0F4C81]/10 shadow-sm">
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {autoFillSuccess && (
            <div className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
              <Check className="w-3 h-3" />
              AI Auto-filled!
            </div>
          )}
          <div className="bg-[#0F4C81]/10 text-[#0F4C81] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI SMART FILL
          </div>
        </div>
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#0F4C81] to-[#1565a8] p-3 rounded-xl shadow-lg shadow-[#0F4C81]/20">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Our AI-powered system will analyze your resume and automatically populate your information below
              {jobDetails?.requireResume && <span className="text-red-500 ml-1">*</span>}
            </p>
            {!apiKey && (
              <div className="mt-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">OpenAI API Key Not Configured</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    To enable AI auto-fill, create a <code className="bg-yellow-100 px-1 py-0.5 rounded">.env</code> file in your project root and add:
                  </p>
                  <code className="text-xs bg-yellow-100 px-2 py-1 rounded block mt-1">
                    VITE_OPENAI_API_KEY=your_api_key_here
                  </code>
                  <p className="text-xs text-yellow-700 mt-1">Then restart your development server.</p>
                </div>
              </div>
            )}
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
                <span className="text-xs text-green-700 font-medium flex items-center gap-1">
                  {resumeUrl ? 'Uploaded successfully' : 'Ready to proceed'}
                  {autoFillSuccess && (
                    <span className="flex items-center gap-1 ml-1 bg-green-200 px-2 py-0.5 rounded-full text-green-800">
                      <Check className="w-3 h-3" />
                      AI analyzed
                    </span>
                  )}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onFileRemove('resume');
                setAutoFillSuccess(false);
                setParsedData(null);
                setParseError(null);
              }}
              className="bg-white p-2 rounded-lg text-red-500 hover:text-red-700 hover:bg-red-50 transition-all shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all bg-white shadow-sm border-gray-300 hover:border-[#0F4C81] hover:shadow-md">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUploadWithAI(e, 'resume')}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={isUploading || isProcessing}
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
                PDF, DOC, DOCX, or TXT • Maximum 10MB
              </p>
              {isProcessing && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#0F4C81]">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">AI is analyzing your resume...</span>
                </div>
              )}
              {isResumeUploading && !isProcessing && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#0F4C81]">
                  <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Processing resume...</span>
                </div>
              )}
              {isUploading && !isProcessing && !isResumeUploading && (
                <div className="mt-3 flex items-center justify-center gap-2 text-[#0F4C81]">
                  <div className="w-4 h-4 border-2 border-[#0F4C81] border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm font-medium">Uploading...</span>
                </div>
              )}
            </div>
          </div>
        )}

        {parseError && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-red-500 text-xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-800">AI Parsing Failed</p>
              <p className="text-xs text-red-600 whitespace-pre-line">{parseError}</p>
              <p className="text-xs text-red-600 mt-1">Please fill in the details manually below.</p>
            </div>
          </div>
        )}
        
        {autoFillSuccess && parsedData && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <div className="bg-green-500 p-1.5 rounded-full flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-green-800">Resume analyzed successfully!</p>
              <p className="text-xs text-green-700 mt-1">
                We've extracted and filled in your personal information from the resume. 
                Please review and correct if needed.
              </p>
              {parsedData.skills && parsedData.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {parsedData.skills.slice(0, 5).map((skill: string, index: number) => (
                    <span key={index} className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                      {skill}
                    </span>
                  ))}
                  {parsedData.skills.length > 5 && (
                    <span className="text-xs text-green-600">+{parsedData.skills.length - 5} more</span>
                  )}
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

      {/* Personal Info Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            type="text"
            value={formData.firstName || ''}
            onChange={onChange}
            className={getInputClassName('firstName')}
            placeholder="Enter your first name"
          />
          {autoFillSuccess && formData.firstName && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            type="text"
            value={formData.lastName || ''}
            onChange={onChange}
            className={getInputClassName('lastName')}
            placeholder="Enter your last name"
          />
          {autoFillSuccess && formData.lastName && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
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
            value={formData.email || ''}
            onChange={onChange}
            className={getInputClassName('email')}
            placeholder="your.email@example.com"
          />
          {autoFillSuccess && formData.email && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={onChange}
            className={getInputClassName('phone')}
            placeholder="+44 7XXX XXXXXX"
          />
          {autoFillSuccess && formData.phone && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-800 mb-2.5">
          Date of Birth <span className="text-red-500">*</span>
        </label>
        <input
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth || ''}
          onChange={onChange}
          className={getInputClassName('dateOfBirth')}
        />
        {autoFillSuccess && formData.dateOfBirth && (
          <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            name="addressLine1"
            type="text"
            value={formData.addressLine1 || ''}
            onChange={onChange}
            className={getInputClassName('addressLine1')}
            placeholder="Street address"
          />
          {autoFillSuccess && formData.addressLine1 && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Address Line 2
          </label>
          <input
            name="addressLine2"
            type="text"
            value={formData.addressLine2 || ''}
            onChange={onChange}
            className={getInputClassName('addressLine2')}
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
              value={formData.city || ''}
              onChange={onChange}
              className={getInputClassName('city')}
              placeholder="City"
            />
            {autoFillSuccess && formData.city && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2.5">
              County <span className="text-red-500">*</span>
            </label>
            <input
              name="county"
              type="text"
              value={formData.county || ''}
              onChange={onChange}
              className={getInputClassName('county')}
              placeholder="County"
            />
            {autoFillSuccess && formData.county && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2.5">
              Postcode <span className="text-red-500">*</span>
            </label>
            <input
              name="postcode"
              type="text"
              value={formData.postcode || ''}
              onChange={onChange}
              className={getInputClassName('postcode')}
              placeholder="Postcode"
            />
            {autoFillSuccess && formData.postcode && (
              <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
            )}
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
            value={formData.nationality || ''}
            onChange={onChange}
            className={getInputClassName('nationality')}
            placeholder="Your nationality"
          />
          {autoFillSuccess && formData.nationality && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2.5">
            Right to Work in UK <span className="text-red-500">*</span>
          </label>
          <select
            name="rightToWork"
            value={formData.rightToWork || ''}
            onChange={onChange}
            className={`w-full px-5 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-[#0F4C81]/10 focus:border-[#0F4C81] outline-none transition-all bg-gray-50 hover:bg-white hover:border-gray-300 font-bold appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%236b7280%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22M6%208l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.5em_1.5em] bg-[right_0.5rem_center] bg-no-repeat pr-10 ${
              autoFillSuccess && formData.rightToWork ? 'border-green-400 bg-green-50' : 'border-gray-200'
            }`}
          >
            <option value="">Select...</option>
            <option value="British Citizen">British Citizen</option>
            <option value="Indefinite Leave">Indefinite Leave</option>
            <option value="Skilled Worker Visa">Skilled Worker Visa</option>
            <option value="Student Visa">Student Visa</option>
            <option value="Other">Other</option>
          </select>
          {autoFillSuccess && formData.rightToWork && (
            <p className="text-xs text-green-600 mt-1">✓ Auto-filled from resume</p>
          )}
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