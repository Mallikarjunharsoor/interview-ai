const jwt = require('jsonwebtoken');

const tokenBlackListModel = require('../models/tokenBlacklist.model');


async function authUser(req, res, next) {

    try {

        const token = req.cookies?.token;

        if (!token) {

            return res.status(401).json({
                message: "Authentication required"
            });

        }


        const blacklistedToken = await tokenBlackListModel.findOne({
            token
        });

        if (blacklistedToken) {

            return res.status(401).json({
                message: "Session expired. Please login again."
            });

        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.id) {

            return res.status(401).json({
                message: "Invalid authentication token"
            });

        }


        req.user = decoded;

        next();

    } catch (error) {

        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            message: "Unauthorized. Please login again."
        });

    }

}


module.exports = {
    authUser
};