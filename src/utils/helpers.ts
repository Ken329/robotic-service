import fs from 'fs';
import nodeRsa from 'node-rsa';
import { Response } from 'express';
import { get, isEmpty, set } from 'lodash';
import httpStatusCode from 'http-status-codes';

interface ErrorWithStatus extends Error {
  status: number;
}

export const throwErrorsHttp = (message = 'Error', httpStatusCode = 400) => {
  const error = new Error(message) as ErrorWithStatus;
  error.status = httpStatusCode;
  throw error;
};

export const getPublicKey = () =>
  fs.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');

export const encryption = (payload: string) => {
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

export const maskingValue = (value: string) => {
  if (!value) return null;
  return value.replace(/\d(?=(?:\D*\d){4})/g, '*');
};

export const successApiResponse = (
  res: Response,
  message: string,
  payload?: any,
  statusCode = httpStatusCode.OK
) => {
  const response = {
    success: true,
    message
  };
  if (!isEmpty(payload)) {
    const nric = get(payload, 'nric', null);
    if (nric) set(payload, 'nric', maskingValue(nric));
    set(response, 'data', payload);
  }
  return res.status(statusCode).json(response);
};

export const errorApiResponse = (
  res: Response,
  message: string | string[],
  statusCode = httpStatusCode.INTERNAL_SERVER_ERROR
) =>
  res.status(statusCode).json({
    success: false,
    message
  });
