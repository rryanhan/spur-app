import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import { getEvents } from '../../api'; // Import your API function to fetch events

const containerStyle = {
  width: '100%',
  height: '100vh', // Full viewport height
};

const center = {
  lat: 49.2550, // UBC's latitude
  lng: -123.2460 // UBC's longitude
};

const Map = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={14}>
      {events.map((event, index) => (
        <Marker
          key={index}
          position={{
            lat: event.location.coordinates.lat,
            lng: event.location.coordinates.lng
          }}
          onClick={() => setSelectedEvent(event)}
        />
      ))}

      {selectedEvent && (
        <InfoWindow
          position={{
            lat: selectedEvent.location.coordinates.lat,
            lng: selectedEvent.location.coordinates.lng
          }}
          onCloseClick={() => setSelectedEvent(null)}
        >
          <div>
            <h3>{selectedEvent.title}</h3>
            <p>{selectedEvent.description}</p>
            <p><strong>Time:</strong> {new Date(selectedEvent.startTime).toLocaleString()}</p>
            <p><strong>Location:</strong> {selectedEvent.placeName || selectedEvent.location.address}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default Map;
