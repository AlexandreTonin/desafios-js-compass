class Account {
  constructor({
    id,
    userId,
    institutionId,
    balance,
    createdAt,
    agency,
    accountNumber,
  }) {
    this.id = id;
    this.userId = userId;
    this.institutionId = institutionId;
    this.balance = balance;
    this.createdAt = createdAt;
    this.agency = agency;
    this.accountNumber = accountNumber;
  }
}

export { Account };
