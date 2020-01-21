const express = require('express');
const router = express.Router();

// @route GET api/posts
//@desc  Test Routes
// @access public
router.get('/', (req, res)=> res.send('Pots route'));


module.exports = router;