const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

function getPaginationParams(pagination) {
  const rawLimit = Number(pagination.limit);
  const rawPage = Number(pagination.page);

  const limit =
    !isNaN(rawLimit) && rawLimit > 0
      ? Math.min(rawLimit, MAX_LIMIT)
      : DEFAULT_LIMIT;

  const page = !isNaN(rawPage) && rawPage > 0 ? rawPage : 1;

  return { limit, page };
}

function getPaginationOffset(pagination) {
  return (pagination.page - 1) * pagination.limit;
}

function getPaginationTotalPages(pagination) {
  return Math.ceil(pagination.total / pagination.limit);
}

export { getPaginationParams, getPaginationOffset, getPaginationTotalPages };
