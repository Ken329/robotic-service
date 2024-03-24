"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const centerService_1 = __importDefault(require("./centerService"));
const awsCognitoService_1 = __importDefault(require("./awsCognitoService"));
const dataSource_1 = __importDefault(require("../database/dataSource"));
const helpers_1 = require("../utils/helpers");
const constant_1 = require("../utils/constant");
const User_1 = require("../database/entity/User");
const Center_1 = require("../database/entity/Center");
class UserService {
    constructor() {
        this.userRepository = dataSource_1.default.getRepository(User_1.User);
        this.centerRepository = dataSource_1.default.getRepository(Center_1.Center);
    }
    async get(id) {
        const user = await this.userRepository.findOne({
            where: { id }
            // relations: ['center']
        });
        if (!user)
            (0, helpers_1.throwErrorsHttp)('User not found', http_status_codes_1.default.NOT_FOUND);
        return {
            id: user.id,
            status: user.status,
            center: user.center,
            role: user.role,
            nric: user.nric,
            contact: user.contact,
            personalEmail: user.personalEmail,
            moeEmail: user.moeEmail,
            race: user.race,
            school: user.school,
            nationality: user.nationality
        };
    }
    async create(email, password, payload) {
        const center = await centerService_1.default.center(payload.center);
        const centerStatus = (0, lodash_1.get)(center, 'status', null);
        if ((payload.role === constant_1.ROLE.STUDENT &&
            centerStatus !== constant_1.CENTER_STATUS.ASSIGNED) ||
            (payload.role === constant_1.ROLE.CENTER &&
                centerStatus !== constant_1.CENTER_STATUS.NOT_ASSIGN)) {
            (0, helpers_1.throwErrorsHttp)('Center is valid', http_status_codes_1.default.BAD_REQUEST);
        }
        const decryptedPassword = (0, helpers_1.decryption)(password);
        const cognitoUser = await awsCognitoService_1.default.signUp(email, decryptedPassword);
        const user = new User_1.User();
        user.id = cognitoUser.id;
        user.role = payload.role;
        user.status = (0, lodash_1.get)(payload, 'status', constant_1.USER_STATUS.PENDING);
        user.nric = payload.nric;
        user.contact = payload.contact;
        user.race = payload.race;
        user.personalEmail = payload.personalEmail;
        user.moeEmail = payload.moeEmail;
        user.school = payload.school;
        user.nationality = payload.nationality;
        user.center = payload.center;
        const result = await this.userRepository.save(user);
        if (payload.role === constant_1.ROLE.CENTER) {
            await this.centerRepository.update({ id: result.center }, { status: constant_1.CENTER_STATUS.ASSIGNED });
        }
        return result;
    }
}
exports.default = new UserService();
