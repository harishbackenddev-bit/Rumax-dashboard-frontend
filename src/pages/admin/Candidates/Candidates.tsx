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
  Trash2,
  Briefcase,
  Filter,
  FileText
} from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProfileSidebar from '@/components/admin/candidate/ProfileSidebar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Application {
  _id: string;
  applicationId: string;
  candidateId: string;
  jobId: string;
  jobTitle: string;
  jobDetails: any;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  nationality: string;
  rightToWork: string;
  status: 'Pending' | 'In Review' | 'Interview Scheduled' | 'Offer Sent' | 'Hired' | 'Rejected' | 'Active';
  score: number;
  applicationDate: string;
  coverLetter: string;
  additionalNotes: string;
  availableFrom: string;
  expectedSalary: string;
  noticePeriod: string;
  interviewDate: string | null;
  interviewNotes: string;
  interviewers: any[];
  offerDetails: any;
  rejectionReason: string;
  rejectionNotes: string;
  jobSnapshot: any;
  createdAt: string;
  updatedAt: string;
  initials?: string;
  color?: string;
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

// Job filter dropdown component
const JobFilterDropdown = ({ jobs, selectedJob, onJobSelect }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 rounded-xl h-10 bg-white border border-gray-200 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        <Briefcase size={13} stroke="currentColor" strokeWidth={2} />
        {selectedJob ? jobs.find((j: any) => j._id === selectedJob)?.jobTitle || 'All Jobs' : 'All Jobs'}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          <div
            className="px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm"
            onClick={() => {
              onJobSelect('');
              setIsOpen(false);
            }}
          >
            All Jobs
          </div>
          {jobs.map((job: any) => (
            <div
              key={job._id}
              className={`px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm ${selectedJob === job._id ? 'bg-purple-50 text-purple-700' : ''}`}
              onClick={() => {
                onJobSelect(job._id);
                setIsOpen(false);
              }}
            >
              {job.jobTitle}
              <span className="text-xs text-gray-400 ml-2">{job.location}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Candidates = () => {
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Candidates');
  const [applications, setApplications] = useState<Application[]>([]);
  const [exporting, setExporting] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sortBy, setSortBy] = useState('date');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobs, setJobs] = useState<any[]>([]);
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

  // Fetch jobs for filter
  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/api/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view applications');
        return;
      }

      // Build query params
      const params: any = {};
      if (searchQuery) params.search = searchQuery;
      if (selectedJobId) params.jobId = selectedJobId;
      if (activeTab !== 'All Candidates') params.status = activeTab;

      const response = await axios.get(`${API_URL}/api/admin/candidates`, {
        headers: { Authorization: `Bearer ${token}` },
        params
      });

      const formattedApplications = response.data.data.map((app: any) => ({
        ...app,
        initials: getInitials(app.firstName, app.lastName),
        color: getColor(app.fullName || `${app.firstName} ${app.lastName}`),
        fullName: app.fullName || `${app.firstName || ''} ${app.lastName || ''}`.trim()
      }));

      setApplications(formattedApplications);

      // Update stats
      const statsData = {
        total: formattedApplications.length,
        active: formattedApplications.filter((c: Application) => c.status === 'Active' || c.status === 'Pending').length,
        inReview: formattedApplications.filter((c: Application) => c.status === 'In Review').length,
        interviewScheduled: formattedApplications.filter((c: Application) => c.status === 'Interview Scheduled').length,
        offerSent: formattedApplications.filter((c: Application) => c.status === 'Offer Sent').length,
        hired: formattedApplications.filter((c: Application) => c.status === 'Hired').length,
        rejected: formattedApplications.filter((c: Application) => c.status === 'Rejected').length
      };
      setStats(statsData);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchApplications();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab, selectedJobId]);

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
  const sortApplications = (appsToSort: Application[]) => {
    const sorted = [...appsToSort];
    switch (sortBy) {
      case 'date':
        return sorted.sort((a, b) =>
          new Date(b.applicationDate || b.createdAt || '').getTime() -
          new Date(a.applicationDate || a.createdAt || '').getTime()
        );
      case 'score':
        return sorted.sort((a, b) => (b.score || 0) - (a.score || 0));
      case 'name':
        return sorted.sort((a, b) => a.fullName.localeCompare(b.fullName));
      default:
        return sorted;
    }
  };

  // Filter applications
  const filteredApplications = sortApplications(
    applications.filter(app => {
      const searchLower = searchQuery.toLowerCase();
      return (
        app.fullName?.toLowerCase().includes(searchLower) ||
        app.email?.toLowerCase().includes(searchLower) ||
        app.jobTitle?.toLowerCase().includes(searchLower) ||
        app.firstName?.toLowerCase().includes(searchLower) ||
        app.lastName?.toLowerCase().includes(searchLower)
      );
    })
  );

  const getTabCount = (tabName: string) => {
    if (tabName === 'All Candidates') return applications.length;
    if (tabName === 'Active') {
      return applications.filter(c => c.status === 'Active' || c.status === 'Pending').length;
    }
    return applications.filter(c => c.status === tabName).length;
  };

  // Handle view profile
  const handleViewProfile = (application: Application) => {
    setSelectedApplication(application);
    setIsProfileOpen(true);
  };

  const handleCloseProfile = () => {
    setIsProfileOpen(false);
    setSelectedApplication(null);
  };

  // Handle export to Excel
  const handleExport = () => {
    try {
      setExporting(true);

      const dataToExport = filteredApplications.map(app => ({
        'Candidate Name': app.fullName,
        'Email': app.email,
        'Phone': app.phone || 'N/A',
        'Job Applied For': app.jobTitle,
        'Location': app.city || 'N/A',
        'Status': app.status,
        'Score': app.score || 0,
        'Application Date': app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      const colWidths = [
        { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 25 },
        { wch: 20 }, { wch: 15 }, { wch: 10 }, { wch: 18 }
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Applications');

      const date = new Date();
      const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      XLSX.writeFile(wb, `applications_export_${dateStr}.xlsx`);

      toast.success(`Exported ${dataToExport.length} applications successfully`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export applications. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    const toastId = toast.loading('Refreshing applications...');
    try {
      await fetchApplications();
      toast.success('Applications refreshed successfully', { id: toastId });
    } catch (error) {
      toast.error('Failed to refresh applications', { id: toastId });
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

  if (loading && applications.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
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
              Job Applications
            </h1>
            <p className="text-sm font-medium" style={{ color: 'rgb(160, 170, 191)' }}>
              {applications.length} total applications across all jobs
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="flex items-center gap-2 px-3.5 rounded-xl bg-white border border-gray-200 h-10 w-48 md:w-60 lg:w-72">
              <Search size={13} stroke="#A0AABF" strokeWidth={2.2} />
              <input
                placeholder="Search by name, email, job..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none outline-none bg-transparent text-sm text-gray-700 font-medium placeholder:text-gray-400"
              />
            </div>

            {/* Job Filter Dropdown */}
            <JobFilterDropdown
              jobs={jobs}
              selectedJob={selectedJobId}
              onJobSelect={setSelectedJobId}
            />

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

            {/* Refresh */}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-4 rounded-xl h-10 bg-white border border-gray-200 text-sm text-gray-400 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <RefreshCw size={13} stroke="currentColor" strokeWidth={2} />
            </button>

            {/* Export */}
            <button
              className="flex items-center gap-2 px-3 sm:px-4 rounded-xl h-10 bg-purple-700 text-white text-sm font-bold cursor-pointer border-none hover:bg-purple-800 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              onClick={handleExport}
              disabled={exporting || filteredApplications.length === 0}
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

        {/* Tabs */}
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
          <div className="overflow-x-auto">
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '900px' }}>
              <thead>
                <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Candidate
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Applied For
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                    Location
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
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center' }}>
                      <p style={{ fontSize: '16px', fontWeight: 600, color: 'rgb(123, 130, 153)' }}>No applications found</p>
                      <p style={{ fontSize: '13px', marginTop: '4px', color: 'rgb(160, 170, 191)' }}>Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app, index) => {
                    const statusStyle = getStatusStyle(app.status);
                    const scoreStyle = getScoreStyle(app.score || 0);
                    return (
                      <tr
                        key={app._id || app.applicationId}
                        style={{
                          borderBottom: index === filteredApplications.length - 1 ? 'none' : '1px solid rgb(238, 241, 251)',
                          background: 'rgb(255, 255, 255)',
                          transition: 'background 0.12s',
                          cursor: 'pointer'
                        }}
                        className="hover:bg-gray-50"
                        onClick={() => handleViewProfile(app)}
                      >
                        <td style={{ padding: '13px 16px' }}>
                          <div className="flex items-center gap-3">
                            <div
                              className="flex items-center justify-center rounded-xl shrink-0"
                              style={{ width: '34px', height: '34px', background: app.color || getColor(app.fullName), boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                            >
                              <span style={{ color: '#fff', fontSize: '11px', fontWeight: 800 }}>
                                {app.initials || getInitials(app.firstName, app.lastName)}
                              </span>
                            </div>
                            <div>
                              <span style={{ fontWeight: 700, color: 'rgb(13, 17, 23)' }}>
                                {app.fullName}
                              </span>
                              <div style={{ fontSize: '11px', color: 'rgb(160, 170, 191)', fontWeight: 500 }}>
                                {app.email}
                              </div>
                              {app.phone && (
                                <div style={{ fontSize: '10px', color: 'rgb(160, 170, 191)' }}>
                                  📞 {app.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <div>
                            <span style={{ fontWeight: 600, color: 'rgb(13, 17, 23)' }}>
                              {app.jobTitle}
                            </span>
                            <div style={{ fontSize: '10px', color: 'rgb(160, 170, 191)' }}>
                              Application ID: {app._id?.substring(0, 8) || app.applicationId?.substring(0, 8)}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="flex items-center gap-1.5" style={{ color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                            <MapPin size={12} stroke="#A0AABF" strokeWidth={2} />
                            {app.city || 'N/A'}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="flex items-center gap-1.5" style={{ color: 'rgb(160, 170, 191)', fontSize: '12px', fontWeight: 500 }}>
                            <Calendar size={12} stroke="#A0AABF" strokeWidth={2} />
                            {formatDate(app.applicationDate || app.createdAt || '')}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <span className="rounded-lg px-2.5 py-1" style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            background: scoreStyle.bg,
                            color: scoreStyle.color
                          }}>
                            {app.score || 0}
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
                            {app.status}
                          </span>
                        </td>
                        <td style={{ padding: '13px 16px' }}>
                          <button
                            className="flex items-center justify-center rounded-xl"
                            title="View Application"
                            style={{ width: '30px', height: '30px', background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewProfile(app);
                            }}
                          >
                            <Eye size={13} stroke="currentColor" strokeWidth={2} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          {filteredApplications.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-3 border-t" style={{ borderColor: 'rgb(238, 241, 251)' }}>
              <p className="text-xs" style={{ color: 'rgb(160, 170, 191)', fontWeight: 500 }}>
                Showing <b style={{ color: 'rgb(13, 17, 23)' }}>{filteredApplications.length}</b> of <b style={{ color: 'rgb(13, 17, 23)' }}>{applications.length}</b> applications
                {selectedJobId && jobs.find(j => j._id === selectedJobId) && (
                  <span> for <b>{jobs.find(j => j._id === selectedJobId)?.jobTitle}</b></span>
                )}
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
        application={selectedApplication}
        isOpen={isProfileOpen}
        onClose={handleCloseProfile}
      />
    </div>
  );
};

export default Candidates;