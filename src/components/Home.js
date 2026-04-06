import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [token, setToken] = useState(null);
  const [searchUsername, setSearchUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('token');
    setToken(stored);
  }, []);

  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.reload();
  };

  const searchUser = (e) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      navigate(`/user/profile/${searchUsername.trim()}`);
    }
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{flex:'1 !important'}} className="hero-content">
          <h1 className="hero-title">Welcome to Knowledge Hub</h1>
          <p className="hero-subtitle">
            A modern Q&A platform where knowledge meets curiosity. Ask questions, share answers, and connect with a community of learners.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/questions')} className="btn-primary">
              <i class="fa-brands fa-safari"></i> Browse Questions
            </button>
            {token ? (
              <button onClick={() => navigate('/post-question')} className="btn-secondary">
                <i class="fa-solid fa-question"></i> Ask a Question
              </button>
            ) : (
              <button onClick={() => navigate('/register')} className="btn-secondary">
                <i class="fa-solid fa-user-plus"></i> Join Now
              </button>
            )}
          </div>
        </div>
        <div style={{flex:1}} className="hero-image">
          <div style={{paddingRight:'40px'}} className="hero-placeholder">
            {/* <span>💡</span>
            <p>Knowledge Hub</p> */}
            <img style={{maxWidth:'100%'}} src={require('../logos/kHubLogo.png')} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 style={{color:"wheat"}}>Why Choose Knowledge Hub?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">❓</div>
            <h3>Ask Anything</h3>
            <p>Post your questions and get answers from experts and enthusiasts in various fields.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Share Knowledge</h3>
            <p>Contribute by answering questions and help build a community of informed individuals.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Find Users</h3>
            <p>Search for users and explore their profiles to connect with like-minded people.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your data is safe with our secure authentication and privacy-focused design.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2 style={{color:"wheat"}}>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Sign Up</h3>
            <p>Create your account to start asking and answering questions.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Ask Questions</h3>
            <p>Post clear, detailed questions about topics you're curious about.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Get Answers</h3>
            <p>Receive thoughtful answers from the community.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Contribute Back</h3>
            <p>Answer questions from others and share your expertise.</p>
          </div>
        </div>
      </section>

      {/* User Actions */}
      {token && (
        <section className="user-actions">
          <h2 style={{color:"wheat"}}>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <h3>Find a User</h3>
              <form onSubmit={searchUser} className="search-form">
                <input
                  type="text"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
                <button type="submit"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
              </form>
            </div>
            <div className="action-card">
              <h3>Your Token</h3>
              <p className="token-display">
                <code>{token}</code>
              </p>
              <button onClick={clearToken} className="btn-danger">
                <i class="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2026 Knowledge Hub. Built with Passion and curiosity</p>
      </footer>
    </div>
  );
}
