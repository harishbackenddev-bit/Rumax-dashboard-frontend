// components/website/applyjob/Step6.tsx
import React from 'react';
import { Check, ChevronDown, Pen, User, Clock, BookOpen, Shield, Sparkles } from 'lucide-react';

interface Step6Props {
  personalInfo: any;
  roleInfo: any;
  qualifications: any;
  compliance: any;
  values: any;
  jobDetails?: any;
  resumeUrl: string;
  coverLetterUrl: string;
  onEdit: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  agreeTerms: boolean;
  setAgreeTerms: (value: boolean) => void;
}

const Step6: React.FC<Step6Props> = ({
  personalInfo,
  roleInfo,
  qualifications,
  compliance,
  values,
  jobDetails,
  resumeUrl,
  coverLetterUrl,
  onEdit,
  onSubmit,
  isSubmitting,
  agreeTerms,
  setAgreeTerms
}) => {
  const [openSections, setOpenSections] = React.useState<number[]>([1, 2, 3, 4, 5]);

  const toggleSection = (sectionId: number) => {
    setOpenSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const sections = [
    {
      id: 1,
      title: 'Personal Information',
      icon: User,
      data: [
        { label: 'Full Name', value: `${personalInfo.firstName} ${personalInfo.lastName}` },
        { label: 'Email', value: personalInfo.email },
        { label: 'Phone', value: personalInfo.phone },
        { label: 'Date of Birth', value: personalInfo.dateOfBirth },
        { label: 'Address', value: `${personalInfo.addressLine1}, ${personalInfo.city}, ${personalInfo.postcode}` },
        { label: 'Nationality', value: personalInfo.nationality },
        { label: 'Right to Work', value: personalInfo.rightToWork }
      ]
    },
    {
      id: 2,
      title: 'Role & Availability',
      icon: Clock,
      data: [
        { label: 'Position', value: roleInfo.positionAppliedFor || 'Not specified' },
        { label: 'Work Preference', value: roleInfo.workPreference || 'Not specified' },
        { label: 'Locations', value: roleInfo.preferredLocations?.join(', ') || 'None selected' },
        { label: 'Driving License', value: roleInfo.drivingLicense ? 'Yes' : 'No' },
        { label: 'Own Vehicle', value: roleInfo.ownVehicle ? 'Yes' : 'No' }
      ]
    },
    {
      id: 3,
      title: 'Qualifications & Experience',
      icon: BookOpen,
      data: [
        { label: 'Education', value: qualifications.education?.length > 0 ? `${qualifications.education.length} entries` : 'None added' },
        { label: 'Experience', value: qualifications.experience?.length > 0 ? `${qualifications.experience.length} entries` : 'None added' },
        { label: 'Training', value: qualifications.training?.length > 0 ? `${qualifications.training.length} entries` : 'None added' },
        { label: 'Registrations', value: qualifications.registrations?.length > 0 ? `${qualifications.registrations.length} entries` : 'None added' }
      ]
    },
    {
      id: 4,
      title: 'Compliance & References',
      icon: Shield,
      data: [
        { label: 'DBS Valid', value: compliance.dbsValid === true ? 'Yes' : compliance.dbsValid === false ? 'No' : 'Not specified' },
        { label: 'References', value: compliance.references?.length > 0 ? `${compliance.references.length} provided` : 'None added' },
        { label: 'Disciplinary Action', value: compliance.disciplinaryAction === true ? 'Yes' : compliance.disciplinaryAction === false ? 'No' : 'Not specified' },
        { label: 'Documents', value: compliance.documents?.length > 0 ? `${compliance.documents.length} uploaded` : 'None uploaded' }
      ]
    },
    {
      id: 5,
      title: 'Values & Assessment',
      icon: Sparkles,
      data: [
        { label: 'Heard From', value: values.heardFrom || 'Not specified' },
        { label: 'Core Values Ranked', value: values.coreValues?.length > 0 ? 'Completed' : 'Not ranked' },
        { label: 'Scenario Questions', value: values.scenarioAnswers?.q1 ? 'Completed' : 'Not completed' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Application</h1>
        <p className="text-gray-600">
          Please review your information before submitting. You can edit any section by clicking the edit button.
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          const isOpen = openSections.includes(section.id);
          return (
            <div key={section.id} className="border border-gray-300 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-gray-900">{section.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(section.id);
                    }}
                    className="text-[#0F4C81] hover:text-[#0d3d66] flex items-center gap-1 text-sm"
                  >
                    <Pen className="w-4 h-4" />
                    Edit
                  </button>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="p-6 pt-0 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {section.data.map((item, index) => (
                      <div key={index}>
                        <p className="text-xs font-medium text-gray-500">{item.label}</p>
                        <p className="text-sm font-medium text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 space-y-4">
        <div className="border-2 border-gray-300 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#0F4C81] focus:ring-[#0F4C81]"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                I confirm the information provided is accurate and complete. <span className="text-red-500">*</span>
              </p>
            </div>
          </label>
        </div>
        <div className="border-2 border-gray-300 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-[#0F4C81] focus:ring-[#0F4C81]"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                I consent to Rumax processing my personal data for recruitment purposes. <span className="text-red-500">*</span>
              </p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Step6;