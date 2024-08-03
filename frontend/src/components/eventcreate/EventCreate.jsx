import React, { useState } from 'react';
import { createEvent } from '../../api'; 
import { FaGraduationCap, FaRunning, FaSlideshare } from 'react-icons/fa';
import './eventcreate.css';

const EventCreate = ({ closeModal }) => {
  // State to hold form data
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: '',
    location: '',
    frequency: '' 
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle type selection
  const handleTypeChange = (selectedType) => {
    setForm({ ...form, type: selectedType });
  };

  // Handle frequency selection
  const handleFrequencyChange = (selectedFrequency) => {
    setForm({ ...form, frequency: selectedFrequency });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract the user ID from the token in sessionStorage
      const token = sessionStorage.getItem('user');
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      // Include the user ID in the event details
      await createEvent({ ...form, attendees: 0, createdBy: userId }); // Ensure attendees are set to 0
      alert('Event created successfully!');
      closeModal(); // Close the modal on success
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={closeModal}>X</button>
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
    </div>
  );
};

export default EventCreate;
