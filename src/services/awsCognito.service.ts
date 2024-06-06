import * as dotenv from 'dotenv';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

dotenv.config();

class AwsCognitoService {
  private UserPool: any;

  constructor() {
    this.UserPool = new CognitoUserPool({
      UserPoolId: process.env.COGNITO_POOL_ID,
      ClientId: process.env.COGNITO_CLIENT_ID
    });
  }

  public async signUp(
    email: string,
    password: string
  ): Promise<{ id: string; email: string; confirmation: boolean }> {
    return new Promise((resolve, reject) => {
      this.UserPool.signUp(email, password, [], null, (err, result) => {
        err
          ? reject({ message: err.message })
          : resolve({
              id: result.userSub,
              email: result.user.getUsername(),
              confirmation: result.userConfirmed
            });
      });
    });
  }

  public async confirmedSignUp(email: string, code: string): Promise<object> {
    const User = new CognitoUser({ Username: email, Pool: this.UserPool });
    return new Promise((resolve, reject) => {
      User.confirmRegistration(code, true, (err, result) =>
        err ? reject({ message: err.message }) : resolve(result)
      );
    });
  }
}

export default new AwsCognitoService();
