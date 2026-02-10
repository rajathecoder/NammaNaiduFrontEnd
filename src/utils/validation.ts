// Validation utilities

/**
 * Validates an email address.
 * @param email The email address to validate.
 * @returns true if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a mobile number (assuming 10 digits).
 * @param mobile The mobile number to validate.
 * @returns true if the mobile number is valid (10 digits), false otherwise.
 */
export const isValidMobile = (mobile: string): boolean => {
  const mobileRegex = /^\d{10}$/;
  return mobileRegex.test(mobile);
};

/**
 * Validates a name (only letters and spaces, min 2 chars).
 * @param name The name to validate.
 * @returns true if the name is valid, false otherwise.
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s'-.]{2,50}$/;
  return nameRegex.test(name.trim());
};

/**
 * Validates an OTP (6 digits).
 * @param otp The OTP to validate.
 * @returns true if the OTP is valid, false otherwise.
 */
export const isValidOTP = (otp: string): boolean => {
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(otp);
};

/**
 * Sanitizes input by trimming whitespace.
 * @param input The input string to sanitize.
 * @returns The sanitized string.
 */
export const sanitizeInput = (input: string): string => {
  return input.trim();
};

/**
 * Escapes HTML characters to prevent XSS.
 * @param str The string to escape.
 * @returns The escaped string.
 */
export const escapeHtml = (str: string): string => {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};
