import { get, pick } from 'lodash';
import httpStatusCode from 'http-status-codes';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { throwErrorsHttp } from '../utils/helpers';

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
}

export default new AuthService();
