// Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import spurcreate from "../../assets/SpurCreate.png";
import Explore from "../explore/Explore";
import EventCreate from "../eventcreate/EventCreate";
import "./home.css";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openCreateEvent = () => {
    const token = sessionStorage.getItem('user');
    if (!token) {
      alert('Create an account or login to host an event!');
      navigate('/authentication');
    } else {
      setIsModalOpen(true);
    }
  };

  const closeCreateEvent = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className='searchbar-content'>
        <div className="searchbar">
          <input
            type="text"
            className="search-bar"
            placeholder="Find an Event!"
          />
          <button className="create-event-button" onClick={openCreateEvent}>
            <img src={spurcreate} alt="Create Event" />
          </button>
        </div>
      </div>
      <div className="explore-overflow">
        <Explore />
      </div>
      {isModalOpen && <EventCreate closeModal={closeCreateEvent} />}
    </div>
  );
};

export default Home;
