import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdOutlinePinDrop, MdCalendarMonth, MdPerson } from 'react-icons/md';
import './navbar.css';

const Navbar = () => {
  return (
    <div className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <i className="icon">
          <MdOutlinePinDrop />
        </i>
        <span className="nav-text">Home</span>
      </NavLink>
      <NavLink to="/upcoming" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <i className="icon">
          <MdCalendarMonth />
        </i>
        <span className="nav-text">Upcoming</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
        <i className="icon">
          <MdPerson />
        </i>
        <span className="nav-text">Profile</span>
      </NavLink>
    </div>
  )
}

export default Navbar;
