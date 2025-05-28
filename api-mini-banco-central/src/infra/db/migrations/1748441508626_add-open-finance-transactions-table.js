export const up = async (pgm) => {
  await pgm.createTable('open_finance_transactions', {
    id: {
      type: 'serial',
      primaryKey: true,
    },
    open_finance_id: {
      type: 'integer',
      notNull: true,
      references: 'open_finance(id)',
      onDelete: 'CASCADE',
    },
    account_id: {
      type: 'integer',
      notNull: true,
      references: 'accounts(id)',
      onDelete: 'CASCADE',
    },
    amount: {
      type: 'numeric(12, 2)',
      notNull: true,
    },
    date: {
      type: 'date',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = async (pgm) => {
  await pgm.dropTable('open_finance_transactions');
};
