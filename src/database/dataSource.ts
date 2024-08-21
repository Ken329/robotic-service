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
import { updateRace1723965557693 as updateRace } from './migrations/1723965557693_updateRace';
import { updateRace1724250791645 as updateRace2 } from './migrations/1724250791645_updateRace2';
import { updateOthersRace1723971531137 as updateOtherRace } from './migrations/1723971531137_updateOthersRace';

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
  options: { encrypt: false },
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
  migrations: [updateRace, updateOtherRace, updateRace2],
  migrationsTableName: '_migrations'
});

export const UserRepository = dbConnection.getRepository(User);
export const FileRepository = dbConnection.getRepository(File);
export const BlogRepository = dbConnection.getRepository(Blog);
export const LevelRepository = dbConnection.getRepository(Level);
export const CenterRepository = dbConnection.getRepository(Center);
export const StudentRepository = dbConnection.getRepository(Student);
export const AchievementRepository = dbConnection.getRepository(Achievement);
export const UserSessionRepository = dbConnection.getRepository(UserSession);
export const ParticipantsRepository = dbConnection.getRepository(Participants);
export const StudentAchievementsRepository =
  dbConnection.getRepository(StudentAchievements);

export default dbConnection;
