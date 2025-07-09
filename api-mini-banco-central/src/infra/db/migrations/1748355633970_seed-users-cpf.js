export const up = async (pgm) => {
  await pgm.sql(`
    UPDATE users SET cpf = '12345678901' WHERE name = 'João Almeida';
    UPDATE users SET cpf = '12345678902' WHERE name = 'Maria de Freitas';
    UPDATE users SET cpf = '12345678903' WHERE name = 'José Amaral';
    UPDATE users SET cpf = '12345678904' WHERE name = 'Renan do Carmo';
    UPDATE users SET cpf = '12345678905' WHERE name = 'Felipe da Guia';
    UPDATE users SET cpf = '12345678906' WHERE name = 'Gabriel Macedo';
    UPDATE users SET cpf = '12345678907' WHERE name = 'Fernanda da Silva';
    UPDATE users SET cpf = '12345678908' WHERE name = 'Rodrigo Caetano';
    UPDATE users SET cpf = '12345678909' WHERE name = 'Renato Gaúcho';
    UPDATE users SET cpf = '12345678910' WHERE name = 'Mazembe Mundial';
    UPDATE users SET cpf = '12345678911' WHERE name = 'Andrei Albrecht';
    UPDATE users SET cpf = '12345678912' WHERE name = 'Alexandre Tonin';
    UPDATE users SET cpf = '12345678913' WHERE name = 'Ruan Oliveira';
    UPDATE users SET cpf = '12345678914' WHERE name = 'Marcos Schlick';
    UPDATE users SET cpf = '12345678915' WHERE name = 'Matheus Aguiar';
    `);
};

export const down = async (pgm) => {
  await pgm.sql(`
    UPDATE users SET cpf = NULL WHERE name IN ('João Almeida', 'Maria de Freitas', 'José Amaral', 'Renan do Carmo', 'Felipe da Guia', 'Renato Gaúcho', 'Mazembe Mundial');
  `);
};
