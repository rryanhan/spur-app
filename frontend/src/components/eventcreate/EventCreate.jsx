import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../api'; 
import { FaGraduationCap, FaRunning, FaSlideshare } from 'react-icons/fa';
import './eventcreate.css';

const EventCreate = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('user');
    if (!token) {
      alert('Create an account or login to host an event!');
      navigate('/authentication');
    }
  }, [navigate]);
  
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: '',
    location: '',
    frequency: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTypeChange = (selectedType) => {
    setForm({ ...form, type: selectedType });
  };

  const handleFrequencyChange = (selectedFrequency) => {
    setForm({ ...form, frequency: selectedFrequency });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('user');
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      await createEvent({ ...form, attendees: 0, createdBy: userId });
      alert('Event created successfully!');
      navigate('/'); // Navigate back to the home page after success
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="event-create-page">
      <h2>Host an Event!</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Title</label>
          <input
            type="text"
            name="title"
            placeholder="Enter event title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Description</label>
          <textarea
            name="description"
            placeholder="Enter event description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Time</label>
          <div className="datetime-group">
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
            <span>–</span>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <label>Event Type</label>
          <div className="button-group">
            <button
              type="button"
              className={`option-button ${form.type === 'Social' ? 'active' : ''}`}
              onClick={() => handleTypeChange('Social')}
            >
              <FaSlideshare /> Social
            </button>
            <button
              type="button"
              className={`option-button ${form.type === 'Recreation' ? 'active' : ''}`}
              onClick={() => handleTypeChange('Recreation')}
            >
              <FaRunning /> Recreation
            </button>
            <button
              type="button"
              className={`option-button ${form.type === 'Education' ? 'active' : ''}`}
              onClick={() => handleTypeChange('Education')}
            >
              <FaGraduationCap /> Education
            </button>
          </div>
        </div>
        <div className="form-group">
          <label>Event Location</label>
          <input
            type="text"
            name="location"
            placeholder="Enter event location"
            value={form.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Event Frequency</label>
          <div className="button-group">
            <button
              type="button"
              className={`option-button ${form.frequency === 'One-Time' ? 'active' : ''}`}
              onClick={() => handleFrequencyChange('One-Time')}
            >
              One-Time
            </button>
            <button
              type="button"
              className={`option-button ${form.frequency === 'Recurring' ? 'active' : ''}`}
              onClick={() => handleFrequencyChange('Recurring')}
            >
              Recurring
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">Create Event</button>
      </form>
    </div>
  );
};

export default EventCreate;
