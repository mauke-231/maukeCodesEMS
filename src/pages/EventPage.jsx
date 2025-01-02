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
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching events:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, [user, navigate]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Events</h1>
            {/* Render events */}
        </div>
    );
};

export default EventPage;