import { In, Not } from 'typeorm';
import httpStatusCode from 'http-status-codes';
import { get, groupBy, isEmpty, map, pick, set } from 'lodash';
import CenterService from './centerService';
import AwsCognitoService from './awsCognitoService';
import DataSource from '../database/dataSource';
import {
  ROLE,
  USER_STATUS,
  CENTER_STATUS,
  RELATIONSHIP,
  PAYMENT_METHOD
} from '../utils/constant';
import { decryption, throwErrorsHttp, maskingValue } from '../utils/helpers';
import { User } from '../database/entity/User';
import { Center } from '../database/entity/Center';

type UserResponse = {
  id: string;
  status: string;
  centerId: string;
  centerName: string;
  role: string;
  nric: string;
  passport: string;
  fullName: string;
  gender: string;
  dob: string;
  contact: string;
  moeEmail: string;
  race: string;
  school: string;
  nationality: string;
  parentName: string;
  relationship: string;
  parentEmail: string;
  parentContact: string;
  paymentMethod: string;
};

class UserService {
  private userRepository;
  private centerRepository;

  constructor() {
    this.userRepository = DataSource.getRepository(User);
    this.centerRepository = DataSource.getRepository(Center);
  }

  public async user(
    id: string,
    option?: { status?: USER_STATUS; role?: ROLE; maskNric?: boolean }
  ): Promise<UserResponse> {
    const query = pick(option, ['status', 'role']);
    const user = await this.userRepository.findOne({
      where: { id, ...query },
      relations: ['center']
    });

    if (!user) throwErrorsHttp('User not found', httpStatusCode.NOT_FOUND);

    user.nric =
      get(option, 'maskNric', true) && user.nric
        ? maskingValue(user.nric)
        : user.nric;

    return {
      id: user.id,
      status: user.status,
      centerId: get(user.center, 'id', null),
      centerName: get(user.center, 'name', null),
      role: user.role,
      fullName: user.fullName,
      gender: user.gender,
      dob: user.dob,
      nric: user.nric,
      passport: user.passport,
      contact: user.contact,
      moeEmail: user.moeEmail,
      race: user.race,
      school: user.school,
      nationality: user.nationality,
      parentName: user.parentName,
      relationship: user.relationship,
      parentEmail: user.parentEmail,
      parentContact: user.parentContact,
      paymentMethod: user.paymentMethod
    };
  }

  public async users(
    payload: { status?: USER_STATUS; role?: ROLE },
    userInfo: {
      id: string;
      role: ROLE;
      centerId: string;
    }
  ): Promise<{
    totalUser: number;
    pendingCenter: any;
    pendingAdmin: any;
    approved: any;
    rejected: any;
    data: UserResponse[];
  }> {
    const where = {
      id: Not(userInfo.id),
      role: payload.role ? payload.role : In(Object.values(ROLE)),
      status: payload.status ? payload.status : In(Object.values(USER_STATUS))
    };
    if (userInfo.role === ROLE.CENTER) set(where, 'center', userInfo.centerId);
    const users = await this.userRepository.find({
      where,
      relations: ['center']
    });

    const mappedUsers = map(users, (user) => ({
      id: user.id,
      status: user.status,
      centerId: get(user.center, 'id', null),
      centerName: get(user.center, 'name', null),
      role: user.role,
      fullName: user.fullName,
      gender: user.gender,
      dob: user.dob,
      nric: maskingValue(user.nric),
      passport: user.passport,
      contact: user.contact,
      moeEmail: user.moeEmail,
      race: user.race,
      school: user.school,
      nationality: user.nationality,
      parentName: user.parentName,
      relationship: user.relationship,
      parentEmail: user.parentEmail,
      parentContact: user.parentContact,
      paymentMethod: user.paymentMethod
    }));

    const groupedUsers = groupBy(mappedUsers, 'status');

    return {
      totalUser: mappedUsers.length,
      pendingCenter: get(
        groupedUsers,
        `${USER_STATUS.PENDING_CENTER}.length`,
        0
      ),
      pendingAdmin: get(groupedUsers, `${USER_STATUS.PENDING_ADMIN}.length`, 0),
      approved: get(groupedUsers, `${USER_STATUS.APPROVED}.length`, 0),
      rejected: get(groupedUsers, `${USER_STATUS.REJECT}.length`, 0),
      data: mappedUsers
    };
  }

