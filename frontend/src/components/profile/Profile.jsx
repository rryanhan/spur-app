import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser } from '../../api';
import EditProfile from './EditProfile';
import spurlogo from "../../assets/Spur_Logo.png"; // Fallback image if no profile picture is available
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = sessionStorage.getItem('user');
      if (!token) {
        navigate('/authentication');
        return;
      }

      try {
        const userId = JSON.parse(atob(token.split('.')[1])).id;
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/authentication');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    navigate('/authentication');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      {isEditing ? (
        <EditProfile user={user} setIsEditing={setIsEditing} />
      ) : (
        <>
          <div className="profile-picture-container">
            <img
              src={user.profilePicture ? `https://spur-profile-pictures.s3.amazonaws.com/${user.profilePicture}` : spurlogo}
              alt="Profile"
              className="profile-picture"
            />
          </div>
          <h1 className="username">{user.name}</h1>
          <p className="bio">{user.bio}</p>
          <button className="edit-profile-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Profile;
