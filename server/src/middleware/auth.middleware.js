
import jwt from "jsonwebtoken"
import env from "../config/env.js"




const protect = (req,res,next)=>{

    let {token} = req.cookies

    if(!token){
    return res.status(401).json({
        message:"token not found",
        status:false
    })
    }
    try {
        const decode = jwt.verify(token , env.JWT_SECRET)
        req.user = {id:decode.id}
        next()
    } catch (error) {
        console.log(`error in protect middleware${error}`)
        res.status(401).json({
            message:"token is not valid",
            status:false
        })
        
    }

}

export default protect ;