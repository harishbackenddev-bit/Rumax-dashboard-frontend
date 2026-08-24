// pages/website/ContactUs/LandingPage.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface FormData {
  // Step 1
  whoAreYou: string;
  fullName: string;
  workEmail: string;
  companyName: string;
  countryCode: string;
  phoneNumber: string;
  areasOfInterest: string[];
  // Step 2
  studyPhase: string;
  patientEnrollment: string;
  trialDuration: number;
  diseaseIndication: string;
  studyStartDate: string;
  operationalChallenges: string[];
  additionalComments: string;
}

interface FormErrors {
  // Step 1 errors
  whoAreYou?: string;
  fullName?: string;
  workEmail?: string;
  companyName?: string;
  phoneNumber?: string;
  areasOfInterest?: string;
  // Step 2 errors
  studyPhase?: string;
  patientEnrollment?: string;
  trialDuration?: string;
  diseaseIndication?: string;
  studyStartDate?: string;
  operationalChallenges?: string;
}

const LandingPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    whoAreYou: '',
    fullName: '',
    workEmail: '',
    companyName: '',
    countryCode: '+27',
    phoneNumber: '',
    areasOfInterest: [],
    // Step 2
    studyPhase: '',
    patientEnrollment: '',
    trialDuration: 1,
    diseaseIndication: '',
    studyStartDate: '',
    operationalChallenges: [],
    additionalComments: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const areasOfInterestOptions = [
    'Homecare Visit Management',
    'Direct-to-Patient Logistics',
    'Site Administrative Support',
    'Regulatory & Compliance Training',
    'Feasibility & Recruitment Support'
  ];

  const operationalChallengesOptions = [
    'Site Logistics',
    'Homecare Coordination',
    'Patient Recruitment',
    'Monitoring Oversight',
    'Data Management',
    'Other'
  ];

  const studyPhases = ['Phase I', 'Phase II', 'Phase III', 'Phase IV', 'Phase V'];

  // Validate Step 1
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.whoAreYou) {
      newErrors.whoAreYou = 'Please select who you are';
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }
    
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Work email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.workEmail)) {
      newErrors.workEmail = 'Please enter a valid email address';
    }
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\d\s\-+()]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number (10-15 digits)';
    }
    
    if (formData.areasOfInterest.length === 0) {
      newErrors.areasOfInterest = 'Please select at least one area of interest';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.studyPhase) {
      newErrors.studyPhase = 'Please select a study phase';
    }
    
    if (!formData.patientEnrollment.trim()) {
      newErrors.patientEnrollment = 'Patient enrollment count is required';
    } else if (isNaN(Number(formData.patientEnrollment)) || Number(formData.patientEnrollment) < 1) {
      newErrors.patientEnrollment = 'Please enter a valid number (minimum 1)';
    }
    
    if (!formData.trialDuration || formData.trialDuration < 1) {
      newErrors.trialDuration = 'Trial duration is required';
    }
    
    if (!formData.diseaseIndication) {
      newErrors.diseaseIndication = 'Please select a disease indication';
    }
    
    if (!formData.studyStartDate) {
      newErrors.studyStartDate = 'Please select a study start date';
    }
    
    if (formData.operationalChallenges.length === 0) {
      newErrors.operationalChallenges = 'Please select at least one operational challenge';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (error) setError(null);
  };

  const handleCheckboxChange = (field: string, value: string) => {
    setFormData(prev => {
      const current = prev[field as keyof typeof prev] as string[];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
    // Clear error for this field
    if (field === 'areasOfInterest' && errors.areasOfInterest) {
      setErrors(prev => ({ ...prev, areasOfInterest: '' }));
    }
    if (field === 'operationalChallenges' && errors.operationalChallenges) {
      setErrors(prev => ({ ...prev, operationalChallenges: '' }));
    }
  };

  const handlePhaseSelect = (phase: string) => {
    setFormData(prev => ({ ...prev, studyPhase: phase }));
    if (errors.studyPhase) {
      setErrors(prev => ({ ...prev, studyPhase: '' }));
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setFormData(prev => ({ ...prev, trialDuration: value }));
    if (errors.trialDuration) {
      setErrors(prev => ({ ...prev, trialDuration: '' }));
    }
  };

  const goToStep = (step: number) => {
    if (step === 2) {
      // Validate Step 1 before proceeding
      if (!validateStep1()) {
        return;
      }
    }
    setCurrentStep(step);
    const card = document.querySelector('.card');
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate Step 2
    if (!validateStep2()) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post(
        `${API_URL}/api/website/feasibility/save`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          whoAreYou: '',
          fullName: '',
          workEmail: '',
          companyName: '',
          countryCode: '',
          phoneNumber: '',
          areasOfInterest: [],
          studyPhase: '',
          patientEnrollment: '',
          trialDuration: 1,
          diseaseIndication: '',
          studyStartDate: '',
          operationalChallenges: [],
          additionalComments: ''
        });
        setErrors({});
        // Reset to step 1 after success
        setTimeout(() => {
          setSuccess(false);
          setCurrentStep(1);
        }, 5000);
      } else {
        setError(response.data.message || "Failed to submit assessment");
      }
    } catch (err: any) {
      console.error("Error submitting feasibility:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="landing-section">
      {/* LEFT COLUMN - MARKETING CONTENT */}
      <div className="left-col">
        <h1>
          Accelerate Your Trials:
          <span className="highlight">Personalised Support</span>
        </h1>
        <p className="lead">
          Optimize your clinical operations with our Homecare and Investigator Site solutions. 
          Reduce site burden, increase patient retention.
        </p>

        <div className="feature">
          <div className="feature-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6a5cf0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.5 3v6a4.5 4.5 0 0 0 9 0V3"/>
              <path d="M9 12v3a5 5 0 0 0 10 0v-1.5"/>
              <circle cx="20" cy="10.5" r="1.8"/>
            </svg>
          </div>
          <div className="feature-text">
            <h3>Investigator Site Support</h3>
            <p>Streamline administrative tasks and compliance, freeing up site staff for trial focus.</p>
          </div>
        </div>

        <div className="feature">
          <div className="feature-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1fae63" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2l7 3.2v5.4c0 5-3 8.4-7 9.4-4-1-7-4.4-7-9.4V5.2z"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div className="feature-text">
            <h3>Regulatory Compliance & Quality</h3>
            <p>Ensure robust data integrity with expert monitoring and training solutions.</p>
          </div>
        </div>

        <div className="testimonial">
          <div className="testimonial-avatar">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <circle cx="8" cy="8" r="5" fill="#1fae8f" opacity="0.85"/>
              <circle cx="15" cy="9" r="4" fill="#0d7d6a" opacity="0.85"/>
              <circle cx="11" cy="15" r="4.5" fill="#14a68c"/>
            </svg>
          </div>
          <div className="testimonial-text">
            <p>
              "I have had David come to my home to do bloods for several months now sometimes three times a week. 
              He is very friendly, and always puts me at ease. He manages appointments around my time constraints 
              and is always amenable. The home service is a Godsend."
            </p>
            <div className="testimonial-attr">— From J H (Client / Service User)</div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN - FORM CARD */}
      <div className="card">
        <h2>Request Your Trial Feasibility Assessment</h2>

        {/* Success Message */}
        {success && (
          <div className="success-message" style={{
            background: "#d4edda",
            color: "#155724",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px",
            border: "1px solid #c3e6cb",
          }}>
            ✅ Thank you! Your feasibility assessment request has been submitted. We will contact you shortly.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message" style={{
            background: "#f8d7da",
            color: "#721c24",
            padding: "12px 16px",
            borderRadius: "8px",
            marginBottom: "15px",
            fontSize: "14px",
            border: "1px solid #f5c6cb",
          }}>
            ❌ {error}
          </div>
        )}

        {/* STEP 1 */}
        <div className={`step-panel ${currentStep === 1 ? 'active' : ''}`}>
          <p className="step-label">
            Step 1 of 2: <strong>Basic Info</strong>
          </p>
          <div className="progress-track">
            <div className={`progress-seg ${currentStep >= 1 ? 'partial' : ''}`}></div>
            <div className={`progress-seg ${currentStep >= 2 ? 'filled' : ''}`}></div>
          </div>

          <div className="field">
            <label>Who are you? <span className="required">*</span></label>
            <select 
              name="whoAreYou" 
              value={formData.whoAreYou} 
              onChange={handleInputChange} 
              disabled={loading}
              className={errors.whoAreYou ? 'error' : ''}
            >
              <option value="">Select</option>
              <option value="Sponsor">Sponsor</option>
              <option value="CRO">CRO</option>
              <option value="Investigator Site">Investigator Site</option>
              <option value="NHS Trust">NHS Trust</option>
              <option value="Other">Other</option>
            </select>
            {errors.whoAreYou && <span className="error-text">{errors.whoAreYou}</span>}
          </div>

          <div className="row2">
            <div className="field">
              <label>Full Name <span className="required">*</span></label>
              <input 
                type="text" 
                name="fullName"
                placeholder="Enter Full Name" 
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.fullName ? 'error' : ''}
              />
              {errors.fullName && <span className="error-text">{errors.fullName}</span>}
            </div>
            <div className="field">
              <label>Work Email Address <span className="required">*</span></label>
              <input 
                type="email" 
                name="workEmail"
                placeholder="Enter Email Address" 
                value={formData.workEmail}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.workEmail ? 'error' : ''}
              />
              {errors.workEmail && <span className="error-text">{errors.workEmail}</span>}
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label>Company/Institution Name <span className="required">*</span></label>
              <input 
                type="text" 
                name="companyName"
                placeholder="Enter Company Name" 
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.companyName ? 'error' : ''}
              />
              {errors.companyName && <span className="error-text">{errors.companyName}</span>}
            </div>
            <div className="field">
              <label>
                Phone Number <span className="required">*</span>
              </label>

              <div className="phone-input">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="+27">🇿🇦 +27</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+61">🇦🇺 +61</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+65">🇸🇬 +65</option>
                  <option value="+81">🇯🇵 +81</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+86">🇨🇳 +86</option>
                </select>

                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={errors.phoneNumber ? 'error' : ''}
                />
              </div>

              {errors.phoneNumber && (
                <span className="error-text">{errors.phoneNumber}</span>
              )}
            </div>
          </div>

          <div className="field">
            <label>Specific Area of Interest <span className="required">*</span></label>
            <div className="check-grid">
              {areasOfInterestOptions.map((area) => (
                <label key={area} className="check-item">
                  <input 
                    type="checkbox" 
                    checked={formData.areasOfInterest.includes(area)}
                    onChange={() => handleCheckboxChange('areasOfInterest', area)}
                    disabled={loading}
                  /> 
                  {area}
                </label>
              ))}
            </div>
            {errors.areasOfInterest && <span className="error-text">{errors.areasOfInterest}</span>}
          </div>

          <div className="btn-row">
            <button 
              className="btn btn-primary" 
              onClick={() => goToStep(2)}
              disabled={loading}
            >
              Next: Tell Us About Your Trial
            </button>
          </div>
        </div>

        {/* STEP 2 */}
        <div className={`step-panel ${currentStep === 2 ? 'active' : ''}`}>
          <p className="step-label">
            Step 2 of 2: <strong>Trial Details</strong>
          </p>
          <div className="progress-track">
            <div className="progress-seg filled"></div>
            <div className="progress-seg filled"></div>
          </div>

          <div className="field">
            <label>Who are you? <span className="required">*</span></label>
            <select 
              name="whoAreYou" 
              value={formData.whoAreYou} 
              onChange={handleInputChange} 
              disabled={loading}
              className={errors.whoAreYou ? 'error' : ''}
            >
              <option value="">Select</option>
              <option value="Sponsor">Sponsor</option>
              <option value="CRO">CRO</option>
              <option value="Investigator Site">Investigator Site</option>
              <option value="NHS Trust">NHS Trust</option>
              <option value="Other">Other</option>
            </select>
            {errors.whoAreYou && <span className="error-text">{errors.whoAreYou}</span>}
          </div>

          <div className="field">
            <label>Study Phase <span className="required">*</span></label>
            <div className="phase-grid">
              {studyPhases.slice(0, 3).map((phase) => (
                <div 
                  key={phase}
                  className={`phase-pill ${formData.studyPhase === phase ? 'selected' : ''}`}
                  onClick={() => handlePhaseSelect(phase)}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {phase}
                </div>
              ))}
            </div>
            <div className="phase-grid second-row">
              {studyPhases.slice(3).map((phase) => (
                <div 
                  key={phase}
                  className={`phase-pill ${formData.studyPhase === phase ? 'selected' : ''}`}
                  onClick={() => handlePhaseSelect(phase)}
                  style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                  {phase}
                </div>
              ))}
              <div className="phase-pill spacer"></div>
            </div>
            {errors.studyPhase && <span className="error-text">{errors.studyPhase}</span>}
          </div>

          <div className="row2">
            <div className="field">
              <label>Projected Patient Enrollment Count <span className="required">*</span></label>
              <input 
                type="number" 
                name="patientEnrollment"
                placeholder="Enter Patient Count" 
                value={formData.patientEnrollment}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.patientEnrollment ? 'error' : ''}
                min="1"
              />
              {errors.patientEnrollment && <span className="error-text">{errors.patientEnrollment}</span>}
            </div>
            <div className="field">
              <label>Estimated Trial Duration (Months) <span className="required">*</span></label>
              <div className="slider-wrap">
                <input 
                  type="range" 
                  min="1" 
                  max="36" 
                  value={formData.trialDuration}
                  onChange={handleDurationChange}
                  disabled={loading}
                />
                <div className="slider-value">
                  {formData.trialDuration} {formData.trialDuration === 1 ? 'Month' : 'Months'}
                </div>
              </div>
              {errors.trialDuration && <span className="error-text">{errors.trialDuration}</span>}
            </div>
          </div>

          <div className="row2">
            <div className="field">
              <label>Primary Disease Indication/Area <span className="required">*</span></label>
              <select 
                name="diseaseIndication" 
                value={formData.diseaseIndication} 
                onChange={handleInputChange} 
                disabled={loading}
                className={errors.diseaseIndication ? 'error' : ''}
              >
                <option value="">Select</option>
                <option value="Oncology">Oncology</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Infectious Disease">Infectious Disease</option>
                <option value="Other">Other</option>
              </select>
              {errors.diseaseIndication && <span className="error-text">{errors.diseaseIndication}</span>}
            </div>
            <div className="field">
              <label>Estimated Study Start Date <span className="required">*</span></label>
              <select 
                name="studyStartDate" 
                value={formData.studyStartDate} 
                onChange={handleInputChange} 
                disabled={loading}
                className={errors.studyStartDate ? 'error' : ''}
              >
                <option value="">Select</option>
                <option value="Within 3 months">Within 3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="12+ months">12+ months</option>
              </select>
              {errors.studyStartDate && <span className="error-text">{errors.studyStartDate}</span>}
            </div>
          </div>

          <div className="field">
            <label>Primary Operational Challenge (Check all that apply) <span className="required">*</span></label>
            <div className="check-grid">
              {operationalChallengesOptions.map((challenge) => (
                <label key={challenge} className="check-item">
                  <input 
                    type="checkbox" 
                    checked={formData.operationalChallenges.includes(challenge)}
                    onChange={() => handleCheckboxChange('operationalChallenges', challenge)}
                    disabled={loading}
                  /> 
                  {challenge}
                </label>
              ))}
            </div>
            {errors.operationalChallenges && <span className="error-text">{errors.operationalChallenges}</span>}
          </div>

          <div className="field">
            <label>Additional Comments or Requirements</label>
            <textarea 
              name="additionalComments"
              placeholder="Specify here"
              value={formData.additionalComments}
              onChange={handleInputChange}
              disabled={loading}
              rows={3}
            />
          </div>

          <div className="btn-row between">
            <button 
              className="btn btn-outline" 
              onClick={() => goToStep(1)} 
              disabled={loading}
            >
              Back
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit Request & Get Your Assessment"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .required {
          color: #dc2626;
          margin-left: 2px;
        }
        
        .error-text {
          color: #dc2626;
          font-size: 12px;
          margin-top: 4px;
          display: block;
        }
        
        input.error, select.error, textarea.error {
          border-color: #dc2626 !important;
        }
        
        input.error:focus, select.error:focus, textarea.error:focus {
          border-color: #dc2626 !important;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }
        
        .phase-pill {
          transition: all 0.2s ease;
        }
        
        .phase-pill.selected {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .phase-pill:not(.selected):hover {
          background: #eff6ff;
          border-color: #3b82f6;
        }
      `}</style>
    </section>
  );
};

export default LandingPage;