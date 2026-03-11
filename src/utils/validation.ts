// src/utils/validation.ts

/**
 * Validates a name (only letters, spaces, and dots allowed).
 * @param name - The name string to validate.
 * @returns true if valid, false otherwise.
 */
export const isValidName = (name: string): boolean => {
    // Allows letters (unicode supported), spaces, dots, hyphens, and apostrophes.
    // Minimum 2 characters, maximum 50.
    const nameRegex = /^[a-zA-Z\u00C0-\u017F\s.'-]{2,50}$/;
    return nameRegex.test(name.trim());
};

/**
 * Validates a mobile number (10-15 digits, allowing for country codes if needed).
 * @param mobile - The mobile number string.
 * @returns true if valid, false otherwise.
 */
export const isValidMobile = (mobile: string): boolean => {
    // Matches 10 to 15 digits.
    const mobileRegex = /^\d{10,15}$/;
    return mobileRegex.test(mobile.replace(/\D/g, ''));
};

/**
 * Validates an email address.
 * @param email - The email string.
 * @returns true if valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
    // Standard email regex (HTML5 spec compliant).
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
};
