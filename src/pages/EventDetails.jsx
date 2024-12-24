import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function EventDetails() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rsvpSuccess, setRsvpSuccess] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost:4000/events/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
                    credentials: 'include'
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error);

                setEvent(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, user, navigate]);

    const handleRsvp = async () => {
        try {
            const response = await fetch(`http://localhost:4000/events/${id}/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                credentials: 'include'
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'RSVP failed');
            }

            setRsvpSuccess('RSVP successful!');
        } catch (error) {
            console.error('Error during RSVP:', error);
            setError(error.message || 'RSVP failed. Please try again.');
        }
    };

    if (loading) return <div className="text-center p-4">Loading event details...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-red-600 mb-6">{event.title}</h1>
                <p className="text-gray-700 mb-4">{event.description}</p>
                <p className="text-gray-700 mb-4">Category: {event.category}</p>
                <p className="text-gray-700 mb-4">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
                <p className="text-gray-700 mb-4">Time: {event.eventTime}</p>
                <p className="text-gray-700 mb-4">Location: {event.location}</p>
                <p className="text-gray-700 mb-4">Organized By: {event.organizedBy}</p>
                <p className="text-gray-700 mb-4">Capacity: {event.capacity}</p>
                <p className="text-gray-700 mb-4">Ticket Price: ${event.ticketPrice}</p>
                {rsvpSuccess && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {rsvpSuccess}
                    </div>
                )}
                <button
                    onClick={handleRsvp}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
                >
                    RSVP
                </button>
            </div>
        </div>
    );
}