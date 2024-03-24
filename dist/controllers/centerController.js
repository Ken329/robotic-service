"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constant_1 = require("../utils/constant");
const centerService_1 = __importDefault(require("../services/centerService"));
const helpers_1 = require("../utils/helpers");
const centers = async (req, res) => {
    try {
        const data = await centerService_1.default.centers(req.query);
        return (0, helpers_1.successApiResponse)(res, 'Successfully signed up', 'User Controller', 'Sign Up', data);
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to signed up', 'User Controller', 'Sign Up', error.message);
    }
};
const createCenter = async (req, res) => {
    try {
        const data = await centerService_1.default.create({
            ...req.body,
            status: constant_1.CENTER_STATUS.NOT_ASSIGN
        });
        return (0, helpers_1.successApiResponse)(res, 'Successfully signed up', 'User Controller', 'Sign Up', (0, lodash_1.pick)(data, ['id', 'name', 'location', 'status']));
    }
    catch (error) {
        return (0, helpers_1.errorApiResponse)(res, 'Failed to signed up', 'User Controller', 'Sign Up', error.message);
    }
};
exports.default = { centers, createCenter };
