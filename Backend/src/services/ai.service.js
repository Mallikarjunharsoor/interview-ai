const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const MODEL_NAME = "gemini-3.8-flash";



const interviewReportSchema = z.object({

    matchingPercentage: z.number().min(0).max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        })
    ),

    skillGap: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum(["low", "medium", "high"])
        })
    ),

    preperationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(z.string())
        })
    ),

    title: z.string()

});



const responseSchema = {

    type: "object",

    properties: {

        matchingPercentage: {
            type: "number"
        },

        technicalQuestions: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        behavioralQuestions: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    question: { type: "string" },
                    intention: { type: "string" },
                    answer: { type: "string" }
                },

                required: [
                    "question",
                    "intention",
                    "answer"
                ]
            }
        },

        skillGap: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    skill: {
                        type: "string"
                    },

                    severity: {
                        type: "string",
                        enum: ["low", "medium", "high"]
                    }
                },

                required: [
                    "skill",
                    "severity"
                ]
            }
        },

        preperationPlan: {
            type: "array",

            items: {
                type: "object",

                properties: {
                    day: {
                        type: "number"
                    },

                    focus: {
                        type: "string"
                    },

                    tasks: {
                        type: "array",
                        items: {
                            type: "string"
                        }
                    }
                },

                required: [
                    "day",
                    "focus",
                    "tasks"
                ]
            }
        },

        title: {
            type: "string"
        }

    },

    required: [
        "matchingPercentage",
        "technicalQuestions",
        "behavioralQuestions",
        "skillGap",
        "preperationPlan",
        "title"
    ]

};



const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};



const generateWithRetry = async (request, retries = 3) => {

    for (let attempt = 1; attempt <= retries; attempt++) {

        try {

            console.log(`Gemini API attempt: ${attempt}`);

            const response = await ai.models.generateContent(request);

            return response;

        } catch (error) {

            console.error(
                "Gemini API Error:",
                error.status,
                error.message
            );

            const retryableErrors = [429, 500, 502, 503, 504];

            if (
                retryableErrors.includes(error.status) &&
                attempt < retries
            ) {

                const waitTime = attempt * 2000 + Math.random() * 1000;

                console.log(
                    `Retrying Gemini in ${Math.round(waitTime / 1000)} seconds`
                );

                await delay(waitTime);

            } else {

                throw error;

            }

        }

    }

};



const generateInterviewReport = async ({
    selfDescription,
    resume,
    jobDescription
}) => {

    if (!jobDescription || !jobDescription.trim()) {
        throw new Error("Job description is required");
    }

    const prompt = `
You are an expert technical interviewer and career preparation advisor.

Analyze the following candidate information and generate a detailed interview preparation report.

CANDIDATE DESCRIPTION:
${selfDescription || "Not provided"}

CANDIDATE RESUME:
${resume || "Not provided"}

JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:

1. MATCHING PERCENTAGE:
Calculate how well the candidate's skills, experience and qualifications match the job description.
Return a realistic score between 0 and 100.
Do not give an unnecessarily high score.

2. TECHNICAL QUESTIONS:
Generate relevant technical interview questions based on the job requirements and candidate's experience.
Include the intention behind each question and a detailed answer explaining how to approach it.

3. BEHAVIORAL QUESTIONS:
Generate realistic HR and behavioral interview questions.
Provide the interviewer's intention and guidance for answering each question.

4. SKILL GAPS:
Identify skills required by the job description that are missing or insufficiently demonstrated in the candidate's profile.
Classify their severity as low, medium or high.
Do not assume that a skill is missing simply because it is not explicitly mentioned.

5. PREPARATION PLAN:
Create a practical 7-day preparation plan.
Each day must contain a specific focus and actionable tasks.
Prioritize the most important skills required by the job.

6. TITLE:
Generate a suitable job title based on the job description.

IMPORTANT:
- Personalize the report using the candidate's actual information.
- Do not invent qualifications, projects or work experience.
- Keep answers educational and useful for interview preparation.
- Return all required fields in the requested JSON structure.
`;

    try {

        const response = await generateWithRetry({

            model: 'gemini-3.5-flash-lite',

            contents: prompt,

            config: {
                responseMimeType: "application/json",
                responseJsonSchema: responseSchema,
                temperature: 0.4,
                maxOutputTokens: 8192
            }

        });

        if (!response.text) {
            throw new Error("Gemini returned an empty response");
        }

        const report = JSON.parse(response.text);

        const validatedReport = interviewReportSchema.parse(report);

        return validatedReport;

    } catch (error) {

        console.error("Interview Report Generation Failed:", error);

        throw error;

    }

};



