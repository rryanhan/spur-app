import axios from "axios";

const URL = "https://spur-app.onrender.com/";

// Event-related API functions
export async function getEvents() {
  const response = await axios.get(`${URL}/events`);

  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

export async function getEvent(id) {
  const response = await axios.get(`${URL}/events/${id}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

export async function createEvent(event) {
  const response = await axios.post(`${URL}/events`, event);

  return response;
}

export async function updateEvent(id, event) {
  const response = await axios.put(`${URL}/events/${id}`, event);

  return response;
}

export async function deleteEvent(id) {
  const response = await axios.delete(`${URL}/events/${id}`);

  return response;
}

// User-related API functions
export async function getUser(id) {
  const response = await axios.get(`${URL}/users/${id}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return;
  }
}

export async function createUser(user) {
  const response = await axios.post(`${URL}/users`, user);

  return response;
}

export async function updateUser(id, user) {
  const response = await axios.put(`${URL}/users/${id}`, user);

  return response;
}

export async function loginUser(user) {
  const response = await axios.post(`${URL}/users/login`, user);
  return response.data;
}

// Profile picture-related API functions
export async function uploadProfilePicture(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await axios.post(`${URL}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Return the response from the server
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

export async function getProfilePicture(key) {
  try {
    const response = await axios.get(`${URL}/profile-picture/${key}`, {
      responseType: 'arraybuffer',
    });
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error retrieving profile picture:', error);
    throw error;
  }
}

// User photo-related API functions
export async function uploadPhoto(userId, file) {
  const formData = new FormData();
  formData.append('photo', file); // 'photo' should match the field name used in your multer configuration

  try {
    const response = await axios.post(`${URL}/users/${userId}/photos`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // Return the server response
  } catch (error) {
    console.error('Error uploading photo:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export async function deletePhoto(userId, photoKey) {
  try {
    const response = await axios.delete(`${URL}/users/${userId}/photos/${photoKey}`);
    return response.data; // Return the server response
  } catch (error) {
    console.error('Error deleting photo:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}
