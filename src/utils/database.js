import mongoose from "mongoose"


const connectDB = async (url)=>{
    await mongoose.connect(url)
}
export {connectDB}