import '../styles/interview.style.scss'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { useInterview } from '../hooks/useInterview'

const QuestionList = ({ title, questions }) => {
  return (
    <section className="result-section">
      <div className="result-section-heading">
        <div>
          <p className="section-eyebrow">PRACTICE</p>
          <h2>{title}</h2>
        </div>

        <span className="item-count">{questions.length}</span>
      </div>

      {questions.length > 0 ? (
        <div className="question-list">
          {questions.map((item, index) => (
            <article className="question-card" key={index}>
              <div className="question-number">
                Question {String(index + 1).padStart(2, '0')}
              </div>

              <h3>{item.question}</h3>

              <div className="answer-block">
                <h4>What they are looking for</h4>
                <p>{item.intention}</p>
              </div>

              <div className="answer-block suggested-answer">
                <h4>Suggested approach</h4>
                <p>{item.answer}</p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No {title.toLowerCase()} are available yet.
        </p>
      )}
    </section>
  )
}


const Roadmap = ({ preparationPlan }) => {
  return (
    <section className="result-section roadmap-section">
      <div className="result-section-heading">
        <div>
          <p className="section-eyebrow">YOUR GAME PLAN</p>
          <h2>Preparation roadmap</h2>
        </div>

        <span className="item-count">
          {preparationPlan.length} days
        </span>
      </div>

      {preparationPlan.length > 0 ? (
        <div className="roadmap-list">
          {preparationPlan.map((plan, index) => (
            <article className="roadmap-card" key={index}>
              <div className="roadmap-day">
                DAY {plan.day ?? index + 1}
              </div>

              <div className="roadmap-details">
                <h3>{plan.focus}</h3>

                {Array.isArray(plan.tasks) && plan.tasks.length > 0 ? (
                  <ul>
                    {plan.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="empty-task">
                    No tasks added for this day.
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No preparation days are available yet.
        </p>
      )}
    </section>
  )
}


const Interview = () => {
  const { interviewId } = useParams()

  const {
    report,
    loading,
    getReport,
    getResumePdfHandle,
    pdfLoading
  } = useInterview()

  const [activeTab, setActiveTab] = useState('technical')
  const [pdfError, setPdfError] = useState('')

  useEffect(() => {
    if (interviewId) {
      getReport(interviewId).catch((error) => {
        console.error('Failed to load interview report:', error)
      })
    }
  }, [interviewId])

  const handleResumeDownload = async () => {
    if (!interviewId || pdfLoading) return

    try {
      setPdfError('')
      await getResumePdfHandle(interviewId)
    } catch (error) {
      console.error('Resume download failed:', error)

      setPdfError(
        error?.response?.data?.message ||
        error?.message ||
        'Unable to generate your resume. Please try again.'
      )
    }
  }

  const technicalQuestions = Array.isArray(report?.technicalQuestions)
    ? report.technicalQuestions
    : []

  const behavioralQuestions = Array.isArray(report?.behavioralQuestions)
    ? report.behavioralQuestions
    : []

  const skillGaps = Array.isArray(report?.skillGap)
    ? report.skillGap
    : []

  const preparationPlan = Array.isArray(report?.preperationPlan)
    ? report.preperationPlan
    : []

  const matchingPercentage =
    typeof report?.matchingPercentage === 'number'
      ? Math.min(100, Math.max(0, report.matchingPercentage))
      : null

  if (loading && !report) {
    return (
      <main className="interview-page">
        <div className="interview-workspace loading-workspace">
          <p className="empty-plan">
            Loading your interview strategy...
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="interview-page">

      <div className="interview-workspace">

        {/* LEFT SIDEBAR */}

        <aside className="interview-sidebar">

          <a className="workspace-brand" href="/">
            <span className="brand-mark">I</span>

            <span>
              Interview<span className="brand-accent">IQ</span>
            </span>
          </a>

          <nav className="workspace-nav">

            <button
              type="button"
              className={`workspace-nav-link ${
                activeTab === 'technical' ? 'is-active' : ''
              }`}
              onClick={() => setActiveTab('technical')}
            >
              <span className="nav-indicator" />

              Technical questions

              <span className="nav-count">
                {technicalQuestions.length}
              </span>
            </button>

            <button
              type="button"
              className={`workspace-nav-link ${
                activeTab === 'behavioral' ? 'is-active' : ''
              }`}
              onClick={() => setActiveTab('behavioral')}
            >
              <span className="nav-indicator" />

              Behavioral questions

              <span className="nav-count">
                {behavioralQuestions.length}
              </span>
            </button>

            <button
              type="button"
              className={`workspace-nav-link ${
                activeTab === 'roadmap' ? 'is-active' : ''
              }`}
              onClick={() => setActiveTab('roadmap')}
            >
              <span className="nav-indicator" />

              Roadmap

              <span className="nav-count">
                {preparationPlan.length}
              </span>
            </button>

          </nav>

          <div className="sidebar-score">

            <span className="score-label">
              PROFILE MATCH
            </span>

            <strong>
              {matchingPercentage === null
                ? '—'
                : `${matchingPercentage}%`}
            </strong>

            <progress
              max="100"
              value={matchingPercentage ?? 0}
            />

            <span className="score-caption">
              Role alignment
            </span>

          </div>

        </aside>


        {/* MAIN CONTENT */}

        <div className="interview-main">

          <header className="results-header">

            <div className="results-heading-content">

              <p className="section-eyebrow">
                YOUR PERSONALIZED PREPARATION
              </p>

              <h1>
                {report?.title || 'Interview strategy'}
              </h1>

              <p className="results-subtitle">
                Your questions and preparation roadmap, tailored to this role.
              </p>

            </div>


            <div className="results-header-actions">

              <div className="match-summary">
                <span>Profile match</span>

                <strong>
                  {matchingPercentage === null
                    ? '—'
                    : `${matchingPercentage}%`}
                </strong>
              </div>


              <button
                type="button"
                className="resume-download-btn"
                onClick={handleResumeDownload}
                disabled={!report || pdfLoading}
              >

                {pdfLoading ? (
                  <>
                    <span className="download-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>

                    Download Resume
                  </>
                )}

              </button>

            </div>

          </header>


          {pdfError && (
            <div className="pdf-error">
              {pdfError}
            </div>
          )}


          <div className="results-content">

            {!report && !loading && (
              <div className="empty-plan">
                Your interview plan will appear here once it has been generated.
              </div>
            )}

            {report && activeTab === 'technical' && (
              <QuestionList
                title="Technical questions"
                questions={technicalQuestions}
              />
            )}

            {report && activeTab === 'behavioral' && (
              <QuestionList
                title="Behavioral questions"
                questions={behavioralQuestions}
              />
            )}

            {report && activeTab === 'roadmap' && (
              <Roadmap
                preparationPlan={preparationPlan}
              />
            )}

          </div>

        </div>


        {/* RIGHT SIDEBAR */}

        <aside className="skill-sidebar">

          <div className="skill-heading">

            <div>
              <p className="section-eyebrow">
                FOCUS AREAS
              </p>

              <h2>Skill gaps</h2>
            </div>

            <span className="item-count">
              {skillGaps.length}
            </span>

          </div>


          {skillGaps.length > 0 ? (

            <ul className="skill-list">

              {skillGaps.map((gap, index) => {

                const severity = ['low', 'medium', 'high'].includes(
                  String(gap.severity).toLowerCase()
                )
                  ? String(gap.severity).toLowerCase()
                  : 'medium'

                return (
                  <li className="skill-item" key={index}>

                    <span className="skill-name">
                      {gap.skill}
                    </span>

                    <span className={`severity-badge severity-${severity}`}>
                      {severity}
                    </span>

                  </li>
                )
              })}

            </ul>

          ) : (

            <p className="empty-state skill-empty-state">
              No skill gaps to show yet.
            </p>

          )}


          <div className="skill-tip">
            <p>
              Use these focus areas to prioritize your preparation time.
            </p>
          </div>

        </aside>

      </div>

    </main>
  )
}

export default Interview