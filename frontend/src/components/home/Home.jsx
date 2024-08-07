import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ExploreBottomSheet from "../explore/ExploreBottomSheet"; // Adjust path if needed
import EventCreate from "../eventcreate/EventCreate";
import MapComponent from '../map/Map'; // Ensure this path is correct
import spurcreate from "../../assets/SpurCreate.png";
import './home.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);
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

  const toggleExplore = () => {
    setIsExploreOpen(!isExploreOpen);
  };

  return (
    <div className="home-container">
      <MapComponent className="map-container" />
      <div className="searchbar-content">
        <div className="searchbar">
          <input
            type="text"
            className="search-bar"
            placeholder="Find an Event!"
            onClick={toggleExplore}
          />
          <button className="create-event-button" onClick={openCreateEvent}>
            <img src={spurcreate} alt="Create Event" />
          </button>
        </div>
      </div>
      <ExploreBottomSheet isOpen={isExploreOpen} toggleExplore={toggleExplore} />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <EventCreate closeModal={closeCreateEvent} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
