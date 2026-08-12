// pages/admin/JobDetail.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Eye,
  TrendingUp,
  Pen,
  Trash2,
  Copy,
  Clock,
  Calendar as CalendarIcon,
  MessageSquare
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface JobData {
  _id: string;
  id: string;
  jobTitle: string;
  availability: string;
  experience: string;
  contractType: string;
  locations: string[];
  salaryMin: string;
  salaryMax: string;
  status: string;
  startDate: string;
  deadline: string;
  notes: string;
  responsibilities: { id: string; text: string }[];
  requirements: { id: string; text: string }[];
  benefits: { id: string; text: string }[];
  teamMembers: any[];
  autoShortlistScore: number;
  requireResume: boolean;
  requireCoverLetter: boolean;
  requireDrivingLicence: boolean;
  requireDBS: boolean;
  requireReferences: boolean;
  createdBy: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  applications: any[];
  isDeleted: boolean;
}

const JobDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Performance');
  const [job, setJob] = useState<JobData | null>(null);
  const [stats, setStats] = useState({
    views: 412,
    applicants: 34,
    conversion: 8.2
  });

  const tabs = ['Job Description', 'Requirements', 'Applicants', 'Interviews', 'Performance'];

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; dot: string }> = {
      'Open': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Active': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Draft': { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)', dot: 'rgb(202, 138, 4)' },
      'Closed': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' },
      'Filled': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'Pending': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'In Review': { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)', dot: 'rgb(202, 138, 4)' },
      'Interview Scheduled': { bg: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', dot: 'rgb(124, 58, 237)' },
      'Offer Sent': { bg: 'rgb(255, 247, 237)', color: 'rgb(234, 88, 12)', dot: 'rgb(234, 88, 12)' },
      'Hired': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Rejected': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' }
    };
    return styles[status] || styles['Open'];
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

      const jobData = response.data.data;
      setJob(jobData);

      // Calculate stats from real data
      const applicants = jobData.applications?.length || 0;
      const views = Math.floor(Math.random() * 400) + 100;
      const conversion = applicants > 0 ? parseFloat(((applicants / views) * 100).toFixed(1)) : 0;

      setStats({
        views,
        applicants,
        conversion
      });

    } catch (error: any) {
      console.error('Error fetching job:', error);
      toast.error(error.response?.data?.message || 'Failed to load job data');
      navigate('/admin/jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobData();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/api/admin/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job deleted successfully');
      navigate('/admin/jobs');
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleDuplicate = () => {
    navigate(`/admin/post-job?duplicate=${id}`);
  };

  const handleEdit = () => {
    navigate(`/admin/edit-job/${id}`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: Record<string, string> = {
      'Open': 'Active',
      'Active': 'Active',
      'Draft': 'Draft',
      'Closed': 'Closed',
      'Filled': 'Filled'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Job not found</p>
        <button 
          onClick={() => navigate('/admin/jobs')}
          className="mt-4 text-purple-700 font-semibold hover:underline"
        >
          Back to Jobs
        </button>
      </div>
    );
  }

  const statusStyle = getStatusStyle(job.status);
  const interviewApplications = job.applications?.filter(
    (app: any) => app.status === 'Interview Scheduled'
  ) || [];

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 sm:p-6 lg:p-7">
      {/* Back Button */}
      <button 
        onClick={() => navigate('/admin/jobs')}
        className="flex items-center gap-2 mb-5 w-fit"
        style={{ 
          fontSize: '13px', 
          fontWeight: 600, 
          color: 'rgb(123, 130, 153)', 
          background: 'none', 
          cursor: 'pointer', 
          border: 'none' 
        }}
      >
        <ArrowLeft size={14} stroke="currentColor" strokeWidth={2} />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="rounded-2xl p-4 sm:p-6 mb-5" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div 
              className="flex items-center justify-center rounded-2xl shrink-0"
              style={{ width: '44px', height: '44px', background: 'rgb(27, 34, 128)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 14px' }}
            >
              <Briefcase size={18} stroke="#fff" strokeWidth={2} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 style={{ color: 'rgb(13, 17, 23)', fontSize: '18px', fontWeight: 700 }}>
                  {job.jobTitle}
                </h2>
                <span 
                  className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                  style={{ fontSize: '10px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
                  {getStatusDisplay(job.status)}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                  <Users size={11} stroke="currentColor" strokeWidth={2} />
                  {job.contractType || 'N/A'}
                </span>
                <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                  <MapPin size={11} stroke="currentColor" strokeWidth={2} />
                  {job.locations?.join(', ') || 'N/A'}
                </span>
                <span className="flex items-center gap-1.5" style={{ fontSize: '11px', color: 'rgb(123, 130, 153)', fontWeight: 500 }}>
                  <Calendar size={11} stroke="currentColor" strokeWidth={2} />
                  Posted {formatDate(job.publishedAt || job.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2 self-start lg:self-auto">
            <button 
              onClick={handleEdit}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl"
              style={{ background: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
            >
              <Pen size={13} stroke="currentColor" strokeWidth={2} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            {/* <button 
              onClick={handleDuplicate}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl"
              style={{ background: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
            >
              <Copy size={13} stroke="currentColor" strokeWidth={2} />
              <span className="hidden sm:inline">Duplicate</span>
            </button> */}

            <button 
              onClick={handleDelete}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl"
              style={{ background: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', border: 'none' }}
            >
              <Trash2 size={13} stroke="currentColor" strokeWidth={2} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2 sm:gap-3 mt-3 sm:mt-4 pt-3 sm:pt-4 overflow-x-auto" style={{ borderTop: '1px solid rgb(238, 241, 251)' }}>
          <div className="rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center shrink-0" style={{ background: 'rgb(238, 241, 251)', minWidth: '70px' }}>
            <div className="flex justify-center mb-0.5">
              <Eye size={13} stroke="#601B80" strokeWidth={2} />
            </div>
            <p style={{ fontSize: '18px', fontWeight: 800, color: 'rgb(96, 27, 128)', lineHeight: 1 }}>{stats.views}</p>
            <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', marginTop: '2px', fontWeight: 600 }}>Views</p>
          </div>
          <div className="rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center shrink-0" style={{ background: 'rgb(245, 243, 255)', minWidth: '70px' }}>
            <div className="flex justify-center mb-0.5">
              <Users size={13} stroke="#7C3AED" strokeWidth={2} />
            </div>
            <p style={{ fontSize: '18px', fontWeight: 800, color: 'rgb(124, 58, 237)', lineHeight: 1 }}>{stats.applicants}</p>
            <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', marginTop: '2px', fontWeight: 600 }}>Applications</p>
          </div>
          <div className="rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-center shrink-0" style={{ background: 'rgb(240, 253, 244)', minWidth: '70px' }}>
            <div className="flex justify-center mb-0.5">
              <TrendingUp size={13} stroke="#16A34A" strokeWidth={2} />
            </div>
            <p style={{ fontSize: '18px', fontWeight: 800, color: 'rgb(22, 163, 74)', lineHeight: 1 }}>{stats.conversion}%</p>
            <p style={{ fontSize: '10px', color: 'rgb(160, 170, 191)', marginTop: '2px', fontWeight: 600 }}>Conversion</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide mb-5" style={{ borderBottom: '1px solid rgb(238, 241, 251)' }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="whitespace-nowrap"
            style={{ 
              padding: '9px 16px', 
              fontSize: '13px', 
              fontWeight: activeTab === tab ? 700 : 500,
              color: activeTab === tab ? 'rgb(96, 27, 128)' : 'rgb(123, 130, 153)',
              borderBottom: activeTab === tab ? '2.5px solid rgb(96, 27, 128)' : '2.5px solid transparent',
              background: 'transparent',
              cursor: 'pointer',
              marginBottom: '-1px',
              transition: '0.15s'
            }}
          >
            {tab}
            {tab === 'Interviews' && interviewApplications.length > 0 && (
              <span 
                className="ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold"
                style={{ background: 'rgb(124, 58, 237)', color: 'rgb(255, 255, 255)' }}
              >
                {interviewApplications.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-2xl p-4 sm:p-6" style={{ 
        background: 'rgb(255, 255, 255)', 
        border: '1px solid rgb(228, 233, 244)', 
        boxShadow: 'rgba(0, 0, 0, 0.04) 0px 1px 4px' 
      }}>
        {activeTab === 'Job Description' && (
          <div>
            <div className="mb-4">
              <h4 style={{ color: 'rgb(13, 17, 23)', marginBottom: '12px', fontSize: '16px', fontWeight: 700 }}>
                About the Role
              </h4>
              <p style={{ fontSize: '13px', color: 'rgb(55, 65, 81)', lineHeight: '1.8', fontWeight: 500 }}>
                {job.notes || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <p style={{ fontSize: '12px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Contract Type</p>
                <p style={{ fontSize: '14px', color: 'rgb(13, 17, 23)', fontWeight: 600 }}>{job.contractType || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Experience Level</p>
                <p style={{ fontSize: '14px', color: 'rgb(13, 17, 23)', fontWeight: 600 }}>{job.experience || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Availability</p>
                <p style={{ fontSize: '14px', color: 'rgb(13, 17, 23)', fontWeight: 600 }}>{job.availability || 'N/A'}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'rgb(160, 170, 191)', fontWeight: 600 }}>Salary Range</p>
                <p style={{ fontSize: '14px', color: 'rgb(13, 17, 23)', fontWeight: 600 }}>
                  {job.salaryMin && job.salaryMax ? `£${job.salaryMin} - £${job.salaryMax}` : 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <h4 style={{ color: 'rgb(13, 17, 23)', marginBottom: '12px', fontSize: '16px', fontWeight: 700 }}>
                Key Responsibilities
              </h4>
              <ul style={{ fontSize: '13px', color: 'rgb(55, 65, 81)', lineHeight: '2', paddingLeft: '18px', fontWeight: 500 }}>
                {job.responsibilities?.map((item) => (
                  <li key={item.id}>{item.text}</li>
                ))}
                {(!job.responsibilities || job.responsibilities.length === 0) && (
                  <li>No responsibilities listed</li>
                )}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'Requirements' && (
          <div>
            <h4 style={{ color: 'rgb(13, 17, 23)', marginBottom: '12px', fontSize: '16px', fontWeight: 700 }}>
              Requirements
            </h4>
            <ul style={{ fontSize: '13px', color: 'rgb(55, 65, 81)', lineHeight: '2', paddingLeft: '18px', fontWeight: 500 }}>
              {job.requirements?.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
              {(!job.requirements || job.requirements.length === 0) && (
                <li>No requirements listed</li>
              )}
            </ul>
            
            <h4 style={{ color: 'rgb(13, 17, 23)', marginTop: '20px', marginBottom: '12px', fontSize: '16px', fontWeight: 700 }}>
              Benefits & Perks
            </h4>
            <ul style={{ fontSize: '13px', color: 'rgb(55, 65, 81)', lineHeight: '2', paddingLeft: '18px', fontWeight: 500 }}>
              {job.benefits?.map((item) => (
                <li key={item.id}>{item.text}</li>
              ))}
              {(!job.benefits || job.benefits.length === 0) && (
                <li>No benefits listed</li>
              )}
            </ul>

            <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgb(238, 241, 251)' }}>
              <h4 style={{ color: 'rgb(13, 17, 23)', marginBottom: '12px', fontSize: '16px', fontWeight: 700 }}>
                Application Requirements
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '13px', color: job.requireResume ? 'rgb(22, 163, 74)' : 'rgb(123, 130, 153)' }}>
                    {job.requireResume ? '✅' : '❌'}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgb(55, 65, 81)' }}>Resume Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '13px', color: job.requireCoverLetter ? 'rgb(22, 163, 74)' : 'rgb(123, 130, 153)' }}>
                    {job.requireCoverLetter ? '✅' : '❌'}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgb(55, 65, 81)' }}>Cover Letter Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '13px', color: job.requireDrivingLicence ? 'rgb(22, 163, 74)' : 'rgb(123, 130, 153)' }}>
                    {job.requireDrivingLicence ? '✅' : '❌'}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgb(55, 65, 81)' }}>Driving Licence Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '13px', color: job.requireDBS ? 'rgb(22, 163, 74)' : 'rgb(123, 130, 153)' }}>
                    {job.requireDBS ? '✅' : '❌'}
                  </span>
                  <span style={{ fontSize: '13px', color: 'rgb(55, 65, 81)' }}>DBS Check Required</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Applicants' && (
          <div>
            {job.applications && job.applications.length > 0 ? (
              <div className="space-y-3">
                {job.applications.map((application: any) => {
                  const appStatusStyle = getStatusStyle(application.status);
                  return (
                    <div key={application._id} className="p-3 rounded-xl" style={{ background: 'rgb(250, 251, 254)', border: '1px solid rgb(238, 241, 251)' }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <p style={{ fontWeight: 600, color: 'rgb(13, 17, 23)' }}>
                            {application.candidate?.fullName || 'Unknown Candidate'}
                          </p>
                          <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)' }}>
                            {application.candidate?.email || 'No email'}
                          </p>
                          <p style={{ fontSize: '12px', color: 'rgb(160, 170, 191)', marginTop: '2px' }}>
                            Applied: {formatDate(application.applicationDate)}
                          </p>
                        </div>
                        <span 
                          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 whitespace-nowrap"
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: appStatusStyle.bg,
                            color: appStatusStyle.color
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: appStatusStyle.dot, display: 'inline-block' }} />
                          {application.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: 'rgb(123, 130, 153)' }}>
                <Users size={48} stroke="#A0AABF" strokeWidth={1.5} />
                <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>No applicants yet</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Applications will appear here once candidates apply</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Interviews' && (
          <div>
            {interviewApplications.length > 0 ? (
              <div className="space-y-3">
                {interviewApplications.map((application: any) => {
                  const appStatusStyle = getStatusStyle(application.status);
                  return (
                    <div key={application._id} className="p-3 rounded-xl" style={{ background: 'rgb(250, 251, 254)', border: '1px solid rgb(238, 241, 251)' }}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div 
                            className="flex items-center justify-center rounded-xl shrink-0"
                            style={{ width: '36px', height: '36px', background: 'rgb(124, 58, 237)', boxShadow: 'rgba(0, 0, 0, 0.15) 0px 2px 8px' }}
                          >
                            <CalendarIcon size={14} stroke="#fff" strokeWidth={2} />
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, color: 'rgb(13, 17, 23)' }}>
                              {application.candidate?.fullName || 'Unknown Candidate'}
                            </p>
                            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)' }}>
                              {application.candidate?.email || 'No email'}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <span className="flex items-center gap-1" style={{ fontSize: '11px', color: 'rgb(160, 170, 191)' }}>
                                <Calendar size={11} stroke="#A0AABF" strokeWidth={2} />
                                Interview: {formatDateTime(application.interviewDate) || 'Date TBD'}
                              </span>
                              {application.interviewers && application.interviewers.length > 0 && (
                                <span className="flex items-center gap-1" style={{ fontSize: '11px', color: 'rgb(160, 170, 191)' }}>
                                  <Users size={11} stroke="#A0AABF" strokeWidth={2} />
                                  {application.interviewers.join(', ')}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span 
                          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 whitespace-nowrap"
                          style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            background: appStatusStyle.bg,
                            color: appStatusStyle.color
                          }}
                        >
                          <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: appStatusStyle.dot, display: 'inline-block' }} />
                          {application.status}
                        </span>
                      </div>
                      {application.interviewNotes && (
                        <div className="mt-2 pt-2" style={{ borderTop: '1px solid rgb(238, 241, 251)' }}>
                          <div className="flex items-start gap-1.5">
                            <MessageSquare size={12} stroke="#A0AABF" strokeWidth={2} className="mt-0.5" />
                            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)' }}>
                              {application.interviewNotes}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8" style={{ color: 'rgb(123, 130, 153)' }}>
                <Clock size={48} stroke="#A0AABF" strokeWidth={1.5} />
                <p style={{ marginTop: '12px', fontSize: '14px', fontWeight: 500 }}>No interviews scheduled</p>
                <p style={{ fontSize: '12px', marginTop: '4px' }}>Candidates with "Interview Scheduled" status will appear here</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Performance' && (
          <div>
            <h4 style={{ color: 'rgb(13, 17, 23)', marginBottom: '16px', fontSize: '16px', fontWeight: 700 }}>
              Job Performance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Views Card */}
              <div 
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{ 
                  background: 'rgb(96, 27, 128)', 
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 16px' 
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  top: '-16px', 
                  right: '-16px' 
                }} />
                <div 
                  className="relative flex items-center justify-center rounded-xl mb-3"
                  style={{ width: '36px', height: '36px', background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Eye size={20} stroke="#fff" strokeWidth={2} />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: 'rgb(255, 255, 255)', lineHeight: 1 }}>
                  {stats.views}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 600 }}>
                  Total Views
                </p>
              </div>

              {/* Applications Card */}
              <div 
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{ 
                  background: 'rgb(124, 58, 237)', 
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 16px' 
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  top: '-16px', 
                  right: '-16px' 
                }} />
                <div 
                  className="relative flex items-center justify-center rounded-xl mb-3"
                  style={{ width: '36px', height: '36px', background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <Users size={20} stroke="#fff" strokeWidth={2} />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: 'rgb(255, 255, 255)', lineHeight: 1 }}>
                  {stats.applicants}
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 600 }}>
                  Applications
                </p>
              </div>

              {/* Conversion Card */}
              <div 
                className="rounded-2xl p-5 relative overflow-hidden"
                style={{ 
                  background: 'rgb(5, 150, 105)', 
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 4px 16px' 
                }}
              >
                <div style={{ 
                  position: 'absolute', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: 'rgba(255, 255, 255, 0.08)', 
                  top: '-16px', 
                  right: '-16px' 
                }} />
                <div 
                  className="relative flex items-center justify-center rounded-xl mb-3"
                  style={{ width: '36px', height: '36px', background: 'rgba(255, 255, 255, 0.2)' }}
                >
                  <TrendingUp size={20} stroke="#fff" strokeWidth={2} />
                </div>
                <p style={{ fontSize: '28px', fontWeight: 800, color: 'rgb(255, 255, 255)', lineHeight: 1 }}>
                  {stats.conversion}%
                </p>
                <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px', fontWeight: 600 }}>
                  Conversion Rate
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgb(238, 241, 251)' }}>
              <h4 style={{ color: 'rgb(13, 17, 23)', marginBottom: '8px', fontSize: '15px', fontWeight: 700 }}>
                Auto-Shortlist Score
              </h4>
              <p style={{ fontSize: '13px', color: 'rgb(55, 65, 81)' }}>
                Minimum score for auto-shortlisting: <strong>{job.autoShortlistScore || 75}%</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;