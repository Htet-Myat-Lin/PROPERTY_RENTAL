import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

import { errorHandler } from "./middleware/error.middleware.js"
import { authRouter } from "./modules/auth/auth.route.js"
import { propertyRouter } from "./modules/property/property.route.js"
import { userRouter } from "./modules/user/user.route.js"
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:5000",
    credentials: true
}))

app.use(morgan('dev'));

// serving static files (images)
app.use("/uploads", express.static("src/uploads"))

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/properties", propertyRouter)

// Global Error Handler
app.use(errorHandler)

export default app