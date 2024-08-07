import React from 'react';
import Explore from './Explore'; // Adjust path if needed
import './explorebottomsheet.css';

const ExploreBottomSheet = () => {
  return (
    <div className="bottom-sheet">
      <div className="bottom-sheet-content">
        <Explore />
      </div>
    </div>
  );
};

export default ExploreBottomSheet;
