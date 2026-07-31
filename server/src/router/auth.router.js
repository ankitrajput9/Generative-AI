import { Router } from "express";
import { registerController,loginController } from "../controller/auth.controller.js";

const authrouter = Router()

authrouter.post("/register",registerController)
authrouter.post("/login",loginController)
// authrouter.post("/logout")


export default authrouter