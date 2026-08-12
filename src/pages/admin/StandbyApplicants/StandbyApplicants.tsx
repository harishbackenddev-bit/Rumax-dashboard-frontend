// pages/admin/StandbyApplicants.tsx
import React, { useState } from 'react';
import {
  Search,
  Funnel,
  Plus,
  Users,
  UserCheck,
  Zap,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  CircleCheckBig,
  EllipsisVertical,
  X,
  Upload,
  FileText,
  CircleCheck,
  Clock,
  Briefcase
} from 'lucide-react';

interface StandbyApplicant {
  id: string;
  name: string;
  role: string;
  location: string;
  status: 'Available' | 'Deployed' | 'Unavailable';
  initials: string;
  color: string;
  certifications: string[];
  skills: string[];
  availability: string;
  experience: string;
  phone: string;
  email: string;
}

const StandbyApplicants = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRoleFilter, setActiveRoleFilter] = useState('All');
  const [activeStatusFilter, setActiveStatusFilter] = useState('All Status');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<StandbyApplicant | null>(null);

  // Mock data
  const [applicants] = useState<StandbyApplicant[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Research Nurse',
      location: 'London',
      status: 'Available',
      initials: 'SC',
      color: 'rgb(96, 27, 128)',
      certifications: ['GCP Certified', 'NMC'],
      skills: ['Phlebotomy', 'Cardiology'],
      availability: 'Immediate',
      experience: '5 yrs',
      phone: '+44 7700 900301',
      email: 'sarah.chen@email.com'
    },
    {
      id: '2',
      name: 'Marcus Cham',
      role: 'Research Nurse',
      location: 'Manchester',
      status: 'Available',
      initials: 'MC',
      color: 'rgb(124, 58, 237)',
      certifications: ['GCP Certified', 'NMC'],
      skills: ['Oncology', 'Clinical Trials'],
      availability: '2 hrs',
      experience: '7 yrs',
      phone: '+44 7700 900302',
      email: 'marcus.cham@email.com'
    },
    {
      id: '3',
      name: 'Brania Cole',
      role: 'Research Nurse',
      location: 'Birmingham',
      status: 'Available',
      initials: 'BC',
      color: 'rgb(5, 150, 105)',
      certifications: ['GCP Certified'],
      skills: ['Phlebotomy', 'Cardiology'],
      availability: 'Immediate',
      experience: '4 yrs',
      phone: '+44 7700 900303',
      email: 'brania.cole@email.com'
    },
    {
      id: '4',
      name: 'Sarah Chen',
      role: 'Research Nurse',
      location: 'Bristol',
      status: 'Available',
      initials: 'SC',
      color: 'rgb(217, 119, 6)',
      certifications: ['GCP Certified', 'NMC'],
      skills: ['Phlebotomy', 'Neurology'],
      availability: 'Immediate',
      experience: '3 yrs',
      phone: '+44 7700 900305',
      email: 'sarah.chen2@email.com'
    },
    {
      id: '5',
      name: 'Bernis Smith',
      role: 'Carers',
      location: 'London',
      status: 'Available',
      initials: 'BS',
      color: 'rgb(8, 145, 178)',
      certifications: ['Care Certificate', 'First Aid'],
      skills: ['Dementia Care', 'Mobility'],
      availability: '1 hr',
      experience: '8 yrs',
      phone: '+44 7700 900306',
      email: 'bernis.smith@email.com'
    },
    {
      id: '6',
      name: 'Marcus Chen',
      role: 'Research Nurse',
      location: 'Edinburgh',
      status: 'Available',
      initials: 'MC',
      color: 'rgb(220, 38, 38)',
      certifications: ['GCP Certified', 'NMC'],
      skills: ['Cardiology', 'ICU'],
      availability: 'Immediate',
      experience: '9 yrs',
      phone: '+44 7700 900307',
      email: 'marcus.chen@email.com'
    },
    {
      id: '7',
      name: 'Danita Nurser',
      role: 'Carers',
      location: 'London',
      status: 'Available',
      initials: 'DN',
      color: 'rgb(22, 163, 74)',
      certifications: ['Care Certificate'],
      skills: ['Palliative Care', 'Elderly'],
      availability: '2 hrs',
      experience: '5 yrs',
      phone: '+44 7700 900308',
      email: 'danita.n@email.com'
    },
    {
      id: '8',
      name: 'Priya Nair',
      role: 'Carers',
      location: 'Birmingham',
      status: 'Available',
      initials: 'PN',
      color: 'rgb(15, 76, 129)',
      certifications: ['Care Certificate', 'NVQ L2'],
      skills: ['Dementia Care', 'Medication'],
      availability: 'Immediate',
      experience: '6 yrs',
      phone: '+44 7700 900311',
      email: 'priya.nair@email.com'
    },
    {
      id: '9',
      name: 'Lewis Grant',
      role: 'Support Worker',
      location: 'Bristol',
      status: 'Available',
      initials: 'LG',
      color: 'rgb(27, 34, 128)',
      certifications: ['Care Certificate'],
      skills: ['Autism', 'Behaviour Support'],
      availability: '3 hrs',
      experience: '2 yrs',
      phone: '+44 7700 900312',
      email: 'lewis.grant@email.com'
    }
  ]);

  const roleFilters = ['All', 'Research Nurse', 'Carers', 'Support Worker'];
  const statusFilters = ['All Status', 'On Standby', 'Deployed', 'Unavailable'];

  const getStatusStyle = (status: string) => {
    const styles = {
      'Available': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Deployed': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'Unavailable': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' }
    };
    return styles[status as keyof typeof styles] || styles['Available'];
  };

  // Stats
  const stats = {
    total: applicants.length,
    available: applicants.filter(a => a.status === 'Available').length,
    deployed: applicants.filter(a => a.status === 'Deployed').length,
    researchNurses: applicants.filter(a => a.role === 'Research Nurse').length
  };

  // Filter applicants
  const filteredApplicants = applicants.filter(applicant => {
    const matchesSearch = applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          applicant.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = activeRoleFilter === 'All' || applicant.role === activeRoleFilter;
    const matchesStatus = activeStatusFilter === 'All Status' || 
                          (activeStatusFilter === 'On Standby' && applicant.status === 'Available') ||
                          applicant.status === activeStatusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Add Member Modal
  const AddMemberModal = () => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      location: '',
      skills: '',
      experience: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Handle form submission
      console.log('Adding member:', formData);
      setShowAddModal(false);
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center z-[80] p-4" style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(4px)' }}>
        <div className="flex flex-col rounded-2xl overflow-hidden w-full" style={{ maxWidth: '520px', maxHeight: '90vh', background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)' }}>
          <div className="flex items-center justify-between px-5 sm:px-6 py-5 shrink-0" style={{ borderBottom: '1px solid rgb(238, 241, 251)', background: 'rgb(96, 27, 128)' }}>
            <div>
              <p style={{ fontSize: '16px', fontWeight: 800, color: 'rgb(255, 255, 255)' }}>Add Standby Applicant</p>
              <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.65)', fontWeight: 400, marginTop: '2px' }}>Fill in the details to add a new member</p>
            </div>
            <button 
              onClick={() => setShowAddModal(false)}
              style={{ background: 'rgba(255, 255, 255, 0.15)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
            >
              <X size={15} stroke="#fff" strokeWidth={2} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="overflow-y-auto px-5 sm:px-6 py-5 space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Full Name *
                </label>
                <input 
                  placeholder="e.g. Sarah Chen" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif', background: 'rgb(250, 251, 254)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Email *
                </label>
                <input 
                  type="email" 
                  placeholder="email@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif', background: 'rgb(250, 251, 254)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Phone *
                </label>
                <input 
                  placeholder="+44 7700 900000" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif', background: 'rgb(250, 251, 254)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Location *
                </label>
                <input 
                  placeholder="e.g. London" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif', background: 'rgb(250, 251, 254)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Skills * <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: '0px' }}>(comma separated)</span>
                </label>
                <input 
                  placeholder="Phlebotomy, Cardiology" 
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif', background: 'rgb(250, 251, 254)' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Experience *
                </label>
                <input 
                  placeholder="e.g. 5 yrs" 
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif', background: 'rgb(250, 251, 254)' }}
                  required
                />
              </div>
            </div>

            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
                Documents
              </p>
              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <input type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} />
                  <div className="flex flex-col items-center gap-2 rounded-xl py-4" style={{ border: '1.5px dashed rgb(228, 233, 244)', background: 'rgb(250, 251, 254)', transition: '0.15s' }}>
                    <Upload size={18} stroke="#A0AABF" strokeWidth={2} />
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(123, 130, 153)' }}>OCP Certificate</p>
                    <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)' }}>PDF, JPG or PNG</p>
                  </div>
                </label>
                <label style={{ display: 'block', cursor: 'pointer' }}>
                  <input type="file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} />
                  <div className="flex flex-col items-center gap-2 rounded-xl py-4" style={{ border: '1.5px dashed rgb(228, 233, 244)', background: 'rgb(250, 251, 254)', transition: '0.15s' }}>
                    <Upload size={18} stroke="#A0AABF" strokeWidth={2} />
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(123, 130, 153)' }}>NMC Certificate</p>
                    <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)' }}>PDF, JPG or PNG</p>
                  </div>
                </label>
              </div>
              <label style={{ display: 'block', cursor: 'pointer', marginTop: '8px' }}>
                <input type="file" accept=".pdf" style={{ display: 'none' }} />
                <div className="flex items-center gap-3 rounded-xl px-4 py-3" style={{ border: '1.5px dashed rgb(228, 233, 244)', background: 'rgb(250, 251, 254)', transition: '0.15s' }}>
                  <div className="flex items-center justify-center rounded-lg shrink-0" style={{ width: '36px', height: '36px', background: 'rgb(238, 241, 251)' }}>
                    <FileText size={16} stroke="#A0AABF" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '12px', fontWeight: 600, color: 'rgb(123, 130, 153)' }}>Upload CV / Resume</p>
                    <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', marginTop: '1px' }}>PDF only · Max 10MB</p>
                  </div>
                  <Upload size={15} stroke="#A0AABF" strokeWidth={2} />
                </div>
              </label>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                style={{ flex: '1 1 0%', padding: '10px 0px', borderRadius: '8px', border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(255, 255, 255)', fontSize: '13px', fontWeight: 600, color: 'rgb(123, 130, 153)', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex items-center justify-center gap-2"
                style={{ flex: '2 1 0%', padding: '10px 0px', borderRadius: '8px', border: 'none', background: 'rgb(96, 27, 128)', fontSize: '13px', fontWeight: 700, color: 'rgb(255, 255, 255)', cursor: 'pointer' }}
              >
                <Plus size={14} stroke="currentColor" strokeWidth={2} />
                Add Applicant
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

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
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 rounded-xl flex-1 sm:flex-initial justify-center"
              style={{ height: '40px', background: 'rgb(96, 27, 128)', color: 'rgb(255, 255, 255)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap' }}
            >
              <Plus size={14} stroke="currentColor" strokeWidth={2} />
              Add Member
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

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-5 gap-3">
        <div 
          className="flex items-center gap-1 p-1 rounded-xl overflow-x-auto"
          style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', WebkitOverflowScrolling: 'touch' }}
        >
          {roleFilters.map((role) => {
            const isActive = activeRoleFilter === role;
            const count = role === 'All' ? applicants.length : applicants.filter(a => a.role === role).length;
            return (
              <button
                key={role}
                onClick={() => setActiveRoleFilter(role)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg shrink-0"
                style={{ 
                  fontSize: '12.5px', 
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'rgb(96, 27, 128)' : 'transparent',
                  color: isActive ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
                  cursor: 'pointer',
                  border: 'none',
                  transition: '0.15s',
                  whiteSpace: 'nowrap'
                }}
              >
                {role}
                <span 
                  className="rounded-full px-1.5"
                  style={{ 
                    fontSize: '10px', 
                    fontWeight: 800, 
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgb(238, 241, 251)',
                    color: isActive ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
                    minWidth: '18px', 
                    textAlign: 'center' 
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
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
        {filteredApplicants.map((applicant) => {
          const statusStyle = getStatusStyle(applicant.status);
          return (
            <div 
              key={applicant.id} 
              className="rounded-2xl flex flex-col"
              style={{ background: 'rgb(255, 255, 255)', border: '1px solid rgb(228, 233, 244)', overflow: 'hidden', transition: 'transform 0.15s' }}
            >
              <div style={{ height: '4px', background: applicant.color }} />
              <div className="p-4 flex-1 flex flex-col">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="flex items-center justify-center rounded-2xl shrink-0"
                    style={{ width: '48px', height: '48px', background: applicant.color, color: 'rgb(255, 255, 255)', fontSize: '15px', fontWeight: 800 }}
                  >
                    {applicant.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize: '14px', fontWeight: 800, color: 'rgb(13, 17, 23)', lineHeight: 1.2 }} className="truncate">{applicant.name}</p>
                    <p style={{ fontSize: '11.5px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '1px' }} className="truncate">{applicant.role}</p>
                    <div className="flex items-center gap-1 mt-1" style={{ fontSize: '11px', color: 'rgb(160, 170, 191)' }}>
                      <MapPin size={9} stroke="currentColor" strokeWidth={2} />
                      {applicant.location}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button 
                      style={{ background: 'rgb(244, 246, 252)', border: 'none', borderRadius: '8px', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                      <EllipsisVertical size={15} stroke="#7B8299" strokeWidth={2} />
                    </button>
                    <span 
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                      style={{ fontSize: '10px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color, whiteSpace: 'nowrap' }}
                    >
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
                      {applicant.status}
                    </span>
                  </div>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {applicant.certifications.map((cert, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
                      style={{ fontSize: '10px', fontWeight: 700, background: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', border: '1px solid rgb(187, 247, 208)' }}
                    >
                      <CircleCheckBig size={9} stroke="currentColor" strokeWidth={2} />
                      {cert}
                    </span>
                  ))}
                </div>

                {/* Skills */}
                <div className="mb-3">
                  <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgb(160, 170, 191)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '5px' }}>
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {applicant.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="rounded-full px-2.5 py-0.5"
                        style={{ fontSize: '11px', fontWeight: 600, background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)' }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Availability & Experience */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 rounded-xl p-2 text-center" style={{ background: 'rgb(248, 249, 254)', border: '1px solid rgb(228, 233, 244)' }}>
                    <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Available</p>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgb(13, 17, 23)' }}>{applicant.availability}</p>
                  </div>
                  <div className="flex-1 rounded-xl p-2 text-center" style={{ background: 'rgb(248, 249, 254)', border: '1px solid rgb(228, 233, 244)' }}>
                    <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Experience</p>
                    <p style={{ fontSize: '12px', fontWeight: 800, color: 'rgb(13, 17, 23)' }}>{applicant.experience}</p>
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
        })}
      </div>

      {/* Add Member Modal */}
      {showAddModal && <AddMemberModal />}
    </div>
  );
};

export default StandbyApplicants;