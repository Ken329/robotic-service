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
const express_1 = __importDefault(require("express"));
const validators_1 = __importStar(require("../validators"));
const userController_1 = __importDefault(require("../controllers/userController"));
const auth_provider_1 = require("../providers/auth.provider");
const route = (0, express_1.default)();
route.get('/api/user', (0, auth_provider_1.authenticate)([
    auth_provider_1.AUTH_STRATEGY.PROSPECT,
    auth_provider_1.AUTH_STRATEGY.ADMIN,
    auth_provider_1.AUTH_STRATEGY.CENTER
]), userController_1.default.user);
route.post('/api/user/sign-up', (0, validators_1.validate)(validators_1.default.UserValidators.signUp), userController_1.default.signUp);
route.post('/api/user/confirm-sign-up', (0, validators_1.validate)(validators_1.default.UserValidators.confirmSignUp), userController_1.default.confirmSignUp);
route.post('/api/user/center', (0, auth_provider_1.authenticate)(auth_provider_1.AUTH_STRATEGY.ADMIN), (0, validators_1.validate)(validators_1.default.UserValidators.centerCreation), userController_1.default.createCenter);
/**
 * Internal Route For Admin Creation
 */
route.post('/api/user/admin', (0, auth_provider_1.authenticate)(auth_provider_1.AUTH_STRATEGY.APIKEY), (0, validators_1.validate)(validators_1.default.UserValidators.adminCreation), userController_1.default.createAdmin);
exports.default = route;
