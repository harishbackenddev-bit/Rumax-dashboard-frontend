// pages/ApplyJob.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Loader2, Save, X, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Step1 from '@/components/website/applyjob/Step1';
import Step2 from '@/components/website/applyjob/Step2';
import Step3 from '@/components/website/applyjob/Step3';
import Step4 from '@/components/website/applyjob/Step4';
import Step5 from '@/components/website/applyjob/Step5';
import Step6 from '@/components/website/applyjob/Step6';
import resumeParserService from '@/utils/resumeParser';

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
  requireResume?: boolean;
  requireCoverLetter?: boolean;
  requireDrivingLicence?: boolean;
  requireDBS?: boolean;
  requireReferences?: boolean;
}

interface Education {
  id: string;
  institution: string;
  qualification: string;
  startDate: string;
  endDate: string;
  grade: string;
}

interface Experience {
  id: string;
  employer: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string;
}

interface Training {
  id: string;
  name: string;
  provider: string;
  dateCompleted: string;
  expiryDate: string;
  certificate: string;
  certificateFile: File | null;
}

interface Registration {
  id: string;
  body: string;
  number: string;
  expiryDate: string;
}

interface Reference {
  id: string;
  fullName: string;
  company: string;
  jobTitle: string;
  phone: string;
  email: string;
  relationship: string;
  yearsKnown: string;
  type: string;
}

