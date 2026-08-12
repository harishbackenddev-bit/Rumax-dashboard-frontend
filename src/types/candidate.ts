// types/candidate.ts
export interface Candidate {
  _id: string;
  id?: string;
  name: string;
  email: string;
  role: string;
  location: string;
  availability: string;
  education: string;
  skills: string[];
   experience: string;
  appliedDate: string;
  score: number;
  status: 'Active' | 'In Review' | 'Interview Scheduled' | 'Offer Sent' | 'Hired' | 'Rejected';
  initials: string;
  color: string;
  phone?: string;
  nationality?: string;
  rightToWork?: boolean;
  address?: string;
  city?: string;
  country?: string;
  postcode?: string;
  dob?: string;
  jobId?: string;
  jobTitle?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CandidateStats {
  total: number;
  active: number;
  inReview: number;
  interviewScheduled: number;
  offerSent: number;
  hired: number;
  rejected: number;
}