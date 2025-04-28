const captainModel=require('../models/caption.model')

module.exports.createCaptain=async({
    firstname,lastname,email,password,color,plate,capacity,vehicleType
} )=>{
    if(!firstname || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new Error('all fields are required')
    }

    const captain= await captainModel.create({
        fullname:{
            firstname:firstname,
            lastname:lastname
        },
        email:email,
        password:password,
        vehicle:{
            color:color,
            plate:plate,
            capacity:capacity,
            vehicleType:vehicleType
        }
    })
    return captain;
}



