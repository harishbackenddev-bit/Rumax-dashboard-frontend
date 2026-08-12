// components/website/investigator/Hero.tsx
import React, { useState } from "react";
import axios from "axios";

interface HeroProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  imageSrc?: string;
}

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

const Hero: React.FC<HeroProps> = ({
  title = "Investigator Trial Location Support Service",
  description = "Seamlessly extend your clinical trial capabilities with Rumax's mobile research nurses and site support services — ensuring compliance, efficiency, and patient-centric care.",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Work For Us",
  imageSrc = "/images/service-img.png",
}) => {
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

  return (
    <section className="hero service--main">
      <div className="container">
        <div className="inner-service">
          <div className="hero-content">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="hero-buttons">
              <a href="#" className="btn primary">
                {primaryButtonText}
              </a>
              <a href="#" className="btn secondary">
                {secondaryButtonText}
              </a>
            </div>
          </div>

          <div className="card">
            <div className="head-card-top">
              <h3>Get the Investigator Site Guide</h3>
              <img src={imageSrc} alt="" />
            </div>

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
                {loading ? "Submitting..." : "Download Investigator Guide Book Now"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;