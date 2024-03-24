"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const typeorm_1 = require("typeorm");
const User_1 = require("./entity/User");
const Center_1 = require("./entity/Center");
dotenv_1.default.config();
const dbConnection = new typeorm_1.DataSource({
    type: 'mssql',
    host: process.env.DB_HOST,
    port: 1433,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [Center_1.Center, User_1.User],
    options: { encrypt: false }
});
dbConnection
    .initialize()
    .then(() => {
    console.log(`Data Source has been initialized`);
})
    .catch((error) => {
    console.error(`Data Source initialization error: ${error.message}`);
    process.exit(1);
});
exports.default = dbConnection;
