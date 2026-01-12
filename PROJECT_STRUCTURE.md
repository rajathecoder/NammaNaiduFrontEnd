# Project Structure Documentation

## Overview
This document explains the folder structure and organization of the Namma Naidu React application.

## Directory Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Shared components used across the app
│   │                    # Examples: Button, Input, Modal, Card, etc.
│   ├── features/        # Feature-specific components
│   │                    # Examples: UserProfile, ProductCard, etc.
│   └── layout/          # Layout components
│                        # Examples: Header, Footer, Sidebar, Navigation
│
├── store/               # Redux state management
│   ├── slices/          # Redux slices (feature-based state)
│   │   └── counterSlice.ts  # Example counter slice
│   ├── hooks.ts         # Typed Redux hooks (useAppDispatch, useAppSelector)
│   └── store.ts         # Store configuration and setup
│
├── services/            # External services and API integration
│   └── api/             # API client and endpoint definitions
│
├── hooks/               # Custom React hooks
│                        # Examples: useDebounce, useLocalStorage, etc.
│
├── utils/               # Utility functions and helpers
│                        # Examples: formatDate, validateEmail, etc.
│
├── types/               # TypeScript type definitions
│   └── index.ts         # Shared types and interfaces
│
├── constants/           # Application constants
│   └── index.ts         # API URLs, routes, status codes, etc.
│
├── pages/               # Page components (route-level components)
│                        # Examples: HomePage, AboutPage, ContactPage
│
├── assets/              # Static assets
│   ├── images/          # Image files
│   └── styles/          # Global styles and CSS files
│
├── App.tsx              # Main App component
├── main.tsx             # Application entry point with Redux Provider
└── index.css            # Global CSS styles
```

## Key Concepts

### Components Organization
- **common/**: Reusable UI components that can be used anywhere in the app
- **features/**: Components specific to a particular feature or domain
- **layout/**: Components that define the structure of pages (headers, footers, etc.)

### Redux State Management
The application uses **Redux Toolkit** for state management with TypeScript support.

#### Store Configuration (`store/store.ts`)
- Configures the Redux store with all reducers
- Sets up middleware and Redux DevTools
- Exports typed `RootState` and `AppDispatch` types

#### Typed Hooks (`store/hooks.ts`)
Always use these typed hooks instead of the standard Redux hooks:
```typescript
import { useAppDispatch, useAppSelector } from './store/hooks';

// In your components
const dispatch = useAppDispatch();
const count = useAppSelector((state) => state.counter.value);
```

#### Creating Slices (`store/slices/`)
Each slice represents a feature's state. Example structure:
```typescript
import { createSlice } from '@reduxjs/toolkit';

const mySlice = createSlice({
  name: 'myFeature',
  initialState: { /* ... */ },
  reducers: { /* ... */ },
});

export const { actions } = mySlice.actions;
export default mySlice.reducer;
```

### Services Layer
- **api/**: Contains API client configuration and endpoint definitions
- Separates data fetching logic from components
- Can use with Redux Toolkit's `createAsyncThunk` for async operations

### Custom Hooks
- Place reusable React hooks in the `hooks/` directory
- Examples: `useDebounce`, `useLocalStorage`, `useWindowSize`

### Types
- Define shared TypeScript interfaces and types in `types/index.ts`
- Keep component-specific types in the component file
- Export commonly used types for reuse

### Constants
- Store application-wide constants in `constants/index.ts`
- Examples: API URLs, route paths, status codes, configuration values

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use composition over inheritance
   - Extract reusable logic into custom hooks

2. **State Management**
   - Use Redux for global state that needs to be shared across components
   - Use local state (useState) for component-specific state
   - Always use typed hooks (`useAppDispatch`, `useAppSelector`)

3. **File Naming**
   - Use PascalCase for component files: `Button.tsx`, `UserProfile.tsx`
   - Use camelCase for utility files: `formatDate.ts`, `apiClient.ts`
   - Use descriptive names that reflect the file's purpose

4. **Imports**
   - Use absolute imports from `src/` when possible
   - Group imports: React, third-party, local components, styles

5. **TypeScript**
   - Define interfaces for props, state, and API responses
   - Avoid using `any` type
   - Leverage type inference when possible

## Adding New Features

1. **Create a new slice** in `store/slices/` for feature state
2. **Add the reducer** to `store/store.ts`
3. **Create feature components** in `components/features/`
4. **Add API services** in `services/api/` if needed
5. **Define types** in `types/index.ts` or feature-specific type files
6. **Create a page component** in `pages/` if it's a new route

## Example: Counter Feature

The project includes a working example of the Redux setup with a counter feature:

- **Slice**: `store/slices/counterSlice.ts`
- **Actions**: `increment`, `decrement`, `incrementByAmount`, `reset`, `incrementAsync`
- **Selectors**: `selectCount`, `selectCounterStatus`, `selectCounterError`

You can use this as a reference when creating new features.

## Getting Started

1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`
4. Run linter: `npm run lint`

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
