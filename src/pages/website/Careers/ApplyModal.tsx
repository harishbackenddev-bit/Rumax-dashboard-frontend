// components/admin/candidate/ApplyModal.tsx
import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FileText,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2,
  Eye,
  Download,
  Building,
  Clock,
  Award,
  Globe,
  Home,
  Hash,
  Cake,
  GraduationCap,
  Wrench
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface JobDetails {
  _id: string;
  jobTitle: string;
  availability: string;
  experience: string;
  contractType: string;
  locations: string[];
  salaryMin: string;
  salaryMax: string;
  status: string;
  deadline: string;
  notes: string;
  overview: string;
  responsibilities: { id: string; text: string }[];
  requirements: { id: string; text: string }[];
  benefits: { id: string; text: string }[];
  department?: string;
  jobType?: string;
  isRemote?: boolean;
  createdAt: string;
  updatedAt: string;
  requireResume?: boolean;
  requireCoverLetter?: boolean;
  requireDrivingLicence?: boolean;
  requireDBS?: boolean;
  requireReferences?: boolean;
}

interface Candidate {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  location: string;
  availability: string;
  appliedDate: string;
  score: number;
  status: string;
  initials: string;
  color: string;
  nationality?: string;
  rightToWork?: boolean;
  address?: string;
  city?: string;
  country?: string;
  postcode?: string;
  dob?: string;
  jobId?: string;
  jobTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  token?: string;
}

interface ApplyModalProps {
  candidate: Candidate | null;
  jobDetails: JobDetails | null;
  isOpen: boolean;
  onClose: () => void;
  onApplySuccess?: () => void;
}

