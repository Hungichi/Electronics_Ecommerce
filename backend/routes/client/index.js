const productRoutes = require("./product.route");
const authRoutes    = require("../authRoutes");
const cartRoutes    = require("../cartRoutes");
const userRoutes    = require("../userRoutes");

module.exports = (app) => {
    app.use("/products", productRoutes);
    app.use("/auth",     authRoutes);
    app.use("/cart",     cartRoutes);
    app.use("/users",    userRoutes);
};
