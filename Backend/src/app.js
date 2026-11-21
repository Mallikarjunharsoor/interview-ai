const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const authRout = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRout);
app.use("/api/interview", interviewRouter);
module.exports = app;