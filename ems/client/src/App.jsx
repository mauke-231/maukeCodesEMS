/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import CalendarView from './pages/CalendarView';
import EventPage from './pages/EventPage';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import MyRSVPs from './pages/MyRSVPs'; // Import the MyRSVPs component
import Header from './pages/Header';
import { UserProvider, UserContext } from './UserContext';
import ProtectedRoute from './components/ProtectedRoute';

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
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials),
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            throw err;
        }
    };

    const logout = async () => {
        await fetch('http://localhost:4000/logout', {
            method: 'POST',
            credentials: 'include'
        });
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={user ? <EventPage /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/calendar" element={user ? <CalendarView /> : <Navigate to="/login" />} />
                    <Route path="/events" element={user ? <EventPage /> : <Navigate to="/login" />} />
                    <Route path="/events/:id" element={<EventDetails />} />
                    <Route path="/create-event" element={
                        <ProtectedRoute>
                            <CreateEvent />
                        </ProtectedRoute>
                    } />
                    <Route path="/my-rsvps" element={
                        <ProtectedRoute>
                            <MyRSVPs />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </UserContext.Provider>
    );
}

export default App;