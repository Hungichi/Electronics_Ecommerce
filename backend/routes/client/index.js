const productRoutes = require("./product.route");
const authRoutes    = require("../authRoutes");
const cartRoutes    = require("../cartRoutes");

module.exports = (app) => {
    app.use("/products", productRoutes);
    app.use("/auth",     authRoutes);
    app.use("/cart",     cartRoutes);
};
