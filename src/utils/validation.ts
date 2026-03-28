/**
 * Validates an email address.
 * @param email - The email address to validate.
 * @returns true if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password.
 * Policy: Min 8 chars, 1 uppercase, 1 lowercase, 1 number.
 * @param password - The password to validate.
 * @returns true if the password is valid, false otherwise.
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number.
  // Allows any other characters.
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a phone number.
 * Policy: 10 digits.
 * @param phone - The phone number to validate.
 * @returns true if the phone number is valid, false otherwise.
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Sanitizes input to prevent basic XSS.
 * @param input - The input string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
