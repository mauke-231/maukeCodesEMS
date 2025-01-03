import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../UserContext';

const Header = () => {
    const { user, logout } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <header className="bg-red-600 text-white shadow-lg">
            <nav className="container mx-auto px-4 py-4">
                <ul className="flex justify-between items-center">
                    <div className="flex gap-6">
                        <li><Link to="/events" className="hover:text-red-200">Events</Link></li>
                        <li><Link to="/calendar" className="hover:text-red-200">Calendar</Link></li>
                        {!user && (
                            <>
                                <li><Link to="/login" className="hover:text-red-200">Login</Link></li>
                                <li><Link to="/register" className="hover:text-red-200">Register</Link></li>
                            </>
                        )}
                        {user && (
                            <>
                                <li><Link to="/my-rsvps" className="hover:text-red-200">My RSVPs</Link></li>
                                <li><button onClick={handleLogout} className="hover:text-red-200">Logout</button></li>
                            </>
                        )}
                    </div>
                </ul>
            </nav>
        </header>
    );
};

export default Header;