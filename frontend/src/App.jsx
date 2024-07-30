import './App.css'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Navbar from './components/navbar/Navbar'; // Importing the Navbar component
import Profile from './components/profile/Profile'; // Importing the Profile component
import Upcoming from './components/upcoming/Upcoming';
import Home from './components/home/Home';

function App() {


  return (
    <Router> {/* The Router component enables routing in our app */}
      <div className="app">
        <div className="content">
          <Routes> {/* The Routes component contains all the Route definitions */}
            <Route path="/" element={<Home />} /> {/* Route for the Home component at the root path */}
            <Route path="/profile" element={<Profile />} /> {/* Route for the Profile component at the /profile path */}
            <Route path="/upcoming" element={<Upcoming />} /> {/* Route for the Upcoming component */}
          </Routes>
        </div>
        <div className="nav-bottom">
          <Navbar /> {/* Render the Navbar component at the bottom of every page */}
        </div>
      </div>
    </Router>
  )
}

export default App
