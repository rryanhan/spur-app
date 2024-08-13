import React from 'react';
import { useParams } from 'react-router-dom';
import Explore from './Explore'; 
import EventDetails from './EventDetails'; 
import './explorebottomsheet.css';

const ExploreBottomSheet = () => {
  const { id } = useParams(); // Get the event ID from the URL

  return (
    <div className="bottom-sheet">
      <div className="bottom-sheet-content">
        {id ? <EventDetails /> : <Explore />} {/* Show EventDetails if an ID exists, otherwise show Explore */}
      </div>
    </div>
  );
};

export default ExploreBottomSheet;
