
/**
 * Validates that an e-mail is in the following format: sting@string.string
 **/

export const validateEmail = (email: string): boolean => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};