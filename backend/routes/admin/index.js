const systemConfig = require("../../config/system");

const productRoutes = require("./product.route");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + "/products", productRoutes);
};
