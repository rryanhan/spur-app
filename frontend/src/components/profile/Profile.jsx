// Profile.jsx
import React, { useState, useEffect } from 'react';
import Authentication from '../authentication/Authentication';
import { getUser } from '../../api'; // Assuming there's an API call to fetch the current user

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch the current user from the backend or local storage
    async function fetchUser() {
      const userData = await getUser(); // Replace with your actual method to get the current user
      setUser(userData);
    }

    fetchUser();
  }, []);

  return (
    <div>
      {user ? (
        <div className="profile-container">
          <h2>Profile</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <Authentication />
      )}
    </div>
  );
}

export default Profile;
