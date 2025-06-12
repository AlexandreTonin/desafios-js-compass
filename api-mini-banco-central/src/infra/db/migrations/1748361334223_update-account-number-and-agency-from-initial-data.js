export const up = async (pgm) => {
  await pgm.sql(`
    UPDATE accounts SET account_number = generate_account_number();
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 1;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 2;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 3;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 4;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 5;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 6;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 7;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 8;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 9;
    UPDATE accounts SET institution_agency_id = 1 WHERE id = 10;
  `);
};

export const down = async (pgm) => {
  await pgm.sql(`
    UPDATE accounts SET account_number = NULL;
    UPDATE accounts SET institution_agency_id = NULL;
  `);
};
