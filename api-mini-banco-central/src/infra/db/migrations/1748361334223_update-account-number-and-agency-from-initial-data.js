export const up = async (pgm) => {
  await pgm.sql(`
    UPDATE accounts SET account_number = generate_account_number();
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 1;
    UPDATE accounts SET institution_agency_id = 2 WHERE id = 2;
    UPDATE accounts SET institution_agency_id = 3 WHERE id = 3;
  `);
};

export const down = async (pgm) => {
  await pgm.sql(`
    UPDATE accounts SET account_number = NULL;
    UPDATE accounts SET institution_agency_id = NULL;
  `);
};
