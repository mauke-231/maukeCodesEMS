/* eslint-disable no-unused-vars */
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import CalendarView from './pages/CalendarView';
import EventPage from './pages/EventPage';
import CreateEvent from './pages/CreateEvent';
import Header from './pages/Header';
import { UserProvider } from './UserContext';
import ProtectedRoute from './components/ProtectedRoute';

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
                    <Route path="/events" element={<EventPage />} />
                    <Route path="/create-event" element={
                        <ProtectedRoute>
                            <CreateEvent />
                        </ProtectedRoute>
                    } />
                </Routes>
            </Router>
        </UserProvider>
    );
}

export default App;