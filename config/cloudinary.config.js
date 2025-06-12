import cloudinary from "cloudinary"


const connectCloudinary = ()=>{
    cloudinary.v2.config({
    cloud_name:process.env.COULDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRETE,
})
}


export default connectCloudinary;