const generatePdfFromHtml = async (htmlContent) => {

    let browser;

    try {

        browser = await puppeteer.launch({

            headless: true,

            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]

        });

        const page = await browser.newPage();

        await page.setContent(htmlContent, {

            waitUntil: "networkidle0",

            timeout: 30000

        });

        const pdfBuffer = await page.pdf({

            format: "A4",

            printBackground: true,

            preferCSSPageSize: true,

            margin: {
                top: "15mm",
                bottom: "15mm",
                left: "12mm",
                right: "12mm"
            }

        });

        return Buffer.from(pdfBuffer);

    } finally {

        if (browser) {
            await browser.close();
        }

    }

};



const resumePdfSchema = z.object({

    html: z.string().min(1)

});



const resumeResponseSchema = {

    type: "object",

    properties: {

        html: {

            type: "string",

            description: "Complete HTML document for a professional, ATS-friendly resume."

        }

    },

    required: ["html"]

};



const generateResumePdf = async ({
    selfDescription,
    resume,
    jobDescription
}) => {

    if (!jobDescription || !jobDescription.trim()) {
        throw new Error("Job description is required");
    }

    const prompt = `
You are an expert professional resume writer and ATS optimization specialist.

Generate a professional, ATS-friendly resume using the candidate information below.

CANDIDATE RESUME:
${resume || "Not provided"}

CANDIDATE DESCRIPTION:
${selfDescription || "Not provided"}

TARGET JOB DESCRIPTION:
${jobDescription}

INSTRUCTIONS:

1. Create a professional, clean and readable resume.
2. Tailor the resume to the target job description.
3. Highlight relevant skills and experience.
4. Use appropriate professional headings.
5. Use simple HTML and inline CSS.
6. Make the layout suitable for A4 PDF printing.
7. Use professional typography and subtle colors.
8. Avoid unnecessary graphics, tables and complex layouts that can affect ATS parsing.
9. Never invent experience, qualifications, projects or achievements.
10. Preserve the candidate's actual information.
11. Return a complete HTML document with proper html, head and body tags.
12. Do not include JavaScript.
13. Use semantic HTML elements wherever possible.
14. The resume should be ATS friendly and should passes ATS test.
15. The pdf should not be lengthy, not more than 2 pages, focus on quality rather than quantity.

Return a JSON object containing exactly one field:

{
    "html": "Complete HTML document"
}
`;

    try {

        const response = await generateWithRetry({

            model: 'gemini-3.5-flash-lite',

            contents: prompt,

            config: {

                responseMimeType: "application/json",

                responseJsonSchema: resumeResponseSchema,

                temperature: 0.4,

                maxOutputTokens: 8192

            }

        });

        if (!response.text) {
            throw new Error("Gemini returned an empty resume response");
        }

        // Parse Gemini response

        const report = JSON.parse(response.text);

        // Validate generated HTML

        const validatedReport = resumePdfSchema.parse(report);

        // Generate PDF

        const pdfBuffer = await generatePdfFromHtml(
            validatedReport.html
        );

        return pdfBuffer;

    } catch (error) {

        console.error("PDF Generation Failed:", error);

        throw error;

    }

};



module.exports = {

    generateInterviewReport,

    generateResumePdf

};