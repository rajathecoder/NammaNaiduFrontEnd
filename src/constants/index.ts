// Application constants

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

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
