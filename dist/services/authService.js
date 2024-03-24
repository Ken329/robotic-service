"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const aws_jwt_verify_1 = require("aws-jwt-verify");
const helpers_1 = require("../utils/helpers");
class AuthService {
    constructor() {
        this.verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
            tokenUse: 'access',
            userPoolId: process.env.COGNITO_POOL_ID,
            clientId: process.env.COGNITO_CLIENT_ID
        });
    }
    async verifyUser(token) {
        const destructureToken = token.split('Bearer ');
        try {
            const result = await this.verifier.verify((0, lodash_1.get)(destructureToken, 1, null));
            return (0, lodash_1.pick)(result, ['sub', 'auth_time', 'exp', 'iat']);
        }
        catch (error) {
            (0, helpers_1.throwErrorsHttp)(error.message, http_status_codes_1.default.UNAUTHORIZED);
        }
    }
}
exports.default = new AuthService();
