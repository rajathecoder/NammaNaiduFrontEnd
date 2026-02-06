/**
 * Validation utility functions for security and data integrity.
 */

// Regex for basic email validation
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Regex for name validation (letters, spaces, dots, apostrophes, hyphens)
const NAME_REGEX = /^[a-zA-Z\s'.\-]+$/;

/**
 * Validates a mobile number based on country code.
 * @param mobile - The mobile number string.
 * @param countryCode - The country code (e.g., '+91').
 * @returns boolean - True if valid, false otherwise.
 */
export const isValidMobile = (mobile: string, countryCode: string = '+91'): boolean => {
  if (!mobile) return false;

  // Remove non-digit characters to check length
  const cleaned = mobile.replace(/\D/g, '');

  // Basic check: must contain digits
  if (cleaned.length === 0) return false;

  // Specific check for India (+91)
  if (countryCode === '+91') {
    return cleaned.length === 10;
  }

  // General check for other countries (allowing 7-15 digits as per E.164 roughly)
  return cleaned.length >= 7 && cleaned.length <= 15;
};

/**
 * Validates a name.
 * @param name - The name string.
 * @returns boolean - True if valid.
 */
export const isValidName = (name: string): boolean => {
  if (!name) return false;
  const trimmed = name.trim();

  if (trimmed.length < 2 || trimmed.length > 50) return false;

  return NAME_REGEX.test(trimmed);
};

/**
 * Validates an email address.
 * @param email - The email string.
 * @returns boolean - True if valid.
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  if (email.length > 254) return false; // RFC 5321
  return EMAIL_REGEX.test(email);
};

/**
 * Sanitizes input by removing potential HTML tags and trimming.
 * @param input - The input string.
 * @returns string - Sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  // Trim whitespace
  let sanitized = input.trim();
  // Remove HTML tags (basic XSS prevention for storage)
  sanitized = sanitized.replace(/<[^>]*>?/gm, '');
  return sanitized;
};
