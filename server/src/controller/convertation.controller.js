

const convertationController = async (req, res) => {

try {
        let {title} = req.body
    
let newConvertation =  await convertationModel.create({
user: req.user.id ,         //geting user from middleware
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

try{

    const convertations = await convertationModel.find({user: req.user.id}).sort({
        createdAt: -1
    })
    res.status(200).json({
        status: "success",
        data: convertations
    })
}catch{
    console.log(`error in get all convertation ${error}`)
    res.status(500).json({
        status: "error",
        message: error.message
    })
    
}

}