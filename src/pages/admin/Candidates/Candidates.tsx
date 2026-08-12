// pages/admin/Candidates.tsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Funnel,
  Download,
  MapPin,
  Calendar,
  ArrowRight,
  UserPlus,
  Mail,
  Phone,
  Eye,
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Pen,
  Trash2
} from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProfileSidebar from '@/components/admin/candidate/ProfileSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Candidate {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  role: string;
  positionAppliedFor?: string;
  location: string;
  preferredLocations?: string[];
  availability: string;
  workPreference?: string;
  appliedDate: string;
  applicationDate?: string;
  score: number;
  status: 'Pending' | 'In Review' | 'Interview Scheduled' | 'Offer Sent' | 'Hired' | 'Rejected' | 'Active';
  initials: string;
  color: string;
  phone?: string;
  nationality?: string;
  rightToWork?: string | boolean;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  country?: string;
  postcode?: string;
  dob?: string;
  dateOfBirth?: string;
  jobId?: string;
  jobTitle?: string;
  createdAt?: string;
  updatedAt?: string;
  resumeUrl?: string;
  coverLetterUrl?: string;
  education?: any[];
  experience?: any[];
  training?: any[];
  registrations?: any[];
  references?: any[];
  dbsValid?: boolean;
  disciplinaryAction?: boolean;
  unspentConvictions?: boolean;
  documents?: string[];
  drivingLicenceUrl?: string;
  dbsCertificateUrl?: string;
  referencesUrl?: string;
  heardFrom?: string;
  supportingStatement?: string;
  scenarioAnswers?: any;
  coreValues?: string[];
  coverLetter?: string;
  additionalNotes?: string;
  availableFrom?: string;
  expectedSalary?: string;
  noticePeriod?: string;
  fullName?: string;
  fullAddress?: string;
}

interface CandidateStats {
  total: number;
  active: number;
  inReview: number;
  interviewScheduled: number;
  offerSent: number;
  hired: number;
  rejected: number;
}

