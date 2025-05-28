export const up = (pgm) => {
  pgm.addColumn('users', {
    cpf: {
      type: 'text',
      notNull: false,
      unique: true,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('users', 'cpf');
};
