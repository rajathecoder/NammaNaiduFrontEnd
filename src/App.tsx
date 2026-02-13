import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ForgotPasswordPage from './pages/ForgotPassword/ForgotPasswordPage';
import OTPPage from './pages/OTPPage/OTPPage';
import BasicDetails from './pages/BasicDetails/BasicDetails';
import PersonalReligiousDetails from './pages/BasicDetails/PersonalReligiousDetails';
import ProfessionalDetails from './pages/BasicDetails/ProfessionalDetails';
import AdditionalDetails from './pages/BasicDetails/AdditionalDetails';
import RegistrationSuccess from './pages/RegistrationSuccess/RegistrationSuccess';
import SubscriptionPlans from './pages/SubscriptionPlans/SubscriptionPlans';
import HomePage from './pages/HomePage/HomePage';
import MyProfile from './pages/MyProfile/MyProfile';
import ProfileDetail from './pages/ProfileDetail/ProfileDetail';
import Interests from './pages/Interests/Interests';
import ConversationsList from './pages/Messages/ConversationsList';
import ChatWindow from './pages/Messages/ChatWindow';
import Search from './pages/Search/Search';
import PartnerPreferences from './pages/PartnerPreferences/PartnerPreferences';
import ProfileSettings from './pages/ProfileSettings/ProfileSettings';
import Recommendations from './pages/Recommendations/Recommendations';
import Matches from './pages/Matches/Matches';
import Notifications from './pages/Notifications/Notifications';
import LandingPage from './pages/LandingPage/LandingPage';
import UserProtectedRoute from './components/common/UserProtectedRoute';
import AdminLayout from './admin/components/layout/AdminLayout';
import ProtectedRoute from './admin/components/common/ProtectedRoute';
import Dashboard from './admin/pages/Dashboard/Dashboard';
import AllUsers from './admin/pages/Users/AllUsers';
import PendingApprovals from './admin/pages/Users/PendingApprovals';
import BlockedUsers from './admin/pages/Users/BlockedUsers';
import UserProfile from './admin/pages/Users/UserProfile';
import UserEdit from './admin/pages/Users/UserEdit';
import PhotoModeration from './admin/pages/PhotoModeration/PhotoModeration';

import AdminSubscriptionPlans from './admin/pages/Subscriptions/SubscriptionPlans';
import SubscriptionTransactions from './admin/pages/Subscriptions/SubscriptionTransactions';
import MatchesManagement from './admin/pages/Matches/MatchesManagement';
import ReportsComplaints from './admin/pages/Reports/ReportsComplaints';
import MastersPage from './admin/pages/Masters/MastersPage';
import ChatLogs from './admin/pages/Messaging/ChatLogs';
import CMSPage from './admin/pages/CMS/CMSPage';
import NotificationManagement from './admin/pages/Notifications/NotificationManagement';
import WebsiteSettings from './admin/pages/Settings/WebsiteSettings';
import AdminUserManagement from './admin/pages/AdminUsers/AdminUserManagement';
import CouponManagement from './admin/pages/Coupons/CouponManagement';
import ReferralManagement from './admin/pages/Referrals/ReferralManagement';
import ReferralPage from './pages/Referral/ReferralPage';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;

