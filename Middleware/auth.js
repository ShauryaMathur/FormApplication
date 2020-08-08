const config=require('config');
const jwt=require('jsonwebtoken');

function auth(req,res,next){
    const token=req.header('x-auth-token');

    //Check for Token
    if(!token){
        return res.status(401).json({msg:'No token,authorization denied'});
    }

    try{

    //Verify Token .Returns the 
    const decoded=jwt.verify(token,config.get('jwtSecret'));
    //Add user from Payload

    req.user=decoded;
    next();

    }catch(e){

        res.status(400).json({msg:'Token isnt valid'});

    }

    
}

module.exports=auth;