  public async create(
    email: string,
    password: string,
    payload: {
      role: ROLE;
      status?: USER_STATUS;
      nric?: string;
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
      center?: string;
    }
  ): Promise<UserResponse> {
    const center = await CenterService.center(payload.center);
    const centerStatus = get(center, 'status', null);

    if (payload.role === ROLE.STUDENT) {
      if (payload.nationality === 'malaysia' && isEmpty(payload.nric)) {
        throwErrorsHttp('NRIC is required', httpStatusCode.BAD_REQUEST);
      } else if (
        payload.nationality !== 'malaysia' &&
        isEmpty(payload.passport)
      ) {
        throwErrorsHttp('Passport is required', httpStatusCode.BAD_REQUEST);
      } else if (centerStatus !== CENTER_STATUS.ASSIGNED) {
        throwErrorsHttp('Center is not valid', httpStatusCode.BAD_REQUEST);
      }
    }

    if (
      payload.role === ROLE.CENTER &&
      centerStatus !== CENTER_STATUS.NOT_ASSIGN
    ) {
      throwErrorsHttp(
        'Center has been assgned, please choose other center',
        httpStatusCode.BAD_REQUEST
      );
    }

    const decryptedPassword = decryption(password);
    const cognitoUser = await AwsCognitoService.signUp(
      email,
      decryptedPassword
    );

    const user = new User();
    user.id = cognitoUser.id;
    user.role = payload.role;
    user.status = get(payload, 'status', USER_STATUS.PENDING_CENTER);
    user.nric = payload.nric;
    user.passport = payload.passport;
    user.contact = payload.contact;
    user.race = payload.race;
    user.fullName = payload.fullName ? payload.fullName.toLowerCase() : null;
    user.gender = payload.gender;
    user.dob = payload.dob;
    user.moeEmail = payload.moeEmail;
    user.school = payload.school;
    user.nationality = payload.nationality;
    user.parentName = payload.parentName;
    user.relationship = payload.relationship;
    user.parentEmail = payload.parentEmail;
    user.parentContact = payload.parentContact;
    user.center = payload.center;

    const result = await this.userRepository.save(user);

    if (payload.role === ROLE.CENTER) {
      await this.centerRepository.update(
        { id: result.center },
        { status: CENTER_STATUS.ASSIGNED }
      );
    }

    return this.user(cognitoUser.id);
  }

  public async approve(
    id: string,
    role: ROLE,
    payload: {
      nric?: string;
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
      paymentMethod?: PAYMENT_METHOD;
    }
  ): Promise<UserResponse> {
    const user = await this.user(id, {
      status:
        role === ROLE.CENTER
          ? USER_STATUS.PENDING_CENTER
          : USER_STATUS.PENDING_ADMIN,
      maskNric: false
    });

    const filterPayload = pick(payload, [
      'nric',
      'fullName',
      'gender',
      'dob',
      'nric',
      'passport',
      'contact',
      'race',
      'moeEmail',
      'school',
      'nationality',
      'parentName',
      'relationship',
      'parentEmail',
      'parentContact'
    ]);

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

    if (role === ROLE.CENTER && !payload.paymentMethod)
      throwErrorsHttp('Payment method is required', httpStatusCode.BAD_REQUEST);

    if (payload.paymentMethod)
      set(filterPayload, 'paymentMethod', payload.paymentMethod);

    await this.userRepository.update(
      { id },
      {
        ...filterPayload,
        status:
          user.status === USER_STATUS.PENDING_CENTER
            ? USER_STATUS.PENDING_ADMIN
            : USER_STATUS.APPROVED
      }
    );
    return this.user(id);
  }

  public async reject(id: string, role: ROLE): Promise<UserResponse> {
    await this.user(id, {
      status:
        role === ROLE.CENTER
          ? USER_STATUS.PENDING_CENTER
          : USER_STATUS.PENDING_ADMIN
    });

    await this.userRepository.update(
      { id },
      { status: USER_STATUS.REJECT, rejectedBy: role }
    );
    return this.user(id);
  }
}

export default new UserService();
