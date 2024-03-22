import DatabaseConnection from '../databaseConnection';
import { User } from '../entity/User';
import { ROLE, STATUS } from '../utils/constant';

class UserService {
  private User;

  constructor() {
    this.User = new User();
  }

  public async create(
    id: string,
    payload: {
      nric: string;
      contact: string;
      race: string;
      personalEmail: string;
      moeEmail: string;
      school: string;
      nationality: string;
      center: string;
      role: ROLE;
    }
  ): Promise<object> {
    this.User.id = id;
    this.User.status = STATUS.PENDING;
    this.User.nric = payload.nric;
    this.User.contact = payload.contact;
    this.User.race = payload.race;
    this.User.personalEmail = payload.personalEmail;
    this.User.moeEmail = payload.moeEmail;
    this.User.school = payload.school;
    this.User.nationality = payload.nationality;
    this.User.center = payload.center;
    this.User.role = payload.role;

    return DatabaseConnection.manager.save(this.User);
  }
}

export default new UserService();
