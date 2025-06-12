export const generateJsonWEbToken = (user,message,statusCode,res)=>{
    const token = user.generateJsonWEbToken();

    res.statusCode(statusCode).cookie("token",token ,{
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000 ),
        httpOnly: true
    }).json({
        success: true,
        message,
        token,
        user
    })
}