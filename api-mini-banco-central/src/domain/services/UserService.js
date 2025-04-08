import { UserRepository } from '../repositories/UserRepository';

class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async createAccount() {}
  async getBalance() {}
  async getStatement() {}
}

export { UserService };
