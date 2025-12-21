import jwt from "jsonwebtoken";


export const generateTokenAndSetCookie = ( res, userID)=>{
    const token = jwt.sign(
        {userID},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )    

    res.cookie('token',token ,{
        httpOnly: true,
        secure:process.env.NODE_ENV === 'production',
        same:'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, //7days ;maxAge is the time that the cookie will be stored in the browser

        
    
    });

    return token;


}






