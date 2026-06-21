const Product = require("../../models/Product");

const productController = {
    // POST /admin/products
    createProduct: async (req, res) => {
        try {
            const newProduct = await new Product(req.body).save();
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // PUT /admin/products/:id
    updateProduct: async (req, res) => {
        try {
            const updatedProduct = await Product.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { returnDocument: 'after', runValidators: true }
            );
            if (!updatedProduct) return res.status(404).json("Không tìm thấy sản phẩm");
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // DELETE /admin/products/:id
    deleteProduct: async (req, res) => {
        try {
            const deletedProduct = await Product.findByIdAndDelete(req.params.id);
            if (!deletedProduct) return res.status(404).json("Không tìm thấy sản phẩm");
            res.status(200).json("Xóa sản phẩm thành công");
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // PATCH /admin/products/:id/toggle-featured
    toggleFeatured: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json("Không tìm thấy sản phẩm");
            product.isFeatured = !product.isFeatured;
            await product.save();
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // PATCH /admin/products/:id/toggle-active
    toggleActive: async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(404).json("Không tìm thấy sản phẩm");
            product.isActive = !product.isActive;
            await product.save();
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json(error);
        }
    },
};

module.exports = productController;
