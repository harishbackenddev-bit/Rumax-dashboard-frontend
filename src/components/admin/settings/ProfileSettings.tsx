// components/settings/ProfileSettings.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Camera, CircleCheckBig, Loader2, AlertCircle, CheckCircle, X, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  role: string;
  profilePic?: string | null;
}

const ProfileSettings = () => {
  const { user, AdminupdateDetails } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    profilePic: null,
  });

  // Load user data from auth context
  useEffect(() => {
    if (user) {
      let profilePicUrl = null;
      if ((user as any).profilePic) {
        const pic = (user as any).profilePic;
        if (pic.startsWith('http://') || pic.startsWith('https://')) {
          profilePicUrl = pic;
        } else {
          const cleanPath = pic.replace(/^public\//, '');
          profilePicUrl = `${API_URL}/${cleanPath}`;
        }
      }

      // Split name into first and last name
      const fullName = user.name || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      setProfileData({
        firstName: firstName,
        lastName: lastName,
        email: user.email || '',
        phone: (user as any).phoneNumber || '',
        department: (user as any).department || 'IT',
        role: (user as any).role || 'Administrator',
        profilePic: profilePicUrl,
      });
      setPreviewUrl(profilePicUrl);
    }
  }, [user, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPEG, PNG, or WEBP)');
      toast.error('Please upload a valid image (JPEG, PNG, or WEBP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      toast.error('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setUploading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        toast.error('Authentication required');
        setUploading(false);
        return;
      }

      const uploadFormData = new FormData();
      uploadFormData.append('profileImage', file);

      const uploadResponse = await axios.post(
        `${API_URL}/api/update-profile-pic`,
        uploadFormData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (uploadResponse.data.success) {
        let imageUrl = uploadResponse.data.data?.imageUrl ||
          uploadResponse.data.data?.profilePic ||
          uploadResponse.data.data?.url;

        if (imageUrl && !imageUrl.startsWith('http')) {
          const cleanPath = imageUrl.replace(/^public\//, '');
          imageUrl = `${API_URL}${cleanPath}`;
        }

        const updateResponse = await axios.patch(
          `${API_URL}/api/admin/update-profile`,
          {
            profilePic: imageUrl,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (updateResponse.data.success) {
          setProfileData((prev) => ({
            ...prev,
            profilePic: imageUrl,
          }));
          setPreviewUrl(imageUrl);

          // Update auth context
          if (AdminupdateDetails) {
            await AdminupdateDetails({
              profilePic: imageUrl,
            } as any);
          }

          setSuccess(true);
          toast.success('Profile photo updated successfully!');
          setTimeout(() => setSuccess(false), 3000);
        } else {
          setError(updateResponse.data.message || 'Failed to update profile with image');
          toast.error(updateResponse.data.message || 'Failed to update profile with image');
        }
      } else {
        setError(uploadResponse.data.message || 'Failed to upload image');
        toast.error(uploadResponse.data.message || 'Failed to upload image');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload image. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const updateData = {
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        phoneNumber: profileData.phone,
        department: profileData.department,
      };

      const response = await axios.patch(
        `${API_URL}/api/admin/update-profile`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);

        // Update auth context with new data
        if (AdminupdateDetails) {
          await AdminupdateDetails({
            name: updateData.name,
            phoneNumber: updateData.phoneNumber,
            department: updateData.department,
          } as any);
        }

        toast.success('Profile updated successfully!');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || 'Failed to update profile');
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (err: any) {
      console.error('Profile update error:', err);
      setError(err.response?.data?.message || 'Failed to update profile. Please try again.');
      toast.error(err.response?.data?.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    if (!profileData.firstName && !profileData.lastName) return 'AU';
    return `${profileData.firstName[0] || ''}${profileData.lastName[0] || ''}`.toUpperCase() || 'AU';
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#601B80] mx-auto" />
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[560px]">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-[#0D1117] mb-0.5 text-lg sm:text-[20px] font-bold">
          Profile Settings
        </h2>
        <p className="text-[13px] text-[#7B8299] font-medium">
          Update your personal information
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm mb-4">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          <span>Profile updated successfully!</span>
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

      <div className="rounded-2xl p-4 sm:p-6 mb-4 sm:mb-5" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 mb-5 sm:mb-6">
          <div className="relative shrink-0">
            {previewUrl || profileData.profilePic ? (
              <img
                src={previewUrl || profileData.profilePic || ''}
                alt="Profile"
                className="w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] rounded-2xl object-cover border-2 border-[#601B80]"
              />
            ) : (
              <div 
                className="flex items-center justify-center rounded-2xl w-[64px] h-[64px] sm:w-[72px] sm:h-[72px] text-[20px] sm:text-[22px] font-extrabold text-white"
                style={{ background: 'rgb(96, 27, 128)', boxShadow: 'rgba(27, 43, 107, 0.4) 0px 4px 16px' }}
              >
                {getInitials()}
              </div>
            )}
            <button 
              onClick={handleFileInputClick}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-lg w-[22px] h-[22px] sm:w-[24px] sm:h-[24px] bg-[#601B80] hover:bg-[#4a1366] transition-colors disabled:opacity-50"
              style={{ border: '2px solid rgb(255, 255, 255)', cursor: 'pointer' }}
            >
              {uploading ? (
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              ) : (
                <Camera size={11} stroke="#fff" strokeWidth={2} className="sm:w-[12px] sm:h-[12px]" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-[14px] sm:text-[15px] font-extrabold text-[#0D1117]">
              {profileData.firstName} {profileData.lastName}
            </p>
            <p className="text-[11px] sm:text-[12px] text-[#7B8299] font-medium mt-0.5 sm:mt-[2px]">
              {profileData.role} · {profileData.department} Department
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-3">
              <button 
                onClick={handleFileInputClick}
                disabled={uploading}
                className="px-3 py-1.5 rounded-xl text-[11px] sm:text-[12px] font-bold text-white transition-colors disabled:opacity-50"
                style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
              >
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </button>
              <button 
                className="px-3 py-1.5 rounded-xl text-[11px] sm:text-[12px] font-semibold transition-colors hover:bg-gray-50"
                style={{ border: '1.5px solid rgb(228, 233, 244)', color: 'rgb(123, 130, 153)', cursor: 'pointer', background: 'rgb(255, 255, 255)' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
                First Name
              </label>
              <input 
                type="text" 
                name="firstName"
                className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none transition-colors"
                value={profileData.firstName}
                onChange={handleChange}
                style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
                Last Name
              </label>
              <input 
                type="text" 
                name="lastName"
                className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none transition-colors"
                value={profileData.lastName}
                onChange={handleChange}
                style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
                placeholder="Enter last name"
              />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <input 
              type="email" 
              disabled
              className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-gray-400 font-medium outline-none cursor-not-allowed bg-gray-50"
              value={profileData.email}
              style={{ border: '1.5px solid rgb(228, 233, 244)', fontFamily: 'Manrope, sans-serif' }}
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Phone
            </label>
            <input 
              type="text" 
              name="phone"
              className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none transition-colors"
              value={profileData.phone}
              onChange={handleChange}
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-[#A0AABF] block mb-1.5 uppercase tracking-wider">
              Department
            </label>
            <input 
              type="text" 
              name="department"
              className="w-full rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-[13px] text-[#0D1117] font-medium outline-none transition-colors"
              value={profileData.department}
              onChange={handleChange}
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontFamily: 'Manrope, sans-serif' }}
              placeholder="Enter department"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="flex items-center justify-center sm:justify-start gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl w-full sm:w-auto text-[13px] font-bold text-white transition-colors disabled:opacity-60"
        style={{ background: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <CircleCheckBig size={14} stroke="currentColor" strokeWidth={2} />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
};

export default ProfileSettings;