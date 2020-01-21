const express = require('express');
const router = express.Router();
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


module.exports = router;