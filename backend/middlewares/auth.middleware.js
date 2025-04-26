const jwt=require("jsonwebtoken")
const userModel = require('../models/user_model');
const captainModel=require('../models/caption.model');
const blacklistTokenModel = require('../models/blacklistToken.model');
// module.exports.authUser=async (req,res,next)=>{
//      console.log(req.cookies?.token,"hi");
//      console.log(req.headers.authorization?.split(' ')[1]);
//      const token=req.cookies?.token || req.headers.authorization?.split(' ')[1];
//      console.log(token);

//      if(!token){
//         return res.status(404).json({
//             message:"token is missing"
//         })
//      }
//      //check if token is blacklisted
//       const isBlackListed=await blacklistTokenModel.findOne({token:token});

//       if(isBlackListed){
//         return res.json({
//             message:"token is blacklisted, this is because you have logged out"
//         })
//       }

//      try{
//          const decoded=jwt.verify(token,process.env.JWT_SECRET)
//          const userid=decoded._id;

//          const user= await userModel.findById(userid);
//          req.user=user;

//          return next();

//      }catch(error){
//         return res.status(401).json({
//             message:"unauthorised , some error encountered"
//         })
//      }

// }
module.exports.authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    console.log("Token:", token);
  
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }
  
    const isBlackListed = await blacklistTokenModel.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Token is blacklisted, please log in again" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT payload:", decoded);
  
      const userid = decoded._id || decoded.id;
      const user = await userModel.findById(userid);
  
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
  
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized, invalid token" });
    }
  };
  

module.exports.authCaptain=async(req,res,next)=>{
    console.log(req.cookies?.token);
    console.log(req.headers.authorization?.split(' ')[1]);
    const token=req.cookies?.token || req.headers.authorization?.split(' ')[1];
    console.log(token);
    if(!token){
        return res.status(401).json({
            message:"token is missing",
        })
    }
    const isblacklisted=await blacklistTokenModel.findOne({token:token});
    if(isblacklisted){
        return res.json({
            message:"captian has loggedout"
        })
    }
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decode);
    const captainid=decode._id;
    console.log(captainid);
    const captain=await captainModel.findById("680b98abc8b7b0f58d74fcfe");
    console.log("the captain is",captain);
    if(!captain){
        return res.status(401).json({
            message:"unauthorised,hello captain"
        })
    }
    req.captain=captain;
    
    return next();

    }catch(error){
        console.log(error);
       return res.status(401).json({
        message:"unauthorised , some error encountered",
       })
    }
}