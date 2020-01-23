const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')
const {check, validationResult} = require("express-validator");

const auth = require('../../middleweare/auth')
const User = require('../../models/User')

// @route GET api/auth
//@desc  Test Routes
// @access public
router.get('/', auth, async (req, res)=> {
    try {
        const user = await User.findById(req.user.id).select('-password'); 
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('server Error');
        
    }

});

// @route Post api/auth
// @desc   authenticate user and get Token
// @access public
router.post('/', [
    //validaion using expres-validator
  
    check('email', 'please include a valid email address').isEmail(),
    check('password', "Password is required!").exists()
],
 async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

        //destructure the req.body object
        const { email, password } = req.body;
        try {
            
            //see is the user email exist
            let user = await User.findOne({email})
            if (!user){
               return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch){
                return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
            }

                  
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