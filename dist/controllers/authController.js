"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
const authService_1 = __importDefault(require("../services/authService"));
const generatePublicKey = (req, res) => {
    try {
        const publicKey = (0, helpers_1.getPublicKey)();
        return (0, helpers_1.successApiResponse)(res, 'Successfully generate public key', 'Auth Controller', 'Generate Public Key', { publicKey });
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed generate public key', 'Auth Controller', 'Generate Public Key', error.message);
    }
};
const verifyUser = async (req, res) => {
    try {
        const data = await authService_1.default.verifyUser(req.body.email, req.body.password);
        return (0, helpers_1.successApiResponse)(res, 'Successfully verified user', 'Auth Controller', 'Verify User', data);
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to verify user', 'Auth Controller', 'Verify user', error.message);
    }
};
exports.default = { generatePublicKey, verifyUser };
