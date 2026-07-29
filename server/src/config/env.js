import dotenv from "dotenv";
dotenv.config();

const env ={

    PORT : Number(process.env.PORT) || 3000,
    MONGO_URL : process.env.MONGO_URL || "mongodb://localhost:27017/langchain",
    JWT_SECRET : process.env.JWT_SECRET || "secret",
    JWT_EXPIRES_IN : process.env.JWT_EXPIRES_IN || "1d",

}
export default env