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
    const response = await axios.put(`${URL}/events`, event)

    return response
    

}

export async function deleteEvent(id){
    const response = await axios.delete(`${URL}/events/${id}`)

    return response

}