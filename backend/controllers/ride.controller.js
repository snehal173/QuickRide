const rideService=require('../services/ride.service');
const {validationResult}=require('express-validator');
const mapService=require('../services/maps.service');
const rideModel=require('../models/rides.model');
const { sendMessageToSocketId } = require('../socket');

module.exports.createRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    if(!req.user){
        return res.status(401).json({message:"Unauthorized , no user found"});
    }
    const {pickup,destination,vehicleType}=req.body;

    try{
        const ride=await rideService.createRide({user:req.user._id,pickup,destination,vehicleType});
        res.status(201).json(ride);

        (
            async()=>{
                try{
                    const pickupCoordinates=await mapService.getAddressCoordinate(pickup);
                    const captainsInRadius=await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd,pickupCoordinates.lng,2);

                    if(!Array.isArray(captainsInRadius) || captainsInRadius.length===0){
                        console.warn("no captains found in the radius");
                        return ;
                    }
                    ride.otp="";
                  
                    const rideWithUser=await rideModel.findOne({_id:ride._id}).populate('user');
                    captainsInRadius.forEach(
                        captain=>{
                            console.log(captain,ride);
                            sendMessageToSocketId(captain.socketId,{
                                event:'new-ride',
                                data:rideWithUser
                            });
                        }
                    );

                }catch(error){
                  console.log(error);
                  console.error("Error in post-ride operation",error);
                }
            }
        )();

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"error while creating ride"});
    }

};
// module.exports.createRide = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, pickup, destination, vehicleType } = req.body;

//     try {
//         const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
//         res.status(201).json(ride);

//         const pickupCoordinates = await mapService.getAddressCoordinate(pickup);



//         const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);

//         ride.otp = ""

//         const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

//         captainsInRadius.map(captain => {

//             sendMessageToSocketId(captain.socketId, {
//                 event: 'new-ride',
//                 data: rideWithUser
//             })

//         })

//     } catch (err) {

//         console.log(err);
//         return res.status(500).json({ message: err.message });
//     }

// };

module.exports.getfare=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {pickup,destination}=req.query;
    
    try{
      const fare=await rideService.getFare(pickup,destination);
      return res.status(200).json(fare);

    }catch(error){
        console.log(error);
        return res.status(500).json({message:"error while fetching fare of the ride"});
    }
}

module.exports.confirmRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideId}=req.body;
    try{
        const ride=await rideService.confirmRide({rideId,captain:req.captain});

        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-confirmed',
            data:ride
        })
        console.log("🎯 Confirm ride triggered by:", req.captain._id);

        return res.status(200).json(ride);
    }catch(error){
        console.log(error);
        return res.status(500).json({message:error.message});
    }
}

module.exports.startRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {rideId,otp}=req.query;
    try{
      const ride=await rideService.startRide({rideId,otp,captain:req.captain});
      console.log(ride);
      sendMessageToSocketId(ride.user.socketId,{
        event:'ride-started',
        data:ride
      })
      return res.status(200).json(ride);
    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

module.exports.endRide=async(req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});

    }
    const {rideId}=req.body;
    try{
        const ride=await rideService.endRide({rideId,captain:req.captain});
        sendMessageToSocketId(ride.user.socketId,{
            event:'ride-ended',
            data:ride
        })
        return res.status(200).json(ride);
    }
    catch(error){
       return res.status(500).json({message:error.message})
    }
}
