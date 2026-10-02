const jwt = require("jsonwebtoken");

const authMiddleware = async(req,res,next)=>{
    const authHeader = req.headers.authorization;
    try {

        if(!authHeader){
            return res.status(401).json({
                success:false,
                message:"Access denied. No token provided."
            })
        }
        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token,process.env.JWT_KEY);
        req.userId=decode.userId;
        next();
        
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports= authMiddleware;