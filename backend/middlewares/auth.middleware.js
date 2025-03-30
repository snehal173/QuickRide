const jwt=require("jsonwebtoken")
const userModel = require('../models/user_model');

module.exports.authUser=async (req,res,next)=>{
     const token=req.cookies.token || req.headers.token?.split(' ')[1];
     console.log(token);

     if(!token){
        return res.status(404).json({
            message:"token is missing"
        })
     }

     try{
         const decoded=jwt.verify(token,process.env.JWT_SECRET)
         const userid=decoded._id;

         const user= await userModel.findById(userid);
         req.user=user;

         return next();

     }catch(error){
        return res.status(401).json({
            message:"unauthorised , some error encountered"
        })
     }

}