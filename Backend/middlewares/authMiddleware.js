require("dotenv").config(); 
const jwt=require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

async function authMiddleware(req,res,next){
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(403).json({
            message:"Invalid Token"
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            message:"Token Expired or Invalid"
        })
    }
}
module.exports=authMiddleware;