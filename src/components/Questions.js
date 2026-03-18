import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';

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
      <div onClick={()=>navigate('/post-question')} style={{position:'fixed', right:'15%',bottom:'10%',zIndex:1000,cursor:'pointer',backgroundColor:'#3951d7',color:'white',fontSize:'1.25rem',boxShadow:'0 0 10px #50C878',fontWeight:'600',borderRadius:'50%',padding:'10px',width:'50px',height:'50px',display:'flex',alignItems:'center',justifyContent:'center'}} ><i class="fa-regular fa-pen-to-square"></i></div>
      <div className="questions-header">
        <h2 style={{color:'whitesmoke'}}>All Questions</h2>
        
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