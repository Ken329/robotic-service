import fs from 'fs';
import crypto from 'crypto';
import { Response } from 'express';
import { get, isArray, isEmpty, set } from 'lodash';
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
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    process.env.APP_KEY,
    process.env.APP_IV
  );

  let encryptedText = cipher.update(payload, 'utf-8', 'hex');
  encryptedText += cipher.final('hex');
  return encryptedText;
};

export const decryption = (payload: string) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    process.env.APP_KEY,
    process.env.APP_IV
  );

  let decryptedText = decipher.update(payload, 'hex', 'utf-8');
  decryptedText += decipher.final('utf-8');
  return decryptedText;
};

export const maskingValue = (value: string) => {
  if (!value) return null;
  return value.replace(/\d(?=(?:\D*\d){4})/g, '*');
};

export const binaryToBool = (value: boolean) => !!value;

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
  if (isArray(payload)) set(response, 'data', payload);

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
