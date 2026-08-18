import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import morgan from "morgan"

import { errorHandler } from "./middleware/error.middleware.js"
import { authRouter } from "./modules/auth/auth.route.js"
import { propertyRouter } from "./modules/property/property.route.js"
import { userRouter } from "./modules/user/user.route.js"
import { wishlistRouter } from "./modules/wishlist/wishlist.route.js"
import { reviewRouter } from "./modules/review/review.route.js"

import "@/workers/email.worker"; // Start the email worker when the app starts

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

app.use(morgan('dev'));

// serving static files (images)
app.use("/uploads", express.static(process.env.UPLOAD_DIR as string))

app.use("/api/auth", authRouter)
app.use("/api/users", userRouter)
app.use("/api/properties", propertyRouter)
app.use("/api/wishlist", wishlistRouter)
app.use("/api/reviews", reviewRouter)

// Global Error Handler
app.use(errorHandler)

export default app