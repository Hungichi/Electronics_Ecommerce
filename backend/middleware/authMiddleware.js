const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../controllers/authController");

// Reads "Authorization: Bearer <token>" from the request, verifies it,
// and attaches the decoded payload to req.user for downstream handlers.
function verifyToken(req, res, next) {
    const header = req.headers.authorization || "";
    if (!header) return res.status(401).json("Missing token");

    const token = header.startsWith("Bearer ") ? header.slice(7) : header;
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (e) {
        return res.status(401).json("Invalid or expired token");
    }
}

// Same as verifyToken but additionally checks the `admin` flag in the payload.
function verifyAdmin(req, res, next) {
    verifyToken(req, res, () => {
        if (!req.user?.admin) return res.status(403).json("Admin only");
        next();
    });
}

module.exports = { verifyToken, verifyAdmin };
