import 'dotenv/config';

/**
 * Validates that a required environment variable exists and returns its value
 * @param {string} key - The environment variable key to check
 * @returns {string} The value of the environment variable
 * @throws {Error} If the environment variable is not set
 */
function required(key) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Define application configuration with required environment variables
const env = {
  SERVER_PORT: required('SERVER_PORT'),
  DATABASE_URL: required('DATABASE_URL'),
};

export { env };
