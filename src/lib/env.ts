/**
 * Environment variable utility functions for the application.
 * These functions handle the safe access and type conversion of environment variables.
 */

/**
 * Check if user registration is enabled from environment variable.
 * This controls whether new users can register for the application.
 * 
 * @returns {boolean} True if registration is enabled, false otherwise
 * 
 * Configuration:
 * - Set VITE_REGISTRATION_ENABLED=true in .env to enable registration
 * - Set VITE_REGISTRATION_ENABLED=false in .env to disable registration
 * - If the variable is not set, defaults to false for security
 * 
 * @example
 * // In .env.local:
 * VITE_REGISTRATION_ENABLED=true
 * 
 * // In your component:
 * if (isRegistrationEnabled()) {
 *   // Show registration UI
 * }
 */
export const isRegistrationEnabled = (): boolean => {
  const enabled = import.meta.env.VITE_REGISTRATION_ENABLED
  return enabled === 'true' || enabled === true
} 