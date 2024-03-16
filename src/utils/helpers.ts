import fs from 'fs';
import nodeRsa from 'node-rsa';
import { Response } from 'express';
import httpStatusCode from 'http-status-codes';

interface ErrorWithStatus extends Error {
  status: number;
}

export const throwErrorsHttp = (message = 'Error', httpStatusCode = 400) => {
  const error = new Error(message) as ErrorWithStatus;
  error.status = httpStatusCode;
  throw error;
};

export const successApiResponse = (
  res: Response,
  message: string,
  service = 'Service',
  func = 'Function',
  payload: object | string,
  statusCode = httpStatusCode.OK
) => {
  console.log(`${service} -> ${func} -> ${message}`);
  return res.status(statusCode).json({
    success: true,
    message,
    data: payload
  });
};

export const errorApiResponse = (
  res: Response,
  message: string | string[],
  service = 'Service',
  func = 'Function',
  loggerMesage?: string,
  statusCode = httpStatusCode.INTERNAL_SERVER_ERROR
) => {
  console.error(`${service} -> ${func} -> ${loggerMesage || message}`);
  return res.status(statusCode).json({
    success: false,
    message
  });
};

export const getPublicKey = () =>
  fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

export const encryption = (payload: object) => {
  try {
    const rsaEncryption = new nodeRsa(getPublicKey());
    const encryptedData = rsaEncryption.encrypt(payload, 'base64');
    return encryptedData;
  } catch (error) {
    throwErrorsHttp('Invalid encryption key path', httpStatusCode.NOT_FOUND);
  }
};

export const decryption = (payload: string) => {
  try {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
    const rsaDecryption = new nodeRsa(privateKey);
    const encryptedData = rsaDecryption.decrypt(payload, 'utf8');
    return encryptedData;
  } catch (error) {
    throwErrorsHttp('Invalid decryption key path', httpStatusCode.NOT_FOUND);
  }
};
