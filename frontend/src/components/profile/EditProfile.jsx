// EditProfile.jsx
import React, { useState } from 'react';
import { updateUser } from '../../api'; // API call for updating user

function EditProfile({ user, setIsEditing }) {
  const [form, setForm] = useState({
    name: user.name,
    bio: user.bio,
    profilePicture: user.profilePicture,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profilePicture: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem('user');
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      await updateUser(userId, form);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Bio:</label>
        <textarea name="bio" value={form.bio} onChange={handleChange} required />
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" onChange={handleFileChange} />
        {form.profilePicture && <img src={form.profilePicture} alt="Profile Preview" />}
      </div>
      <button type="submit">Save Changes</button>
      <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
    </form>
  );
}

export default EditProfile;
