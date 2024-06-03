import fs from 'fs';
import crypto from 'crypto';
import moment from 'moment';
import { In } from 'typeorm';
import httpStatusCode from 'http-status-codes';
import { get, groupBy, isEmpty, map, pick, set } from 'lodash';
import LevelService from './level.service';
import CenterService from './center.service';
import AwsCognitoService from './awsCognito.service';
import {
  ROLE,
  TSHIRT_SIZE,
  USER_STATUS,
  RELATIONSHIP
} from '../utils/constant';
import DataSource from '../database/dataSource';
import { binaryToBool, throwErrorsHttp } from '../utils/helpers';
import { User } from '../database/entity/User.entity';
import { Student } from '../database/entity/Student.entity';

export type UserResponse = {
  id: string;
  email: string;
  role: string;
  status: USER_STATUS;
  level?: string;
  levelName?: string;
  centerId?: string;
  centerName?: string;
  centerLocation?: string;
  studentId?: string;
  fullName?: string;
  gender?: string;
  dob?: string;
  nric?: string;
  passport?: string;
  contact?: string;
  moeEmail?: string;
  race?: string;
  school?: string;
  nationality?: string;
  parentName?: string;
  relationship?: string;
  parentEmail?: string;
  parentContact?: string;
  expiryDate?: Date;
  rejectedBy?: string;
};

type StudentInfo = {
  level?: string;
  center?: string;
  nric?: string;
  size?: TSHIRT_SIZE;
  passport?: string;
  fullName?: string;
  gender?: string;
  dob?: string;
  contact?: string;
  race?: string;
  moeEmail?: string;
  school?: string;
  nationality?: string;
  parentName?: string;
  relationship?: RELATIONSHIP;
  parentEmail?: string;
  parentContact?: string;
  parentConsent?: boolean;
  expiryDate?: Date;
};

class UserService {
  private userRepository;
  private studentRepository;

  constructor() {
    this.userRepository = DataSource.getRepository(User);
    this.studentRepository = DataSource.getRepository(Student);
  }

  public async user(
    id: string,
    option?: { status?: USER_STATUS; centerId?: string }
  ): Promise<UserResponse> {
    const query = pick(option, ['status', 'centerId']);
    if (query.centerId) {
      set(query, 'center', query.centerId);
      delete query.centerId;
    }

    const user = await this.userRepository.findOne({
      where: { id, ...query },
      relations: ['center', 'student']
    });

    if (!user) throwErrorsHttp('User not found', httpStatusCode.NOT_FOUND);

    const centerDetails = user.center
      ? {
          centerId: get(user.center, 'id'),
          centerName: get(user.center, 'name'),
          centerLocation: get(user.center, 'location')
        }
      : {};

    const studentDetails = user.student
      ? {
          studentId: user.student.id,
          fullName: user.student.fullName,
          level: user.student.level,
          size: user.student.size,
          gender: user.student.gender,
          dob: user.student.dob,
          nric: user.student.nric,
          passport: user.student.passport,
          contact: user.student.contact,
          moeEmail: user.student.moeEmail,
          race: user.student.race,
          school: user.student.school,
          nationality: user.student.nationality,
          parentName: user.student.parentName,
          relationship: user.student.relationship,
          parentEmail: user.student.parentEmail,
          parentContact: user.student.parentContact,
          parentConsent: binaryToBool(user.student.parentConsent),
          expiryDate: user.student.expiryDate,
          rejectedBy: user.student.rejectedBy
        }
      : {};

    if (studentDetails.level) {
      const levelDetails = await LevelService.level(studentDetails.level);
      set(studentDetails, 'levelName', levelDetails.name);
    }

    if (moment().isAfter(get(studentDetails, 'expiryDate', null))) {
      await this.userRepository.update({ id }, { status: USER_STATUS.EXPIRED });
      user.status = USER_STATUS.EXPIRED;
    }

    return {
      ...pick(user, ['id', 'email', 'role', 'status']),
      ...centerDetails,
      ...studentDetails
    };
  }

