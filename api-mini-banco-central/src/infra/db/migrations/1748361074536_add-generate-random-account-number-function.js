export const up = async (pgm) => {
  await pgm.sql(`
    CREATE OR REPLACE FUNCTION generate_account_number()
    RETURNS TEXT AS $$
    BEGIN
      RETURN lpad((floor(random() * 100000000))::text, 8, '0');
    END;
    $$ LANGUAGE plpgsql;
  `);
};

export const down = async (pgm) => {
  await pgm.sql(`
    DROP FUNCTION IF EXISTS generate_account_number();
  `);
};
