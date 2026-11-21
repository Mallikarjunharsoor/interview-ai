const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

const authRout = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.set('trust proxy', 1);

const allowedOrigins = [
    'http://localhost:5173',
    'https://interview-ai-three-tau.vercel.app',
    'https://interview-ai-git-main-mallikarjunharsoors-projects.vercel.app'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error(`CORS blocked origin: ${origin}`));
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