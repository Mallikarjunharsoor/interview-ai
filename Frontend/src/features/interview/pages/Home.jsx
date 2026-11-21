import '../styles/home.style.scss';

import { useInterview } from '../hooks/useInterview';

import {
  useState,
  useRef,
  useEffect
} from 'react';

import { useNavigate } from 'react-router';

import { useAuth } from '../../auth/hooks/useAuth.js';


const BriefcaseIcon = () => (

  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M9 5V3h6v2h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4Zm2 0h2V4h-2v1ZM5 9v10h14V9H5Zm0-2v1h14V7H5Z" />
  </svg>

);


const ProfileIcon = () => (

  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
  </svg>

);


const UploadIcon = () => (

  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="M19.35 10.04A7.49 7.49 0 0 0 5 8a6 6 0 0 0 1 12h13a5 5 0 0 0 .35-9.96ZM13 16h-2v-4H8l4-4 4 4h-3v4Z" />
  </svg>

);


const SparkleIcon = () => (

  <svg aria-hidden="true" viewBox="0 0 24 24">
    <path d="m12 2 1.65 6.35L20 10l-6.35 1.65L12 18l-1.65-6.35L4 10l6.35-1.65L12 2Zm7 12 .9 3.1L23 18l-3.1.9L19 22l-.9-3.1L15 18l3.1-.9L19 14ZM5 14l.65 2.35L8 17l-2.35.65L5 20l-.65-2.35L2 17l2.35-.65L5 14Z" />
  </svg>

);


