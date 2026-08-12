// pages/admin/PostJob.tsx
import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Save,
  Eye,
  Send,
  Plus,
  GripVertical,
  CircleCheckBig,
  Trash2,
  ChevronDown,
  X,
  Check,
  Users,
  UserPlus,
  UserCheck,
  RefreshCw,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Responsibility {
  id: string;
  text: string;
}

interface Requirement {
  id: string;
  text: string;
}

interface Benefit {
  id: string;
  text: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  assigned: boolean;
}

// Static locations
const STATIC_LOCATIONS = [
  'London',
  'Manchester',
  'Birmingham',
  'Liverpool',
  'Leeds',
  'Sheffield',
  'Bristol',
  'Nottingham',
  'Leicester',
  'Newcastle',
  'Glasgow',
  'Edinburgh',
  'Cardiff',
  'Belfast',
  'Southampton',
  'Portsmouth',
  'Reading',
  'Oxford',
  'Cambridge',
  'Brighton'
];

const PostJob = () => {
  const navigate = useNavigate();

  // Loading states
  const [saving, setSaving] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);
  const [showMobilePreview, setShowMobilePreview] = useState(false);

  // Form state
  const [jobTitle, setJobTitle] = useState('');
  const [availability, setAvailability] = useState('');
  const [experience, setExperience] = useState('');
  const [contractType, setContractType] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [status, setStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');

  // List states
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([
    { id: '1', text: 'Provide personal care support' },
    { id: '2', text: 'Assist with medication administration' },
    { id: '3', text: 'Maintain accurate care records' }
  ]);
  const [newResponsibility, setNewResponsibility] = useState('');

  const [requirements, setRequirements] = useState<Requirement[]>([
    { id: '1', text: 'Right to work in the UK' },
    { id: '2', text: 'Valid DBS Certificate' },
    { id: '3', text: 'Excellent communication skills' }
  ]);
  const [newRequirement, setNewRequirement] = useState('');

  const [benefits, setBenefits] = useState<Benefit[]>([
    { id: '1', text: 'Competitive Salary' },
    { id: '2', text: 'Flexible Working Hours' },
    { id: '3', text: 'Paid Training' },
    { id: '4', text: 'Career Progression' }
  ]);
  const [newBenefit, setNewBenefit] = useState('');

  // Team members
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([]);
  const [availableTeamMembers, setAvailableTeamMembers] = useState<TeamMember[]>([]);

  // Application config
  const [autoShortlistScore, setAutoShortlistScore] = useState(75);
  const [requireResume, setRequireResume] = useState(true);
  const [requireCoverLetter, setRequireCoverLetter] = useState(false);
  const [requireDrivingLicence, setRequireDrivingLicence] = useState(false);
  const [requireDBS, setRequireDBS] = useState(true);
  const [requireReferences, setRequireReferences] = useState(true);

  // Helper functions
  const getInitials = (name: string): string => {
    if (!name) return '??';
    const nameParts = name.trim().split(' ');
    if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  const getColor = (name: string): string => {
    const colors = ['#0F4C81', '#27B3C9', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB', '#0891B2'];
    if (!name) return colors[0];
    const index = (name.length || 0) % colors.length;
    return colors[index];
  };

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setLoadingTeamMembers(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to fetch team members');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const teamMemberRoles = ['recruiter', 'hr_manager', 'hiring_manager', 'admin', 'super_admin'];
      const teamMembers = response.data.data
        .filter((user: any) => teamMemberRoles.includes(user.role) && user.isActive)
        .map((user: any) => ({
          id: user._id,
          name: user.name,
          role: user.roleDisplay || user.role,
          initials: user.initials || getInitials(user.name),
          color: user.color || getColor(user.name),
          assigned: false
        }));

      setAvailableTeamMembers(teamMembers);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch team members');
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  // Location handlers
  const toggleLocation = (location: string) => {
    if (locations.includes(location)) {
      setLocations(locations.filter(l => l !== location));
    } else {
      setLocations([...locations, location]);
    }
  };

  const removeLocation = (location: string) => {
    setLocations(locations.filter(l => l !== location));
  };

  // Team member handlers
  const toggleTeamMember = (member: TeamMember) => {
    const isSelected = selectedTeamMembers.some(m => m.id === member.id);

    if (isSelected) {
      setSelectedTeamMembers(selectedTeamMembers.filter(m => m.id !== member.id));
      setAvailableTeamMembers([...availableTeamMembers, { ...member, assigned: false }]);
      toast.success(`Removed ${member.name} from team`);
    } else {
      setSelectedTeamMembers([...selectedTeamMembers, { ...member, assigned: true }]);
      setAvailableTeamMembers(availableTeamMembers.filter(m => m.id !== member.id));
      toast.success(`Added ${member.name} to team`);
    }
  };

  const removeSelectedTeamMember = (memberId: string) => {
    const member = selectedTeamMembers.find(m => m.id === memberId);
    if (member) {
      setSelectedTeamMembers(selectedTeamMembers.filter(m => m.id !== memberId));
      setAvailableTeamMembers([...availableTeamMembers, { ...member, assigned: false }]);
      toast.success(`Removed ${member.name} from team`);
    }
  };

  // Add handlers with toast
  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setResponsibilities([...responsibilities, { id: Date.now().toString(), text: newResponsibility }]);
      setNewResponsibility('');
      toast.success('Responsibility added');
    } else {
      toast.error('Please enter a responsibility');
    }
  };

  const removeResponsibility = (id: string) => {
    setResponsibilities(responsibilities.filter(r => r.id !== id));
    toast.success('Responsibility removed');
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, { id: Date.now().toString(), text: newRequirement }]);
      setNewRequirement('');
      toast.success('Requirement added');
    } else {
      toast.error('Please enter a requirement');
    }
  };

  const removeRequirement = (id: string) => {
    setRequirements(requirements.filter(r => r.id !== id));
    toast.success('Requirement removed');
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setBenefits([...benefits, { id: Date.now().toString(), text: newBenefit }]);
      setNewBenefit('');
      toast.success('Benefit added');
    } else {
      toast.error('Please enter a benefit');
    }
  };

  const removeBenefit = (id: string) => {
    setBenefits(benefits.filter(b => b.id !== id));
    toast.success('Benefit removed');
  };

  // Get form data
  const getFormData = () => ({
    jobTitle,
    availability,
    experience,
    contractType,
    locations,
    salaryMin,
    salaryMax,
    status: status || 'Draft',
    startDate: startDate || null,
    deadline,
    notes: notes || null,
    responsibilities,
    requirements,
    benefits,
    teamMembers: selectedTeamMembers,
    autoShortlistScore,
    requireResume,
    requireCoverLetter,
    requireDrivingLicence,
    requireDBS,
    requireReferences
  });

  // Validate function with detailed error messages
  const validateForm = (isPublishing: boolean): boolean => {
    const errors: string[] = [];
    setValidationErrors([]);

    if (!jobTitle || jobTitle.trim() === '') {
      errors.push('❌ Job Title is required');
    }

    if (!availability) {
      errors.push('❌ Availability is required');
    }

    if (!experience) {
      errors.push('❌ Experience is required');
    }

    if (!contractType) {
      errors.push('❌ Contract Type is required');
    }

    if (!locations || locations.length === 0) {
      errors.push('❌ At least one Location is required');
    }

    if (!salaryMin || salaryMin.trim() === '') {
      errors.push('❌ Minimum Salary is required');
    }

    if (!salaryMax || salaryMax.trim() === '') {
      errors.push('❌ Maximum Salary is required');
    }

    if (!deadline) {
      errors.push('❌ Application Deadline is required');
    }

    if (isPublishing) {
      if (!notes || notes.trim() === '') {
        errors.push('❌ Job Overview/Notes is required');
      }

      if (!responsibilities || responsibilities.length === 0) {
        errors.push('❌ At least one Responsibility is required');
      }

      if (!requirements || requirements.length === 0) {
        errors.push('❌ At least one Requirement is required');
      }

      if (!selectedTeamMembers || selectedTeamMembers.length === 0) {
        errors.push('❌ At least one Team Member must be assigned');
      }

      const minSalaryNum = parseFloat(salaryMin.replace(/,/g, ''));
      const maxSalaryNum = parseFloat(salaryMax.replace(/,/g, ''));

      if (!isNaN(minSalaryNum) && !isNaN(maxSalaryNum) && minSalaryNum > maxSalaryNum) {
        errors.push('❌ Maximum Salary must be greater than Minimum Salary');
      }

      if (!isNaN(minSalaryNum) && minSalaryNum <= 0) {
        errors.push('❌ Minimum Salary must be greater than 0');
      }
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      errors.forEach(error => {
        toast.error(error);
      });
      return false;
    }

    return true;
  };

  // Save Draft
  const handleSaveDraft = async () => {
    try {
      setSaving(true);

      if (!validateForm(false)) {
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('❌ Please login to save job');
        navigate('/login');
        return;
      }

      const jobData = getFormData();
      jobData.status = 'Draft';

      await axios.post(`${API_URL}/api/admin/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('✅ Draft saved successfully!');

      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1500);

    } catch (error: any) {
      console.error('Error saving draft:', error);
      toast.error(error.response?.data?.message || '❌ Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Publish Job
  const handlePublish = async () => {
    try {
      setSaving(true);

      if (!validateForm(true)) {
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('❌ Please login to publish job');
        navigate('/login');
        return;
      }

      const jobData = getFormData();
      jobData.status = 'Open';

      const response = await axios.post(`${API_URL}/api/admin/jobs`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.data._id) {
        await axios.post(`${API_URL}/api/admin/jobs/${response.data.data._id}/publish`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('🎉 Job published successfully!');
      }

      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1500);

    } catch (error: any) {
      console.error('Error publishing job:', error);
      toast.error(error.response?.data?.message || '❌ Failed to publish job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Toggle switch component
  const ToggleSwitch = ({
    label,
    description,
    value,
    onChange
  }: {
    label: string;
    description: string;
    value: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 pr-4">
        <p className="text-[13px] font-semibold text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex items-center gap-2 rounded-full transition-all flex-shrink-0 bg-transparent border-0 cursor-pointer p-0"
      >
        <span className={`text-[11px] font-semibold ${value ? 'text-[#27B3C9]' : 'text-slate-500'}`}>
          {value ? 'ON' : 'OFF'}
        </span>
        <div
          className="rounded-full transition-colors relative w-[42px] h-6"
          style={{
            background: value ? 'rgb(15, 76, 129)' : 'rgb(203, 213, 225)',
          }}
        >
          <div
            className="absolute rounded-full transition-all bg-white w-[18px] h-[18px] top-[3px]"
            style={{
              left: value ? '21px' : '3px',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 4px'
            }}
          />
        </div>
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F7F9FC]">
      {/* Header - Responsive */}
      <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-5 shrink-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 bg-white border-b border-[#E2ECF6] shadow-[0_1px_4px_rgba(15,76,129,0.06)]">
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-1.5 mb-1.5 text-xs text-slate-500 bg-transparent border-0 cursor-pointer hover:text-slate-700"
          >
            <ArrowLeft size={13} />
            Back to Jobs & Vacancies
          </button>
          <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-[#0F4C81] m-0 truncate">
            Create New Job
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 hidden sm:block">
            Create and publish vacancies across the Ru-max recruitment platform.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile Preview Toggle */}
          <button
            onClick={() => setShowMobilePreview(!showMobilePreview)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E2ECF6] bg-white text-sm font-semibold text-slate-700"
          >
            <Eye size={14} />
            <span className="hidden xs:inline">Preview</span>
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl border border-[#E2ECF6] bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            <Save size={14} />
            <span className="hidden xs:inline">{saving ? 'Saving...' : 'Save Draft'}</span>
            <span className="xs:hidden">{saving ? 'Saving...' : 'Save'}</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-[#0F4C81] text-white text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a3a63] transition-colors border-0"
          >
            <Send size={14} />
            <span className="hidden xs:inline">{saving ? 'Publishing...' : 'Publish Job'}</span>
            <span className="xs:hidden">{saving ? '...' : 'Publish'}</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 gap-3 sm:gap-5 px-3 sm:px-6 md:px-8 py-4 sm:py-6 overflow-hidden flex-col lg:flex-row">
        {/* Main Form */}
        <div className={`flex-1 overflow-y-auto min-w-0 ${showMobilePreview ? 'hidden lg:block' : 'block'}`}>
          {/* Basic Job Information */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Basic Job Information
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                Core details about this vacancy
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="grid gap-4 sm:gap-5 grid-cols-1 md:grid-cols-2">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Job Title<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <input
                    placeholder="e.g. Support Worker"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-colors duration-150 bg-[#F8FAFC] border"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{
                      border: !jobTitle && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)'
                    }}
                  />
                  {!jobTitle && validationErrors.some(e => e.includes('Job Title')) && (
                    <p className="text-[11px] text-red-600 mt-1">Job Title is required</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Availability<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none text-sm bg-[#F8FAFC] border outline-none"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      style={{
                        border: !availability && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        color: availability ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)'
                      }}
                    >
                      <option value="">Select…</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Bank Hours">Bank Hours</option>
                      <option value="Contract">Contract</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                  {!availability && validationErrors.some(e => e.includes('Availability')) && (
                    <p className="text-[11px] text-red-600 mt-1">Availability is required</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Experience Required<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none text-sm bg-[#F8FAFC] border outline-none"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      style={{
                        border: !experience && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        color: experience ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)'
                      }}
                    >
                      <option value="">Select…</option>
                      <option value="No Experience">No Experience</option>
                      <option value="1+ Years">1+ Years</option>
                      <option value="2+ Years">2+ Years</option>
                      <option value="3+ Years">3+ Years</option>
                      <option value="5+ Years">5+ Years</option>
                      <option value="10+ Years">10+ Years</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                  {!experience && validationErrors.some(e => e.includes('Experience')) && (
                    <p className="text-[11px] text-red-600 mt-1">Experience is required</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Contract Type<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none text-sm bg-[#F8FAFC] border outline-none"
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      style={{
                        border: !contractType && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        color: contractType ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)'
                      }}
                    >
                      <option value="">Select…</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Fixed Term">Fixed Term</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                  {!contractType && validationErrors.some(e => e.includes('Contract Type')) && (
                    <p className="text-[11px] text-red-600 mt-1">Contract Type is required</p>
                  )}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Location<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 bg-[#F8FAFC] border text-left"
                      style={{
                        border: locations.length === 0 && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)'
                      }}
                    >
                      <div className="flex flex-wrap gap-1 flex-1">
                        {locations.length > 0 ? (
                          locations.map((loc) => (
                            <span
                              key={loc}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-[#0F4C81] text-white"
                            >
                              {loc}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLocation(loc);
                                }}
                                className="bg-transparent border-0 text-white cursor-pointer p-0.5"
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">Select locations…</span>
                        )}
                      </div>
                      <ChevronDown size={14} className="flex-shrink-0 text-slate-500" />
                    </button>

                    {showLocationDropdown && (
                      <div className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden bg-white border border-[#E2ECF6] shadow-lg max-h-48 overflow-y-auto">
                        {STATIC_LOCATIONS.map((location) => (
                          <button
                            key={location}
                            onClick={() => toggleLocation(location)}
                            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors bg-transparent border-0 cursor-pointer text-left text-sm text-slate-800"
                          >
                            {location}
                            {locations.includes(location) && (
                              <Check size={16} className="text-[#0F4C81]" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {locations.length === 0 && validationErrors.some(e => e.includes('Location')) && (
                    <p className="text-[11px] text-red-600 mt-1">At least one location is required</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Salary Range<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">£</span>
                      <input
                        placeholder="24,000"
                        className="w-full rounded-xl py-2.5 pl-7 pr-3 text-sm text-slate-800 bg-[#F8FAFC] border outline-none"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        style={{
                          border: !salaryMin && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)'
                        }}
                      />
                    </div>
                    <span className="text-slate-500 font-semibold">—</span>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">£</span>
                      <input
                        placeholder="32,000"
                        className="w-full rounded-xl py-2.5 pl-7 pr-3 text-sm text-slate-800 bg-[#F8FAFC] border outline-none"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        style={{
                          border: !salaryMax && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)'
                        }}
                      />
                    </div>
                  </div>
                  {(!salaryMin || !salaryMax) && validationErrors.some(e => e.includes('Salary')) && (
                    <p className="text-[11px] text-red-600 mt-1">Both salary values are required</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Status<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none text-sm bg-[#F8FAFC] border border-[#E2ECF6] outline-none"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{ color: status ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)' }}
                    >
                      <option value="">Select…</option>
                      <option value="Draft">Draft</option>
                      <option value="Open">Open</option>
                      <option value="Paused">Paused</option>
                      <option value="Closed">Closed</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-[#F8FAFC] border border-[#E2ECF6] outline-none"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Application Deadline<span className="text-red-600 ml-0.5">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl px-3.5 py-2.5 text-sm text-slate-800 bg-[#F8FAFC] border outline-none"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{
                      border: !deadline && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)'
                    }}
                  />
                  {!deadline && validationErrors.some(e => e.includes('Deadline')) && (
                    <p className="text-[11px] text-red-600 mt-1">Application Deadline is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Overview */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Job Overview
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                Provide a summary of the role and what candidates can expect
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Notes <span className="text-red-600">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Join our growing care team delivering exceptional support services across Essex and surrounding areas…"
                className="w-full rounded-xl px-4 py-3 text-sm text-slate-800 bg-[#F8FAFC] border outline-none resize-y leading-relaxed"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  border: !notes && validationErrors.some(e => e.includes('Notes')) ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)'
                }}
              />
              {!notes && validationErrors.some(e => e.includes('Notes')) && (
                <p className="text-[11px] text-red-600 mt-1">Job Overview/Notes are required for publishing</p>
              )}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Responsibilities <span className="text-red-600">*</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                List the key duties and day-to-day tasks for this role
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="space-y-2 mb-3">
                {responsibilities.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-xl px-3 py-2.5 bg-[#F8FAFC] border border-[#E2ECF6]">
                    <GripVertical size={14} className="flex-shrink-0 text-[#CBD5E1] cursor-grab" />
                    <CircleCheckBig size={14} className="flex-shrink-0 text-[#0F4C81]" />
                    <span className="flex-1 text-sm text-slate-800 cursor-text">{item.text}</span>
                    <button
                      onClick={() => removeResponsibility(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-red-50 border-0 cursor-pointer"
                    >
                      <Trash2 size={12} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add a responsibility and press Enter…"
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none border border-dashed border-[#0F4C81]/40 bg-[#0F4C81]/5"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                />
                <button
                  onClick={addResponsibility}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F4C81] text-white text-xs font-semibold border-0 cursor-pointer whitespace-nowrap hover:bg-[#0a3a63] transition-colors"
                >
                  <Plus size={13} />
                  Add
                </button>
              </div>
              {responsibilities.length === 0 && validationErrors.some(e => e.includes('Responsibility')) && (
                <p className="text-[11px] text-red-600 mt-2">At least one responsibility is required for publishing</p>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Requirements <span className="text-red-600">*</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                Skills, qualifications and certifications required
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="space-y-2 mb-3">
                {requirements.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-xl px-3 py-2.5 bg-[#F8FAFC] border border-[#E2ECF6]">
                    <GripVertical size={14} className="flex-shrink-0 text-[#CBD5E1] cursor-grab" />
                    <CircleCheckBig size={14} className="flex-shrink-0 text-[#059669]" />
                    <span className="flex-1 text-sm text-slate-800 cursor-text">{item.text}</span>
                    <button
                      onClick={() => removeRequirement(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-red-50 border-0 cursor-pointer"
                    >
                      <Trash2 size={12} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add a requirement and press Enter…"
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none border border-dashed border-[#059669]/40 bg-[#059669]/5"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                />
                <button
                  onClick={addRequirement}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#059669] text-white text-xs font-semibold border-0 cursor-pointer whitespace-nowrap hover:bg-[#047857] transition-colors"
                >
                  <Plus size={13} />
                  Add
                </button>
              </div>
              {requirements.length === 0 && validationErrors.some(e => e.includes('Requirement')) && (
                <p className="text-[11px] text-red-600 mt-2">At least one requirement is required for publishing</p>
              )}
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Benefits & Perks
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                What does Ru-max offer successful candidates?
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="space-y-2 mb-3">
                {benefits.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-xl px-3 py-2.5 bg-[#F8FAFC] border border-[#E2ECF6]">
                    <GripVertical size={14} className="flex-shrink-0 text-[#CBD5E1] cursor-grab" />
                    <CircleCheckBig size={14} className="flex-shrink-0 text-[#D97706]" />
                    <span className="flex-1 text-sm text-slate-800 cursor-text">{item.text}</span>
                    <button
                      onClick={() => removeBenefit(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded bg-red-50 border-0 cursor-pointer"
                    >
                      <Trash2 size={12} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  placeholder="Add a benefit and press Enter…"
                  className="flex-1 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 outline-none border border-dashed border-[#D97706]/40 bg-[#D97706]/5"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                />
                <button
                  onClick={addBenefit}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D97706] text-white text-xs font-semibold border-0 cursor-pointer whitespace-nowrap hover:bg-[#B45309] transition-colors"
                >
                  <Plus size={13} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Application Configuration */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Application Configuration
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                Configure screening and required documents
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-700">
                    Auto Shortlisting Score
                  </label>
                  <span className="text-sm font-extrabold text-[#0F4C81]">{autoShortlistScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full accent-[#0F4C81] cursor-pointer"
                  value={autoShortlistScore}
                  onChange={(e) => setAutoShortlistScore(Number(e.target.value))}
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-slate-500">0%</span>
                  <span className="text-[10px] text-slate-500">100%</span>
                </div>
              </div>

              <div className="border-t border-[#E2ECF6] pt-1">
                <ToggleSwitch
                  label="Require Resume Upload"
                  description="Candidates must upload a CV to apply"
                  value={requireResume}
                  onChange={setRequireResume}
                />
                <ToggleSwitch
                  label="Require Cover Letter"
                  description="Candidates must submit a cover letter"
                  value={requireCoverLetter}
                  onChange={setRequireCoverLetter}
                />
                <ToggleSwitch
                  label="Require Driving Licence"
                  description="Driving licence required for this role"
                  value={requireDrivingLicence}
                  onChange={setRequireDrivingLicence}
                />
                <ToggleSwitch
                  label="Require DBS Information"
                  description="Candidates must provide DBS check details"
                  value={requireDBS}
                  onChange={setRequireDBS}
                />
                <ToggleSwitch
                  label="Require References"
                  description="At least 2 references must be provided"
                  value={requireReferences}
                  onChange={setRequireReferences}
                />
              </div>
            </div>
          </div>

          {/* Assign Hiring Team */}
          <div className="rounded-2xl mb-4 sm:mb-5 bg-white border border-[#E2ECF6] shadow-[0_1px_6px_rgba(15,76,129,0.06)]">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-[#E2ECF6]">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-[#27B3C9]" />
                <h3 className="text-sm sm:text-base font-bold text-[#0F4C81] m-0">
                  Assign Hiring Team <span className="text-red-600">*</span>
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-1 ml-3">
                Select the team members responsible for this vacancy
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Selected Team Members ({selectedTeamMembers.length})
                </label>
                {selectedTeamMembers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedTeamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-2 rounded-xl px-3 py-2"
                        style={{
                          border: `1px solid ${member.color}`,
                          background: `${member.color}15`
                        }}
                      >
                        <div
                          className="flex items-center justify-center rounded-full w-6 h-6 text-white text-[9px] font-bold"
                          style={{ background: member.color }}
                        >
                          {member.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-800 truncate">{member.name}</p>
                          <p className="text-[9px] text-slate-500">{member.role}</p>
                        </div>
                        <button
                          onClick={() => removeSelectedTeamMember(member.id)}
                          className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors bg-transparent border-0 cursor-pointer"
                        >
                          <X size={14} className="text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    {loadingTeamMembers ? 'Loading team members...' : 'No team members selected'}
                  </p>
                )}
                {selectedTeamMembers.length === 0 && validationErrors.some(e => e.includes('Team Member')) && (
                  <p className="text-[11px] text-red-600 mt-1">At least one team member is required for publishing</p>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowTeamMemberDropdown(!showTeamMemberDropdown)}
                  className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 border border-dashed border-[#0F4C81] bg-[#0F4C81]/5 cursor-pointer"
                  disabled={loadingTeamMembers}
                >
                  <span className="text-sm text-slate-500">
                    <UserPlus size={16} className="inline mr-2 text-[#0F4C81]" />
                    {loadingTeamMembers ? 'Loading team members...' : 'Add team member'}
                  </span>
                  <ChevronDown size={14} className="text-slate-500" />
                </button>

                {showTeamMemberDropdown && !loadingTeamMembers && (
                  <div className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden bg-white border border-[#E2ECF6] shadow-lg max-h-48 overflow-y-auto">
                    {availableTeamMembers.length > 0 ? (
                      availableTeamMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => toggleTeamMember(member)}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors bg-transparent border-0 cursor-pointer text-left"
                        >
                          <div
                            className="flex items-center justify-center rounded-full w-7 h-7 text-white text-[10px] font-bold"
                            style={{ background: member.color }}
                          >
                            {member.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-800">{member.name}</p>
                            <p className="text-[10px] text-slate-500">{member.role}</p>
                          </div>
                          <UserPlus size={14} className="text-[#0F4C81]" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center">
                        <p className="text-sm text-slate-500">
                          <UserCheck size={16} className="inline mr-2 text-[#059669]" />
                          {availableTeamMembers.length === 0 && selectedTeamMembers.length > 0
                            ? 'All team members selected'
                            : 'No team members available'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={fetchTeamMembers}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 bg-transparent border-0 cursor-pointer"
              >
                <RefreshCw size={14} className={loadingTeamMembers ? 'animate-spin' : ''} />
                Refresh team members
              </button>
            </div>
          </div>

          {/* Bottom Actions - Responsive */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-1 mb-2">
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-[#E2ECF6] bg-[#F8FAFC] text-xs sm:text-sm font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
              >
                <Save size={14} />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-[#E2ECF6] bg-red-50 text-xs sm:text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
                onClick={() => {
                  if (window.confirm('Are you sure you want to cancel? All unsaved data will be lost.')) {
                    navigate('/admin/jobs');
                  }
                }}
              >
                Cancel
              </button>
            </div>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#0F4C81] text-white text-xs sm:text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0a3a63] transition-colors border-0"
            >
              <Send size={14} />
              {saving ? 'Publishing...' : 'Publish Vacancy'}
            </button>
          </div>
        </div>

        {/* Sidebar Preview - Responsive */}
        <div className={`${showMobilePreview ? 'block' : 'hidden lg:block'} lg:w-[280px] flex-shrink-0`}>
          <div className="rounded-2xl overflow-hidden bg-white border border-[#E2ECF6] shadow-[0_4px_20px_rgba(15,76,129,0.1)] sticky top-4">
            <div className="px-4 sm:px-5 py-4 bg-[#0F4C81]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1 h-4 rounded-full bg-white/60" />
                    <p className="text-[10px] font-bold text-white/70 uppercase tracking-[0.08em]">
                      Live Preview
                    </p>
                  </div>
                  <h3 className="text-white text-base sm:text-lg font-extrabold m-0 truncate">
                    {jobTitle || 'Job Title'}
                  </h3>
                </div>
                {/* Close preview button on mobile */}
                <button
                  onClick={() => setShowMobilePreview(false)}
                  className="lg:hidden text-white hover:text-white/80 transition-colors bg-transparent border-0 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {availability && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold bg-white/20 text-white">
                    {availability}
                  </span>
                )}
                {contractType && (
                  <span className="rounded-full px-2 py-0.5 text-[9px] font-semibold bg-white/20 text-white">
                    {contractType}
                  </span>
                )}
              </div>
            </div>
            <div className="px-4 sm:px-5 py-4 overflow-y-auto max-h-[calc(100vh-320px)]">
              {/* Team members preview */}
              {selectedTeamMembers.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#0F4C81] mb-1.5">
                    Hiring Team
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTeamMembers.slice(0, 3).map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-1 rounded-full px-2 py-0.5"
                        style={{ background: `${member.color}20`, border: `1px solid ${member.color}` }}
                      >
                        <span className="text-[8px] font-bold" style={{ color: member.color }}>{member.initials}</span>
                        <span className="text-[9px] text-slate-800 truncate max-w-[60px]">{member.name}</span>
                      </div>
                    ))}
                    {selectedTeamMembers.length > 3 && (
                      <span className="text-[9px] text-slate-500">+{selectedTeamMembers.length - 3} more</span>
                    )}
                  </div>
                </div>
              )}

              {responsibilities.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#0F4C81] mb-1.5">
                    Responsibilities
                  </p>
                  {responsibilities.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1">
                      <CircleCheckBig size={10} className="flex-shrink-0 mt-0.5 text-[#27B3C9]" />
                      <span className="text-[11px] text-slate-700 line-clamp-1">{item.text}</span>
                    </div>
                  ))}
                  {responsibilities.length > 3 && (
                    <p className="text-[10px] text-slate-500">+{responsibilities.length - 3} more</p>
                  )}
                </div>
              )}

              {requirements.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#0F4C81] mb-1.5">
                    Requirements
                  </p>
                  {requirements.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1">
                      <CircleCheckBig size={10} className="flex-shrink-0 mt-0.5 text-[#059669]" />
                      <span className="text-[11px] text-slate-700 line-clamp-1">{item.text}</span>
                    </div>
                  ))}
                  {requirements.length > 3 && (
                    <p className="text-[10px] text-slate-500">+{requirements.length - 3} more</p>
                  )}
                </div>
              )}

              {benefits.length > 0 && (
                <div className="mb-4">
                  <p className="text-[11px] font-bold text-[#0F4C81] mb-1.5">
                    Benefits
                  </p>
                  {benefits.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1">
                      <span className="text-[9px] text-[#D97706]">★</span>
                      <span className="text-[11px] text-slate-700 line-clamp-1">{item.text}</span>
                    </div>
                  ))}
                  {benefits.length > 3 && (
                    <p className="text-[10px] text-slate-500">+{benefits.length - 3} more</p>
                  )}
                </div>
              )}

              <button className="w-full py-2.5 rounded-xl bg-[#0F4C81] text-white text-xs font-bold border-0 cursor-pointer hover:bg-[#0a3a63] transition-colors">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;