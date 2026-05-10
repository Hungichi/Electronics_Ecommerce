const express      = require("express");
const cors         = require("cors");
const dotenv       = require("dotenv");
const cookieParser = require("cookie-parser");

const database    = require("./config/db");
const adminRoutes  = require("./routes/admin/index");
const clientRoutes = require("./routes/client/index");

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 8000;

// ─── Kết nối Database ─────────────────────────────────────────────────────────
database.connect();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(cookieParser());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
adminRoutes(app);   // /admin/products, /admin/...
clientRoutes(app);  // /products, /auth, ...

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
