import { get, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { throwErrorsHttp } from '../utils/helpers';
import AwsCognitoService from './awsCognitoService';
import UserService from './userService';
import { ROLE, USER_STATUS } from '../utils/constant';

class AuthService {
  private verifier;

  constructor() {
    this.verifier = CognitoJwtVerifier.create({
      tokenUse: 'access',
      userPoolId: process.env.COGNITO_POOL_ID,
      clientId: process.env.COGNITO_CLIENT_ID
    });
  }

  public async verifyUser(
    token: string
  ): Promise<{ sub: string; auth_time: number; exp: number; iat: number }> {
    const destructureToken = token.split('Bearer ');
    try {
      const result = await this.verifier.verify(get(destructureToken, 1, null));
      return pick(result, ['sub', 'auth_time', 'exp', 'iat']);
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
}

export default new AuthService();
