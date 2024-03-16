import AWS from 'aws-sdk';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import httpStatusCode from 'http-status-codes';
import { throwErrorsHttp } from '../utils/helpers';

dotenv.config();

class AwsCognitoService {
  private config = {
    apiVersion: '2024-03-16',
    region: 'ap-southeast-2'
  };
  private cognitoIdentity;
  private secretHash = process.env.COGNITO_CLIENT_SECRET;
  private clientId = process.env.COGNITO_CLIENT_ID;

  constructor() {
    this.cognitoIdentity = new AWS.CognitoIdentityServiceProvider(this.config);
  }

  public async signUpUser(
    username: string,
    password: string,
    costCenter: string,
    role: string
  ): Promise<string> {
    try {
      const data = await this.cognitoIdentity
        .signUp({
          ClientId: this.clientId,
          Password: password,
          Username: username,
          SecretHash: this.hashSecret(username),
          UserAttributes: [
            { Name: 'custom:center', Value: costCenter },
            { Name: 'custom:role', Value: role }
          ]
        })
        .promise();

      return data.UserSub;
    } catch (error) {
      throwErrorsHttp(error.message, httpStatusCode.BAD_REQUEST);
    }
  }

  public async confirmSignUp(username: string, code: string): Promise<boolean> {
    const params = {
      ClientId: this.clientId,
      ConfirmationCode: code,
      Username: username,
      SecretHash: this.hashSecret(username)
    };

    try {
      const cognitoResp = await this.cognitoIdentity
        .confirmSignUp(params)
        .promise();
      console.log(cognitoResp);
      return true;
    } catch (error) {
      console.log('error', error);
      return false;
    }
  }

  private hashSecret(username: string): string {
    return crypto
      .createHmac('SHA256', this.secretHash)
      .update(username + this.clientId)
      .digest('base64');
  }
}

export default new AwsCognitoService();
