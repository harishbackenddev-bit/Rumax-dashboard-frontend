// pages/CareersPage.tsx
import React, { useState, useEffect } from 'react';
import { CareCta } from "@/components/common/CareCta";
import { InfoGrid, InnerHero, JobGrid, PageShell, ProcessTimeline } from "@/components/pages/InnerPages";
import { careerSupport, recruitmentSteps } from "@/data/pages";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface Job {
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
  department?: string;
  jobType?: string;
  featured?: boolean;
  isRemote?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InfoItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  iconAsset: string | null;
  location: string;
  salary: string;
  contractType: string;
  experience: string;
  availability: string;
  isRemote: boolean;
  postedDate: string;
  daysAgo: string;
}

export default function CareersPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      const response = await axios.get(`${API_URL}/api/admin/jobs`);
      
      if (response.data.success) {
        setJobs(response.data.data || []);
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Format jobs for JobGrid component
  const formattedJobs: InfoItem[] = jobs.map(job => ({
    _id: job._id,
    title: job.jobTitle,
    description: job.overview || job.notes || 'Join our team and make a difference',
    icon: 'briefcase',
    iconAsset: null,
    location: job.locations?.join(', ') || 'Various locations',
    salary: job.salaryMin && job.salaryMax ? `£${job.salaryMin} - £${job.salaryMax}` : 'Competitive',
    contractType: job.contractType || 'Full-time',
    experience: job.experience || '3-5 yrs',
    availability: job.availability || 'Immediate',
    isRemote: job.isRemote || false,
    postedDate: new Date(job.createdAt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }),
    daysAgo: getDaysAgo(job.createdAt)
  }));

  // Helper function to calculate days ago
  function getDaysAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  const careersCareBullets = [
    "Personalised care plans",
    "Experienced healthcare professionals",
    "Flexible and reliable support",
    "Focus on dignity and independence",
    "Carer respite and family liaison",
    "End of life dementia care"
  ];

  function CareersCareSection() {
    return (
      <section className="page-section careers-care">
        <div className="container careers-care__inner">
          <div className="careers-care__copy">
            <h2>Care That Feels Personal, Every Day</h2>
            <p>
              At Rumax, we believe care is more than just support - it&apos;s about understanding individual needs, building
              trust, and delivering services that truly make a difference.
            </p>
            <p>
              Our team combines compassion with clinical expertise to ensure every person receives the right level of care, in
              the right environment, at the right time.
            </p>
            <ul>
              {careersCareBullets.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="careers-care__media">
            <img src="/assets/figma-exported/rumax-careers-team.png" alt="Rumax care team" />
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <PageShell>
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="careers-page">
        <InnerHero
          className="inner-hero--careers"
          title="Careers At Rumax"
          description="Join a team where your work makes a real difference. Whether you're passionate about compassionate care or advancing medical research, we have opportunities for you."
          backgroundImage="rumax-team-hero.png"
          showScrollCue
        />
        <ProcessTimeline title="Our Recruitment Process" items={recruitmentSteps} />
        <JobGrid jobs={formattedJobs} />
        <CareersCareSection />
        <InfoGrid title="What we support" items={careerSupport} />
        <CareCta />
      </div>
    </PageShell>
  );
}