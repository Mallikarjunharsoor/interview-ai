const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const authRout = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'https://interview-ai-three-tau.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRout);
app.use('/api/interview', interviewRouter);

module.exports = app;