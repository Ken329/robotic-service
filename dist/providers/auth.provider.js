"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.AUTH_STRATEGY = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_custom_1 = __importDefault(require("passport-custom"));
exports.AUTH_STRATEGY = {
    PROSPECT: 'prospect'
};
const CustomStrategy = passport_custom_1.default.Strategy;
const authenticate = (guard) => (req, res, next) => passport_1.default.authenticate(guard, (error, user) => {
    if (error || !user) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }
    return next();
})(req, res, next);
exports.authenticate = authenticate;
const prospect = async (req, done) => {
    req.user = {
        id: 'test'
    };
    return done(null, req.user);
};
const registerPassportPolicies = () => {
    passport_1.default.use(exports.AUTH_STRATEGY.PROSPECT, new CustomStrategy(prospect));
    return passport_1.default.initialize();
};
exports.default = { registerPassportPolicies };
