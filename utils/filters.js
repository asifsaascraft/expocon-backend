/**
 * Build Filters
 *
 * Usage:
 * buildFilters(req, [
 *   "role",
 *   "status",
 *   "isDeleted",
 *   "isEmailVerified",
 * ]);
 */

const buildFilters = (
  req,
  allowedFilters = [],
) => {
  const filters = {};

  for (const field of allowedFilters) {
    if (req.query[field] === undefined) {
      continue;
    }

    let value = req.query[field];

    // Boolean

    if (value === "true") {
      value = true;
    } else if (value === "false") {
      value = false;
    }

    // Number

    else if (
      !isNaN(value) &&
      value !== ""
    ) {
      value = Number(value);
    }

    filters[field] = value;
  }

  return filters;
};

export default buildFilters;