  public async users(
    role: ROLE,
    optional: { status?: USER_STATUS },
    userInfo?: { role: ROLE; centerId: string }
  ): Promise<{
    data: UserResponse[];
    totalUser: number;
    'pending center'?: any;
    'pending admin'?: any;
    approved?: any;
    rejected?: any;
  }> {
    const query = pick(optional, ['status']);
    if (get(userInfo, 'role', null) === ROLE.CENTER) {
      set(query, 'center', get(userInfo, 'centerId', null));
    }

    const users = await this.userRepository.find({
      where: { role, ...query },
      relations: ['center', 'student']
    });

    const expiredStudent = [];
    const mappedUsers = map(users, (user) => {
      const payload = pick(user, ['id', 'role', 'email', 'status']);
      if (
        role === ROLE.STUDENT &&
        moment().isAfter(get(user.student, 'expiryDate', null))
      ) {
        expiredStudent.push(user.id);
        payload.status = USER_STATUS.EXPIRED;
      }
      return {
        ...payload,
        name: get(user.student, 'fullName', null),
        studentId: user.student.id,
        centerId: get(user.center, 'id', null),
        centerName: get(user.center, 'name', null)
      };
    });

    this.userRepository.update(
      { id: In(expiredStudent) },
      { status: USER_STATUS.EXPIRED }
    );
    const groupedUsers = groupBy(mappedUsers, 'status');
    const groupedUserStatus = {};
    Object.keys(groupedUsers).forEach((key) => {
      set(groupedUserStatus, key, groupedUsers[key].length);
    });

    return {
      totalUser: mappedUsers.length,
      ...groupedUserStatus,
      data: mappedUsers
    };
  }

