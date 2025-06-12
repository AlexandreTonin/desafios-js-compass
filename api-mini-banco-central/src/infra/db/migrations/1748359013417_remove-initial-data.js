export const up = async (pgm) => {
  await pgm.sql(`DELETE FROM transactions`);
  await pgm.sql(`DELETE FROM accounts`);
  await pgm.sql(`DELETE FROM users`);
  await pgm.sql(`DELETE FROM institutions`);

  await pgm.sql(`
      ALTER SEQUENCE users_id_seq RESTART WITH 1;
      ALTER SEQUENCE institutions_id_seq RESTART WITH 1;
      ALTER SEQUENCE accounts_id_seq RESTART WITH 1;
      ALTER SEQUENCE transactions_id_seq RESTART WITH 1;
    `);

  await pgm.sql(`
      INSERT INTO institutions (name) VALUES
        ('Itaú')
    `);

  await pgm.sql(`
      INSERT INTO users (name) VALUES
        ('João Almeida'),
        ('Maria de Freitas'),
        ('José Amaral'),
        ('Renan do Carmo'),
        ('Felipe da Guia'),
        ('Gabriel Macedo'),
        ('Fernanda da Silva'),
        ('Rodrigo Caetano'),
        ('Renato Gaúcho'),
        ('Mazembe Mundial');
    `);

  await pgm.sql(`
      INSERT INTO accounts (user_id, institution_id, balance) VALUES
        (1, 1, 1000.00),
        (2, 1, 2500.50),
        (3, 1, 300.75),
        (4, 1, 5000.00),
        (5, 1, 2000.00),
        (6, 1, 1500.00),
        (7, 1, 2500.00);
        (8, 1, 3500.00),
        (9, 1, 4500.00),
        (10, 1, 5500.00);
    `);

  await pgm.sql(`
      INSERT INTO transactions (
        from_account_id, to_account_id, transaction_type, amount, description, status
      ) VALUES
        (1, 2, 'transfer', 200.00, 'João transferiu para Maria', 'completed'),
        (2, 3, 'transfer', 150.50, 'Maria transferiu para Carlos', 'completed'),
        (3, 1, 'transfer', 75.00, 'Carlos transferiu para João', 'completed')
    `);
};

export const down = async (pgm) => {
  await pgm.sql(`DELETE FROM transactions`);
  await pgm.sql(`DELETE FROM accounts`);
  await pgm.sql(`DELETE FROM users`);
  await pgm.sql(`DELETE FROM institutions`);
};
