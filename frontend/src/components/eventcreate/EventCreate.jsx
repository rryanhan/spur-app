// CreateEventModal.jsx
import React, { useState } from 'react';
import { createEvent } from '../../api'; // Import the API function
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
    frequency: '' // Initialize with an empty string
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { ...form, attendees: 0 }; // Set attendees to 0 by default
    console.log("Form data before submission:", eventData); // Log form data
    try {
      await createEvent(eventData);
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
        <h2>Create Event</h2>
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
            <label>Event Start Date & Time</label>
            <input
              type="datetime-local"
              name="startTime"
              value={form.startTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Event End Date & Time</label>
            <input
              type="datetime-local"
              name="endTime"
              value={form.endTime}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Event Type</label>
            <input
              type="text"
              name="type"
              placeholder="Enter event type"
              value={form.type}
              onChange={handleChange}
              required
            />
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
            <input
              type="text"
              name="frequency"
              placeholder="Event frequency (e.g., One-time, Weekly)"
              value={form.frequency}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="submit-button">Create Event</button>
        </form>
      </div>
    </div>
  );
};

export default EventCreate;
