export const up = async (pgm) => {
  pgm.createExtension('unaccent', { ifNotExists: true });
};

export const down = async (pgm) => {
  pgm.dropExtension('unaccent', { ifExists: true });
};
