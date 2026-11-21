const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username:{
        type: String,
        required:[true, "User name required for register"],
        unique:[true, "User name already exists"]
    },
    email:{
        type:String,
        required:[true, "email id required"],
        unique:[true, "email id already exists"]
    },
    password:{
        type:String,
        required:[true, "Password required"]
    }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;