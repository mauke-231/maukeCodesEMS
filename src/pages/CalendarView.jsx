import { useState, useEffect, useContext } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useNavigate } from 'react-router-dom';
import enUS from 'date-fns/locale/en-US';
import { UserContext } from '../UserContext';

const locales = {
    'en-US': enUS
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales
});

const CalendarView = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchEvents();
    }, [navigate, user]);

    const fetchEvents = async () => {
        try {
            console.log('Fetching events...');
            const token = localStorage.getItem('token');
            const response = await fetch('https://campus-backend-oxyd.onrender.com/events', {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            console.log('Response data:', data);
            if (!response.ok) throw new Error(data.error || 'Failed to fetch events');

            const calendarEvents = data.map(event => {
                const dateTime = new Date(event.eventDate);
                const [hours, minutes] = event.eventTime.split(':');
                dateTime.setHours(parseInt(hours), parseInt(minutes));

                return {
                    id: event._id,
                    title: event.title,
                    start: dateTime,
                    end: dateTime,
                    category: event.category
                };
            });
            setEvents(calendarEvents);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEventClick = (event) => {
        navigate(`/events/${event.id}`);
    };

    // Custom event styling based on category
    const eventStyleGetter = (event) => {
        let backgroundColor = '#3174ad';
        switch (event.category) {
            case 'Academic':
                backgroundColor = '#1a73e8';
                break;
            case 'Social':
                backgroundColor = '#e67c73';
                break;
            case 'Sports':
                backgroundColor = '#33b679';
                break;
            case 'Other':
                backgroundColor = '#9e69af';
                break;
        }

        return {
            style: {
                backgroundColor,
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    if (loading) return <div className="text-center p-4">Loading calendar...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Event Calendar</h1>
            <div style={{ height: '600px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={handleEventClick}
                    eventPropGetter={eventStyleGetter}
                    views={['month', 'week', 'day']}
                    defaultView="month"
                />
            </div>
        </div>
    );
};

export default CalendarView;
