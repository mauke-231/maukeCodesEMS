import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
//import { UserContext } from '../UserContext';

export default function EventsPage() {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    //const { user } = useContext(UserContext);

    const categories = ['All', 'Academic', 'Social', 'Sports', 'Other'];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:4000/events', {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                setEvents(data);
                setFilteredEvents(data);
            } else {
                throw new Error(data.message || 'Failed to fetch events');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Filter events based on search term and category
    useEffect(() => {
        let result = [...events];
        
        if (selectedCategory !== 'All') {
            result = result.filter(event => event.category === selectedCategory);
        }
        
        if (searchTerm) {
            result = result.filter(event => 
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredEvents(result);
    }, [searchTerm, selectedCategory, events]);

    if (loading) return <div className="text-center p-4">Loading events...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Search and Filter Section */}
            <div className="mb-8 space-y-4">
                <input
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:border-red-500"
                />
                
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full ${
                                selectedCategory === category
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                    <div key={event._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                        {event.image && (
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-48 object-cover"
                            />
                        )}
                        <div className="p-4">
                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                            <p className="text-gray-600 mb-2">{event.category}</p>
                            <p className="text-sm mb-2">
                                📅 {new Date(event.eventDate).toLocaleDateString()} at {event.eventTime}
                            </p>
                            <p className="text-sm mb-2">📍 {event.location}</p>
                            <p className="text-sm mb-4 line-clamp-3">{event.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-red-600 font-bold">
                                    {event.ticketPrice === 0 ? 'Free' : `$${event.ticketPrice}`}
                                </span>
                                <Link
                                    to={`/events/${event._id}`}
                                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center text-gray-500 mt-8">
                    No events found matching your criteria.
                </div>
            )}
        </div>
    );
}
