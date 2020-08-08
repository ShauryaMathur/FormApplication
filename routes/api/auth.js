const express=require('express');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const auth=require('../../Middleware/auth');
const router=express.Router();

//Item Model
const User=require('../../models/User');

// @route GET api/auth
// @desc  Authenticate the User
// @acess Public
router.post('/',(req,res)=>{

   const {email,password}=req.body;  //Destructuring

   if(!email ||!password){
       return res.status(400).json({msg:'Please enter all fields'});
   }

   //Check for existing user
   User.findOne({email})
        .then(user=>{
            if(!user){
                return res.status(400).json({msg:'User does not exists'});
            }
           
            //Validate Password
            bcrypt.compare(password,user.password)  //Compares String to hashed Pwd form DB
                    .then(isMatch=>{
                        if(!isMatch) return res.status(400).json({msg:'Invalid Credentials'});

                        jwt.sign(
                            {id:user.id},
                            config.get('jwtSecret'),
                            {expiresIn:3600},
                            (err,token)=>{
                                if(err) throw err;

                                res.json({
                                    token,
                                    user:{
                                        id:user.id,
                                        name:user.name,
                                        email:user.email,
                                        department : user.department

                                    }
                                });

                            }
                        )
                    })
            
        });
});

// @route GET api/auth/user
// @desc  Get the User data
// @acess Private

router.get('/user',auth,(req,res)=>{
    User.findById(req.user.id)
        .select('-password')
        .then(user=>res.json(user));
});


module.exports=router;