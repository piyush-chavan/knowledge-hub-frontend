import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function PostQuestion() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  if (!token) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Post a Question</h2>
          <p className="notice">You must be logged in to post a question.</p>
          <button onClick={() => navigate('/login')}>Go to Login</button>
        </div>
      </div>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/question/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          body,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      await response.json();
      // Assuming success, navigate to questions
      navigate('/questions');
      toast.success('Question posted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to post question. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{padding:0}}>
      <div className="card post-question-card">
        <h2>Post a New Question</h2>
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="question-title">Title</label>
            <input
              id="question-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your question?"
              required
              style={{boxSizing:'border-box'}}
              maxLength={200}
            />
          </div>

          <div className="form-group">
            <label htmlFor="question-body">Description</label>
            <textarea
              id="question-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Provide more details..."
              required
              rows={6}
              maxLength={2000}
              style={{boxSizing:'border-box'}}
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Question'}
          </button>

          {error && <p className="error">Error: {error}</p>}
        </form>
      </div>
    </div>
  );
}