export const up = (pgm) => {
  pgm.addColumns('accounts', {
    agency: {
      type: 'text',
      notNull: false,
    },
    account_number: {
      type: 'text',
      notNull: false,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumns('accounts', ['agency', 'account_number']);
};
