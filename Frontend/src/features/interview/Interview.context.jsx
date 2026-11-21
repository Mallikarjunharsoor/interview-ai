import {
  createContext,
  useState,
  useContext,
  useLayoutEffect,
  useRef
} from "react";

import { AuthContext } from "../auth/auth.context";

export const InterviewContext = createContext();

export const InterviewProvider = ({ children }) => {

  const { user } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [reports, setReports] = useState([]);

  const userId = user?.id || null;

  // Keep track of the currently authenticated user.
  const userIdRef = useRef(userId);

  userIdRef.current = userId;

  // Clear previous user's interview data whenever
  // the authenticated user changes.
  useLayoutEffect(() => {

    setReports([]);
    setReport(null);

  }, [userId]);

  return (
    <InterviewContext.Provider
      value={{
        loading,
        setLoading,

        report,
        setReport,

        reports,
        setReports,

        userId,
        userIdRef
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};