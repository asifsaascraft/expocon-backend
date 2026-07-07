import User from "../models/User.js";

/**
 * Check duplicate fields
 *
 * @param {Object} fields
 * @param {String} excludeUserId
 */

const checkDuplicateFields = async (
  fields,
  excludeUserId = null,
) => {
  const queries = [];

  if (fields.email) {
    queries.push({
      field: "email",
      value: fields.email,
    });
  }

  if (fields.username) {
    queries.push({
      field: "username",
      value: fields.username,
    });
  }

  if (fields.mobile) {
    queries.push({
      field: "mobile",
      value: fields.mobile,
    });
  }

  for (const item of queries) {
    const filter = {
      [item.field]: item.value,
      isDeleted: false,
    };

    if (excludeUserId) {
      filter._id = {
        $ne: excludeUserId,
      };
    }

    const exists = await User.findOne(filter);

    if (exists) {
      return {
        exists: true,
        field: item.field,
        message: `${
          item.field.charAt(0).toUpperCase() +
          item.field.slice(1)
        } already exists.`,
      };
    }
  }

  return {
    exists: false,
  };
};

export default checkDuplicateFields;