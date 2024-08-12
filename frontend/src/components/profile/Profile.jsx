// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, uploadPhoto, deletePhoto } from '../../api';
import EditProfile from './EditProfile';
import spurlogo from "../../assets/Spur_Logo.png";
import addPhotoIcon from "../../assets/addphoto.png"; // Import the new + button image
import { FaInstagram } from "react-icons/fa";
import './profile.css';

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photos, setPhotos] = useState([]);
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
        setPhotos(userData.photos || []); // Initialize photos from user data
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/authentication');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await uploadPhoto(user._id, file);
        setPhotos([...photos, response.photoUrl]); // Update photos state
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
    }
  };

  const handlePhotoDelete = async (photoKey) => {
    try {
      await deletePhoto(user._id, photoKey);
      setPhotos(photos.filter((photo) => photo !== photoKey)); // Update photos state
    } catch (error) {
      console.error('Failed to delete photo:', error);
    }
  };

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
          <div className="username-instagram">
            <h1 className="username">{user.name}</h1>
            {user.instagramHandle && (
              <a
                href={`https://www.instagram.com/${user.instagramHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-icon"
              >
                <FaInstagram />
              </a>
            )}
          </div>
          <p className="bio">{user.bio}</p>
          <div className="photos-container">
            {photos.map((photo, index) => (
              <div key={index} className="photo-item">
                <img src={`https://spur-profile-pictures.s3.amazonaws.com/${photo}`} alt={`User Photo ${index + 1}`} />
                <button onClick={() => handlePhotoDelete(photo)} className="delete-button">Delete</button>
              </div>
            ))}
            {photos.length < 9 && (
              <div className="photo-item add-photo-button">
                <label htmlFor="photo-upload-input">
                  <img src={addPhotoIcon} alt="Add Photo" className="add-photo-icon" />
                </label>
                <input id="photo-upload-input" type="file" onChange={handlePhotoUpload} />
              </div>
            )}
          </div>
          <div className="button-row">
            <button className="profile-button" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
            <button className="profile-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Profile;
