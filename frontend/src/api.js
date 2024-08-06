import axios from "axios"

const URL = "http://localhost:3500"


export async function getEvents(){
    const response = await axios.get(`${URL}/events`)

    if (response.status === 200){
        return response.data
    } else {
        return
    }

}

export async function getEvent(id){
    const response = await axios.get(`${URL}/events/${id}`)

    if (response.status === 200){
        return response.data
    } else {
        return
    }
}

export async function createEvent(event){
    const response = await axios.post(`${URL}/events`, event)

    return response

}

export async function updateEvent(id, event){
    const response = await axios.put(`${URL}/events/${id}`, event)

    return response
    

}

export async function deleteEvent(id){
    const response = await axios.delete(`${URL}/events/${id}`)

    return response

}


export async function getUser(id){
    const response = await axios.get(`${URL}/users/${id}`)

    if (response.status === 200){
        return response.data
    } else {
        return
    }
}

export async function createUser(user){
    const response = await axios.post(`${URL}/users`, user)

    return response

}

export async function updateUser(id, user){
    const response = await axios.put(`${URL}/users/${id}`, user)

    return response
}

export async function loginUser(user) {
    const response = await axios.post(`${URL}/users/login`, user);
    return response.data;
}

export async function uploadProfilePicture(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post(`${URL}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
        responseType: 'arraybuffer'
      });
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error retrieving profile picture:', error);
      throw error;
    }
  }