import { decryption } from '../utils/helpers';

const verifyUser = async (email: string, password: string) => {
  const decryptedPassword = decryption(password);
  return decryptedPassword;
};

export default { verifyUser };
