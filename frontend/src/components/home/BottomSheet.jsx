// BottomSheet.jsx
import React, { useState } from 'react';
import './bottomsheet.css'; // Import your CSS file

const BottomSheet = ({ children, initialSnap = 1, snapPoints = ['25%', '50%', '100%'] }) => {
  const [snapIndex, setSnapIndex] = useState(initialSnap);

  const handleDrag = (index) => {
    if (index >= 0 && index < snapPoints.length) {
      setSnapIndex(index);
    }
  };

  return (
    <div className="bottom-sheet" style={{ bottom: snapPoints[snapIndex] }}>
      <div className="bottom-sheet-handle" onClick={() => handleDrag(snapIndex === 0 ? 1 : 0)}>
        <span className="handle-indicator"></span>
      </div>
      <div className="bottom-sheet-content">{children}</div>
    </div>
  );
};

export default BottomSheet;
