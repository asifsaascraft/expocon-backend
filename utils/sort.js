// /**
//  * Build Sort Query
//  *
//  * Query Params:
//  * ?sortBy=createdAt
//  * ?order=desc
//  *
//  * Default:
//  * createdAt desc
//  */

// const buildSort = (
//   req,
//   defaultSort = "createdAt",
// ) => {
//   const {
//     sortBy = defaultSort,
//     order = "desc",
//   } = req.query;

//   return {
//     [sortBy]:
//       order.toLowerCase() === "asc"
//         ? 1
//         : -1,
//   };
// };

// export default buildSort;


sort.js 

/**
 * Build MongoDB Sort Query
 *
 * Usage:
 *
 * const sortQuery = buildSortQuery(
 *   req,
 *   [
 *     'companyName',
 *     'createdAt',
 *     'status',
 *     'featured',
 *   ],
 *   'createdAt',
 * )
 *
 * Requests:
 *
 * ?sortBy=companyName&order=asc
 * ?sortBy=status&order=desc
 *
 * Default:
 *
 * createdAt desc
 */

const buildSortQuery = (
  req,
  allowedSortFields = [],
  defaultSort = 'createdAt',
) => {
  const hasAllowedFields =
    Array.isArray(allowedSortFields) &&
    allowedSortFields.length > 0

  let sortBy =
    typeof req.query.sortBy === 'string'
      ? req.query.sortBy.trim()
      : defaultSort

  // Validate sort field

  if (
    hasAllowedFields &&
    !allowedSortFields.includes(sortBy)
  ) {
    sortBy = defaultSort
  }

  // Validate order

  const order =
    typeof req.query.order === 'string'
      ? req.query.order.toLowerCase()
      : 'desc'

  const direction =
    order === 'asc' ? 1 : -1

  return {
    [sortBy]: direction,
  }
}

export default buildSortQuery