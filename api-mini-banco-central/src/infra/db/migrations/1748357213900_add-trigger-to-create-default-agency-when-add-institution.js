export const up = async (pgm) => {
  // Cria a função PL/pgSQL para inserir agência automática
  await pgm.sql(`
    CREATE OR REPLACE FUNCTION create_default_agency()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO institution_agencies (institution_id)
      VALUES (NEW.id);
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Cria a trigger que chama a função após INSERT em institutions
  await pgm.sql(`
    CREATE TRIGGER trg_create_default_agency
    AFTER INSERT ON institutions
    FOR EACH ROW
    EXECUTE FUNCTION create_default_agency();
  `);
};

export const down = async (pgm) => {
  // Remove a trigger
  await pgm.sql(`
    DROP TRIGGER IF EXISTS trg_create_default_agency ON institutions;
  `);

  // Remove a função
  await pgm.sql(`
    DROP FUNCTION IF EXISTS create_default_agency();
  `);
};
