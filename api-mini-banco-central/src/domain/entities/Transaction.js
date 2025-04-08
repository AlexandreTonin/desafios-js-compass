class Transaction {
  constructor({
    id,
    fromAccountId,
    toAccountId,
    transactionType, // 'transfer', 'deposit'
    amount,
    description,
    status, // 'pending', 'completed', 'failed'
    createdAt,
  }) {
    this.id = id;
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.transactionType = transactionType;
    this.amount = amount;
    this.description = description;
    this.status = status;
    this.createdAt = createdAt;
  }
}

export { Transaction };
