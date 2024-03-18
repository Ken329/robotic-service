"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const crypto_1 = __importDefault(require("crypto"));
const dotenv = __importStar(require("dotenv"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const helpers_1 = require("../utils/helpers");
dotenv.config();
class AwsCognitoService {
    constructor() {
        this.config = {
            apiVersion: '2024-03-16',
            region: 'ap-southeast-2'
        };
        this.secretHash = process.env.COGNITO_CLIENT_SECRET;
        this.clientId = process.env.COGNITO_CLIENT_ID;
        this.cognitoIdentity = new aws_sdk_1.default.CognitoIdentityServiceProvider(this.config);
    }
    async signUpUser(username, password, costCenter, role) {
        try {
            const data = await this.cognitoIdentity
                .signUp({
                ClientId: this.clientId,
                Password: password,
                Username: username,
                SecretHash: this.hashSecret(username),
                UserAttributes: [
                    { Name: 'custom:center', Value: costCenter },
                    { Name: 'custom:role', Value: role }
                ]
            })
                .promise();
            return data.UserSub;
        }
        catch (error) {
            (0, helpers_1.throwErrorsHttp)(error.message, http_status_codes_1.default.BAD_REQUEST);
        }
    }
    async confirmSignUp(username, code) {
        const params = {
            ClientId: this.clientId,
            ConfirmationCode: code,
            Username: username,
            SecretHash: this.hashSecret(username)
        };
        try {
            const cognitoResp = await this.cognitoIdentity
                .confirmSignUp(params)
                .promise();
            console.log(cognitoResp);
            return true;
        }
        catch (error) {
            console.log('error', error);
            return false;
        }
    }
    hashSecret(username) {
        return crypto_1.default
            .createHmac('SHA256', this.secretHash)
            .update(username + this.clientId)
            .digest('base64');
    }
}
exports.default = new AwsCognitoService();
