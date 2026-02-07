import dotenv from "dotenv"
dotenv.config()
import app from "./app.js"
import { connectDB } from "./config/db.js"
import dns from 'node:dns';

// Set custom DNS servers to avoid potential resolution issues
dns.setServers(['8.8.8.8', '1.1.1.1']);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    }
)})

