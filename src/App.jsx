import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Header from './Header';
import EventPage from './EventPage';
import EventDetails from './EventDetails';
import CalendarView from './CalendarView';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import MyRSVPs from './MyRSVPs';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('https://campus-backend-oxyd.onrender.com/profile', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                const data = await response.json();
                setUser(data);
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <UserProvider value={{ user, setUser }}>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/events" element={<EventPage />} />
                        <Route path="/events/:id" element={<EventDetails />} />
                        <Route path="/calendar" element={<CalendarView />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/my-rsvps" element={<MyRSVPs />} />
                        <Route path="/" element={<Navigate to="/events" />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
