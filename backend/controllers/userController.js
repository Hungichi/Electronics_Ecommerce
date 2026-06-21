const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sanitize } = require("./authController");

// Only these fields can be edited from the profile page.
// Username and email stay immutable here to keep things simple.
const EDITABLE_FIELDS = ["phone", "avatar", "email", "addresses"];

const userController = {
    // GET /users/me  -> returns the current user's full profile
    getMe: async (req, res) => {
        try {
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json("User not found");
            res.status(200).json(sanitize(user));
        } catch (error) {
            res.status(500).json(error?.message || "Lỗi server");
        }
    },

    // PUT /users/me  -> updates the editable fields above
    updateMe: async (req, res) => {
        try {
            const update = {};
            for (const key of EDITABLE_FIELDS) {
                if (req.body[key] !== undefined) update[key] = req.body[key];
            }

            const user = await User.findByIdAndUpdate(
                req.user.id,
                { $set: update },
                { new: true, runValidators: true }
            );
            if (!user) return res.status(404).json("User not found");
            res.status(200).json(sanitize(user));
        } catch (error) {
            if (error?.code === 11000) return res.status(409).json("Email đã tồn tại");
            res.status(500).json(error?.message || "Cập nhật thất bại");
        }
    },

    // PUT /users/me/password   body: { currentPassword, newPassword }
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json("Thiếu mật khẩu");
            }
            if (newPassword.length < 6) {
                return res.status(400).json("Mật khẩu mới phải có ít nhất 6 ký tự");
            }

            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json("User not found");

            const valid = await bcrypt.compare(currentPassword, user.password);
            if (!valid) return res.status(401).json("Mật khẩu hiện tại không đúng");

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            res.status(200).json("Đổi mật khẩu thành công");
        } catch (error) {
            res.status(500).json(error?.message || "Đổi mật khẩu thất bại");
        }
    },
};

module.exports = userController;
