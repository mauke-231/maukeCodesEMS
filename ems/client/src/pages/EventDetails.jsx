import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function EventDetail() {
    const { id } = useParams();
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [rsvpStatus, setRsvpStatus] = useState(false);

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const fetchEventDetails = async () => {
        try {
            const response = await fetch(`https://campus-backend-oxyd.onrender.com/events/${id}`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (!response.ok) throw new Error(data.error);
            
            setEvent(data);
            setRsvpStatus(data.attendees?.some(attendeeId => attendeeId === user?.id));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getEventStatus = (event) => {
        const now = new Date();
        const eventDate = new Date(event.eventDate);
        
        if (eventDate < now) {
            return { text: 'Past Event', color: 'text-gray-500' };
        }
        if (event.spotsRemaining === 0) {
            return { text: 'Fully Booked', color: 'text-red-500' };
        }
        return { text: 'Spots Available', color: 'text-green-500' };
    };

    const handleRSVP = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const response = await fetch(`http://localhost:4000/events/${id}/rsvp`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to update RSVP');
            }

            setRsvpStatus(!rsvpStatus);
            fetchEventDetails();
        } catch (err) {
            setError(err.message);
            console.error('RSVP error:', err);
        }
    };

    if (loading) return <div className="text-center p-4">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;
    if (!event) return <div className="text-center p-4">Event not found</div>;

    const status = getEventStatus(event);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                {event.image && (
                    <img 
                        src={event.image} 
                        alt={event.title} 
                        className="w-full h-64 object-cover"
                    />
                )}
                
                <div className="p-6">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm mb-4 ${status.color} bg-opacity-10`}>
                        {status.text}
                    </div>

                    <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Date:</span>{' '}
                                {new Date(event.eventDate).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Time:</span>{' '}
                                {event.eventTime}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Location:</span>{' '}
                                {event.location}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Category:</span>{' '}
                                {event.category}
                            </p>
                        </div>
                        
                        <div>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Organized by:</span>{' '}
                                {event.organizedBy}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Price:</span>{' '}
                                {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Capacity:</span>{' '}
                                {event.capacity} people
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-semibold">Spots Remaining:</span>{' '}
                                <span className={event.spotsRemaining === 0 ? 'text-red-500' : 'text-green-500'}>
                                    {event.spotsRemaining} spots
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                    </div>

                    {!user?.isAdmin && (
                        <button
                            onClick={handleRSVP}
                            className={`w-full py-2 px-4 rounded ${
                                rsvpStatus 
                                    ? 'bg-gray-500 hover:bg-gray-600'
                                    : 'bg-red-600 hover:bg-red-700'
                            } text-white transition duration-200`}
                        >
                            {rsvpStatus ? 'Cancel RSVP' : 'RSVP'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
