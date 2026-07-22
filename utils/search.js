// /**
//  * Build Search Query
//  *
//  * Usage:
//  * buildSearch(req, [
//  *   "fullName",
//  *   "email",
//  *   "mobile",
//  * ]);
//  */

// const buildSearch = (
//   req,
//   searchableFields = [],
// ) => {
//   const { search } = req.query;

//   if (
//     !search ||
//     !searchableFields.length
//   ) {
//     return {};
//   }

//   return {
//     $or: searchableFields.map((field) => ({
//       [field]: {
//         $regex: search,
//         $options: "i",
//       },
//     })),
//   };
// };

// export default buildSearch;



search 


/**
 * Build MongoDB Search Query
 *
 * Usage:
 *
 * const searchQuery = buildSearchQuery(req, [
 *   'companyName',
 *   'companyEmail',
 *   'city',
 *   'mobile',
 * ])
 *
 * Request:
 *
 * ?search=open ai
 *
 * Output:
 *
 * {
 *   $or: [
 *     {
 *       companyName: {
 *         $regex: 'open.*ai',
 *         $options: 'i',
 *       },
 *     },
 *     ...
 *   ]
 * }
 */

/**
 * Escape RegExp special characters.
 */
const escapeRegex = (value) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Build Search Query.
 */
const buildSearchQuery = (
  req,
  searchableFields = [],
) => {
  // No searchable fields

  if (
    !Array.isArray(searchableFields) ||
    searchableFields.length === 0
  ) {
    return {}
  }

  // Search value

  const rawSearch =
    typeof req.query.search === 'string'
      ? req.query.search.trim()
      : ''

  // Empty search

  if (!rawSearch) {
    return {}
  }

  // Normalize whitespace

  const normalizedSearch = rawSearch.replace(/\s+/g, ' ')

  // Escape regex characters

  const escapedSearch = escapeRegex(normalizedSearch)

  // Allow flexible matching between words
  // Example:
  // "open ai"
  // becomes
  // "open.*ai"

  const regexPattern = escapedSearch.replace(/\s+/g, '.*')

  return {
    $or: searchableFields.map((field) => ({
      [field]: {
        $regex: regexPattern,
        $options: 'i',
      },
    })),
  }
}

export default buildSearchQuery