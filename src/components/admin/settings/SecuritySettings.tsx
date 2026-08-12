// components/settings/SecuritySettings.tsx
import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CircleCheckBig, Shield, Loader2, AlertCircle, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

const SecuritySettings = () => {
  const { user, AdminupdateDetails } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Show/hide password
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  // Load 2FA status from user context
  useEffect(() => {
    if (user) {
      setTwoFactorEnabled((user as any).twoFactorAuth || false);
    }
  }, [user]);

  // Password validation
  const validatePassword = (password: string) => {
    const errors: string[] = [];
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validation
    if (!currentPassword) {
      setError('Please enter your current password');
      toast.error('Please enter your current password');
      setLoading(false);
      return;
    }

    if (!newPassword) {
      setError('Please enter a new password');
      toast.error('Please enter a new password');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      toast.error('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      toast.error('New password must be different from current password');
      setLoading(false);
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(newPassword);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      toast.error(passwordErrors[0]);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const response = await axios.post<ApiResponse>(
        `${API_URL}/api/admin/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        toast.success('Password updated successfully!');
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || 'Failed to update password');
        toast.error(response.data.message || 'Failed to update password');
      }
    } catch (err: any) {
      console.error('Password change error:', err);
      setError(err.response?.data?.message || 'Failed to update password');
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleTwoFactorToggle = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      const newValue = !twoFactorEnabled;

      const response = await axios.patch<ApiResponse>(
        `${API_URL}/api/admin/update-profile`,
        {
          twoFactorAuth: newValue,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setTwoFactorEnabled(newValue);
        
        // Update auth context with new 2FA status
        if (AdminupdateDetails) {
          await AdminupdateDetails({
            twoFactorAuth: newValue,
          } as any);
        }

        toast.success(`Two-factor authentication ${newValue ? 'enabled' : 'disabled'} successfully!`);
      } else {
        toast.error(response.data.message || 'Failed to update 2FA settings');
      }
    } catch (err: any) {
      console.error('2FA toggle error:', err);
      toast.error(err.response?.data?.message || 'Failed to update 2FA settings');
    }
  };

  const ToggleSwitch = ({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) => (
    <button 
      onClick={() => onChange(!value)}
      className="relative rounded-full transition-colors shrink-0"
      style={{ 
        width: '44px', 
        height: '24px', 
        background: value ? 'rgb(96, 27, 128)' : 'rgb(228, 233, 244)',
        cursor: 'pointer',
        border: 'none',
        transition: 'background 0.2s'
      }}
    >
      <div 
        className="absolute rounded-full transition-all"
        style={{ 
          width: '18px', 
          height: '18px', 
          background: 'rgb(255, 255, 255)',
          top: '3px',
          left: value ? '23px' : '3px',
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 2px 4px',
          transition: 'left 0.2s'
        }}
      />
    </button>
  );

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-[#0D1117] mb-0.5 text-lg sm:text-[20px] font-bold">
          Security
        </h2>
        <p className="text-[13px] text-[#7B8299] font-medium">
          Manage passwords and authentication
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Password updated successfully!</span>
          <button
            onClick={() => setSuccess(false)}
            className="ml-auto text-green-700 hover:text-green-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Change Password */}
      <div className="rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 mb-3 sm:mb-4" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        <div className="flex items-center gap-3 mb-1 sm:mb-2">
          <div className="flex items-center justify-center rounded-xl w-8 h-8 sm:w-9 sm:h-9" style={{ background: 'rgb(238, 241, 251)' }}>
            <Key size={14} stroke="#601B80" strokeWidth={2} className="sm:w-[16px] sm:h-[16px]" />
          </div>
          <h4 className="text-[#0D1117] text-[14px] sm:text-[15px] font-bold">
            Change Password
          </h4>
        </div>

        <form onSubmit={handlePasswordChange}>
          <div>
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Current Password
            </label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="••••••••" 
                className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none pr-10"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
                required
              />
              <button 
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(160, 170, 191)' }}
              >
                {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input 
                type={showNewPassword ? 'text' : 'password'}
                placeholder="••••••••" 
                className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none pr-10"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
                required
              />
              <button 
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(160, 170, 191)' }}
              >
                {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Confirm New Password
            </label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••" 
                className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none pr-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
                required
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgb(160, 170, 191)' }}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="mt-2">
            <p className="text-[11px] text-[#A0AABF] leading-relaxed">
              Use at least 8 characters, one uppercase letter, one number and one special character.
            </p>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl w-full sm:w-auto text-[13px] font-bold text-white transition-colors disabled:opacity-60 mt-3"
            style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              'Update Password'
            )}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="rounded-2xl p-4 sm:p-6" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        <h4 className="text-[#0D1117] mb-1 text-[14px] sm:text-[15px] font-bold">
          Two-Factor Authentication
        </h4>
        <p className="text-[11px] sm:text-[12px] text-[#7B8299] font-medium mb-2 sm:mb-3">
          Add an extra layer of security to your account
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(238, 241, 251)' }}>
          <div>
            <p className="text-[13px] font-bold text-[#0D1117]">Enable 2FA</p>
            <p className="text-[11px] sm:text-[11.5px] text-[#7B8299] mt-0.5 font-medium">
              Require a verification code on every login
            </p>
          </div>
          <ToggleSwitch 
            value={twoFactorEnabled}
            onChange={handleTwoFactorToggle}
          />
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;