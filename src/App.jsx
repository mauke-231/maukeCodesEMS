import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from './pages/Header';
import EventPage from './pages/EventPage';
import EventDetails from './pages/EventDetails';
import CalendarView from './pages/CalendarView';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyRSVPs from './pages/MyRSVPs';
import { UserContext, UserProvider } from './UserContext';
import './App.css';

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:4000/profile', {
                    credentials: 'include'
                });
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    throw new Error('Failed to fetch profile');
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return (
        <UserProvider value={{ user, setUser }}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/events" element={<EventPage />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/my-rsvps" element={<MyRSVPs />} />
                    <Route path="*" element={<Navigate to="/events" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;