import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required: true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[3,'User must be at least 3 characters long']
    },
    email: {
        type:String,
        required: true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength:[13,'Email must be at least 13 characters long']
    },
    phone:{
        type: String,
        required: true
    },
    password: {
        type:String,
        required: true,
        trim:true,
        minlength:[5,'Password must be at least 5 characters long'],
        select: false
    },
    aboutMe: {
        type:String,
        required:[true,"About Me Field  Required!"]
    },
    avatar: {
        public_id: {
            type:String,
            required:true,
        },
        url: {
            type: String,
            required: true
        }
    },
    resume: {
        public_id: {
            type:String,
            required:true,
        },
        url: {
            type: String,
            required: true
        }
    },
    githubUrl: String,
    instagramUrl: String,
    facebookUrl: String,
    linkedInUrl: String,
    portfolioUrl: String,
    resetPasswordToken:String,
    resetPasswordExpire: Date, 
})

// FOR HASHING password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})
// FOR COMPARING PASSWORD 
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password)
}
// GENERATING JSONWEBTOKEN
userSchema.methods.generateJsonWEbToken =  function (){
return jwt.sign(
        { _id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES }
    );
}

userSchema.methods.getResetPasswordToken = function (){
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    return resetToken;
}


export const User = mongoose.model('user',userSchema);

