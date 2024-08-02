import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

const Authentication = () => {
  const [activeComponent, setActiveComponent] = useState('login');

  return (
    <div className="authentication-container">
      {activeComponent === 'login' ? (
        <Login setActive={setActiveComponent} />
      ) : (
        <Signup setActive={setActiveComponent} />
      )}
    </div>
  );
};

export default Authentication;
