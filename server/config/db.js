import mongoose from "mongoose";

const connectDB=async()=>{
    try{
        mongoose.connection.on("connected",()=>{
            console.log("mongodb connected")})
        let mongodbURI=process.env.MONGODB_URI;
        const projectName='Honeyterra';
        if(!mongodbURI){
            throw new Error(`MongoDB URI not found for project ${projectName}`);
        }    
        if(mongodbURI.endsWith('/')){
            mongodbURI=mongodbURI.slice(0,-1);
        }
        await mongoose.connect(`${mongodbURI}/${projectName}`)
        
    }
    catch(error){
        console.error("Error connecting to MongoDB:", error);
    }
}
export default connectDB;