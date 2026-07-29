
import mongoose from "mongoose";
import env from "./env.js";


export const connectDB = async ()=>{

    try {
        await mongoose.connect(env.MONGO_URL)
        console.log("Database is connected")
    } catch (error) {
        console.log(`error in data base ${error}`)
    }
 
}