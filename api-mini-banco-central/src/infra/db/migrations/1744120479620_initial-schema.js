export const up = (pgm) => {
  // Tabela de usuários
  pgm.createTable('users', {
    id: 'serial PRIMARY KEY',
    name: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  });

  // Tabela de instituições
  pgm.createTable('institutions', {
    id: 'serial PRIMARY KEY',
    name: { type: 'text', notNull: true },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  });

  // Tabela de contas
  pgm.createTable('accounts', {
    id: 'serial PRIMARY KEY',
    user_id: {
      type: 'integer',
      references: 'users(id)',
      onDelete: 'cascade',
      notNull: true,
    },
    institution_id: {
      type: 'integer',
      references: 'institutions(id)',
      onDelete: 'cascade',
      notNull: true,
    },
    balance: { type: 'numeric(14,2)', notNull: true, default: 0 },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  });

  // Tabela de transações
  pgm.createTable('transactions', {
    id: 'serial PRIMARY KEY',
    from_account_id: {
      type: 'integer',
      references: 'accounts(id)',
      onDelete: 'set null',
    },
    to_account_id: {
      type: 'integer',
      references: 'accounts(id)',
      onDelete: 'set null',
    },
    transaction_type: {
      type: 'text',
      notNull: true,
      check: `transaction_type IN ('deposit', 'withdrawal', 'transfer', 'payment')`,
    },
    amount: { type: 'numeric(14,2)', notNull: true },
    description: { type: 'text' },
    status: {
      type: 'text',
      notNull: true,
      default: `'pending'`,
      check: `status IN ('pending', 'completed', 'failed')`,
    },
    created_at: {
      type: 'timestamp',
      default: pgm.func('now()'),
      notNull: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('transactions');
  pgm.dropTable('accounts');
  pgm.dropTable('institutions');
  pgm.dropTable('users');
};
