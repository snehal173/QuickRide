const rideModel=require('../models/rides.model');
const mapService=require('./maps.service');
// const bcrpyt=require('bcrypt');
const crypto=require('crypto')

async function getFare(pickup,destination){
    if(!pickup || !destination){
        throw new Error('Pickup and destination are required');
    }

    const distanceTime=await mapService.getDistanceTime(pickup,destination);
    const baseFare={
        bike:20,
        auto:30,
        car:50
    };
    const perKmRate={
        bike:8,
        auto:10,
        car:15
    };
    const perMinuteRate={
        bike:1.5,
        auto:2,
        car:3
    }
    const fare={
        auto:Math.round(baseFare.auto + ((distanceTime.distance.value/1000)*perKmRate.auto) +((distanceTime.duration.value/60)*perMinuteRate.auto)),
        car:Math.round(baseFare.car + ((distanceTime.distance.value/1000)*perKmRate.car) +((distanceTime.duration.value/60)*perMinuteRate.car)),
        bike:Math.round(baseFare.bike + ((distanceTime.distance.value/1000)*perKmRate.bike) +((distanceTime.duration.value/60)*perMinuteRate.bike)),
    }
    return fare;
}
module.exports.getFare=getFare;

function getOtp(num){
    if (!Number.isInteger(num) || num < 1) {
        throw new Error('OTP length must be a positive integer greater than 0.');
    }

    const min = Math.pow(10, num - 1);
    const max = Math.pow(10, num);
    return crypto.randomInt(min, max).toString();
}

// module.exports.createRide=async({
//    user,pickup,destination,vehicleType
// })=>{
//     if(!user || !pickup ||!destination || !vehicleType){
//       throw new Error('All fields are required');
//     }
//     const fare=await getFare(pickup,destination);
//     const ride= await rideModel.create({
//         user,
//         pickup,
//         destination,
//         otp:getOtp(6),
//         fare:fare[vehicleType]
//     })
//     return ride;
// }

module.exports.createRide = async ({
    user, pickup, destination, vehicleType
}) => {
    if (!user || !pickup || !destination || !vehicleType) {
        throw new Error('All fields are required');
    }

    const fare = await getFare(pickup, destination);



    const ride = rideModel.create({
        user,
        pickup,
        destination,
        otp: getOtp(6),
        fare: fare[ vehicleType ]
    })

    return ride;
}

module.exports.confirmRide=async({
    rideId,captain
})=>{
    if(!rideId){
        throw new Error('Ride id is required');
    }
    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'accepted',
        captain:captain._id
    })
    const ride=await rideModel.findOne({
     _id:rideId
    }).populate('user').populate('captain').select('+otp');

    if(!ride){
        throw new Error('Ride not found');
    }
    return ride;
}

module.exports.startRide=async({rideId,otp,captain})=>{
    if(!rideId || !otp){
        throw new Error('Ride id and OTP are required');
    }

    const ride=await rideModel.findOne({
        _id:rideId
    }).populate('user').populate('captain').select('+otp');

    if(!ride){
        throw new Error('Ride not found');
    }
    if(ride.status!=='accepted'){
        throw new Error('Ride not accepted');
    }
    if(ride.otp !==otp){
        throw new Error('Invalid OTP');
    }
    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'ongoing'
    }, { new: true } )
    return ride;
}

module.exports.endRide=async({rideId,captain})=>{
    if(!rideId){
        throw new Error('Ride id is required');
    }
    console.log(captain._id);
    const ride=await rideModel.findOne({
        _id:rideId,
        captain:captain._id
    }).populate('user').populate('captain').select('+otp');
    console.log("the ridde is",ride);
    if(!ride){
        throw new Error ('Ride not found');
    }
    
    // if(ride.status !== 'ongoing'){
    //     throw new Error('Ride not ongoing');
    // }

    await rideModel.findOneAndUpdate({
        _id:rideId
    },{
        status:'completed'
    })
    return ride;
}





