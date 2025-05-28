export const up = async (pgm) => {
  await pgm.sql(`
    UPDATE users SET cpf = '12345678900' WHERE name = 'João Silva';
    UPDATE users SET cpf = '98765432100' WHERE name = 'Maria Oliveira';
    UPDATE users SET cpf = '11122233344' WHERE name = 'Carlos Souza';
  `);
};

export const down = async (pgm) => {
  await pgm.sql(`
    UPDATE users SET cpf = NULL WHERE name IN ('João Silva', 'Maria Oliveira', 'Carlos Souza');
  `);
};
