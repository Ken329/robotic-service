"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
const generatePublicKey = (req, res) => {
    try {
        const publicKey = (0, helpers_1.getPublicKey)();
        return (0, helpers_1.successApiResponse)(res, 'Successfully generate public key', 'Auth Controller', 'Generate Public Key', { publicKey });
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed generate public key', 'Auth Controller', 'Generate Public Key', error.message);
    }
};
exports.default = { generatePublicKey };
