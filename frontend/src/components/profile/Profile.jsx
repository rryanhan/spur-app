// Profile.jsx
import React, { useState, useEffect } from 'react';
import Authentication from '../authentication/Authentication';
import { getUser } from '../../api'; // Assuming there's an API call to fetch the current user

function Profile() {
  const [user, setUser] = useState(null);


  return (
    <div>

        <Authentication />

    </div>
  );
}

export default Profile;
