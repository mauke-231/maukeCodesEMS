import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        isAdmin: false
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch('http://localhost:4000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Registration failed');
            }

            navigate('/login');
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-red-600 mb-6">Register</h1>
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
                            name="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Password:</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegisterPage;
