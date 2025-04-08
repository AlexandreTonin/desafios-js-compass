class Account {
  constructor({ id, userId, institutionId, balance, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.institutionId = institutionId;
    this.balance = balance;
    this.createdAt = createdAt;
  }
}

export { Account };
