import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import env from "./src/config/env.js";

const server =async()=>{

   await connectDB()

app.listen(env.PORT,()=>{
    console.log(`Server is running on ${env.PORT}`)
})
}

server()