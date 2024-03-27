import fs from 'fs';
import nodeRsa from 'node-rsa';
import { Response } from 'express';
import httpStatusCode from 'http-status-codes';
import { get, isArray, isObject } from 'lodash';

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

export const maskingValue = (value: string) =>
  value.replace(/\d(?=(?:\D*\d){4})/g, '*');

export const successApiResponse = (
  res: Response,
  message: string,
  service = 'Service',
  func = 'Function',
  payload: object | object[] | string,
  statusCode = httpStatusCode.OK
) => {
  let filterPayload = payload;
  if (isObject(filterPayload) && get(filterPayload, 'nric', null)) {
    filterPayload = {
      ...filterPayload,
      nric: maskingValue(get(filterPayload, 'nric'))
    };
  }
  if (isArray(filterPayload)) {
    filterPayload = filterPayload.map((el: { nric?: string }) => {
      if (isObject(el) && get(el, 'nric', null)) {
        return {
          ...el,
          nric: maskingValue(el.nric)
        };
      }
    });
  }

  console.log(`${service} -> ${func} -> ${message}`);
  return res.status(statusCode).json({
    success: true,
    message,
    data: filterPayload
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
