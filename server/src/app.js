import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import authrouter from "./router/auth.router.js"
import convertationrouter from "./router/convertation.router.js"
import errormiddleware from "./middleware/error.middleware.js"
import env from "./config/env.js"
const app = express()

app.use(cors({
    origin: env.VITE_CLIENT_URL ,
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.get("/api/helth",(req,res)=>{
    res.status(200).json({
        message:"Api is health",
        status:200
    })
} )


app.use("/api/auth",authrouter)
app.use("/api/convertation",convertationrouter)




app.use(errormiddleware)
export default app

