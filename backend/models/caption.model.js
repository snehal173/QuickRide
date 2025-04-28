const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const captainSchema=new Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'first name should have 3 characters']
        },
        lastname:{
            type:String,
            minlength:[3,'last name should have 3 characters']
        }
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        match: [ /^\S+@\S+\.\S+$/, 'Please enter a valid email' ]
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    socketId:{
        type:String
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    vehicle:{
        color:{
            type:String,
            required:true,
            minlength:[3,'color should have 3 characters']
        },
        plate:{
            type:String,
            required:true,
            unique:true,
            minlength:[3,'plate should have 3 characters']
        },
        capacity:{
            type:Number,
            required:true,
            min:[1,'capacity should be greater than 0']
        },
        vehicleType:{
            type:String,
            required:true,
            enum:['car','motorcycle','auto'],

        },
    },
    location:{
        ltd:{
            type:Number,
        },
        lng:{
            type:Number,
        }
    }

})
//creating the token for the user
captainSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.JWT_SECRET1,{expiresIn:'24h'});
    return token;
}
//comparing the normal password with the hashed password
captainSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}
//hashing the password before saveing it in the database
captainSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}

const captainModel=mongoose.model('captain',captainSchema);

module.exports=captainModel;