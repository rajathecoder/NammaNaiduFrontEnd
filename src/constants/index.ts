// Application constants
// Note: API_BASE_URL is defined in config/api.config.ts
// Use getApiUrl() from config/api.config.ts for API calls

export const APP_NAME = 'Namma Naidu';

export const ROUTES = {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
} as const;

export const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
} as const;

// Add more constants as needed

