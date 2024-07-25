import 'reflect-metadata';
import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from './entity/User.entity';
import { File } from './entity/File.entity';
import { Blog } from './entity/Blog.entity';
import { Level } from './entity/Level.entity';
import { Center } from './entity/Center.entity';
import { Student } from './entity/Student.entity';
import { UserSession } from './entity/UserSession.entity';
import { Achievement } from './entity/Achievement.entity';
import { Participants } from './entity/Participants.entity';
import { StudentAchievements } from './entity/StudentAchievements.entity';

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
  entities: [
    User,
    File,
    Blog,
    Level,
    Center,
    Student,
    Achievement,
    UserSession,
    Participants,
    StudentAchievements
  ],
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
