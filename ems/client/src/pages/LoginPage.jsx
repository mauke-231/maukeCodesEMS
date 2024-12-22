import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [formData, setFormData] = useState({
        email: 'admin1@gmail.com',  // preset with test credentials
        password: 'admin1',
        isAdmin: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            console.log('Attempting login...'); // Debug log
            const response = await fetch('https://campus-backend-oxyd.onrender.com/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log('Response:', data); // Debug log
            
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    // If you're seeing a white screen, this will help debug
    console.log('Component rendering'); // Debug log

    return (
        <div>
            <nav style={{ backgroundColor: '#DC3545', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a>
                    <a href="/events" style={{ color: 'white', textDecoration: 'none' }}>Events</a>
                    <a href="/calendar" style={{ color: 'white', textDecoration: 'none' }}>Calendar</a>
                    <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a>
                    <a href="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</a>
                </div>
            </nav>

            <div style={{ padding: '2rem' }}>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="Email"
                            style={{ 
                                padding: '0.5rem',
                                width: '200px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                            placeholder="Password"
                            style={{ 
                                padding: '0.5rem',
                                width: '200px',
                                border: '1px solid #ccc',
                                borderRadius: '4px'
                            }}
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={loading}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#DC3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
