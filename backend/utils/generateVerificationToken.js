import crypto from 'crypto';

export const generateVerificationToken = () => {
  const randomBytes = crypto.randomInt(100000, 999999); // Generates a secure random number in the range
  return randomBytes.toString();
};
