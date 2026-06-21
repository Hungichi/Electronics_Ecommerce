const router            = require("express").Router();
const productController = require("../../controllers/client/product.controller");

router.get("/", productController.getAllProducts);
router.get("/:id", productController.getProductById);

module.exports = router;
