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
const lodash_1 = require("lodash");
const sequelize_1 = require("sequelize");
dotenv.config();
const DB_CONNECTION = (0, lodash_1.defaultTo)(process.env.DB_CONNECTION, 'mssql');
const DB_HOST = (0, lodash_1.defaultTo)(process.env.DB_HOST, 'localhost');
const DB_PORT = (0, lodash_1.defaultTo)(process.env.DB_PORT, 1433);
const DB_NAME = (0, lodash_1.defaultTo)(process.env.DB_NAME, 'robotic-service');
const DB_USERNAME = (0, lodash_1.defaultTo)(process.env.DB_USERNAME, 'sa');
const DB_PASSWORD = (0, lodash_1.defaultTo)(process.env.DB_PASSWORD, 'robotic-service');
const sequelizeConnection = new sequelize_1.Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_CONNECTION,
    dialectOptions: {
        options: {
            encrypt: true
        }
    },
    logging: false,
    pool: {
        max: 1,
        min: 0,
        idle: 10000
    }
});
exports.default = sequelizeConnection;
