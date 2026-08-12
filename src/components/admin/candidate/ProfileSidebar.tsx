// components/admin/candidate/ProfileSidebar.tsx
import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Mail,
  Phone,
  Hash,
  Lock,
  Eye,
  FileText,
  MessageSquare,
  CircleX,
  ArrowRight,
  CircleCheckBig,
  Briefcase,
  Award,
  Shield,
  FileCheck,
  CalendarDays,
  User,
  Clock,
  CheckCircle,
  Calendar,
  Loader2,
  Download,
  ExternalLink,
  Star,
  TrendingUp,
  Users,
  Building,
  Send,
  AlertCircle,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Car,
  CalendarPlus,
  FileWarning,
  UserX,
  Video
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Document {
  id: string;
  name: string;
  uploaded: string;
  type: 'pdf' | 'doc' | 'docx' | 'jpg' | 'png';
  url: string;
  size?: string;
}

interface Application {
  _id: string;
  jobId: string;
  jobTitle: string;
  coverLetterText: string;
  additionalNotes?: string;
  availableFrom: string;
  expectedSalary: string;
  noticePeriod?: string;
  referencesText?: string;
  status: string;
  appliedDate: string;
  createdAt: string;
}

interface ProfileSidebarProps {
  candidate: any;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdate?: () => void;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({ 
  candidate, 
  isOpen, 
  onClose,
  onStatusUpdate 
}) => {
  const [activeTab, setActiveTab] = useState('Personal Info');
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showStandbyModal, setShowStandbyModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRequestDocumentsModal, setShowRequestDocumentsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [messageText, setMessageText] = useState('');
  const [standbyReason, setStandbyReason] = useState('');
  const [messageSending, setMessageSending] = useState(false);
  
  // Interview form state
  const [interviewData, setInterviewData] = useState({
    date: '',
    time: '',
    interviewer: '',
    format: 'Video Call (Teams)'
  });
  
  // Document request state
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [documentNote, setDocumentNote] = useState('');
  
  // Rejection state
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionNotes, setRejectionNotes] = useState('');
  
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    education: true,
    experience: true,
    training: true,
    registrations: true
  });

  const documentOptions = [
    'CV / Resume',
    'Right to Work',
    'DBS Certificate',
    'References',
    'Qualification Certificates',
    'Proof of Address',
    'National Insurance Number',
    'Employment History'
  ];

  const rejectionOptions = [
    'Not enough experience',
    'Salary expectations too high',
    'Failed skills assessment',
    'Cultural fit concerns',
    'Position filled internally',
    'Other'
  ];

  const interviewerOptions = ['Sophie Laurent', 'Raj Mehta', 'Claire Foster', 'Emma Walsh', 'Daniel Ross'];
  const interviewFormats = ['Video Call (Teams)', 'In-Person', 'Phone Call'];

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Profile tabs
  const profileTabs = [
    'Personal Info',
    'Role & Availability',
    'Qualifications',
    'Compliance',
    'Assessment',
    'Timeline'
  ];

  // Fetch applications and documents when candidate changes
  useEffect(() => {
    if (candidate && isOpen) {
      fetchCandidateData();
    }
  }, [candidate, isOpen]);

  const fetchCandidateData = async () => {
    if (!candidate) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to view candidate data');
        return;
      }

      // Fetch applications for this candidate
      const appsResponse = await axios.get(
        `${API_URL}/api/admin/candidate/${candidate._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (appsResponse.data.success) {
        setApplications(appsResponse.data.data || []);
      }

      // Build documents from candidate data
      const docs: Document[] = [];
      
      const getFileName = (url: string) => {
        if (!url) return 'Document';
        const parts = url.split('/');
        return parts[parts.length - 1] || 'Document';
      };

      const getFileType = (url: string): 'pdf' | 'doc' | 'docx' | 'jpg' | 'png' => {
        if (!url) return 'pdf';
        const ext = url.split('.').pop()?.toLowerCase() || 'pdf';
        if (['pdf', 'doc', 'docx', 'jpg', 'png'].includes(ext)) {
          return ext as 'pdf' | 'doc' | 'docx' | 'jpg' | 'png';
        }
        return 'pdf';
      };

      const formatDate = (date: string) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      };

      if (candidate.resumeUrl) {
        docs.push({
          id: 'resume',
          name: `Resume - ${getFileName(candidate.resumeUrl)}`,
          uploaded: formatDate(candidate.createdAt || candidate.appliedDate),
          type: getFileType(candidate.resumeUrl),
          url: candidate.resumeUrl
        });
      }

      if (candidate.coverLetterUrl) {
        docs.push({
          id: 'cover-letter',
          name: `Cover Letter - ${getFileName(candidate.coverLetterUrl)}`,
          uploaded: formatDate(candidate.createdAt || candidate.appliedDate),
          type: getFileType(candidate.coverLetterUrl),
          url: candidate.coverLetterUrl
        });
      }

      if (candidate.documents && Array.isArray(candidate.documents)) {
        candidate.documents.forEach((docUrl: string, index: number) => {
          if (docUrl) {
            docs.push({
              id: `doc-${index}`,
              name: `Document ${index + 1} - ${getFileName(docUrl)}`,
              uploaded: formatDate(candidate.createdAt || candidate.appliedDate),
              type: getFileType(docUrl),
              url: docUrl
            });
          }
        });
      }

      if (candidate.drivingLicenceUrl) {
        docs.push({
          id: 'driving-licence',
          name: `Driving Licence - ${getFileName(candidate.drivingLicenceUrl)}`,
          uploaded: formatDate(candidate.createdAt || candidate.appliedDate),
          type: getFileType(candidate.drivingLicenceUrl),
          url: candidate.drivingLicenceUrl
        });
      }

      if (candidate.dbsCertificateUrl) {
        docs.push({
          id: 'dbs-certificate',
          name: `DBS Certificate - ${getFileName(candidate.dbsCertificateUrl)}`,
          uploaded: formatDate(candidate.createdAt || candidate.appliedDate),
          type: getFileType(candidate.dbsCertificateUrl),
          url: candidate.dbsCertificateUrl
        });
      }

      if (candidate.referencesUrl) {
        docs.push({
          id: 'references',
          name: `References - ${getFileName(candidate.referencesUrl)}`,
          uploaded: formatDate(candidate.createdAt || candidate.appliedDate),
          type: getFileType(candidate.referencesUrl),
          url: candidate.referencesUrl
        });
      }

      if (candidate.training && Array.isArray(candidate.training)) {
        candidate.training.forEach((training: any, index: number) => {
          if (training.certificate) {
            docs.push({
              id: `training-${index}`,
              name: `Training Certificate - ${training.name || `Training ${index + 1}`}`,
              uploaded: training.dateCompleted ? formatDate(training.dateCompleted) : formatDate(candidate.createdAt || candidate.appliedDate),
              type: getFileType(training.certificate),
              url: training.certificate
            });
          }
        });
      }

      setDocuments(docs);

    } catch (error: any) {
      console.error('Error fetching candidate data:', error);
      toast.error(error.response?.data?.message || 'Failed to load candidate data');
    } finally {
      setLoading(false);
    }
  };

  // Update candidate status
  const updateCandidateStatus = async (status: string) => {
    if (!candidate) return;
    
    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to update status');
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/admin/candidate/${candidate._id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Status updated to "${status}"`);
        setShowStatusModal(false);
        onStatusUpdate?.();
        await fetchCandidateData();
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  // Send message to candidate
  const sendMessage = async () => {
    if (!messageText.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      setMessageSending(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to send message');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/admin/candidates/message`,
        { 
          message: messageText,
          subject: `Message regarding your application`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Message sent successfully!');
        setShowMessageModal(false);
        setMessageText('');
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setMessageSending(false);
    }
  };

  // Move to standby
  const moveToStandby = async () => {
    if (!standbyReason.trim()) {
      toast.error('Please provide a reason for moving to standby');
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to update status');
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/admin/candidate/status`,
        { 
          status: 'Standby',
          notes: standbyReason
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Candidate moved to standby`);
        setShowStandbyModal(false);
        setStandbyReason('');
        onStatusUpdate?.();
        await fetchCandidateData();
      }
    } catch (error: any) {
      console.error('Error moving to standby:', error);
      toast.error(error.response?.data?.message || 'Failed to move to standby');
    } finally {
      setUpdating(false);
    }
  };

  // Schedule Interview
  const handleScheduleInterview = async () => {
    if (!interviewData.date || !interviewData.time || !interviewData.interviewer) {
      toast.error('Please fill in all interview details');
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to schedule interview');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/admin/candidate/${candidate._id}/schedule-interview`,
        {
          ...interviewData,
          candidateName: fullName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Interview scheduled successfully!');
        setShowInterviewModal(false);
        setInterviewData({ date: '', time: '', interviewer: '', format: 'Video Call (Teams)' });
        onStatusUpdate?.();
        await fetchCandidateData();
      }
    } catch (error: any) {
      console.error('Error scheduling interview:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule interview');
    } finally {
      setUpdating(false);
    }
  };

  // Send Document Request
  const handleSendDocumentRequest = async () => {
    if (selectedDocuments.length === 0) {
      toast.error('Please select at least one document to request');
      return;
    }

    try {
      setMessageSending(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to send request');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/admin/candidates/document-request`,
        {
          candidateId: candidate._id,
          documents: selectedDocuments,
          note: documentNote,
          candidateName: fullName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Document request sent successfully!');
        setShowRequestDocumentsModal(false);
        setSelectedDocuments([]);
        setDocumentNote('');
        onStatusUpdate?.();
        await fetchCandidateData();
      }
    } catch (error: any) {
      console.error('Error sending document request:', error);
      toast.error(error.response?.data?.message || 'Failed to send document request');
    } finally {
      setMessageSending(false);
    }
  };

  // Confirm Rejection
  const handleConfirmRejection = async () => {
    if (!rejectionReason) {
      toast.error('Please select a reason for rejection');
      return;
    }

    try {
      setUpdating(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to confirm rejection');
        return;
      }

      const response = await axios.patch(
        `${API_URL}/api/admin/candidate/${candidate._id}/status`,
        {
          status: 'Rejected',
          rejectionReason,
          rejectionNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Candidate rejected successfully');
        setShowRejectModal(false);
        setRejectionReason('');
        setRejectionNotes('');
        onStatusUpdate?.();
        await fetchCandidateData();
      }
    } catch (error: any) {
      console.error('Error rejecting candidate:', error);
      toast.error(error.response?.data?.message || 'Failed to reject candidate');
    } finally {
      setUpdating(false);
    }
  };

  // Toggle document selection
  const toggleDocument = (doc: string) => {
    setSelectedDocuments(prev =>
      prev.includes(doc)
        ? prev.filter(d => d !== doc)
        : [...prev, doc]
    );
  };

  // Toggle rejection reason
  const selectRejectionReason = (reason: string) => {
    setRejectionReason(reason);
  };

  // Get status style
  const getStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string; dot: string }> = {
      'Active': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'Pending': { bg: 'rgb(239, 246, 255)', color: 'rgb(37, 99, 235)', dot: 'rgb(37, 99, 235)' },
      'In Review': { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)', dot: 'rgb(202, 138, 4)' },
      'Interview Scheduled': { bg: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)', dot: 'rgb(124, 58, 237)' },
      'Offer Sent': { bg: 'rgb(255, 247, 237)', color: 'rgb(234, 88, 12)', dot: 'rgb(234, 88, 12)' },
      'Hired': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)', dot: 'rgb(22, 163, 74)' },
      'Rejected': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', dot: 'rgb(220, 38, 38)' },
      'Standby': { bg: 'rgb(255, 251, 235)', color: 'rgb(180, 83, 9)', dot: 'rgb(180, 83, 9)' }
    };
    return styles[status] || styles['Active'];
  };

  // Get application status style
  const getAppStatusStyle = (status: string) => {
    const styles: Record<string, { bg: string; color: string }> = {
      'Pending': { bg: 'rgb(243, 244, 246)', color: 'rgb(107, 114, 128)' },
      'In Review': { bg: 'rgb(255, 251, 235)', color: 'rgb(202, 138, 4)' },
      'Interview Scheduled': { bg: 'rgb(245, 243, 255)', color: 'rgb(124, 58, 237)' },
      'Offer Sent': { bg: 'rgb(255, 247, 237)', color: 'rgb(234, 88, 12)' },
      'Hired': { bg: 'rgb(240, 253, 244)', color: 'rgb(22, 163, 74)' },
      'Rejected': { bg: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)' }
    };
    return styles[status] || styles['Pending'];
  };

  // Get initials
  const getInitials = (firstName: string, lastName: string) => {
    if (!firstName && !lastName) return '??';
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '??';
  };

  // Get color
  const getColor = (name: string) => {
    const colors = ['#0F4C81', '#27B3C9', '#7C3AED', '#059669', '#D97706', '#DC2626', '#2563EB', '#0891B2'];
    if (!name) return colors[0];
    const index = (name.length || 0) % colors.length;
    return colors[index];
  };

  // Get file icon based on type
  const getFileIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText size={14} stroke="#0F4C81" strokeWidth={2} />;
      case 'doc': 
      case 'docx': return <FileText size={14} stroke="#0F4C81" strokeWidth={2} />;
      case 'jpg': 
      case 'png': return <FileText size={14} stroke="#0F4C81" strokeWidth={2} />;
      default: return <FileText size={14} stroke="#0F4C81" strokeWidth={2} />;
    }
  };

  if (!candidate || !isOpen) return null;

  const statusStyle = getStatusStyle(candidate.status);
  const fullName = candidate.fullName || `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() || 'Candidate';
  const firstName = candidate.firstName || '';
  const lastName = candidate.lastName || '';
  const initials = candidate.initials || getInitials(firstName, lastName);
  const color = candidate.color || getColor(fullName);
  const role = candidate.positionAppliedFor || candidate.role || 'N/A';
  const location = candidate.preferredLocations?.[0] || candidate.location || 'N/A';
  const availability = candidate.workPreference || candidate.availability || 'N/A';
  const email = candidate.email || 'N/A';
  const phone = candidate.phone || 'N/A';
  const statusOptions = ['Active', 'In Review', 'Interview Scheduled', 'Offer Sent', 'Hired', 'Rejected'];

  // --- Modals ---

  // 1. Status Modal
  const StatusModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', background: 'rgb(96, 27, 128)' }}>
            <CircleCheckBig size={18} stroke="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'rgb(13, 17, 23)', fontSize: '16px' }}>Update Status</h3>
            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)', marginTop: '2px' }}>
              for {fullName} — {role}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`w-full text-left px-4 py-3 rounded-xl transition ${
                selectedStatus === status ? 'ring-2 ring-purple-600' : ''
              }`}
              style={{
                background: selectedStatus === status ? 'rgb(245, 243, 255)' : 'rgb(248, 250, 252)',
                border: '1px solid rgb(228, 233, 244)',
                cursor: 'pointer'
              }}
            >
              <span className="flex items-center gap-3">
                <span 
                  className="w-2 h-2 rounded-full"
                  style={{ background: getStatusStyle(status).color }}
                />
                <span className="font-medium" style={{ color: '#0f172a' }}>{status}</span>
              </span>
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowStatusModal(false)}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => selectedStatus && updateCandidateStatus(selectedStatus)}
            disabled={!selectedStatus || updating}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              background: !selectedStatus || updating ? 'rgb(228, 233, 244)' : 'rgb(96, 27, 128)',
              color: !selectedStatus || updating ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: !selectedStatus || updating ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {updating ? 'Updating...' : 'Update Status'}
          </button>
        </div>
      </div>
    </div>
  );

  // 2. Message Modal
  const MessageModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', background: 'rgb(96, 27, 128)' }}>
            <MessageSquare size={18} stroke="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'rgb(13, 17, 23)', fontSize: '16px' }}>Send Message</h3>
            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)', marginTop: '2px' }}>
              to {fullName}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#0f172a' }}>
            Message
          </label>
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            rows={5}
            className="w-full rounded-xl px-3 py-2.5"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', resize: 'none', fontFamily: 'Manrope, sans-serif' }}
            placeholder="Type your message here..."
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowMessageModal(false)}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
          >
            Cancel
          </button>
          <button
            onClick={sendMessage}
            disabled={!messageText.trim() || messageSending}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              background: !messageText.trim() || messageSending ? 'rgb(228, 233, 244)' : 'rgb(96, 27, 128)',
              color: !messageText.trim() || messageSending ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: !messageText.trim() || messageSending ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {messageSending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );

  // 3. Standby Modal
  const StandbyModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', background: 'rgb(180, 83, 9)' }}>
            <Clock size={18} stroke="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'rgb(13, 17, 23)', fontSize: '16px' }}>Move to Standby</h3>
            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)', marginTop: '2px' }}>
              for {fullName}
            </p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Move <strong>{fullName}</strong> to standby status. Please provide a reason.
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#0f172a' }}>
            Reason for Standby
          </label>
          <textarea
            value={standbyReason}
            onChange={(e) => setStandbyReason(e.target.value)}
            rows={3}
            className="w-full rounded-xl px-3 py-2.5"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', resize: 'none', fontFamily: 'Manrope, sans-serif' }}
            placeholder="e.g., Candidate requested more time, Awaiting additional documents, etc."
          />
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowStandbyModal(false)}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
          >
            Cancel
          </button>
          <button
            onClick={moveToStandby}
            disabled={!standbyReason.trim() || updating}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              background: !standbyReason.trim() || updating ? 'rgb(228, 233, 244)' : 'rgb(180, 83, 9)',
              color: !standbyReason.trim() || updating ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: !standbyReason.trim() || updating ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {updating ? 'Moving...' : 'Move to Standby'}
          </button>
        </div>
      </div>
    </div>
  );

  // 4. Schedule Interview Modal
  const InterviewModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', background: 'rgb(5, 150, 105)' }}>
            <CalendarPlus size={18} stroke="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'rgb(13, 17, 23)', fontSize: '16px' }}>Schedule Interview</h3>
            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)', marginTop: '2px' }}>
              for {fullName} — {role}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interview Date
            </label>
            <input
              type="date"
              value={interviewData.date}
              onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interview Time
            </label>
            <input
              type="time"
              value={interviewData.time}
              onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interviewer
            </label>
            <select
              value={interviewData.interviewer}
              onChange={(e) => setInterviewData({ ...interviewData, interviewer: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif' }}
            >
              <option value="">Select interviewer...</option>
              {interviewerOptions.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Interview Format
            </label>
            <select
              value={interviewData.format}
              onChange={(e) => setInterviewData({ ...interviewData, format: e.target.value })}
              className="w-full rounded-xl px-3 py-2.5"
              style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', fontFamily: 'Manrope, sans-serif' }}
            >
              {interviewFormats.map((format) => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setShowInterviewModal(false)}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleScheduleInterview}
            disabled={updating}
            className="flex-1 py-2.5 rounded-xl"
            style={{ background: updating ? 'rgb(228, 233, 244)' : 'rgb(5, 150, 105)', color: updating ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)', fontSize: '13px', fontWeight: 700, cursor: updating ? 'not-allowed' : 'pointer', border: 'none', boxShadow: 'none' }}
          >
            {updating ? 'Scheduling...' : 'Confirm & Schedule'}
          </button>
        </div>
      </div>
    </div>
  );

  // 5. Request Documents Modal
  const RequestDocumentsModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', background: 'rgb(96, 27, 128)' }}>
            <FileWarning size={18} stroke="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'rgb(13, 17, 23)', fontSize: '16px' }}>Request Documents</h3>
            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)', marginTop: '2px' }}>
              Select documents needed from {fullName}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Documents Required
          </label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {documentOptions.map((doc) => (
              <button
                key={doc}
                onClick={() => toggleDocument(doc)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left"
                style={{
                  border: '1.5px solid rgb(228, 233, 244)',
                  background: selectedDocuments.includes(doc) ? 'rgb(245, 243, 255)' : 'rgb(248, 249, 254)',
                  cursor: 'pointer',
                  transition: '0.12s'
                }}
              >
                <span style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '5px',
                  border: selectedDocuments.includes(doc) ? '2px solid rgb(96, 27, 128)' : '2px solid rgb(203, 213, 225)',
                  background: selectedDocuments.includes(doc) ? 'rgb(96, 27, 128)' : 'rgb(255, 255, 255)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: '0.12s'
                }}>
                  {selectedDocuments.includes(doc) && (
                    <CheckCircle size={12} stroke="#fff" strokeWidth={2} />
                  )}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgb(55, 65, 81)' }}>{doc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Note to Candidate
          </label>
          <textarea
            rows={3}
            value={documentNote}
            onChange={(e) => setDocumentNote(e.target.value)}
            placeholder="Add a message explaining why these documents are needed…"
            className="w-full rounded-xl px-3 py-2.5"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', resize: 'none', fontFamily: 'Manrope, sans-serif' }}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowRequestDocumentsModal(false)}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSendDocumentRequest}
            disabled={selectedDocuments.length === 0 || messageSending}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              background: selectedDocuments.length === 0 || messageSending ? 'rgb(228, 233, 244)' : 'rgb(96, 27, 128)',
              color: selectedDocuments.length === 0 || messageSending ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: selectedDocuments.length === 0 || messageSending ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {messageSending ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </div>
    </div>
  );

  // 6. Reject Candidate Modal
  const RejectModal = () => (
    <div className="fixed inset-0 flex items-center justify-center z-[70]" style={{ background: 'rgba(13, 17, 23, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="rounded-2xl p-6 w-full max-w-md" style={{ background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.2) 0px 20px 60px' }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center justify-center rounded-xl" style={{ width: '42px', height: '42px', background: 'rgb(220, 38, 38)' }}>
            <UserX size={18} stroke="#fff" strokeWidth={2} />
          </div>
          <div>
            <h3 style={{ margin: 0, color: 'rgb(13, 17, 23)', fontSize: '16px' }}>Reject Candidate</h3>
            <p style={{ fontSize: '12px', color: 'rgb(123, 130, 153)', marginTop: '2px' }}>
              Please provide a reason for rejecting {fullName}
            </p>
          </div>
        </div>

        <div className="mb-3">
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Reason for Rejection
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {rejectionOptions.map((reason) => (
              <button
                key={reason}
                onClick={() => selectRejectionReason(reason)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left"
                style={{
                  border: '1.5px solid rgb(228, 233, 244)',
                  background: rejectionReason === reason ? 'rgb(254, 242, 242)' : 'rgb(248, 249, 254)',
                  cursor: 'pointer',
                  transition: '0.12s'
                }}
              >
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: rejectionReason === reason ? '2px solid rgb(220, 38, 38)' : '2px solid rgb(203, 213, 225)',
                  background: rejectionReason === reason ? 'rgb(220, 38, 38)' : 'rgb(255, 255, 255)',
                  display: 'inline-block',
                  flexShrink: 0,
                  transition: '0.12s'
                }}>
                  {rejectionReason === reason && (
                    <CheckCircle size={10} stroke="#fff" strokeWidth={2} />
                  )}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 500, color: 'rgb(55, 65, 81)' }}>{reason}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-2">
          <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgb(123, 130, 153)', display: 'block', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Additional Notes
          </label>
          <textarea
            rows={3}
            value={rejectionNotes}
            onChange={(e) => setRejectionNotes(e.target.value)}
            placeholder="Add any additional context or feedback…"
            className="w-full rounded-xl px-3 py-2.5"
            style={{ border: '1.5px solid rgb(228, 233, 244)', background: 'rgb(248, 249, 254)', fontSize: '13px', color: 'rgb(13, 17, 23)', outline: 'none', resize: 'none', fontFamily: 'Manrope, sans-serif' }}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setShowRejectModal(false)}
            className="flex-1 py-2.5 rounded-xl"
            style={{ border: '1.5px solid rgb(228, 233, 244)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', color: 'rgb(123, 130, 153)', background: 'rgb(255, 255, 255)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmRejection}
            disabled={!rejectionReason || updating}
            className="flex-1 py-2.5 rounded-xl"
            style={{
              background: !rejectionReason || updating ? 'rgb(228, 233, 244)' : 'rgb(220, 38, 38)',
              color: !rejectionReason || updating ? 'rgb(160, 170, 191)' : 'rgb(255, 255, 255)',
              fontSize: '13px',
              fontWeight: 700,
              cursor: !rejectionReason || updating ? 'not-allowed' : 'pointer',
              border: 'none',
              boxShadow: 'none'
            }}
          >
            {updating ? 'Processing...' : 'Confirm Rejection'}
          </button>
        </div>
      </div>
    </div>
  );

  // --- Render Tabs ---

  // 1. Personal Info Tab
  const renderPersonalInfo = () => (
    <div>
      <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
        <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
        <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(15, 76, 129)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Personal Information
        </h4>
      </div>
      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '0px 24px' }}>
        <div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>First Name</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{firstName || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Last Name</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{lastName || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Email</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{email}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Phone</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{phone}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Date of Birth</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.dateOfBirth || candidate.dob || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Nationality</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.nationality || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Right to Work</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>
              <span className="rounded-full px-2 py-0.5" style={{ fontSize: '11px', fontWeight: 700, background: candidate.rightToWork ? 'rgb(240, 253, 244)' : 'rgb(254, 242, 242)', color: candidate.rightToWork ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)' }}>
                {candidate.rightToWork ? '✓ Yes' : '✗ No'}
              </span>
            </span>
          </div>
        </div>
        <div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Address Line 1</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.addressLine1 || candidate.address || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Address Line 2</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.addressLine2 || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Town / City</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.city || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>County</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.county || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Postcode</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>{candidate.postcode || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
            <span style={{ fontSize: '12px', color: 'rgb(100, 116, 139)', minWidth: '150px', flexShrink: 0 }}>Applied Date</span>
            <span style={{ fontSize: '13px', color: 'rgb(15, 23, 42)', fontWeight: 500 }}>
              {candidate.appliedDate ? new Date(candidate.appliedDate).toLocaleDateString() : 
               candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
          <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
          <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(15, 76, 129)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Application Documents ({documents.length})
          </h4>
        </div>
        {documents.length === 0 ? (
          <div className="text-center py-4" style={{ color: 'rgb(100, 116, 139)' }}>
            <p className="text-sm">No documents uploaded</p>
          </div>
        ) : (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-3 py-2.5" style={{ borderBottom: '1px solid rgb(226, 236, 246)' }}>
                <div className="flex items-center justify-center rounded-xl shrink-0" style={{ width: '34px', height: '34px', background: 'rgb(232, 241, 250)' }}>
                  {getFileIcon(doc.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(15, 23, 42)' }}>{doc.name}</p>
                  <p style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                    {doc.size ? `${doc.size} · ` : ''}Uploaded {doc.uploaded}
                  </p>
                </div>
                <a 
                  href={`${API_URL}${doc.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg transition-colors"
                  style={{ fontSize: '11px', fontWeight: 500, background: 'rgb(232, 241, 250)', color: 'rgb(15, 76, 129)', cursor: 'pointer', border: 'none', textDecoration: 'none' }}
                >
                  <Eye size={11} stroke="currentColor" strokeWidth={2} />
                  View
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // 2. Role & Availability Tab
  const renderRoleAvailability = () => (
    <div>
      <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
        <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
        <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(15, 76, 129)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Role & Availability
        </h4>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Briefcase size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Position Applied For</span>
          </div>
          <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>{role}</p>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Preferred Locations</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {candidate.preferredLocations && candidate.preferredLocations.length > 0 ? (
              candidate.preferredLocations.map((loc: string, index: number) => (
                <span key={index} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgb(232, 241, 250)', color: 'rgb(15, 76, 129)' }}>
                  {loc}
                </span>
              ))
            ) : (
              <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No locations specified</p>
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Work Preference</span>
          </div>
          <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>{candidate.workPreference || 'Not specified'}</p>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Availability</span>
          </div>
          <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>{availability}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Car size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Driving License</span>
            </div>
            <p className="text-sm" style={{ color: candidate.drivingLicense ? 'rgb(22, 163, 74)' : 'rgb(100, 116, 139)' }}>
              {candidate.drivingLicense ? '✓ Yes' : '✗ No'}
            </p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Car size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Own Vehicle</span>
            </div>
            <p className="text-sm" style={{ color: candidate.ownVehicle ? 'rgb(22, 163, 74)' : 'rgb(100, 116, 139)' }}>
              {candidate.ownVehicle ? '✓ Yes' : '✗ No'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Shift Confirmation</span>
          </div>
          <p className="text-sm" style={{ color: candidate.shiftConfirmation ? 'rgb(22, 163, 74)' : 'rgb(100, 116, 139)' }}>
            {candidate.shiftConfirmation ? '✓ Confirmed' : 'Not confirmed'}
          </p>
        </div>
      </div>
    </div>
  );

  // 3. Qualifications Tab
  const renderQualifications = () => {
    const educationList = Array.isArray(candidate.education) ? candidate.education : [];
    const experienceList = Array.isArray(candidate.experience) ? candidate.experience : [];
    const trainingList = Array.isArray(candidate.training) ? candidate.training : [];
    const registrationsList = Array.isArray(candidate.registrations) ? candidate.registrations : [];

    return (
      <div className="space-y-4">
        {/* Education */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <button
            onClick={() => toggleSection('education')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <GraduationCap size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                Education ({educationList.length})
              </span>
            </div>
            {expandedSections.education ? (
              <ChevronUp size={16} stroke="#64748b" />
            ) : (
              <ChevronDown size={16} stroke="#64748b" />
            )}
          </button>
          
          {expandedSections.education && (
            <div className="px-4 pb-4 space-y-3">
              {educationList.length === 0 ? (
                <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No education entries</p>
              ) : (
                educationList.map((edu: any, index: number) => (
                  <div key={edu.id || index} className="p-3 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                    <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                      {edu.qualification || 'Qualification'}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>
                      {edu.institution || 'Institution'}
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                      {edu.startDate || ''} {edu.endDate ? `- ${edu.endDate}` : ''}
                      {edu.grade && ` • Grade: ${edu.grade}`}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Experience */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <button
            onClick={() => toggleSection('experience')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Briefcase size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                Experience ({experienceList.length})
              </span>
            </div>
            {expandedSections.experience ? (
              <ChevronUp size={16} stroke="#64748b" />
            ) : (
              <ChevronDown size={16} stroke="#64748b" />
            )}
          </button>
          
          {expandedSections.experience && (
            <div className="px-4 pb-4 space-y-3">
              {experienceList.length === 0 ? (
                <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No experience entries</p>
              ) : (
                experienceList.map((exp: any, index: number) => (
                  <div key={exp.id || index} className="p-3 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                    <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                      {exp.position || 'Position'}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>
                      {exp.employer || 'Employer'}
                      {exp.current && <span className="ml-2 text-xs font-semibold" style={{ color: 'rgb(22, 163, 74)' }}>● Current</span>}
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                      {exp.startDate || ''} {exp.endDate ? `- ${exp.endDate}` : 'Present'}
                    </p>
                    {exp.responsibilities && (
                      <p className="text-xs mt-1" style={{ color: 'rgb(71, 85, 105)' }}>
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Training */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <button
            onClick={() => toggleSection('training')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                Training ({trainingList.length})
              </span>
            </div>
            {expandedSections.training ? (
              <ChevronUp size={16} stroke="#64748b" />
            ) : (
              <ChevronDown size={16} stroke="#64748b" />
            )}
          </button>
          
          {expandedSections.training && (
            <div className="px-4 pb-4 space-y-3">
              {trainingList.length === 0 ? (
                <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No training entries</p>
              ) : (
                trainingList.map((train: any, index: number) => (
                  <div key={train.id || index} className="p-3 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                    <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                      {train.name || 'Training'}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>
                      {train.provider || 'Provider'}
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                      Completed: {train.dateCompleted || ''}
                      {train.expiryDate && ` • Expires: ${train.expiryDate}`}
                    </p>
                    {train.certificate && (
                      <p className="text-xs mt-1" style={{ color: 'rgb(22, 163, 74)' }}>
                        ✓ Certificate uploaded
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Registrations */}
        <div className="rounded-xl overflow-hidden" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <button
            onClick={() => toggleSection('registrations')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Shield size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                Registrations ({registrationsList.length})
              </span>
            </div>
            {expandedSections.registrations ? (
              <ChevronUp size={16} stroke="#64748b" />
            ) : (
              <ChevronDown size={16} stroke="#64748b" />
            )}
          </button>
          
          {expandedSections.registrations && (
            <div className="px-4 pb-4 space-y-3">
              {registrationsList.length === 0 ? (
                <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No registrations</p>
              ) : (
                registrationsList.map((reg: any, index: number) => (
                  <div key={reg.id || index} className="p-3 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                    <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                      {reg.body || 'Registration Body'}
                    </p>
                    <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>
                      Number: {reg.number || 'N/A'}
                    </p>
                    <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                      Expires: {reg.expiryDate || 'N/A'}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // 4. Compliance Tab
  const renderCompliance = () => (
    <div>
      <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
        <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
        <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(15, 76, 129)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Compliance & References
        </h4>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Shield size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>DBS Valid</span>
          </div>
          <p className="text-sm" style={{ color: candidate.dbsValid ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)' }}>
            {candidate.dbsValid ? '✓ Yes' : '✗ No'}
          </p>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Disciplinary Action</span>
          </div>
          <p className="text-sm" style={{ color: candidate.disciplinaryAction ? 'rgb(220, 38, 38)' : 'rgb(22, 163, 74)' }}>
            {candidate.disciplinaryAction ? 'Yes' : 'No'}
          </p>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Lock size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Unspent Convictions</span>
          </div>
          <p className="text-sm" style={{ color: candidate.unspentConvictions ? 'rgb(220, 38, 38)' : 'rgb(22, 163, 74)' }}>
            {candidate.unspentConvictions ? 'Yes' : 'No'}
          </p>
        </div>

        {/* References */}
        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>References ({candidate.references?.length || 0})</span>
          </div>
          {candidate.references && candidate.references.length > 0 ? (
            candidate.references.map((ref: any, index: number) => (
              <div key={ref.id || index} className="mt-2 p-2 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                <p className="text-sm font-medium" style={{ color: '#0f172a' }}>{ref.fullName || 'N/A'}</p>
                <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                  {ref.company || ''} {ref.jobTitle ? `· ${ref.jobTitle}` : ''}
                </p>
                <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                  {ref.type || 'Professional'} · {ref.yearsKnown || 'N/A'} known
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No references provided</p>
          )}
        </div>

        {/* Documents URLs */}
        {(candidate.drivingLicenceUrl || candidate.dbsCertificateUrl || candidate.referencesUrl) && (
          <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Compliance Documents</span>
            </div>
            {candidate.drivingLicenceUrl && (
              <p className="text-xs mt-1" style={{ color: 'rgb(22, 163, 74)' }}>✓ Driving Licence uploaded</p>
            )}
            {candidate.dbsCertificateUrl && (
              <p className="text-xs mt-1" style={{ color: 'rgb(22, 163, 74)' }}>✓ DBS Certificate uploaded</p>
            )}
            {candidate.referencesUrl && (
              <p className="text-xs mt-1" style={{ color: 'rgb(22, 163, 74)' }}>✓ References document uploaded</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 5. Assessment Tab
  const renderAssessment = () => (
    <div>
      <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
        <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
        <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(15, 76, 129)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Values & Assessment
        </h4>
      </div>
      
      <div className="space-y-3">
        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <Users size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Heard From</span>
          </div>
          <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>{candidate.heardFrom || 'Not specified'}</p>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Supporting Statement</span>
          </div>
          <p className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>
            {candidate.supportingStatement || 'Not provided'}
          </p>
        </div>

        <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} stroke="#0F4C81" strokeWidth={2} />
            <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Scenario Answers</span>
          </div>
          {candidate.scenarioAnswers ? (
            <div className="space-y-2 mt-2">
              <div className="p-2 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                <p className="text-xs font-medium" style={{ color: '#0f172a' }}>Question 1</p>
                <p className="text-xs" style={{ color: 'rgb(71, 85, 105)' }}>{candidate.scenarioAnswers.q1 || 'Not answered'}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                <p className="text-xs font-medium" style={{ color: '#0f172a' }}>Question 2</p>
                <p className="text-xs" style={{ color: 'rgb(71, 85, 105)' }}>{candidate.scenarioAnswers.q2 || 'Not answered'}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'white', border: '1px solid rgb(226, 236, 246)' }}>
                <p className="text-xs font-medium" style={{ color: '#0f172a' }}>Question 3</p>
                <p className="text-xs" style={{ color: 'rgb(71, 85, 105)' }}>{candidate.scenarioAnswers.q3 || 'Not answered'}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'rgb(100, 116, 139)' }}>No answers provided</p>
          )}
        </div>

        {candidate.coreValues && candidate.coreValues.length > 0 && (
          <div className="p-4 rounded-xl" style={{ background: 'rgb(248, 250, 252)', border: '1px solid rgb(226, 236, 246)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Star size={16} stroke="#0F4C81" strokeWidth={2} />
              <span className="font-semibold text-sm" style={{ color: '#0f172a' }}>Core Values (Ranked)</span>
            </div>
            <div className="space-y-1">
              {candidate.coreValues.map((value: string, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs font-bold" style={{ color: '#0F4C81' }}>{index + 1}.</span>
                  <span className="text-sm" style={{ color: 'rgb(71, 85, 105)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // 6. Timeline Tab
  const renderTimeline = () => (
    <div>
      <div className="flex items-center gap-2 mb-3 mt-5 first:mt-0">
        <div className="w-0.5 h-4 rounded-full" style={{ background: 'rgb(39, 179, 201)' }} />
        <h4 style={{ fontSize: '12.5px', fontWeight: 700, color: 'rgb(15, 76, 129)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Application Timeline
        </h4>
      </div>
      
      <div className="space-y-4">
        {/* Applied */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full" style={{ background: '#7c3aed' }} />
            <div className="w-0.5 flex-1 mt-1" style={{ background: 'rgb(226, 236, 246)' }} />
          </div>
          <div className="pb-4">
            <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>Applied</p>
            <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
              {candidate.appliedDate || (candidate.createdAt ? new Date(candidate.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : 'N/A')}
            </p>
          </div>
        </div>
        
        {/* Status Changes from applications */}
        {applications.length > 0 && applications.map((app, index) => (
          <div key={app._id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 rounded-full" style={{ background: getAppStatusStyle(app.status).color }} />
              {index < applications.length - 1 && (
                <div className="w-0.5 flex-1 mt-1" style={{ background: 'rgb(226, 236, 246)' }} />
              )}
            </div>
            <div className={index < applications.length - 1 ? 'pb-4' : ''}>
              <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>
                {app.status}
              </p>
              <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
                {app.jobTitle} · {new Date(app.appliedDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {/* Current Status */}
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full" style={{ background: statusStyle.color }} />
          </div>
          <div>
            <p className="font-semibold text-sm" style={{ color: '#0f172a' }}>
              Current Status: {candidate.status}
            </p>
            <p className="text-xs" style={{ color: 'rgb(100, 116, 139)' }}>
              Last updated: {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              }) : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Main Return ---
  return (
    <>
      {/* Overlay */}
     <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        right: 0, 
        bottom: 0, 
        width: '660px', 
        zIndex: 50, 
        display: 'flex', 
        flexDirection: 'column', 
        background: 'rgb(247, 249, 252)', 
        boxShadow: 'rgba(0, 0, 0, 0.18) -8px 0px 40px', 
        overflowY: 'hidden' 
      }}>
        {/* Header */}
        <div style={{ background: 'rgb(255, 255, 255)', borderBottom: '1px solid rgb(226, 236, 246)', flexShrink: 0 }}>
          <div style={{ height: '5px', background: 'rgb(15, 76, 129)' }} />
          
          <div className="flex items-start gap-4 px-5 pt-4 pb-4">
            <div className="relative shrink-0">
              <div 
                className="flex items-center justify-center rounded-2xl"
                style={{ 
                  width: '60px', 
                  height: '60px', 
                  background: color, 
                  color: 'rgb(255, 255, 255)', 
                  fontSize: '20px', 
                  fontWeight: 800, 
                  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 4px 14px' 
                }}
              >
                {initials}
              </div>
              <div 
                className="absolute -bottom-1 -right-1 rounded-full"
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  background: candidate.status === 'Active' || candidate.status === 'Hired' ? 'rgb(16, 185, 129)' : 'rgb(202, 138, 4)',
                  border: '2px solid rgb(255, 255, 255)' 
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap mb-0.5">
                <h3 style={{ color: 'rgb(15, 76, 129)', margin: 0, fontSize: '17px' }}>
                  {fullName}
                </h3>
                <span 
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5"
                  style={{ fontSize: '11px', fontWeight: 700, background: statusStyle.bg, color: statusStyle.color }}
                >
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: statusStyle.dot, display: 'inline-block' }} />
                  {candidate.status}
                </span>
              </div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgb(71, 85, 105)', marginBottom: '6px' }}>
                {role}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="flex items-center gap-1" style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                  <MapPin size={10} stroke="#27B3C9" strokeWidth={2} />
                  {location}
                </span>
                <span className="flex items-center gap-1" style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                  <Mail size={10} stroke="#27B3C9" strokeWidth={2} />
                  {email}
                </span>
                <span className="flex items-center gap-1" style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                  <Phone size={10} stroke="#27B3C9" strokeWidth={2} />
                  {phone}
                </span>
                <span className="flex items-center gap-1" style={{ fontSize: '11px', color: 'rgb(100, 116, 139)' }}>
                  <Hash size={10} stroke="#27B3C9" strokeWidth={2} />
                  RMX-C{String(candidate._id || candidate.id || '').substring(0, 6)}-2026
                </span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="flex items-center justify-center rounded-xl"
              style={{ 
                width: '32px', 
                height: '32px', 
                background: 'rgb(241, 245, 249)', 
                border: 'none', 
                cursor: 'pointer', 
                flexShrink: 0 
              }}
            >
              <X size={15} stroke="#64748B" strokeWidth={2} />
            </button>
          </div>

          {/* Tags */}
          <div className="px-5 pb-3 flex items-center gap-2 flex-wrap">
            <span 
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ fontSize: '11px', fontWeight: 700, background: candidate.rightToWork ? 'rgb(240, 253, 244)' : 'rgb(254, 242, 242)', color: candidate.rightToWork ? 'rgb(22, 163, 74)' : 'rgb(220, 38, 38)', border: candidate.rightToWork ? '1px solid rgb(187, 247, 208)' : '1px solid rgb(254, 202, 202)' }}
            >
              <span style={{ fontSize: '13px' }}>{candidate.rightToWork ? '✓' : '✗'}</span> 
              Right to Work: {candidate.rightToWork ? 'Verified' : 'Not Verified'}
            </span>
            <span 
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ fontSize: '11px', fontWeight: 700, background: 'rgb(255, 251, 235)', color: 'rgb(180, 83, 9)', border: '1px solid rgb(253, 230, 138)' }}
            >
              <Lock size={12} stroke="#7C3AED" strokeWidth={2} />
              DBS Status: {candidate.dbsValid ? 'Valid' : 'Initiated'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="px-5 pb-2 flex items-center gap-2.5">
            <button 
              className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl"
              onClick={() => setShowInterviewModal(true)}
              style={{ background: 'rgb(5, 150, 105)', color: 'rgb(255, 255, 255)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: 'none', boxShadow: 'none' }}
            >
              <CircleCheckBig size={15} stroke="currentColor" strokeWidth={2} />
              Approve For Interview
            </button>
            <button 
              className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl"
              onClick={() => setShowRequestDocumentsModal(true)}
              style={{ background: 'rgb(232, 241, 250)', color: 'rgb(15, 76, 129)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgb(191, 219, 254)' }}
            >
              <MessageSquare size={15} stroke="currentColor" strokeWidth={2} />
              Request More Info
            </button>

                        <button 
              className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl"
              onClick={() => setShowRejectModal(true)}
              style={{ background: 'rgb(254, 242, 242)', color: 'rgb(220, 38, 38)', fontSize: '13px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgb(254, 202, 202)' }}
            >
              <CircleX size={15} stroke="currentColor" strokeWidth={2} />
              Reject
            </button>
          </div>

          {/* Second row of action buttons */}
          <div className="px-5 pb-2 flex items-center gap-2.5">

            <button 
              className="flex items-center gap-2 flex-1 justify-center py-2.5 rounded-xl"
              onClick={() => setShowStandbyModal(true)}
              style={{ background: 'rgb(255, 251, 235)', color: 'rgb(180, 83, 9)', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', border: '1.5px solid rgb(253, 230, 138)' }}
            >
              <ArrowRight size={14} stroke="currentColor" strokeWidth={2} />
              Move to Standby
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
            {/* Tabs */}
            <div className="flex overflow-x-auto shrink-0 px-5 pt-2" style={{ borderBottom: '2px solid rgb(226, 236, 246)' }}>
              {profileTabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="relative px-4 py-2.5 text-sm font-medium transition-colors duration-200"
                    style={{
                      color: isActive ? 'rgb(15, 76, 129)' : 'rgb(100, 116, 139)',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: isActive ? '2.5px solid rgb(15, 76, 129)' : '2px solid transparent',
                      marginBottom: '-2px',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {activeTab === 'Personal Info' && renderPersonalInfo()}
              {activeTab === 'Role & Availability' && renderRoleAvailability()}
              {activeTab === 'Qualifications' && renderQualifications()}
              {activeTab === 'Compliance' && renderCompliance()}
              {activeTab === 'Assessment' && renderAssessment()}
              {activeTab === 'Timeline' && renderTimeline()}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showStatusModal && <StatusModal />}
      {showMessageModal && <MessageModal />}
      {showStandbyModal && <StandbyModal />}
      {showInterviewModal && <InterviewModal />}
      {showRequestDocumentsModal && <RequestDocumentsModal />}
      {showRejectModal && <RejectModal />}
    </>
  );
};

export default ProfileSidebar;