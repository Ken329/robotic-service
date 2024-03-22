"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const userService_1 = __importDefault(require("../services/userService"));
const awsCognitoService_1 = __importDefault(require("../services/awsCognitoService"));
const helpers_1 = require("../utils/helpers");
const user = async (req, res) => {
    try {
        // const data = await AwsCognitoService.getUserAttributes(req.params.email);
        return (0, helpers_1.successApiResponse)(res, 'Successfully get user', 'User Controller', 'Get user', {});
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to get user', 'User Controller', 'Get user', error.message);
    }
};
const signUp = async (req, res) => {
    try {
        const data = await awsCognitoService_1.default.signUp(req.body.email, req.body.password);
        const user = await userService_1.default.create(data.id, req.body);
        return (0, helpers_1.successApiResponse)(res, 'Successfully signed up', 'User Controller', 'Sign Up', { ...data, ...(0, lodash_1.pick)(user, ['status', 'center', 'role']) });
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to signed up', 'User Controller', 'Sign Up', error.message);
    }
};
const confirmSignUp = async (req, res) => {
    try {
        const data = await awsCognitoService_1.default.confirmedSignUp(req.body.email, req.body.code);
        return (0, helpers_1.successApiResponse)(res, 'Successfully confirm signed up', 'User Controller', 'Confirm Signed Up', data);
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to confirm signed up', 'User Controller', 'Confirm Signed Up', error.message);
    }
};
exports.default = { user, signUp, confirmSignUp };
