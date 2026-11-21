const mongoose = require('mongoose');

const tokenBlackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting"]
    }},
{timestamp: true});

const tokenBlackListModel = mongoose.model('TokenBlackList', tokenBlackListSchema);

module.exports=tokenBlackListModel;