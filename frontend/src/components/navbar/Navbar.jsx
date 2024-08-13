import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MdOutlinePinDrop, MdChatBubble, MdCalendarMonth, MdPerson } from 'react-icons/md';
import spurcreate from "../../assets/SpurCreate.png";
import './navbar.css';

const Navbar = () => {
  const location = useLocation();

  // Function to check if the current path matches a pattern
  const isEventDetailPage = () => {
    return /^\/event\/[a-zA-Z0-9]+$/.test(location.pathname);
  };

  return (
    <div className="bottom-nav">
      <NavLink 
        to="/" 
        className={({ isActive }) => (isActive || isEventDetailPage()) ? "nav-item active" : "nav-item"}
      >
        <i className="icon">
          <MdOutlinePinDrop />
        </i>
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink 
        to="/upcoming" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <i className="icon">
          <MdCalendarMonth />
        </i>
        <span className="nav-text">Upcoming</span>
      </NavLink>
      {/* Spur button */}
      <div className="spur-create-container">
        <NavLink to="/create-event">
          <img className='spur-create' src={spurcreate} alt="Create Event"/>
        </NavLink>
      </div>
      <NavLink 
        to="/social" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <i className="icon">
          <MdChatBubble />
        </i>
        <span className="nav-text">Social</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
      >
        <i className="icon">
          <MdPerson />
        </i>
        <span className="nav-text">Profile</span>
      </NavLink>
    </div>
  );
}

export default Navbar;
