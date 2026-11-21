const express = require('express');
const upload = require('../middlewares/file.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const interviewRouter = express.Router();
const interviewController = require('../controllers/interview.controller');

interviewRouter.post("/", authMiddleware.authUser,upload.single("resume"), interviewController.generateInterviewReportController);

interviewRouter.get("/report/:interviewId", authMiddleware.authUser, interviewController.getInterviewReportIdController);

interviewRouter.get("/", authMiddleware.authUser, interviewController.getAllReportsController);

interviewRouter.post("/resume/pdf/:interviewId", authMiddleware.authUser, interviewController.generateResumePdfController);
module.exports = interviewRouter;