import mongoose from "mongoose";

export const connectDB = async()=>{
    try{
       await mongoose.connect(process.env.MONGO_URI);
       console.log("✅ Datbase Connected Successfully");

    }
    catch(err){
        console.log("❌ Database ERROR !"  , err.message);
        process.exit(1);  
    }
}