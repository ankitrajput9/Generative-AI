import mongoose from "mongoose"

let contextSchema = new mongoose.Schema({
user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "auth",
    required : true
},
context:{
    type:String,
    required:true
}

},{timestamps:true})

export const contextModel = mongoose.model("context",contextSchema)