  public async create(
    email: string,
    password: string,
    role: ROLE,
    payload?: StudentInfo
  ): Promise<UserResponse> {
    const centerId = get(payload, 'center', null);
    const center = await CenterService.center(centerId);

    if ((role === ROLE.CENTER || role === ROLE.STUDENT) && !center) {
      throwErrorsHttp('Center is not valid', httpStatusCode.BAD_REQUEST);
    }

    if (role === ROLE.STUDENT) {
      if (payload.nationality === 'malaysia' && isEmpty(payload.nric)) {
        throwErrorsHttp('NRIC is required', httpStatusCode.BAD_REQUEST);
      } else if (
        payload.nationality !== 'malaysia' &&
        isEmpty(payload.passport)
      ) {
        throwErrorsHttp('Passport is required', httpStatusCode.BAD_REQUEST);
      }
    }

    try {
      const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH, 'utf8');
      const decryptedPassword = crypto
        .privateDecrypt({ key: privateKey }, Buffer.from(password, 'base64'))
        .toString();
      const cognitoUser = await AwsCognitoService.signUp(
        email,
        decryptedPassword
      );

      const user = new User();
      user.id = cognitoUser.id;
      user.email = cognitoUser.email;
      user.role = role;
      user.status = USER_STATUS.PENDING_VERIFICATION;
      user.center = centerId;

      const result = await this.userRepository.save(user);

      if (role === ROLE.STUDENT) {
        const student = new Student();
        student.user = result.id;
        student.nric = payload.nric;
        student.size = payload.size;
        student.passport = payload.passport;
        student.contact = payload.contact;
        student.race = payload.race;
        student.fullName = payload.fullName;
        student.gender = payload.gender;
        student.dob = payload.dob;
        student.moeEmail = payload.moeEmail;
        student.school = payload.school;
        student.nationality = payload.nationality;
        student.parentName = payload.parentName;
        student.relationship = payload.relationship;
        student.parentEmail = payload.parentEmail;
        student.parentContact = payload.parentContact;
        student.parentConsent = payload.parentConsent;
        await this.studentRepository.save(student);
      }

      return this.user(result.id);
    } catch (error) {
      CenterService.delete(centerId);
      throw new Error(error.message);
    }
  }

  public async update(id: string, status: USER_STATUS): Promise<Boolean> {
    await this.userRepository.update({ id }, { status });
    return true;
  }

  public async updateStudent(
    id: string,
    payload: StudentInfo,
    options?: { where?: object }
  ): Promise<UserResponse> {
    const where = get(options, 'where', {});
    const user = await this.user(id, where);

    const filterPayload = pick(payload, [
      'level',
      'nric',
      'size',
      'passport',
      'fullName',
      'gender',
      'dob',
      'contact',
      'race',
      'moeEmail',
      'school',
      'nationality',
      'parentName',
      'relationship',
      'parentEmail',
      'parentContact',
      'parentConsent',
      'expiryDate'
    ]);

    if (filterPayload.level) {
      const levelDetails = await LevelService.level(filterPayload.level);
      if (!levelDetails) {
        throwErrorsHttp('Invalid level', httpStatusCode.BAD_REQUEST);
      }
    }

    if (
      filterPayload.nationality ||
      filterPayload.nric ||
      filterPayload.passport
    ) {
      const updatedUserData = {
        nationality: filterPayload.nationality
          ? filterPayload.nationality
          : user.nationality,
        nric: filterPayload.nric ? filterPayload.nric : user.nric,
        passport: filterPayload.passport
          ? filterPayload.passport
          : user.passport
      };

      if (
        updatedUserData.nationality === 'malaysia' &&
        isEmpty(updatedUserData.nric)
      ) {
        throwErrorsHttp('NRIC is required', httpStatusCode.BAD_REQUEST);
      } else if (
        updatedUserData.nationality !== 'malaysia' &&
        isEmpty(updatedUserData.passport)
      ) {
        throwErrorsHttp('Passport is required', httpStatusCode.BAD_REQUEST);
      }
    }

    await this.studentRepository.update({ user: id }, filterPayload);
    return { ...user, ...filterPayload };
  }

  public async delete(id: string, role: ROLE): Promise<Boolean> {
    if (role === ROLE.ADMIN) {
      throwErrorsHttp(
        'Admin is not allow to be deleted',
        httpStatusCode.BAD_REQUEST
      );
    }

    if (role === ROLE.CENTER) {
      const userInfo = await this.user(id);
      // NOTE: cascade with user table, user details will be deleted once center data removed
      await CenterService.delete(userInfo.centerId);
      return true;
    }

    await this.userRepository.delete({ id, role });
    return true;
  }

  public async approve(
    id: string,
    payload: StudentInfo,
    userInfo: { role?: ROLE; centerId?: string }
  ): Promise<UserResponse> {
    if (userInfo.role === ROLE.CENTER && !get(payload, 'level', null)) {
      throwErrorsHttp(
        'Level is required upon approval',
        httpStatusCode.BAD_REQUEST
      );
    }

    const where = {
      status:
        userInfo.role === ROLE.CENTER
          ? USER_STATUS.PENDING_CENTER
          : USER_STATUS.PENDING_ADMIN
    };
    if (userInfo.centerId) set(where, 'centerId', userInfo.centerId);
    const userDetails = await this.updateStudent(id, payload, { where });

    const updatedStatus =
      userDetails.status === USER_STATUS.PENDING_CENTER
        ? USER_STATUS.PENDING_ADMIN
        : USER_STATUS.APPROVED;
    await this.update(id, updatedStatus);

    if (updatedStatus === USER_STATUS.APPROVED) {
      const expiryDate = moment().endOf('year').toDate();
      await this.updateStudent(id, { expiryDate });
      userDetails.expiryDate = expiryDate;
    }

    return {
      ...userDetails,
      status: updatedStatus
    };
  }

  public async reject(id: string, role: ROLE): Promise<UserResponse> {
    const user = await this.user(id, {
      status:
        role === ROLE.CENTER
          ? USER_STATUS.PENDING_CENTER
          : USER_STATUS.PENDING_ADMIN
    });

    await this.userRepository.update({ id }, { status: USER_STATUS.REJECT });
    await this.studentRepository.update({ user: id }, { rejectedBy: role });
    return {
      ...user,
      status: USER_STATUS.REJECT,
      rejectedBy: role
    };
  }

  public async renew(id: string, payload: StudentInfo): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) throwErrorsHttp('Student not found', httpStatusCode.NOT_FOUND);

    set(payload, 'expiryDate', moment().endOf('year').toDate());
    const userDetails = await this.updateStudent(id, payload);

    userDetails.status = USER_STATUS.APPROVED;
    await this.update(id, userDetails.status);

    return userDetails;
  }
}

export default new UserService();
