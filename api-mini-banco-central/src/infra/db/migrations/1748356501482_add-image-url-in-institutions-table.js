export const up = (pgm) => {
  pgm.addColumns('institutions', {
    image_url: {
      type: 'text',
      notNull: false,
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumns('accounts', ['image_url']);
};
