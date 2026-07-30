import dotenv from "dotenv";
dotenv.config();

const env = {

    PORT: Number(process.env.PORT) || 3000,
    MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/langchain",
    JWT_SECRET: process.env.JWT_SECRET || "secret",
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1d",
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    VITE_CLIENT_URL: process.env.VITE_CLIENT_URL || "http://localhost:5173"
}
export default env