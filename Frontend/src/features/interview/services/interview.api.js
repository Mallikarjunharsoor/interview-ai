import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const generateInterviewReport = async ({selfDescription, resume, jobDescription}) => {
    const formData = new FormData()
    formData.append("selfDescription" , selfDescription)
    if(resume) formData.append("resume", resume)
    formData.append("jobDescription", jobDescription)

    const response = await api.post("/api/interview", formData, {
        headers:{
            "Content-Type": "multipart/form-data"
        }
    })
    return response.data;
}

export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}
export const getAllInterviewReports = async () => {
    const response = await api.get(`api/interview/`)
    return response.data;
}

export const generateResumePdf = async ({interviewId}) => {
    const response = await api.post(`/api/interview/resume/pdf/${interviewId}`, null, {
        responseType: "blob"
    })
    return response.data;
}