/* eslint-disable no-unused-vars */
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

export default function CreateEvent() {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Other',
        eventDate: '',
        eventTime: '',
        location: '',
        ticketPrice: 0,
        organizedBy: '',
        capacity: 1
    });

    const categories = ['Academic', 'Social', 'Sports', 'Other'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Include the user's token
                },
                credentials: 'include',
                body: JSON.stringify({
                    ...formData,
                    capacity: parseInt(formData.capacity),
                    ticketPrice: parseInt(formData.ticketPrice)
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Event creation failed');
            }

            navigate('/events');
        } catch (error) {
            console.error('Error creating event:', error);
            setError(error.message || 'Event creation failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-8">
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-center text-red-600 mb-6">Create Event</h1>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Category:</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        >
                            {categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Date:</label>
                        <input
                            type="date"
                            name="eventDate"
                            value={formData.eventDate}
                            onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Time:</label>
                        <input
                            type="time"
                            name="eventTime"
                            value={formData.eventTime}
                            onChange={(e) => setFormData({ ...formData, eventTime: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Location:</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Ticket Price:</label>
                        <input
                            type="number"
                            name="ticketPrice"
                            value={formData.ticketPrice}
                            onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Organized By:</label>
                        <input
                            type="text"
                            name="organizedBy"
                            value={formData.organizedBy}
                            onChange={(e) => setFormData({ ...formData, organizedBy: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Capacity:</label>
                        <input
                            type="number"
                            name="capacity"
                            value={formData.capacity}
                            onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                            className="w-full p-2 border rounded focus:border-red-500 focus:outline-none"
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-200"
                    >
                        Create Event
                    </button>
                </form>
            </div>
        </div>
    );
}