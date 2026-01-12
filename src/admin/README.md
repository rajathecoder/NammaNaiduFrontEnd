# Admin Panel Structure

This folder contains all admin-related components, pages, services, and utilities for the Namma Naidu application.

## Folder Structure

```
admin/
├── pages/              # Admin page components
│   ├── Dashboard.tsx
│   └── Dashboard.css
├── components/         # Reusable admin components
│   ├── common/        # Shared admin components
│   ├── features/      # Feature-specific admin components
│   └── layout/        # Admin layout components
│       ├── AdminLayout.tsx
│       └── AdminLayout.css
├── services/          # Admin API services
│   └── api/
│       └── admin.api.ts
├── types/             # TypeScript type definitions
│   └── index.ts
├── constants/         # Admin constants
│   └── index.ts
├── utils/             # Utility functions
├── hooks/             # Custom React hooks
├── assets/            # Admin assets
│   ├── images/
│   └── styles/
└── README.md          # This file
```

## Usage

### Adding New Admin Pages

1. Create your page component in `admin/pages/`
2. Add corresponding CSS file if needed
3. Update routing in `App.tsx` to include the new route

### Admin API Services

All admin API calls should be made through `admin/services/api/admin.api.ts`. This centralizes API logic and makes it easier to maintain.

### Types

Define admin-specific TypeScript types in `admin/types/index.ts` to ensure type safety across the admin panel.

### Constants

Store admin-related constants (routes, API endpoints, etc.) in `admin/constants/index.ts`.

## Example: Adding a New Admin Page

```typescript
// admin/pages/Users.tsx
import React from 'react';
import { adminApi } from '../services/api/admin.api';
import './Users.css';

const Users: React.FC = () => {
  // Your component logic
  return <div>Users Page</div>;
};

export default Users;
```

Then add the route in `App.tsx`:

```typescript
<Route path="/admin/users" element={<Users />} />
```

## Authentication

Admin routes should be protected with authentication middleware. Store admin tokens in localStorage or a secure state management solution.

