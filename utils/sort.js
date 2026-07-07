/**
 * Build Sort Query
 *
 * Query Params:
 * ?sortBy=createdAt
 * ?order=desc
 *
 * Default:
 * createdAt desc
 */

const buildSort = (
  req,
  defaultSort = "createdAt",
) => {
  const {
    sortBy = defaultSort,
    order = "desc",
  } = req.query;

  return {
    [sortBy]:
      order.toLowerCase() === "asc"
        ? 1
        : -1,
  };
};

export default buildSort;