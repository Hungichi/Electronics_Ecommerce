const router         = require("express").Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", authController.registerUser);
router.post("/login",    authController.loginUser);
router.post("/refresh",  authController.refreshToken);
router.post("/logout",   authController.logoutUser);

// Protected route (cần đăng nhập)
router.get("/me", verifyToken, authController.getMe);

module.exports = router;
