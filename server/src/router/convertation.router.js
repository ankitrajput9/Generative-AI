import Router from "express"
import { convertationController, getAllConvertation, handleMessage } from "../controller/convertation.controller.js"
import protect from "../middleware/auth.middleware.js"

const convertationrouter = Router()

convertationrouter.post("/create-convertation",protect,convertationController)
convertationrouter.get("/chat",protect,getAllConvertation)
convertationrouter.post("/message",protect,handleMessage)


export default convertationrouter