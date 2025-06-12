import app from "./app.js"
import connectCloudinary from "./config/cloudinary.config.js"

connectCloudinary();

app.listen(process.env.PORT,()=>{
    console.log(`server listening at port ${3000}`)
})