// components/sections/FormSection.tsx
import React, { useState } from "react";
import axios from "axios";

const asset = (path: string) => `/images/${path}`;

interface FormData {
  fullName: string;
  workEmail: string;
  organisation: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const FormSection = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    workEmail: "",
    organisation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submittedData, setSubmittedData] = useState<FormData | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error on change
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.fullName || !formData.workEmail || !formData.organisation) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/website/investigator-guide/save`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setSubmittedData({ ...formData });
        // Reset form
        setFormData({
          fullName: "",
          workEmail: "",
          organisation: "",
        });
        // Auto hide success after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.data.message || "Failed to submit form");
      }
    } catch (err: any) {
      console.error("Error submitting form:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#12086F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="#12086F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const listItems = [
    "How to integrate ICH-OCP E6 (R3) effectively",
    "Navigating the April 2026 MHRA Reforms",
    "NMC Compliance Requirements for Home Nursing",
    "Logistics for AI-Home IMP Administration",
    "Case Studies from UK Hybrid Trials",
  ];

  return (
    <section className="hvs-section hvs-main-section">
      <div className="container">
        <div className="inner-hvs-sec1">
          <div className="hvs-content">
            <h2>The 2026 Guide To Navigating UK Decentralised Clinical Trials</h2>
            <p className="hvs-subtext">
              Master recent MHRA regulatory updates and ensures your hybrid
              trials are compliant, patient-centric, and operationally sound
            </p>
            <ul className="hvs-list">
              {listItems.map((item, index) => (
                <li key={index}>
                  <CheckIcon />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="right-side-form">
            <div className="hvs-visual img">
              <img src={asset("book.png")} alt="Guide Book" />
            </div>
            <div className="card">
              <h3>Get the Investigator Site Guide</h3>

              {/* ✅ Success Message */}
              {success && (
                <div className="success-message" style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}>
                  ✅ Thank you! Your Investigator Site Guide will be sent to your email shortly.
                  {submittedData && (
                    <div style={{ marginTop: "8px", fontSize: "12px", opacity: 0.8 }}>
                      <div>Name: {submittedData.fullName}</div>
                      <div>Email: {submittedData.workEmail}</div>
                      <div>Organisation: {submittedData.organisation}</div>
                    </div>
                  )}
                </div>
              )}

              {/* ✅ Error Message */}
              {error && (
                <div className="error-message" style={{
                  background: "#f8d7da",
                  color: "#721c24",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  marginBottom: "15px",
                  fontSize: "14px",
                }}>
                  ❌ {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="fullName">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    placeholder="Dr. Sarah Thompson"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="field">
                  <label htmlFor="workEmail">
                    Work Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="workEmail"
                    name="workEmail"
                    placeholder="sarah.thompson@hospital.nhs.uk"
                    value={formData.workEmail}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="field">
                  <label htmlFor="organisation">
                    Organisation <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="organisation"
                    name="organisation"
                    placeholder="University Hospital Trust"
                    value={formData.organisation}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <button 
                  type="submit" 
                  className="trial-btn" 
                  disabled={loading}
                  style={{
                    opacity: loading ? 0.7 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Submitting..." : "Get My Free Guide"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FormSection;