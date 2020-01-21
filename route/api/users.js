const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const gravatar = require('gravatar')
const jwt = require('jsonwebtoken')
const config = require('config')

const {check, validationResult} = require("express-validator");


//import User Model
const User = require('../../models/User')

// @route Post api/user
// @desc   user-reg Rout
// @access public
router.post('/', [
    //validaion using expres-validator
    check('name', 'Name is required')
    .not()
    .isEmpty(),
    check('email', 'please include a valid email address').isEmail(),
    check('password', "please enter a password of not less than 6 character ").isLength({min: 6})
],
 async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

        //destructure the req.body object
        const { name, email, password } = req.body;
        try {
            
            //see is the user email exist
            let user = await User.findOne({email})
            if (user){
               return res.status(400).json({errors: [{msg: 'User already exist'}]})
            }
            //Get users gravatr
            const avatar = gravatar.url(email,{
                s: '200',
                r:'pg',
                d: 'mm'
            })

            //istance of user
            user = new User({
                name,
                email,
                avatar,
                password
            });
            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)

            await user.save();
            

            //Return jsonwebtoken
            const payload = {
                user: {
                     id: user.id
                }
            }

            jwt.sign(payload, 
                config.get('jwtSecret'),
                { expiresIn: 3600000}, 
                (err, token) => {
                    if (err) throw err;
                    res.json({token})

                })
   

        }catch(err){
            console.error(err.message);
            res.status(500).send('server error')
        }
    }
   );
  
   
module.exports = router;