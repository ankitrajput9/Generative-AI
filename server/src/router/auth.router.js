import { Router } from "express";
import { registerController } from "../controller/auth.controller.js";

const authrouter = Router()

authrouter.post("/register",registerController)
// authrouter.post("/login")
// authrouter.post("/logout")


export default authrouter