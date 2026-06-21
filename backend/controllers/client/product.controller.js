const Product = require("../../models/Product");
const {
    buildPagination,
    buildPaginationMeta,
    buildProductFilter,
    buildSortOption,
} = require("../../helpers/paginationHelper");

const productController = {
    // GET /products
    getAllProducts: async (req, res) => {
        try {
            const { page, limit, skip } = buildPagination(req.query);
            const filter = buildProductFilter(req.query);
            const sort   = buildSortOption(req.query);

            const [products, total] = await Promise.all([
                Product.find(filter).sort(sort).skip(skip).limit(limit),
                Product.countDocuments(filter),
            ]);

            res.status(200).json({
                pagination: buildPaginationMeta(total, page, limit),
                products,
            });
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // GET /products/:id
    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json("Không tìm thấy sản phẩm");
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = productController;
