const router = require("express").Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// All endpoints below require a valid JWT.
router.get("/me", verifyToken, userController.getMe);
router.put("/me", verifyToken, userController.updateMe);
router.put("/me/password", verifyToken, userController.changePassword);

module.exports = router;
