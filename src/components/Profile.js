import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HashLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { Tooltip } from 'react-tooltip';
import ProfilePicUpload from './ProfilePicUpload';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [picUpload,setPicUpload] = useState(false);
  const [profileTab, setProfileTab] = useState('bookmarks');
  const token = localStorage.getItem('token');
  const fetchedRef = useRef(false);

  const navigate = useNavigate();
  useEffect(()=>{
    if(!picUpload){
      fetchProfile();
    }
  },[picUpload]);
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const response = await fetch(`${backendUrl}/user/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setProfile(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!token || fetchedRef.current) return;
    fetchedRef.current = true;
    fetchProfile();
  }, [token]);

  // update container code here all functions and states
  const [showEdit, setShowEdit] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.userDetails.name || "",
    username: profile?.userDetails.username || "",
    email: profile?.userDetails.email || "",
    education: profile?.userDetails.education || "",
    bio: profile?.userDetails.bio || "",
  });

  useEffect(() => {
    setFormData({
      name: profile?.userDetails.name || "",
      username: profile?.userDetails.username || "",
      email: profile?.userDetails.email || "",
      education: profile?.userDetails.education || "",
      bio: profile?.userDetails.bio || "",
    });
  }, [profile])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const confirmUpdate = window.confirm("Are you sure you want to update profile?");
    if (!confirmUpdate) return;

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3030';
      const res = await fetch(`${backendUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      toast.success("Profile updated successfully");
      setShowEdit(false);
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  if (!token) {
    return (
      <div className="page-container">
        <div className="card">
          <h2>Profile</h2>
          <p className="notice">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {picUpload&&(<ProfilePicUpload close={setPicUpload} />)}
      <div className="card" style={{paddingTop:'10px'}}>
        <h2 style={{margin:'5px auto'}}>Your Profile</h2>
        {loading &&
          <div className="loading">
            <HashLoader color="#007bff" />
          </div>}
        {/* {loading && <p className="loading">Loading...</p>} */}

        {error && <p className="error">Error: {error}</p>}
        {profile && (
          <div className="profile-data">
            {/* <pre>{JSON.stringify(profile, null, 2)}</pre> */}


            {showEdit && (
              <div className="profile-edit-container">
                <div className="edit-form">
                  <h3>Edit Profile</h3>
                  <i data-tooltip-id='close-edit-box' data-tooltip-content='Close' style={{ cursor: 'pointer', position: 'absolute', top: '10px', right: '10px' }} onClick={() => setShowEdit(false)} class="fa-solid fa-circle-xmark"></i>
                  <Tooltip className='custom-tooltip' id='close-edit-box' />

                  <div className="floating-group">
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      className="floating-input"
                    />
                    <label className="floating-label">Name</label>
                  </div>

                  <div className="floating-group">
                    <input
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Username"
                      className="floating-input"
                    />
                    <label className="floating-label">Username</label>
                  </div>

                  <div className="floating-group">
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="floating-input"
                    />
                    <label className="floating-label">Email</label>
                  </div>

                  <div className="floating-group">
                    <input
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Education"
                      className="floating-input"
                    />
                    <label className="floating-label">Education</label>
                  </div>
                  <div className="floating-group">
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Bio"
                      className="floating-input"
                    />
                    <label className="floating-label">Bio</label>
                  </div>

                  <button className="save-btn" onClick={handleUpdate}>
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            <div className="profile-container">

              <div className="profile-card">
                <span className="edit-btn" onClick={() => setShowEdit(!showEdit)}>
                  {showEdit ? <></> : <>
                  <i data-tooltip-id='edit-profile' data-tooltip-content='Edit profile' class="fa-solid fa-pen-to-square"></i>
                  <Tooltip className='custom-tooltip' id='edit-profile' />
                  </>}
                </span>
                <span data-tooltip-id='profile-pic-tip' data-tooltip-content='Edit/Upload Profile Pic' style={{cursor:'pointer'}} onClick={()=>setPicUpload(true)} className="profile-avatar">{profile.userDetails.profilePic?
                <img className='profile-pic-circle' src={profile.userDetails.profilePic}/> : profile.userDetails.name.charAt(0).toUpperCase()}</span>
                <Tooltip className='custom-tooltip' id='profile-pic-tip' />
                <h2 className="profile-name">{profile.userDetails.name}</h2>
                <p className="profile-username">@{profile.userDetails.username}</p>

                <p className="profile-bio">{profile.userDetails.bio}</p>

                <div className="profile-info">
                  <p>📧Email :  {profile.userDetails.email}</p>
                  <p>🎓Education: {profile.userDetails.education}</p>
                  <p>📅 Joined: {new Date(profile.userDetails.joinedOn).toDateString()}</p>
                </div>

                {/* Stats */}
                <div className="profile-stats">
                  <div className="stat-box">
                    <h3>{profile.questionsAsked.length}</h3>
                    <p>Questions Asked</p>
                  </div>

                  <div className="stat-box">
                    <h3>{profile.answersGiven.length}</h3>
                    <p>Answers Given</p>
                  </div>

                  <div className="stat-box">
                    <h3>{profile.questionsAsked.length + profile.answersGiven.length}</h3>
                    <p>Total</p>
                  </div>
                </div>
              </div>
            </div>

            <div style={{flex:3,minWidth: 'min(600px,100%)'}}>
              {/* tabs navigation */}
              <div className="profile-tabs">
                <button
                  className={`tab-btn ${profileTab === "questions" ? "active" : ""}`}
                  onClick={() => setProfileTab("questions")}
                >
                  Questions
                </button>

                <button
                  className={`tab-btn ${profileTab === "answers" ? "active" : ""}`}
                  onClick={() => setProfileTab("answers")}
                >
                  Answers
                </button>

                <button
                  className={`tab-btn ${profileTab === "bookmarks" ? "active" : ""}`}
                  onClick={() => setProfileTab("bookmarks")}
                >
                  Bookmarks
                </button>
              </div>

              {profileTab === 'bookmarks' &&
                (<div className="bookmark-container">
                  <h3 className="bookmark-heading">Bookmarked Questions  <i class="fa-solid fa-bookmark"></i></h3>

                  {profile.userDetails.bookmarks.length === 0 && (
                    <p className="bookmark-empty">No bookmarks yet</p>
                  )}

                  {profile.userDetails.bookmarks.map((q) => (
                    <div className="bookmark-card" key={q._id}>
                      <h4 className="bookmark-title">{q.title}</h4>

                      <p className="bookmark-body">
                        {q.body?.slice(0, 120)}...
                      </p>

                      <button
                        className="bookmark-btn"
                        onClick={() => navigate(`/question/${q._id}`)}
                      >
                        View Question →
                      </button>
                    </div>
                  ))}
                </div>)}

              {profileTab != 'bookmarks' && (
                <div className="qa-container">

                  {/* Questions */}
                  {profileTab === 'questions' &&
                    (<div className="qa-section">
                      <h3 className="qa-heading">Questions Asked</h3>

                      {profile.questionsAsked.length === 0 && (
                        <p className="qa-empty">No questions yet</p>
                      )}

                      {profile.questionsAsked.map((q) => (
                        <div className="qa-card" key={q._id}>
                          <h4 className="qa-title">{q.title}</h4>

                          <button
                            className="qa-btn"
                            onClick={() => navigate(`/question/${q._id}`)}
                          >
                            View Question →
                          </button>
                        </div>
                      ))}
                    </div>)}

                  {/* Answers */}
                  {profileTab === 'answers' &&
                    (<div className="qa-section">
                      <h3 className="qa-heading">Answers Given</h3>

                      {profile.answersGiven.map((a) => (
                        <div className="qa-card" key={a._id}>
                          <h4 className="qa-title">{a.question.title}</h4>

                          <p className="qa-answer">
                            {a.body.slice(0, 120)}...
                          </p>

                          <button
                            className="qa-btn"
                            onClick={() => navigate(`/question/${a.question._id}`)}
                          >
                            View Question →
                          </button>
                        </div>
                      ))}
                    </div>)}

                </div>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}