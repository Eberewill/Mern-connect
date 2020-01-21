const mongoose = require('mongoose');

//let create User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        isrequired: true
    },

    email: {
        type: String,
        isrequired: true,
        unique: true
    },
    password : {
        type: String,
        isrequired: true
    },
    avatar : {
        type:String,
        isrequired: true
    },
    date : {
        type: Date,
        default: Date.now
    }

});
//cexport the user schema to model
module.exports = mongoose.model('user', UserSchema);