export const up = async (pgm) => {
  await pgm.sql(`
    CREATE SEQUENCE IF NOT EXISTS institution_agencies_agency_code_seq START 1;
  `);

  await pgm.createTable('institution_agencies', {
    id: 'id',
    institution_id: {
      type: 'integer',
      notNull: true,
      references: '"institutions"',
      onDelete: 'CASCADE',
    },
    agency_code: {
      type: 'text',
      notNull: true,
      default: pgm.func(
        `TO_CHAR(nextval('institution_agencies_agency_code_seq'), 'FM0000')`,
      ),
      unique: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  await pgm.addColumn('accounts', {
    institution_agency_id: {
      type: 'integer',
      references: '"institution_agencies"',
      onDelete: 'SET NULL',
      notNull: false,
    },
  });

  await pgm.dropColumn('accounts', 'agency', { ifExists: true });
};
