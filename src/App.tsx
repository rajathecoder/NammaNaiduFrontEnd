import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
const RegisterPage = React.lazy(() => import('./pages/RegisterPage/RegisterPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage/LoginPage'));
const ForgotPasswordPage = React.lazy(() => import('./pages/ForgotPassword/ForgotPasswordPage'));
const OTPPage = React.lazy(() => import('./pages/OTPPage/OTPPage'));
const BasicDetails = React.lazy(() => import('./pages/BasicDetails/BasicDetails'));
const PersonalReligiousDetails = React.lazy(() => import('./pages/BasicDetails/PersonalReligiousDetails'));
const ProfessionalDetails = React.lazy(() => import('./pages/BasicDetails/ProfessionalDetails'));
const AdditionalDetails = React.lazy(() => import('./pages/BasicDetails/AdditionalDetails'));
const RegistrationSuccess = React.lazy(() => import('./pages/RegistrationSuccess/RegistrationSuccess'));
const SubscriptionPlans = React.lazy(() => import('./pages/SubscriptionPlans/SubscriptionPlans'));
const HomePage = React.lazy(() => import('./pages/HomePage/HomePage'));
const MyProfile = React.lazy(() => import('./pages/MyProfile/MyProfile'));
const ProfileDetail = React.lazy(() => import('./pages/ProfileDetail/ProfileDetail'));
const Interests = React.lazy(() => import('./pages/Interests/Interests'));
const ConversationsList = React.lazy(() => import('./pages/Messages/ConversationsList'));
const ChatWindow = React.lazy(() => import('./pages/Messages/ChatWindow'));
const Search = React.lazy(() => import('./pages/Search/Search'));
const PartnerPreferences = React.lazy(() => import('./pages/PartnerPreferences/PartnerPreferences'));
const ProfileSettings = React.lazy(() => import('./pages/ProfileSettings/ProfileSettings'));
const BlockedUsers = React.lazy(() => import('./pages/BlockedUsers/BlockedUsers'));
const Recommendations = React.lazy(() => import('./pages/Recommendations/Recommendations'));
const Matches = React.lazy(() => import('./pages/Matches/Matches'));
const Notifications = React.lazy(() => import('./pages/Notifications/Notifications'));
const LandingPage = React.lazy(() => import('./pages/LandingPage/LandingPage'));
const ContentPage = React.lazy(() => import('./pages/CMS/ContentPage'));
const ContactUs = React.lazy(() => import('./pages/CMS/ContactUs'));
const SuccessStoriesPage = React.lazy(() => import('./pages/CMS/SuccessStoriesPage'));
import UserProtectedRoute from './components/common/UserProtectedRoute';
import AdminLayout from './admin/components/layout/AdminLayout';
import ProtectedRoute from './admin/components/common/ProtectedRoute';
const Dashboard = React.lazy(() => import('./admin/pages/Dashboard/Dashboard'));
const AllUsers = React.lazy(() => import('./admin/pages/Users/AllUsers'));
const PendingApprovals = React.lazy(() => import('./admin/pages/Users/PendingApprovals'));
const AdminBlockedUsers = React.lazy(() => import('./admin/pages/Users/BlockedUsers'));
const UserProfile = React.lazy(() => import('./admin/pages/Users/UserProfile'));
const UserEdit = React.lazy(() => import('./admin/pages/Users/UserEdit'));
const PhotoModeration = React.lazy(() => import('./admin/pages/PhotoModeration/PhotoModeration'));

