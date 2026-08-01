
import convertationModel from "../model/convertation.model.js";
import messageModel from "../model/message.model.js";

const convertationController = async (req, res) => {

    try {
        let { title } = req.body

        let newConvertation = await convertationModel.create({
            user: req.user.id,         //geting user from middleware
            title
        })

        res.status(201).json({
            status: "success",
            data: newConvertation
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}


const getAllConvertation = async (req, res) => {

    try {

        const convertations = await convertationModel.find({ user: req.user.id }).sort({
            createdAt: -1
        })
        res.status(200).json({
            status: "success",
            data: convertations
        })
    } catch {
        console.log(`error in get all convertation ${error}`)
        res.status(500).json({
            status: "error",
            message: error.message
        })

    }

}



const handleMessage = async (req, res) => {
    try {
        let { message, convertationId } = req.body
        let convertation = null
        if (!convertationId) {
            const title = await generateTitle({ message })
            convertation = await convertationModel.create({
                user: req.user.id,
                title
            })
        } else {
            convertation = await convertationModel.findOne({
                _id: convertationId,
                user: req.user.id
            })
        }

        if (!convertation) {
            return res.status(404).json({
                status: "error",
                message: "convertation not found"
            })
        }

        let userMessage = await messageModel.create({
            convertation: convertation._id,
            content: message,
            author: "user"
        })

        const stream = await getStream({ message })

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.setHeader('X-Conversation-Id', convertation._id.toString());
        res.setHeader('X-Conversation-Title', convertation.title);
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
                convertation: convertation._id,
                content: assistantReply,
                author: "ai"
            })

            await convertationModel.updateOne(
                { _id: convertation._id },
                { $set: { updatedAt: new Date() } }
            )

            res.end()
        }
    } catch (error) {
        console.log(`error in handle message ${error}`)
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export default { convertationController, getAllConvertation, handleMessage }

