"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryption = exports.encryption = exports.getPublicKey = exports.errorApiResponse = exports.successApiResponse = exports.throwErrorsHttp = void 0;
const fs_1 = __importDefault(require("fs"));
const node_rsa_1 = __importDefault(require("node-rsa"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const throwErrorsHttp = (message = 'Error', httpStatusCode = 400) => {
    const error = new Error(message);
    error.status = httpStatusCode;
    throw error;
};
exports.throwErrorsHttp = throwErrorsHttp;
const successApiResponse = (res, message, service = 'Service', func = 'Function', payload, statusCode = http_status_codes_1.default.OK) => {
    console.log(`${service} -> ${func} -> ${message}`);
    return res.status(statusCode).json({
        success: true,
        message,
        data: payload
    });
};
exports.successApiResponse = successApiResponse;
const errorApiResponse = (res, message, service = 'Service', func = 'Function', loggerMesage, statusCode = http_status_codes_1.default.INTERNAL_SERVER_ERROR) => {
    console.error(`${service} -> ${func} -> ${loggerMesage || message}`);
    return res.status(statusCode).json({
        success: false,
        message
    });
};
exports.errorApiResponse = errorApiResponse;
const getPublicKey = () => fs_1.default.readFileSync(process.env.PUBLIC_KEY_PATH, 'utf8');
exports.getPublicKey = getPublicKey;
const encryption = (payload) => {
    try {
        const rsaEncryption = new node_rsa_1.default((0, exports.getPublicKey)());
        const encryptedData = rsaEncryption.encrypt(payload, 'base64');
        return encryptedData;
    }
    catch (error) {
        (0, exports.throwErrorsHttp)('Invalid encryption key path', http_status_codes_1.default.NOT_FOUND);
    }
};
exports.encryption = encryption;
const decryption = (payload) => {
    try {
        const privateKey = fs_1.default.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
        const rsaDecryption = new node_rsa_1.default(privateKey);
        const encryptedData = rsaDecryption.decrypt(payload, 'utf8');
        return encryptedData;
    }
    catch (error) {
        (0, exports.throwErrorsHttp)('Invalid decryption key path', http_status_codes_1.default.NOT_FOUND);
    }
};
exports.decryption = decryption;
