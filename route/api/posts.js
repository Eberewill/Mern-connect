const express = require('express');
const auth = require('../../middleweare/auth')
const {check, validationResult} = require("express-validator");
const router = express.Router();
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const  Post = require('../../models/Post')

// @route POST api/posts
//@desc  Create a pos
// @access Private
router.post('/',[auth, [

    check('text', "Text is required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
    }

    //get current user
    const user = await  User.findById(req.user.id).select('-password')

    //creating the post
    const newPost = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    //add post
    try {
        const post = await new Post(newPost)

       await post.save()
       res.json(post)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error')
    }
});

 
// @route GET api/posts
//@desc  Get all posts
// @access Private

router.get('/',auth, async (req, res)=>{
    try {
        //get posts and return in ascending order ( most recent in date)
    const posts = await Post.find().sort({date : -1})

    res.json(posts)

    } catch (err) {
        console.error(err.message)
        res.status(400).send('server erro')
    }
    
})

// @route GET api/posts/:id
//@desc  Get posts by ID
// @access Private

router.get('/:id',auth, async (req, res)=>{
    try {
        //get posts 
    const post = await Post.findById(req.params.id)
    if(!post) {
        return res.status(404).json({msg: "Post not found "})}

    res.json(post)
 
    } catch (err) {
        console.error(err.message)

        if(err.kind == "ObjectId"){
            return res.status(404).json({msg: "Post not found"})
        }
        res.status(400).send('server erro')
    }
    
})

// @route DELETE api/posts/:id
//@desc  Get posts by ID and delete
// @access Private

router.delete('/:id',auth, async (req, res)=>{
    try {
        //get posts and return in ascending order ( most recent in date)
    const post = await Post.findById(req.params.id)

    //if post exist
    if(!post){
        return res.status(404).json({msg: "Post not found"})
    }

    //check the user
    if(post.user.toString() !== req.user.id){
        res.status(401).json({msg: "User not authorized"})
    }
    //remove post
    await post.remove();

     res.json({msg: "post deleted"})

    } catch (err) {
        console.error(err.message)
        if(err.kind === "ObjectId"){
            return res.status(404).json({msg: "Post not found"})
        }
        res.status(400).send('server error')
    }
    
})

// @route Put api/posts/like/:id
//@desc  Like A post
// @access Private

router.put('/like/:id',auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

            //check if the post has been liked by the user
            //post.likes.filter(likes => likes.user.toString()=== req.user.id).length > 0
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: "post already Liked"});}

            //alse add like into the post.like array (starting point)
            post.likes.unshift({user: req.user.id})
///add and save like into post
            await post.save();
            res.json(post.likes)
            
    
    } catch (err) {
        console.error(err.message)
        res.status(400).send('server error')

    }

})

// @route Put api/posts/Unlike/:id
//@desc  unLike A post
// @access Private

router.put('/unlike/:id',auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

            //check if the post has been liked by the user
           
        if(post.likes.filter(like => like.user.toString() === req.user.id).length == 0){
            return res.status(400).json({msg: "post has not yet been Liked"});}

            //get the index frm the post.like array

            const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)

                post.likes.splice(removeIndex, 1)
           
            ///add and save like into post
                await post.save();
                res.json(post.likes)
    
    } catch (err) {
        console.error(err.message)
        res.status(400).send('server error')

    }

})

// @route POST api/posts/comment/:id
//@desc  Comment on  post
// @access Private
router.post('/comment/:id',[auth, [

    check('text', "Text is required").notEmpty()
]], async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
    }
try {
    //get current user
    const user = await  User.findById(req.user.id).select('-password')
    const post = await Post.findById(req.params.id);

    //creating the post
    const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
    }

    //add post
    post.comments.unshift(newComment)
       
       await post.save()
       res.json(post.comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('server Error')
    }
});

// @route Delete api/posts/comment/:id/:comment_id
//@desc  Delete post Comment by id
// @access Private

router.delete('/comment/:id/:comment_id',auth, async (req, res)=>{
try {
    const post = await Post.findById(req.params.id);

    //pull out the comment from post

    const comment = post.comments.find(comment => comment.id === req.params.comment_id)
 
    //make sure the coment actuall exist

    if(!comment){
        return res.status(401).json({msg: "user not authorised"})
    }

    //check user

    if(comment.user.toString() !== req.user.id){
        return res.status(400).json({msg: "comment not found"})
      
        }
    //get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

    post.comments.splice(removeIndex , 1)

    await post.save()
    res.json(post.comments)




} catch (err) {
    console.error(err.message)
        res.status(500).send('server Error')
}

})


module.exports = router;