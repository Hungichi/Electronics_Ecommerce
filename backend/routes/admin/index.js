const systemConfig    = require("../../config/system");
const { verifyAdmin } = require("../../middleware/authMiddleware");

const productRoutes = require("./product.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    //  verifyAdmin cho full route /admin/
    app.use(PATH_ADMIN, verifyAdmin);

    app.use(PATH_ADMIN + "/products", productRoutes);
};
