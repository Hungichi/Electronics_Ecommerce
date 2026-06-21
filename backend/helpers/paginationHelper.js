/**
 * Xây dựng object phân trang từ query params
 * @param {Object} query - req.query từ Express
 * @returns {{ page, limit, skip }}
 */
const buildPagination = (query) => {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

/**
 * Tính toán metadata phân trang để đính kèm vào response
 * @param {number} total - Tổng số document
 * @param {number} page  - Trang hiện tại
 * @param {number} limit - Số item mỗi trang
 * @returns {Object}
 */
const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

/**
 * Xây dựng Mongoose filter từ query params của product
 * Hỗ trợ: category, brand, minPrice, maxPrice, isFeatured, isActive, search
 * @param {Object} query - req.query
 * @returns {Object} Mongoose filter object
 */
const buildProductFilter = (query) => {
  const filter = {};

  if (query.category)   filter.category   = query.category;
  if (query.brand)      filter.brand       = new RegExp(query.brand, "i");
  if (query.isFeatured) filter.isFeatured  = query.isFeatured === "true";
  if (query.isActive)   filter.isActive    = query.isActive   === "true";

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  }

  if (query.search) {
    filter.$or = [
      { name:        new RegExp(query.search, "i") },
      { description: new RegExp(query.search, "i") },
      { brand:       new RegExp(query.search, "i") },
    ];
  }

  return filter;
};

/**
 * Xây dựng sort option từ query params
 * Hỗ trợ: sortBy (field), order (asc | desc)
 * Mặc định: sort theo createdAt mới nhất
 * @param {Object} query - req.query
 * @returns {Object} Mongoose sort object
 */
const buildSortOption = (query) => {
  const ALLOWED_SORT_FIELDS = ["price", "rating", "sold", "createdAt", "name"];
  const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy) ? query.sortBy : "createdAt";
  const order  = query.order === "asc" ? 1 : -1;
  return { [sortBy]: order };
};

module.exports = { buildPagination, buildPaginationMeta, buildProductFilter, buildSortOption };
