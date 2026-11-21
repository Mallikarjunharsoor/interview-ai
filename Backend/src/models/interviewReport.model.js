const mongoose = require("mongoose");



// PREPARATION PLAN SCHEMA


const preparationPlanSchema = new mongoose.Schema({

    day: {
        type: Number,
        required: [true, "Day is required"]
    },

    focus: {
        type: String,
        required: [true, "Focus is required"]
    },

    tasks: [{
        type: String,
        required: true
    }]

}, {
    _id: false
});



// SKILL GAP SCHEMA


const skillGapSchema = new mongoose.Schema({

    skill: {
        type: String,
        required: [true, "Skill is required"]
    },

    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: [true, "Severity is required"]
    }

}, {
    _id: false
});



// TECHNICAL QUESTION SCHEMA


const technicalQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, {
    _id: false
});



// BEHAVIORAL QUESTION SCHEMA


const behavioralQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, "Question is required"]
    },

    intention: {
        type: String,
        required: [true, "Intention is required"]
    },

    answer: {
        type: String,
        required: [true, "Answer is required"]
    }

}, {
    _id: false
});



// MAIN INTERVIEW REPORT SCHEMA


const interviewReportSchema = new mongoose.Schema({

    jobdescription: {
        type: String,
        required: [true, "Job description is required"]
    },

    resume: {
        type: String
    },

    selfdescription: {
        type: String
    },

    matchingPercentage: {
        type: Number,
        min: 0,
        max: 100
    },

    technicalQuestions: {
        type: [technicalQuestionSchema],
        default: []
    },

    behavioralQuestions: {
        type: [behavioralQuestionSchema],
        default: []
    },

    skillGap: {
        type: [skillGapSchema],
        default: []
    },

    preperationPlan: {
        type: [preparationPlanSchema],
        default: []
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    title: {
        type: String
    }

}, {
    timestamps: true
});



// EXPORT MODEL


const interviewReportModel = mongoose.model(
    "interviewReport",
    interviewReportSchema
);

module.exports = interviewReportModel;