import mongoose from "mongoose";

const VerificationSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },

},{timestamps:true});

const Verification = mongoose.model("Verification", VerificationSchema);
export default Verification;