const { Router } = require('express');
const authRout = Router();
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
authRout.post("/register", authController.registerController);
authRout.post("/login", authController.loginController);
authRout.get("/logout", authController.logoutController);
authRout.get("/getme", authMiddleware.authUser, authController.getmeController);
module.exports = authRout;