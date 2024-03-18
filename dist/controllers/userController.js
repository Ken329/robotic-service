"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../utils/helpers");
const userService_1 = __importDefault(require("../services/userService"));
const signUp = async (req, res) => {
    try {
        const data = await userService_1.default.signUp(req.body);
        return (0, helpers_1.successApiResponse)(res, 'Successfully signed up', 'User Controller', 'Sign Up', data);
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to signed up', 'User Controller', 'Sign Up', error.message);
    }
};
exports.default = { signUp };
