import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FadeLoader, HashLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';

export default function QuestionDetail() {
  const { id } = useParams();
  // const [question, setQuestion] = useState(null);
  // const [answers, setAnswers] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [answerBody, setAnswerBody] = useState('');
  const [posting, setPosting] = useState(false);
  // const [isBookmarked, setIsBookmarked] = useState(false);
  // const [bookmarkLoading, setBookmarkLoading] = useState(true);
  const token = localStorage.getItem('token');

  const navigate = useNavigate();


  const fetchQuestion = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/question/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // setQuestion(data.question);
      // setAnswers(data.answers || []);
      return data;
    } catch (err) {
      throw new Error(err)
    }
  };

 

  const checkBookmark = async () => {

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/question/${id}/checkBookmark`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`

        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // setIsBookmarked(data.isBookmarked);
      // setBookmarkLoading(false);
      return data;
    } catch (err) {
      // setError(err.message);
    }
  };
   const{
    data:{isBookmarked=false}={},
    isLoading:bookmarkLoading=true,
    refetch:refetchBookmark,
  }=useQuery({
    queryKey:["bookmark",id],
    queryFn:checkBookmark,
    staleTime:1000*60*10,
    refetchOnWindowFocus:false
  })
  const{
    data:{question=[],answers=[]}={},
    isLoading:loading,
    error
  }=useQuery({
    queryKey:["question",id],
    queryFn:fetchQuestion,
    staleTime:1000*60*10,
    refetchOnWindowFocus:false
  })

  const toggleBookmark = async () => {

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/question/${id}/toggleBookmark`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`

        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      refetchBookmark();
    } catch (err) {
      throw new Error(err)
    }
  };

  const submitAnswer = async (event) => {
    event.preventDefault();
    if (!token) return;

    setPosting(true);
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/answer/post/${id}`, {
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
      toast.success('Answer posted successfully!');
      setAnswerBody('');
      setShowAnswerForm(false);
    } catch (err) {
      // setError(err.message);
      toast.error('Failed to post answer. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="question-detail-container">
      <button onClick={() => navigate('/questions')}>
        ← Back to Questions
      </button>
      {loading &&
        <div className="loading">
          <HashLoader color="white" />
        </div>}
      {/* <p className="loading">Loading question...</p>} */}
      {error && <p className="error">Error: {error.message}</p>}
      {question && (
        <div className="question-detail">
          <div className="question-main">
            <h1 className="question-title">{question.title}</h1>
            <p className="question-body">{question.body}</p>
            {token && (<div className='options-icons-container'>
                  {bookmarkLoading && (<div style={{ transform: "scale(0.5)" }}><FadeLoader /></div>)}
                  {isBookmarked ?
                    <>
                      <i data-tooltip-id='remove-bookmark' data-tooltip-content='remove bookmark' onClick={() => toggleBookmark()} class="fa-solid fa-bookmark bookmark-icon"></i>
                      <Tooltip className='custom-tooltip' id='remove-bookmark' />
                    </>
                    : <i data-tooltip-id='save-bookmark' data-tooltip-content='save bookmark' onClick={() => toggleBookmark()} class="fa-regular fa-bookmark bookmark-icon"></i>}
                  <Tooltip className='custom-tooltip' id='save-bookmark' />
                </div>)}
            <div className="question-meta">
              <div className="question-user">
                <div data-tooltip-id='user-profile' data-tooltip-content='See Profile' style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate(`/user/profile/${question.user?.username}`)}>
                  <span className="user-avatar">
                    {question.user && question.user.profilePic ?
                      <img className='profile-pic-circle' src={question.user.profilePic} /> : (question.user ? question.user.username.charAt(0).toUpperCase() : '?')}                    </span>
                  <span>{question.user && question.user.username ? question.user.username : 'Unknown'}</span>
                </div>
                <Tooltip className='custom-tooltip' id='user-profile' />
                
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
            {token ? (
              <div className="post-answer-section">
                <button
                  onClick={() => setShowAnswerForm(!showAnswerForm)}
                  className="toggle-answer-btn"
                >
                  {showAnswerForm ? 'Cancel' : <><i class="fa-regular fa-pen-to-square"></i> Post an Answer</>}
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
            <h2>Answers ({answers.length})</h2>
            {answers.length > 0 ? (
              answers.map((answer) => (
                <div key={answer._id} className="answer-item">
                  <div className="answer-content">
                    <p>{answer.body}</p>
                  </div>
                  <div className="answer-meta">
                    <div data-tooltip-id='user-profile' data-tooltip-content='See Profile' style={{ cursor: 'pointer' }} onClick={() => navigate(`/user/profile/${answer.user?.username}`)}
                      className="question-user">
                      <span className="user-avatar">
                        {answer.user && answer.user.profilePic ?
                          <img className='profile-pic-circle' src={answer.user.profilePic} /> : (answer.user ? answer.user.username.charAt(0).toUpperCase() : '?')}
                      </span>
                      <span>{answer.user && answer.user.username ? answer.user.username : 'Unknown'}</span>
                    </div>
                    <div className="question-date">
                      posted on {new Date(answer.postedAt).toLocaleDateString('en-US', {
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


          </div>
        </div>
      )}
    </div>
  );
}