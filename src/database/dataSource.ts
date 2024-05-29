import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { File } from './entity/File';
import { Level } from './entity/Level';
import { Center } from './entity/Center';
import { Student } from './entity/Student';
import { UserSession } from './entity/UserSession';
import { Achievement } from './entity/Achievement';

dotenv.config();

const dbConnection = new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST,
  port: 1433,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, File, Level, Center, Student, Achievement, UserSession],
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

export default dbConnection;
