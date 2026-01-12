# Admin API Availability Status

This document lists all APIs used in admin pages and their availability status in the backend.

## ✅ Available APIs

### 1. Admin Users Management
- **GET** `/api/admin/admin-users` - ✅ Available (with filters: status, role, search, page, limit)
- **GET** `/api/admin/admin-users/:id` - ✅ Available
- **POST** `/api/admin/admin-users` - ✅ Available
- **PUT** `/api/admin/admin-users/:id` - ✅ Available
- **DELETE** `/api/admin/admin-users/:id` - ✅ Available
- **PUT** `/api/admin/admin-users/:id/status` - ✅ Available

### 2. Master Data Management
- **GET** `/api/admin/:type` - ✅ Available (types: religion, caste, occupation, location, education, employment-type, income-currency, income-range)
- **GET** `/api/admin/:type/:id` - ✅ Available
- **POST** `/api/admin/:type` - ✅ Available
- **PUT** `/api/admin/:type/:id` - ✅ Available
- **DELETE** `/api/admin/:type/:id` - ✅ Available

### 3. Subscription Management
- **GET** `/api/admin/plans` - ✅ Available (with filters: status, planType)
- **GET** `/api/admin/plans/:id` - ✅ Available
- **POST** `/api/admin/plans` - ✅ Available
- **PUT** `/api/admin/plans/:id` - ✅ Available
- **DELETE** `/api/admin/plans/:id` - ✅ Available
- **GET** `/api/admin/transactions` - ✅ Available (with filters: status, paymentMethod, startDate, endDate, search, page, limit)
- **GET** `/api/admin/transactions/:id` - ✅ Available
- **POST** `/api/admin/transactions` - ✅ Available
- **PUT** `/api/admin/transactions/:id` - ✅ Available

## ⚠️ APIs with Issues

### 1. User Management
- **GET** `/api/users` - ⚠️ **ISSUE**: Uses user authentication middleware, not admin authentication
  - **Problem**: Admin tokens won't work with this endpoint
  - **Used in**: AllUsers.tsx
  - **Solution Needed**: Create `/api/admin/users` endpoint with admin authentication middleware

- **GET** `/api/users/:id` - ⚠️ **ISSUE**: Uses user authentication middleware
  - **Problem**: Admin tokens won't work with this endpoint
  - **Used in**: UserProfile.tsx, UserEdit.tsx
  - **Solution Needed**: Create `/api/admin/users/:id` endpoint

- **PUT** `/api/users/:id/status` - ⚠️ **ISSUE**: Uses user authentication middleware
  - **Problem**: Admin tokens won't work with this endpoint
  - **Used in**: AllUsers.tsx (handleBlock function)
  - **Solution Needed**: Create `/api/admin/users/:id/status` endpoint

## ❌ Missing APIs (Using Mock Data)

### 1. Dashboard
- **GET** `/api/admin/dashboard` - ❌ **MISSING**
  - **Used in**: Dashboard.tsx
  - **Current**: Using mock/simulated data
  - **Needed**: Endpoint to return dashboard statistics

### 2. Reports & Complaints
- **GET** `/api/admin/reports` - ❌ **MISSING**
  - **Used in**: ReportsComplaints.tsx
  - **Current**: Using mock data
  - **Needed**: Endpoint to fetch reports/complaints

- **PUT** `/api/admin/reports/:id/status` - ❌ **MISSING**
  - **Used in**: ReportsComplaints.tsx (handleStatusChange)
  - **Needed**: Endpoint to update report status

- **POST** `/api/admin/reports/:id/ban` - ❌ **MISSING**
  - **Used in**: ReportsComplaints.tsx (handleBanUser)
  - **Needed**: Endpoint to ban reported users

### 3. Matches Management
- **GET** `/api/admin/matches` - ❌ **MISSING**
  - **Used in**: MatchesManagement.tsx
  - **Current**: Using mock data
  - **Needed**: Endpoint to fetch matches

- **GET** `/api/admin/matches/:id` - ❌ **MISSING**
  - **Used in**: MatchesManagement.tsx
  - **Needed**: Endpoint to get match details

- **POST** `/api/admin/matches/export` - ❌ **MISSING**
  - **Used in**: MatchesManagement.tsx (Export button)
  - **Needed**: Endpoint to export matches

### 4. User Management (Additional)
- **GET** `/api/admin/users/pending` - ❌ **MISSING**
  - **Used in**: PendingApprovals.tsx
  - **Current**: Using mock data
  - **Needed**: Endpoint to fetch pending user approvals

