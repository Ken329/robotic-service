"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const constant_1 = require("../utils/constant");
const awsCognitoService_1 = __importDefault(require("../services/awsCognitoService"));
const helpers_1 = require("../utils/helpers");
const user = async (req, res) => (0, helpers_1.successApiResponse)(res, 'Successfully get user', 'User Controller', 'Get user', req.user);
const signUp = async (req, res) => {
    try {
        const user = await userService_1.default.create(req.body.email, req.body.password, {
            ...req.body,
            role: constant_1.ROLE.STUDENT
        });
        return (0, helpers_1.successApiResponse)(res, 'Successfully signed up', 'User Controller', 'Sign Up', {
            id: user.id,
            email: req.body.email,
            status: user.status,
            center: user.center,
            role: user.role
        });
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to signed up', 'User Controller', 'Sign Up', error.message);
    }
};
const createCenter = async (req, res) => {
    try {
        const user = await userService_1.default.create(req.body.email, req.body.password, {
            role: constant_1.ROLE.CENTER,
            status: constant_1.USER_STATUS.APPROVED,
            center: req.body.center
        });
        return (0, helpers_1.successApiResponse)(res, 'Successfully confirm signed up', 'User Controller', 'Confirm Signed Up', {
            id: user.id,
            email: req.body.email,
            status: user.status,
            center: user.center,
            role: user.role
        });
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to confirm signed up', 'User Controller', 'Confirm Signed Up', error.message);
    }
};
const createAdmin = async (req, res) => {
    try {
        const user = await userService_1.default.create(req.body.email, req.body.password, {
            role: constant_1.ROLE.ADMIN,
            status: constant_1.USER_STATUS.APPROVED
        });
        return (0, helpers_1.successApiResponse)(res, 'Successfully confirm signed up', 'User Controller', 'Confirm Signed Up', {
            id: user.id,
            email: req.body.email,
            status: user.status,
            role: user.role
        });
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to confirm signed up', 'User Controller', 'Confirm Signed Up', error.message);
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
exports.default = { user, signUp, createCenter, createAdmin, confirmSignUp };
