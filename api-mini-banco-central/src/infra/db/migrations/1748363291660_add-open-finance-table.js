export const up = async (pgm) => {
  await pgm.createType('open_finance_status', [
    'accepted',
    'revoked',
    'expired',
  ]);

  await pgm.createTable('open_finance', {
    id: { type: 'serial', primaryKey: true },
    institution_id: {
      type: 'integer',
      notNull: true,
      references: '"institutions"',
      onDelete: 'CASCADE',
    },
    account_id: {
      type: 'integer',
      notNull: true,
      references: '"accounts"',
      onDelete: 'CASCADE',
    },
    agency: { type: 'text', notNull: true },
    status: { type: 'open_finance_status', notNull: true },
    expiration: { type: 'boolean', default: false },
    expiration_date: { type: 'date' },
    created_at: { type: 'timestamp', default: pgm.func('now()') },
    updated_at: { type: 'timestamp', default: pgm.func('now()') },
  });
};

export const down = async (pgm) => {
  await pgm.dropTable('open_finance');
  await pgm.dropType('open_finance_status');
};