- **GET** `/api/admin/users/blocked` - ❌ **MISSING**
  - **Used in**: BlockedUsers.tsx
  - **Current**: Using mock data
  - **Needed**: Endpoint to fetch blocked users

- **PUT** `/api/admin/users/:id/block` - ❌ **MISSING**
  - **Used in**: AllUsers.tsx, BlockedUsers.tsx
  - **Needed**: Endpoint to block/unblock users

- **DELETE** `/api/admin/users/:id` - ❌ **MISSING**
  - **Used in**: AllUsers.tsx (handleDelete)
  - **Needed**: Endpoint to delete users

- **PUT** `/api/admin/users/:id` - ❌ **MISSING**
  - **Used in**: UserEdit.tsx
  - **Needed**: Endpoint to update user details

### 5. Photo Moderation
- **GET** `/api/admin/photo-moderation` - ❌ **MISSING**
  - **Used in**: PhotoModeration.tsx
  - **Current**: Using mock data
  - **Needed**: Endpoint to fetch photos pending moderation

- **POST** `/api/admin/photo-moderation/:id/approve` - ❌ **MISSING**
  - **Used in**: PhotoModeration.tsx
  - **Needed**: Endpoint to approve photos

- **POST** `/api/admin/photo-moderation/:id/reject` - ❌ **MISSING**
  - **Used in**: PhotoModeration.tsx
  - **Needed**: Endpoint to reject photos

### 6. CMS (Content Management System)
- **GET** `/api/admin/cms/:type` - ❌ **MISSING**
  - **Used in**: CMSPage.tsx
  - **Needed**: Endpoint to fetch CMS content (banners, about-us, terms-conditions, etc.)

- **POST** `/api/admin/cms/:type` - ❌ **MISSING**
  - **Used in**: CMSPage.tsx
  - **Needed**: Endpoint to save CMS content

- **POST** `/api/admin/cms/banners/upload` - ❌ **MISSING**
  - **Used in**: CMSPage.tsx
  - **Needed**: Endpoint to upload banner images

- **DELETE** `/api/admin/cms/banners/:id` - ❌ **MISSING**
  - **Used in**: CMSPage.tsx
  - **Needed**: Endpoint to delete banners

### 7. Notifications
- **POST** `/api/admin/notifications/push` - ❌ **MISSING**
  - **Used in**: NotificationManagement.tsx
  - **Needed**: Endpoint to send push notifications

- **POST** `/api/admin/notifications/email` - ❌ **MISSING**
  - **Used in**: NotificationManagement.tsx
  - **Needed**: Endpoint to send email notifications

- **GET** `/api/admin/notifications/templates` - ❌ **MISSING**
  - **Used in**: NotificationManagement.tsx
  - **Needed**: Endpoint to fetch notification templates

- **POST** `/api/admin/notifications/scheduled` - ❌ **MISSING**
  - **Used in**: NotificationManagement.tsx
  - **Needed**: Endpoint to schedule notifications

### 8. Settings
- **GET** `/api/admin/settings` - ❌ **MISSING**
  - **Used in**: WebsiteSettings.tsx
  - **Needed**: Endpoint to fetch website settings

- **PUT** `/api/admin/settings` - ❌ **MISSING**
  - **Used in**: WebsiteSettings.tsx
  - **Needed**: Endpoint to update website settings

- **POST** `/api/admin/settings/logo` - ❌ **MISSING**
  - **Used in**: WebsiteSettings.tsx
  - **Needed**: Endpoint to upload logo

### 9. Messaging/Chat Logs
- **GET** `/api/admin/messaging/logs` - ❌ **MISSING**
  - **Used in**: ChatLogs.tsx
  - **Current**: Using mock data
  - **Needed**: Endpoint to fetch chat logs

## Summary

- **Available**: 15 endpoints (Admin Users, Masters, Subscriptions)
- **With Issues**: 3 endpoints (User management - authentication mismatch)
- **Missing**: 30+ endpoints (Dashboard, Reports, Matches, Photo Moderation, CMS, Notifications, Settings, Messaging, and additional User management endpoints)

## Priority Fixes Needed

1. **HIGH PRIORITY**: Create admin authentication middleware and `/api/admin/users` endpoints
2. **MEDIUM PRIORITY**: Dashboard API, Reports API, Matches API
3. **LOW PRIORITY**: CMS, Notifications, Settings, Messaging APIs

