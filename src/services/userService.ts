import { get } from 'lodash';
import httpStatusCode from 'http-status-codes';
import CenterService from './centerService';
import AwsCognitoService from './awsCognitoService';
import DataSource from '../database/dataSource';
import { decryption, throwErrorsHttp } from '../utils/helpers';
import { ROLE, USER_STATUS, CENTER_STATUS } from '../utils/constant';
import { User } from '../database/entity/User';
import { Center } from '../database/entity/Center';

type UserResponse = {
  id: string;
  status: string;
  center: string;
  role: string;
  nric: string;
  contact: string;
  personalEmail: string;
  moeEmail: string;
  race: string;
  school: string;
  nationality: string;
};

class UserService {
  private userRepository;
  private centerRepository;

  constructor() {
    this.userRepository = DataSource.getRepository(User);
    this.centerRepository = DataSource.getRepository(Center);
  }

  public async get(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({
      where: { id }
      // relations: ['center']
    });

    if (!user) throwErrorsHttp('User not found', httpStatusCode.NOT_FOUND);

    return {
      id: user.id,
      status: user.status,
      center: user.center,
      role: user.role,
      nric: user.nric,
      contact: user.contact,
      personalEmail: user.personalEmail,
      moeEmail: user.moeEmail,
      race: user.race,
      school: user.school,
      nationality: user.nationality
    };
  }

  public async create(
    email: string,
    password: string,
    payload: {
      role: ROLE;
      status?: USER_STATUS;
      nric?: string;
      contact?: string;
      race?: string;
      personalEmail?: string;
      moeEmail?: string;
      school?: string;
      nationality?: string;
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
    user.status = get(payload, 'status', USER_STATUS.PENDING);
    user.nric = payload.nric;
    user.contact = payload.contact;
    user.race = payload.race;
    user.personalEmail = payload.personalEmail;
    user.moeEmail = payload.moeEmail;
    user.school = payload.school;
    user.nationality = payload.nationality;
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
}

export default new UserService();
