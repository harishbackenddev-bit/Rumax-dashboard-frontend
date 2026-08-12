// pages/CreateAccount.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Logo from "@/assets/home/logo.png";

// Import step components
import AccountTypeStep from "@/components/auth/AccountTypeStep";
import PersonalInfoStep from "@/components/auth/PersonalInfoStep";
import ProfileTypeStep from "@/components/auth/ProfileTypeStep";
import PrimaryGoalStep from "@/components/auth/PrimaryGoalStep";
import OrganisationInfoStep from "@/components/auth/OrganisationInfoStep";
import OrganisationTypeStep from "@/components/auth/OrganisationTypeStep";
import SecurityNDAStep from "@/components/auth/SecurityNDAStep";

const CreateAccount = () => {
  const navigate = useNavigate();
  const { register, error, setError } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Selection states
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [selectedProfileType, setSelectedProfileType] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [selectedOrgType, setSelectedOrgType] = useState<string | null>(null);
  const [ndaAccepted, setNdaAccepted] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organisationName: "",
    contactName: "",
    businessEmail: "",
    orgPassword: "",
    orgConfirmPassword: "",
  });

  // Get total steps based on account type
  const getTotalSteps = () => {
    if (selectedAccountType === "individual") return 4;
    if (selectedAccountType === "institutional") return 4; // Step 4 is NDA, then dashboard
    return 1;
  };

  const totalSteps = getTotalSteps();
  const progressPercentage = ((currentStep - 1) / totalSteps) * 100;

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Validate current step
  const validateStep = (): boolean => {
    if (selectedAccountType === "individual") {
      if (currentStep === 2) {
        if (!formData.name || !formData.email) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
      }
      if (currentStep === 3 && !selectedProfileType) {
        setError("Please select a profile type");
        return false;
      }
      if (currentStep === 4 && !selectedGoal) {
        setError("Please select a primary goal");
        return false;
      }
    }

    if (selectedAccountType === "institutional") {
      if (currentStep === 2) {
        if (!formData.organisationName || !formData.contactName || !formData.businessEmail) {
          setError("Please fill in all required fields");
          return false;
        }
        if (formData.orgPassword !== formData.orgConfirmPassword) {
          setError("Passwords do not match");
          return false;
        }
        if (formData.orgPassword.length < 8) {
          setError("Password must be at least 8 characters");
          return false;
        }
      }
      if (currentStep === 3 && !selectedOrgType) {
        setError("Please select an organisation type");
        return false;
      }
      if (currentStep === 4 && !ndaAccepted) {
        setError("Please accept the NDA & Terms");
        return false;
      }
    }

    setError(null);
    return true;
  };

  // Handle continue/next
  const handleContinue = async () => {
    if (currentStep === 1 && !selectedAccountType) {
      setError("Please select an account type");
      return;
    }

    if (!validateStep()) return;

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit registration
      setLoading(true);
      setError(null);

      const registerData = {
        name: selectedAccountType === "individual" ? formData.name : formData.contactName,
        email: selectedAccountType === "individual" ? formData.email : formData.businessEmail,
        password: selectedAccountType === "individual" ? formData.password : formData.orgPassword,
        accountType: selectedAccountType as "individual" | "institutional",
        profileType: selectedProfileType,
        primaryGoal: selectedGoal,
        organisationName: formData.organisationName,
        organisationType: selectedOrgType,
        ndaAccepted: ndaAccepted,
      };

      const result = await register(registerData);
      setLoading(false);

      if (result.success) {
        navigate('/user');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  // Render step content based on account type and current step
  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <AccountTypeStep
          selectedAccountType={selectedAccountType}
          setSelectedAccountType={setSelectedAccountType}
        />
      );
    }

    if (selectedAccountType === "individual") {
      switch (currentStep) {
        case 2:
          return (
            <PersonalInfoStep
              formData={formData}
              handleInputChange={handleInputChange}
              error={error}
            />
          );
        case 3:
          return (
            <ProfileTypeStep
              selectedProfileType={selectedProfileType}
              setSelectedProfileType={setSelectedProfileType}
            />
          );
        case 4:
          return (
            <PrimaryGoalStep
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              error={error}
            />
          );
        default:
          return null;
      }
    }

    if (selectedAccountType === "institutional") {
      switch (currentStep) {
        case 2:
          return (
            <OrganisationInfoStep
              formData={formData}
              handleInputChange={handleInputChange}
              error={error}
            />
          );
        case 3:
          return (
            <OrganisationTypeStep
              selectedOrgType={selectedOrgType}
              setSelectedOrgType={setSelectedOrgType}
            />
          );
        case 4:
          return (
            <SecurityNDAStep
              ndaAccepted={ndaAccepted}
              setNdaAccepted={setNdaAccepted}
              error={error}
            />
          );
        default:
          return null;
      }
    }

    return null;
  };

  // Get step label
  const getStepLabel = () => {
    if (!selectedAccountType) return "Step 1 of 1";
    
    const stepLabels: Record<string, string[]> = {
      individual: ["", "Step 1 of 4", "Step 2 of 4", "Step 3 of 4", "Step 4 of 4"],
      institutional: ["", "Step 1 of 4", "Step 2 of 4", "Step 3 of 4", "Step 4 of 4"],
    };
    
    return stepLabels[selectedAccountType]?.[currentStep] || "";
  };

  // Check if continue button should be disabled
  const isContinueDisabled = () => {
    if (currentStep === 1 && !selectedAccountType) return true;
    if (loading) return true;

    if (selectedAccountType === "individual") {
      if (currentStep === 2) {
        const { name, email, password, confirmPassword } = formData;
        return !name || !email || !password || password.length < 8 || password !== confirmPassword;
      }
      if (currentStep === 3 && !selectedProfileType) return true;
      if (currentStep === 4 && !selectedGoal) return true;
    }

    if (selectedAccountType === "institutional") {
      if (currentStep === 2) {
        const { organisationName, contactName, businessEmail, orgPassword, orgConfirmPassword } = formData;
        return !organisationName || !contactName || !businessEmail || !orgPassword || orgPassword.length < 8 || orgPassword !== orgConfirmPassword;
      }
      if (currentStep === 3 && !selectedOrgType) return true;
      if (currentStep === 4 && !ndaAccepted) return true;
    }

    return false;
  };

  // Get button text
  const getButtonText = () => {
    if (loading) return "Creating...";
    if (currentStep === totalSteps) return "Enter Dashboard";
    return "Continue";
  };

  // Get button icon
  const getButtonIcon = () => {
    if (currentStep === totalSteps) {
      return <Check className="w-4 h-4" />;
    }
    return <ArrowRight className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-[#F9F7F4] flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <Link to="/" className="flex items-center">
          <img
            src={Logo}
            alt="Magalela Media"
            className="h-20 w-auto object-contain"
          />
        </Link>
        <span className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-[#C85A32] font-semibold hover:underline">
            Sign in
          </Link>
        </span>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center px-4 py-10 overflow-y-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm w-full max-w-[480px] p-8">
          {/* Progress Bar */}
          {currentStep > 1 && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span className="font-medium">{getStepLabel()}</span>
                <span className="font-medium">
                  {Math.round(progressPercentage)}% complete
                </span>
              </div>
              <div className="relative w-full overflow-hidden rounded-full h-1.5 bg-gray-100">
                <div
                  className="bg-[#C85A32] h-full transition-all duration-500 ease-in-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Step Content */}
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                currentStep === 1
                  ? "opacity-50 cursor-not-allowed text-gray-400"
                  : "text-gray-600 hover:bg-gray-50 hover:text-[#0F2D63]"
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <button
              onClick={handleContinue}
              disabled={isContinueDisabled()}
              className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isContinueDisabled()
                  ? "opacity-50 cursor-not-allowed bg-gray-300 text-white"
                  : "bg-[#C85A32] hover:bg-[#a8472a] text-white"
              }`}
            >
              {getButtonText()}
              {!loading && getButtonIcon()}
            </button>
          </div>

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-1.5 mt-6 text-xs text-gray-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;