// /**
//  * Build Filters
//  *
//  * Usage:
//  * buildFilters(req, [
//  *   "role",
//  *   "status",
//  *   "isDeleted",
//  *   "isEmailVerified",
//  * ]);
//  */

// const buildFilters = (
//   req,
//   allowedFilters = [],
// ) => {
//   const filters = {};

//   for (const field of allowedFilters) {
//     if (req.query[field] === undefined) {
//       continue;
//     }

//     let value = req.query[field];

//     // Boolean

//     if (value === "true") {
//       value = true;
//     } else if (value === "false") {
//       value = false;
//     }

//     // Number

//     else if (
//       !isNaN(value) &&
//       value !== ""
//     ) {
//       value = Number(value);
//     }

//     filters[field] = value;
//   }

//   return filters;
// };

// export default buildFilters;


/**
 * Build MongoDB Filters
 *
 * Usage:
 *
 * const filtersQuery = buildFiltersQuery(req, [
 *   'status',
 *   'featured',
 *   'companyTypeId',
 *   'stateId',
 * ])
 *
 * Supports:
 *
 * ?status=pending
 * ?status=pending,approved
 * ?featured=true
 * ?page=2
 * ?createdAt=2026-01-01
 */

const buildFiltersQuery = (
  req,
  allowedFilters = [],
) => {
  const filters = {}

  if (
    !Array.isArray(allowedFilters) ||
    allowedFilters.length === 0
  ) {
    return filters
  }

  for (const field of allowedFilters) {
    if (!(field in req.query)) {
      continue
    }

    let value = req.query[field]

    // Ignore null/undefined

    if (value == null) {
      continue
    }

    // Handle arrays from querystring

    if (Array.isArray(value)) {
      value = value
        .map((item) => String(item).trim())
        .filter(Boolean)

      if (!value.length) {
        continue
      }

      filters[field] = {
        $in: value,
      }

      continue
    }

    // Convert to string

    value = String(value).trim()

    // Ignore empty string

    if (!value) {
      continue
    }

    // Boolean

    if (value === 'true') {
      filters[field] = true
      continue
    }

    if (value === 'false') {
      filters[field] = false
      continue
    }

    // Comma separated array

    if (value.includes(',')) {
      const values = value
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean)

      if (values.length) {
        filters[field] = {
          $in: values,
        }
      }

      continue
    }

    // Number

    if (
      !Number.isNaN(Number(value)) &&
      value !== ''
    ) {
      filters[field] = Number(value)
      continue
    }

    // ISO Date

    const date = new Date(value)

    if (!Number.isNaN(date.getTime())) {
      filters[field] = date
      continue
    }

    // Default string

    filters[field] = value
  }

  return filters
}

export default buildFiltersQuery