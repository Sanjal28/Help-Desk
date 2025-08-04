import axios from 'axios'

const API_URL = 'http://localhost:5000/api/superagent/'

// Get all tickets
const getAllTickets = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + 'tickets', config)
  return response.data
}

// Get analytics
const getAnalytics = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  const response = await axios.get(API_URL + 'analytics', config)
  return response.data
}

// Add a note to a ticket
const addNote = async (ticketId, noteText, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(
        API_URL + `tickets/${ticketId}/notes`, 
        { text: noteText }, 
        config
    )
    return response.data
}

// Close a ticket
const closeTicket = async (ticketId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.put(API_URL + `tickets/${ticketId}/close`, {}, config)
    return response.data
}


const superAgentService = {
  getAllTickets,
  getAnalytics,
  addNote,
  closeTicket
}

export default superAgentService