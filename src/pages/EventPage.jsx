import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const EventPage = () => {
    const { user } = useContext(UserContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            if (!user) {
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                navigate('/login');
                return;
            }

            try {
                console.log('Fetching events...');
                const response = await fetch('https://campus-backend-oxyd.onrender.com/events', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch events');
                }
                
                const data = await response.json();
                console.log('Events fetched:', data);
                setEvents(data);
                setError(null);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user, navigate]);

    if (loading) return <div className="text-center p-4">Loading events...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event._id} className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                        <p className="text-gray-600 mb-4">{event.description}</p>
                        <div className="text-sm text-gray-500">
                            <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                            <p>Location: {event.location}</p>
                        </div>
                        <button 
                            onClick={() => navigate(`/events/${event._id}`)}
                            className="mt-4 bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EventPage;