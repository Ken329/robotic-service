"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const lodash_1 = require("lodash");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const authValidators_1 = __importDefault(require("./authValidators"));
const helpers_1 = require("../utils/helpers");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        });
        return next();
    }
    catch (error) {
        const errors = (0, lodash_1.get)(error, 'errors', []);
        const message = (0, lodash_1.map)(errors, (error) => `${error.path.join('.')}: ${error.message}`);
        return (0, helpers_1.errorApiResponse)(res, message, 'Validation', 'Request Validation', 'Validation Error', http_status_codes_1.default.BAD_REQUEST);
    }
};
exports.validate = validate;
exports.default = authValidators_1.default;
