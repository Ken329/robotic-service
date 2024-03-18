"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
const verifyUser = async (email, password) => {
    const decryptedPassword = (0, helpers_1.decryption)(password);
    return decryptedPassword;
};
exports.default = { verifyUser };
