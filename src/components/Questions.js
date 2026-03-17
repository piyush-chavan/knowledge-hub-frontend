import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch('https://knowledge-hub-backend-8ela.onrender.com/question/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="questions-container">
      <div className="questions-header">
        <h2>All Questions</h2>
        {token && (
          <Link to="/post-question" className="post-question-btn">
            Post a Question
          </Link>
        )}
      </div>
      {loading && <p className="loading">Loading questions...</p>}
      {error && <p className="error">Error: {error}</p>}
      {questions.length > 0 ? (
        <div className="questions-grid">
          {questions.map((question) => (
            <Link key={question._id} to={`/question/${question._id}`} className="question-link">
              <div className="question-item">
                <div className="question-content">
                  <h3 className="question-title">{question.title}</h3>
                  <p className="question-body">{question.body}</p>
                </div>
                <div className="question-footer">
                  <div className="question-user">
                    <span className="user-avatar">{question.user ? question.user.username.charAt(0).toUpperCase() : '?'}</span>
                    <span>{question.user ? question.user.username : 'Unknown'}</span>
                  </div>
                  <div className="question-date">
                    {new Date(question.postedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        !loading && <p className="no-questions">No questions found. Be the first to ask!</p>
      )}
    </div>
  );
}