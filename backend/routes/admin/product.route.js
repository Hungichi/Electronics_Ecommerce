const router            = require("express").Router();
const productController = require("../../controllers/admin/product.controller");

router.post("/", productController.createProduct);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id/toggle-featured", productController.toggleFeatured);
router.patch("/:id/toggle-active", productController.toggleActive);

module.exports = router;
