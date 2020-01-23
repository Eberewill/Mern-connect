const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    //get token from the header of the request
    const token = req.header('x-auth-token');

    //check if not oken
if(!token){
    return res.status(401).json({ msg : "No Token, Authorization denied"})
}

    //verify the token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user;
        next()
    
} catch (error) {
    res.status(401).json({msg: 'Token is not Valid'})
    
}
}