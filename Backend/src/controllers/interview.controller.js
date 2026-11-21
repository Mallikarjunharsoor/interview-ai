const interviewReportModel = require('../models/interviewReport.model');
const pdfParse = require('pdf-parse');

const {
    generateInterviewReport,
    generateResumePdf
} = require('../services/ai.service');



const generateInterviewReportController = async (req, res) => {

    let resumeText = "";

    if (req.file) {

        const resumeContent = await (
            new pdfParse.PDFParse(
                Uint8Array.from(req.file.buffer)
            )
        ).getText();

        resumeText = resumeContent.text;

    }

    const { selfDescription, jobDescription } = req.body;

    const interviewReportByAi = await generateInterviewReport({

        selfDescription,

        resume: resumeText,

        jobDescription

    });

    const interviewReport = await interviewReportModel.create({

        user: req.user.id,

        resume: resumeText,

        selfdescription: selfDescription,

        jobdescription: jobDescription,

        ...interviewReportByAi

    });

    return res.status(201).json({

        message: "Interview report generated successfully",

        interviewReport

    });

};



const getInterviewReportIdController = async (req, res) => {

    const { interviewId } = req.params;

    const interviewReport = await interviewReportModel.findOne({

        _id: interviewId,

        user: req.user.id

    });

    if (!interviewReport) {

        return res.status(404).json({

            message: "Report not found"

        });

    }

    return res.status(200).json({

        message: "Interview report fetched successfully",

        interviewReport

    });

};



const getAllReportsController = async (req, res) => {

    const allReports = await interviewReportModel.find({

        user: req.user.id

    })
    .sort({ createdAt: -1 })
    .select(
        "-resume -selfdescription -jobdescription -__v -technicalQuestions -behavioralQuestions -skillGap -preperationPlan -matchingPercentage"
    );

    return res.status(200).json({

        message: "Reports fetched successfully",

        allReports

    });

};



const generateResumePdfController = async (req, res) => {

    try {

        const { interviewId } = req.params;

        // Find report belonging to the logged-in user

        const interviewReport = await interviewReportModel.findOne({

            _id: interviewId,

            user: req.user.id

        });

        if (!interviewReport) {

            return res.status(404).json({

                message: "Interview report not found"

            });

        }

        // Extract candidate information

        const {
            selfdescription,
            resume,
            jobdescription
        } = interviewReport;



        const pdfBuffer = await generateResumePdf({

            selfDescription: selfdescription,

            resume: resume,

            jobDescription: jobdescription

        });


        // Send PDF to frontend

        res.set({

            "Content-Type": "application/pdf",

            "Content-Disposition": `attachment; filename=resume_${interviewId}.pdf`,

            "Content-Length": pdfBuffer.length

        });

        return res.send(pdfBuffer);

    } catch (error) {

        console.error("Resume PDF Controller Error:", error);

        return res.status(500).json({

            message: "Failed to generate resume PDF",

            error: error.message

        });

    }

};



module.exports = {

    generateInterviewReportController,

    getInterviewReportIdController,

    getAllReportsController,

    generateResumePdfController

};