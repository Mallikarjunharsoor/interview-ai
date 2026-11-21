const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

const authRout = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');

app.set('trust proxy', 1);

// Allowed frontend origins
const allowedOrigins = [
    'http://localhost:5173',
    'https://interview-ai-three-tau.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

// Allow Vercel preview deployments
const vercelPreviewPattern =
    /^https:\/\/interview-[a-z0-9-]+-mallikarjunharsoors-projects\.vercel\.app$/;

// CORS configuration
app.use(cors({
    origin: function (origin, callback) {

        // Allow requests without an origin
        if (!origin) {
            return callback(null, true);
        }

        // Check allowed origins
        if (
            allowedOrigins.includes(origin) ||
            vercelPreviewPattern.test(origin)
        ) {
            return callback(null, true);
        }

        console.log('Blocked CORS origin:', origin);
        return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
        'GET',
        'POST',
        'PUT',
        'PATCH',
        'DELETE',
        'OPTIONS'
    ],

    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// API routes
app.use('/api/auth', authRout);
app.use('/api/interview', interviewRouter);

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Interview AI Backend is running!'
    });
});

module.exports = app;