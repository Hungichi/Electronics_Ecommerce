const router = require("express").Router();
const cartController = require("../controllers/cartController");

// All cart endpoints are scoped under a userId path param.
router.get("/:userId", cartController.getCart);
router.post("/:userId/items", cartController.addItem);
router.put("/:userId/items/:productId", cartController.updateItem);
router.delete("/:userId/items/:productId", cartController.removeItem);
router.delete("/:userId", cartController.clearCart);

module.exports = router;
