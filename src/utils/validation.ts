// Validation utility functions

/**
 * Validates a name.
 * Allows letters (uppercase and lowercase), spaces, dots, hyphens, and apostrophes.
 * Must be between 2 and 50 characters.
 */
export const isValidName = (name: string): boolean => {
  if (!name) return false;
  const trimmedName = name.trim();
  if (trimmedName.length < 2 || trimmedName.length > 50) {
    return false;
  }
  // Regex: start, (letters or dots or spaces or hyphens or apostrophes)+, end
  return /^[a-zA-Z\s.\-']+$/.test(trimmedName);
};

/**
 * Validates an email address.
 * Uses a standard regex pattern.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a mobile number.
 * Expects 7 to 15 digits to accommodate international numbers.
 */
export const isValidMobile = (mobile: string): boolean => {
  if (!mobile) return false;
  return /^\d{7,15}$/.test(mobile);
};

/**
 * Sanitizes input by trimming whitespace.
 * Further sanitization (like HTML escaping) is handled by React,
 * but this ensures clean data storage.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input.trim();
};
