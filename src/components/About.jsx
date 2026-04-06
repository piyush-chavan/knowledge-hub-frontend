import "./About.css";
import {useNavigate} from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  return (
    <div  className="about-container">
      <div className="about-card">

        <h1 className="about-title">Knowledge Hub (Mini Quora)</h1>
        <p className="about-subtitle">Ask. Answer. Learn.</p>

        <section className="about-section">
          <h2>About the Project</h2>
          <p>
            Knowlwdge Hub is a full-stack web application inspired by Quora,
            where users can ask questions, share knowledge, and interact
            with a community of curious people. It provides a platform for meaningful
            discussions and knowledge sharing.
          </p>
        </section>

        <section className="about-section">
          <h2>Features</h2>
          <ul>
            <li>Ask and answer questions and contribute</li>
            <li>User authentication (login/signup)</li>
            <li>View all questions and answers</li>
            <li>See Profiles of other users , interact and discuss with them</li>
            <li>Found something interesting ? You can bookmark it.</li>
            <li>Clean and responsive UI</li>
            <li>REST APIs with Express backend</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Tech Stack</h2>
          <ul>
            <li>Frontend: React.js</li>
            <li>Backend: Node.js + Express.js</li>
            <li>Database: MongoDB</li>
            <li>Authentication: JWT</li>
            <li>Optimisation: Caching, API calls optimised</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Developer</h2>
          <p>
            This project is developed by <strong style={{cursor:'pointer'}} onClick={()=>navigate('/user/profile/piyush')}>Piyush Chavan <i class="fa-solid fa-up-right-from-square"></i></strong>, 
            a passionate full-stack developer focused on building scalable 
            and modern web applications.
          </p>
        </section>

        <footer className="about-footer">
          <p>© {new Date().getFullYear()} Piyush Chavan. All rights reserved.</p>
        </footer>

      </div>
    </div>
  );
};

export default About;