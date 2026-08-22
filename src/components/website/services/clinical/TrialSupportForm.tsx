// components/website/services/clinical/TrialSupportForm.tsx
import React, { useState, useRef } from 'react';
import axios from 'axios';
import './TrialSupportForm.css';

interface FormData {
  studyPhase: string[];
  therapeuticArea: string[];
  studyName: string;
  consultantName: string;
  description: string;
  fullName: string;
  email: string;
  designation: string;
  companyWebsite: string;
  phoneNumber: string;
  preferredDate: string;
  preferredTime: string;
  timezone: string;
  country: string;
}

const TrialSupportForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const dateInputRef = useRef<HTMLInputElement>(null);
  const timeInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormData>({
    studyPhase: [],
    therapeuticArea: [],
    studyName: '',
    consultantName: '',
    description: '',
    fullName: '',
    email: '',
    designation: '',
    companyWebsite: '',
    phoneNumber: '',
    preferredDate: '',
    preferredTime: '',
    timezone: '',
    country: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 4;
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (field: 'studyPhase' | 'therapeuticArea', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      const newValues = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker?.();
    }
  };

  const handleTimeClick = () => {
    if (timeInputRef.current) {
      timeInputRef.current.showPicker?.();
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 0) {
      if (formData.studyPhase.length === 0) {
        newErrors.studyPhase = 'Please select at least one study phase';
      }
      if (formData.therapeuticArea.length === 0) {
        newErrors.therapeuticArea = 'Please select at least one therapeutic area';
      }
    } else if (currentStep === 1) {
      if (!formData.description.trim()) {
        newErrors.description = 'Description is required';
      } else if (formData.description.trim().split(/\s+/).filter(w => w).length > 100) {
        newErrors.description = 'Maximum 100 words allowed';
      }
    } else if (currentStep === 2) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
      if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
      if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
      if (!formData.preferredDate) newErrors.preferredDate = 'Preferred date is required';
      if (!formData.preferredTime) newErrors.preferredTime = 'Preferred time is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveToDatabase = async () => {
    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const response = await axios.post(
        `${API_URL}/api/website/trial-support/save`,
        {
          studyPhase: formData.studyPhase,
          therapeuticArea: formData.therapeuticArea,
          description: formData.description,
          fullName: formData.fullName,
          email: formData.email,
          designation: formData.designation,
          companyWebsite: formData.companyWebsite,
          phoneNumber: formData.phoneNumber,
          preferredDate: formData.preferredDate,
          preferredTime: formData.preferredTime,
          timezone: formData.timezone,
          country: formData.country,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        setShowConfirmation(true);
        setCurrentStep(3);
        
        setFormData({
          studyPhase: [],
          therapeuticArea: [],
          studyName: '',
          consultantName: '',
          description: '',
          fullName: '',
          email: '',
          designation: '',
          companyWebsite: '',
          phoneNumber: '',
          preferredDate: '',
          preferredTime: '',
          timezone: '',
          country: '',
        });
      } else {
        setSubmitError(response.data.message || 'Failed to submit form');
      }
    } catch (error: any) {
      console.error('Error submitting trial support:', error);
      setSubmitError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      await saveToDatabase();
    }
  };

  const getProgressPercentage = () => {
    return ((currentStep) / (totalSteps - 1)) * 100;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return 'Study Details';
      case 1: return 'Bottlenecks';
      case 2: return 'About You';
      case 3: return 'Confirmation';
      default: return '';
    }
  };

  // ✅ Format date for display (YYYY-MM-DD to DD/MM/YYYY)
  const formatDisplayDate = (date: string) => {
    if (!date) return '';
    const parts = date.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return date;
  };

  // ✅ Format time for display (HH:MM to HH:MM)
  const formatDisplayTime = (time: string) => {
    if (!time) return '';
    return time;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <h2 className="step-heading">Tell Us About Your Study</h2>
            
            <div className="form-group">
              <label className="form-label">Study Phase <span className="required">*</span></label>
              <p className="field-hint">Select all that apply</p>
              <div className="checkbox-group">
                {['Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Phase V'].map(phase => (
                  <label key={phase} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.studyPhase.includes(phase)}
                      onChange={() => handleCheckboxChange('studyPhase', phase)}
                    />
                    <span className="custom-checkbox">{phase}</span>
                  </label>
                ))}
              </div>
              {errors.studyPhase && <span className="error-message">{errors.studyPhase}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Therapeutic Area <span className="required">*</span></label>
              <p className="field-hint">Select all that apply</p>
              <div className="checkbox-group">
                {['Oncology', 'CNS', 'Infectious Disease', 'Cardiovascular', 'Immunology', 'Rare Diseases'].map(area => (
                  <label key={area} className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.therapeuticArea.includes(area)}
                      onChange={() => handleCheckboxChange('therapeuticArea', area)}
                    />
                    <span className="label-text"> {area}</span>
                  </label>
                ))}
              </div>
              {errors.therapeuticArea && <span className="error-message">{errors.therapeuticArea}</span>}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <h2 className="step-heading">Tell Us About Your Current Bottlenecks</h2>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <p className="field-hint">Max 100 Words</p>
              <textarea
                name="description"
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Please describe the challenges or bottlenecks you're currently facing..."
                value={formData.description}
                onChange={handleChange}
                rows={6}
                disabled={isSubmitting}
              />
              <div className="word-counter">
                <span className={formData.description.split(/\s+/).filter(w => w).length > 100 ? 'error' : ''}>
                  {formData.description.split(/\s+/).filter(w => w).length} / 100 words
                </span>
              </div>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <h2 className="step-heading">Tell Us About You</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Full Name <span className="required">*</span></label>
                <input
                  type="text"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email <span className="required">*</span></label>
                <input
                  type="email"
                  name="email"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Designation <span className="required">*</span></label>
                <input
                  type="text"
                  name="designation"
                  className={`form-input ${errors.designation ? 'error' : ''}`}
                  placeholder="Your job title"
                  value={formData.designation}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.designation && <span className="error-message">{errors.designation}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Company Website (if applicable)</label>
                <input
                  type="text"
                  name="companyWebsite"
                  className="form-input"
                  placeholder="https://example.com"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number <span className="required">*</span></label>
                <div className="phone-input-wrapper">
                  <span className="country-code">+1</span>
                  <input
                    type="tel"
                    name="phoneNumber"
                    className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
              </div>
              {/* ✅ Date Input - Fixed */}
             <div className="form-group">
  <label className="form-label">Preferred Date <span className="required">*</span></label>
  <input
    ref={dateInputRef}
    type="date"
    name="preferredDate"
    className={`form-input ${errors.preferredDate ? 'error' : ''}`}
    value={formData.preferredDate}
    onChange={handleChange}
    disabled={isSubmitting}
  />
  {errors.preferredDate && <span className="error-message">{errors.preferredDate}</span>}
