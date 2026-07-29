import {ChatMistralAI} from "langchain/mistralai"
import {createAgent,tool, toolStrategy} from "langchain"
import env from "../config/env.js"



const model = new ChatMistralAI({
    model:"mistral-medium-latest",
    apiKey:env.MISTRAL_API_KEY
})


async function generateTitle({message}){

const agent = await createAgent({
    model,
    systemPrompt:"Your role is to generate the title for the conversation on the basis of user first message",
    responseFormat:toolStrategy(z.object({
        title:z.string().describe("The title of the conversation based on the message")
    }))
})

const response = await agent.invoke({
    messeges:[
        new HumanMessage(message)
    ]
})
return response.structuredResponse.title

}



 async function getStream ({message}){

const agent = await createAgent({
    model,
    tools:[],
})

const stream = agent.stream({
    messeges:[
        new HumanMessage(message)
    ],
},{
    streamMode:messages
}


)
return stream
 }