import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Profile from './components/profile/Profile';
import Upcoming from './components/upcoming/Upcoming';
import EventDetails from './components/explore/EventDetails';
import Home from './components/home/Home';
import EventCreate from './components/eventcreate/EventCreate'; 
import Authentication from './components/authentication/Authentication'

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/create-event" element={<EventCreate />} />
            <Route path="/authentication" element={<Authentication />} />
            <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to home for undefined routes */}
          </Routes>
        </div>
        <div className="nav-bottom">
          <Navbar />
        </div>
      </div>
    </Router>
  );
}

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = !!sessionStorage.getItem("user");
  return isAuthenticated ? element : <Navigate to="/authentication" />;
};

export default App;
