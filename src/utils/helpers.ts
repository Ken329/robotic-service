// import fs from 'fs';
// import nodeRsa from 'node-rsa';

interface ErrorWithStatus extends Error {
  status: number;
}

export const throwErrorsHttp = (message = 'Error', httpStatusCode = 400) => {
  const error = new Error(message) as ErrorWithStatus;
  error.status = httpStatusCode;
  throw error;
};

// export const encryption = (payload) => {
//   try {
//     const publicKey = fs.readFileSync('../public.pem', 'utf8');
//     const rsaEncryption = new nodeRsa(publicKey);
//     const encryptedData = rsaEncryption.encrypt(payload);
//     return encryptedData;
//   } catch (error) {
//     throwErrorsHttp('Invalid encryuotuion value', 400);
//   }
// };

// export const decryption = (payload) => {
//   try {
//     const privateKey = fs.readFileSync('../private.pem', 'utf8');
//     const rsaDecryption = new nodeRsa(privateKey);
//     const encryptedData = rsaDecryption.decrypt(payload);
//     return encryptedData;
//   } catch (error) {
//     throwErrorsHttp('Invalid encryuotuion value', 400);
//   }
// };
