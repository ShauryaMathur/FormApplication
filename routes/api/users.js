const express=require('express');
const bcrypt=require('bcryptjs');
const config=require('config');
const jwt=require('jsonwebtoken');
const router=express.Router();

//User Model
const User=require('../../models/User');

// @route GET api/users
// @desc  Register New User
// @acess Public
router.post('/',(req,res)=>{

   const {name,email,password,department}=req.body;  //Destructuring

   if(!name || !email ||!password || !department){
       return res.status(400).json({msg:'Please enter all fields'});
   }

   //Check for existing user
   User.findOne({email})
        .then(user=>{
            if(user){
                return res.status(400).json({msg:'User Already exists'});
            }
            const newUser=new User({
                name,email,password,department
            });

            //Create salt and hash
            bcrypt.genSalt(10,(err,salt)=>{
                bcrypt.hash(newUser.password,salt,(err,hash)=>{
                    if(err) throw err;
                    newUser.password=hash;
                    newUser.save()
                            .then(user=>{

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
                                                department:user.department
                                            }
                                        });

                                    }
                                )

                                
                            });
                });
            })
        });
});




module.exports=router;