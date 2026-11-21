const userModel = require('../models/registerModel');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const tokenBlackListModel = require('../models/tokenBlacklist.model');


// COOKIE CONFIGURATION

const isProduction = process.env.NODE_ENV === 'production';

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
};

const { maxAge, ...clearCookieOptions } = cookieOptions;


// REGISTER

async function registerController(req, res) {

    try {

        const { username, email, password } = req.body;

        if (!username || !email || !password) {

            return res.status(400).json({
                message: "Invalid credentials"
            });

        }

        const userExists = await userModel.findOne({

            $or: [
                { username },
                { email }
            ]

        });

        if (userExists) {

            return res.status(409).json({
                message: "User already exists"
            });

        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({

            username,
            email,
            password: hashPassword

        });


        // Generate JWT

        const token = jwt.sign(

            {
                id: user._id,
                username: user.username
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // Set authentication cookie

        res.cookie("token", token, cookieOptions);


        return res.status(201).json({

            message: "Account created successfully",

            user: {

                id: user._id,
                username: user.username,
                email: user.email

            }

        });

    } catch (error) {

        console.error("Register Error:", error);

        return res.status(500).json({
            message: "Registration failed"
        });

    }

}


// LOGIN

async function loginController(req, res) {

    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {

            return res.status(404).json({
                message: "User not found. Please register."
            });

        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {

            return res.status(400).json({
                message: "Invalid password"
            });

        }


        const token = jwt.sign(

            {
                id: user._id,
                username: user.username
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        // Replace the existing user's cookie.

        res.cookie("token", token, cookieOptions);


        return res.status(200).json({

            message: "User logged in successfully",

            user: {

                id: user._id,
                username: user.username,
                email: user.email

            }

        });

    } catch (error) {

        console.error("Login Error:", error);

        return res.status(500).json({
            message: "Login failed"
        });

    }

}


// LOGOUT

async function logoutController(req, res) {

    try {

        const token = req.cookies?.token;

        if (token) {

            await tokenBlackListModel.create({
                token
            });

        }


        // Clear the same cookie that was created during login.

        res.clearCookie("token", clearCookieOptions);


        return res.status(200).json({

            message: "User logged out successfully"

        });

    } catch (error) {

        console.error("Logout Error:", error);

        return res.status(500).json({
            message: "Logout failed"
        });

    }

}


// GET CURRENT USER

async function getmeController(req, res) {

    try {

        const user = await userModel.findById(req.user.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        return res.status(200).json({

            message: "User fetched successfully",

            user: {

                id: user._id,
                username: user.username,
                email: user.email

            }

        });

    } catch (error) {

        console.error("Get User Error:", error);

        return res.status(500).json({
            message: "Failed to fetch user"
        });

    }

}


module.exports = {

    registerController,
    loginController,
    logoutController,
    getmeController

};