import { Link, useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { Tooltip } from 'react-tooltip';
import { useQuery } from '@tanstack/react-query';

export default function Questions() {
  const token = localStorage.getItem('token');

  const navigate = useNavigate();

  const fetchQuestions = async () => {
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
      return data;
    } catch (err) {
      throw new Error({ err })
    }
  };
  const {
    data: data = [],
    isLoading: loading,
    error: error
  } = useQuery({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  return (
    <div className="questions-container">
      <div className='post-question-icon' data-tooltip-id='post-question-icon' data-tooltip-content='Post new Question' onClick={() => navigate('/post-question')}  ><i class="fa-solid fa-pen-to-square fa-beat"></i></div>
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
      {error && <p className="error">Error: {error.message}</p>}

      <div className="questions-grid">
        {data.questions?.map((question) => (
          <div className="question-item">
            <Link key={question._id} to={`/question/${question._id}`} className="question-link">
              <div className="question-content">
                <div>
                  <h3 className="question-title">{question.title}</h3>
                  <p className="question-body">{question.body}</p>
                </div>
                <span className="question-arrow">→</span>
              </div>
            </Link>
            <div className="question-footer">
              <div data-tooltip-id='user-profile' data-tooltip-content='See profile' style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/profile/${question.user?.username}`)}
                className="question-user">
                <span className="user-avatar">
                  {question.user && question.user.profilePic ?
                    <img className='profile-pic-circle' src={question.user.profilePic} /> : (question.user ? question.user.username.charAt(0).toUpperCase() : '?')}
                </span>
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
      {data?.questions?.length == 0 && !loading && (
        <p className="no-questions">No questions found. Be the first to ask!</p>
      )}
    </div>
  );
}