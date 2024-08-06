import React, { useState } from 'react';
import { updateUser, uploadProfilePicture } from '../../api'; // API call for updating user and uploading profile picture
import './editprofile.css'; // Import your CSS file

function EditProfile({ user, setIsEditing }) {
  const [form, setForm] = useState({
    name: user.name || '',
    bio: user.bio || '',
    profilePicture: user.profilePicture || '',
    instagramHandle: user.instagramHandle || '', // Include Instagram handle
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await uploadProfilePicture(file);
        setForm({ ...form, profilePicture: response.key });
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('user');
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const updatedFields = {};

      if (form.name !== user.name) updatedFields.name = form.name;
      if (form.bio !== user.bio) updatedFields.bio = form.bio;
      if (form.profilePicture !== user.profilePicture) updatedFields.profilePicture = form.profilePicture;
      if (form.instagramHandle !== user.instagramHandle) updatedFields.instagramHandle = form.instagramHandle;

      if (Object.keys(updatedFields).length > 0) {
        await updateUser(userId, updatedFields);
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        alert('No changes made.');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />
      </div>
      <div>
        <label>Bio:</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} />
      </div>
      <div>
        <label>Instagram Handle:</label>
        <input type="text" name="instagramHandle" value={form.instagramHandle} onChange={handleChange} />
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" onChange={handleFileChange} />
        {form.profilePicture && (
          <img
            src={`https://spur-profile-pictures.s3.amazonaws.com/${form.profilePicture}`}
            alt="Profile Preview"
            className="profile-picture-preview"
          />
        )}
      </div>
      <div>
        <button type="submit" className="form-button save-button">Save Changes</button>
        <button type="button" className="form-button cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
      </div>
    </form>
  );
}

export default EditProfile;