const Home = () => {

  const {
    loading: interviewLoading,
    generateReport,
    reports,
    getAllReports
  } = useInterview();


  const {
    user,
    loading: authLoading,
    handleLogout
  } = useAuth();


  const [selfDescription, setSelfDescription] = useState("");

  const [jobDescription, setJobDescription] = useState("");

  const resumeInputRef = useRef();

  const navigate = useNavigate();


  // FETCH REPORTS ONLY AFTER AUTHENTICATION IS COMPLETE

  useEffect(() => {

    if (authLoading) {
      return;
    }

    if (!user?.id) {
      return;
    }

    getAllReports().catch(error => {
      console.error("Failed to fetch user reports:", error);
    });

  }, [
    user?.id,
    authLoading,
    getAllReports
  ]);


  // GENERATE REPORT

  const handleGenerateReport = async () => {

    try {

      const resume = resumeInputRef.current?.files?.[0];

      if (!jobDescription.trim()) {
        alert("Please enter a job description.");
        return;
      }

      if (!resume && !selfDescription.trim()) {
        alert("Please upload a resume or enter your self-description.");
        return;
      }

      const data = await generateReport({

        selfDescription,
        resume,
        jobDescription

      });

      if (data && data._id) {

        navigate(`/interview/${data._id}`);

      }

    } catch (error) {

      console.error("Report Generation Error:", error);

      alert(
        error.response?.data?.message ||
        error.message ||
        "Failed to generate interview report."
      );

    }

  };


  // AUTHENTICATION LOADING

  if (authLoading) {

    return (

      <main className="loading-screen">
        <h1>Checking your account...</h1>
      </main>

    );

  }


  // USER NOT AUTHENTICATED

  if (!user) {

    return null;

  }


  // INTERVIEW DATA LOADING

  if (interviewLoading) {

    return (

      <main className="loading-screen">
        <h1>Loading your interview plans...</h1>
      </main>

    );

  }


  return (

    <main className="home">

      <div className="home-actions">

        <button
          className="logout-button"
          onClick={handleLogout}
          type="button"
        >

          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M10 17v-2h4V9h-4V7l-5 5 5 5Zm9-14H5a2 2 0 0 0-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z" />
          </svg>

          Log out

        </button>

      </div>


      <header className="home-header">

        <h1>
          Create Your Custom <span>Interview Plan</span>
        </h1>

        <p>
          Let our AI analyze the job requirements and your unique profile to build a
          <br className="desktop-break" /> winning strategy.
        </p>

      </header>


      <section
        className="interview-card"
        aria-label="Interview plan details"
      >

        <div className="interview-input-group">


          {/* JOB DESCRIPTION */}

          <section
            className="job-section"
            aria-labelledby="job-title"
          >

            <div className="section-heading">

              <h2 id="job-title">
                <BriefcaseIcon />
                Target Job Description
              </h2>

              <span className="required-badge">
                Required
              </span>

            </div>


            <label
              className="visually-hidden"
              htmlFor="jobDescription"
            >
              Target job description
            </label>


            <textarea
              onChange={(e) => setJobDescription(e.target.value)}
              value={jobDescription}
              id="jobDescription"
              name="jobDescription"
              maxLength={5000}
              placeholder={"Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"}
            />

          </section>



          {/* PROFILE */}

          <section
            className="profile-section"
            aria-labelledby="profile-title"
          >

            <div className="section-heading profile-heading">

              <h2 id="profile-title">
                <ProfileIcon />
                Your Profile
              </h2>

            </div>


            <div className="upload-group">

              <p className="field-label">
                Upload Resume <span>(Best Results)</span>
              </p>


              <input
                ref={resumeInputRef}
                className="visually-hidden"
                id="resume"
                name="resume"
                type="file"
                accept=".pdf,.doc,.docx"
              />


              <label
                className="upload-zone"
                htmlFor="resume"
              >

                <span className="upload-icon">
                  <UploadIcon />
                </span>

                <strong>
                  Click to upload or drag &amp; drop
                </strong>

                <span className="upload-hint">
                  PDF or DOC (Max 5MB)
                </span>

              </label>

            </div>


            <div className="or-divider">
              <span>OR</span>
            </div>


            <div className="description-group">

              <label
                className="field-label"
                htmlFor="selfDescription"
              >
                Quick Self-Description
              </label>


              <textarea
                onChange={(e) => setSelfDescription(e.target.value)}
                value={selfDescription}
                id="selfDescription"
                name="selfDescription"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />

            </div>


            <p className="info-note">

              <span aria-hidden="true">i</span>

              <span>
                Either a <strong>Resume</strong> or a <strong>Self Description</strong> is
                required to generate a personalized plan.
              </span>

            </p>

          </section>

        </div>



        {/* FOOTER */}

        <footer className="card-footer">

          <p>
            AI-Powered Strategy Generation <span aria-hidden="true">•</span> Approx 120sec
          </p>


          <button
            onClick={handleGenerateReport}
            className="generate-button"
            type="button"
            disabled={interviewLoading}
          >

            <SparkleIcon />

            {interviewLoading
              ? "Generating..."
              : "Generate My Interview Strategy"
            }

          </button>

        </footer>

      </section>



      {/* PREVIOUS REPORTS */}

      <section
        className="reports-section"
        aria-labelledby="reports-title"
      >

        <div className="reports-heading">

          <div>

            <p className="reports-eyebrow">
              YOUR PREVIOUS PLANS
            </p>

            <h2 id="reports-title">
              Interview reports
            </h2>

          </div>


          <span className="reports-count">
            {reports.length}
          </span>

        </div>



        {reports.length > 0 ? (

          <ul className="reports-list">

            {reports.map((item) => (

              <li key={item._id}>

                <button
                  className="report-link"
                  type="button"
                  onClick={() => navigate(`/interview/${item._id}`)}
                >

                  <span>
                    {item.title || 'Interview strategy'}
                  </span>

                  <span
                    className="report-link-arrow"
                    aria-hidden="true"
                  >
                    →
                  </span>

                </button>

              </li>

            ))}

          </ul>

        ) : (

          <p className="reports-empty">
            Your generated interview reports will appear here.
          </p>

        )}

      </section>

    </main>

  );

};


export default Home;