const AdminSubscriptionPlans = React.lazy(() => import('./admin/pages/Subscriptions/SubscriptionPlans'));
const SubscriptionTransactions = React.lazy(() => import('./admin/pages/Subscriptions/SubscriptionTransactions'));
const MatchesManagement = React.lazy(() => import('./admin/pages/Matches/MatchesManagement'));
const ReportsComplaints = React.lazy(() => import('./admin/pages/Reports/ReportsComplaints'));
const FlaggedUsers = React.lazy(() => import('./admin/pages/FlaggedUsers/FlaggedUsers'));
const MastersPage = React.lazy(() => import('./admin/pages/Masters/MastersPage'));
const ChatLogs = React.lazy(() => import('./admin/pages/Messaging/ChatLogs'));
const CMSPage = React.lazy(() => import('./admin/pages/CMS/CMSPage'));
const NotificationManagement = React.lazy(() => import('./admin/pages/Notifications/NotificationManagement'));
const WebsiteSettings = React.lazy(() => import('./admin/pages/Settings/WebsiteSettings'));
const AdminUserManagement = React.lazy(() => import('./admin/pages/AdminUsers/AdminUserManagement'));
const CouponManagement = React.lazy(() => import('./admin/pages/Coupons/CouponManagement'));
const ReferralManagement = React.lazy(() => import('./admin/pages/Referrals/ReferralManagement'));
const ReferralPage = React.lazy(() => import('./pages/Referral/ReferralPage'));
const SuccessStoriesAdmin = React.lazy(() => import('./admin/pages/CMS/SuccessStoriesAdmin'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading fullScreen={true} />}>
        <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />

        {/* Public CMS pages */}
        <Route path="/about-us" element={<ContentPage />} />
        <Route path="/privacy-policy" element={<ContentPage />} />
        <Route path="/terms-of-use" element={<ContentPage />} />
        <Route path="/security-tips" element={<ContentPage />} />
        <Route path="/cookie-policy" element={<ContentPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/success-stories" element={<SuccessStoriesPage />} />

        {/* Protected user routes */}
        <Route path="/basic-details" element={<UserProtectedRoute><BasicDetails /></UserProtectedRoute>} />
        <Route path="/personal-religious-details" element={<UserProtectedRoute><PersonalReligiousDetails /></UserProtectedRoute>} />
        <Route path="/professional-details" element={<UserProtectedRoute><ProfessionalDetails /></UserProtectedRoute>} />
        <Route path="/additional-details" element={<UserProtectedRoute><AdditionalDetails /></UserProtectedRoute>} />
        <Route path="/registration-success" element={<UserProtectedRoute><RegistrationSuccess /></UserProtectedRoute>} />
        <Route path="/subscription-plans" element={<UserProtectedRoute><SubscriptionPlans /></UserProtectedRoute>} />
        <Route path="/home" element={<UserProtectedRoute><HomePage /></UserProtectedRoute>} />
        <Route path="/my-profile" element={<UserProtectedRoute><MyProfile /></UserProtectedRoute>} />
        <Route path="/profile/:id" element={<UserProtectedRoute><ProfileDetail /></UserProtectedRoute>} />
        <Route path="/interests" element={<UserProtectedRoute><Interests /></UserProtectedRoute>} />
        <Route path="/messages" element={<UserProtectedRoute><ConversationsList /></UserProtectedRoute>} />
        <Route path="/messages/:conversationId" element={<UserProtectedRoute><ChatWindow /></UserProtectedRoute>} />
        <Route path="/search" element={<UserProtectedRoute><Search /></UserProtectedRoute>} />
        <Route path="/matches" element={<UserProtectedRoute><Matches /></UserProtectedRoute>} />
        <Route path="/notifications" element={<UserProtectedRoute><Notifications /></UserProtectedRoute>} />
        <Route path="/partner-preferences" element={<UserProtectedRoute><PartnerPreferences /></UserProtectedRoute>} />
        <Route path="/profile-settings" element={<UserProtectedRoute><ProfileSettings /></UserProtectedRoute>} />
        <Route path="/blocked-users" element={<UserProtectedRoute><BlockedUsers /></UserProtectedRoute>} />
        <Route path="/recommendations" element={<UserProtectedRoute><Recommendations /></UserProtectedRoute>} />
        <Route path="/referral" element={<UserProtectedRoute><ReferralPage /></UserProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<ProtectedRoute requiredPath="/admin/dashboard"><Dashboard /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute requiredPath="/admin/dashboard"><Dashboard /></ProtectedRoute>} />

          {/* User Management - All roles */}
          <Route path="users/all" element={<ProtectedRoute requiredPath="/admin/users"><AllUsers /></ProtectedRoute>} />
          <Route path="users/pending" element={<ProtectedRoute requiredPath="/admin/users"><PendingApprovals /></ProtectedRoute>} />
          <Route path="users/blocked" element={<ProtectedRoute requiredPath="/admin/users"><AdminBlockedUsers /></ProtectedRoute>} />
          <Route path="users/:id" element={<ProtectedRoute requiredPath="/admin/users"><UserProfile /></ProtectedRoute>} />
          <Route path="users/:id/edit" element={<ProtectedRoute requiredPath="/admin/users"><UserEdit /></ProtectedRoute>} />

          {/* Photo Moderation - All roles */}
          <Route path="photo-moderation" element={<ProtectedRoute requiredPath="/admin/photo-moderation"><PhotoModeration /></ProtectedRoute>} />

          {/* Subscriptions - Super Admin only */}
          <Route path="subscriptions/plans" element={<ProtectedRoute requiredPath="/admin/subscriptions"><AdminSubscriptionPlans /></ProtectedRoute>} />
          <Route path="subscriptions/transactions" element={<ProtectedRoute requiredPath="/admin/subscriptions"><SubscriptionTransactions /></ProtectedRoute>} />
          <Route path="subscriptions/coupons" element={<ProtectedRoute requiredPath="/admin/subscriptions"><CouponManagement /></ProtectedRoute>} />
          <Route path="subscriptions/referrals" element={<ProtectedRoute requiredPath="/admin/subscriptions"><ReferralManagement /></ProtectedRoute>} />

          {/* Matches - Super Admin and Moderator */}
          <Route path="matches" element={<ProtectedRoute requiredPath="/admin/matches"><MatchesManagement /></ProtectedRoute>} />

          {/* Masters - Super Admin only */}
          <Route path="masters" element={<ProtectedRoute requiredPath="/admin/masters"><MastersPage /></ProtectedRoute>} />
          <Route path="masters/:type" element={<ProtectedRoute requiredPath="/admin/masters"><MastersPage /></ProtectedRoute>} />

          {/* Reports - All roles */}
          <Route path="reports" element={<ProtectedRoute requiredPath="/admin/reports"><ReportsComplaints /></ProtectedRoute>} />
          <Route path="flagged-users" element={<ProtectedRoute requiredPath="/admin/flagged-users"><FlaggedUsers /></ProtectedRoute>} />

          {/* Messaging - Super Admin only */}
          <Route path="messaging" element={<ProtectedRoute requiredPath="/admin/messaging"><ChatLogs /></ProtectedRoute>} />

          {/* CMS - All roles */}
          <Route path="cms" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
          <Route path="cms/pages/:slug" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
          <Route path="cms/success-stories" element={<ProtectedRoute requiredPath="/admin/cms"><SuccessStoriesAdmin /></ProtectedRoute>} />

          {/* Notifications - Super Admin and Moderator */}
          <Route path="notifications" element={<ProtectedRoute requiredPath="/admin/notifications"><NotificationManagement /></ProtectedRoute>} />

          {/* Settings - Super Admin only */}
          <Route path="settings" element={<ProtectedRoute requiredPath="/admin/settings"><WebsiteSettings /></ProtectedRoute>} />

          {/* Admin Users - Super Admin only */}
          <Route path="admin-users" element={<ProtectedRoute requiredPath="/admin/admin-users"><AdminUserManagement /></ProtectedRoute>} />
        </Route>
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

