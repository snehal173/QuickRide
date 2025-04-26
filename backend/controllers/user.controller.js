// const userModel=require("../models/user_model");
// const userService = require('../services/user.service');
// const { validationResult } = require('express-validator');

// async function registerUser(req,res,next){
//       const errors=validationResult(req);
//       if(!errors.isEmpty()){
//          return res.status(400).json({
//             errors:errors.array()
//          });
//        }

//        const {fullname,email,password}=req.body;

//        const isUserAlready=await userModel.findOne({email});

//        if(isUserAlready){
//         return res.status(400).json({message :"user already exist"});
//        }

//        const hashedPassword=await userModel.hashPassword(password);

//        const user=await userService.createUser({
//         firstname:fullname.firstname,
//         lastname:fullname.lastname,
//         email,
//         password:hashedPassword
//        })

//        const token=user.generateAuthToken();

//        res.status(201).json({
//         token , user
//        });



// }

// module.exports=registerUser

const userModel = require('../models/user_model');
const userService = require('../services/user.service');
const {validationResult} = require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async(req , res , next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() }); //400 status code means error
    }

    const { fullname, email, password } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
        return res.status(400).json({ message: 'User already exist' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();
    res.status(201).json({ token, user }); //201 status code means success
}

module.exports.loginUser=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const email=req.body.email;
    const password=req.body.password;

    const user= await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({
            message:"user does not exist"
        })
    }
    const isMatch=user.comparePassword(password);
    if(!isMatch){
        return res.status(401).json({
            message:"password donot match"
        })
    }
    //generate token
    const token=user.generateAuthToken();
    
    res.cookie('token', token);

    return res.status(200).json({
        token,
        user
    })
}
//authentication should be done before this function
module.exports.getUserProfile=async(req,res,next)=>{
    res.status(200).json(req.user);
}

module.exports.logoutUser=async(req,res,next)=>{
    //removing token from cookies
    res.clearCookie('token');
    //fetching token from cookies or headers
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    //blacklisting the token
    await blacklistTokenModel.create({token});
    //response
    return res.status(200).json({
        message:"user logged out successfully"
    })
}


