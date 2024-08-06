// EventDetails.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEvent, getUser } from '../../api';
import { FaGraduationCap, FaRunning, FaSlideshare, FaUsers, FaRegBookmark, FaArrowLeft } from 'react-icons/fa';
import muayThaiPic from '../../assets/muaythai-spur.png';
import spurlogo from "../../assets/Spur_Logo.png"; // Fallback profile picture
import './eventdetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        const eventData = await getEvent(id);
        setEvent(eventData);

        if (eventData.createdBy) {
          const organizerData = await getUser(eventData.createdBy);
          setOrganizer(organizerData);
        }
      } catch (error) {
        console.error('Error fetching event or organizer details:', error);
      }
    }
    fetchEventDetails();
  }, [id]);

  if (!event) return <div>Loading...</div>;

  const getTagDetails = (type) => {
    switch (type) {
      case 'Recreation':
        return { backgroundColor: '#EBBF23', color: '#fff', icon: <FaRunning /> };
      case 'Social':
        return { backgroundColor: '#00BB13', color: '#fff', icon: <FaSlideshare /> };
      case 'Education':
        return { backgroundColor: '#FB6464', color: '#fff', icon: <FaGraduationCap /> };
      default:
        return { backgroundColor: '#ccc', color: '#000', icon: null };
    }
  };

  const tagDetails = getTagDetails(event.type);

  return (
    <div className="event-details-container">
      <button className="event-back-button" onClick={() => navigate(-1)}><FaArrowLeft /></button>
      <h1 className="event-details-title">{event.title}</h1>
      <p className="event-details-date-location">
        {new Date(event.startTime).toLocaleDateString()}, {new Date(event.startTime).toLocaleTimeString()} - {new Date(event.endTime).toLocaleTimeString()} | {event.location}
      </p>
      <div className="event-details-organizer-row">
        <img
          src={organizer?.profilePicture ? `https://spur-profile-pictures.s3.amazonaws.com/${organizer.profilePicture}` : spurlogo}
          alt="Organizer"
          className="organizer-profile-picture"
        />
        <span className="event-details-organizer-name">
          {organizer ? organizer.name : 'Unknown Organizer'}
        </span>
        <button className="event-details-button">Sign up!</button>
        <FaRegBookmark className="event-details-bookmark-icon" />
      </div>
      <p className="event-details-description">{event.description}</p>
      <div className="event-details-tags">
        <span className="event-details-tag" style={{ backgroundColor: tagDetails.backgroundColor, color: tagDetails.color }}>
          {tagDetails.icon} {event.type}
        </span>
        <span className="event-details-tag" style={{ backgroundColor: tagDetails.backgroundColor, color: tagDetails.color }}>
          <FaUsers /> {event.attendees}
        </span>
        <span className="event-details-tag" style={{ backgroundColor: tagDetails.backgroundColor, color: tagDetails.color }}>
          {event.frequency}
        </span>
      </div>
      <div className="event-details-images">
        <img src={event.image1 || muayThaiPic} alt="Event" className="event-details-image" />
        <img src={event.image2 || muayThaiPic} alt="Event" className="event-details-image" />
      </div>
    </div>
  );
};

export default EventDetails;
