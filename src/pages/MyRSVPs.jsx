import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function MyRSVPs() {
    const { user } = useContext(UserContext);
    const [rsvpEvents, setRsvpEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyRSVPs = async () => {
            try {
                const response = await fetch('http://localhost:4000/my-rsvps', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    },
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

        if (user) {
            fetchMyRSVPs();
        }
    }, [user]);

    if (loading) return <div className="text-center p-4">Loading RSVP events...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center text-red-600 mb-6">My RSVP&apos;d Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rsvpEvents.map(event => (
                    <div key={event._id} className="bg-white rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-2">{event.title}</h2>
                        <p className="text-gray-700">{event.description}</p>
                        <Link to={`/events/${event._id}`} className="text-red-600 hover:underline">
                            View Details
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}