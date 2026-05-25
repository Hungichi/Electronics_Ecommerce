
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
  totalPages: Math.ceil(total / limit), //tong so trang, = tong product chia cho so luong moi trang, lam` tron len
  hasNextPage: page * limit < total, 
  hasPrevPage: page > 1,

  //hasNextPage, hasPrevPage: an hoac hien "trang tiep theo" or "trang truoc"
});


const buildProductFilter = (query) => {
  const filter = {};

  if (query.category)   filter.category   = query.category;
  if (query.brand)      filter.brand       = new RegExp(query.brand, "i"); //0 phan biet chu hoa//chu thuong
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


const buildSortOption = (query) => {
  const ALLOWED_SORT_FIELDS = ["price", "rating", "sold", "createdAt", "name"];
  const sortBy = ALLOWED_SORT_FIELDS.includes(query.sortBy) ? query.sortBy : "createdAt";
  const order  = query.order === "asc" ? 1 : -1;
  return { [sortBy]: order };
};

module.exports = { buildPagination, buildPaginationMeta, buildProductFilter, buildSortOption };
