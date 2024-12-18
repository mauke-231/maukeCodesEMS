import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data);
                navigate('/');
            } else {
                setError(data.error || 'Wrong credentials');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Error during login. Please try again.');
        }
    }

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-red-600 mb-6">Login</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
                    >
                        Login
                    </button>
                </form>
                <p className="mt-4 text-center text-gray-600">
                    {"Don't have an account?"}{' '}
                    <Link to="/register" className="text-red-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}