const ApplyJob: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [fetchingJob, setFetchingJob] = useState(true);
  const token = localStorage.getItem("token");
  
  // File states
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string>('');
  const [isResumeUploading, setIsResumeUploading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Step 1: Personal Information
  const [personalInfo, setPersonalInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    postcode: '',
    nationality: '',
    rightToWork: ''
  });

  // Step 2: Role & Availability
  const [roleInfo, setRoleInfo] = useState({
    positionAppliedFor: '',
    workPreference: '',
    preferredLocations: [] as string[],
    availability: {
      monday: [] as string[],
      tuesday: [] as string[],
      wednesday: [] as string[],
      thursday: [] as string[],
      friday: [] as string[],
      saturday: [] as string[],
      sunday: [] as string[]
    },
    drivingLicense: false,
    ownVehicle: false,
    shiftConfirmation: false
  });

  // Step 3: Qualifications & Experience
  const [qualifications, setQualifications] = useState({
    education: [] as Education[],
    experience: [] as Experience[],
    training: [] as Training[],
    registrations: [] as Registration[]
  });

  // Step 4: Compliance & References
  const [compliance, setCompliance] = useState({
    references: [] as Reference[],
    dbsValid: null as boolean | null,
    disciplinaryAction: null as boolean | null,
    unspentConvictions: null as boolean | null,
    documents: [] as File[],
    documentUrls: [] as string[],
    drivingLicenceFile: null as File | null,
    drivingLicenceUrl: '' as string,
    dbsCertificateFile: null as File | null,
    dbsCertificateUrl: '' as string,
    referencesFile: null as File | null,
    referencesUrl: '' as string
  });

  // Step 5: Values & Assessment
  const [values, setValues] = useState({
    heardFrom: '',
    supportingStatement: '',
    scenarioAnswers: {
      q1: '',
      q2: '',
      q3: ''
    },
    coreValues: ['Compassion', 'Respect', 'Integrity', 'Continuous Learning', 'Excellence']
  });

  // Step 6: Review
  const [agreeTerms, setAgreeTerms] = useState(false);

  const steps = [
    { id: 1, label: 'Personal Information', shortLabel: 'Step 1' },
    { id: 2, label: 'Role & Availability', shortLabel: 'Step 2' },
    { id: 3, label: 'Qualifications & Experience', shortLabel: 'Step 3' },
    { id: 4, label: 'Compliance & References', shortLabel: 'Step 4' },
    { id: 5, label: 'Values & Assessment', shortLabel: 'Step 5' },
    { id: 6, label: 'Review & Submit', shortLabel: 'Step 6' }
  ];

  // Fetch job details
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setFetchingJob(true);
        const response = await axios.get(`${API_URL}/api/admin/job/${jobId}`);
        if (response.data.success) {
          setJobDetails(response.data.data);
          setRoleInfo(prev => ({
            ...prev,
            positionAppliedFor: response.data.data.jobTitle || ''
          }));
        } else {
          toast.error('Failed to fetch job details');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
        toast.error('Job not found');
      } finally {
        setFetchingJob(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, navigate]);

  // ---- Document Upload Function ----
  const uploadDocument = async (file: File, type: string): Promise<string> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('document', file);
      formData.append('type', type);

      const response = await axios.post(
        `${API_URL}/api/upload-document`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.message || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
      return '';
    } finally {
      setIsUploading(false);
    }
  };

  // ---- Updated File Upload Handler with AI Integration ----
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📎 File selected:', file.name, file.type, file.size);

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
      toast.error('Please upload PDF, DOC, DOCX, or TXT files only');
      return;
    }

    // Upload the file
    const url = await uploadDocument(file, fileType);
    if (!url) return;

    if (fileType === 'resume') {
      setResumeFile(file);
      setResumeUrl(url);
      setIsResumeUploading(true);

      try {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
        
        if (!apiKey) {
          toast.error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to .env');
          setIsResumeUploading(false);
          return;
        }

        toast.loading('🤖 Analyzing your resume with AI...', { id: 'resume-parsing' });
        
        const parsedData = await resumeParserService.parseResumeWithAI(file, apiKey);
        console.log('✅ AI Parsed Data:', parsedData);
        
        setPersonalInfo(prev => ({
          ...prev,
          firstName: parsedData.firstName || prev.firstName,
          lastName: parsedData.lastName || prev.lastName,
          email: parsedData.email || prev.email,
          phone: parsedData.phone || prev.phone,
          dateOfBirth: parsedData.dateOfBirth || prev.dateOfBirth,
          addressLine1: parsedData.addressLine1 || prev.addressLine1,
          addressLine2: parsedData.addressLine2 || prev.addressLine2 || '',
          city: parsedData.city || prev.city,
          county: parsedData.county || prev.county,
          postcode: parsedData.postcode || prev.postcode,
          nationality: parsedData.nationality || prev.nationality,
          rightToWork: parsedData.rightToWork || prev.rightToWork,
        }));

        toast.success('✅ Resume uploaded and AI auto-filled successfully!', { id: 'resume-parsing' });
      } catch (error: any) {
        console.error('❌ AI parsing error:', error);
        toast.error(error.message || 'Failed to parse resume with AI. Please fill in manually.', { id: 'resume-parsing' });
      } finally {
        setIsResumeUploading(false);
      }
    } else if (fileType === 'coverLetter') {
      setCoverLetterFile(file);
      setCoverLetterUrl(url);
      toast.success('Cover letter uploaded!');
    } else if (fileType === 'drivingLicence') {
      setCompliance(prev => ({
        ...prev,
        drivingLicenceFile: file,
        drivingLicenceUrl: url
      }));
      toast.success('Driving licence uploaded!');
    } else if (fileType === 'dbsCertificate') {
      setCompliance(prev => ({
        ...prev,
        dbsCertificateFile: file,
        dbsCertificateUrl: url
      }));
      toast.success('DBS certificate uploaded!');
    } else if (fileType === 'referencesFile') {
      setCompliance(prev => ({
        ...prev,
        referencesFile: file,
        referencesUrl: url
      }));
      toast.success('References document uploaded!');
    }
  };

  const handleFileRemove = (fileType: string) => {
    if (fileType === 'resume') {
      setResumeFile(null);
      setResumeUrl('');
    } else if (fileType === 'coverLetter') {
      setCoverLetterFile(null);
      setCoverLetterUrl('');
    } else if (fileType === 'drivingLicence') {
      setCompliance(prev => ({
        ...prev,
        drivingLicenceFile: null,
        drivingLicenceUrl: ''
      }));
    } else if (fileType === 'dbsCertificate') {
      setCompliance(prev => ({
        ...prev,
        dbsCertificateFile: null,
        dbsCertificateUrl: ''
      }));
    } else if (fileType === 'referencesFile') {
      setCompliance(prev => ({
        ...prev,
        referencesFile: null,
        referencesUrl: ''
      }));
    }
  };

  // ---- Handlers for Step 1 ----
  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  // ---- Handlers for Step 2 ----
  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRoleInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationToggle = (location: string) => {
    setRoleInfo(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.includes(location)
        ? prev.preferredLocations.filter(l => l !== location)
        : [...prev.preferredLocations, location]
    }));
  };

  const handleAvailabilityToggle = (day: string, shift: string) => {
    setRoleInfo(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: prev.availability[day as keyof typeof prev.availability].includes(shift)
          ? prev.availability[day as keyof typeof prev.availability].filter(s => s !== shift)
          : [...prev.availability[day as keyof typeof prev.availability], shift]
      }
    }));
  };

  const handleRadioChange = (name: string, value: string | boolean) => {
    setRoleInfo(prev => ({ ...prev, [name]: value }));
  };

  // ---- Handlers for Step 3 ----
  const handleAddEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      qualification: '',
      startDate: '',
      endDate: '',
      grade: ''
    };
    setQualifications(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const handleRemoveEducation = (id: string) => {
    setQualifications(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  const handleEducationChange = (id: string, field: keyof Education, value: string) => {
    setQualifications(prev => ({
      ...prev,
      education: prev.education.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const handleAddExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      employer: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: ''
    };
    setQualifications(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const handleRemoveExperience = (id: string) => {
    setQualifications(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  const handleExperienceChange = (id: string, field: keyof Experience, value: string | boolean) => {
    setQualifications(prev => ({
      ...prev,
      experience: prev.experience.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const handleAddTraining = () => {
    const newTraining: Training = {
      id: Date.now().toString(),
      name: '',
      provider: '',
      dateCompleted: '',
      expiryDate: '',
      certificate: '',
      certificateFile: null
    };
    setQualifications(prev => ({
      ...prev,
      training: [...prev.training, newTraining]
    }));
  };

  const handleRemoveTraining = (id: string) => {
    setQualifications(prev => ({
      ...prev,
      training: prev.training.filter(train => train.id !== id)
    }));
  };

  const handleTrainingChange = (id: string, field: keyof Training, value: string | File | null) => {
    setQualifications(prev => ({
      ...prev,
      training: prev.training.map(train =>
        train.id === id ? { ...train, [field]: value } : train
      )
    }));
  };

  const handleTrainingCertificateUpload = async (id: string, file: File) => {
    const url = await uploadDocument(file, 'trainingCertificate');
    if (url) {
      setQualifications(prev => ({
        ...prev,
        training: prev.training.map(train =>
          train.id === id ? { ...train, certificate: url, certificateFile: file } : train
        )
      }));
    }
  };

  const handleAddRegistration = () => {
    const newRegistration: Registration = {
      id: Date.now().toString(),
      body: '',
      number: '',
      expiryDate: ''
    };
    setQualifications(prev => ({
      ...prev,
      registrations: [...prev.registrations, newRegistration]
    }));
  };

  const handleRemoveRegistration = (id: string) => {
    setQualifications(prev => ({
      ...prev,
      registrations: prev.registrations.filter(reg => reg.id !== id)
    }));
  };

  const handleRegistrationChange = (id: string, field: keyof Registration, value: string) => {
    setQualifications(prev => ({
      ...prev,
      registrations: prev.registrations.map(reg =>
        reg.id === id ? { ...reg, [field]: value } : reg
      )
    }));
  };

  // ---- Handlers for Step 4 ----
  const handleAddReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      fullName: '',
      company: '',
      jobTitle: '',
      phone: '',
      email: '',
      relationship: '',
      yearsKnown: '',
      type: ''
    };
    setCompliance(prev => ({
      ...prev,
      references: [...prev.references, newReference]
    }));
  };

  const handleRemoveReference = (id: string) => {
    setCompliance(prev => ({
      ...prev,
      references: prev.references.filter(ref => ref.id !== id)
    }));
  };

  const handleReferenceChange = (id: string, field: keyof Reference, value: string) => {
    setCompliance(prev => ({
      ...prev,
      references: prev.references.map(ref =>
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleComplianceRadioChange = (name: string, value: boolean) => {
    setCompliance(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = async (files: FileList) => {
    const newFiles = Array.from(files);
    const uploadedUrls: string[] = [];

    for (const file of newFiles) {
      const url = await uploadDocument(file, 'complianceDocument');
      if (url) {
        uploadedUrls.push(url);
      }
    }

    setCompliance(prev => ({
      ...prev,
      documents: [...prev.documents, ...newFiles],
      documentUrls: [...prev.documentUrls, ...uploadedUrls]
    }));
    
    if (uploadedUrls.length > 0) {
      toast.success(`${uploadedUrls.length} document(s) uploaded successfully!`);
    }
  };

  // ---- Handlers for Step 5 ----
  const handleValuesChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'scenarioQ1') {
      setValues(prev => ({
        ...prev,
        scenarioAnswers: { ...prev.scenarioAnswers, q1: value }
      }));
    } else if (name === 'scenarioQ2') {
      setValues(prev => ({
        ...prev,
        scenarioAnswers: { ...prev.scenarioAnswers, q2: value }
      }));
    } else if (name === 'scenarioQ3') {
      setValues(prev => ({
        ...prev,
        scenarioAnswers: { ...prev.scenarioAnswers, q3: value }
      }));
    } else {
      setValues(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleValuesRadioChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleValueReorder = (newValues: string[]) => {
    setValues(prev => ({ ...prev, coreValues: newValues }));
  };

  // ---- Handlers for Step 6 ----
  const handleEditStep = (stepNumber: number) => {
    setStep(stepNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---- Navigation ----
  const handleNext = () => {
    if (!validateStep(step)) return;
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ---- Validation ----
  const validateStep = (stepNumber: number): boolean => {
    switch(stepNumber) {
      case 1:
        if (!personalInfo.firstName) { toast.error('First Name is required'); return false; }
        if (!personalInfo.lastName) { toast.error('Last Name is required'); return false; }
        if (!personalInfo.email) { toast.error('Email is required'); return false; }
        if (!personalInfo.phone) { toast.error('Phone number is required'); return false; }
        if (!personalInfo.dateOfBirth) { toast.error('Date of Birth is required'); return false; }
        if (!personalInfo.addressLine1) { toast.error('Address is required'); return false; }
        if (!personalInfo.city) { toast.error('City is required'); return false; }
        if (!personalInfo.county) { toast.error('County is required'); return false; }
        if (!personalInfo.postcode) { toast.error('Postcode is required'); return false; }
        if (!personalInfo.nationality) { toast.error('Nationality is required'); return false; }
        if (!personalInfo.rightToWork) { toast.error('Right to Work status is required'); return false; }
        if (jobDetails?.requireResume && !resumeUrl) { 
          toast.error('Resume/CV is required for this position'); 
          return false; 
        }
        return true;
      case 2:
        if (!roleInfo.positionAppliedFor) { toast.error('Position is required'); return false; }
        if (!roleInfo.workPreference) { toast.error('Work preference is required'); return false; }
        if (roleInfo.preferredLocations.length === 0) { toast.error('Please select at least one location'); return false; }
        return true;
      case 3:
        if (qualifications.education.length === 0 && 
            qualifications.experience.length === 0 && 
            qualifications.training.length === 0) {
          toast.error('Please add at least one education, experience, or training entry');
          return false;
        }
        return true;
      case 4:
        if (compliance.references.length < 2) {
          toast.error('Please provide at least 2 references');
          return false;
        }
        if (compliance.dbsValid === null) {
          toast.error('Please specify if you have a valid DBS');
          return false;
        }
        if (compliance.disciplinaryAction === null) {
          toast.error('Please specify if you have been subject to disciplinary action');
          return false;
        }
        if (compliance.unspentConvictions === null) {
          toast.error('Please specify if you have any unspent convictions');
          return false;
        }
        if (jobDetails?.requireDrivingLicence && !compliance.drivingLicenceUrl) {
          toast.error('Driving Licence is required for this position');
          return false;
        }
        if (jobDetails?.requireDBS && !compliance.dbsCertificateUrl) {
          toast.error('DBS Certificate is required for this position');
          return false;
        }
        if (jobDetails?.requireReferences && !compliance.referencesUrl) {
          toast.error('References document is required for this position');
          return false;
        }
        return true;
      case 5:
        if (!values.heardFrom) { toast.error('Please specify how you heard about us'); return false; }
        if (!values.supportingStatement) { toast.error('Supporting statement is required'); return false; }
        if (!values.scenarioAnswers.q1) { toast.error('Please answer scenario question 1'); return false; }
        if (!values.scenarioAnswers.q2) { toast.error('Please answer scenario question 2'); return false; }
        if (!values.scenarioAnswers.q3) { toast.error('Please answer scenario question 3'); return false; }
        return true;
      case 6:
        if (!agreeTerms) { toast.error('Please agree to the terms and conditions'); return false; }
        return true;
      default:
        return true;
    }
  };

  // ---- Submit ----
  const handleSubmit = async () => {
    if (!validateStep(6)) return;

    const existingToken = localStorage.getItem('token');
    const existingCandidateId = localStorage.getItem('candidateId');

    try {
      setLoading(true);

      let candidateId = existingCandidateId;
      let authToken = existingToken;

      if (!authToken || !candidateId) {
        const createPayload = {
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          email: personalInfo.email,
          phone: personalInfo.phone,
          dateOfBirth: personalInfo.dateOfBirth,
          addressLine1: personalInfo.addressLine1,
          addressLine2: personalInfo.addressLine2,
          city: personalInfo.city,
          county: personalInfo.county,
          postcode: personalInfo.postcode,
          nationality: personalInfo.nationality,
          rightToWork: personalInfo.rightToWork,
          positionAppliedFor: roleInfo.positionAppliedFor,
          workPreference: roleInfo.workPreference,
          preferredLocations: roleInfo.preferredLocations,
          availability: roleInfo.availability,
          drivingLicense: roleInfo.drivingLicense,
          ownVehicle: roleInfo.ownVehicle,
          shiftConfirmation: roleInfo.shiftConfirmation,
          education: qualifications.education,
          experience: qualifications.experience,
          training: qualifications.training,
          registrations: qualifications.registrations,
          references: compliance.references,
          dbsValid: compliance.dbsValid,
          disciplinaryAction: compliance.disciplinaryAction,
          unspentConvictions: compliance.unspentConvictions,
          documents: compliance.documentUrls,
          drivingLicenceUrl: compliance.drivingLicenceUrl,
          dbsCertificateUrl: compliance.dbsCertificateUrl,
          referencesUrl: compliance.referencesUrl,
          heardFrom: values.heardFrom,
          supportingStatement: values.supportingStatement,
          scenarioAnswers: values.scenarioAnswers,
          coreValues: values.coreValues,
          resumeUrl: resumeUrl,
          coverLetterUrl: coverLetterUrl
        };

        const createResponse = await axios.post(
          `${API_URL}/api/admin/candidates`,
          createPayload
        );

        if (!createResponse.data.success) {
          toast.error(createResponse.data.message || 'Failed to create candidate profile');
          setLoading(false);
          return;
        }

        candidateId = createResponse.data.data._id;
        authToken = createResponse.data.data.token;

        if (authToken) {
          localStorage.setItem("token", authToken);
          if (candidateId) {
            localStorage.setItem("candidateId", candidateId);
          }
        }
      
        toast.success('Candidate profile created successfully!');
      }

      const applyPayload = {
        candidateId: candidateId,
        jobId: jobDetails?._id || null,
        jobTitle: jobDetails?.jobTitle || roleInfo.positionAppliedFor,
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        email: personalInfo.email,
        phone: personalInfo.phone,
        dateOfBirth: personalInfo.dateOfBirth,
        addressLine1: personalInfo.addressLine1,
        addressLine2: personalInfo.addressLine2,
        city: personalInfo.city,
        county: personalInfo.county,
        postcode: personalInfo.postcode,
        nationality: personalInfo.nationality,
        rightToWork: personalInfo.rightToWork,
        positionAppliedFor: roleInfo.positionAppliedFor,
        workPreference: roleInfo.workPreference,
        preferredLocations: roleInfo.preferredLocations,
        availability: roleInfo.availability,
        drivingLicense: roleInfo.drivingLicense,
        ownVehicle: roleInfo.ownVehicle,
        shiftConfirmation: roleInfo.shiftConfirmation,
        education: qualifications.education,
        experience: qualifications.experience,
        training: qualifications.training,
        registrations: qualifications.registrations,
        references: compliance.references,
        dbsValid: compliance.dbsValid,
        disciplinaryAction: compliance.disciplinaryAction,
        unspentConvictions: compliance.unspentConvictions,
        documents: compliance.documentUrls,
        drivingLicenceUrl: compliance.drivingLicenceUrl,
        dbsCertificateUrl: compliance.dbsCertificateUrl,
        referencesUrl: compliance.referencesUrl,
        heardFrom: values.heardFrom,
        supportingStatement: values.supportingStatement,
        scenarioAnswers: values.scenarioAnswers,
        coreValues: values.coreValues,
        resumeUrl: resumeUrl,
        coverLetterUrl: coverLetterUrl,
        coverLetter: coverLetterUrl ? 'Cover letter uploaded' : '',
        notes: `Applied for ${jobDetails?.jobTitle || roleInfo.positionAppliedFor} position`
      };

      const applyResponse = await axios.post(
        `${API_URL}/api/admin/candidates/apply`,
        applyPayload,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (applyResponse.data.success) {
        toast.success('Application submitted successfully! 🎉');
        navigate('/careers', { 
          state: { 
            jobTitle: jobDetails?.jobTitle || roleInfo.positionAppliedFor,
            candidateId: candidateId
          } 
        });
      } else {
        toast.error(applyResponse.data.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to submit application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ---- Render Step ----
  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <Step1
            formData={personalInfo}
            resumeFile={resumeFile}
            resumeUrl={resumeUrl}
            coverLetterFile={coverLetterFile}
            coverLetterUrl={coverLetterUrl}
            isResumeUploading={isResumeUploading}
            isUploading={isUploading}
            jobDetails={jobDetails}
            onChange={handlePersonalChange}
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            setFormData={setPersonalInfo}
          />
        );
      case 2:
        return (
          <Step2
            formData={roleInfo}
            onChange={handleRoleChange}
            onLocationToggle={handleLocationToggle}
            onAvailabilityToggle={handleAvailabilityToggle}
            onRadioChange={handleRadioChange}
          />
        );
      case 3:
        return (
          <Step3
            education={qualifications.education}
            experience={qualifications.experience}
            training={qualifications.training}
            registrations={qualifications.registrations}
            jobDetails={jobDetails}
            onAddEducation={handleAddEducation}
            onAddExperience={handleAddExperience}
            onAddTraining={handleAddTraining}
            onAddRegistration={handleAddRegistration}
            onRemoveEducation={handleRemoveEducation}
            onRemoveExperience={handleRemoveExperience}
            onRemoveTraining={handleRemoveTraining}
            onRemoveRegistration={handleRemoveRegistration}
            onEducationChange={handleEducationChange}
            onExperienceChange={handleExperienceChange}
            onTrainingChange={handleTrainingChange}
            onTrainingCertificateUpload={handleTrainingCertificateUpload}
            onRegistrationChange={handleRegistrationChange}
          />
        );
      case 4:
        return (
          <Step4
            references={compliance.references}
            dbsValid={compliance.dbsValid}
            disciplinaryAction={compliance.disciplinaryAction}
            unspentConvictions={compliance.unspentConvictions}
            documents={compliance.documents}
            jobDetails={jobDetails}
            drivingLicenceFile={compliance.drivingLicenceFile}
            drivingLicenceUrl={compliance.drivingLicenceUrl}
            dbsCertificateFile={compliance.dbsCertificateFile}
            dbsCertificateUrl={compliance.dbsCertificateUrl}
            referencesFile={compliance.referencesFile}
            referencesUrl={compliance.referencesUrl}
            onAddReference={handleAddReference}
            onRemoveReference={handleRemoveReference}
            onReferenceChange={handleReferenceChange}
            onRadioChange={handleComplianceRadioChange}
            onDocumentUpload={handleDocumentUpload}
            onFileUpload={handleFileUpload}
            onFileRemove={handleFileRemove}
            isUploading={isUploading}
          />
        );
      case 5:
        return (
          <Step5
            formData={values}
            onChange={handleValuesChange}
            onRadioChange={handleValuesRadioChange}
            onValueReorder={handleValueReorder}
          />
        );
      case 6:
        return (
          <Step6
            personalInfo={personalInfo}
            roleInfo={roleInfo}
            qualifications={qualifications}
            compliance={compliance}
            values={values}
            jobDetails={jobDetails}
            resumeUrl={resumeUrl}
            coverLetterUrl={coverLetterUrl}
            onEdit={handleEditStep}
            onSubmit={handleSubmit}
            isSubmitting={loading}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
          />
        );
      default:
        return null;
    }
  };

  if (fetchingJob) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#0F4C81] mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] applyalljobs">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/careers')}
              className="flex items-center gap-2 text-gray-600 hover:text-[#0F4C81] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Jobs</span>
            </button>
          </div>
        </div>
        <div className="h-1 bg-gray-200">
          <div 
            className="h-full bg-[#0F4C81] transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>
      </header>

      {/* Step Indicators */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((s) => (
              <div key={s.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className="flex items-center w-full">
                    <div className="relative flex items-center justify-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                          step >= s.id 
                            ? 'bg-[#0F4C81] text-white' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {step > s.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          s.id
                        )}
                      </div>
                    </div>
                    {s.id < 6 && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        step > s.id ? 'bg-[#0F4C81]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                  <div className={`mt-2 text-xs sm:text-sm text-center transition-all ${
                    step >= s.id ? 'text-[#0F4C81] font-semibold' : 'text-gray-500'
                  }`}>
                    <span className="hidden lg:inline">{s.label}</span>
                    <span className="lg:hidden">{s.shortLabel}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-lg shadow-gray-100 p-8 sm:p-10">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8 mt-8 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className={`px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all font-bold flex items-center gap-2 group ${
                step === 1 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Previous Step
            </button>

            {step < 6 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-10 py-4 bg-gradient-to-r from-[#0F4C81] to-[#1565a8] text-white rounded-xl hover:shadow-2xl hover:shadow-[#0F4C81]/30 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-base flex items-center gap-3 group"
              >
                Continue to Next Step
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all font-bold text-base flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          © 2026 Rumax Limited. All rights reserved. | Privacy Policy | Terms of Service
        </div>
      </footer>
    </div>
  );
};

export default ApplyJob;