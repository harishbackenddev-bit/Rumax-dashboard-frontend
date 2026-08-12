// pages/auth/ForgotPassword.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, ArrowLeft, Shield, Check, ChevronRight } from "lucide-react";
import axios from "axios";
import Logo from "@/assets/home/logo.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API_URL}/api/forgot-password`, {
        email: email.trim().toLowerCase(),
      });

      if (response.data.success) {
        setIsEmailSent(true);
      } else {
        setError(response.data.message || "Failed to send reset link");
      }
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTryAnotherEmail = () => {
    setIsEmailSent(false);
    setEmail("");
    setError("");
  };

  const handleBackToSignIn = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'rgb(247, 249, 252)' }}>
      {/* Header */}
      <header className="px-8 py-5 flex items-center justify-between shrink-0" style={{ 
        background: 'rgb(255, 255, 255)', 
        borderBottom: '1px solid rgb(226, 236, 246)',
        boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 4px'
      }}>
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Ru-max" className="h-12 w-auto object-contain" />
        </Link>
        <button
          onClick={handleBackToSignIn}
          className="inline-flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'rgb(123, 130, 153)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(96, 27, 128)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(123, 130, 153)'}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </button>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {!isEmailSent ? (
            // Forgot Password Form
            <>
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(238, 241, 251)' }}>
                  <Lock className="w-6 h-6" style={{ color: 'rgb(96, 27, 128)' }} />
                </div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(13, 17, 23)' }}>
                  Forgot your password?
                </h1>
                <p className="text-sm font-medium" style={{ color: 'rgb(123, 130, 153)' }}>
                  Enter your email and we'll send you a reset link
                </p>
              </div>

              {/* Form Card */}
              <div className="rounded-2xl p-7" style={{ 
                background: 'rgb(255, 255, 255)', 
                border: '1px solid rgb(228, 233, 244)', 
                boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
              }}>
                {error && (
                  <div className="rounded-xl px-4 py-3 mb-4 text-sm font-medium" style={{ 
                    background: 'rgb(254, 242, 242)',
                    border: '1px solid rgb(254, 202, 202)',
                    color: 'rgb(220, 38, 38)'
                  }}>
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(160, 170, 191)' }}>
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(160, 170, 191)' }} />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                        style={{ 
                          border: '1.5px solid rgb(228, 233, 244)',
                          background: 'rgb(248, 249, 254)',
                          color: 'rgb(13, 17, 23)',
                          fontFamily: 'Manrope, sans-serif'
                        }}
                        placeholder="you@email.com"
                        required
                        onFocus={(e) => e.target.style.borderColor = 'rgb(96, 27, 128)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgb(228, 233, 244)'}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl py-2.5 font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-1"
                    style={{ 
                      background: loading ? 'rgb(160, 170, 191)' : 'rgb(96, 27, 128)',
                      color: 'rgb(255, 255, 255)',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      border: 'none'
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        Sending...
                      </div>
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </>
          ) : (
            // Check Your Inbox View
            <>
              {/* Header Section */}
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(240, 253, 244)' }}>
                  <Check className="w-6 h-6" style={{ color: 'rgb(22, 163, 74)' }} />
                </div>
                <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(13, 17, 23)' }}>
                  Check your inbox
                </h1>
                <p className="text-sm font-medium" style={{ color: 'rgb(123, 130, 153)' }}>
                  We sent a reset link to
                </p>
                <p className="font-semibold text-sm mt-1" style={{ color: 'rgb(96, 27, 128)' }}>
                  {email}
                </p>
              </div>

              {/* Steps Card */}
              <div className="rounded-2xl p-7 space-y-5" style={{ 
                background: 'rgb(255, 255, 255)', 
                border: '1px solid rgb(228, 233, 244)', 
                boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
              }}>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ 
                      width: '24px', 
                      height: '24px', 
                      background: 'rgb(96, 27, 128)' 
                    }}>
                      <span className="text-white text-[10px] font-bold">1</span>
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: 'rgb(55, 65, 81)' }}>
                      Check your inbox for an email from Ru-max
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ 
                      width: '24px', 
                      height: '24px', 
                      background: 'rgb(96, 27, 128)' 
                    }}>
                      <span className="text-white text-[10px] font-bold">2</span>
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: 'rgb(55, 65, 81)' }}>
                      Click the secure reset link — valid for 1 hour
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center rounded-full shrink-0 mt-0.5" style={{ 
                      width: '24px', 
                      height: '24px', 
                      background: 'rgb(96, 27, 128)' 
                    }}>
                      <span className="text-white text-[10px] font-bold">3</span>
                    </div>
                    <span className="text-sm leading-relaxed" style={{ color: 'rgb(55, 65, 81)' }}>
                      Create a new password and sign in
                    </span>
                  </div>
                </div>

                <p className="text-xs text-center" style={{ color: 'rgb(160, 170, 191)' }}>
                  Didn't receive it? Check your spam folder.
                </p>

                <button
                  onClick={handleTryAnotherEmail}
                  className="w-full rounded-xl py-2.5 font-semibold text-sm transition-colors"
                  style={{ 
                    border: '1.5px solid rgb(228, 233, 244)',
                    background: 'rgb(255, 255, 255)',
                    color: 'rgb(123, 130, 153)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(96, 27, 128)';
                    e.currentTarget.style.color = 'rgb(96, 27, 128)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(228, 233, 244)';
                    e.currentTarget.style.color = 'rgb(123, 130, 153)';
                  }}
                >
                  Try another email
                </button>

                <div className="text-center">
                  <button
                    onClick={handleBackToSignIn}
                    className="inline-flex items-center gap-1.5 text-sm transition-colors"
                    style={{ color: 'rgb(160, 170, 191)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(96, 27, 128)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(160, 170, 191)'}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to sign in
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <Shield className="w-3.5 h-3.5" style={{ color: 'rgb(160, 170, 191)' }} />
            <span className="text-xs font-medium" style={{ color: 'rgb(160, 170, 191)' }}>
              Enterprise-grade security & encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;