import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Profile from './components/profile/Profile';
import Upcoming from './components/upcoming/Upcoming';
import EventDetails from './components/explore/EventDetails';
import Home from './components/home/Home';
import EventCreate from './components/eventcreate/EventCreate'; // Import the modal

function App() {
  return (
    <Router>
      <div className="app">
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/upcoming" element={<Upcoming />} />
            <Route path="/create-event" element={<EventCreate />} /> {/* Add the route for the modal */}
          </Routes>
        </div>
        <div className="nav-bottom">
          <Navbar />
        </div>
      </div>
    </Router>
  );
}

export default App;
