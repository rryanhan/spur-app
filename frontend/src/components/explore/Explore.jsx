// Explore.jsx
import React, { useState, useEffect } from 'react';
import { getEvents } from '../../api';
import { Link } from 'react-router-dom'; // Import Link from React Router
import './explore.css';
import muayThaiPic from '../../assets/muaythai-spur.png';
import { FaGraduationCap, FaRunning, FaSlideshare, FaUsers } from 'react-icons/fa';

const Explore = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadAllEvents() {
      const data = await getEvents();
      setEvents(data);
    }
    loadAllEvents();
  }, []);

  const formatEventTime = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const datePart = start.toLocaleDateString('en-US', options);
    const startClockTime = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    const endClockTime = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' });
    return `${datePart}, ${startClockTime} - ${endClockTime}`;
  };

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

  return (
    <div className="explore-container">
      <h2>Explore, For You!</h2>
      <div className="events-list">
        {events.map(event => {
          const tagDetails = getTagDetails(event.type);
          return (
            <Link to={`/event/${event._id}`} className="event-item-link">
              <div className="event-item">
                <div className="event-left">
                  <img className="event-pic" src={muayThaiPic} alt="Event" />
                  <img className="event-pic" src={muayThaiPic} alt="Event" />
                </div>
                <div className="event-right">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-tags">
                    <span className="event-tag" style={{ backgroundColor: tagDetails.backgroundColor, color: tagDetails.color }}>
                      {tagDetails.icon} {event.type}
                    </span>
                    <span className="event-tag" style={{ backgroundColor: tagDetails.backgroundColor, color: tagDetails.color }}>
                      <FaUsers /> {event.attendees}
                    </span>
                    <span className="event-tag" style={{ backgroundColor: tagDetails.backgroundColor, color: tagDetails.color }}>
                      {event.frequency}
                    </span>
                  </div>
                  <p className="event-time">{formatEventTime(event.startTime, event.endTime)}</p>
                  <p className="event-description">{event.description}</p>
                  <p className="event-location"><strong>Location:</strong> {event.location}</p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Explore;
