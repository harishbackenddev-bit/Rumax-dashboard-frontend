// pages/admin/EditJob.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  UserPlus,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
const STATIC_LOCATIONS =['London', 'South East', 'South West', 'East of England', 'West Midlands', 'East Midlands', 'Yorkshire and the Humber', 'North West', 'North East','Wales','Northern Ireland'];

const EditJob = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showTeamMemberDropdown, setShowTeamMemberDropdown] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(false);

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
  const [responsibilities, setResponsibilities] = useState<Responsibility[]>([]);
  const [newResponsibility, setNewResponsibility] = useState('');

  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [newRequirement, setNewRequirement] = useState('');

  const [benefits, setBenefits] = useState<Benefit[]>([]);
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

  // Fetch job data
  const fetchJobData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view job');
        navigate('/admin/jobs');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const job = response.data.data;

      // Populate form fields
      setJobTitle(job.jobTitle || '');
      setAvailability(job.availability || '');
      setExperience(job.experience || '');
      setContractType(job.contractType || '');
      setLocations(job.locations || []);
      setSalaryMin(job.salaryMin || '');
      setSalaryMax(job.salaryMax || '');
      setStatus(job.status || '');
      setStartDate(job.startDate || '');
      setDeadline(job.deadline || '');
      setNotes(job.notes || '');
      setResponsibilities(job.responsibilities || []);
      setRequirements(job.requirements || []);
      setBenefits(job.benefits || []);
      setSelectedTeamMembers(job.teamMembers || []);
      setAutoShortlistScore(job.autoShortlistScore || 75);
      setRequireResume(job.requireResume !== undefined ? job.requireResume : true);
      setRequireCoverLetter(job.requireCoverLetter || false);
      setRequireDrivingLicence(job.requireDrivingLicence || false);
      setRequireDBS(job.requireDBS !== undefined ? job.requireDBS : true);
      setRequireReferences(job.requireReferences !== undefined ? job.requireReferences : true);

      // Fetch team members
      await fetchTeamMembers();
    } catch (error: any) {
      console.error('Error fetching job:', error);
      toast.error(error.response?.data?.message || 'Failed to load job data');
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setLoadingTeamMembers(true);
      const token = localStorage.getItem('token');

      if (!token) {
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const teamMemberRoles = ['recruiter', 'hr_manager', 'hiring_manager', 'admin', 'super_admin'];
      const allTeamMembers = response.data.data
        .filter((user: any) => teamMemberRoles.includes(user.role) && user.isActive)
        .map((user: any) => ({
          id: user._id,
          name: user.name,
          role: user.roleDisplay || user.role,
          initials: user.initials || getInitials(user.name),
          color: user.color || getColor(user.name),
          assigned: false
        }));

      // Mark already selected team members
      const selectedIds = selectedTeamMembers.map(m => m.id);
      const available = allTeamMembers.filter(
        (m: TeamMember) => !selectedIds.includes(m.id)
      );

      setAvailableTeamMembers(available);
    } catch (error: any) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobData();
    }
  }, [id]);

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

  // Validate function
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

      await axios.put(`${API_URL}/api/admin/job/${id}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('✅ Draft updated successfully!');

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

  // Publish/Update Job
  const handleUpdate = async () => {
    try {
      setSaving(true);

      if (!validateForm(true)) {
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('❌ Please login to update job');
        navigate('/login');
        return;
      }

      const jobData = getFormData();
      jobData.status = 'Open';

      await axios.put(`${API_URL}/api/admin/job/${id}`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('🎉 Job updated successfully!');

      setTimeout(() => {
        navigate('/admin/jobs');
      }, 1500);

    } catch (error: any) {
      console.error('Error updating job:', error);
      toast.error(error.response?.data?.message || '❌ Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Delete job
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');

      await axios.delete(`${API_URL}/api/admin/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Job deleted successfully');
      navigate('/admin/jobs');
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-4">
      <div>
        <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{label}</p>
        <p style={{ fontSize: '11px', color: 'rgb(100, 116, 139)', marginTop: '1px' }}>{description}</p>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="flex items-center gap-2 rounded-full transition-all flex-shrink-0 self-start sm:self-auto"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span style={{ fontSize: '11px', color: value ? 'rgb(39, 179, 201)' : 'rgb(100, 116, 139)', fontWeight: 600 }}>
          {value ? 'ON' : 'OFF'}
        </span>
        <div
          className="rounded-full transition-colors"
          style={{
            width: '42px',
            height: '24px',
            background: value ? 'rgb(15, 76, 129)' : 'rgb(203, 213, 225)',
            position: 'relative'
          }}
        >
          <div
            className="absolute rounded-full transition-all"
            style={{
              width: '18px',
              height: '18px',
              background: 'rgb(255, 255, 255)',
              top: '3px',
              left: value ? '21px' : '3px',
              boxShadow: 'rgba(0, 0, 0, 0.25) 0px 1px 4px'
            }}
          />
        </div>
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full" style={{ background: 'rgb(247, 249, 252)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(15,76,129)] mx-auto"></div>
          <p style={{ marginTop: '16px', color: 'rgb(100, 116, 139)' }}>Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden" style={{ background: 'rgb(247, 249, 252)' }}>
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 shrink-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3" style={{
        background: 'rgb(255, 255, 255)',
        borderBottom: '1px solid rgb(226, 236, 246)',
        boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 4px'
      }}>
        <div>
          <button
            onClick={() => navigate('/admin/jobs')}
            className="flex items-center gap-1.5 mb-1 sm:mb-2"
            style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', background: 'none', cursor: 'pointer', border: 'none' }}
          >
            <ArrowLeft size={13} stroke="currentColor" strokeWidth={2} />
            Back to Jobs & Vacancies
          </button>
          <h1 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '18px sm:22px', fontWeight: 800 }}>
            Edit Job
          </h1>
          <p style={{ fontSize: '12px sm:13px', color: 'rgb(100, 116, 139)', marginTop: '2px sm:3px' }}>
            Update vacancy details for {jobTitle}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleDelete}
            disabled={saving}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl"
            style={{ border: '1px solid rgb(254, 202, 202)', background: 'rgb(254, 242, 242)', fontSize: '12px sm:13px', fontWeight: 600, color: 'rgb(220, 38, 38)', cursor: 'pointer' }}
          >
            <Trash2 size={13} stroke="currentColor" strokeWidth={2} />
            <span className="hidden sm:inline">Delete</span>
          </button>
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl"
            style={{
              border: '1px solid rgb(226, 236, 246)',
              background: saving ? 'rgb(226, 236, 246)' : 'rgb(248, 250, 252)',
              fontSize: '12px sm:13px',
              fontWeight: 600,
              color: 'rgb(71, 85, 105)',
              cursor: saving ? 'not-allowed' : 'pointer'
            }}
          >
            <Save size={13} stroke="currentColor" strokeWidth={2} />
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl"
            style={{
              background: saving ? 'rgb(100, 116, 139)' : 'rgb(15, 76, 129)',
              color: 'rgb(255, 255, 255)',
              fontSize: '12px sm:13px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              border: 'none'
            }}
          >
            <Send size={13} stroke="currentColor" strokeWidth={2} />
            {saving ? 'Updating...' : 'Update Job'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row flex-1 gap-4 sm:gap-5 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-hidden">
        {/* Main Form */}
        <div className="flex-1 overflow-y-auto min-w-0" style={{ paddingRight: '2px sm:4px' }}>
          {/* Basic Job Information */}
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Basic Job Information
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update core details about this vacancy
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Job Title<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <input
                    placeholder="e.g. Support Worker"
                    className="w-full rounded-xl px-3.5 py-2.5"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    style={{
                      border: !jobTitle && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                      background: 'rgb(248, 250, 252)',
                      fontSize: '13px',
                      color: 'rgb(15, 23, 42)',
                      outline: 'none',
                      transition: 'border 0.15s'
                    }}
                  />
                  {!jobTitle && validationErrors.some(e => e.includes('Job Title')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Job Title is required</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Availability<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      style={{
                        border: !availability && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        background: 'rgb(248, 250, 252)',
                        fontSize: '13px',
                        color: availability ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select…</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Bank Hours">Bank Hours</option>
                      <option value="Contract">Contract</option>
                    </select>
                    <ChevronDown size={14} stroke="#64748b" strokeWidth={2} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  {!availability && validationErrors.some(e => e.includes('Availability')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Availability is required</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Experience Required<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      style={{
                        border: !experience && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        background: 'rgb(248, 250, 252)',
                        fontSize: '13px',
                        color: experience ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)',
                        outline: 'none'
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
                    <ChevronDown size={14} stroke="#64748b" strokeWidth={2} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  {!experience && validationErrors.some(e => e.includes('Experience')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Experience is required</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Contract Type<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none"
                      value={contractType}
                      onChange={(e) => setContractType(e.target.value)}
                      style={{
                        border: !contractType && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        background: 'rgb(248, 250, 252)',
                        fontSize: '13px',
                        color: contractType ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select…</option>
                      <option value="Permanent">Permanent</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Fixed Term">Fixed Term</option>
                      <option value="Contract">Contract</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                    <ChevronDown size={14} stroke="#64748b" strokeWidth={2} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                  {!contractType && validationErrors.some(e => e.includes('Contract Type')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Contract Type is required</p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Location<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                      className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5"
                      style={{
                        border: locations.length === 0 && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                        background: 'rgb(248, 250, 252)',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <div className="flex flex-wrap gap-1">
                        {locations.length > 0 ? (
                          locations.map((loc) => (
                            <span
                              key={loc}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full"
                              style={{ fontSize: '11px', background: 'rgb(15, 76, 129)', color: 'white' }}
                            >
                              {loc}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeLocation(loc);
                                }}
                                style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0 2px' }}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))
                        ) : (
                          <span style={{ fontSize: '13px', color: 'rgb(100, 116, 139)' }}>Select locations…</span>
                        )}
                      </div>
                      <ChevronDown size={14} stroke="#64748b" strokeWidth={2} style={{ flexShrink: 0 }} />
                    </button>

                    {showLocationDropdown && (
                      <div
                        className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden"
                        style={{
                          background: 'white',
                          border: '1px solid rgb(226, 236, 246)',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          maxHeight: '200px',
                          overflowY: 'auto'
                        }}
                      >
                        {STATIC_LOCATIONS.map((location) => (
                          <button
                            key={location}
                            onClick={() => toggleLocation(location)}
                            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50 transition-colors"
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              textAlign: 'left',
                              fontSize: '13px',
                              color: 'rgb(15, 23, 42)'
                            }}
                          >
                            {location}
                            {locations.includes(location) && (
                              <Check size={16} stroke="#0F4C81" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {locations.length === 0 && validationErrors.some(e => e.includes('Location')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>At least one location is required</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Salary Range<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <div className="relative w-full">
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'rgb(100, 116, 139)' }}>£</span>
                      <input
                        placeholder="24,000"
                        className="w-full rounded-xl py-2.5 pl-7 pr-3"
                        value={salaryMin}
                        onChange={(e) => setSalaryMin(e.target.value)}
                        style={{
                          border: !salaryMin && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                          background: 'rgb(248, 250, 252)',
                          fontSize: '13px',
                          color: 'rgb(15, 23, 42)',
                          outline: 'none'
                        }}
                      />
                    </div>
                    <span style={{ color: 'rgb(100, 116, 139)', fontWeight: 600 }}>—</span>
                    <div className="relative w-full">
                      <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '13px', color: 'rgb(100, 116, 139)' }}>£</span>
                      <input
                        placeholder="32,000"
                        className="w-full rounded-xl py-2.5 pl-7 pr-3"
                        value={salaryMax}
                        onChange={(e) => setSalaryMax(e.target.value)}
                        style={{
                          border: !salaryMax && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                          background: 'rgb(248, 250, 252)',
                          fontSize: '13px',
                          color: 'rgb(15, 23, 42)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>
                  {(!salaryMin || !salaryMax) && validationErrors.some(e => e.includes('Salary')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Both salary values are required</p>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Status<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-xl px-3.5 py-2.5 appearance-none"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      style={{
                        border: '1px solid rgb(226, 236, 246)',
                        background: 'rgb(248, 250, 252)',
                        fontSize: '13px',
                        color: status ? 'rgb(15, 23, 42)' : 'rgb(100, 116, 139)',
                        outline: 'none'
                      }}
                    >
                      <option value="">Select…</option>
                      <option value="Draft">Draft</option>
                      <option value="Open">Open</option>
                      <option value="Paused">Paused</option>
                      <option value="Closed">Closed</option>
                      <option value="Archived">Archived</option>
                    </select>
                    <ChevronDown size={14} stroke="#64748b" strokeWidth={2} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Preferred Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl px-3.5 py-2.5"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{
                      border: '1px solid rgb(226, 236, 246)',
                      background: 'rgb(248, 250, 252)',
                      fontSize: '13px',
                      color: 'rgb(15, 23, 42)',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Application Deadline<span style={{ color: 'rgb(220, 38, 38)', marginLeft: '2px' }}>*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl px-3.5 py-2.5"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{
                      border: !deadline && validationErrors.length > 0 ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                      background: 'rgb(248, 250, 252)',
                      fontSize: '13px',
                      color: 'rgb(15, 23, 42)',
                      outline: 'none'
                    }}
                  />
                  {!deadline && validationErrors.some(e => e.includes('Deadline')) && (
                    <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Application Deadline is required</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Job Overview */}
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Job Overview
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update the summary of the role
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                Notes <span style={{ color: 'rgb(220, 38, 38)' }}>*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Join our growing care team delivering exceptional support services across Essex and surrounding areas…"
                className="w-full rounded-xl px-4 py-3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  border: !notes && validationErrors.some(e => e.includes('Notes')) ? '1px solid rgb(220, 38, 38)' : '1px solid rgb(226, 236, 246)',
                  background: 'rgb(248, 250, 252)',
                  fontSize: '13px',
                  color: 'rgb(15, 23, 42)',
                  outline: 'none',
                  resize: 'vertical',
                  lineHeight: '1.7'
                }}
              />
              {!notes && validationErrors.some(e => e.includes('Notes')) && (
                <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>Job Overview/Notes are required for publishing</p>
              )}
            </div>
          </div>

          {/* Responsibilities */}
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Responsibilities <span style={{ color: 'rgb(220, 38, 38)' }}>*</span>
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update the key duties and tasks for this role
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="space-y-2 mb-3">
                {responsibilities.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-xl px-3 py-2.5" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
                    <GripVertical size={14} stroke="#CBD5E1" strokeWidth={2} style={{ cursor: 'grab', flexShrink: 0 }} />
                    <CircleCheckBig size={14} stroke="#0F4C81" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span className="flex-1 cursor-text text-sm sm:text-[13px]" style={{ color: 'rgb(15, 23, 42)' }}>{item.text}</span>
                    <button
                      onClick={() => removeResponsibility(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                      style={{ background: 'rgb(254, 242, 242)', cursor: 'pointer', border: 'none' }}
                    >
                      <Trash2 size={12} stroke="#DC2626" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  placeholder="Add a responsibility and press Enter…"
                  className="flex-1 rounded-xl px-3.5 py-2.5"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                  style={{
                    border: '1px dashed rgba(15, 76, 129, 0.376)',
                    background: 'rgba(15, 76, 129, 0.03)',
                    fontSize: '13px',
                    color: 'rgb(15, 23, 42)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addResponsibility}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl"
                  style={{ background: 'rgb(15, 76, 129)', color: 'rgb(255, 255, 255)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
                >
                  <Plus size={13} stroke="currentColor" strokeWidth={2} />
                  Add
                </button>
              </div>
              {responsibilities.length === 0 && validationErrors.some(e => e.includes('Responsibility')) && (
                <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '8px' }}>At least one responsibility is required for publishing</p>
              )}
            </div>
          </div>

          {/* Requirements */}
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Requirements <span style={{ color: 'rgb(220, 38, 38)' }}>*</span>
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update the skills and qualifications required
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="space-y-2 mb-3">
                {requirements.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-xl px-3 py-2.5" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
                    <GripVertical size={14} stroke="#CBD5E1" strokeWidth={2} style={{ cursor: 'grab', flexShrink: 0 }} />
                    <CircleCheckBig size={14} stroke="#059669" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span className="flex-1 cursor-text text-sm sm:text-[13px]" style={{ color: 'rgb(15, 23, 42)' }}>{item.text}</span>
                    <button
                      onClick={() => removeRequirement(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                      style={{ background: 'rgb(254, 242, 242)', cursor: 'pointer', border: 'none' }}
                    >
                      <Trash2 size={12} stroke="#DC2626" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  placeholder="Add a requirement and press Enter…"
                  className="flex-1 rounded-xl px-3.5 py-2.5"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  style={{
                    border: '1px dashed rgba(5, 150, 105, 0.376)',
                    background: 'rgba(5, 150, 105, 0.03)',
                    fontSize: '13px',
                    color: 'rgb(15, 23, 42)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addRequirement}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl"
                  style={{ background: 'rgb(5, 150, 105)', color: 'rgb(255, 255, 255)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
                >
                  <Plus size={13} stroke="currentColor" strokeWidth={2} />
                  Add
                </button>
              </div>
              {requirements.length === 0 && validationErrors.some(e => e.includes('Requirement')) && (
                <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '8px' }}>At least one requirement is required for publishing</p>
              )}
            </div>
          </div>

          {/* Benefits & Perks */}
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Benefits & Perks
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update what Ru-max offers successful candidates
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="space-y-2 mb-3">
                {benefits.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 group rounded-xl px-3 py-2.5" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
                    <GripVertical size={14} stroke="#CBD5E1" strokeWidth={2} style={{ cursor: 'grab', flexShrink: 0 }} />
                    <CircleCheckBig size={14} stroke="#D97706" strokeWidth={2} style={{ flexShrink: 0 }} />
                    <span className="flex-1 cursor-text text-sm sm:text-[13px]" style={{ color: 'rgb(15, 23, 42)' }}>{item.text}</span>
                    <button
                      onClick={() => removeBenefit(item.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
                      style={{ background: 'rgb(254, 242, 242)', cursor: 'pointer', border: 'none' }}
                    >
                      <Trash2 size={12} stroke="#DC2626" strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  placeholder="Add a benefit and press Enter…"
                  className="flex-1 rounded-xl px-3.5 py-2.5"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                  style={{
                    border: '1px dashed rgba(217, 119, 6, 0.376)',
                    background: 'rgba(217, 119, 6, 0.03)',
                    fontSize: '13px',
                    color: 'rgb(15, 23, 42)',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={addBenefit}
                  className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl"
                  style={{ background: 'rgb(217, 119, 6)', color: 'rgb(255, 255, 255)', fontSize: '12px', fontWeight: 600, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
                >
                  <Plus size={13} stroke="currentColor" strokeWidth={2} />
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Application Configuration */}
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Application Configuration
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update screening and required documents
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '6px' }}>
                    Auto Shortlisting Score
                  </label>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: 'rgb(15, 76, 129)' }}>{autoShortlistScore}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  className="w-full"
                  value={autoShortlistScore}
                  onChange={(e) => setAutoShortlistScore(Number(e.target.value))}
                  style={{ accentColor: 'rgb(15, 76, 129)', cursor: 'pointer' }}
                />
                <div className="flex justify-between mt-1">
                  <span style={{ fontSize: '10px', color: 'rgb(100, 116, 139)' }}>0%</span>
                  <span style={{ fontSize: '10px', color: 'rgb(100, 116, 139)' }}>100%</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgb(226, 236, 246)', paddingTop: '4px' }}>
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
          <div className="rounded-2xl mb-4 sm:mb-5" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.06) 0px 1px 6px'
          }}>
            <div className="px-4 sm:px-6 py-3 sm:py-4" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '14px sm:15px', fontWeight: 700 }}>
                  Assign Hiring Team <span style={{ color: 'rgb(220, 38, 38)' }}>*</span>
                </h3>
              </div>
              <p style={{ fontSize: '11px sm:12px', color: 'rgb(100, 116, 139)', marginTop: '3px sm:4px', marginLeft: '10px sm:12px' }}>
                Update the team members responsible for this vacancy
              </p>
            </div>
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* Selected Team Members */}
              <div className="mb-4">
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(71, 85, 105)', display: 'block', marginBottom: '8px' }}>
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
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: '24px',
                            height: '24px',
                            background: member.color,
                            color: 'white',
                            fontSize: '9px',
                            fontWeight: 700
                          }}
                        >
                          {member.initials}
                        </div>
                        <div>
                          <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{member.name}</p>
                          <p style={{ fontSize: '9px', color: 'rgb(100, 116, 139)' }}>{member.role}</p>
                        </div>
                        <button
                          onClick={() => removeSelectedTeamMember(member.id)}
                          className="ml-1 p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <X size={14} stroke="#DC2626" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '12px', color: 'rgb(100, 116, 139)' }}>
                    No team members selected
                  </p>
                )}
                {selectedTeamMembers.length === 0 && validationErrors.some(e => e.includes('Team Member')) && (
                  <p style={{ fontSize: '11px', color: 'rgb(220, 38, 38)', marginTop: '4px' }}>At least one team member is required for publishing</p>
                )}
              </div>

              {/* Available Team Members Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowTeamMemberDropdown(!showTeamMemberDropdown)}
                  className="w-full flex items-center justify-between rounded-xl px-3.5 py-2.5"
                  style={{
                    border: '1px dashed rgb(15, 76, 129)',
                    background: 'rgba(15, 76, 129, 0.03)',
                    cursor: 'pointer'
                  }}
                  disabled={loadingTeamMembers}
                >
                  <span style={{ fontSize: '13px', color: 'rgb(100, 116, 139)' }}>
                    <UserPlus size={16} stroke="#0F4C81" style={{ display: 'inline', marginRight: '8px' }} />
                    {loadingTeamMembers ? 'Loading team members...' : 'Add team member'}
                  </span>
                  <ChevronDown size={14} stroke="#64748b" strokeWidth={2} />
                </button>

                {showTeamMemberDropdown && !loadingTeamMembers && (
                  <div
                    className="absolute z-10 w-full mt-1 rounded-xl overflow-hidden"
                    style={{
                      background: 'white',
                      border: '1px solid rgb(226, 236, 246)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {availableTeamMembers.length > 0 ? (
                      availableTeamMembers.map((member) => (
                        <button
                          key={member.id}
                          onClick={() => toggleTeamMember(member)}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            textAlign: 'left'
                          }}
                        >
                          <div
                            className="flex items-center justify-center rounded-full"
                            style={{
                              width: '28px',
                              height: '28px',
                              background: member.color,
                              color: 'white',
                              fontSize: '10px',
                              fontWeight: 700
                            }}
                          >
                            {member.initials}
                          </div>
                          <div className="flex-1">
                            <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{member.name}</p>
                            <p style={{ fontSize: '10px', color: 'rgb(100, 116, 139)' }}>{member.role}</p>
                          </div>
                          <UserPlus size={14} stroke="#0F4C81" />
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-center">
                        <p style={{ fontSize: '13px', color: 'rgb(100, 116, 139)' }}>
                          <UserCheck size={16} stroke="#059669" style={{ display: 'inline', marginRight: '8px' }} />
                          {availableTeamMembers.length === 0 && selectedTeamMembers.length > 0
                            ? 'All team members selected'
                            : 'No team members available'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Refresh Team Members Button */}
              <button
                onClick={fetchTeamMembers}
                className="mt-3 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <RefreshCw size={14} className={loadingTeamMembers ? 'animate-spin' : ''} />
                Refresh team members
              </button>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-4 px-1 mb-2">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl"
                style={{
                  border: '1px solid rgb(226, 236, 246)',
                  background: saving ? 'rgb(226, 236, 246)' : 'rgb(248, 250, 252)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'rgb(71, 85, 105)',
                  cursor: saving ? 'not-allowed' : 'pointer'
                }}
              >
                <Save size={14} stroke="currentColor" strokeWidth={2} className="inline mr-1.5" />
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                className="flex-1 sm:flex-none items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl"
                style={{ border: '1px solid rgb(226, 236, 246)', background: 'rgb(254, 242, 242)', fontSize: '13px', fontWeight: 600, color: 'rgb(220, 38, 38)', cursor: 'pointer' }}
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
              onClick={handleUpdate}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl"
              style={{
                background: saving ? 'rgb(100, 116, 139)' : 'rgb(15, 76, 129)',
                color: 'rgb(255, 255, 255)',
                fontSize: '13px',
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                border: 'none'
              }}
            >
              <Send size={14} stroke="currentColor" strokeWidth={2} />
              {saving ? 'Updating...' : 'Update Vacancy'}
            </button>
          </div>
        </div>

        {/* Sidebar Preview - Hidden on mobile, shown on lg screens */}
        <div className="hidden lg:block" style={{ width: '280px', flexShrink: 0 }}>
          <div className="rounded-2xl overflow-hidden" style={{
            background: 'rgb(255, 255, 255)',
            border: '1px solid rgb(226, 236, 246)',
            boxShadow: 'rgba(15, 76, 129, 0.1) 0px 4px 20px',
            position: 'sticky',
            top: '16px'
          }}>
            <div className="px-5 py-4" style={{ background: 'rgb(15, 76, 129)' }}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-4 rounded-full" style={{ background: 'rgba(255, 255, 255, 0.6)' }} />
                <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255, 255, 255, 0.7)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Live Preview
                </p>
              </div>
              <h3 style={{ color: 'rgb(255, 255, 255)', fontSize: '16px', fontWeight: 800, margin: 0 }}>
                {jobTitle || 'Job Title'}
              </h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {availability && (
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: '9px', fontWeight: 600, background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    {availability}
                  </span>
                )}
                {contractType && (
                  <span className="rounded-full px-2 py-0.5" style={{ fontSize: '9px', fontWeight: 600, background: 'rgba(255,255,255,0.2)', color: 'white' }}>
                    {contractType}
                  </span>
                )}
              </div>
            </div>
            <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 320px)' }}>
              {/* Team members preview */}
              {selectedTeamMembers.length > 0 && (
                <div className="mb-4">
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(15, 76, 129)', marginBottom: '6px' }}>
                    Hiring Team
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {selectedTeamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-1 rounded-full px-2 py-0.5"
                        style={{ background: `${member.color}20`, border: `1px solid ${member.color}` }}
                      >
                        <span style={{ fontSize: '8px', fontWeight: 700, color: member.color }}>{member.initials}</span>
                        <span style={{ fontSize: '9px', color: 'rgb(15, 23, 42)' }}>{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {responsibilities.length > 0 && (
                <div className="mb-4">
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(15, 76, 129)', marginBottom: '6px' }}>
                    Responsibilities
                  </p>
                  {responsibilities.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1">
                      <CircleCheckBig size={10} stroke="#27B3C9" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: '11px', color: 'rgb(71, 85, 105)' }}>{item.text}</span>
                    </div>
                  ))}
                  {responsibilities.length > 3 && (
                    <p style={{ fontSize: '10px', color: 'rgb(100, 116, 139)' }}>+{responsibilities.length - 3} more</p>
                  )}
                </div>
              )}

              {requirements.length > 0 && (
                <div className="mb-4">
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(15, 76, 129)', marginBottom: '6px' }}>
                    Requirements
                  </p>
                  {requirements.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1">
                      <CircleCheckBig size={10} stroke="#059669" strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: '11px', color: 'rgb(71, 85, 105)' }}>{item.text}</span>
                    </div>
                  ))}
                  {requirements.length > 3 && (
                    <p style={{ fontSize: '10px', color: 'rgb(100, 116, 139)' }}>+{requirements.length - 3} more</p>
                  )}
                </div>
              )}

              {benefits.length > 0 && (
                <div className="mb-4">
                  <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(15, 76, 129)', marginBottom: '6px' }}>
                    Benefits
                  </p>
                  {benefits.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-2 mb-1">
                      <span style={{ fontSize: '9px', color: 'rgb(217, 119, 6)' }}>★</span>
                      <span style={{ fontSize: '11px', color: 'rgb(71, 85, 105)' }}>{item.text}</span>
                    </div>
                  ))}
                  {benefits.length > 3 && (
                    <p style={{ fontSize: '10px', color: 'rgb(100, 116, 139)' }}>+{benefits.length - 3} more</p>
                  )}
                </div>
              )}

              <button
                className="w-full py-2.5 rounded-xl"
                style={{ background: 'rgb(15, 76, 129)', color: 'rgb(255, 255, 255)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: 'none' }}
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJob;