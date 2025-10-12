import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },

    email : {
        type : String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true
    },

    password : {
        type : String,
        required : true,
    },

    role : {
        type : String,
        enum : ['admin' , 'manager' , 'employee'],
        default : 'employee'
    },

    dob : {
        type : Date,
        required : true
    },

    address : {
        type : String,
        default : "NA"
    },

    location : {
        type :String,
        default : "NA"
    },

    isDeleted : {
        type : Boolean,
        default : false
    },
    deletedBy : {
        type : String
    },
    deletedAt : {
        type : Date
    }

},{timestamps:true})


userSchema.pre("save" , async function(next){
     if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password , salt);
    next();
})


userSchema.methods.generateJWT = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};



export const User = mongoose.model("User" , userSchema);