const ApplyModal: React.FC<ApplyModalProps> = ({ 
  candidate, 
  jobDetails,
  isOpen, 
  onClose,
  onApplySuccess 
}) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  // Candidate form data
  const [candidateData, setCandidateData] = useState({
    name: candidate?.name || '',
    email: candidate?.email || '',
    phone: candidate?.phone || '',
    role: candidate?.role || jobDetails?.jobTitle || '',
    location: candidate?.location || (jobDetails?.locations ? jobDetails.locations[0] : ''),
    availability: candidate?.availability || 'Immediate',
    nationality: candidate?.nationality || '',
    rightToWork: candidate?.rightToWork || false,
    address: candidate?.address || '',
    city: candidate?.city || '',
    country: candidate?.country || '',
    postcode: candidate?.postcode || '',
    dob: candidate?.dob || '',
    skills: [] as string[],
    experience: 0,
    education: '',
    resume: null as File | null,
    coverLetterFile: null as File | null,
    drivingLicence: null as File | null,
    dbsCertificate: null as File | null,
    referencesFile: null as File | null
  });

  // Application form data
  const [formData, setFormData] = useState({
    coverLetter: '',
    additionalNotes: '',
    availableFrom: '',
    expectedSalary: '',
    noticePeriod: '',
    referencesText: '',
    agreeTerms: false
  });

  if (!isOpen) return null;

  const handleCandidateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setCandidateData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setCandidateData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Check if a field is required by the job
  const isRequired = (field: string): boolean => {
    if (!jobDetails) return false;
    switch(field) {
      case 'resume': return jobDetails.requireResume || false;
      case 'coverLetterFile': return jobDetails.requireCoverLetter || false;
      case 'drivingLicence': return jobDetails.requireDrivingLicence || false;
      case 'dbsCertificate': return jobDetails.requireDBS || false;
      case 'referencesFile': return jobDetails.requireReferences || false;
      default: return false;
    }
  };

  // Get required fields list for display
  const getRequiredFields = () => {
    const fields: string[] = [];
    if (jobDetails?.requireResume) fields.push('Resume/CV');
    if (jobDetails?.requireCoverLetter) fields.push('Cover Letter File');
    if (jobDetails?.requireDrivingLicence) fields.push('Driving Licence');
    if (jobDetails?.requireDBS) fields.push('DBS Certificate');
    if (jobDetails?.requireReferences) fields.push('References Document');
    return fields;
  };

  // Validate required fields based on job requirements
  const validateRequiredFields = () => {
    const errors: string[] = [];

    // Basic required fields
    if (!candidateData.name) errors.push('Full Name is required');
    if (!candidateData.email) errors.push('Email is required');
    if (!candidateData.role) errors.push('Role is required');
    if (!candidateData.location) errors.push('Location is required');
    if (!formData.coverLetter) errors.push('Cover Letter text is required');
    if (!formData.availableFrom) errors.push('Available From date is required');
    if (!formData.expectedSalary) errors.push('Expected Salary is required');

    // Job-specific required fields (based on jobDetails)
    if (jobDetails?.requireResume && !candidateData.resume) {
      errors.push('Resume/CV is required for this position');
    }
    if (jobDetails?.requireCoverLetter && !candidateData.coverLetterFile) {
      errors.push('Cover Letter file is required for this position');
    }
    if (jobDetails?.requireDrivingLicence && !candidateData.drivingLicence) {
      errors.push('Driving Licence is required for this position');
    }
    if (jobDetails?.requireDBS && !candidateData.dbsCertificate) {
      errors.push('DBS Certificate is required for this position');
    }
    if (jobDetails?.requireReferences && !candidateData.referencesFile) {
      errors.push('References document is required for this position');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    // Validate all required fields
    const validationErrors = validateRequiredFields();
    if (validationErrors.length > 0) {
      validationErrors.forEach(err => toast.error(err));
      return;
    }

    try {
      setLoading(true);

      // Step 1: Create/Register candidate
      const createPayload = {
        name: candidateData.name,
        email: candidateData.email,
        phone: candidateData.phone,
        role: candidateData.role,
        location: candidateData.location,
        availability: candidateData.availability,
        nationality: candidateData.nationality,
        rightToWork: candidateData.rightToWork,
        address: candidateData.address,
        city: candidateData.city,
        country: candidateData.country,
        postcode: candidateData.postcode,
        dob: candidateData.dob,
        skills: candidateData.skills,
        experience: candidateData.experience,
        education: candidateData.education
      };

      const createResponse = await axios.post(`${API_URL}/api/admin/candidates`, createPayload);

      if (!createResponse.data.success) {
        toast.error(createResponse.data.message || 'Failed to create candidate profile');
        return;
      }

      const candidateId = createResponse.data.data._id;
      const token = createResponse.data.data.token;
      
      if (token) {
        localStorage.setItem('candidateToken', token);
        localStorage.setItem('candidateId', candidateId);
      }
      
      toast.success('Candidate profile created successfully!');

      // Step 2: Apply for the job with job details
      const applyPayload = {
        candidateId,
        coverLetter: formData.coverLetter,
        additionalNotes: formData.additionalNotes,
        availableFrom: formData.availableFrom,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
        references: formData.referencesText,
        jobTitle: candidateData.role,
        jobId: jobDetails?._id || null,
        jobDetails: {
          title: jobDetails?.jobTitle || null,
          location: jobDetails?.locations ? jobDetails.locations.join(', ') : null,
          contractType: jobDetails?.contractType || null,
          salaryMin: jobDetails?.salaryMin || null,
          salaryMax: jobDetails?.salaryMax || null,
          experience: jobDetails?.experience || null,
          availability: jobDetails?.availability || null,
          requireResume: jobDetails?.requireResume || false,
          requireCoverLetter: jobDetails?.requireCoverLetter || false,
          requireDrivingLicence: jobDetails?.requireDrivingLicence || false,
          requireDBS: jobDetails?.requireDBS || false,
          requireReferences: jobDetails?.requireReferences || false
        }
      };

      const applyResponse = await axios.post(`${API_URL}/api/admin/candidates/apply`, applyPayload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (applyResponse.data.success) {
        toast.success('Application submitted successfully!');
        onApplySuccess?.();
        onClose();
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Active': '#2563eb',
      'In Review': '#ca8a04',
      'Interview Scheduled': '#7c3aed',
      'Offer Sent': '#ea580c',
      'Hired': '#16a34a',
      'Rejected': '#dc2626'
    };
    return colors[status] || '#6b7280';
  };

  // Get job location display
  const getJobLocation = () => {
    if (jobDetails?.isRemote) return 'Remote';
    if (jobDetails?.locations) return jobDetails.locations.join(', ');
    return '';
  };

  // Render candidate info form (Step 1)
  const renderCandidateInfo = () => (
    <div className="apply-modal__step-content">
      {/* Job Info Banner */}
      {jobDetails && (
        <div className="apply-modal__job-banner" style={{ 
          background: '#f0f7ff', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          border: '1px solid #bfdbfe'
        }}>
          <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
            Applying for: {jobDetails.jobTitle}
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#3b82f6' }}>
            {getJobLocation()} • {jobDetails.contractType || 'Full-time'} • £{jobDetails.salaryMin} - £{jobDetails.salaryMax}
          </p>
          {getRequiredFields().length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                color: '#dc2626',
                background: '#fef2f2',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                Required: {getRequiredFields().join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="apply-modal__candidate-card">
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
          <User size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Personal Information
        </h4>
        <div className="apply-modal__grid-2">
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">
              Full Name <span className="apply-modal__required">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={candidateData.name}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. John Doe"
              required
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">
              Email <span className="apply-modal__required">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={candidateData.email}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. john@email.com"
              required
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Phone</label>
            <input
              type="text"
              name="phone"
              value={candidateData.phone}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. +44 7700 900000"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">
              Role <span className="apply-modal__required">*</span>
            </label>
            <input
              type="text"
              name="role"
              value={candidateData.role}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. UX Designer"
              required
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">
              Location <span className="apply-modal__required">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={candidateData.location}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. London"
              required
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">
              Availability <span className="apply-modal__required">*</span>
            </label>
            <select
              name="availability"
              value={candidateData.availability}
              onChange={handleCandidateChange}
              className="apply-modal__select"
              required
            >
              <option value="Immediate">Immediate</option>
              <option value="1 week">1 week</option>
              <option value="2 weeks">2 weeks</option>
              <option value="1 month">1 month</option>
              <option value="2 months">2 months</option>
              <option value="3 months">3 months</option>
            </select>
          </div>
        </div>
      </div>

      <div className="apply-modal__candidate-card">
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
          <Globe size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Additional Details
        </h4>
        <div className="apply-modal__grid-2">
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Nationality</label>
            <input
              type="text"
              name="nationality"
              value={candidateData.nationality}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. British"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Date of Birth</label>
            <input
              type="text"
              name="dob"
              value={candidateData.dob}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. 15 March 1990"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Address</label>
            <input
              type="text"
              name="address"
              value={candidateData.address}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. 123 Main Street"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">City</label>
            <input
              type="text"
              name="city"
              value={candidateData.city}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. London"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Country</label>
            <input
              type="text"
              name="country"
              value={candidateData.country}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. United Kingdom"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Postcode</label>
            <input
              type="text"
              name="postcode"
              value={candidateData.postcode}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. SW1A 1AA"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">
              <input
                type="checkbox"
                name="rightToWork"
                checked={candidateData.rightToWork}
                onChange={handleCandidateChange}
                style={{ marginRight: '8px' }}
              />
              Right to Work in UK
            </label>
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Years of Experience</label>
            <input
              type="number"
              name="experience"
              value={candidateData.experience}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. 5"
              min="0"
            />
          </div>
        </div>
      </div>

      <div className="apply-modal__candidate-card">
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
          <GraduationCap size={16} style={{ display: 'inline', marginRight: '8px' }} />
          Education & Skills
        </h4>
        <div className="apply-modal__grid-2">
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Education</label>
            <input
              type="text"
              name="education"
              value={candidateData.education}
              onChange={handleCandidateChange}
              className="apply-modal__input"
              placeholder="e.g. Bachelor's in Computer Science"
            />
          </div>
          <div className="apply-modal__form-group">
            <label className="apply-modal__label">Skills (comma separated)</label>
            <input
              type="text"
              name="skills"
              value={candidateData.skills.join(', ')}
              onChange={(e) => {
                const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setCandidateData(prev => ({ ...prev, skills }));
              }}
              className="apply-modal__input"
              placeholder="e.g. React, Node.js, TypeScript"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Render application form (Step 2)
  const renderApplicationForm = () => (
    <div className="apply-modal__step-content">
      {jobDetails && (
        <div className="apply-modal__job-banner" style={{ 
          background: '#f0f7ff', 
          padding: '12px 16px', 
          borderRadius: '8px', 
          marginBottom: '16px',
          border: '1px solid #bfdbfe'
        }}>
          <h4 style={{ margin: '0', fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
            Applying for: {jobDetails.jobTitle}
          </h4>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#3b82f6' }}>
            {getJobLocation()} • {jobDetails.contractType || 'Full-time'} • £{jobDetails.salaryMin} - £{jobDetails.salaryMax}
          </p>
          {getRequiredFields().length > 0 && (
            <div style={{ marginTop: '8px' }}>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: 600, 
                color: '#dc2626',
                background: '#fef2f2',
                padding: '2px 8px',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                Required: {getRequiredFields().join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      {/* <div className="apply-modal__form-group">
        <label className="apply-modal__label">
          Cover Letter Text <span className="apply-modal__required">*</span>
        </label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleFormChange}
          rows={5}
          className="apply-modal__textarea"
          placeholder="Why are you interested in this position? What makes you a good fit?"
          required
        />
      </div> */}

      <div className="apply-modal__form-group">
        <label className="apply-modal__label">Additional Notes</label>
        <textarea
          name="additionalNotes"
          value={formData.additionalNotes}
          onChange={handleFormChange}
          rows={3}
          className="apply-modal__textarea"
          placeholder="Any additional information you'd like to share..."
        />
      </div>

      <div className="apply-modal__grid-2">
        <div className="apply-modal__form-group">
          <label className="apply-modal__label">
            Available From <span className="apply-modal__required">*</span>
          </label>
          <input
            type="date"
            name="availableFrom"
            value={formData.availableFrom}
            onChange={handleFormChange}
            className="apply-modal__input"
            required
          />
        </div>

        <div className="apply-modal__form-group">
          <label className="apply-modal__label">
            Expected Salary <span className="apply-modal__required">*</span>
          </label>
          <input
            type="text"
            name="expectedSalary"
            value={formData.expectedSalary}
            onChange={handleFormChange}
            className="apply-modal__input"
            placeholder="e.g. £45,000 - £55,000"
            required
          />
        </div>

        <div className="apply-modal__form-group">
          <label className="apply-modal__label">Notice Period</label>
          <select
            name="noticePeriod"
            value={formData.noticePeriod}
            onChange={handleFormChange}
            className="apply-modal__select"
          >
            <option value="">Select notice period...</option>
            <option value="Immediate">Immediate</option>
            <option value="1 week">1 week</option>
            <option value="2 weeks">2 weeks</option>
            <option value="1 month">1 month</option>
            <option value="2 months">2 months</option>
            <option value="3 months">3 months</option>
          </select>
        </div>

        {/* <div className="apply-modal__form-group">
          <label className="apply-modal__label">References Text</label>
          <input
            type="text"
            name="referencesText"
            value={formData.referencesText}
            onChange={handleFormChange}
            className="apply-modal__input"
            placeholder="e.g. 2 professional references available"
          />
        </div> */}
      </div>

      {/* Required Documents Uploads - Only show if required by job */}
      <div className="apply-modal__form-group">
        <label className="apply-modal__label">
          Required Documents
          {getRequiredFields().length > 0 && (
            <span style={{ fontSize: '12px', color: '#dc2626', marginLeft: '8px' }}>
              * {getRequiredFields().join(', ')}
            </span>
          )}
        </label>
        
        {/* Resume/CV - Only if required by job */}
        {isRequired('resume') && (
          <div className="apply-modal__upload" style={{ 
            borderColor: !candidateData.resume ? '#dc2626' : '#e2e8f0',
            borderWidth: '2px',
            background: !candidateData.resume ? '#fef2f2' : 'transparent',
            marginBottom: '12px'
          }}>
            <Upload size={32} className="apply-modal__upload-icon" />
            <p className="apply-modal__upload-text">
              Resume/CV <span className="apply-modal__required">*</span>
            </p>
            <p className="apply-modal__upload-hint">
              PDF, DOC, DOCX up to 5MB
            </p>
            <input
              type="file"
              name="resume"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="apply-modal__file-input"
              style={{ display: 'none' }}
              id="resume-upload"
            />
            <label htmlFor="resume-upload" className="apply-modal__upload-btn" style={{ cursor: 'pointer' }}>
              {candidateData.resume ? '✅ File Selected' : 'Browse Files'}
            </label>
            {candidateData.resume && (
              <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                {candidateData.resume.name} uploaded
              </p>
            )}
          </div>
        )}

        {/* Cover Letter File - Only if required by job */}
        {isRequired('coverLetterFile') && (
          <div className="apply-modal__upload" style={{ 
            borderColor: !candidateData.coverLetterFile ? '#dc2626' : '#e2e8f0',
            borderWidth: '2px',
            background: !candidateData.coverLetterFile ? '#fef2f2' : 'transparent',
            marginBottom: '12px'
          }}>
            <Upload size={32} className="apply-modal__upload-icon" />
            <p className="apply-modal__upload-text">
              Cover Letter File <span className="apply-modal__required">*</span>
            </p>
            <p className="apply-modal__upload-hint">
              PDF, DOC, DOCX up to 5MB
            </p>
            <input
              type="file"
              name="coverLetterFile"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="apply-modal__file-input"
              style={{ display: 'none' }}
              id="coverLetter-upload"
            />
            <label htmlFor="coverLetter-upload" className="apply-modal__upload-btn" style={{ cursor: 'pointer' }}>
              {candidateData.coverLetterFile ? '✅ File Selected' : 'Browse Files'}
            </label>
            {candidateData.coverLetterFile && (
              <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                {candidateData.coverLetterFile.name} uploaded
              </p>
            )}
          </div>
        )}

        {/* Driving Licence - Only if required by job */}
        {isRequired('drivingLicence') && (
          <div className="apply-modal__upload" style={{ 
            borderColor: !candidateData.drivingLicence ? '#dc2626' : '#e2e8f0',
            borderWidth: '2px',
            background: !candidateData.drivingLicence ? '#fef2f2' : 'transparent',
            marginBottom: '12px'
          }}>
            <Upload size={32} className="apply-modal__upload-icon" />
            <p className="apply-modal__upload-text">
              Driving Licence <span className="apply-modal__required">*</span>
            </p>
            <p className="apply-modal__upload-hint">
              PDF, JPG, PNG up to 5MB
            </p>
            <input
              type="file"
              name="drivingLicence"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="apply-modal__file-input"
              style={{ display: 'none' }}
              id="driving-upload"
            />
            <label htmlFor="driving-upload" className="apply-modal__upload-btn" style={{ cursor: 'pointer' }}>
              {candidateData.drivingLicence ? '✅ File Selected' : 'Browse Files'}
            </label>
            {candidateData.drivingLicence && (
              <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                {candidateData.drivingLicence.name} uploaded
              </p>
            )}
          </div>
        )}

        {/* DBS Certificate - Only if required by job */}
        {isRequired('dbsCertificate') && (
          <div className="apply-modal__upload" style={{ 
            borderColor: !candidateData.dbsCertificate ? '#dc2626' : '#e2e8f0',
            borderWidth: '2px',
            background: !candidateData.dbsCertificate ? '#fef2f2' : 'transparent',
            marginBottom: '12px'
          }}>
            <Upload size={32} className="apply-modal__upload-icon" />
            <p className="apply-modal__upload-text">
              DBS Certificate <span className="apply-modal__required">*</span>
            </p>
            <p className="apply-modal__upload-hint">
              PDF, JPG, PNG up to 5MB
            </p>
            <input
              type="file"
              name="dbsCertificate"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              className="apply-modal__file-input"
              style={{ display: 'none' }}
              id="dbs-upload"
            />
            <label htmlFor="dbs-upload" className="apply-modal__upload-btn" style={{ cursor: 'pointer' }}>
              {candidateData.dbsCertificate ? '✅ File Selected' : 'Browse Files'}
            </label>
            {candidateData.dbsCertificate && (
              <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                {candidateData.dbsCertificate.name} uploaded
              </p>
            )}
          </div>
        )}

        {/* References File - Only if required by job */}
        {isRequired('referencesFile') && (
          <div className="apply-modal__upload" style={{ 
            borderColor: !candidateData.referencesFile ? '#dc2626' : '#e2e8f0',
            borderWidth: '2px',
            background: !candidateData.referencesFile ? '#fef2f2' : 'transparent',
            marginBottom: '12px'
          }}>
            <Upload size={32} className="apply-modal__upload-icon" />
            <p className="apply-modal__upload-text">
              References Document <span className="apply-modal__required">*</span>
            </p>
            <p className="apply-modal__upload-hint">
              PDF, DOC, DOCX up to 5MB
            </p>
            <input
              type="file"
              name="referencesFile"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              className="apply-modal__file-input"
              style={{ display: 'none' }}
              id="references-upload"
            />
            <label htmlFor="references-upload" className="apply-modal__upload-btn" style={{ cursor: 'pointer' }}>
              {candidateData.referencesFile ? '✅ File Selected' : 'Browse Files'}
            </label>
            {candidateData.referencesFile && (
              <p style={{ fontSize: '12px', color: '#16a34a', marginTop: '4px' }}>
                {candidateData.referencesFile.name} uploaded
              </p>
            )}
          </div>
        )}

        {/* Show message if no documents are required */}
        {getRequiredFields().length === 0 && (
          <div style={{ 
            padding: '16px', 
            textAlign: 'center', 
            color: '#64748b',
            background: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              No additional documents are required for this position.
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // Render review (Step 3)
  const renderReview = () => (
    <div className="apply-modal__step-content">
      <h3 className="apply-modal__review-title">Review Your Application</h3>

      {jobDetails && (
        <div className="apply-modal__review" style={{ border: '2px solid #bfdbfe' }}>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 600, color: '#1e40af' }}>
            Job Details
          </h4>
          <div className="apply-modal__review-grid">
            <div>
              <p className="apply-modal__review-label">Position</p>
              <p className="apply-modal__review-value">{jobDetails.jobTitle}</p>
            </div>
            <div>
              <p className="apply-modal__review-label">Location</p>
              <p className="apply-modal__review-value">{getJobLocation()}</p>
            </div>
            <div>
              <p className="apply-modal__review-label">Contract Type</p>
              <p className="apply-modal__review-value">{jobDetails.contractType || 'Full-time'}</p>
            </div>
            <div>
              <p className="apply-modal__review-label">Salary</p>
              <p className="apply-modal__review-value">£{jobDetails.salaryMin} - £{jobDetails.salaryMax}</p>
            </div>
          </div>
        </div>
      )}

      <div className="apply-modal__review">
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
          Candidate Information
        </h4>
        <div className="apply-modal__review-grid">
          <div>
            <p className="apply-modal__review-label">Name</p>
            <p className="apply-modal__review-value">{candidateData.name}</p>
          </div>
          <div>
            <p className="apply-modal__review-label">Email</p>
            <p className="apply-modal__review-value">{candidateData.email}</p>
          </div>
          <div>
            <p className="apply-modal__review-label">Role</p>
            <p className="apply-modal__review-value">{candidateData.role}</p>
          </div>
          <div>
            <p className="apply-modal__review-label">Location</p>
            <p className="apply-modal__review-value">{candidateData.location}</p>
          </div>
          <div>
            <p className="apply-modal__review-label">Availability</p>
            <p className="apply-modal__review-value">{candidateData.availability}</p>
          </div>
          <div>
            <p className="apply-modal__review-label">Phone</p>
            <p className="apply-modal__review-value">{candidateData.phone || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="apply-modal__review">
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
          Application Details
        </h4>
        <div className="apply-modal__review-grid">
          <div>
            <p className="apply-modal__review-label">Cover Letter</p>
            <p className="apply-modal__review-value">
              {formData.coverLetter || 'Not provided'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">Available From</p>
            <p className="apply-modal__review-value">
              {formData.availableFrom || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">Expected Salary</p>
            <p className="apply-modal__review-value">
              {formData.expectedSalary || 'Not specified'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">Notice Period</p>
            <p className="apply-modal__review-value">
              {formData.noticePeriod || 'Not specified'}
            </p>
          </div>
        </div>
      </div>

      {/* Show required documents status */}
      <div className="apply-modal__review">
        <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>
          Required Documents Status
        </h4>
        <div className="apply-modal__review-grid">
          <div>
            <p className="apply-modal__review-label">Resume/CV</p>
            <p className="apply-modal__review-value" style={{ 
              color: candidateData.resume ? '#16a34a' : 
                     jobDetails?.requireResume ? '#dc2626' : '#64748b'
            }}>
              {candidateData.resume ? '✅ Uploaded' : 
               jobDetails?.requireResume ? '❌ Required' : 'Not Required'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">Cover Letter File</p>
            <p className="apply-modal__review-value" style={{ 
              color: candidateData.coverLetterFile ? '#16a34a' : 
                     jobDetails?.requireCoverLetter ? '#dc2626' : '#64748b'
            }}>
              {candidateData.coverLetterFile ? '✅ Uploaded' : 
               jobDetails?.requireCoverLetter ? '❌ Required' : 'Not Required'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">Driving Licence</p>
            <p className="apply-modal__review-value" style={{ 
              color: candidateData.drivingLicence ? '#16a34a' : 
                     jobDetails?.requireDrivingLicence ? '#dc2626' : '#64748b'
            }}>
              {candidateData.drivingLicence ? '✅ Uploaded' : 
               jobDetails?.requireDrivingLicence ? '❌ Required' : 'Not Required'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">DBS Certificate</p>
            <p className="apply-modal__review-value" style={{ 
              color: candidateData.dbsCertificate ? '#16a34a' : 
                     jobDetails?.requireDBS ? '#dc2626' : '#64748b'
            }}>
              {candidateData.dbsCertificate ? '✅ Uploaded' : 
               jobDetails?.requireDBS ? '❌ Required' : 'Not Required'}
            </p>
          </div>
          <div>
            <p className="apply-modal__review-label">References</p>
            <p className="apply-modal__review-value" style={{ 
              color: candidateData.referencesFile ? '#16a34a' : 
                     jobDetails?.requireReferences ? '#dc2626' : '#64748b'
            }}>
              {candidateData.referencesFile ? '✅ Uploaded' : 
               jobDetails?.requireReferences ? '❌ Required' : 'Not Required'}
            </p>
          </div>
        </div>
      </div>

      <div className="apply-modal__terms">
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleFormChange}
          className="apply-modal__checkbox"
        />
        <div>
          <p className="apply-modal__terms-text">
            I confirm that all information provided is accurate and complete.
          </p>
          <p className="apply-modal__terms-hint">
            By submitting this application, I agree to the terms and conditions.
          </p>
        </div>
      </div>

      {!formData.agreeTerms && (
        <div className="apply-modal__alert">
          <AlertCircle size={16} className="apply-modal__alert-icon" />
          <p className="apply-modal__alert-text">
            Please agree to the terms and conditions to proceed.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="apply-modal-overlay" onClick={onClose} />
      <div className="apply-modal">
        <div className="apply-modal__content" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="apply-modal__header">
            <div className="apply-modal__header-inner">
              <div className="apply-modal__header-left">
                <div className="apply-modal__avatar" style={{ background: '#7c3aed' }}>
                  <Briefcase size={20} stroke="#fff" />
                </div>
                <div>
                  <h2 className="apply-modal__title">Apply for Position</h2>
                  <p className="apply-modal__subtitle">
                    {jobDetails?.jobTitle || 'Fill in your details to apply'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="apply-modal__close">
                <X size={20} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="apply-modal__steps">
              {[1, 2, 3].map((s) => (
                <div key={s} className="apply-modal__step">
                  <div
                    className={`apply-modal__step-number ${
                      step >= s ? 'apply-modal__step-number--active' : 'apply-modal__step-number--pending'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div 
                      className={`apply-modal__step-line ${
                        step > s ? 'apply-modal__step-line--active' : 'apply-modal__step-line--pending'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="apply-modal__body">
            {step === 1 && renderCandidateInfo()}
            {step === 2 && renderApplicationForm()}
            {step === 3 && renderReview()}

            {/* Footer */}
            <div className="apply-modal__footer">
              <div className="apply-modal__footer-left">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="apply-modal__btn apply-modal__btn--back"
                  >
                    Back
                  </button>
                )}
              </div>

              <div className="apply-modal__footer-right">
                <button
                  type="button"
                  onClick={onClose}
                  className="apply-modal__btn apply-modal__btn--cancel"
                >
                  Cancel
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step + 1)}
                    className="apply-modal__btn apply-modal__btn--next"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="apply-modal__btn apply-modal__btn--submit"
                  >
                    {loading ? (
                      <span className="apply-modal__btn--loading">
                        <span className="apply-modal__spinner" />
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplyModal;