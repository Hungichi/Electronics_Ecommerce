const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/authRoutes")
const database = require("./config/db")

dotenv.config()
const app = express()

database.connect()

app.use(cors())
app.use(cookieParser())
app.use(express.json())


//ROUTES    
app.use("/v1/auth", authRoute)

app.listen(8000, () => {
    console.log("server is running.")
})