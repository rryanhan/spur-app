import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../api';

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
        const token = sessionStorage.getItem('user');
        if (!token) {
          navigate('/authentication');
          return;
        }
      
        try {
          // Decode the JWT token and extract the user ID
          const decodedToken = JSON.parse(atob(token.split('.')[1]));
          const userId = decodedToken.id; // Use the correct field name as per your token structure
          if (!userId) throw new Error('User ID not found in token');
      
          // Fetch the user data using the extracted user ID
          const userData = await getUser(userId);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          navigate('/authentication');
        }
    };

    fetchUserData();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default Profile;
