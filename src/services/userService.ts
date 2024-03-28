import { In } from 'typeorm';
import { get, map, pick, set } from 'lodash';
import httpStatusCode from 'http-status-codes';
import CenterService from './centerService';
import AwsCognitoService from './awsCognitoService';
import DataSource from '../database/dataSource';
import { decryption, throwErrorsHttp } from '../utils/helpers';
import {
  ROLE,
  USER_STATUS,
  CENTER_STATUS,
  RELATIONSHIP
} from '../utils/constant';
import { User } from '../database/entity/User';
import { Center } from '../database/entity/Center';

type UserResponse = {
  id: string;
  status: string;
  center: string;
  role: string;
  nric: string;
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
    option?: { status?: USER_STATUS; role?: ROLE }
  ): Promise<UserResponse> {
    const query = pick(option, ['status', 'role']);
    const user = await this.userRepository.findOne({
      where: { id, ...query }
      // relations: ['center']
    });

    if (!user) throwErrorsHttp('User not found', httpStatusCode.NOT_FOUND);

    return {
      id: user.id,
      status: user.status,
      center: user.center,
      role: user.role,
      fullName: user.fullName,
      gender: user.gender,
      dob: user.dob,
      nric: user.nric,
      contact: user.contact,
      moeEmail: user.moeEmail,
      race: user.race,
      school: user.school,
      nationality: user.nationality,
      parentName: user.parentName,
      relationship: user.relationship,
      parentEmail: user.parentEmail,
      parentContact: user.parentContact
    };
  }

  public async users(payload: {
    status?: USER_STATUS;
    role?: ROLE;
  }): Promise<UserResponse[]> {
    const users = await this.userRepository.find({
      where: {
        status: payload.status
          ? payload.status
          : In(Object.values(USER_STATUS)),
        role: payload.role ? payload.role : In(Object.values(ROLE))
      }
    });

    return map(users, (user) => ({
      id: user.id,
      status: user.status,
      center: user.center,
      role: user.role,
      fullName: user.fullName,
      gender: user.gender,
      dob: user.dob,
      nric: user.nric,
      contact: user.contact,
      moeEmail: user.moeEmail,
      race: user.race,
      school: user.school,
      nationality: user.nationality,
      parentName: user.parentName,
      relationship: user.relationship,
      parentEmail: user.parentEmail,
      parentContact: user.parentContact
    }));
  }

  public async create(
    email: string,
    password: string,
    payload: {
      role: ROLE;
      status?: USER_STATUS;
      nric?: string;
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
    if (
      (payload.role === ROLE.STUDENT &&
        centerStatus !== CENTER_STATUS.ASSIGNED) ||
      (payload.role === ROLE.CENTER &&
        centerStatus !== CENTER_STATUS.NOT_ASSIGN)
    ) {
      throwErrorsHttp('Center is valid', httpStatusCode.BAD_REQUEST);
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
    user.contact = payload.contact;
    user.race = payload.race;
    user.fullName = payload.fullName;
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

    return result;
  }

  public async approve(
    id: string,
    role: ROLE,
    payload: {
      nric?: string;
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
    }
  ): Promise<UserResponse> {
    await this.user(id, {
      status:
        role === ROLE.CENTER
          ? USER_STATUS.PENDING_CENTER
          : USER_STATUS.PENDING_ADMIN
    });

    const filterPayload = pick(payload, [
      'nric',
      'fullName',
      'gender',
      'dob',
      'nric',
      'nric',
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
    set(
      filterPayload,
      'status',
      role === ROLE.CENTER ? USER_STATUS.PENDING_ADMIN : USER_STATUS.APPROVED
    );
    await this.userRepository.update({ id }, { ...filterPayload });
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
