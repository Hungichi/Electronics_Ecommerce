const jwt = require("jsonwebtoken");

// xac thuc token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    // bearer <token> (trong  request header)
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;   // { id, admin, iat, exp }
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token đã hết hạn, vui lòng refresh" });
        }
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
};

// ktra admin
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (!req.user.admin) {
            return res.status(403).json({ message: "Bạn không có quyền admin" });
        }
        next();
    });
};

// cho phep chinh chu or admin
const verifyOwnerOrAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.admin) {
            return next();
        }
        return res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này" });
    });
};

module.exports = { verifyToken, verifyAdmin, verifyOwnerOrAdmin };
