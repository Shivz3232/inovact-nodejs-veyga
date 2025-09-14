/**
 * Pagination utility functions following industry standards
 */

/**
 * Validates and sanitizes pagination parameters
 * @param {Object} query - Query parameters from request
 * @returns {Object} Validated pagination parameters
 */
const validatePaginationParams = (query) => {
  const { page = 1, limit = 10, cursor, sort_by = 'created_at', sort_order = 'desc' } = query;

  // Validate and sanitize parameters
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10))); // Max 50 items per page
  const offset = (pageNum - 1) * limitNum;

  // Validate sort order
  const validSortOrders = ['asc', 'desc'];
  const sanitizedSortOrder = validSortOrders.includes(sort_order.toLowerCase())
    ? sort_order.toLowerCase()
    : 'desc';

  return {
    page: pageNum,
    limit: limitNum,
    offset,
    cursor: cursor || null,
    sort_by,
    sort_order: sanitizedSortOrder,
  };
};

/**
 * Creates pagination metadata for response
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} totalCount - Total number of items
 * @param {Array} data - Current page data
 * @returns {Object} Pagination metadata
 */
const createPaginationMeta = (page, limit, totalCount, data) => {
  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Generate cursor for next page (using the last item's created_at)
  const nextCursor = data.length > 0 && hasNextPage ? data[data.length - 1].created_at : null;

  const prevCursor = data.length > 0 && hasPrevPage ? data[0].created_at : null;

  return {
    page,
    limit,
    total: totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextCursor,
    prevCursor,
  };
};

/**
 * Creates a standardized paginated response
 * @param {Array} data - The data to return
 * @param {Object} paginationMeta - Pagination metadata
 * @param {boolean} success - Success status
 * @returns {Object} Standardized response
 */
const createPaginatedResponse = (data, paginationMeta, success = true) => {
  return {
    success,
    data,
    pagination: paginationMeta,
    meta: {
      timestamp: new Date().toISOString(),
      count: data.length,
    },
  };
};

/**
 * Creates empty paginated response
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @returns {Object} Empty paginated response
 */
const createEmptyPaginatedResponse = (page, limit) => {
  return createPaginatedResponse([], createPaginationMeta(page, limit, 0, []));
};

/**
 * Builds GraphQL order_by clause based on sort parameters
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Object} GraphQL order_by clause
 */
const buildOrderByClause = (sortBy, sortOrder) => {
  const orderBy = {};
  orderBy[sortBy] = sortOrder;
  return orderBy;
};

/**
 * Builds cursor-based where clause for GraphQL
 * @param {string} cursor - Cursor value
 * @param {string} sortBy - Field to sort by
 * @param {string} sortOrder - Sort order (asc/desc)
 * @returns {Object} GraphQL where clause for cursor
 */
const buildCursorWhereClause = (cursor, sortBy = 'created_at', sortOrder = 'desc') => {
  if (!cursor) return {};

  const operator = sortOrder === 'desc' ? '_lt' : '_gt';
  const whereClause = {};
  whereClause[sortBy] = { [operator]: cursor };

  return whereClause;
};

module.exports = {
  validatePaginationParams,
  createPaginationMeta,
  createPaginatedResponse,
  createEmptyPaginatedResponse,
  buildOrderByClause,
  buildCursorWhereClause,
};
