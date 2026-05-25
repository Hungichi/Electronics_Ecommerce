const bcrypt = require("bcrypt");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");

// tao token
const generateAccessToken  = (user) =>
    jwt.sign(
        { id: user._id, admin: user.admin },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" }
    );

// tao refresh token
const generateRefreshToken = (user) =>
    jwt.sign(
        { id: user._id, admin: user.admin },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );

const authController = {

    // POST /auth/register 
    registerUser: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // ktra username/email ton tai trong db chua
            const existed = await User.findOne({ $or: [{ username }, { email }] });
            if (existed) {
                return res.status(409).json({ message: "Username hoặc email đã tồn tại" });
            }

            const salt     = await bcrypt.genSalt(10);
            const hashed   = await bcrypt.hash(password, salt); //hash password

            const newUser  = await new User({ username, email, password: hashed }).save(); 

            const { password: _pw, ...userInfo } = newUser.toObject();
            return res.status(201).json({ message: "Đăng ký thành công", user: userInfo });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },

    // POST /auth/login 
    loginUser: async (req, res) => {
        try {
            const { username, password } = req.body;

            const user = await User.findOne({ username });
            if (!user) {
                return res.status(404).json({ message: "Sai tên đăng nhập!" });
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ message: "Sai mật khẩu!" });
            }

            const accessToken  = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // Gửi RF qua HttpOnly cookie 
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure:   process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge:   7 * 24 * 60 * 60 * 1000  // 7 ngày
            });

            const { password: _pw, ...userInfo } = user.toObject();
            return res.status(200).json({
                message: "Đăng nhập thành công",
                accessToken,
                user: userInfo
            });
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },

    // POST /auth/refresh
    refreshToken: async (req, res) => {
        try {
            const token = req.cookies.refreshToken;
            if (!token) {
                return res.status(401).json({ message: "Không có refresh token" });
            }

            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            const user    = await User.findById(decoded.id);
            if (!user) {
                return res.status(403).json({ message: "Token không hợp lệ" });
            }

            const newAccessToken = generateAccessToken(user);
            return res.status(200).json({ accessToken: newAccessToken });
        } catch (error) {
            return res.status(403).json({ message: "Refresh token hết hạn hoặc không hợp lệ" });
        }
    },

    // POST /auth/logout 
    logoutUser: (req, res) => {
        res.clearCookie("refreshToken");
        return res.status(200).json({ message: "Đăng xuất thành công" });
    },

    // GET /auth/me  (cần đăng nhập) 
    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select("-password");
            if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ message: "Lỗi server", error });
        }
    },
};

module.exports = authController;
