const express = require('express');
const router = express.Router();
const auth = require('../../middleweare/auth')
const {check, validationResult} = require("express-validator");
const Profile = require('../../models/Profile')
const User = require('../../models/User')
// @route GET api/profile/me
// @desc  Getcurrent users profile
// @access private
router.get('/me',auth, async (req, res)=> {

    try {

        const profile = await Profile.findOne({ user: req.user.id}).populate(
            'user', ['name', 'avatar']
        );

        if(!profile){
           return res.status(500).json({msg: "there is no profile for this user"})
        }
        res.json(profile)
        
    } catch (err) {
        console.error(err.message)
    }

});

// @route Post api/profile
// @desc  Crete Uer Profile
// @access private
router.post('/',[ auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skill is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    //destructure the request body params
    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //build profile body
    const profileFields = {};
    profileFields.user = req.user.id;
    if(company) profileFields.company = company;
    if (website) profileFields.website = website;
    if(location) profileFields.location= location;
    if (bio) profileFields.bio = bio;
    if(status)profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())

    }

    //build social object

    profileFields.social = {};

    if(youtube) profileFields.social.youtube = youtube;
    if(facebook) profileFields.social.youtube = youtube;
    if(twitter) profileFields.social.twitter = twitter;
    if(instagram) profileFields,social.instagram = instagram;
    if(linkedin) profileFields.social.linkedin = linkedin;

    try {
        let profile = await Profile.findOne({user: req.user.id})
        if (profile){
            //update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id}, //find varible
                { $set : profileFields }, //updte with profileFields object.
                {new: true});
                
           return res.json(profile)
        }
        //create profile
        profile = new Profile(profileFields)
        await profile.save()

        res.json(profile)
              
        
    } catch (err) {
        console.error(err.message)
        res.status(400).send('server Errror')
    }
    






})
// @route GET api/profile
// @desc  Get all Profile
// @access Public

router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user',['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message)
        res.status(500).send("server Error")
        
    }

})


// @route GET api/profile/user/:user_id
// @desc  Get User by ID
// @access Public

router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user : req.params.user_id}).populate('user',['name', 'avatar']);
       if(!profile) return res.status(400).json({msg: "Profile not found"})
        res.json(profile);
    } catch (err) {
        console.error(err.message) 

        if (err.kind == 'ObjectId'){
           return res.status(400).json({msg: "Profile not found"})
        }
        res.status(500).send("server Error")
        
    }

}) 

// @route DELETE api/profile
// @desc  deleeProfile, User & Posts
// @access Private

router.delete('/', auth, async (req, res) => {
    //@todos - remove users posts
    try {
        //remove profile
        await Profile.findOneAndRemove({ user : req.user.id});
        
        //remove User
        await User.findOneAndRemove({ _id : req.user.id})

        res.json({msg: "User Deleted"})
    } catch (err) {
        console.error(err.message) 
        res.status(500).send("server Error l")
        
    }

}) 


module.exports = router; 