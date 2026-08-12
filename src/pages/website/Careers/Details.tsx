// pages/admin/Details.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ApplyModal from './ApplyModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface JobDetails {
  _id: string;
  jobTitle: string;
  availability: string;
  experience: string;
  contractType: string;
  locations: string[];
  salaryMin: string;
  salaryMax: string;
  status: string;
  deadline: string;
  notes: string;
  overview: string;
  responsibilities: { id: string; text: string }[];
  requirements: { id: string; text: string }[];
  benefits: { id: string; text: string }[];
  department?: string;
  jobType?: string;
  isRemote?: boolean;
  createdAt: string;
  updatedAt: string;
}

const Details: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
    const { jobId } = useParams<{ jobId: string }>();

  // Fetch job details
  const fetchJobDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${API_URL}/api/admin/job/${id}`);

      if (response.data.success) {
        setJob(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching job details:', error);
      toast.error(error.response?.data?.message || 'Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'Open': '#22c55e',
      'Active': '#22c55e',
      'Draft': '#ca8a04',
      'Closed': '#dc2626',
      'Paused': '#6b7280',
      'Archived': '#6b7280'
    };
    return colors[status] || '#22c55e';
  };

  // Handle Apply Now click
  const handleApplyNow = (e: React.MouseEvent) => {
   // Navigate to the apply page
    navigate(`/apply/${ id }`);
  };

  if (loading) {
    return (
      <div className="details-loading">
        <div className="details-loading__spinner"></div>
        <p>Loading job details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="details-error">
        <h2>Job Not Found</h2>
        <p>The job you are looking for does not exist.</p>
        <button onClick={() => navigate('/admin/jobs')} className="btn btn-navy">
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="details-container">
      {/* ===== BANNER ===== */}
      <section className="job-banner">
        <div className="scroll-indicator">
          <span>Scroll down</span>
          <span className="arrow">&darr;</span>
        </div>

        <div className="banner-left">
          <div className="title-row">
            <h1>{job.jobTitle}</h1>
            <span 
              className="status-pill"
              style={{ 
                background: `${getStatusColor(job.status)}20`,
                borderColor: getStatusColor(job.status),
                color: getStatusColor(job.status)
              }}
            >
              {job.status}
            </span>
          </div>
          <p className="posted-date">Posted on {formatDate(job.createdAt)}</p>
          <div className="meta-row">
            <span className="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
              {job.isRemote ? 'Remote' : job.locations?.join(', ') || 'Various locations'}
            </span>
            <span className="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
              {job.contractType || 'Full-time'}
            </span>
            <span className="meta-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
              {job.experience || '3+ years'}
            </span>
          </div>
        </div>

        <div className="banner-right">
          <a 
            href="#" 
            className="btn btn-white"
            onClick={handleApplyNow}
          >
            Apply Now
          </a>
          <a href="#" className="btn btn-outline-white">Schedule a Capacity Presentation</a>
        </div>
      </section>

      {/* ===== CONTENT ===== */}
      <div className="content-wrap">
        {/* LEFT COLUMN */}
        <div>
          <div className="card_detail">
            <h2>Job Description</h2>
            <p>{job.overview || job.notes || 'No description available for this position.'}</p>
          </div>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="card_detail">
              <h2>Key Responsibilities</h2>
              <ul className="check-list">
                {job.responsibilities.map((item) => (
                  <li key={item.id}>
                    <span className="check-icon">✓</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <div className="card_detail">
              <h2>Requirements &amp; Qualifications</h2>
              <ul className="check-list">
                {job.requirements.map((item) => (
                  <li key={item.id}>
                    <span className="check-icon">✓</span>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="card_detail skills-card">
              <h2>Preferred Skills</h2>
              <div className="skills-grid">
                {job.benefits.map((item) => (
                  <div key={item.id} className="skill-box">
                    <span className="check-icon">★</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN / SIDEBAR */}
        <aside className="sidebar">
          <h2>Position Details</h2>

          <div className="detail-row">
            <div className="icon-badge" style={{ background: 'var(--purple-tint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                <rect x="3" y="8" width="18" height="12" rx="2" />
                <path d="M3 12h18" />
                <path d="M12 8V6a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
                <path d="M8 8V6a2 2 0 0 1 2-2h0" />
              </svg>
            </div>
            <div>
              <div className="detail-label">Contract Type</div>
              <div className="detail-value">{job.contractType || 'Full-time'}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="icon-badge" style={{ background: 'var(--blue-tint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 3" />
              </svg>
            </div>
            <div>
              <div className="detail-label">Experience</div>
              <div className="detail-value">{job.experience || '3+ years'}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="icon-badge" style={{ background: 'var(--green-tint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
                <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <div>
              <div className="detail-label">Location</div>
              <div className="detail-value">
                {job.isRemote ? 'Remote' : job.locations?.join(', ') || 'Various locations'}
              </div>
            </div>
          </div>

          <div className="detail-row">
            <div className="icon-badge" style={{ background: 'var(--yellow-tint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 12h6M12 9v6" />
              </svg>
            </div>
            <div>
              <div className="detail-label">Salary Range</div>
              <div className="detail-value">£{job.salaryMin} - £{job.salaryMax}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="icon-badge" style={{ background: 'var(--red-tint)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 3v4" />
                <path d="M16 3v4" />
              </svg>
            </div>
            <div>
              <div className="detail-label">Deadline</div>
              <div className="detail-value">{job.deadline ? formatDate(job.deadline) : 'Not specified'}</div>
            </div>
          </div>

          <div className="sidebar-buttons">
            <a 
              href="#" 
              className="btn btn-navy"
              onClick={handleApplyNow}
            >
              Apply for this Position
            </a>
            <a href="#" className="btn btn-outline-navy">Save Job</a>
          </div>
        </aside>
      </div>

      {/* Apply Modal - Pass job details */}
      <ApplyModal 
        candidate={null}
        jobDetails={job}
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onApplySuccess={() => {
          toast.success('Application submitted successfully!');
          setShowApplyModal(false);
        }}
      />
    </div>
  );
};

export default Details;