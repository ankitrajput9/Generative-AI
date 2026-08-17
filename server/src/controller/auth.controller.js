
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import authmodel from "../model/auth.model.js"
import env from "../config/env.js"


const signIN = (id) => jwt.sign({ id }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN })
export const registerController = async (req, res) => {

    try {
        let { username, email, password } = req.body

        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
                success: false
            })
        }

        const existedUser = await authmodel.findOne({ email })
        if (existedUser) {
            res.status(400).json({
                message: "User already exists",
                success: false
            })
        }

        const hashpassword = await bcrypt.hash(password, 10)

        const user = await authmodel.create({
            username,
            email: email.toLowerCase(),
            password: hashpassword
        })

        const token = signIN(user._id)
        // res.cookie( "token",token)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,       // must be true — cross-site cookies require HTTPS
            sameSite: 'none',   // must be 'none' — allows cross-domain cookie
        });

        res.status(201).json({
            message: "User created successfully",
            success: true,
            token
        })

    } catch (error) {
        console.log(`error in register controller ${error}`)
        res.status(500).json({
            message: "internal server error",
            success: false
        })

    }

}


export const loginController = async (req, res) => {
    try {

        let { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({
                message: "all fields require ",
                status: false
            })
        }

        const user = await authmodel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                message: "user not exist! register first ",
                status: false
            })
        }


        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(401).json({
                messege: "unauthorize user ",
                status: false
            })
        }

        const token = signIN(user._id)
        // res.cookie("token", token)
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,       // must be true — cross-site cookies require HTTPS
            sameSite: 'none',   // must be 'none' — allows cross-domain cookie
        });

        return res.status(200).json({
            message: "user loged succesfully",
            ssatus: true,
            user
        })


    } catch (error) {
        console.log(`error in login controller ${error}`)
        res.status(200).json({
            message: 'internal server error',
            status: false
        })
    }
}