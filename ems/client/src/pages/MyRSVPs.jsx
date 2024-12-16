import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function MyRSVPs() {
    const [rsvpEvents, setRsvpEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchMyRSVPs();
    }, []);

    const fetchMyRSVPs = async () => {
        try {
            const response = await fetch('http://localhost:4000/my-rsvps', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error);
            
            setRsvpEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCancelRSVP = async (eventId) => {
        // First check if the event is in the past
        const event = rsvpEvents.find(e => e._id === eventId);
        if (new Date(event.eventDate) < new Date()) {
            setError("Cannot cancel RSVP for past events");
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/events/${eventId}/rsvp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to cancel RSVP');
            }

            fetchMyRSVPs();
        } catch (err) {
            setError(err.message);
            console.error('Error canceling RSVP:', err);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">My RSVPs</h1>
            
            {rsvpEvents.length === 0 ? (
                <div className="text-center text-gray-500">
                    You haven't RSVP'd to any events yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rsvpEvents.map(event => (
                        <div key={event._id} className="bg-white rounded-lg shadow-md p-4">
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-2">
                                📅 {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
                            </p>
                            <p className="text-gray-600 mb-2">📍 {event.location}</p>
                            <div className="flex justify-between items-center mt-4">
                                <Link 
                                    to={`/events/${event._id}`}
                                    className="text-red-600 hover:text-red-700"
                                >
                                    View Details
                                </Link>
                                <button
                                    onClick={() => handleCancelRSVP(event._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    Cancel RSVP
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 