// Common TypeScript types and interfaces

export interface User {
    id: string;
    name: string;
    email: string;
}

export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

// Add more shared types as needed
