import mongoose from "mongoose";


const authSchema = new mongoose.Schema({
    
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        tolowercase:true
    },
    password:{
        type:String,
        required:true
    },
},
{
    timestamps:true
}
)

const authmodel = mongoose.model("auth",authSchema)
export default authmodel