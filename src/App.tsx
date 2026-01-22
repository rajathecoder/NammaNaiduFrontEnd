import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from './pages/LoginPage/LoginPage';
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
import MessagesList from './pages/Messages/MessagesList';
import Search from './pages/Search/Search';
import Matches from './pages/Matches/Matches';
import Notifications from './pages/Notifications/Notifications';
import LandingPage from './pages/LandingPage/LandingPage';
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<OTPPage />} />
        <Route path="/basic-details" element={<BasicDetails />} />
        <Route path="/personal-religious-details" element={<PersonalReligiousDetails />} />
        <Route path="/professional-details" element={<ProfessionalDetails />} />
        <Route path="/additional-details" element={<AdditionalDetails />} />
        <Route path="/registration-success" element={<RegistrationSuccess />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/profile/:id" element={<ProfileDetail />} />
        <Route path="/interests" element={<Interests />} />
        <Route path="/messages" element={<MessagesList />} />
        <Route path="/messages/:id" element={<MessagesList />} />
        <Route path="/search" element={<Search />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/notifications" element={<Notifications />} />

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

