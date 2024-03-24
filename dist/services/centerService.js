"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const dataSource_1 = __importDefault(require("../database/dataSource"));
const Center_1 = require("../database/entity/Center");
class UserService {
    constructor() {
        this.centerRepository = dataSource_1.default.getRepository(Center_1.Center);
    }
    async center(id) {
        const results = await this.centerRepository.findOne({ where: { id } });
        return (0, lodash_1.pick)(results, ['id', 'name', 'status', 'location']);
    }
    async centers(query) {
        const filter = query.status ? query : {};
        const results = await this.centerRepository.find({ where: filter });
        return (0, lodash_1.map)(results, (result) => (0, lodash_1.pick)(result, ['id', 'name', 'status', 'location']));
    }
    async create(payload) {
        const center = new Center_1.Center();
        center.name = payload.name;
        center.location = payload.location;
        center.status = payload.status;
        return this.centerRepository.save(center);
    }
}
exports.default = new UserService();
