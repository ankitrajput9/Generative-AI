import ConversationModel from "../model/convertation.model.js";
import messageModel from "../model/message.model.js";
import { generateTitle } from "../service/ai.service.js";
import { getStream } from "../service/ai.service.js";

export const ConversationController = async (req, res) => {

    try {
        let { title } = req.body

        let newConversation = await ConversationModel.create({
            user: req.user.id,         //geting user from middleware
            title
        })

        res.status(201).json({
            status: "success",
            data: newConversation
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export const getAllConversation = async (req, res) => {

    try {

        const Conversations = await ConversationModel.find({ user: req.user.id }).sort({
            createdAt: -1
        })
        res.status(200).json({
            status: "success",
            data: Conversations
        })
    } catch {
        console.log(`error in get all Conversation ${error}`)
        res.status(500).json({
            status: "error",
            message: error.message
        })

    }

}



export const handleMessage = async (req, res) => {
    try {
        let { message, ConversationId } = req.body
        let conversation = null
        if (!ConversationId) {
            const title = await generateTitle({ message })
            conversation  = await ConversationModel.create({
                user: req.user.id,
                title
            })
        } else {
            conversation = await ConversationModel.findOne({
                _id: ConversationId,
                user: req.user.id
            })
        }
        
        if (!conversation) {
            return res.status(404).json({
                status: "error",
                message: "Conversation not found"
            })
        }
        console.log("hello0")

        let userMessage = await messageModel.create({
            conversation: conversation._id,
            content: message,
            author: "user"
        })
        console.log("hello1")

        const stream = await getStream({ message })

        console.log("hello2")
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Conversation-Id', conversation._id.toString());
        res.setHeader('X-Conversation-Title', conversation.title);
        res.setHeader('Access-Control-Expose-Headers', 'X-Conversation-Id, X-Conversation-Title');

        let assistantReply = '';

        for await (const [token, metadata] of stream) {
            const tokenText = token?.text || '';
            assistantReply += tokenText;

            process.stdout.write(tokenText);

            const lines = tokenText.split('\n');
            for (const line of lines) {
                res.write(`data: ${line}\n`);
            }
            res.write('\n');
        }

        if (assistantReply.trim()) {
            await messageModel.create({
                conversation: conversation._id,
                content: assistantReply,
                author: "ai"
            })

            await ConversationModel.updateOne(
                { _id: conversation._id },
                { $set: { updatedAt: new Date() } }
            )

            res.end()
        }
    } catch (error) {
        console.log(`error in Handlemessage ${error}`)
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

