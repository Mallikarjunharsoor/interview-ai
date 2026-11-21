import {
  generateInterviewReport,
  getAllInterviewReports,
  getInterviewReportById,
  generateResumePdf
} from '../services/interview.api';

import {
  useCallback,
  useContext,
  useState
} from 'react';

import { InterviewContext } from '../Interview.context';


export const useInterview = () => {

  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error(
      'The useInterview must be used within InterviewProvider'
    );
  }

  const {
    loading,
    setLoading,
    report,
    setReport,
    reports,
    setReports,
    userId,
    userIdRef
  } = context;


  const [pdfLoading, setPdfLoading] = useState(false);


  // GENERATE INTERVIEW REPORT

  const generateReport = useCallback(async ({
    selfDescription,
    resume,
    jobDescription
  }) => {

    if (!userId) {
      throw new Error("Please login to generate an interview report.");
    }

    try {

      setLoading(true);

      const response = await generateInterviewReport({
        selfDescription,
        resume,
        jobDescription
      });

      // Prevent an old session's response from updating new user's state.
      if (userIdRef.current !== userId) {
        return null;
      }

      if (response?.interviewReport) {

        setReport(response.interviewReport);

        return response.interviewReport;

      }

      return null;

    } catch (err) {

      console.error('Generate Report Error:', err);

      throw err;

    } finally {

      setLoading(false);

    }

  }, [userId, userIdRef, setLoading, setReport]);


  // GET SINGLE INTERVIEW REPORT

  const getReport = useCallback(async (interviewId) => {

    if (!userId) {
      throw new Error("Please login to view this report.");
    }

    try {

      setLoading(true);

      // Clear previous report before fetching another.
      setReport(null);

      const response = await getInterviewReportById(interviewId);

      if (userIdRef.current !== userId) {
        return null;
      }

      if (response?.interviewReport) {

        setReport(response.interviewReport);

        return response.interviewReport;

      }

      return null;

    } catch (err) {

      if (userIdRef.current === userId) {
        setReport(null);
      }

      console.error('Get Report Error:', err);

      throw err;

    } finally {

      setLoading(false);

    }

  }, [userId, userIdRef, setLoading, setReport]);


  // GENERATE AND DOWNLOAD RESUME PDF

  const getResumePdfHandle = useCallback(async (interviewId) => {

    if (!interviewId) {
      throw new Error('Interview ID is missing');
    }

    try {

      setPdfLoading(true);

      const response = await generateResumePdf({
        interviewId
      });

      if (!response) {
        throw new Error('No PDF data received from server');
      }

      const pdfBlob = response instanceof Blob
        ? response
        : new Blob([response], {
            type: 'application/pdf'
          });

      const url = window.URL.createObjectURL(pdfBlob);

      const link = document.createElement('a');

      link.href = url;

      link.download = `resume_${interviewId}.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 1000);

      return true;

    } catch (err) {

      console.error('Resume PDF Generation Error:', err);

      throw err;

    } finally {

      setPdfLoading(false);

    }

  }, []);


  // GET ALL REPORTS FOR CURRENT USER

  const getAllReports = useCallback(async () => {

    if (!userId) {
      setReports([]);
      return [];
    }

    try {

      setLoading(true);

      const response = await getAllInterviewReports();

      // If user changed while the API request was running,
      // do not allow the previous user's response to update state.
      if (userIdRef.current !== userId) {
        return [];
      }

      if (response?.allReports) {

        setReports(response.allReports);

        return response.allReports;

      }

      setReports([]);

      return [];

    } catch (err) {

      if (userIdRef.current === userId) {
        setReports([]);
      }

      console.error('Get All Reports Error:', err);

      throw err;

    } finally {

      setLoading(false);

    }

  }, [userId, userIdRef, setLoading, setReports]);


  return {

    loading,
    pdfLoading,

    report,
    reports,

    generateReport,
    getReport,
    getAllReports,

    getResumePdfHandle

  };

};