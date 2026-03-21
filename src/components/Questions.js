import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { Tooltip } from 'react-tooltip';

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError('');
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
        const response = await fetch(`${backendUrl}/question/all`, {
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
      <div data-tooltip-id='post-question-icon' data-tooltip-content='Post new Question' onClick={() => navigate('/post-question')} style={{ position: 'fixed', right: '15%', bottom: '10%', zIndex: 1000, cursor: 'pointer', backgroundColor: '#3951d7', color: 'white', fontSize: '1.25rem', boxShadow: '0 0 10px #50C878', fontWeight: '600', borderRadius: '50%', padding: '10px', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} ><i class="fa-regular fa-pen-to-square"></i></div>
      <Tooltip className='custom-tooltip' id='post-question-icon' />
      <div className="questions-header">
        <h2 style={{ color: 'whitesmoke' }}>All Questions</h2>

        <Link to="/post-question" className="post-question-btn">
          {token ?
            <><i class="fa-regular fa-pen-to-square"></i> Post a Question </>
            :
            <><i class="fa-solid fa-lock"></i> Login to Post Question </>
          }
        </Link>

      </div>
      {loading && (
        <div className="loading">
          <HashLoader color="white" />
        </div>
      )}
      {error && <p className="error">Error: {error}</p>}
      {questions.length > 0 ? (
        <div className="questions-grid">
          {questions.map((question) => (
            <div className="question-item">
              <Link key={question._id} to={`/question/${question._id}`} className="question-link">
                <div className="question-content">
                  <h3 className="question-title">{question.title}</h3>
                  <p className="question-body">{question.body}</p>
                </div>
              </Link>
              <div className="question-footer">
                <div data-tooltip-id='user-profile' data-tooltip-content='See profile' style={{cursor:'pointer'}} onClick={() => navigate(`/user/profile/${question.user?.username}`)}
                  className="question-user">
                  <span className="user-avatar">{question.user ? question.user.username.charAt(0).toUpperCase() : '?'}</span>
                  <span>{question.user ? question.user.username : 'Unknown'}</span>
                </div>
                <Tooltip className='custom-tooltip' id='user-profile' />
                <div className="question-date">
                  {new Date(question.postedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p className="no-questions">No questions found. Be the first to ask!</p>
      )}
    </div>
  );
}