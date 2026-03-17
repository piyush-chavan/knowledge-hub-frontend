import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerBody, setAnswerBody] = useState('');
  const [posting, setPosting] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  const fetchQuestion = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`https://knowledge-hub-backend-8ela.onrender.com/question/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setQuestion(data.question);
      setAnswers(data.answers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (event) => {
    event.preventDefault();
    if (!token) return;

    setPosting(true);
    try {
      const response = await fetch(`https://knowledge-hub-backend-8ela.onrender.com/answer/post/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ body: answerBody }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const newAnswer = await response.json();
      // Refetch to get updated answers with user data
      await fetchQuestion();
      setAnswerBody('');
      setShowAnswerForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="question-detail-container">
      <Link to="/questions" className="post-question-btn">
        ← Back to Questions
      </Link>
      {loading && <p className="loading">Loading question...</p>}
      {error && <p className="error">Error: {error}</p>}
      {question && (
        <div className="question-detail">
          <div className="question-main">
            <h1 className="question-title">{question.title}</h1>
            <p className="question-body">{question.body}</p>
            <div className="question-meta">
              <div className="question-user">
                <span className="user-avatar">{question.user && question.user.username ? question.user.username.charAt(0).toUpperCase() : '?'}</span>
                <span>{question.user && question.user.username ? question.user.username : 'Unknown'}</span>
              </div>
              <div className="question-date">
                Asked on {new Date(question.postedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="answers-section">
            <h2>Answers ({answers.length})</h2>
            {answers.length > 0 ? (
              answers.map((answer) => (
                <div key={answer._id} className="answer-item">
                  <div className="answer-content">
                    <p>{answer.body}</p>
                  </div>
                  <div className="answer-meta">
                    <div className="answer-user">
                      <span className="user-avatar">{answer.user && answer.user.username ? answer.user.username.charAt(0).toUpperCase() : '?'}</span>
                      <span>{answer.user && answer.user.username ? answer.user.username : 'Unknown'}</span>
                    </div>
                    <div className="answer-date">
                      {new Date(answer.postedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-answers">No answers yet. Be the first to answer!</p>
            )}

            {token ? (
              <div className="post-answer-section">
                <button
                  onClick={() => setShowAnswerForm(!showAnswerForm)}
                  className="toggle-answer-btn"
                >
                  {showAnswerForm ? 'Cancel' : 'Post an Answer'}
                </button>
                {showAnswerForm && (
                  <form onSubmit={submitAnswer} className="answer-form">
                    <textarea
                      value={answerBody}
                      onChange={(e) => setAnswerBody(e.target.value)}
                      placeholder="Write your answer here..."
                      required
                      rows={6}
                      maxLength={2000}
                    />
                    <button type="submit" disabled={posting}>
                      {posting ? 'Posting...' : 'Submit Answer'}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <p className="login-prompt">Please log in to post an answer.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}