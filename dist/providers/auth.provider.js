"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = exports.AUTH_STRATEGY = void 0;
const passport_1 = __importDefault(require("passport"));
const lodash_1 = require("lodash");
const passport_custom_1 = __importDefault(require("passport-custom"));
const constant_1 = require("../utils/constant");
const authService_1 = __importDefault(require("../services/authService"));
const userService_1 = __importDefault(require("../services/userService"));
const helpers_1 = require("../utils/helpers");
exports.AUTH_STRATEGY = {
    APIKEY: 'apiKey',
    PROSPECT: 'prospect',
    ADMIN: 'admin',
    CENTER: 'center'
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
const verifyApiKey = async (req, done) => {
    const apiKey = req.get('x-api-key');
    if ((0, lodash_1.isEmpty)(apiKey) || apiKey !== process.env.API_KEY)
        return done(null, false);
    req.user = {
        role: constant_1.ROLE.ADMIN
    };
    return done(null, req.user);
};
const verifyProspect = async (req, done) => {
    const token = req.get('Authorization');
    if ((0, lodash_1.isEmpty)(token))
        return done(null, false);
    try {
        const session = await authService_1.default.verifyUser(token);
        const user = await userService_1.default.get(session.sub);
        if (user.role !== constant_1.ROLE.STUDENT)
            (0, helpers_1.throwErrorsHttp)('Role is not matched');
        req.user = user;
        return done(null, req.user);
    }
    catch (error) {
        console.log(error.message);
        return done(null, false);
    }
};
const verifyCenter = async (req, done) => {
    const token = req.get('Authorization');
    if ((0, lodash_1.isEmpty)(token))
        return done(null, false);
    try {
        const session = await authService_1.default.verifyUser(token);
        const user = await userService_1.default.get(session.sub);
        if (user.role !== constant_1.ROLE.CENTER)
            (0, helpers_1.throwErrorsHttp)('Role is not matched');
        req.user = user;
        return done(null, req.user);
    }
    catch (error) {
        console.log(error.message);
        return done(null, false);
    }
};
const verifyAdmin = async (req, done) => {
    const token = req.get('Authorization');
    if ((0, lodash_1.isEmpty)(token))
        return done(null, false);
    try {
        const session = await authService_1.default.verifyUser(token);
        const user = await userService_1.default.get(session.sub);
        if (user.role !== constant_1.ROLE.ADMIN)
            (0, helpers_1.throwErrorsHttp)('Role is not matched');
        req.user = user;
        return done(null, req.user);
    }
    catch (error) {
        console.log(error.message);
        return done(null, false);
    }
};
const registerPassportPolicies = () => {
    /**
     * Register all the strategy here
     */
    passport_1.default.use(exports.AUTH_STRATEGY.APIKEY, new CustomStrategy(verifyApiKey));
    passport_1.default.use(exports.AUTH_STRATEGY.PROSPECT, new CustomStrategy(verifyProspect));
    passport_1.default.use(exports.AUTH_STRATEGY.ADMIN, new CustomStrategy(verifyAdmin));
    passport_1.default.use(exports.AUTH_STRATEGY.CENTER, new CustomStrategy(verifyCenter));
    return passport_1.default.initialize();
};
exports.default = { registerPassportPolicies };
