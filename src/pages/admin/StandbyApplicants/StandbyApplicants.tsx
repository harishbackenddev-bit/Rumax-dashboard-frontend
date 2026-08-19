// pages/admin/StandbyApplicants.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Funnel,
  Users,
  UserCheck,
  Zap,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  CircleCheckBig,
  EllipsisVertical,
  Loader2,
  AlertCircle,
  FileText as FileIcon
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ============================================
// TYPES - MATCHING API RESPONSE
// ============================================
interface Experience {
  id: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
  _id?: string;
}

interface StandbyApplicant {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  location: string;
  status: string;
  standbyStatus: string;
  initials: string;
  color: string;
  certifications?: string[];
  skills?: string[];
  availability: string;
  experience: Experience[] | string | number;
  appliedDate: string;
  createdAt: string;
  updatedAt: string;
  resumeUrl?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: StandbyApplicant[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const StandbyApplicants = () => {
  // ============================================
  // STATE
  // ============================================
  const [applicants, setApplicants] = useState<StandbyApplicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Status');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  });

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // ============================================
  // FETCH APPLICANTS
  // ============================================
  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to view applicants');
        return;
      }

      const params = new URLSearchParams();
      params.append('page', pagination.page.toString());
      params.append('limit', pagination.limit.toString());
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      if (activeRoleFilter !== 'All') {
        params.append('role', activeRoleFilter);
      }
      // Fix: Use 'status' parameter instead of 'standbyStatus'
      if (activeStatusFilter !== 'All Status') {
        params.append('status', activeStatusFilter);
      }

      const response = await axios.get(
        `${API_URL}/api/admin/candidates/standby?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setApplicants(response.data.data);
        if (response.data.pagination) {
          setPagination({
            page: response.data.pagination.page,
            limit: response.data.pagination.limit,
            total: response.data.pagination.total,
            totalPages: response.data.pagination.totalPages
          });
        }
      } else {
        setError(response.data.message || 'Failed to fetch applicants');
      }
    } catch (error: any) {
      console.error('Error fetching applicants:', error);
      setError(error.response?.data?.message || 'Failed to fetch applicants');
      toast.error('Failed to load standby applicants');
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UPDATE STANDBY STATUS
  // ============================================
  const updateStandbyStatus = async (candidateId: string, newStatus: string) => {
    try {
      setUpdatingStatus(candidateId);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login');
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/admin/candidate/${candidateId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        setOpenDropdownId(null);
        fetchApplicants();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ============================================
  // EFFECTS
  // ============================================
  useEffect(() => {
    fetchApplicants();
  }, [pagination.page, searchQuery, activeRoleFilter, activeStatusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ============================================
  // COMPUTED STATS
  // ============================================
  const stats = {
    total: applicants.length,
    available: applicants.filter(a => a.status === 'Available' || a.status === 'Standby').length,
    deployed: applicants.filter(a => a.status === 'Deployed').length,
    unavailable: applicants.filter(a => a.status === 'Unavailable').length,
    researchNurses: applicants.filter(a => a.role?.toLowerCase().includes('research')).length
  };

  // ============================================
  // FILTERS
  // ============================================
  const getUniqueRoles = () => {
    const roles = applicants.map(a => a.role).filter(Boolean);
    return ['All', ...new Set(roles)];
  };

  const roleFilters = getUniqueRoles();
  const statusFilters = ['All Status', 'Available', 'Deployed', 'Unavailable'];

  // ============================================
  // HELPERS
  // ============================================
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; dot: string }> = {
      'Available': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Standby': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Deployed': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'Unavailable': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' }
    };
    return styles[status] || styles['Available'];
  };

  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return '??';
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '??';
  };

  const getColor = (name: string) => {
    const colors = ['#0F4C81', '#27B3C9', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB', '#0891B2', '#601B80', '#B45309'];
    if (!name) return colors[0];
    const index = (name.length || 0) % colors.length;
    return colors[index];
  };

  const formatExperience = (exp: any): string => {
    if (!exp) return 'N/A';
    if (typeof exp === 'string') return exp;
    if (typeof exp === 'number') return `${exp} yrs`;
    if (Array.isArray(exp)) {
      if (exp.length === 0) return 'N/A';
      let totalYears = 0;
      exp.forEach((item: any) => {
        if (item.startDate) {
          const start = new Date(item.startDate);
          const end = item.current ? new Date() : (item.endDate ? new Date(item.endDate) : new Date());
          const years = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
          if (years > 0) totalYears += years;
        }
      });
      if (totalYears === 0) {
        return `${exp.length} role${exp.length > 1 ? 's' : ''}`;
      }
      return `${Math.round(totalYears)} yrs`;
    }
    return 'N/A';
  };

  const getCertifications = (applicant: StandbyApplicant): string[] => {
    if (applicant.certifications && applicant.certifications.length > 0) {
      return applicant.certifications;
    }
    if (Array.isArray(applicant.experience)) {
      const certs: string[] = [];
      applicant.experience.forEach((exp: any) => {
        if (exp.certifications) {
          certs.push(...exp.certifications);
        }
      });
      return certs.length > 0 ? certs : ['GCP Certified'];
    }
    return ['GCP Certified'];
  };

  const getSkills = (applicant: StandbyApplicant): string[] => {
    if (applicant.skills && applicant.skills.length > 0) {
      return applicant.skills;
    }
    if (Array.isArray(applicant.experience)) {
      const skills: string[] = [];
      applicant.experience.forEach((exp: any) => {
        if (exp.skills) {
          skills.push(...exp.skills);
        }
        if (exp.position) {
          skills.push(exp.position);
        }
        if (exp.responsibilities) {
          const respWords = exp.responsibilities.split(',').map((s: string) => s.trim());
          respWords.forEach((word: string) => {
            if (word.length > 2 && !skills.includes(word)) {
              skills.push(word);
            }
          });
        }
      });
      return skills.length > 0 ? skills : ['Phlebotomy', 'Clinical Trials'];
    }
    return ['Phlebotomy', 'Clinical Trials'];
  };

  // ============================================
  // DROPDOWN MENU COMPONENT
  // ============================================
  const DropdownMenu = ({ applicant }: { applicant: StandbyApplicant }) => {
    const isOpen = openDropdownId === applicant._id;
    const currentStatus = applicant.status || applicant.standbyStatus || 'Standby';

    const menuItems = [
      {
        label: 'View Resume',
        icon: <FileIcon size={14} stroke="#601B80" strokeWidth={2} />,
        onClick: () => {
          if (applicant.resumeUrl) {
            window.open(`${API_URL}${applicant.resumeUrl}`, '_blank');
          } else {
            // toast.info('No resume uploaded');
          }
          setOpenDropdownId(null);
        }
      },
      { divider: true },
      {
        label: 'Mark as Deployed',
        icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgb(37, 99, 235)', display: 'inline-block', flexShrink: 0 }} />,
        onClick: () => updateStandbyStatus(applicant._id, 'Deployed'),
        color: 'rgb(37, 99, 235)',
        disabled: currentStatus === 'Deployed'
      },
      {
        label: 'Mark as Unavailable',
        icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgb(107, 114, 128)', display: 'inline-block', flexShrink: 0 }} />,
        onClick: () => updateStandbyStatus(applicant._id, 'Unavailable'),
        color: 'rgb(107, 114, 128)',
        disabled: currentStatus === 'Unavailable'
      },
      {
        label: 'Mark as Available',
        icon: <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgb(22, 163, 74)', display: 'inline-block', flexShrink: 0 }} />,
        onClick: () => updateStandbyStatus(applicant._id, 'Available'),
        color: 'rgb(22, 163, 74)',
        disabled: currentStatus === 'Available' || currentStatus === 'Standby'
      }
    ];

    return (
      <div style={{ position: 'relative' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdownId(isOpen ? null : applicant._id);
          }}
          style={{
            background: 'rgb(244, 246, 252)',
            border: 'none',
            borderRadius: '8px',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgb(228, 233, 244)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgb(244, 246, 252)';
          }}
        >
          {updatingStatus === applicant._id ? (
            <Loader2 size={15} className="animate-spin" stroke="#7B8299" strokeWidth={2} />
          ) : (
            <EllipsisVertical size={15} stroke="#7B8299" strokeWidth={2} />
          )}
        </button>

        {isOpen && !updatingStatus && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '34px',
              right: '0px',
              zIndex: 50,
              background: 'rgb(255, 255, 255)',
              border: '1px solid rgb(228, 233, 244)',
              borderRadius: '10px',
              minWidth: '185px',
              boxShadow: 'rgba(0, 0, 0, 0.12) 0px 8px 24px',
              overflow: 'hidden'
            }}
          >
            {menuItems.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    style={{
                      borderTop: '1px solid rgb(238, 241, 251)',
                      margin: '2px 0px'
                    }}
                  />
                );
              }

              return (
                <button
                  key={item.label}
                  onClick={item.onClick}
                  disabled={item.disabled}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '9px',
                    width: '100%',
                    padding: '9px 14px',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: item.disabled ? 'rgb(160, 170, 191)' : (item.color || 'rgb(55, 65, 81)'),
                    background: 'none',
                    border: 'none',
                    cursor: item.disabled ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                    opacity: item.disabled ? 0.5 : 1,
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={(e) => {
                    if (!item.disabled) {
                      e.currentTarget.style.background = 'rgb(248, 249, 254)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {item.icon}
                  {item.label}
                  {item.disabled && (
                    <span style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', marginLeft: 'auto' }}>
                      ✓ Current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (loading && applicants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="animate-spin" style={{ color: 'rgb(96, 27, 128)' }} />
        <p style={{ color: 'rgb(123, 130, 153)', marginTop: '16px' }}>Loading standby applicants...</p>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle size={40} style={{ color: 'rgb(220, 38, 38)' }} />
        <p style={{ color: 'rgb(220, 38, 38)', marginTop: '16px' }}>{error}</p>
        <button 
          onClick={fetchApplicants}
          style={{ marginTop: '12px', padding: '10px 24px', background: 'rgb(96, 27, 128)', color: 'rgb(255, 255, 255)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // ============================================
  // MAIN RENDER
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 style={{ color: 'rgb(13, 17, 23)', marginBottom: '2px', fontSize: '22px', fontWeight: 700 }} className="sm:text-[24px]">
            Standby Applicants
          </h1>
          <p style={{ fontSize: '13px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
            {stats.available} ready now · {stats.deployed} deployed
          </p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full sm:w-auto">
          <div 
            className="flex items-center gap-2 px-3.5 rounded-xl w-full sm:w-[230px]"
            style={{ background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', height: '40px' }}
          >
            <Search size={13} stroke="#A0AABF" strokeWidth={2.2} />
            <input 
              placeholder="Search by name or role…" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: '1 1 0%', border: 'none', outline: 'none', background: 'transparent', fontSize: '13px', color: 'rgb(55, 65, 81)', fontFamily: 'Manrope, sans-serif', minWidth: 0 }}
            />
          </div>
          <div className="flex items-center gap-2.5">
            <button 
              className="flex items-center gap-2 px-4 rounded-xl flex-1 sm:flex-initial justify-center"
              style={{ height: '40px', background: 'rgb(255, 255, 255)', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(123, 130, 153)', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              <Funnel size={13} stroke="currentColor" strokeWidth={2} />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 sm:gap-4 mb-6 grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: '40px', height: '40px', background: 'rgb(238, 241, 251)' }}>
            <Users size={18} stroke="#601B80" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'rgb(96, 27, 128)', lineHeight: 1 }} className="sm:text-[22px]">{stats.total}</p>
            <p style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }} className="sm:text-[12px] truncate">Total Standby</p>
          </div>
        </div>
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: '40px', height: '40px', background: 'rgb(240, 253, 244)' }}>
            <UserCheck size={18} stroke="#16A34A" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'rgb(22, 163, 74)', lineHeight: 1 }} className="sm:text-[22px]">{stats.available}</p>
            <p style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }} className="sm:text-[12px] truncate">On Standby</p>
          </div>
        </div>
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: '40px', height: '40px', background: 'rgb(239, 246, 255)' }}>
            <Zap size={18} stroke="#2563EB" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'rgb(37, 99, 235)', lineHeight: 1 }} className="sm:text-[22px]">{stats.deployed}</p>
            <p style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }} className="sm:text-[12px] truncate">Deployed</p>
          </div>
        </div>
        <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)' }}>
          <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: '40px', height: '40px', background: 'rgb(245, 243, 255)' }}>
            <Stethoscope size={18} stroke="#7C3AED" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p style={{ fontSize: '20px', fontWeight: 800, color: 'rgb(124, 58, 237)', lineHeight: 1 }} className="sm:text-[22px]">{stats.researchNurses}</p>
            <p style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }} className="sm:text-[12px] truncate">Research Nurses</p>
          </div>
        </div>
      </div>

      {/* Role and Status Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-5 gap-3">
        {/* Role filter tabs - keep "All" only */}
<div
  className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto"
  style={{
    background: 'rgb(255, 255, 255)',
    border: '1px solid rgb(228, 233, 244)',
    WebkitOverflowScrolling: 'touch'
  }}
>
  <button
    onClick={() => setActiveRoleFilter('All')}
    className="flex items-center gap-2 px-4 py-2 rounded-lg shrink-0"
    style={{
      fontSize: '12.5px',
      fontWeight: 700,
      background: 'rgb(96, 27, 128)',
      color: 'rgb(255, 255, 255)',
      cursor: 'pointer',
      border: 'none',
      transition: '0.15s',
      whiteSpace: 'nowrap'
    }}
  >
    All

    <span
      className="rounded-full px-1.5"
      style={{
        fontSize: '10px',
        fontWeight: 800,
        background: 'rgba(255, 255, 255, 0.2)',
        color: 'rgb(255, 255, 255)',
        minWidth: '18px',
        textAlign: 'center'
      }}
    >
      {applicants.length}
    </span>
  </button>
</div>
        
        {/* Status filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusFilters.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatusFilter(status)}
              className="px-3.5 py-2 rounded-xl shrink-0"
              style={{ 
                fontSize: '12px', 
                fontWeight: activeStatusFilter === status ? 700 : 500,
                background: activeStatusFilter === status ? 'rgb(96, 27, 128)' : 'rgb(255, 255, 255)',
                color: activeStatusFilter === status ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
                cursor: 'pointer',
                border: activeStatusFilter === status ? '1.5px solid rgb(96, 27, 128)' : '1.5px solid rgb(228, 233, 244)',
                transition: '0.15s',
                whiteSpace: 'nowrap'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants Grid */}
      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))' }}>
        {applicants.length === 0 ? (
          <div className="col-span-full text-center py-12">
           
            <p style={{ color: 'rgb(123, 130, 153)', marginTop: '12px', fontSize: '16px', fontWeight: 600 }}>No applicants found</p>
            <p style={{ color: 'rgb(160, 170, 191)', fontSize: '13px' }}>Try adjusting your filters or search query</p>
          </div>
        ) : (
          applicants.map((applicant) => {
            const displayStatus = applicant.status || applicant.standbyStatus || 'Standby';
            const statusStyle = getStatusStyle(displayStatus);
            const color = applicant.color || getColor(applicant.fullName);
            const initials = applicant.initials || getInitials(applicant.firstName, applicant.lastName);
            const certifications = getCertifications(applicant);
            const skills = getSkills(applicant);
            const experienceDisplay = formatExperience(applicant.experience);
            
            return (
              <div 
                key={applicant._id} 
                className="rounded-2xl flex flex-col"
                style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', overflow: 'hidden', transition: 'transform 0.15s' }}
              >
                <div style={{ height: '4px', background: color }} />
                <div className="p-4 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div 
                      className="flex items-center justify-center rounded-2xl shrink-0"
                      style={{ width: '48px', height: '48px', background: color, color: 'rgb(255, 255, 255)', fontSize: '15px', fontWeight: 800 }}
                    >
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '14px', fontWeight: 800, color: 'rgb(13, 17, 23)', lineHeight: 1.2 }} className="truncate">{applicant.fullName}</p>
                      <p style={{ fontSize: '11.5px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '1px' }} className="truncate">{applicant.role || 'N/A'}</p>
                      <div className="flex items-center gap-1 mt-1" style={{ fontSize: '11px', color: 'rgb(160, 170, 191)' }}>
                        <MapPin size={9} stroke="currentColor" strokeWidth={2} />
                        {applicant.location || 'N/A'}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <DropdownMenu applicant={applicant} />
                      <span 
                        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                        style={{ fontSize: '10px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, whiteSpace: 'nowrap' }}
                      >
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
                        {displayStatus}
                      </span>
                    </div>
                  </div>

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {certifications.slice(0, 3).map((cert, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                          style={{ fontSize: '10px', fontWeight: 700, background: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', border: '1px solid rgb(187, 247, 208)' }}
                        >
                          <CircleCheckBig size={9} stroke="currentColor" strokeWidth={2} />
                          {cert}
                        </span>
                      ))}
                      {certifications.length > 3 && (
                        <span 
                          className="inline-flex items-center rounded-full px-2 py-0.5"
                          style={{ fontSize: '10px', fontWeight: 700, background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)' }}
                        >
                          +{certifications.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="mb-3">
                      <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgb(160, 170, 191)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px' }}>
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 4).map((skill, index) => (
                          <span 
                            key={index}
                            className="rounded-full px-2.5 py-0.5"
                            style={{ fontSize: '11px', fontWeight: 600, background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)' }}
                          >
                            {skill}
                          </span>
                        ))}
                        {skills.length > 4 && (
                          <span 
                            className="rounded-full px-2.5 py-0.5"
                            style={{ fontSize: '11px', fontWeight: 600, background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)' }}
                          >
                            +{skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Availability & Experience */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 rounded-xl p-2 text-center" style={{ background: 'rgb(248, 249, 254)', border: '1px solid rgb(228, 233, 244)' }}>
                      <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Available</p>
                      <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgb(13, 17, 23)' }}>{applicant.availability || 'Immediate'}</p>
                    </div>
                    <div className="flex-1 rounded-xl p-2 text-center" style={{ background: 'rgb(248, 249, 254)', border: '1px solid rgb(228, 233, 244)' }}>
                      <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Experience</p>
                      <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgb(13, 17, 23)' }}>{experienceDisplay}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-auto">
                    <a 
                      href={`tel:${applicant.phone}`} 
                      className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl"
                      style={{ background: 'rgb(96, 27, 128)', color: 'rgb(255, 255, 255)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: 'none', textDecoration: 'none' }}
                    >
                      <Phone size={13} stroke="currentColor" strokeWidth={2} />
                      Call
                    </a>
                    <a 
                      href={`mailto:${applicant.email}`} 
                      className="flex items-center justify-center gap-2 flex-1 py-2.5 rounded-xl"
                      style={{ background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgb(199, 210, 246)', textDecoration: 'none' }}
                    >
                      <Mail size={13} stroke="currentColor" strokeWidth={2} />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-6 pt-4" style={{ borderTop: '1px solid rgb(228, 233, 244)' }}>
          <p style={{ fontSize: '13px', color: 'rgb(123, 130, 153)' }}>
            Showing {applicants.length} of {pagination.total} applicants
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgb(228, 233, 244)', background: 'rgb(255, 255, 255)', cursor: pagination.page === 1 ? 'not-allowed' : 'pointer', opacity: pagination.page === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgb(96, 27, 128)', color: 'rgb(255, 255, 255)', fontWeight: 600 }}>
              {pagination.page}
            </span>
            <button
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.totalPages, prev.page + 1) }))}
              disabled={pagination.page === pagination.totalPages}
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgb(228, 233, 244)', background: 'rgb(255, 255, 255)', cursor: pagination.page === pagination.totalPages ? 'not-allowed' : 'pointer', opacity: pagination.page === pagination.totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StandbyApplicants;