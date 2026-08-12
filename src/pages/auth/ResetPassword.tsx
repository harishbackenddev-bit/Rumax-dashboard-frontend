// pages/auth/ResetPassword.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowRight, ArrowLeft, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Logo from "@/assets/home/logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setError("No reset token provided. Please request a new password reset link.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password strength
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/reset-password`, {
        token: token,
        newPassword: password,
        confirmPassword: confirmPassword,
      });

      if (response.data.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate("/login", { 
            state: { message: "Password reset successfully! Please login with your new password." } 
          });
        }, 3000);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.message || 
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Invalid Token View
  if (!isTokenValid) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'rgb(247, 249, 252)' }}>
        <header className="px-8 py-5 flex items-center justify-between shrink-0" style={{ 
          background: 'rgb(255, 255, 255)', 
          borderBottom: '1px solid rgb(226, 236, 246)',
          boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 4px'
        }}>
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Ru-max" className="h-12 w-auto object-contain" />
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-[420px] rounded-2xl p-8 text-center" style={{ 
            background: 'rgb(255, 255, 255)', 
            border: '1px solid rgb(228, 233, 244)', 
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
          }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(254, 242, 242)' }}>
              <AlertCircle className="w-8 h-8" style={{ color: 'rgb(220, 38, 38)' }} />
            </div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'rgb(13, 17, 23)' }}>Invalid Reset Link</h2>
            <p className="text-sm mb-6" style={{ color: 'rgb(123, 130, 153)' }}>{error}</p>
            <Link
              to="/forgot-password"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-2.5 font-bold text-sm transition-colors"
              style={{ 
                background: 'rgb(96, 27, 128)',
                color: 'rgb(255, 255, 255)'
              }}
            >
              Request New Link
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1.5 text-sm transition-colors"
          style={{ color: 'rgb(123, 130, 153)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'rgb(96, 27, 128)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'rgb(123, 130, 153)'}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign in
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(238, 241, 251)' }}>
              <Lock className="w-6 h-6" style={{ color: 'rgb(96, 27, 128)' }} />
            </div>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(13, 17, 23)' }}>
              Create New Password
            </h1>
            <p className="text-sm font-medium" style={{ color: 'rgb(123, 130, 153)' }}>
              Enter your new password below
            </p>
          </div>

          <div className="rounded-2xl p-7" style={{ 
            background: 'rgb(255, 255, 255)', 
            border: '1px solid rgb(228, 233, 244)', 
            boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
          }}>
            {success ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgb(240, 253, 244)' }}>
                  <CheckCircle className="w-8 h-8" style={{ color: 'rgb(22, 163, 74)' }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: 'rgb(13, 17, 23)' }}>Password Reset Successful!</h3>
                <p className="text-sm" style={{ color: 'rgb(123, 130, 153)' }}>Redirecting to login...</p>
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2" style={{ borderColor: 'rgb(96, 27, 128)', borderTopColor: 'transparent' }} />
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <div className="rounded-xl px-4 py-3 mb-4 text-sm font-medium flex items-start gap-2" style={{ 
                    background: 'rgb(254, 242, 242)',
                    border: '1px solid rgb(254, 202, 202)',
                    color: 'rgb(220, 38, 38)'
                  }}>
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(160, 170, 191)' }}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(160, 170, 191)' }} />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none transition-all"
                        style={{ 
                          border: '1.5px solid rgb(228, 233, 244)',
                          background: 'rgb(248, 249, 254)',
                          color: 'rgb(13, 17, 23)',
                          fontFamily: 'Manrope, sans-serif'
                        }}
                        placeholder="Minimum 8 characters"
                        required
                        minLength={8}
                        onFocus={(e) => e.target.style.borderColor = 'rgb(96, 27, 128)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgb(228, 233, 244)'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(160, 170, 191)' }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: 'rgb(160, 170, 191)' }}>
                      Must be at least 8 characters with letters and numbers
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1.5 uppercase tracking-wider" style={{ color: 'rgb(160, 170, 191)' }}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(160, 170, 191)' }} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none transition-all"
                        style={{ 
                          border: '1.5px solid rgb(228, 233, 244)',
                          background: 'rgb(248, 249, 254)',
                          color: 'rgb(13, 17, 23)',
                          fontFamily: 'Manrope, sans-serif'
                        }}
                        placeholder="Confirm your new password"
                        required
                        onFocus={(e) => e.target.style.borderColor = 'rgb(96, 27, 128)'}
                        onBlur={(e) => e.target.style.borderColor = 'rgb(228, 233, 244)'}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(160, 170, 191)' }}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                        Resetting...
                      </div>
                    ) : (
                      <>
                        Reset Password
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

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

export default ResetPassword;