"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseConnection_1 = __importDefault(require("../databaseConnection"));
const User_1 = require("../entity/User");
const constant_1 = require("../utils/constant");
class UserService {
    constructor() {
        this.User = new User_1.User();
    }
    async create(id, payload) {
        this.User.id = id;
        this.User.status = constant_1.STATUS.PENDING;
        this.User.nric = payload.nric;
        this.User.contact = payload.contact;
        this.User.race = payload.race;
        this.User.personalEmail = payload.personalEmail;
        this.User.moeEmail = payload.moeEmail;
        this.User.school = payload.school;
        this.User.nationality = payload.nationality;
        this.User.center = payload.center;
        this.User.role = payload.role;
        return databaseConnection_1.default.manager.save(this.User);
    }
}
exports.default = new UserService();
