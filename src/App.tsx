import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Loading from './components/common/Loading';
import ProtectedRoute from './admin/components/common/ProtectedRoute';

// Lazy load user pages
const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage/RegisterPage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
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
const MessagesList = lazy(() => import('./pages/Messages/MessagesList'));
const Search = lazy(() => import('./pages/Search/Search'));
const Matches = lazy(() => import('./pages/Matches/Matches'));
const Notifications = lazy(() => import('./pages/Notifications/Notifications'));

// Lazy load admin components
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

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading fullScreen />}>
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
