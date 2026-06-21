const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Secret used to sign tokens. Override in production via the JWT_SECRET env var.
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
// Tokens stay valid for 7 days by default.
const JWT_EXPIRES_IN = "7d";

// Build a JWT for the given user document.
// Keep the payload small — only the fields we actually need on the frontend.
function signToken(user) {
    return jwt.sign(
        { id: user._id, username: user.username, admin: !!user.admin },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
    );
}

// Strip sensitive fields before sending the user object back to the client.
function sanitize(userDoc) {
    const obj = userDoc.toObject ? userDoc.toObject() : { ...userDoc };
    delete obj.password;
    delete obj.__v;
    return obj;
}

const authController = {
    // POST /auth/register
    registerUser: async (req, res) => {
        try {
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });

            const user = await newUser.save();
            const token = signToken(user);
            res.status(200).json({ ...sanitize(user), token });
        } catch (error) {
            // Mongoose duplicate-key error -> friendlier message
            if (error?.code === 11000) {
                return res.status(409).json("Username hoặc email đã tồn tại");
            }
            res.status(500).json(error?.message || "Đăng ký thất bại");
        }
    },

    // POST /auth/login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({ username: req.body.username });
            if (!user) return res.status(404).json("Wrong username!");

            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(401).json("Wrong password");

            const token = signToken(user);
            res.status(200).json({ ...sanitize(user), token });
        } catch (error) {
            res.status(500).json(error?.message || "Đăng nhập thất bại");
        }
    },
};

module.exports = authController;
// Re-export helpers so other modules can reuse the same secret + sanitize logic.
module.exports.JWT_SECRET = JWT_SECRET;
module.exports.sanitize = sanitize;
