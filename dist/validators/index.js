"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const lodash_1 = require("lodash");
const zod_1 = require("zod");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const userValidators_1 = __importDefault(require("./userValidators"));
const centerValidators_1 = __importDefault(require("./centerValidators"));
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
const ParamsId = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z
            .string({
            required_error: 'Id is required'
        })
            .uuid('Id is not valid')
    })
});
exports.default = { ParamsId, UserValidators: userValidators_1.default, CenterValidators: centerValidators_1.default };
