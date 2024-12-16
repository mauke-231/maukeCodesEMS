/* eslint-disable no-unused-vars */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './pages/Header';
import { UserContextProvider } from './UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateEvent from './pages/CreateEvent';
import EventPage from './pages/EventPage';
import EventDetails from './pages/EventDetails';
import MyRSVPs from './pages/MyRSVPs';
import CalendarView from './pages/CalendarView';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/events" element={<EventPage />} />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route 
              path="/my-rsvps" 
              element={
                <ProtectedRoute adminOnly={false}>
                  <MyRSVPs />
                </ProtectedRoute>
              } 
            />
            <Route path="/calendar" element={<CalendarView />} />
          </Routes>
        </div>
      </UserContextProvider>
    </BrowserRouter>
  );
}
