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
  phoneNumber: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const Hero: React.FC<HeroProps> = ({
  title = "Clinical Trials Homecare Services",
  description = "Professional mobile nursing services for clinical trials and research studies across the UK",
  imageSrc = "/images/service-img.png",
}) => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    if (!formData.fullName || !formData.phoneNumber) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/website/callback/save`,
        {
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          workEmail: "callback@request.com", // Default value since not in form
          organisation: "Clinical Trials Homecare", // Default value
          source: "wesbite-2",
          formName: "Clinical Trials Homecare Callback",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData({
          fullName: "",
          phoneNumber: "",
        });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response.data.message || "Failed to submit request");
      }
    } catch (err: any) {
      console.error("Error submitting callback:", err);
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
          </div>

          <div className="card">
            <div className="head-card-top">
              <h3>Request a Callback</h3>
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
                ✅ Thank you! We will call you back shortly.
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
                  placeholder="Enter full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="field">
                <label htmlFor="phoneNumber">
                  Phone Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={formData.phoneNumber}
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
                {loading ? "Submitting..." : "Request a Callback"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;