const Candidates = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Candidates');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [exporting, setExporting] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [stats, setStats] = useState<CandidateStats>({
    total: 0,
    active: 0,
    inReview: 0,
    interviewScheduled: 0,
    offerSent: 0,
    hired: 0,
    rejected: 0
  });

  // Helper functions
  const getInitials = (firstName: string, lastName: string): string => {
    if (!firstName && !lastName) return '??';
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '??';
  };

  const getColor = (name: string): string => {
    const colors = ['#0F4C81', '#27B3C9', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB', '#0891B2'];
    if (!name) return colors[0];
    const index = (name.length || 0) % colors.length;
    return colors[index];
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; dot: string }> = {
      'Pending': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'Active': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'In Review': { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)', dot: 'rgb(202, 138, 4)' },
      'Interview Scheduled': { bg: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', dot: 'rgb(124, 58, 237)' },
      'Offer Sent': { bg: 'rgb(255, 247, 237)', color: 'rgb(234, 88, 12)', dot: 'rgb(234, 88, 12)' },
      'Hired': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Rejected': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' }
    };
    return styles[status] || styles['Pending'];
  };

  const getScoreStyle = (score: number) => {
    if (score >= 85) return { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)' };
    if (score >= 70) return { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)' };
    return { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)' };
  };

  // Fetch candidates with their applications
  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view candidates');
        return;
      }

      const response = await axios.get(`${API_URL}/api/admin/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const formattedCandidates = response.data.data.map((candidate: any) => ({
        ...candidate,
        name: candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim(),
        initials: candidate.initials || getInitials(candidate.firstName, candidate.lastName),
        color: candidate.color || getColor(candidate.name || `${candidate.firstName} ${candidate.lastName}`),
        id: candidate._id || candidate.id,
        role: candidate.positionAppliedFor || candidate.role || 'N/A',
        location: candidate.preferredLocations?.[0] || candidate.location || 'N/A',
        availability: candidate.workPreference || candidate.availability || 'N/A',
        appliedDate: candidate.appliedDate || candidate.createdAt || '',
        status: candidate.status || 'Pending'
      }));

      setCandidates(formattedCandidates);

      // Update stats
      const statsData = {
        total: formattedCandidates.length,
        active: formattedCandidates.filter((c: Candidate) => c.status === 'Active' || c.status === 'Pending').length,
        inReview: formattedCandidates.filter((c: Candidate) => c.status === 'In Review').length,
        interviewScheduled: formattedCandidates.filter((c: Candidate) => c.status === 'Interview Scheduled').length,
        offerSent: formattedCandidates.filter((c: Candidate) => c.status === 'Offer Sent').length,
        hired: formattedCandidates.filter((c: Candidate) => c.status === 'Hired').length,
        rejected: formattedCandidates.filter((c: Candidate) => c.status === 'Rejected').length
      };
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching candidates:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch candidates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // Tabs configuration
  const tabs = [
    { name: 'All Candidates' },
    { name: 'Active' },
    { name: 'In Review' },
    { name: 'Interview Scheduled' },
    { name: 'Offer Sent' },
    { name: 'Hired' },
    { name: 'Rejected' }
  ];

  // Sort function
  const sortCandidates = (candidatesToSort: Candidate[]) => {
    const sorted = [...candidatesToSort];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) =>
          new Date(b.appliedDate || b.createdAt || '').getTime() -
          new Date(a.appliedDate || a.createdAt || '').getTime()
        );
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return sorted;
    }
  };

  // Filter and sort candidates
  const filteredCandidates = sortCandidates(
    candidates.filter(candidate => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        candidate.name?.toLowerCase().includes(searchLower) ||
        candidate.email?.toLowerCase().includes(searchLower) ||
        candidate.role?.toLowerCase().includes(searchLower) ||
        candidate.positionAppliedFor?.toLowerCase().includes(searchLower);

      if (activeTab === 'All Candidates') return matchesSearch;
      return matchesSearch && candidate.status === activeTab;
    })
  );

  const getTabCount = (tabName: string) => {
    if (tabName === 'All Candidates') return candidates.length;
    if (tabName === 'Active') {
      return candidates.filter(c => c.status === 'Active' || c.status === 'Pending').length;
    }
    return candidates.filter(c => c.status === tabName).length;
  };

  // Handle view profile
  const handleViewProfile = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedCandidate(null);
  };

  // Handle export to Excel
  const handleExport = () => {
    try {
      setExporting(true);

      const dataToExport = filteredCandidates.map(candidate => ({
        'Name': candidate.name,
        'Email': candidate.email,
        'Role': candidate.role,
        'Location': candidate.location,
        'Availability': candidate.availability,
        'Applied Date': candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 'N/A',
        'Score': candidate.score || 0,
        'Status': candidate.status
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      const colWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 25 }, { wch: 20 },
        { wch: 20 }, { wch: 18 }, { wch: 10 }, { wch: 25 }
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Candidates');

      const date = new Date();
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      XLSX.writeFile(wb, `candidates_export_${dateStr}.xlsx`);

      toast.success(`Exported ${dataToExport.length} candidates successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export candidates. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    const toastId = toast.loading('Refreshing candidates...');
    try {
      await fetchCandidates();
      toast.success('Candidates refreshed successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to refresh candidates', { id: toastId });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Candidates
            </h1>
            <p className="text-sm font-medium" style={{ color: 'rgb(160, 170, 191)' }}>
              {candidates.length} candidates across all stages
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search - Hidden on mobile, shown as icon */}
            <div className="hidden sm:flex items-center gap-2 px-3.5 rounded-xl bg-white border border-gray-200 h-10 w-48 md:w-60 lg:w-72">
              <Search size={13} stroke="#A0AABF" strokeWidth={2.2} />
              <input
                placeholder="Search candidates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-700 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Mobile Search */}
            <div className="sm:hidden flex items-center gap-2 px-3 rounded-xl bg-white border border-gray-200 h-10 flex-1 min-w-[120px]">
              <Search size={13} stroke="#A0AABF" strokeWidth={2.2} />
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-700 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Sort Dropdown */}
            <select
              className="rounded-xl px-2 sm:px-3 h-10 bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer outline-none font-semibold min-w-[120px] sm:min-w-[140px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort: Date</option>
              <option value="score">Sort: Score</option>
              <option value="name">Sort: Name</option>
            </select>

            {/* Filters - Hidden on very small screens */}
            <button className="hidden sm:flex items-center gap-2 px-4 rounded-xl h-10 bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors">
              <Funnel size={13} stroke="currentColor" strokeWidth={2} />
              Filters
            </button>

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="hidden sm:flex items-center gap-2 px-4 rounded-xl h-10 bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={13} stroke="currentColor" strokeWidth={2} />
            </button>

            {/* Export */}
            <button
              className="flex items-center gap-2 px-3 sm:px-4 rounded-xl h-10 bg-purple-700 text-white text-sm font-bold cursor-pointer border-none hover:bg-purple-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleExport}
              disabled={exporting || filteredCandidates.length === 0}
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={13} stroke="currentColor" strokeWidth={2} />
                  <span className="hidden sm:inline">Export</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tabs - Scrollable */}
        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-0.5" style={{ borderBottom: '1px solid rgb(238, 241, 251)' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.name;
            const count = getTabCount(tab.name);
            return (
              <button
                key={tab.name}
                className="flex items-center gap-1.5 sm:gap-2 shrink-0 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200"
                style={{
                  color: isActive ? 'rgb(96, 27, 128)' : 'rgb(123, 130, 153)',
                  fontWeight: isActive ? 700 : 500,
                  borderBottom: isActive ? '2.5px solid rgb(96, 27, 128)' : '2px solid transparent',
                  background: 'transparent',
                  cursor: 'pointer',
                  marginBottom: '-1px'
                }}
                onClick={() => setActiveTab(tab.name)}
              >
                <span className="whitespace-nowrap">{tab.name}</span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] sm:text-[10px] font-extrabold min-w-[18px] text-center"
                  style={{
                    background: isActive ? 'rgb(96, 27, 128)' : 'rgb(238, 241, 251)',
                    color: isActive ? 'rgb(255, 255, 255)' : 'rgb(123, 130, 153)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-5">
        <div className="rounded-2xl overflow-hidden" style={{
          background: 'rgb(255, 255, 255)',
          border: '1px solid rgb(228, 233, 244)',
          boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px'
        }}>
          {/* Scrollable Table View - Both Mobile & Desktop */}
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '860px' }}>
              <thead>
                <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Candidate
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Role
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Location
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Availability
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Applied
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Score
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Status
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCandidates.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '40px', textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: 'rgb(123, 130, 153)' }}>No candidates found</p>
                      <p style={{ fontSize: '13px', marginTop: '4px', color: 'rgb(160, 170, 191)' }}>Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredCandidates.map((candidate, index) => {
                    const statusStyle = getStatusStyle(candidate.status);
                    const scoreStyle = getScoreStyle(candidate.score || 0);
                    return (
                      <tr
                        key={candidate._id || candidate.id}
                        style={{
                          borderBottom: index === filteredCandidates.length - 1 ? 'none' : '1px solid rgb(238, 241, 251)',
                          background: 'rgb(255, 255, 255)',
                          transition: 'background 0.12s',
                          cursor: 'pointer'
                        }}
                        className="hover:bg-gray-50"
                        onClick={() => handleViewProfile(candidate)}
                      >
                        <td style={{ padding: '13px 16px' }}>
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center rounded-xl shrink-0"
                              style={{ width: '34px', height: '34px', background: candidate.color || getColor(candidate.name), boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                            >
                              <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>
                                {candidate.initials || getInitials(candidate.firstName, candidate.lastName)}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontWeight: 700, color: 'rgb(13, 17, 23)' }}>
                                {candidate.name}
                              </span>
                              <div style={{ fontSize: '11px', color: 'rgb(160, 170, 191)', fontWeight: 500 }}>
                                {candidate.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                          {candidate.role || candidate.positionAppliedFor || 'N/A'}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="flex items-center gap-1.5" style={{ color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                            <MapPin size={12} stroke="#A0AABF" strokeWidth={2} />
                            {candidate.location || candidate.preferredLocations?.[0] || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                          {candidate.availability || candidate.workPreference || 'N/A'}
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="flex items-center gap-1.5" style={{ color: 'rgb(160, 170, 191)', fontSize: '12px', fontWeight: 500 }}>
                            <Calendar size={12} stroke="#A0AABF" strokeWidth={2} />
                            {formatDate(candidate.appliedDate || candidate.createdAt || '')}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="rounded-lg px-2.5 py-1" style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            background: scoreStyle.bg,
                            color: scoreStyle.color
                          }}>
                            {candidate.score || 0}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="flex items-center gap-1.5 rounded-full px-3 py-1 w-fit" style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            background: statusStyle.bg,
                            color: statusStyle.color
                          }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
                            {candidate.status}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <div className="flex gap-1.5">
                            <button
                              className="flex items-center justify-center rounded-xl"
                              title="View"
                              style={{ width: '30px', height: '30px', background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewProfile(candidate);
                              }}
                            >
                              <Eye size={13} stroke="currentColor" strokeWidth={2} />
                            </button>
                            {/* <button
                              className="flex items-center justify-center rounded-xl"
                              title="Edit"
                              style={{ width: '30px', height: '30px', background: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', cursor: 'pointer', border: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Pen size={13} stroke="currentColor" strokeWidth={2} />
                            </button>
                            <button
                              className="flex items-center justify-center rounded-xl"
                              title="Delete"
                              style={{ width: '30px', height: '30px', background: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', cursor: 'pointer', border: 'none' }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 size={13} stroke="currentColor" strokeWidth={2} />
                            </button> */}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredCandidates.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 border-t" style={{ borderColor: 'rgb(238, 241, 251)' }}>
              <p className="text-xs" style={{ color: 'rgb(160, 170, 191)', fontWeight: 500 }}>
                Showing <b style={{ color: 'rgb(13, 17, 23)' }}>{filteredCandidates.length}</b> of <b style={{ color: 'rgb(13, 17, 23)' }}>{candidates.length}</b> candidates
              </p>
              <div className="flex gap-2">
                <button disabled className="rounded-xl px-4 py-1.5 border text-xs font-semibold bg-white cursor-default" style={{ borderColor: 'rgb(228, 233, 244)', color: 'rgb(200, 206, 221)' }}>
                  Previous
                </button>
                <button className="rounded-xl px-4 py-1.5 border text-xs font-semibold bg-white hover:bg-gray-50 transition-colors" style={{ borderColor: 'rgb(228, 233, 244)', color: 'rgb(13, 17, 23)' }}>
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar
        candidate={selectedCandidate}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
      />
    </div>
  );
};

export default Candidates;