/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import CalendarView from './pages/CalendarView';
import EventPage from './pages/EventPage'; // Ensure this page exists
import Header from './pages/Header';
import { UserProvider } from './UserContext';

function App() {
    return (
        <UserProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/calendar" element={<CalendarView />} />
                    <Route path="/events" element={<EventPage />} /> {/* Ensure this route exists */}
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;
