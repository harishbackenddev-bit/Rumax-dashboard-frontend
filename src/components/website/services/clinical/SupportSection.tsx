import { AssetImage } from "@/components/ui/AssetImage";
import React, { useState } from "react";

type SupportSectionProps = {
  description?: string;
  title?: string;
};

const ctaLinks = [
  {
    label: "Get Started",
    href: "/contact-us",
    icon: "rumax-cta-assessment.svg",
  },
  {
    label: "Work For Us",
    href: "/careers",
    icon: "rumax-cta-assessment.svg",
  },
  {
    label: "Download Investigator Guide Book Now",
    href: "#",
    icon: "rumax-cta-assessment.svg",
    isDownload: true,
  },
];

const SupportSection = ({
  description = "Need support for your next project? Our team is here to assist.",
  title = "Enquire About Our Investigator Site Support",
}: SupportSectionProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    contactNumber: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter at least 2 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\d\s\-+()]{10,15}$/.test(formData.contactNumber.replace(/\s/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid phone number (10-15 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setIsModalOpen(false);
        setFormData({ fullName: '', email: '', contactNumber: '' });
        setSubmitSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleLinkClick = (link: typeof ctaLinks[0], e: React.MouseEvent) => {
    if (link.isDownload) {
      e.preventDefault();
      setIsModalOpen(true);
    }
    // For non-download links, default anchor behavior works
  };

  return (
    <>
      <section className="cta">
        <div className="container cta__inner">
          <span className="cta__eyebrow">
            <AssetImage
              name="rumax-cta-pill-phone.svg"
              aria-hidden="true"
            />
            Get in Touch
          </span>

          <h2>{title}</h2>

          <p>{description}</p>

          <div className="cta__actions">
            <a href="/contact-us" className="cta-main">
              Call Us
            </a>

            {ctaLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(link, e)}
              >
                <AssetImage
                  name={link.icon}
                  aria-hidden="true"
                />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => !isSubmitting && setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              ✕
            </button>
            
            <div className="modal-header">
              <h3>Download Investigator Guide Book</h3>
              <p>Enter your details below to receive the guide book</p>
            </div>
            
            {submitSuccess ? (
              <div className="modal-success">
                <div className="success-icon">✅</div>
                <h4>Request Sent Successfully!</h4>
                <p>We will send the Investigator Guide Book to your email shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label>Full Name <span className="required">*</span></label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
                
                <div className="form-group">
                  <label>Contact Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    name="contactNumber"
                    placeholder="Enter your phone number"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className={errors.contactNumber ? 'error' : ''}
                  />
                  {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
                </div>
                
                <button 
                  type="submit" 
                  className="modal-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span> Sending...
                    </>
                  ) : (
                    'Request Guide Book'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style>{`
        /* Modal Overlay */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
          animation: fadeIn 0.3s ease;
        }

        /* Modal Content */
        .modal-content {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px;
          max-width: 480px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
          animation: slideUp 0.3s ease;
        }

        /* Close Button */
        .modal-close {
          position: absolute;
          top: 16px;
          right: 20px;
          background: none;
          border: none;
          font-size: 24px;
          color: #6d6a78;
          cursor: pointer;
          transition: all 0.2s;
          padding: 4px 8px;
          border-radius: 8px;
        }
        .modal-close:hover {
          background: #f7f7fa;
          color: #181227;
        }
        .modal-close:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Modal Header */
        .modal-header {
          margin-bottom: 24px;
        }
        .modal-header h3 {
          font-size: 22px;
          font-weight: 700;
          color: #181227;
          margin: 0 0 8px 0;
        }
        .modal-header p {
          font-size: 14px;
          color: #6d6a78;
          margin: 0;
        }

        /* Form */
        .modal-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-size: 14px;
          font-weight: 600;
          color: #181227;
        }
        .form-group label .required {
          color: #ed0c89;
        }
        .form-group input {
          padding: 12px 16px;
          border: 2px solid #ded9e6;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
          color: #181227;
          background: #f7f7fa;
          transition: all 0.2s ease;
          outline: none;
        }
        .form-group input:focus {
          border-color: #601b80;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(96, 27, 128, 0.1);
        }
        .form-group input.error {
          border-color: #dc2626;
          background: #fef2f2;
        }
        .form-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .error-message {
          font-size: 12px;
          color: #dc2626;
          font-weight: 500;
          margin-top: 4px;
        }

        /* Submit Button */
        .modal-submit-btn {
          padding: 14px 24px;
          background: linear-gradient(135deg, #1b2280 0%, #601b80 100%);
          color: #ffffff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .modal-submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(96, 27, 128, 0.3);
        }
        .modal-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        /* Spinner */
        .spinner {
          width: 18px;
          height: 18px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          display: inline-block;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Success State */
        .modal-success {
          text-align: center;
          padding: 20px 0;
        }
        .success-icon {
          font-size: 60px;
          margin-bottom: 16px;
        }
        .modal-success h4 {
          font-size: 20px;
          font-weight: 700;
          color: #1fae63;
          margin: 0 0 8px 0;
        }
        .modal-success p {
          font-size: 14px;
          color: #6d6a78;
          margin: 0;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Responsive */
        @media (max-width: 520px) {
          .modal-content {
            padding: 28px 20px;
          }
          .modal-header h3 {
            font-size: 18px;
          }
        }
      `}</style>
    </>
  );
};

export default SupportSection;