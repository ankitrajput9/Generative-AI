import Router from "express"
import {
    ConversationController,
    getAllConversation,
    handleMessage,
    getConversationMessages,
    deleteConversationById
} from "../controller/convertation.controller.js"
import protect from "../middleware/auth.middleware.js"

const Conversationrouter = Router()

Conversationrouter.post("/create-Conversation", protect, ConversationController)
Conversationrouter.get("/chat", protect, getAllConversation)
Conversationrouter.get("/messages/:conversationId", protect, getConversationMessages)
Conversationrouter.delete("/:conversationId", protect, deleteConversationById)
Conversationrouter.post("/message", protect, handleMessage)

export default Conversationrouter