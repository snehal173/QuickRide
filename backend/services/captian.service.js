const captianModel=require('../models/caption.model')

module.exports.createCaptian=async({
    firstname,lastname,email,password,color,plate,capacity,vehicleType
} )=>{
    if(!firstname || !email || !password || !color || !plate || !capacity || !vehicleType){
        throw new error('all fields are required')
    }

    const captian= await captianModel.create({
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
    return captian;
}



