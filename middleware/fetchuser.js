const jwt = require("jsonwebtoken");

const jwt_secret = "nevermessagain@#$";

const fetchuser =(req,res,next)=>{
//get user details from jwt token and add ID to req object
const token = req.header("auth-token")
if (!token) {
    res.status(401).json({error:"please authenticate using a valid token"})
}
try {
    const data = jwt.verify(token, jwt_secret)
    req.user = data;
        next();
    
} catch (error) {
    res.status(401).json({error:"please authenticate using a valid token"})

}
}

module.exports=fetchuser;