const captainModel=require('../models/caption.model');
const captainService=require('../services/captian.service');
const blacklistTokenModel = require('../models/blacklistToken.model');
const {validationResult} = require('express-validator');

module.exports.registerCaptain=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    try{
    const fullname=req.body.fullname;
    const firstname=fullname.firstname;
    const lastname=fullname.lastname;
    const email=req.body.email;
    const password=req.body.password;
    const vehicle=req.body.vehicle;
    const color=vehicle.color;
    const plate=vehicle.plate;
    const capacity=vehicle.capacity;
    const vehicleType=vehicle.vehicleType;

    const isCaptainexists=await captainModel.findOne({email});
    if(isCaptainexists){
        return res.status(400).json({message:"captain exists already"});
    }

    const hashedPassword=await captainModel.hashPassword(password);
    const captain =await captainService.createCaptian({
        
        firstname:firstname,
        lastname:lastname,
        email:email,
        password:hashedPassword,
        color:color,
        plate:plate,
        capacity:capacity,
        vehicleType:vehicleType
        
    })

    const token=captain.generateAuthToken();

      return res.status(200).json({
        message:"captain created successfully",
        captain:captain,
        token:token
      })
    
    }catch(error){
         return res.status(401).json({
            message:"error while signing up captian"
         })
    }
    
}

module.exports.loginCaptain=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(401).json({errors:errors.array()});
    }
    const email=req.body.email;
    const password=req.body.password;
    try{
        const captain=await captainModel.findOne({email}).select('+password');
        if(!captain){
            return res.status(401).json({
                message:"captian does not exists , sign up first"
            })
        }

        const isMatch= await captain.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message:"password does not match"
            })
        }
        const token=captain.generateAuthToken();
    
        res.cookie('token', token);

        return res.status(200).json({
          token,
          captain
        })

    }catch(error){
        return res.status(401).json({
            message:"error while signing in caption"
        })
    }
}

module.exports.getCaptainProfile=async(req,res,next)=>{
    return res.status(200).json(req.captain); 
}

module.exports.logoutCaptain=async(req,res,next)=>{
    res.clearCookie('token');
    //fetching token from cookies or headers
    const token=req.cookies?.token || req.headers.token?.split('')[1];
    //blacklisting the token
    await blacklistTokenModel.create({token:token});
    //response
    return res.status(200).json({
        message:"captian logged out successfully"
    })
}

//test_captian password