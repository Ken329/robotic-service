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
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
dotenv.config();
class AwsCognitoService {
    constructor() {
        this.UserPool = new amazon_cognito_identity_js_1.CognitoUserPool({
            UserPoolId: process.env.COGNITO_POOL_ID,
            ClientId: process.env.COGNITO_CLIENT_ID
        });
    }
    async signUp(email, password) {
        return new Promise((resolve, reject) => {
            this.UserPool.signUp(email, password, [], null, (err, result) => {
                err
                    ? reject({ message: err.message })
                    : resolve({
                        id: result.userSub,
                        email: result.user.getUsername(),
                        confirmation: result.userConfirmed
                    });
            });
        });
    }
    async confirmedSignUp(email, code) {
        const User = new amazon_cognito_identity_js_1.CognitoUser({ Username: email, Pool: this.UserPool });
        return new Promise((resolve, reject) => {
            User.confirmRegistration(code, true, (err, result) => err ? reject({ message: err.message }) : resolve(result));
        });
    }
}
exports.default = new AwsCognitoService();
