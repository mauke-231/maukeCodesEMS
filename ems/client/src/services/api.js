import axios from 'axios';

const API_URL = 'http://localhost:4000';

// Configure axios to include credentials
axios.defaults.withCredentials = true;

export const api = {
    // Auth endpoints
    register: (userData) => axios.post(`${API_URL}/register`, userData),
    login: (credentials) => axios.post(`${API_URL}/login`, credentials),
    logout: () => axios.post(`${API_URL}/logout`),
    
    // Event endpoints
    getAllEvents: () => axios.get(`${API_URL}/events`),
    getEventsByCategory: (category) => axios.get(`${API_URL}/events/category/${category}`),
    createEvent: (eventData) => axios.post(`${API_URL}/events`, eventData),
    updateEvent: (id, eventData) => axios.put(`${API_URL}/events/${id}`, eventData),
    deleteEvent: (id) => axios.delete(`${API_URL}/events/${id}`),
    
    // Profile endpoint
    getProfile: () => axios.get(`${API_URL}/profile`)
}; 