const productRoutes = require("./product.route");
const authRoutes    = require("../authRoutes");

module.exports = (app) => {
    app.use("/products", productRoutes);
    app.use("/auth",     authRoutes);
};
