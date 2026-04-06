import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import About from './components/About';
import Register from './components/Register';
import Profile from './components/Profile';
import UserProfile from './components/UserProfile';
import Questions from './components/Questions';
import PostQuestion from './components/PostQuestion';
import QuestionDetail from './components/QuestionDetail';
import UsersList from './components/UsersList';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
    <HashRouter>
      <Navbar />
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/user/profile" element={<Profile />} />
          <Route path="/user/profile/:username" element={<UserProfile />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/post-question" element={<PostQuestion />} />
          <Route path="/question/:id" element={<QuestionDetail />} />
          <Route path="/users" element={<UsersList/>} />
        </Routes>
      </main>
    </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
