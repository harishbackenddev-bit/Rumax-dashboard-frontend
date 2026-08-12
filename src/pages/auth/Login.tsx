// pages/auth/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock, ArrowRight, Shield, Eye, EyeOff, ChevronRight } from 'lucide-react';
import Logo from '@/assets/home/logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      const userRole = result.data?.data?.role;

      if (userRole === "admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
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
        {/* <span className="text-sm" style={{ color: 'rgb(123, 130, 153)' }}>
          New here?{' '}
          <Link to="/onboarding" className="font-semibold hover:underline" style={{ color: 'rgb(96, 27, 128)' }}>
            Create account
          </Link>
        </span> */}
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px]">
          {/* Header Text */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'rgb(13, 17, 23)' }}>
              Welcome back
            </h1>
            <p className="text-sm font-medium" style={{ color: 'rgb(123, 130, 153)' }}>
              Sign in to your account to continue
            </p>
          </div>

          {/* Login Card */}
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
              {/* Email Field */}
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
                      border: "1.5px solid rgb(228, 233, 244)",
                      background: "rgb(248, 249, 254)",
                      color: "rgb(13, 17, 23)",
                      fontFamily: "Manrope, sans-serif",
                      fontSize: "14px",
                      lineHeight: "20px",
                      height: "44px",
                      paddingLeft: "48px",
                    }}
                    placeholder="you@email.com"
                    required
                    onFocus={(e) => e.target.style.borderColor = 'rgb(96, 27, 128)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgb(228, 233, 244)'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgb(160, 170, 191)' }}>
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-semibold hover:underline" style={{ color: 'rgb(96, 27, 128)' }}>
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgb(160, 170, 191)' }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl pl-10 pr-12 py-2.5 text-sm outline-none transition-all"
                    style={{
                      border: '1.5px solid rgb(228, 233, 244)',
                      background: 'rgb(248, 249, 254)',
                      color: 'rgb(13, 17, 23)',
                      fontFamily: 'Manrope, sans-serif'
                    }}
                    placeholder="Enter your password"
                    required
                    onFocus={(e) => e.target.style.borderColor = 'rgb(96, 27, 128)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgb(228, 233, 244)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(160, 170, 191)' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl py-2.5 font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-2"
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
                    Signing in...
                  </div>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo Accounts */}
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgb(238, 241, 251)' }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-3" style={{ color: 'rgb(160, 170, 191)' }}>
                Quick Demo Access
              </p>
              <div className="space-y-2">
                {/* <button
                  onClick={() => {
                    setEmail('harish.backend.dev@gmail.com');
                    setPassword('test@123');
                    setError(null);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left"
                  style={{ 
                    border: '1px solid rgb(238, 241, 251)',
                    background: 'rgb(250, 251, 254)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(96, 27, 128)';
                    e.currentTarget.style.background = 'rgb(245, 240, 251)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(238, 241, 251)';
                    e.currentTarget.style.background = 'rgb(250, 251, 254)';
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center rounded-lg w-8 h-8" style={{ background: 'rgb(238, 241, 251)' }}>
                      <span className="text-xs font-bold" style={{ color: 'rgb(96, 27, 128)' }}>U</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'rgb(13, 17, 23)' }}>User Account</p>
                      <p className="text-xs" style={{ color: 'rgb(160, 170, 191)' }}>harish.backend.dev@gmail.com</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'rgb(160, 170, 191)' }} />
                </button> */}

                <button
                  onClick={() => {
                    setEmail('admin@gmail.com');
                    setPassword('V7#mQ9@Lp2!Xr8$Nz');
                    setError(null);
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all text-left"
                  style={{
                    border: '1px solid rgb(238, 241, 251)',
                    background: 'rgb(250, 251, 254)',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(96, 27, 128)';
                    e.currentTarget.style.background = 'rgb(245, 240, 251)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgb(238, 241, 251)';
                    e.currentTarget.style.background = 'rgb(250, 251, 254)';
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center rounded-lg w-8 h-8" style={{ background: 'rgb(96, 27, 128)' }}>
                      <span className="text-xs font-bold text-white">A</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'rgb(13, 17, 23)' }}>Admin Account</p>
                      <p className="text-xs" style={{ color: 'rgb(160, 170, 191)' }}>admin@gmail.com</p>
                    </div>
                  </div>
                  <ChevronRight size={16} style={{ color: 'rgb(160, 170, 191)' }} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Security Badge */}
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

export default Login;