</div>
            </div>

            <div className="form-row">
              {/* ✅ Time Input - Fixed */}
             <div className="form-group">
  <label className="form-label">Preferred Time <span className="required">*</span></label>
  <input
    ref={timeInputRef}
    type="time"
    name="preferredTime"
    className={`form-input ${errors.preferredTime ? 'error' : ''}`}
    value={formData.preferredTime}
    onChange={handleChange}
    disabled={isSubmitting}
  />
  {errors.preferredTime && <span className="error-message">{errors.preferredTime}</span>}
</div>
              <div className="form-group">
                <label className="form-label">Timezone</label>
                <select
                  name="timezone"
                  className="form-select"
                  value={formData.timezone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="EST">Eastern Time</option>
                  <option value="CST">Central Time</option>
                  <option value="MST">Mountain Time</option>
                  <option value="PST">Pacific Time</option>
                  <option value="GMT">GMT</option>
                  <option value="CET">CET</option>
                  <option value="IST">IST</option>
                  <option value="AEST">AEST</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  name="country"
                  className="form-select"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="">Select country</option>
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IN">India</option>
                  <option value="JP">Japan</option>
                </select>
              </div>
              <div className="form-group">
                {/* Empty for spacing */}
              </div>
            </div>
          </div>
        );

      case 3:
        if (showConfirmation) {
          return (
            <div className="confirmation-screen">
              <div className="confirmation-icon">🎉</div>
              <h2 className="confirmation-title">You're All Set!</h2>
              <p className="confirmation-message">
                Thank you for your submission. Your consultation has been successfully scheduled. Our team will contact you shortly
              </p>
              <button 
                className="btn-homepage"
                onClick={() => window.location.href = '/'}
              >
                Back to Homepage
              </button>
            </div>
          );
        }
        return (
          <div className="step-content">
            <h2 className="step-heading">Review Your Information</h2>
            <div className="review-section">
              <div className="review-item">
                <strong>Study Phase:</strong> {formData.studyPhase.join(', ') || 'Not specified'}
              </div>
              <div className="review-item">
                <strong>Therapeutic Area:</strong> {formData.therapeuticArea.join(', ') || 'Not specified'}
              </div>
              <div className="review-item">
                <strong>Bottlenecks:</strong> {formData.description || 'Not specified'}
              </div>
              <div className="review-item">
                <strong>Full Name:</strong> {formData.fullName}
              </div>
              <div className="review-item">
                <strong>Email:</strong> {formData.email}
              </div>
              <div className="review-item">
                <strong>Designation:</strong> {formData.designation}
              </div>
              <div className="review-item">
                <strong>Phone:</strong> +1 {formData.phoneNumber}
              </div>
              <div className="review-item">
                <strong>Preferred Date:</strong> {formatDisplayDate(formData.preferredDate)}
              </div>
              <div className="review-item">
                <strong>Preferred Time:</strong> {formatDisplayTime(formData.preferredTime)}
              </div>
            </div>
            {submitError && (
              <div className="error-banner" style={{ marginTop: '20px', padding: '16px', background: '#FEE2E2', borderRadius: '8px', color: '#991B1B' }}>
                {submitError}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="trial-form-container">
      <div className="step-indicator">
        <span className="step-text">Step {currentStep + 1} / {totalSteps}</span>
        <span className="step-text active">{getStepTitle()}</span>
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${getProgressPercentage()}%` }}></div>
      </div>

      <div className="form-content">
        {renderStep()}
      </div>

      {currentStep < 3 && !showConfirmation && (
        <div className="form-buttons">
          {currentStep > 0 ? (
            <button className="btn-previous" onClick={prevStep} disabled={isSubmitting}>
              Previous Step
            </button>
          ) : (
            <div></div>
          )}
          
          <button className="btn-next" onClick={nextStep} disabled={isSubmitting}>
            {currentStep === 2 ? 'Schedule' : 'Save & Continue'}
          </button>
        </div>
      )}

      {currentStep === 3 && !showConfirmation && (
        <div className="form-buttons">
          <button className="btn-previous" onClick={prevStep} disabled={isSubmitting}>
            Previous Step
          </button>
          <button 
            className="btn-submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}

      {currentStep < 3 && !showConfirmation && (
        <div className="form-footer">
          <div className="security-notice">
            <div className="security-icon">✓</div>
            <span className="security-text">Your information is secure and confidential.</span>
          </div>
          <div className="trust-badge">
            <div className="badge-icon">✓</div>
            <span className="badge-text">Trusted by clinical research teams across the UK</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrialSupportForm;