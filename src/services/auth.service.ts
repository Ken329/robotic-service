import moment from 'moment';
import jwt from 'jsonwebtoken';
import { get, pick } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import httpStatusCode from 'http-status-codes';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import UserService, { UserResponse } from './user.service';
import AwsCognitoService from './awsCognito.service';
import DataSource from '../database/dataSource';
import { ROLE, USER_STATUS } from '../utils/constant';
import { throwErrorsHttp, encryption, decryption } from '../utils/helpers';
import { UserSession } from '../database/entity/UserSession';

class AuthService {
  private verifier;
  private userSessionRepository;
  private audience = 'Robotic Club Portal';

  constructor() {
    this.userSessionRepository = DataSource.getRepository(UserSession);
    this.verifier = CognitoJwtVerifier.create({
      tokenUse: 'access',
      userPoolId: process.env.COGNITO_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID
    });
  }

  private async getUserSession(id: string): Promise<UserSession> {
    return !id
      ? null
      : this.userSessionRepository.findOne({
          where: { id }
        });
  }

  private async deleteUserSession(payload: {
    id?: string;
    user?: string;
  }): Promise<object> {
    return this.userSessionRepository.delete(pick(payload, ['id', 'user']));
  }

  private async generateAuthToken(
    userId: string
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await UserService.user(userId);
    const jwtid = uuidv4();
    const exp = Math.floor(Date.now() / 1000) + Number(process.env.JWT_TTL);
    const accessToken = jwt.sign(
      {
        sub: user.id,
        ...pick(user, [
          'email',
          'role',
          'status',
          'centerId',
          'centerName',
          'centerLocation'
        ]),
        exp
      },
      process.env.JWT_SECRET_KEY,
      { jwtid, audience: this.audience }
    );

    await this.deleteUserSession({ user: userId });
    const userSession = new UserSession();
    userSession.id = jwtid;
    userSession.user = userId;
    userSession.role = user.role;
    await this.userSessionRepository.save(userSession);

    return {
      accessToken,
      refreshToken: encryption(
        JSON.stringify({
          id: jwtid,
          userId,
          exp: moment.unix(exp).add(1, 'h')
        })
      )
    };
  }

  private async verifyJwtToken(token: string): Promise<UserSession> {
    const destructureToken = token.split('Bearer ');

    const decodedPayload = jwt.verify(
      get(destructureToken, 1, null),
      process.env.JWT_SECRET_KEY,
      { audience: this.audience }
    );

    const userSession = await this.getUserSession(
      get(decodedPayload, 'jti', null)
    );

    if (!userSession) {
      throwErrorsHttp(
        'Access token is longer valid',
        httpStatusCode.BAD_REQUEST
      );
    }

    return userSession;
  }

  public async generateToken(accessToken: string): Promise<object> {
    try {
      const payload = await this.verifier.verify(accessToken);
      return this.generateAuthToken(payload.sub);
    } catch (error) {
      throwErrorsHttp('User is not valid', httpStatusCode.UNAUTHORIZED);
    }
  }

  public async verifyToken(
    accessToken: string,
    option?: { status: USER_STATUS }
  ): Promise<UserResponse> {
    try {
      const data = await this.verifyJwtToken(accessToken);
      return UserService.user(data.user, option);
    } catch (error) {
      throwErrorsHttp(error.message, httpStatusCode.UNAUTHORIZED);
    }
  }

  public async refreshToken(refreshToken: string): Promise<object> {
    try {
      const payload = decryption(refreshToken);
      const parsedPayload = JSON.parse(payload);
      if (moment().isAfter(parsedPayload.exp)) {
        throwErrorsHttp('Refresh token is expired', httpStatusCode.BAD_REQUEST);
      }
      const userSession = await this.getUserSession(parsedPayload.id);
      if (!userSession) {
        throwErrorsHttp(
          'Refresh token is longer valid',
          httpStatusCode.BAD_REQUEST
        );
      }

      return this.generateAuthToken(parsedPayload.userId);
    } catch (error) {
      throwErrorsHttp(error.message, httpStatusCode.UNAUTHORIZED);
    }
  }

  public async verifyOtp(id: string, code: string): Promise<boolean> {
    const user = await UserService.user(id);

    await AwsCognitoService.confirmedSignUp(user.email, code);
    await UserService.update(
      user.id,
      user.role === ROLE.STUDENT
        ? USER_STATUS.PENDING_CENTER
        : USER_STATUS.APPROVED
    );
    return true;
  }

  public async logout(accessToken: string): Promise<Boolean> {
    try {
      const data = await this.verifyJwtToken(accessToken);
      await this.deleteUserSession({ id: data.id });
      return true;
    } catch (error) {
      throwErrorsHttp(error.message, httpStatusCode.UNAUTHORIZED);
    }
  }
}

export default new AuthService();
