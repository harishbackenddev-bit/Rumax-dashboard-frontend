// pages/admin/Jobs.tsx
import React, { useState, useEffect } from 'react';
import {
    Search,
    Funnel,
    Plus,
    Briefcase,
    MapPin,
    Users,
    Eye,
    Pen,
    Copy,
    CircleX,
    ChevronDown,
    Calendar,
    CheckCircle,
    XCircle,
    Clock,
    MoreVertical,
    RefreshCw,
    Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Job {
    _id: string;
    jobTitle: string;
    department?: string;
    locations: string[];
    applicants?: number;
    status: 'Open' | 'Draft' | 'Closed' | 'Paused' | 'Archived'| 'Active';
    posted?: string;
    createdAt: string;
    updatedAt: string;
    color?: string;
    availability?: string;
    contractType?: string;
    salaryMin?: string;
    salaryMax?: string;
    deadline?: string;
    notes?: string;
    teamMembers?: any[];
}

const Jobs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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

    const getStatusStyle = (status: string) => {
        const styles: Record<string, { bg: string; color: string; dot: string }> = {
            'Open': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
            'Active': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
            'Draft': { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)', dot: 'rgb(202, 138, 4)' },
            'Closed': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' },
            'Paused': { bg: 'rgb(243, 244, 246)', color: 'rgb(107, 114, 128)', dot: 'rgb(107, 114, 128)' },
            'Archived': { bg: 'rgb(243, 244, 246)', color: 'rgb(107, 114, 128)', dot: 'rgb(107, 114, 128)' }
        };
        return styles[status] || styles['Draft'];
    };

    const getJobColor = (status: string): string => {
        const colors: Record<string, string> = {
            'Open': '#16A34A',
            'Active': '#16A34A',
            'Draft': '#CA8A04',
            'Closed': '#DC2626',
            'Paused': '#6B7280',
            'Archived': '#6B7280'
        };
        return colors[status] || '#0F4C81';
    };

    const getStatusDisplay = (status: string): string => {
        const map: Record<string, string> = {
            'Open': 'Active',
            'Active': 'Active',
            'Draft': 'Draft',
            'Closed': 'Closed',
            'Paused': 'Paused',
            'Archived': 'Archived'
        };
        return map[status] || status;
    };

    // Fetch jobs from API
    const fetchJobs = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Please login to view jobs');
                return;
            }

            const response = await axios.get(`${API_URL}/api/admin/jobs`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setJobs(response.data.data || []);
        } catch (error: any) {
            console.error('Error fetching jobs:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    // Stats
    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'Open' || j.status === 'Active').length,
        draft: jobs.filter(j => j.status === 'Draft').length,
        closed: jobs.filter(j => j.status === 'Closed').length,
        paused: jobs.filter(j => j.status === 'Paused').length
    };

    // Filter jobs
    const filteredJobs = jobs.filter(job => {
        const matchesSearch =
            job.jobTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.locations?.some(loc => loc.toLowerCase().includes(searchQuery.toLowerCase())) ||
            job.contractType?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = filterStatus === 'all' || job.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    // Handle delete job
    const handleDelete = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            await axios.delete(`${API_URL}/api/admin/job/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setJobs(jobs.filter(j => j._id !== id));
            toast.success(`Job "${title}" deleted successfully`);
        } catch (error: any) {
            console.error('Error deleting job:', error);
            toast.error(error.response?.data?.message || 'Failed to delete job');
        } finally {
            setSaving(false);
        }
    };

    // Handle duplicate job
    const handleDuplicate = async (job: Job) => {
        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            const duplicateData = {
                ...job,
                jobTitle: `${job.jobTitle} (Copy)`,
                status: 'Draft',
                _id: undefined,
                createdAt: undefined,
                updatedAt: undefined
            };

            const response = await axios.post(`${API_URL}/api/adminjobs`, duplicateData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setJobs([...jobs, response.data.data]);
            toast.success(`Job "${job.jobTitle}" duplicated successfully`);
        } catch (error: any) {
            console.error('Error duplicating job:', error);
            toast.error(error.response?.data?.message || 'Failed to duplicate job');
        } finally {
            setSaving(false);
        }
    };

    // Handle close job
    const handleClose = async (id: string, title: string) => {
        if (!window.confirm(`Are you sure you want to close "${title}"?`)) return;

        try {
            setSaving(true);
            const token = localStorage.getItem('token');

            const response = await axios.put(`${API_URL}/api/admin/job/${id}`, {
                status: 'Closed'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setJobs(jobs.map(j => j._id === id ? response.data.data : j));
            toast.success(`Job "${title}" closed successfully`);
        } catch (error: any) {
            console.error('Error closing job:', error);
            toast.error(error.response?.data?.message || 'Failed to close job');
        } finally {
            setSaving(false);
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

    // Refresh handler
    const handleRefresh = async () => {
        const toastId = toast.loading('Refreshing jobs...');
        try {
            await fetchJobs();
            toast.success('Jobs refreshed successfully', { id: toastId });
        } catch (error) {
            toast.error('Failed to refresh jobs', { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                <div>
                    <h1 style={{ color: 'rgb(13, 17, 23)', marginBottom: '2px', fontSize: '20px', fontWeight: 700 }} className="sm:text-24px">
                        Jobs & Vacancies
                    </h1>
                    <p style={{ fontSize: '13px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                        {jobs.length} total positions
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    {/* Search - Full width on mobile */}
                    <div
                        className="flex items-center gap-2 px-3.5 rounded-xl w-full sm:w-[220px]"
                        style={{
                            background: 'rgb(255, 255, 255)',
                            border: '1.5px solid rgb(228, 233, 244)',
                            height: '40px'
                        }}
                    >
                        <Search size={13} stroke="#A0AABF" strokeWidth={2.2} />
                        <input
                            placeholder="Search jobs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                flex: '1 1 0%',
                                border: 'none',
                                outline: 'none',
                                background: 'transparent',
                                fontSize: '13px',
                                color: 'rgb(55, 65, 81)',
                                fontFamily: 'Manrope, sans-serif',
                                width: '100%',
                                minWidth: '0'
                            }}
                        />
                    </div>

                    {/* Action Buttons - Scrollable on mobile */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 flex-shrink-0">
                        {/* Status Filter */}
                        <div className="relative flex-shrink-0">
                            <button
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-xl whitespace-nowrap"
                                style={{
                                    height: '40px',
                                    background: 'rgb(255, 255, 255)',
                                    border: '1.5px solid rgb(228, 233, 244)',
                                    fontSize: '12px sm:13px',
                                    color: 'rgb(123, 130, 153)',
                                    cursor: 'pointer'
                                }}
                            >
                                <Funnel size={13} stroke="currentColor" strokeWidth={2} />
                                <span className="hidden xs:inline">{filterStatus === 'all' ? 'Status' : filterStatus}</span>
                                <span className="xs:hidden">Filter</span>
                                <ChevronDown size={13} stroke="currentColor" strokeWidth={2} />
                            </button>
                            {showStatusDropdown && (
                                <div
                                    className="absolute top-full left-0 mt-1 rounded-xl overflow-hidden z-10"
                                    style={{
                                        background: 'white',
                                        border: '1px solid rgb(228, 233, 244)',
                                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                        minWidth: '140px sm:160px'
                                    }}
                                >
                                    {['all', 'Open', 'Draft', 'Closed', 'Paused'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => {
                                                setFilterStatus(status);
                                                setShowStatusDropdown(false);
                                            }}
                                            className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                                            style={{
                                                background: filterStatus === status ? 'rgb(245, 243, 255)' : 'white',
                                                border: 'none',
                                                cursor: 'pointer',
                                                fontSize: '13px',
                                                color: 'rgb(13, 17, 23)'
                                            }}
                                        >
                                            {status === 'all' ? 'All Status' : status}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-xl flex-shrink-0"
                            style={{
                                height: '40px',
                                background: 'rgb(255, 255, 255)',
                                border: '1.5px solid rgb(228, 233, 244)',
                                fontSize: '12px sm:13px',
                                color: 'rgb(123, 130, 153)',
                                cursor: 'pointer'
                            }}
                        >
                            <RefreshCw size={13} stroke="currentColor" strokeWidth={2} />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>

                        {/* Post New Job Button */}
                        <button
                            onClick={() => navigate('/admin/post-job')}
                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-xl flex-shrink-0"
                            style={{
                                height: '40px',
                                background: 'rgb(96, 27, 128)',
                                color: 'rgb(255, 255, 255)',
                                fontSize: '12px sm:13px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                border: 'none',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <Plus size={14} stroke="currentColor" strokeWidth={2} />
                            <span className="hidden xs:inline">Post New Job</span>
                            <span className="xs:hidden">New</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{
                    background: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(228, 233, 244)',
                    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px'
                }}>
                    <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '36px sm:44px', height: '36px sm:44px', background: 'rgb(238, 241, 251)' }}>
                        <Briefcase size={16} stroke="#601B80" strokeWidth={2} />
                    </div>
                    <div>
                        <p style={{ fontSize: '18px sm:22px', fontWeight: 800, color: 'rgb(96, 27, 128)', lineHeight: 1 }}>{stats.total}</p>
                        <p style={{ fontSize: '10px sm:12px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }}>Total Jobs</p>
                    </div>
                </div>
                <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{
                    background: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(228, 233, 244)',
                    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px'
                }}>
                    <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '36px sm:44px', height: '36px sm:44px', background: 'rgb(240, 253, 244)' }}>
                        <Briefcase size={16} stroke="#16A34A" strokeWidth={2} />
                    </div>
                    <div>
                        <p style={{ fontSize: '18px sm:22px', fontWeight: 800, color: 'rgb(22, 163, 74)', lineHeight: 1 }}>{stats.active}</p>
                        <p style={{ fontSize: '10px sm:12px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }}>Active</p>
                    </div>
                </div>
                <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{
                    background: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(228, 233, 244)',
                    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px'
                }}>
                    <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '36px sm:44px', height: '36px sm:44px', background: 'rgb(255, 251, 235)' }}>
                        <Briefcase size={16} stroke="#CA8A04" strokeWidth={2} />
                    </div>
                    <div>
                        <p style={{ fontSize: '18px sm:22px', fontWeight: 800, color: 'rgb(202, 138, 4)', lineHeight: 1 }}>{stats.draft}</p>
                        <p style={{ fontSize: '10px sm:12px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }}>Draft</p>
                    </div>
                </div>
                <div className="rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4" style={{
                    background: 'rgb(255, 255, 255)',
                    border: '1px solid rgb(228, 233, 244)',
                    boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px'
                }}>
                    <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: '36px sm:44px', height: '36px sm:44px', background: 'rgb(254, 242, 242)' }}>
                        <Briefcase size={16} stroke="#DC2626" strokeWidth={2} />
                    </div>
                    <div>
                        <p style={{ fontSize: '18px sm:22px', fontWeight: 800, color: 'rgb(220, 38, 38)', lineHeight: 1 }}>{stats.closed + stats.paused}</p>
                        <p style={{ fontSize: '10px sm:12px', color: 'rgb(123, 130, 153)', fontWeight: 500, marginTop: '2px' }}>Closed</p>
                    </div>
                </div>
            </div>

            {/* Jobs Table - Responsive */}

            <div className="rounded-2xl overflow-hidden" style={{
                background: 'rgb(255, 255, 255)',
                border: '1px solid rgb(228, 233, 244)',
                boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 3px'
            }}>
                <div className="overflow-x-auto">
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '800px' }}>
                        <thead>
                            <tr style={{ background: 'rgb(250, 251, 254)', borderBottom: '1px solid rgb(238, 241, 251)' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Job Title
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Location
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Type
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Salary
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Status
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Posted
                                </th>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 700, color: 'rgb(160, 170, 191)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredJobs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: 'rgb(123, 130, 153)' }}>
                                        <p style={{ fontSize: '16px', fontWeight: 600 }}>No jobs found</p>
                                        <p style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search or filters</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredJobs.map((job, index) => {
                                    const statusStyle = getStatusStyle(job.status);
                                    const jobColor = getJobColor(job.status);
                                    const statusDisplay = getStatusDisplay(job.status);

                                    return (
                                        <tr
                                            key={job._id}
                                            style={{
                                                borderBottom: index === filteredJobs.length - 1 ? 'none' : '1px solid rgb(238, 241, 251)',
                                                background: 'rgb(255, 255, 255)',
                                                transition: 'background 0.12s'
                                            }}
                                            className="hover:bg-gray-50"
                                        >
                                            <td style={{ padding: '13px 16px' }}>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="flex items-center justify-center rounded-xl shrink-0"
                                                        style={{ width: '34px', height: '34px', background: jobColor, boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                                                    >
                                                        <Briefcase size={14} stroke="#fff" strokeWidth={2} />
                                                    </div>
                                                    <span style={{ fontWeight: 700, color: 'rgb(13, 17, 23)' }}>
                                                        {job.jobTitle}
                                                    </span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '13px 16px' }}>
                                                <span className="flex items-center gap-1.5" style={{ color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                                                    <MapPin size={12} stroke="#A0AABF" strokeWidth={2} />
                                                    {job.locations?.join(', ') || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '13px 16px' }}>
                                                <span className="rounded-full px-3 py-1" style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    background: 'rgb(238, 241, 251)',
                                                    color: 'rgb(96, 27, 128)'
                                                }}>
                                                    {job.contractType || 'N/A'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '13px 16px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                                                {job.salaryMin && job.salaryMax ? `£${job.salaryMin} - £${job.salaryMax}` : 'N/A'}
                                            </td>
                                            <td style={{ padding: '13px 16px' }}>
                                                <span className="flex items-center gap-1.5 rounded-full px-3 py-1 w-fit" style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    background: statusStyle.bg,
                                                    color: statusStyle.color
                                                }}>
                                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
                                                    {statusDisplay}
                                                </span>
                                            </td>
                                            <td style={{ padding: '13px 16px', color: 'rgb(160, 170, 191)', fontSize: '12px', fontWeight: 500 }}>
                                                {formatDate(job.createdAt)}
                                            </td>
                                            <td style={{ padding: '13px 16px' }}>
                                                <div className="flex gap-1.5">
                                                    <button
                                                        className="flex items-center justify-center rounded-xl"
                                                        title="View"
                                                        style={{ width: '30px', height: '30px', background: 'rgb(238, 241, 251)', color: 'rgb(96, 27, 128)', cursor: 'pointer', border: 'none' }}
                                                        onClick={() => navigate(`/admin/jobs/${job._id}`)}
                                                    >
                                                        <Eye size={13} stroke="currentColor" strokeWidth={2} />
                                                    </button>
                                                    <button
                                                        className="flex items-center justify-center rounded-xl"
                                                        title="Edit"
                                                        style={{ width: '30px', height: '30px', background: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', cursor: 'pointer', border: 'none' }}
                                                        onClick={() => navigate(`/admin/edit-job/${job._id}`)}
                                                    >
                                                        <Pen size={13} stroke="currentColor" strokeWidth={2} />
                                                    </button>


                                                    <button
                                                        className="flex items-center justify-center rounded-xl"
                                                        title="Delete"
                                                        style={{ width: '30px', height: '30px', background: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', cursor: 'pointer', border: 'none' }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(job._id, job.jobTitle);
                                                        }}
                                                        disabled={saving}
                                                    >
                                                        <Trash2 size={13} stroke="currentColor" strokeWidth={2} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Jobs;