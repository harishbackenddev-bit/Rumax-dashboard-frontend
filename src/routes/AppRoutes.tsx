// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";

// Layouts
import WebsiteLayout from "@/layouts/WebsiteLayout";
import AuthLayout from "@/layouts/AuthLayout";
import UserLayout from "@/layouts/user/UserLayout";
import AdminLayout from "@/layouts/admin/AdminLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import CreateAccount from "@/pages/auth/CreateAccount";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

// Website Pages
import Home from "@/pages/website/Home";
import Investigator from "@/pages/website/services/Investigator";
import Careers from "@/pages/website/Careers/Careers";
import CareerDetail from "@/pages/website/Careers/Details";
import ApplyJob from "@/pages/website/Careers/ApplyJob";

import ContactUs from "@/pages/website/ContactUs/ContactPage";
import PrivacyPolicy from "@/pages/website/PrivacyPolicy/PrivacyPolicyPage";
import CookiePolicy from "@/pages/website/CookiePolicy/CookiePolicyPage";
import GDPR from "@/pages/website/GDPR/GdprPrivacyPage";
import Clinical from "@/pages/website/services/Clinical";
import Partner from "@/pages/website/partners/Partner";
import Globalvendors from "@/pages/website/partners/globalvendors";
import CroSponsors from "@/pages/website/partners/crossponsors";
import AboutUs from "@/pages/website/AboutUs/AboutUs";
import Investigatorsites from "@/pages/website/partners/investigatorsites";


// Admin Pages
import AdminDashboard from "@/pages/admin/Dashboard";
import Candidates from "@/pages/admin/Candidates/Candidates";
import Postjob from "@/pages/admin/Postjob/Postjob";
import Jobs from "@/pages/admin/Postjob/Jobs";
import JobDetail from '@/pages/admin/Postjob/JobDetail';
import EditJob from '@/pages/admin/Postjob/EditJob';
import StandbyApplicants from '@/pages/admin/StandbyApplicants/StandbyApplicants';
import ReportsAnalytics from '@/pages/admin/ReportsAnalytics/ReportsAnalytics';
import UserManagement from '@/pages/admin/UserManagement/UserManagement';
import Settings from '@/pages/admin/Settings/Settings';




const AppRoutes = () => {
  return (
    <Routes>
      
      {/* AUTH - Public */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<CreateAccount />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>


      {/* WEBSITE - Public */}
      <Route path="/" element={<WebsiteLayout />}>
        {/* Main Pages */}
        <Route index element={<Home />} />
        <Route path="about-us" element={<AboutUs />} />
        <Route path="/investigator-trial-location-support-service" element={<Investigator />} />
        <Route path="/clinical-trials-homecare-services" element={<Clinical />} />
        <Route path="careers" element={<Careers />} />

        <Route path="contact-us" element={<ContactUs />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
        <Route path="cookie-policy" element={<CookiePolicy />} />
        <Route path="gdpr-and-privacy" element={<GDPR />} />
        <Route path="partners/global-vendors" element={<Globalvendors />} />
        <Route path="partners/cros-sponsors" element={<CroSponsors />} />
        <Route path="partners/investigator-sites" element={<Investigatorsites />} />
        <Route path="partners" element={<Partner />} />
        <Route path="careers/:id" element={<CareerDetail />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
      </Route>


      {/* ADMIN - Protected (Admin Only) */}
      <Route path="/admin" element={
        <ProtectedRoute adminOnly={true}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="jobs" element={<Jobs />} />
        <Route path="post-job" element={<Postjob />} />
        <Route path="jobs/:id" element={<JobDetail />} />
        <Route path="edit-job/:id" element={<EditJob />} />
        <Route path="standby" element={<StandbyApplicants />} />
        <Route path="analytics" element={<ReportsAnalytics />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;