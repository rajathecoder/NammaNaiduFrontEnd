import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import UserProtectedRoute from './components/common/UserProtectedRoute';
import ProtectedRoute from './admin/components/common/ProtectedRoute';
import SimpleSpinner from './components/common/SimpleSpinner';

const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword/ForgotPasswordPage'));
const OTPPage = lazy(() => import('./pages/OTPPage/OTPPage'));
const BasicDetails = lazy(() => import('./pages/BasicDetails/BasicDetails'));
const PersonalReligiousDetails = lazy(() => import('./pages/BasicDetails/PersonalReligiousDetails'));
const ProfessionalDetails = lazy(() => import('./pages/BasicDetails/ProfessionalDetails'));
const AdditionalDetails = lazy(() => import('./pages/BasicDetails/AdditionalDetails'));
const RegistrationSuccess = lazy(() => import('./pages/RegistrationSuccess/RegistrationSuccess'));
const SubscriptionPlans = lazy(() => import('./pages/SubscriptionPlans/SubscriptionPlans'));
const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const MyProfile = lazy(() => import('./pages/MyProfile/MyProfile'));
const ProfileDetail = lazy(() => import('./pages/ProfileDetail/ProfileDetail'));
const Interests = lazy(() => import('./pages/Interests/Interests'));
const ConversationsList = lazy(() => import('./pages/Messages/ConversationsList'));
const ChatWindow = lazy(() => import('./pages/Messages/ChatWindow'));
const Search = lazy(() => import('./pages/Search/Search'));
const PartnerPreferences = lazy(() => import('./pages/PartnerPreferences/PartnerPreferences'));
const ProfileSettings = lazy(() => import('./pages/ProfileSettings/ProfileSettings'));
const Recommendations = lazy(() => import('./pages/Recommendations/Recommendations'));
const Matches = lazy(() => import('./pages/Matches/Matches'));
const Notifications = lazy(() => import('./pages/Notifications/Notifications'));
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const ReferralPage = lazy(() => import('./pages/Referral/ReferralPage'));

const AdminLayout = lazy(() => import('./admin/components/layout/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard/Dashboard'));
const AllUsers = lazy(() => import('./admin/pages/Users/AllUsers'));
const PendingApprovals = lazy(() => import('./admin/pages/Users/PendingApprovals'));
const BlockedUsers = lazy(() => import('./admin/pages/Users/BlockedUsers'));
const UserProfile = lazy(() => import('./admin/pages/Users/UserProfile'));
const UserEdit = lazy(() => import('./admin/pages/Users/UserEdit'));
const PhotoModeration = lazy(() => import('./admin/pages/PhotoModeration/PhotoModeration'));
const AdminSubscriptionPlans = lazy(() => import('./admin/pages/Subscriptions/SubscriptionPlans'));
const SubscriptionTransactions = lazy(() => import('./admin/pages/Subscriptions/SubscriptionTransactions'));
const MatchesManagement = lazy(() => import('./admin/pages/Matches/MatchesManagement'));
const ReportsComplaints = lazy(() => import('./admin/pages/Reports/ReportsComplaints'));
const MastersPage = lazy(() => import('./admin/pages/Masters/MastersPage'));
const ChatLogs = lazy(() => import('./admin/pages/Messaging/ChatLogs'));
const CMSPage = lazy(() => import('./admin/pages/CMS/CMSPage'));
const NotificationManagement = lazy(() => import('./admin/pages/Notifications/NotificationManagement'));
const WebsiteSettings = lazy(() => import('./admin/pages/Settings/WebsiteSettings'));
const AdminUserManagement = lazy(() => import('./admin/pages/AdminUsers/AdminUserManagement'));
const CouponManagement = lazy(() => import('./admin/pages/Coupons/CouponManagement'));
const ReferralManagement = lazy(() => import('./admin/pages/Referrals/ReferralManagement'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex justify-center items-center h-screen"><SimpleSpinner /></div>}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<OTPPage />} />

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
          <Route path="/recommendations" element={<UserProtectedRoute><Recommendations /></UserProtectedRoute>} />
          <Route path="/referral" element={<UserProtectedRoute><ReferralPage /></UserProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<ProtectedRoute requiredPath="/admin/dashboard"><Dashboard /></ProtectedRoute>} />
            <Route path="dashboard" element={<ProtectedRoute requiredPath="/admin/dashboard"><Dashboard /></ProtectedRoute>} />

            {/* User Management - All roles */}
            <Route path="users/all" element={<ProtectedRoute requiredPath="/admin/users"><AllUsers /></ProtectedRoute>} />
            <Route path="users/pending" element={<ProtectedRoute requiredPath="/admin/users"><PendingApprovals /></ProtectedRoute>} />
            <Route path="users/blocked" element={<ProtectedRoute requiredPath="/admin/users"><BlockedUsers /></ProtectedRoute>} />
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

            {/* Messaging - Super Admin only */}
            <Route path="messaging" element={<ProtectedRoute requiredPath="/admin/messaging"><ChatLogs /></ProtectedRoute>} />

            {/* CMS - All roles */}
            <Route path="cms/banners" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
            <Route path="cms/about-us" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
            <Route path="cms/terms-conditions" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
            <Route path="cms/privacy-policy" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
            <Route path="cms/faq" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
            <Route path="cms/blog" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />
            <Route path="cms" element={<ProtectedRoute requiredPath="/admin/cms"><CMSPage /></ProtectedRoute>} />

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
